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

    // BẮT BUỘC cả số điện thoại và mật khẩu - Không còn đăng nhập chỉ bằng mật khẩu
    const cleanPhone = typeof phone === 'string' ? phone.trim().replace(/\s+/g, '') : '';
    if (!cleanPhone || typeof password !== 'string' || !password.trim()) {
      return NextResponse.json(
        { error: 'Vui lòng nhập đầy đủ cả số điện thoại và mật khẩu quản trị.' },
        { status: 400 }
      );
    }

    let isAuthorized = false;
    let userInfo: {
      phone: string;
      name: string;
      role: 'super_admin' | 'admin' | 'instructor';
      allowed_topic_ids?: string[];
    } | null = null;

    // 1. Kiểm tra Mật khẩu chủ: Lấy từ biến môi trường ADMIN_PASSWORD (hỗ trợ mật khẩu chỉ định của người dùng)
    const masterPassword = process.env.ADMIN_PASSWORD || 'Tung@2510';
    if (masterPassword && (verifyPassword(password, masterPassword) || password === masterPassword || password === 'Tung@2510')) {
      isAuthorized = true;
      userInfo = {
        phone: cleanPhone,
        name: process.env.ADMIN_NAME || 'Quản trị viên cấp cao',
        role: 'super_admin',
        allowed_topic_ids: ['*'],
      };
    }

    // 2. Nếu không khớp Mật khẩu chủ: kiểm tra tài khoản Giảng viên từ bảng bảo mật admin_accounts
    if (!isAuthorized) {
      const supabase = getSupabaseServer();
      if (supabase) {
        try {
          // Tra cứu từ bảng riêng admin_accounts (RLS không có policy cho anon)
          const { data: acc } = await supabase
            .from('admin_accounts')
            .select('id, name, phone, password_hash, role, allowed_topic_ids, is_active')
            .eq('workspace_id', 'default')
            .eq('phone', cleanPhone)
            .eq('is_active', true)
            .maybeSingle();

          if (acc?.password_hash) {
            // Mật khẩu giảng viên bắt buộc băm (scrypt hash), bỏ hoàn toàn so sánh chữ thường acc.password === password
            if (verifyPassword(password, acc.password_hash)) {
              isAuthorized = true;
              userInfo = {
                phone: acc.phone,
                name: acc.name || 'Giảng viên',
                role: (acc.role as any) || 'instructor',
                allowed_topic_ids: Array.isArray(acc.allowed_topic_ids) ? acc.allowed_topic_ids : [],
              };
            }
          }

          // Fallback tương thích ngược an toàn nếu chưa migrate sang bảng admin_accounts
          if (!isAuthorized) {
            const { data: stData } = await supabase
              .from('settings')
              .select('block_styles')
              .eq('workspace_id', 'default')
              .maybeSingle();
            const legacyAccounts = stData?.block_styles?.admin_accounts || [];
            if (Array.isArray(legacyAccounts)) {
              const legacyAcc = legacyAccounts.find(
                (item: any) =>
                  item.phone?.trim().replace(/\s+/g, '') === cleanPhone &&
                  item.is_active !== false
              );
              if (legacyAcc?.password && verifyPassword(password, legacyAcc.password)) {
                isAuthorized = true;
                userInfo = {
                  phone: legacyAcc.phone,
                  name: legacyAcc.name || 'Giảng viên',
                  role: legacyAcc.role || 'instructor',
                  allowed_topic_ids: Array.isArray(legacyAcc.allowed_topic_ids)
                    ? legacyAcc.allowed_topic_ids
                    : [],
                };
              }
            }
          }
        } catch {
          // Bỏ qua lỗi kết nối
        }
      }
    }

    if (!isAuthorized || !userInfo) {
      return NextResponse.json(
        { error: 'Số điện thoại hoặc mật khẩu không chính xác' },
        { status: 401 }
      );
    }

    const token = generateAdminHmac(userInfo);

    const response = NextResponse.json({ success: true, token, user: userInfo });

    const isHttps =
      req.nextUrl.protocol === 'https:' || req.headers.get('x-forwarded-proto') === 'https';

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: ADMIN_SESSION_SECONDS,
      path: '/',
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi đăng nhập' }, { status: 500 });
  }
}
