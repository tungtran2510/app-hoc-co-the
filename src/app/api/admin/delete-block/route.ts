import { revalidatePath } from 'next/cache';
import { invalidatePublicContentCache } from '../../../../lib/cachedData';
import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest, getAdminUserFromRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { isValidUuid } from '../../../../lib/uuid';

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
    const { blockId } = await req.json();
    if (!blockId) {
      return NextResponse.json({ error: 'Thiếu blockId' }, { status: 400 });
    }

    const targetId = String(blockId).trim();
    if (!isValidUuid(targetId)) {
      return NextResponse.json({ success: true, message: 'Khối không tồn tại hoặc đã được xóa' });
    }

    // Kiểm tra quyền nếu là giảng viên
    if (user.role === 'instructor') {
      const allowed = user.allowed_topic_ids || [];
      if (!allowed.includes('*')) {
        const { data: blockRow } = await supabase.from('blocks').select('page_id').eq('id', targetId).maybeSingle();
        if (blockRow?.page_id) {
          const { data: pageRow } = await supabase.from('pages').select('topic_id').eq('id', blockRow.page_id).maybeSingle();
          if (pageRow?.topic_id) {
            const tId = pageRow.topic_id;
            let isAllowed = allowed.includes(tId) || allowed.includes(String(tId));
            if (!isAllowed) {
              const { data: topicRow } = await supabase.from('topics').select('slug').eq('id', tId).maybeSingle();
              if (topicRow && allowed.includes(topicRow.slug)) {
                isAllowed = true;
              }
            }
            if (!isAllowed) {
              return NextResponse.json({ error: 'Bạn không có quyền xóa khối trong chủ đề này' }, { status: 403 });
            }
          }
        }
      }
    }

    const { error } = await supabase.from('blocks').delete().eq('id', targetId);
    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
      invalidatePublicContentCache();
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, blockId: targetId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
