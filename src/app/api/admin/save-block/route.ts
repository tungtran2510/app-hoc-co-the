import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest, getAdminUserFromRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { generateUuid, isValidUuid } from '../../../../lib/uuid';

export async function POST(req: NextRequest) {
  const user = getAdminUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }


  try {
    const body = await req.json();

    // 1. HỖ TRỢ LƯU HÀNG LOẠT (BATCH SAVE): Cực kỳ ổn định và nhanh khi đổi thứ tự hoặc sắp xếp lại khối
    if (Array.isArray(body.blocks)) {
      const blocks = body.blocks;
      if (blocks.length === 0) {
        return NextResponse.json({ success: true, count: 0 });
      }

      const firstPageId = blocks[0]?.page_id;
      if (!firstPageId) {
        return NextResponse.json({ error: 'Thiếu page_id trong danh sách khối' }, { status: 400 });
      }

      let resolvedPageId = String(firstPageId).trim();
      if (!isValidUuid(resolvedPageId)) {
        const { data: pageData } = await supabase.from('pages').select('id').or(`id.eq.${resolvedPageId},slug.eq.${resolvedPageId}`).maybeSingle();
        if (!pageData) {
          return NextResponse.json({ error: `Không tìm thấy trang tương ứng (${resolvedPageId})` }, { status: 400 });
        }
        resolvedPageId = pageData.id;
      }

      // Kiểm tra quyền hạn nếu tài khoản là Giảng viên (instructor)
      if (user.role === 'instructor') {
        const allowed = user.allowed_topic_ids || [];
        if (!allowed.includes('*')) {
          const { data: pageRow } = await supabase.from('pages').select('topic_id').eq('id', resolvedPageId).single();
          if (!pageRow) {
            return NextResponse.json({ error: 'Không tìm thấy trang của bài học này' }, { status: 404 });
          }
          const tId = pageRow.topic_id;
          let isAllowed = allowed.includes(tId) || allowed.includes(String(tId));
          if (!isAllowed) {
            const { data: topicRow } = await supabase.from('topics').select('slug').eq('id', tId).maybeSingle();
            if (topicRow && allowed.includes(topicRow.slug)) {
              isAllowed = true;
            }
          }
          if (!isAllowed) {
            return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa chủ đề này' }, { status: 403 });
          }
        }
      }

      // 1. Chỉ cập nhật những khối thực sự thay đổi thứ tự (chỉ ghi id + sort_order)
      const validBlockIds = blocks
        .map((b: any) => String(b.id || '').trim())
        .filter((id: string) => isValidUuid(id));

      const { data: dbRows, error: fetchOrderErr } = await supabase
        .from('blocks')
        .select('id, sort_order')
        .in('id', validBlockIds);

      if (fetchOrderErr) {
        console.error('[Save Blocks Fetch Order Error]', fetchOrderErr);
        return NextResponse.json({ error: fetchOrderErr.message || 'Lỗi kiểm tra thứ tự khối' }, { status: 500 });
      }

      const dbSortMap = new Map((dbRows || []).map((r) => [r.id, r.sort_order]));

      const changedBlocks = blocks.filter((b: any, idx: number) => {
        const targetSort = typeof b.sort_order === 'number' ? b.sort_order : idx + 1;
        const currentSort = dbSortMap.get(b.id);
        return currentSort === undefined || currentSort !== targetSort;
      });

      if (changedBlocks.length === 0) {
        return NextResponse.json({ success: true, count: 0, message: 'Thứ tự không thay đổi' });
      }

      const updatePromises = changedBlocks.map((b: any, idx: number) => {
        const targetSort = typeof b.sort_order === 'number' ? b.sort_order : idx + 1;
        return supabase
          .from('blocks')
          .update({
            sort_order: targetSort,
            updated_at: new Date().toISOString(),
          })
          .eq('id', b.id);
      });

      const updateResults = await Promise.all(updatePromises);
      const firstError = updateResults.find((r) => r.error)?.error;
      if (firstError) {
        console.error('[Save Blocks Update Error]', firstError);
        return NextResponse.json({ error: firstError.message || 'Chưa lưu được thứ tự mới' }, { status: 500 });
      }

      try {
        const { clearDataCache } = await import('../../../../lib/data');
        clearDataCache();
        revalidatePath('/', 'layout');
      } catch {
        // Bỏ qua
      }

      return NextResponse.json({ success: true, count: changedBlocks.length });
    }

    const { block } = body;
    if (!block || typeof block !== 'object' || !block.page_id) {
      return NextResponse.json({ error: 'Dữ liệu khối không hợp lệ (thiếu page_id)' }, { status: 400 });
    }

    // 1. Chuẩn hóa page_id (bắt buộc phải là UUID hợp lệ trỏ tới bảng pages)
    let resolvedPageId = String(block.page_id).trim();
    if (!isValidUuid(resolvedPageId)) {
      const { data: pageData } = await supabase.from('pages').select('id').or(`id.eq.${resolvedPageId},slug.eq.${resolvedPageId}`).maybeSingle();
      if (!pageData) {
        return NextResponse.json({ error: `Không tìm thấy trang tương ứng (${resolvedPageId})` }, { status: 400 });
      }
      resolvedPageId = pageData.id;
    }

    // Kiểm tra quyền hạn nếu tài khoản là Giảng viên (instructor)
    if (user.role === 'instructor') {
      const allowed = user.allowed_topic_ids || [];
      if (!allowed.includes('*')) {
        const { data: pageRow } = await supabase.from('pages').select('topic_id').eq('id', resolvedPageId).single();
        if (!pageRow) {
          return NextResponse.json({ error: 'Không tìm thấy trang của bài học này' }, { status: 404 });
        }
        const tId = pageRow.topic_id;
        let isAllowed = allowed.includes(tId) || allowed.includes(String(tId));
        if (!isAllowed) {
          const { data: topicRow } = await supabase.from('topics').select('slug').eq('id', tId).maybeSingle();
          if (topicRow && allowed.includes(topicRow.slug)) {
            isAllowed = true;
          }
        }
        if (!isAllowed) {
          return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa chủ đề này' }, { status: 403 });
        }
      }
    }

    // 2. Chuẩn hóa block.id: nếu không phải UUID hợp lệ thì tạo mới
    const inputBlockId = block.id ? String(block.id).trim() : '';
    const finalBlockId = isValidUuid(inputBlockId) ? inputBlockId : generateUuid();

    // 3. Chống lưu đè (Concurrency check qua updated_at)
    if (inputBlockId && isValidUuid(inputBlockId)) {
      const { data: dbBlock } = await supabase
        .from('blocks')
        .select('updated_at')
        .eq('id', inputBlockId)
        .maybeSingle();

      if (dbBlock && dbBlock.updated_at && block.updated_at) {
        const dbTime = new Date(dbBlock.updated_at).getTime();
        const clientTime = new Date(block.updated_at).getTime();
        if (!isNaN(dbTime) && !isNaN(clientTime) && dbTime > clientTime + 1000) {
          return NextResponse.json(
            { error: 'Nội dung đã thay đổi, tải lại trang' },
            { status: 409 }
          );
        }
      }
    }

    const isFaq = block.type === 'faq';
    const isBooks = block.type === 'books';
    const payload = {
      id: finalBlockId,
      workspace_id: block.workspace_id || 'default',
      page_id: resolvedPageId,
      type: isFaq || isBooks ? 'text' : block.type,
      display_style: isFaq ? 'faq' : isBooks ? 'books' : block.display_style,
      data: isFaq
        ? { ...(block.data || {}), __kind: 'faq', __style: block.display_style || 'accordion' }
        : isBooks
        ? { ...(block.data || {}), __kind: 'books', __style: block.display_style || 'list' }
        : block.data || {},
      sort_order: block.sort_order ?? 0,
      is_visible: block.is_visible ?? true,
      updated_at: new Date().toISOString(),
    };

    const { error: saveError } = await supabase
      .from('blocks')
      .upsert(payload, { onConflict: 'id' });

    if (saveError) {
      console.error('[Save Block Error]', saveError);
      return NextResponse.json({ error: saveError.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    // 4. Sau khi lưu, đọc lại trực tiếp từ DB, không dùng bộ đệm
    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua
    }

    const { data: freshRow, error: fetchFreshErr } = await supabase
      .from('blocks')
      .select('*')
      .eq('id', finalBlockId)
      .single();

    if (fetchFreshErr || !freshRow) {
      return NextResponse.json({ error: 'Đã lưu nhưng không đọc lại được khối từ cơ sở dữ liệu' }, { status: 500 });
    }

    const { decodeBlockRow } = await import('../../../../lib/data');
    const decoded = decodeBlockRow(freshRow);
    return NextResponse.json({ success: true, block: decoded });
  } catch (err: any) {
    console.error('[Save Block Exception]', err);
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi lưu khối' }, { status: 500 });
  }
}
