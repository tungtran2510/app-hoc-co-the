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
    const { block } = await req.json();
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

    const { data: savedData, error } = await supabase
      .from('blocks')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.error('[Save Block Error]', error);
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua
    }

    const decoded = savedData && isFaq ? { ...savedData, type: 'faq', display_style: block.display_style || 'accordion', data: block.data || {} } : savedData && isBooks ? { ...savedData, type: 'books', display_style: block.display_style || 'list', data: block.data || {} } : savedData;
    return NextResponse.json({ success: true, block: decoded || { ...payload, ...(isFaq ? { type: 'faq', display_style: block.display_style, data: block.data } : {}), ...(isBooks ? { type: 'books', display_style: block.display_style, data: block.data } : {}) } });
  } catch (err: any) {
    console.error('[Save Block Exception]', err);
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi lưu khối' }, { status: 500 });
  }
}
