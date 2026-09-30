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
    const { pageId } = await req.json();
    if (!pageId) {
      return NextResponse.json({ error: 'Thiếu pageId' }, { status: 400 });
    }

    let targetId = String(pageId).trim();
    if (!isValidUuid(targetId)) {
      const { data: p } = await supabase.from('pages').select('id').eq('slug', targetId).maybeSingle();
      if (p) {
        targetId = p.id;
      } else {
        return NextResponse.json({ success: true, message: 'Trang không tồn tại hoặc đã được xóa' });
      }
    }

    const { error } = await supabase.from('pages').delete().eq('id', targetId);
    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, pageId: targetId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
