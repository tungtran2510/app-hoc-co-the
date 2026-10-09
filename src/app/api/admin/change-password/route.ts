import { NextRequest, NextResponse } from 'next/server';
import {
  getAdminUserFromRequest,
  hashPassword,
  verifyPassword,
  rateLimit,
  getClientIp,
} from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  const user = getAdminUserFromRequest(req);
  if (!user) {
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

    // 1. Nếu là Super Admin (dùng master password từ ADMIN_PASSWORD)
    if (user.role === 'super_admin') {
      const masterPassword = process.env.ADMIN_PASSWORD;
      if (masterPassword && !verifyPassword(String(currentPassword || ''), masterPassword) && currentPassword !== masterPassword) {
        return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
      }
      return NextResponse.json(
        {
          error:
            'Mật khẩu chủ tối cao được quản lý an toàn qua biến môi trường ADMIN_PASSWORD trên Vercel. Vui lòng cập nhật trực tiếp tại Vercel Settings > Environment Variables và redeploy.',
        },
        { status: 400 }
      );
    }

    // 2. Nếu là Giảng viên / Admin chi nhánh (quản lý qua bảng riêng admin_accounts)
    const { data: acc, error: findErr } = await supabase
      .from('admin_accounts')
      .select('id, password_hash')
      .eq('phone', user.phone)
      .maybeSingle();

    if (findErr || !acc) {
      return NextResponse.json({ error: 'Không tìm thấy thông tin tài khoản' }, { status: 404 });
    }

    if (!verifyPassword(String(currentPassword || ''), acc.password_hash)) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không chính xác' }, { status: 400 });
    }

    // Lưu mật khẩu băm scrypt mới vào bảng admin_accounts
    const { error: updateErr } = await supabase
      .from('admin_accounts')
      .update({
        password_hash: hashPassword(newPassword.trim()),
        updated_at: new Date().toISOString(),
      })
      .eq('id', acc.id);

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message || 'Lỗi cập nhật mật khẩu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Đổi mật khẩu thành công' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu' }, { status: 500 });
  }
}
