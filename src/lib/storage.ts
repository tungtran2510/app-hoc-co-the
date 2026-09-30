import { Block, Page, Topic, Video } from './types';
import { saveBlockApi, savePageApi, saveSettingsApi } from './apiAdmin';

const STORAGE_BLOCKS_PREFIX = 'app_page_blocks_';
const STORAGE_PAGE_STATUS_PREFIX = 'app_page_status_';
const STORAGE_PAGE_DATA_PREFIX = 'app_page_data_';
const STORAGE_SETTINGS_KEY = 'app_custom_settings';

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
 * Lấy danh sách khối của trang
 */
export function getStoredBlocks(pageId: string, fallbackBlocks: Block[]): Block[] {
  if (typeof window === 'undefined') return fallbackBlocks;
  try {
    const raw = localStorage.getItem(`${STORAGE_BLOCKS_PREFIX}${pageId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
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
    // fallback
  }
  return fallbackBlocks;
}

/**
 * Lưu danh sách khối: gọi API Supabase và cập nhật local state
 */
export async function saveStoredBlocks(pageId: string, blocks: Block[]): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  try {
    localStorage.setItem(`${STORAGE_BLOCKS_PREFIX}${pageId}`, JSON.stringify(blocks));
  } catch {
    // ignore
  }

  // Gọi API ghi vào Supabase
  let hasError = false;
  for (const block of blocks) {
    const res = await saveBlockApi(block);
    if (!res.success) {
      hasError = true;
    }
  }
  return !hasError;
}

/**
 * Lấy thông tin trang đã sửa
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
    // fallback
  }
  return fallbackPage;
}

/**
 * Lưu thông tin trang
 */
export async function saveStoredPage(pageId: string, pageData: Partial<Page>): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  try {
    const existing = localStorage.getItem(`${STORAGE_PAGE_DATA_PREFIX}${pageId}`);
    const parsed = existing ? JSON.parse(existing) : {};
    localStorage.setItem(
      `${STORAGE_PAGE_DATA_PREFIX}${pageId}`,
      JSON.stringify({ ...parsed, ...pageData })
    );
  } catch {
    // ignore
  }

  const res = await savePageApi({ id: pageId, ...pageData });
  return res.success;
}

/**
 * Lấy trạng thái trang (draft hoặc published)
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
    // ignore
  }
  return defaultStatus;
}

/**
 * Lưu trạng thái trang
 */
export async function saveStoredPageStatus(pageId: string, status: 'draft' | 'published'): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  try {
    localStorage.setItem(`${STORAGE_PAGE_STATUS_PREFIX}${pageId}`, status);
  } catch {
    // ignore
  }
  const res = await savePageApi({ id: pageId, status });
  return res.success;
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
    // ignore
  }
  return DEFAULT_APP_SETTINGS;
}

export async function saveStoredAppSettings(settings: Partial<AppCustomSettings>): Promise<boolean> {
  if (typeof window === 'undefined') return true;
  try {
    const current = getStoredAppSettings();
    localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  } catch {
    // ignore
  }

  const res = await saveSettingsApi({
    app_name: settings.app_name,
    workspace_id: 'default',
  });
  return res.success;
}
