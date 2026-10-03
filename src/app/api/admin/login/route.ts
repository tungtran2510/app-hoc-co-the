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

    // 1. Kiểm tra tài khoản Chủ sở hữu tối cao (SĐT: 0974248716, Mật khẩu: Tung@2510)
    const cleanPhone = typeof phone === 'string' ? phone.trim().replace(/\s+/g, '') : '';
    const isSpecialTungAccount =
      (cleanPhone === '0974248716' && password === 'Tung@2510') ||
      password === 'Tung@2510';

    let matchedInstructorAccount: any = null;

    // Lấy cấu hình và danh sách tài khoản từ Supabase
    const supabase = getSupabaseServer();
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

        // Kiểm tra danh sách tài khoản giảng viên con
        const adminAccounts = data?.block_styles?.admin_accounts || [];
        if (cleanPhone && Array.isArray(adminAccounts)) {
          const acc = adminAccounts.find(
            (item: any) =>
              item.phone?.trim().replace(/\s+/g, '') === cleanPhone &&
              item.is_active !== false
          );
          if (acc) {
            const isPassValid =
              (acc.password && verifyPassword(password, acc.password)) ||
              acc.password === password;
            if (isPassValid) {
              matchedInstructorAccount = acc;
            }
          }
        }
      } catch {
        // Fallback
      }
    }

    let isAuthorized = isSpecialTungAccount || !!matchedInstructorAccount;

    if (!isAuthorized) {
      if (serverPassword && typeof password === 'string' && verifyPassword(password, serverPassword)) {
        isAuthorized = true;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Số điện thoại hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    let userInfo: { phone: string; name: string; role: 'super_admin' | 'admin' | 'instructor'; allowed_topic_ids?: string[] };

    if (matchedInstructorAccount) {
      userInfo = {
        phone: matchedInstructorAccount.phone,
        name: matchedInstructorAccount.name || 'Giảng viên',
        role: matchedInstructorAccount.role || 'instructor',
        allowed_topic_ids: Array.isArray(matchedInstructorAccount.allowed_topic_ids)
          ? matchedInstructorAccount.allowed_topic_ids
          : [],
      };
    } else if (cleanPhone === '0974248716' || password === 'Tung@2510') {
      userInfo = {
        phone: '0974248716',
        name: 'Tùng Dinh Dưỡng',
        role: 'super_admin',
        allowed_topic_ids: ['*'],
      };
    } else {
      userInfo = {
        phone: cleanPhone || '',
        name: 'Quản trị viên',
        role: 'super_admin',
        allowed_topic_ids: ['*'],
      };
    }

    const token = generateAdminHmac(userInfo);

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
