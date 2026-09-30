import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (!newPassword || newPassword.trim().length < 4) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có tối thiểu 4 ký tự' }, { status: 400 });
    }

    // 1. Kiểm tra mật khẩu hiện tại
    let expectedPassword = process.env.ADMIN_PASSWORD;
    const { data: currentSettings } = await supabase
      .from('settings')
      .select('admin_password')
      .eq('workspace_id', 'default')
      .single();

    if (currentSettings?.admin_password) {
      expectedPassword = currentSettings.admin_password;
    }

    if (expectedPassword && currentPassword !== expectedPassword) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
    }

    // 2. Cập nhật mật khẩu mới vào cơ sở dữ liệu Supabase
    const { error } = await supabase
      .from('settings')
      .update({
        admin_password: newPassword.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('workspace_id', 'default');

    if (error) {
      return NextResponse.json({ error: error.message || 'Lỗi khi cập nhật mật khẩu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}
