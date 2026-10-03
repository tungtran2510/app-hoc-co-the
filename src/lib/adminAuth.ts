/**
 * Quản lý trạng thái Admin phía Client
 * Mọi xác thực bảo mật được xử lý qua Cookie HTTPOnly tại Server Route /api/admin/*
 */

export interface AdminStatus {
  isAdmin: boolean;
  supabaseOk: boolean;
}

export function getAdminTokenClient(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('app_admin_token') || '';
}

export async function checkAdminStatus(): Promise<AdminStatus> {
  if (typeof window === 'undefined') return { isAdmin: false, supabaseOk: false };
  try {
    const token = getAdminTokenClient();
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-admin-token'] = token;
    }
    const res = await fetch('/api/admin/me', { headers, cache: 'no-store' });
    if (!res.ok) return { isAdmin: false, supabaseOk: false };
    const data = await res.json();
    return {
      isAdmin: Boolean(data.isAdmin),
      supabaseOk: Boolean(data.supabase_ok),
    };
  } catch {
    return { isAdmin: false, supabaseOk: false };
  }
}

export async function checkIsAdminClient(): Promise<boolean> {
  const status = await checkAdminStatus();
  return status.isAdmin;
}

export async function loginAdmin(
  password: string,
  phone?: string
): Promise<{ success: boolean; error?: string; user?: { phone: string; name: string; role: string } }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, phone: phone?.trim() || undefined }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Mật khẩu quản trị không chính xác' };
    }
    const data = await res.json().catch(() => ({}));
    if (data.token && typeof window !== 'undefined') {
      localStorage.setItem('app_admin_token', data.token);
    }
    if (data.user && typeof window !== 'undefined') {
      localStorage.setItem('app_user_phone', data.user.phone || '');
      localStorage.setItem('app_user_display_name', data.user.name || '');
    }
    return { success: true, user: data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_admin_token');
      localStorage.removeItem('app_user_phone');
      localStorage.removeItem('app_user_display_name');
    }
    const token = getAdminTokenClient();
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-admin-token'] = token;
    }
    await fetch('/api/admin/logout', { method: 'POST', headers });
  } catch {
    // Bỏ qua lỗi mạng
  }
}

export function setAdminClient(status: boolean) {
  if (typeof window === 'undefined') return;
  if (!status) {
    logoutAdmin();
  }
}

