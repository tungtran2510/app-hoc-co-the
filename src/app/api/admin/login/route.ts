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

    const { password, phone } = await req.json();
    let serverPassword = process.env.ADMIN_PASSWORD;

    // Kiểm tra tài khoản riêng biệt của người dùng (SĐT: 0974248716, Mật khẩu: Tung@2510)
    const cleanPhone = typeof phone === 'string' ? phone.trim().replace(/\s+/g, '') : '';
    const isSpecialTungAccount =
      (cleanPhone === '0974248716' && password === 'Tung@2510') ||
      password === 'Tung@2510';

    // Ưu tiên mật khẩu quản trị lưu trong Supabase
    const supabase = getSupabaseServer();
    let isSupabaseValid = false;
    if (supabase) {
      try {
        const { data } = await supabase
          .from('settings')
          .select('admin_password, block_styles')
          .eq('workspace_id', 'default')
          .single();
        if (data?.admin_password) {
          serverPassword = data.admin_password;
        }
        // Kiểm tra trong danh sách admin_accounts nếu có
        const adminAccounts = data?.block_styles?.admin_accounts || [];
        if (cleanPhone && Array.isArray(adminAccounts)) {
          const matchedAcc = adminAccounts.find((acc: any) => acc.phone === cleanPhone);
          if (matchedAcc && password === 'Tung@2510') {
            isSupabaseValid = true;
          }
        }
      } catch {
        // Fallback sang biến môi trường
      }
    }

    let isAuthorized = isSpecialTungAccount || isSupabaseValid;

    if (!isAuthorized) {
      if (!serverPassword) {
        return NextResponse.json({ error: 'Chưa cài mật khẩu Admin trên máy chủ' }, { status: 403 });
      }
      if (typeof password === 'string' && verifyPassword(password, serverPassword)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Số điện thoại hoặc mật khẩu quản trị không chính xác' }, { status: 401 });
    }

    const token = generateAdminHmac();
    const userInfo = cleanPhone === '0974248716' || password === 'Tung@2510'
      ? { phone: '0974248716', name: 'Tùng Dinh Dưỡng', role: 'admin' }
      : { phone: cleanPhone || '', name: 'Quản trị viên', role: 'admin' };

    const response = NextResponse.json({ success: true, token, user: userInfo });

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
