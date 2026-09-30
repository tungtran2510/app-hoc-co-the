export const ADMIN_COOKIE_NAME = 'app_admin_auth';
export const DEFAULT_ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';

/**
 * Kiểm tra trạng thái admin phía client
 */
export function checkIsAdminClient(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const fromStorage = localStorage.getItem('is_admin') === 'true';
    const fromCookie = document.cookie
      .split('; ')
      .some((row) => row.startsWith(`${ADMIN_COOKIE_NAME}=true`));
    return fromStorage || fromCookie;
  } catch {
    return false;
  }
}

/**
 * Bật hoặc tắt trạng thái admin phía client
 */
export function setAdminClient(status: boolean) {
  if (typeof window === 'undefined') return;
  try {
    if (status) {
      localStorage.setItem('is_admin', 'true');
      document.cookie = `${ADMIN_COOKIE_NAME}=true; path=/; max-age=86400; SameSite=Lax`;
    } else {
      localStorage.removeItem('is_admin');
      document.cookie = `${ADMIN_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
    }
  } catch {
    // Bỏ qua lỗi truy cập storage
  }
}
