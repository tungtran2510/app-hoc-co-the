/**
 * Quản lý trạng thái Admin phía Client
 * Mọi xác thực bảo mật được xử lý qua Cookie HTTPOnly tại Server Route /api/admin/*
 */

export async function checkIsAdminClient(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  try {
    const res = await fetch('/api/admin/me', { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data.isAdmin);
  } catch {
    return false;
  }
}

export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Mật khẩu quản trị không chính xác' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Lỗi kết nối máy chủ' };
  }
}

export async function logoutAdmin(): Promise<void> {
  try {
    await fetch('/api/admin/logout', { method: 'POST' });
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

