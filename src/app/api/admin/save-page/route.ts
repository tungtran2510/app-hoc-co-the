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
    const { page } = await req.json();
    if (!page || typeof page !== 'object') {
      return NextResponse.json({ error: 'Dữ liệu trang không hợp lệ' }, { status: 400 });
    }

    const inputPageId = page.id ? String(page.id).trim() : '';
    const hasValidPageId = isValidUuid(inputPageId);

    // 1. Tìm bản ghi hiện có nếu có id hợp lệ
    let existingPage: any = null;
    if (hasValidPageId) {
      const { data } = await supabase.from('pages').select('*').eq('id', inputPageId).maybeSingle();
      existingPage = data;
    }

    // Nếu không tìm thấy bằng id nhưng có topic_id và slug, thử tìm trang theo (topic_id, slug)
    if (!existingPage && page.slug && page.topic_id) {
      let tId = String(page.topic_id).trim();
      if (!isValidUuid(tId)) {
        const { data: topicData } = await supabase.from('topics').select('id').eq('slug', tId).maybeSingle();
        if (topicData) tId = topicData.id;
      }
      if (isValidUuid(tId)) {
        const { data: pageBySlug } = await supabase.from('pages').select('*').eq('topic_id', tId).eq('slug', String(page.slug).trim()).maybeSingle();
        if (pageBySlug) existingPage = pageBySlug;
      }
    }

    // Nếu là tạo mới hoàn toàn (không có existingPage), bắt buộc phải có title, slug, topic_id
    if (!existingPage) {
      if (!page.title?.trim() || !page.slug?.trim() || !page.topic_id) {
        return NextResponse.json({ error: 'Vui lòng điền đầy đủ tiêu đề, đường dẫn (slug) và chủ đề' }, { status: 400 });
      }
    }

    // 2. Chuẩn hóa topic_id (bắt buộc phải là UUID hợp lệ trỏ tới bảng topics)
    let resolvedTopicId = page.topic_id || existingPage?.topic_id;
    if (!resolvedTopicId) {
      return NextResponse.json({ error: 'Thiếu thông tin chủ đề của trang' }, { status: 400 });
    }
    resolvedTopicId = String(resolvedTopicId).trim();

    if (!isValidUuid(resolvedTopicId)) {
      const { data: topicData } = await supabase.from('topics').select('id, slug').eq('slug', resolvedTopicId).maybeSingle();
      if (!topicData) {
        return NextResponse.json({ error: `Không tìm thấy chủ đề tương ứng (${resolvedTopicId})` }, { status: 400 });
      }
      resolvedTopicId = topicData.id;
    }

    // Kiểm tra quyền hạn nếu tài khoản là Giảng viên (instructor)
    if (user.role === 'instructor') {
      const allowed = user.allowed_topic_ids || [];
      if (!allowed.includes('*')) {
        let isAllowed = allowed.includes(resolvedTopicId);
        if (!isAllowed) {
          const { data: tRow } = await supabase.from('topics').select('slug').eq('id', resolvedTopicId).maybeSingle();
          if (tRow && allowed.includes(tRow.slug)) {
            isAllowed = true;
          }
        }
        if (!isAllowed) {
          return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa chủ đề này' }, { status: 403 });
        }
      }
    }


    // 3. Chuẩn hóa page.id: BẮT BUỘC là UUID v4 hợp lệ
    let finalPageId = existingPage?.id;
    if (!finalPageId) {
      finalPageId = hasValidPageId ? inputPageId : generateUuid();
    }

    // 4. Ghép dữ liệu trang
    const finalSlug = (page.slug ? String(page.slug).trim() : existingPage?.slug) || '';
    const finalTitle = (page.title ? String(page.title).trim() : existingPage?.title) || '';

    const payload = {
      id: finalPageId,
      workspace_id: page.workspace_id || existingPage?.workspace_id || 'default',
      topic_id: resolvedTopicId,
      slug: finalSlug,
      title: finalTitle,
      summary: page.summary !== undefined ? (page.summary ? String(page.summary).trim() : null) : (existingPage?.summary ?? null),
      cover_url: page.cover_url !== undefined ? (page.cover_url ? String(page.cover_url).trim() : null) : (existingPage?.cover_url ?? null),
      sort_order: page.sort_order ?? existingPage?.sort_order ?? 0,
      is_visible: page.is_visible ?? existingPage?.is_visible ?? true,
      status: page.status || existingPage?.status || 'published',
      access_mode: page.access_mode !== undefined ? (page.access_mode || null) : (existingPage?.access_mode ?? null),
      updated_at: new Date().toISOString(),
    };

    const { data: savedData, error } = await supabase
      .from('pages')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.error('[Save Page Error]', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: `Đường dẫn tĩnh (slug) "${finalSlug}" đã được dùng trong chủ đề này. Vui lòng đổi slug khác.` }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
    } catch {
      // Bỏ qua
    }
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, page: savedData || payload });
  } catch (err: any) {
    console.error('[Save Page Exception]', err);
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi lưu trang' }, { status: 500 });
  }
}
