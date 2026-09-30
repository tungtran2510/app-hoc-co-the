export interface XemTiepInfo {
  topic_slug: string;
  topic_title: string;
  page_slug: string;
  page_title: string;
  page_number: number;
  video_index: number;
  video_total: number;
  video_title: string;
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
  } catch {
    // Bỏ qua
  }
}
