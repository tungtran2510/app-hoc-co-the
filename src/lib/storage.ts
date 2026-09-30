import { Block, Page } from './types';
import { saveBlockApi, savePageApi, saveSettingsApi } from './apiAdmin';

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
 * Lấy danh sách khối của trang (trả về trực tiếp từ nguồn dữ liệu máy chủ)
 */
export function getStoredBlocks(_pageId: string, fallbackBlocks: Block[]): Block[] {
  return fallbackBlocks;
}

/**
 * Lưu danh sách khối: gọi trực tiếp API Supabase, KHÔNG lưu tạm trên localStorage
 */
export async function saveStoredBlocks(_pageId: string, blocks: Block[]): Promise<boolean> {
  // Gọi API ghi trực tiếp vào Supabase
  for (const block of blocks) {
    const res = await saveBlockApi(block);
    if (!res.success) {
      return false;
    }
  }
  return true;
}

/**
 * Lấy thông tin trang đã sửa
 */
export function getStoredPage(_pageId: string, fallbackPage: Page): Page {
  return fallbackPage;
}

/**
 * Lưu thông tin trang: ghi trực tiếp vào Supabase
 */
export async function saveStoredPage(pageId: string, pageData: Partial<Page>): Promise<boolean> {
  const res = await savePageApi({ id: pageId, ...pageData });
  return res.success;
}

/**
 * Lấy trạng thái trang (draft hoặc published)
 */
export function getStoredPageStatus(
  _pageId: string,
  defaultStatus: 'draft' | 'published'
): 'draft' | 'published' {
  return defaultStatus;
}

/**
 * Lưu trạng thái trang: ghi trực tiếp vào Supabase
 */
export async function saveStoredPageStatus(pageId: string, status: 'draft' | 'published'): Promise<boolean> {
  const res = await savePageApi({ id: pageId, status });
  return res.success;
}

/**
 * Cài đặt ứng dụng
 */
export function getStoredAppSettings(): AppCustomSettings {
  return DEFAULT_APP_SETTINGS;
}

export async function saveStoredAppSettings(settings: Partial<AppCustomSettings>): Promise<boolean> {
  const res = await saveSettingsApi({
    app_name: settings.app_name,
    expert_title: settings.expert_title,
    hotline: settings.hotline,
    zalo_url: settings.zalo_url,
    workspace_id: 'default',
  });
  return res.success;
}
