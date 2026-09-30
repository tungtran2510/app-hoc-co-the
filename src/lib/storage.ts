import { Block, Page, Topic, Video } from './types';

const STORAGE_BLOCKS_PREFIX = 'app_page_blocks_';
const STORAGE_PAGE_STATUS_PREFIX = 'app_page_status_';
const STORAGE_PAGE_DATA_PREFIX = 'app_page_data_';
const STORAGE_SETTINGS_KEY = 'app_custom_settings';
const STORAGE_ADMIN_PIN_KEY = 'app_admin_pin';

export interface AppCustomSettings {
  app_name: string;
  expert_title: string;
  hotline: string;
  zalo_url: string;
  auto_next_video: boolean;
  default_font_size: 'small' | 'normal' | 'large';
  show_progress_bar: boolean;
}

export const DEFAULT_APP_SETTINGS: AppCustomSettings = {
  app_name: 'Sống Khỏe Mỗi Ngày',
  expert_title: 'Chuyên gia Trị liệu & Chăm sóc Cột sống',
  hotline: '0988.123.456',
  zalo_url: 'https://zalo.me',
  auto_next_video: true,
  default_font_size: 'normal',
  show_progress_bar: true,
};

/**
 * Lấy danh sách khối của trang từ localStorage (nếu có lưu thay đổi từ admin)
 * Tự động bù đắp youtube_id nếu block video cũ bị rỗng link.
 */
export function getStoredBlocks(pageId: string, fallbackBlocks: Block[]): Block[] {
  if (typeof window === 'undefined') return fallbackBlocks;
  try {
    const raw = localStorage.getItem(`${STORAGE_BLOCKS_PREFIX}${pageId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Tự động kiểm tra và bù youtube_id từ fallbackBlocks nếu trong storage đang rỗng
        return parsed.map((b) => {
          if (b.type === 'videos' && b.data && Array.isArray(b.data.videos)) {
            const fallbackVideoBlock = fallbackBlocks.find(
              (fb) => fb.id === b.id && fb.type === 'videos'
            );
            const fallbackVideos =
              fallbackVideoBlock && fallbackVideoBlock.type === 'videos'
                ? fallbackVideoBlock.data.videos
                : [];

            const updatedVideos = b.data.videos.map((vid: Video, idx: number) => {
              const fbVid = fallbackVideos[idx] || fallbackVideos[0];
              if (!vid.youtube_id && fbVid?.youtube_id) {
                return {
                  ...vid,
                  youtube_id: fbVid.youtube_id,
                  thumbnail_url: vid.thumbnail_url || fbVid.thumbnail_url,
                  duration_text: vid.duration_text || fbVid.duration_text,
                };
              }
              return vid;
            });

            return {
              ...b,
              data: {
                ...b.data,
                videos: updatedVideos,
              },
            };
          }
          return b;
        });
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
    localStorage.removeItem(`${STORAGE_PAGE_DATA_PREFIX}${pageId}`);
  } catch {
    // Bỏ qua
  }
}

/**
 * Lấy thông tin trang đã sửa (Tiêu đề, Tóm tắt)
 */
export function getStoredPage(pageId: string, fallbackPage: Page): Page {
  if (typeof window === 'undefined') return fallbackPage;
  try {
    const raw = localStorage.getItem(`${STORAGE_PAGE_DATA_PREFIX}${pageId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...fallbackPage,
        ...parsed,
      };
    }
  } catch {
    // Bỏ qua
  }
  return fallbackPage;
}

/**
 * Lưu thông tin trang đã sửa
 */
export function saveStoredPage(pageId: string, pageData: Partial<Page>): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = localStorage.getItem(`${STORAGE_PAGE_DATA_PREFIX}${pageId}`);
    const parsed = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      `${STORAGE_PAGE_DATA_PREFIX}${pageId}`,
      JSON.stringify({ ...parsed, ...pageData })
    );
  } catch {
    // Bỏ qua
  }
}

/**
 * Lấy trạng thái xuất bản của trang (draft hoặc published)
 */
export function getStoredPageStatus(
  pageId: string,
  defaultStatus: 'draft' | 'published'
): 'draft' | 'published' {
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

/**
 * Cài đặt ứng dụng
 */
export function getStoredAppSettings(): AppCustomSettings {
  if (typeof window === 'undefined') return DEFAULT_APP_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_APP_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // Bỏ qua
  }
  return DEFAULT_APP_SETTINGS;
}

export function saveStoredAppSettings(settings: Partial<AppCustomSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredAppSettings();
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch {
    // Bỏ qua
  }
}

/**
 * Mã PIN quản trị
 */
export function getAdminPin(): string {
  if (typeof window === 'undefined') return 'admin123';
  try {
    return localStorage.getItem(STORAGE_ADMIN_PIN_KEY) || 'admin123';
  } catch {
    return 'admin123';
  }
}

export function setAdminPin(pin: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_ADMIN_PIN_KEY, pin);
  } catch {
    // Bỏ qua
  }
}

/**
 * Sao lưu toàn bộ dữ liệu ra JSON
 */
export function exportAllData(): string {
  if (typeof window === 'undefined') return '{}';
  const dump: Record<string, any> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('app_') || key === 'co_chu')) {
      dump[key] = localStorage.getItem(key);
    }
  }
  return JSON.stringify(dump, null, 2);
}

/**
 * Khôi phục dữ liệu từ JSON
 */
export function importAllData(jsonStr: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const data = JSON.parse(jsonStr);
    if (typeof data === 'object' && data !== null) {
      Object.keys(data).forEach((key) => {
        localStorage.setItem(key, data[key]);
      });
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Khôi phục toàn bộ cài đặt và nội dung về dữ liệu chuẩn gốc
 */
export function resetAllToDefault(): void {
  if (typeof window === 'undefined') return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('app_') || key === 'co_chu')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Bỏ qua
  }
}
