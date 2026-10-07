import { Block, Page } from './types';
import { saveBlockApi, savePageApi, saveSettingsApi, getAdminHeaders } from './apiAdmin';

export interface AppCustomSettings {
  app_name: string;
  expert_title: string;
  hotline: string;
  zalo_url: string;
  auto_next_video: boolean;
  default_font_size: 'small' | 'normal' | 'large';
  show_progress_bar: boolean;
  theme_palette?: 'indigo' | 'navy_luxury';
  show_ebook_bridge?: boolean;
  ebook_app_url?: string;
  auto_offline_cache?: boolean;
  offline_max_mb?: number;
  data_saver_mode?: boolean;
  posture_reminder_enabled?: boolean;
  posture_reminder_interval?: number;
  enable_personalized_roadmap?: boolean;
  custom_roadmap?: Record<string, Array<{ title: string; topicSlug: string; pageSlug: string; tag: string; reason: string }>>;
}

export const DEFAULT_APP_SETTINGS: AppCustomSettings = {
  app_name: 'Sống Khỏe Mỗi Ngày',
  expert_title: 'Hỗ trợ kiến thức nền tảng & Sức khỏe',
  hotline: '0974.248.716',
  zalo_url: 'https://zalo.me/0987792400',
  auto_next_video: true,
  default_font_size: 'normal',
  show_progress_bar: true,
  theme_palette: 'indigo',
  show_ebook_bridge: true,
  ebook_app_url: 'https://qbiz-ebook.vercel.app',
  auto_offline_cache: true,
  offline_max_mb: 60,
  data_saver_mode: false,
  posture_reminder_enabled: true,
  posture_reminder_interval: 60,
  enable_personalized_roadmap: true,
};

/**
 * Lấy danh sách khối của trang (trả về trực tiếp từ nguồn dữ liệu máy chủ)
 */
export function getStoredBlocks(_pageId: string, fallbackBlocks: Block[]): Block[] {
  return fallbackBlocks;
}

/**
 * Lưu danh sách khối: gọi API Supabase hàng loạt (batch save) cực nhanh, nguyên khối
 */
export async function saveStoredBlocks(_pageId: string, blocks: Block[]): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/save-block', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ blocks }),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_PAGE_CACHE' });
      }
      return Boolean(data.success);
    }

    // Dự phòng lưu tuần tự nếu cần
    for (const block of blocks) {
      await saveBlockApi(block);
    }
    return true;
  } catch {
    return false;
  }
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
  if (typeof window !== 'undefined') {
    try {
      const savedPalette = localStorage.getItem('qbiz_theme_palette') as 'indigo' | 'navy_luxury' | null;
      const savedShowEbook = localStorage.getItem('qbiz_show_ebook_bridge');
      const savedEbookUrl = localStorage.getItem('qbiz_ebook_app_url');
      const savedAutoOffline = localStorage.getItem('qbiz_auto_offline_cache');
      const savedEnableRoadmap = localStorage.getItem('qbiz_enable_personalized_roadmap');
      const savedCustomRoadmapStr = localStorage.getItem('qbiz_custom_roadmap');
      let parsedCustomRoadmap = undefined;
      if (savedCustomRoadmapStr) {
        try {
          parsedCustomRoadmap = JSON.parse(savedCustomRoadmapStr);
        } catch {}
      }
      const resolvedEbookUrl = (!savedEbookUrl || savedEbookUrl.includes('app-doc-sach.vercel.app'))
        ? DEFAULT_APP_SETTINGS.ebook_app_url
        : savedEbookUrl;
      return {
        ...DEFAULT_APP_SETTINGS,
        theme_palette: savedPalette === 'navy_luxury' || savedPalette === 'indigo' ? savedPalette : DEFAULT_APP_SETTINGS.theme_palette,
        show_ebook_bridge: savedShowEbook !== null ? savedShowEbook === 'true' : DEFAULT_APP_SETTINGS.show_ebook_bridge,
        ebook_app_url: resolvedEbookUrl,
        auto_offline_cache: savedAutoOffline !== null ? savedAutoOffline === 'true' : DEFAULT_APP_SETTINGS.auto_offline_cache,
        enable_personalized_roadmap: savedEnableRoadmap !== null ? savedEnableRoadmap === 'true' : DEFAULT_APP_SETTINGS.enable_personalized_roadmap,
        custom_roadmap: parsedCustomRoadmap,
      };
    } catch {}
  }
  return DEFAULT_APP_SETTINGS;
}

export async function saveStoredAppSettings(settings: Partial<AppCustomSettings>): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      if (settings.theme_palette) {
        localStorage.setItem('qbiz_theme_palette', settings.theme_palette);
        if (settings.theme_palette === 'navy_luxury') {
          document.documentElement.classList.add('theme-navy-luxury');
        } else {
          document.documentElement.classList.remove('theme-navy-luxury');
        }
        window.dispatchEvent(new CustomEvent('qbiz_theme_palette_changed', { detail: { palette: settings.theme_palette } }));
      }
      if (typeof settings.show_ebook_bridge !== 'undefined') {
        localStorage.setItem('qbiz_show_ebook_bridge', String(settings.show_ebook_bridge));
      }
      if (settings.ebook_app_url) {
        localStorage.setItem('qbiz_ebook_app_url', settings.ebook_app_url.trim());
      }
      if (typeof settings.auto_offline_cache !== 'undefined') {
        localStorage.setItem('qbiz_auto_offline_cache', String(settings.auto_offline_cache));
        window.dispatchEvent(new CustomEvent('qbiz_auto_offline_changed', { detail: { enabled: settings.auto_offline_cache } }));
      }
      if (typeof settings.enable_personalized_roadmap !== 'undefined') {
        localStorage.setItem('qbiz_enable_personalized_roadmap', String(settings.enable_personalized_roadmap));
        window.dispatchEvent(new CustomEvent('qbiz_roadmap_setting_changed', { detail: { enabled: settings.enable_personalized_roadmap } }));
      }
      if (settings.custom_roadmap) {
        localStorage.setItem('qbiz_custom_roadmap', JSON.stringify(settings.custom_roadmap));
        window.dispatchEvent(new CustomEvent('qbiz_custom_roadmap_changed', { detail: { customRoadmap: settings.custom_roadmap } }));
      }
    } catch {}
  }

  const res = await saveSettingsApi({
    app_name: settings.app_name,
    expert_title: settings.expert_title,
    hotline: settings.hotline,
    zalo_url: settings.zalo_url,
    workspace_id: 'default',
    theme_palette: settings.theme_palette,
  } as any);
  return res.success;
}
