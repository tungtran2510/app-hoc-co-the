import { NextRequest, NextResponse } from 'next/server';
import { generateAdminHmac, COOKIE_NAME } from '../../../../lib/authServer';

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const serverPassword = process.env.ADMIN_PASSWORD;

    // Nếu chưa cấu hình ADMIN_PASSWORD, cho phép mật khẩu mặc định khi dev local
    const isValid = serverPassword
      ? password === serverPassword
      : (password === '1234' || password === 'admin123');

    if (!isValid) {
      return NextResponse.json(
        { error: 'Mật khẩu quản trị không chính xác' },
        { status: 401 }
      );
    }

    const token = generateAdminHmac();
    const response = NextResponse.json({ success: true });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 ngày
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi đăng nhập' }, { status: 500 });
  }
}
