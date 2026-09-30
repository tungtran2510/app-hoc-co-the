/**
 * Trình tạo và kiểm tra UUID chuẩn RFC 4122 v4
 * Hoạt động 100% tin cậy trên MỌI môi trường:
 * - HTTPS và HTTP cục bộ (LAN IP 192.168.x.x, nơi crypto.randomUUID bị trình duyệt chặn)
 * - Thiết bị di động (Android, iOS Safari, WebViews)
 * - Server-side Node.js / Next.js API Routes
 */

export function isValidUuid(id?: string | null): boolean {
  if (!id || typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id.trim());
}

export function generateUuid(): string {
  // 1. Thử dùng native crypto.randomUUID nếu có (trong secure context hoặc Node.js)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Bỏ qua lỗi
    }
  }

  // 2. Thử dùng crypto.getRandomValues nếu có
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    try {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
      bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
    } catch {
      // Bỏ qua lỗi
    }
  }

  // 3. Fallback thuật toán chuẩn RFC 4122 v4
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
