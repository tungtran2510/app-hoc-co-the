import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { isValidUuid } from '../../../../lib/uuid';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }

  try {
    const { topicId } = await req.json();
    if (!topicId) {
      return NextResponse.json({ error: 'Thiếu topicId' }, { status: 400 });
    }

    let targetId = String(topicId).trim();
    if (!isValidUuid(targetId)) {
      const { data: t } = await supabase.from('topics').select('id').eq('slug', targetId).maybeSingle();
      if (t) {
        targetId = t.id;
      } else {
        return NextResponse.json({ success: true, message: 'Chủ đề không tồn tại hoặc đã được xóa' });
      }
    }

    const { error } = await supabase.from('topics').delete().eq('id', targetId);
    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, topicId: targetId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
