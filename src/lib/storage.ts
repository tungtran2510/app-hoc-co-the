import { Block, Page, Topic } from './types';

const STORAGE_BLOCKS_PREFIX = 'app_page_blocks_';
const STORAGE_PAGE_STATUS_PREFIX = 'app_page_status_';

/**
 * Lấy danh sách khối của trang từ localStorage (nếu có lưu thay đổi từ admin)
 */
export function getStoredBlocks(pageId: string, fallbackBlocks: Block[]): Block[] {
  if (typeof window === 'undefined') return fallbackBlocks;
  try {
    const raw = localStorage.getItem(`${STORAGE_BLOCKS_PREFIX}${pageId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Dùng fallback nếu lỗi parse
  }
  return fallbackBlocks;
}

/**
 * Lưu danh sách khối đã chỉnh sửa vào localStorage
 */
export function saveStoredBlocks(pageId: string, blocks: Block[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_BLOCKS_PREFIX}${pageId}`, JSON.stringify(blocks));
  } catch {
    // Bỏ qua lỗi lưu
  }
}

/**
 * Xóa dữ liệu chỉnh sửa của trang để khôi phục về mặc định
 */
export function resetStoredBlocks(pageId: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`${STORAGE_BLOCKS_PREFIX}${pageId}`);
  } catch {
    // Bỏ qua
  }
}

/**
 * Lấy trạng thái xuất bản của trang (draft hoặc published)
 */
export function getStoredPageStatus(pageId: string, defaultStatus: 'draft' | 'published'): 'draft' | 'published' {
  if (typeof window === 'undefined') return defaultStatus;
  try {
    const val = localStorage.getItem(`${STORAGE_PAGE_STATUS_PREFIX}${pageId}`);
    if (val === 'draft' || val === 'published') {
      return val;
    }
  } catch {
    // Bỏ qua
  }
  return defaultStatus;
}

/**
 * Lưu trạng thái xuất bản của trang
 */
export function saveStoredPageStatus(pageId: string, status: 'draft' | 'published'): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`${STORAGE_PAGE_STATUS_PREFIX}${pageId}`, status);
  } catch {
    // Bỏ qua
  }
}
