import { NextRequest, NextResponse } from 'next/server';
import { generateAdminHmac, COOKIE_NAME } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  try {
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
      return NextResponse.json(
        { error: 'Chưa cài mật khẩu Admin trên máy chủ' },
        { status: 403 }
      );
    }

    if (password !== serverPassword) {
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
