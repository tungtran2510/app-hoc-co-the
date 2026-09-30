import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  try {
    const { pageId } = await req.json();
    if (!pageId) {
      return NextResponse.json({ error: 'Thiếu pageId' }, { status: 400 });
    }

    if (supabase) {
      const { error } = await supabase.from('pages').delete().eq('id', pageId);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, pageId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xóa trang' }, { status: 500 });
  }
}
