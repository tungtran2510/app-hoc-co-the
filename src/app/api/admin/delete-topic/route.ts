import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  try {
    const { topicId } = await req.json();
    if (!topicId) {
      return NextResponse.json({ error: 'Thiếu topicId' }, { status: 400 });
    }

    if (supabase) {
      const { error } = await supabase.from('topics').delete().eq('id', topicId);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, topicId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xóa chủ đề' }, { status: 500 });
  }
}
