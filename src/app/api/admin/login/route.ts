import { NextRequest, NextResponse } from 'next/server';
import {
  generateAdminHmac,
  COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  verifyPassword,
  rateLimit,
  getClientIp,
} from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
    // Chặn dò mật khẩu: tối đa 8 lần / 10 phút cho mỗi địa chỉ IP
    if (!rateLimit(`login:${getClientIp(req)}`, 8, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Bạn nhập sai quá nhiều lần. Vui lòng thử lại sau 10 phút.' },
        { status: 429 }
      );
    }

    const { password } = await req.json();
    let serverPassword = process.env.ADMIN_PASSWORD;

    // Ưu tiên mật khẩu quản trị lưu trong Supabase
    const supabase = getSupabaseServer();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('settings')
          .select('admin_password')
          .eq('workspace_id', 'default')
          .single();
        if (data?.admin_password) {
          serverPassword = data.admin_password;
        }
      } catch {
        // Fallback sang biến môi trường
      }
    }

    if (!serverPassword) {
      return NextResponse.json({ error: 'Chưa cài mật khẩu Admin trên máy chủ' }, { status: 403 });
    }

    if (typeof password !== 'string' || !verifyPassword(password, serverPassword)) {
      return NextResponse.json({ error: 'Mật khẩu quản trị không chính xác' }, { status: 401 });
    }

    const token = generateAdminHmac();
    const response = NextResponse.json({ success: true, token });

    const isHttps =
      req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps, // HTTPS (bản thật) bật secure; localhost / IP LAN dùng HTTP vẫn hoạt động
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_SECONDS,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi đăng nhập' }, { status: 500 });
  }
}
