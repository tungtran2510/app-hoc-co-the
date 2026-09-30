export interface XemTiepInfo {
  topic_slug: string;
  topic_title: string;
  page_slug: string;
  page_title: string;
  page_number: number;
  video_index: number;
  video_total: number;
  video_title: string;
  cover_url?: string | null;
  scroll_y?: number;
  updated_at: number;
}

export interface TienDoMap {
  [page_id: string]: {
    last_video: number;
    watched: number[];
  };
}

const XEM_TIEP_KEY = 'xem_tiep';
const TIEN_DO_KEY = 'tien_do';

export function notifyProgressChanged(): void {
  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('learning_progress_changed'));
    } catch {
      // Bỏ qua
    }
  }
}

export function getStoredXemTiep(): XemTiepInfo | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(XEM_TIEP_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as XemTiepInfo;
  } catch {
    return null;
  }
}

export function saveStoredXemTiep(info: Partial<XemTiepInfo>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredXemTiep() || ({} as XemTiepInfo);
    const updated: XemTiepInfo = {
      ...current,
      ...info,
      updated_at: Date.now(),
    } as XemTiepInfo;
    localStorage.setItem(XEM_TIEP_KEY, JSON.stringify(updated));
    notifyProgressChanged();
  } catch {
    // Bỏ qua
  }
}

export function updateScrollPosition(scrollY: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredXemTiep();
    if (current) {
      current.scroll_y = Math.round(scrollY);
      current.updated_at = Date.now();
      localStorage.setItem(XEM_TIEP_KEY, JSON.stringify(current));
    }
  } catch {
    // Bỏ qua
  }
}

export function getStoredTienDo(): TienDoMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(TIEN_DO_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as TienDoMap;
  } catch {
    return {};
  }
}

export function saveVideoWatched(pageId: string, videoIndex: number): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getStoredTienDo();
    const current = all[pageId] || { last_video: videoIndex, watched: [] };
    const watchedSet = new Set(current.watched || []);
    watchedSet.add(videoIndex);

    all[pageId] = {
      last_video: videoIndex,
      watched: Array.from(watchedSet).sort((a, b) => a - b),
    };
    localStorage.setItem(TIEN_DO_KEY, JSON.stringify(all));
    notifyProgressChanged();
  } catch {
    // Bỏ qua
  }
}

// -----------------------------------------------------------------------------
// BÀI HỌC ĐÃ LƯU (BOOKMARKS)
// -----------------------------------------------------------------------------
export interface SavedPageInfo {
  page_id: string;
  topic_slug: string;
  topic_title: string;
  page_slug: string;
  page_title: string;
  page_number: number;
  saved_at: number;
}

const BAI_DA_LUU_KEY = 'bai_da_luu';

export function getSavedPages(): SavedPageInfo[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BAI_DA_LUU_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedPageInfo[];
  } catch {
    return [];
  }
}

export function isPageSaved(pageId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getSavedPages();
    return list.some((p) => p.page_id === pageId);
  } catch {
    return false;
  }
}

export function toggleSavePage(info: SavedPageInfo): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getSavedPages();
    const exists = list.some((p) => p.page_id === info.page_id);
    let updated: SavedPageInfo[];
    let newState: boolean;
    if (exists) {
      updated = list.filter((p) => p.page_id !== info.page_id);
      newState = false;
    } else {
      updated = [info, ...list];
      newState = true;
    }
    localStorage.setItem(BAI_DA_LUU_KEY, JSON.stringify(updated));
    notifyProgressChanged();
    return newState;
  } catch {
    return false;
  }
}

// -----------------------------------------------------------------------------
// ĐÃ HIỂU BÀI NÀY (ĐÁNH DẤU HOÀN THÀNH 1 CHẠM)
// -----------------------------------------------------------------------------
const DA_HOAN_THANH_KEY = 'da_hoan_thanh';

export function getCompletedPages(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DA_HOAN_THANH_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function isPageCompleted(pageId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getCompletedPages();
    return list.includes(pageId);
  } catch {
    return false;
  }
}

export function togglePageCompleted(pageId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getCompletedPages();
    let updated: string[];
    let newState: boolean;
    if (list.includes(pageId)) {
      updated = list.filter((id) => id !== pageId);
      newState = false;
    } else {
      updated = [...list, pageId];
      newState = true;
    }
    localStorage.setItem(DA_HOAN_THANH_KEY, JSON.stringify(updated));
    notifyProgressChanged();
    return newState;
  } catch {
    return false;
  }
}
