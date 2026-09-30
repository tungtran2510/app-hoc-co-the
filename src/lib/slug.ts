/**
 * Tự động tạo slug chuẩn URL từ chuỗi tiếng Việt:
 * Bỏ dấu tiếng Việt, 'đ' -> 'd', khoảng trắng -> '-', loại bỏ ký tự lạ.
 */
export function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
