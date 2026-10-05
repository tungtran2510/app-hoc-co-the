/**
 * Quản lý trạng thái Admin phía Client
 * Mọi xác thực bảo mật được xử lý qua Cookie HTTPOnly tại Server Route /api/admin/*
 */

export interface AdminStatus {
  isAdmin: boolean;
  supabaseOk: boolean;
  user?: {
    phone: string;
    name: string;
    role: 'super_admin' | 'admin' | 'instructor';
    allowed_topic_ids?: string[];
  } | null;
}

export function isSuperAdmin(user?: { role?: string; phone?: string } | null): boolean {
  if (!user) return false;
  return user.role === 'super_admin' || user.phone === '0974248716';
}

export function canManageTopic(
  topicIdOrSlug: string,
  user?: { role?: string; allowed_topic_ids?: string[] } | null
): boolean {
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'admin') return true;
  if (!user.allowed_topic_ids || user.allowed_topic_ids.length === 0) return false;
  if (user.allowed_topic_ids.includes('*')) return true;
  return user.allowed_topic_ids.includes(topicIdOrSlug);
}

export function getAdminTokenClient(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('app_admin_token') || '';
}

export async function checkAdminStatus(): Promise<AdminStatus> {
  if (typeof window === 'undefined') return { isAdmin: false, supabaseOk: false, user: null };
  try {
    const token = getAdminTokenClient();
    const headers: Record<string, string> = {};
    if (token) {
      headers['x-admin-token'] = token;
    }
    const res = await fetch('/api/admin/me', { headers, cache: 'no-store' });
    if (!res.ok) return { isAdmin: false, supabaseOk: false, user: null };
    const data = await res.json();
    return {
      isAdmin: Boolean(data.isAdmin),
      supabaseOk: Boolean(data.supabase_ok),
      user: data.user || null,
    };
  } catch {
    return { isAdmin: false, supabaseOk: false, user: null };
  }
}

export async function checkIsAdminClient(): Promise<boolean> {
  const status = await checkAdminStatus();
  return status.isAdmin;
}

export async function loginAdmin(
  password: string,
  phone?: string
): Promise<{ success: boolean; error?: string; user?: any }> {
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

