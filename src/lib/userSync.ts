import { UserProgressSyncData } from './types';
import {
  getStoredXemTiep,
  getStoredTienDo,
  getSavedPages,
  getCompletedPages,
  getReviewVideos,
} from './learningProgress';

export const USER_PHONE_KEY = 'user_phone';
export const LEARNING_PROGRESS_EVENT = 'learning_progress_updated';
export type TopicDisplayScope = 'home' | 'page';

export function getTopicDisplayPreferenceKey(scope: TopicDisplayScope, phone: string | null): string {
  const cleanPhone = phone?.replace(/[^0-9]/g, '') || 'guest';
  return `qbiz_topics_display:${scope}:${cleanPhone}`;
}

export async function getTopicDisplayPreferences(phone: string): Promise<{
  success: boolean;
  preferences?: UserProgressSyncData['display_preferences'];
}> {
  try {
    const res = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, action: 'get_preferences' }),
    });
    const json = await res.json();
    return res.ok && json.success
      ? { success: true, preferences: json.preferences || {} }
      : { success: false };
  } catch {
    return { success: false };
  }
}

export async function saveTopicDisplayPreference(
  phone: string,
  scope: TopicDisplayScope,
  mode: string
): Promise<boolean> {
  const preferenceKey = scope === 'page' ? 'topics_page_display' : 'home_topics_display';
  try {
    const res = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        action: 'save_preferences',
        localData: { display_preferences: { [preferenceKey]: mode } },
      }),
    });
    const json = await res.json();
    return res.ok && Boolean(json.success);
  } catch {
    return false;
  }
}

/**
 * Lấy số điện thoại người dùng đã lưu
 */
export function getUserPhone(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(USER_PHONE_KEY);
  } catch {
    return null;
  }
}

/**
 * Lưu số điện thoại người dùng vào localStorage
 */
export function setUserPhone(phone: string): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = phone.replace(/[^0-9]/g, '');
    localStorage.setItem(USER_PHONE_KEY, clean);
    window.dispatchEvent(new CustomEvent('user_phone_updated', { detail: { phone: clean } }));
  } catch {
    // Bỏ qua
  }
}

/**
 * Xóa số điện thoại đã lưu (đổi số khác / đăng xuất đồng bộ)
 */
export function clearUserPhone(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(USER_PHONE_KEY);
    window.dispatchEvent(new CustomEvent('user_phone_updated', { detail: { phone: null } }));
  } catch {
    // Bỏ qua
  }
}

/**
 * Gom toàn bộ dữ liệu học tập hiện có trên thiết bị này
 */
export function getLocalLearningData(): {
  xem_tiep: any;
  tien_do: any;
  bai_da_luu: any[];
  da_hoan_thanh: string[];
  can_on_tap_videos: any[];
  reader_font?: string | null;
} {
  return {
    xem_tiep: getStoredXemTiep(),
    tien_do: getStoredTienDo(),
    bai_da_luu: getSavedPages(),
    da_hoan_thanh: getCompletedPages(),
    can_on_tap_videos: getReviewVideos(),
    reader_font: typeof window !== 'undefined' ? localStorage.getItem('qbiz_reader_font') : null,
  };
}

/**
 * Áp dụng dữ liệu từ đám mây vào localStorage thiết bị
 */
export function applyRemoteLearningData(data: UserProgressSyncData): void {
  if (typeof window === 'undefined' || !data) return;
  try {
    if (Array.isArray(data.bai_da_luu)) {
      localStorage.setItem('bai_da_luu', JSON.stringify(data.bai_da_luu));
    }
    if (Array.isArray(data.da_hoan_thanh)) {
      localStorage.setItem('da_hoan_thanh', JSON.stringify(data.da_hoan_thanh));
    }
    if (data.tien_do && typeof data.tien_do === 'object') {
      localStorage.setItem('tien_do', JSON.stringify(data.tien_do));
    }
    if (data.xem_tiep && typeof data.xem_tiep === 'object') {
      localStorage.setItem('xem_tiep', JSON.stringify(data.xem_tiep));
    }
    if (Array.isArray(data.can_on_tap_videos)) {
      localStorage.setItem('can_on_tap_videos', JSON.stringify(data.can_on_tap_videos));
    }
    if (data.reader_font && typeof data.reader_font === 'string') {
      localStorage.setItem('qbiz_reader_font', data.reader_font);
      document.documentElement.setAttribute('data-reader-font', data.reader_font);
    }

    // Bắn sự kiện để các trang/thành phần đang mở cập nhật tức thì
    window.dispatchEvent(new CustomEvent(LEARNING_PROGRESS_EVENT, { detail: data }));
  } catch {
    // Bỏ qua
  }
}

/**
 * Gửi yêu cầu đồng bộ lên máy chủ
 */
export async function syncUserProgress(
  phone: string,
  action: 'sync' | 'get' | 'save' = 'sync'
): Promise<{ success: boolean; data?: UserProgressSyncData; error?: string }> {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  if (!cleanPhone || cleanPhone.length < 9 || cleanPhone.length > 11) {
    return {
      success: false,
      error: 'Số điện thoại không hợp lệ (vui lòng nhập 9 đến 11 số)',
    };
  }

  try {
    const localData = getLocalLearningData();
    const res = await fetch('/api/user/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: cleanPhone,
        action,
        localData,
      }),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      return {
        success: false,
        error: json.error || 'Chưa thể đồng bộ lúc này, vui lòng thử lại sau',
      };
    }

    // Lưu lại số điện thoại và cập nhật dữ liệu gộp vào máy
    setUserPhone(cleanPhone);
    if (json.data) {
      applyRemoteLearningData(json.data);
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Lỗi kết nối khi đồng bộ dữ liệu',
    };
  }
}

// Bộ đệm tránh gọi sync liên tục khi người dùng lướt nhanh
let syncTimeout: any = null;

/**
 * Đồng bộ chạy ngầm khi người dùng thực hiện thao tác (lưu bài, đã hiểu, xem video)
 */
export function triggerBackgroundSync(): void {
  if (typeof window === 'undefined') return;
  const phone = getUserPhone();
  if (!phone) return;

  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }

  syncTimeout = setTimeout(() => {
    syncUserProgress(phone, 'sync').catch(() => {
      // Bỏ qua lỗi ngầm
    });
  }, 2000);
}

// Lắng nghe sự kiện thay đổi tiến độ học tập trên toàn ứng dụng để tự động đồng bộ ngầm
if (typeof window !== 'undefined') {
  window.addEventListener('learning_progress_changed', () => {
    triggerBackgroundSync();
  });
}
