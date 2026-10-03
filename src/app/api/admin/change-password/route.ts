import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest, hashPassword, verifyPassword, rateLimit, getClientIp } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  if (!rateLimit(`chpw:${getClientIp(req)}`, 8, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Thao tác quá nhiều lần, thử lại sau ít phút' }, { status: 429 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }

  try {
    const { currentPassword, newPassword } = await req.json();

    if (typeof newPassword !== 'string' || newPassword.trim().length < 8) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có tối thiểu 8 ký tự' }, { status: 400 });
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

    if (expectedPassword && !verifyPassword(String(currentPassword || ''), expectedPassword)) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
    }

    // 2. Lưu mật khẩu mới dưới dạng đã băm (scrypt + muối)
    const { error } = await supabase
      .from('settings')
      .update({
        admin_password: hashPassword(newPassword.trim()),
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
