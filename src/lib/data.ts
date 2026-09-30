import {
  sampleSettings,
  sampleTopics,
  samplePages,
  sampleBlocks,
  DEFAULT_AUTHOR_PROFILE,
  DEFAULT_RECOMMENDED_BOOKS,
  DEFAULT_AI_TRAINING,
} from '../data/sample';
import {
  Settings,
  Topic,
  Page,
  Block,
  ContinueInfo,
  AuthorProfile,
  RecommendedBook,
  AiTrainingConfig,
} from './types';
import { getSupabaseClient } from './supabaseClient';

export function normalizeAiTraining(raw?: any): AiTrainingConfig {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_AI_TRAINING };
  }
  return {
    guidelines: typeof raw.guidelines === 'string' ? raw.guidelines : (DEFAULT_AI_TRAINING.guidelines || ''),
    documents: Array.isArray(raw.documents) ? raw.documents : (DEFAULT_AI_TRAINING.documents || []),
    faqs: Array.isArray(raw.faqs) ? raw.faqs : (DEFAULT_AI_TRAINING.faqs || []),
  };
}

export function normalizeRecommendedBooks(raw?: any): RecommendedBook[] {
  if (!raw || !Array.isArray(raw) || raw.length === 0) {
    return DEFAULT_RECOMMENDED_BOOKS;
  }
  return raw.map((item, idx) => ({
    id: item.id || `rec-book-${idx + 1}`,
    title: item.title?.trim() ? item.title : `Sách ${idx + 1}`,
    cover_url: item.cover_url || null,
    description: item.description || '',
    author: item.author || '',
    link_url: item.link_url || '',
    youtube_url: item.youtube_url || null,
    gallery_images: Array.isArray(item.gallery_images) ? item.gallery_images.filter(Boolean) : [],
  }));
}

export function normalizeAuthorProfile(raw?: any): AuthorProfile {
  if (!raw || typeof raw !== 'object' || Object.keys(raw).length === 0) {
    return { ...DEFAULT_AUTHOR_PROFILE };
  }
  return {
    ...DEFAULT_AUTHOR_PROFILE,
    ...raw,
    name: raw.name?.trim() ? raw.name : DEFAULT_AUTHOR_PROFILE.name,
    title: raw.title?.trim() ? raw.title : DEFAULT_AUTHOR_PROFILE.title,
    bio: raw.bio !== undefined ? raw.bio : DEFAULT_AUTHOR_PROFILE.bio,
    books: Array.isArray(raw.books) && raw.books.length > 0
      ? raw.books.map((b: any) => ({
          ...b,
          gallery_images: Array.isArray(b.gallery_images) ? b.gallery_images.filter(Boolean) : [],
        }))
      : DEFAULT_AUTHOR_PROFILE.books,
    phone: raw.phone !== undefined ? raw.phone : DEFAULT_AUTHOR_PROFILE.phone,
    zalo_url: raw.zalo_url !== undefined ? raw.zalo_url : DEFAULT_AUTHOR_PROFILE.zalo_url,
    email: raw.email !== undefined ? raw.email : DEFAULT_AUTHOR_PROFILE.email,
    facebook_url: raw.facebook_url !== undefined ? raw.facebook_url : DEFAULT_AUTHOR_PROFILE.facebook_url,
    address: raw.address !== undefined ? raw.address : DEFAULT_AUTHOR_PROFILE.address,
    contact_note: raw.contact_note !== undefined ? raw.contact_note : DEFAULT_AUTHOR_PROFILE.contact_note,
  };
}

export const DEFAULT_HOME_SECTIONS_ORDER = [
  'topics',
  'author_profile',
  'author_books',
  'author_philosophy',
  'author_contact',
  'recommended_books',
];

export function normalizeHomeSectionsOrder(raw?: any): string[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    return [...DEFAULT_HOME_SECTIONS_ORDER];
  }

  const expanded: string[] = [];
  for (const item of raw) {
    if (item === 'author') {
      expanded.push('author_profile', 'author_books', 'author_philosophy', 'author_contact');
    } else if (typeof item === 'string') {
      expanded.push(item);
    }
  }

  const validSet = new Set(DEFAULT_HOME_SECTIONS_ORDER);
  const unique = Array.from(new Set(expanded)).filter((k) => validSet.has(k));

  for (const item of DEFAULT_HOME_SECTIONS_ORDER) {
    if (!unique.includes(item)) {
      unique.push(item);
    }
  }
  return unique;
}

// ================= BỘ NHỚ ĐỆM NHANH (IN-MEMORY CACHE) =================
interface CacheEntry<T> {
  data: T;
  expiry: number;
}
const dataCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 60 * 1000; // 60 giây, tự động làm mới hoặc xóa khi Quản trị viên lưu

export function clearDataCache(keyPrefix?: string): void {
  if (!keyPrefix) {
    dataCache.clear();
  } else {
    dataCache.forEach((_, key) => {
      if (key.startsWith(keyPrefix)) {
        dataCache.delete(key);
      }
    });
  }
}

async function getCachedOrFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs = CACHE_TTL_MS): Promise<T> {
  const cached = dataCache.get(key);
  if (cached && cached.expiry > Date.now()) {
    return cached.data;
  }
  const data = await fetcher();
  dataCache.set(key, { data, expiry: Date.now() + ttlMs });
  return data;
}

export async function getSettings(): Promise<Settings> {
  return getCachedOrFetch('settings', async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('workspace_id', 'default')
          .single();
        if (data) {
          return {
            ...data,
            author_profile: normalizeAuthorProfile(data.author_profile),
            home_greeting: data.home_greeting || data.block_styles?.home_greeting || 'Xin chào!',
            home_title: data.home_title || data.block_styles?.home_title || 'Hôm nay mình học gì?',
            search_placeholder: data.search_placeholder || data.block_styles?.search_placeholder || 'Tìm bài, ví dụ: đĩa đệm',
            topics_title: data.topics_title || data.block_styles?.topics_title || 'Chọn chủ đề',
            recommended_books_title: data.recommended_books_title || data.block_styles?.recommended_books_title || 'Sách nên đọc',
            recommended_books: normalizeRecommendedBooks(data.recommended_books || data.block_styles?.recommended_books),
            recommended_books_layout: data.recommended_books_layout || data.block_styles?.recommended_books_layout || 'grid',
            home_sections_order: normalizeHomeSectionsOrder(data.home_sections_order || data.block_styles?.home_sections_order),
            ai_training: normalizeAiTraining(data.ai_training || data.block_styles?.ai_training),
          } as Settings;
        }
      } catch {
        // fallback
      }
    }
    return sampleSettings;
  });
}

export async function getTopics(includeHidden = false): Promise<Topic[]> {
  const cacheKey = `topics:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let query = supabase.from('topics').select('*').eq('workspace_id', 'default');
        if (!includeHidden) {
          query = query.eq('is_visible', true);
        }
        const { data } = await query.order('sort_order', { ascending: true });
        if (data && data.length > 0) return data as Topic[];
      } catch {
        // fallback
      }
    }
    return sampleTopics
      .filter((t) => includeHidden || t.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order);
  });
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const cacheKey = `topic_by_slug:${slug}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('topics')
          .select('*')
          .eq('workspace_id', 'default')
          .eq('slug', slug)
          .single();
        if (data) return data as Topic;
      } catch {
        // fallback
      }
    }
    const topic = sampleTopics.find((t) => t.slug === slug);
    return topic || null;
  });
}

export async function getPagesByTopic(topicId: string, includeHidden = false): Promise<Page[]> {
  const cacheKey = `pages_by_topic:${topicId}:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let query = supabase.from('pages').select('*').eq('topic_id', topicId);
        if (!includeHidden) {
          query = query.eq('is_visible', true).eq('status', 'published');
        }
        const { data } = await query.order('sort_order', { ascending: true });
        if (data) return data as Page[];
      } catch {
        // fallback
      }
    }
    return samplePages
      .filter((p) => p.topic_id === topicId && (includeHidden || (p.is_visible && p.status === 'published')))
      .sort((a, b) => a.sort_order - b.sort_order);
  });
}

/**
 * Tối ưu hóa siêu tốc cho Trang chủ: Lấy toàn bộ chủ đề kèm số lượng bài học chỉ trong 1 lần truy vấn
 */
export async function getTopicsWithCounts(includeHidden = false): Promise<{ topic: Topic; pageCount: number }[]> {
  const cacheKey = `topics_with_counts:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const topics = await getTopics(includeHidden);
    const supabase = getSupabaseClient();
    const pageCounts: Record<string, number> = {};

    if (supabase) {
      try {
        let query = supabase.from('pages').select('id, topic_id, is_visible, status');
        if (!includeHidden) {
          query = query.eq('is_visible', true).eq('status', 'published');
        }
        const { data } = await query;
        if (data) {
          for (const row of data) {
            if (row.topic_id) {
              pageCounts[row.topic_id] = (pageCounts[row.topic_id] || 0) + 1;
            }
          }
        }
      } catch {
        // fallback
      }
    }

    return topics.map((topic) => ({
      topic,
      pageCount: pageCounts[topic.id] ?? samplePages.filter((p) => p.topic_id === topic.id).length,
    }));
  });
}

export async function getPageBySlug(
  topicSlug: string,
  pageSlug: string,
  includeHidden = false
): Promise<{ topic: Topic; page: Page; pageIndex: number; totalPages: number } | null> {
  const topic = await getTopicBySlug(topicSlug);
  if (!topic) return null;

  const pages = await getPagesByTopic(topic.id, includeHidden);
  const pageIndex = pages.findIndex((p) => p.slug === pageSlug);
  if (pageIndex === -1) return null;

  return {
    topic,
    page: pages[pageIndex],
    pageIndex: pageIndex + 1,
    totalPages: pages.length,
  };
}

export async function getPageById(id: string): Promise<Page | null> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data } = await supabase.from('pages').select('*').eq('id', id).single();
      if (data) return data as Page;
    } catch {
      // fallback
    }
  }
  const page = samplePages.find((p) => p.id === id);
  return page || null;
}

export async function getBlocksByPage(pageId: string, includeHidden = false): Promise<Block[]> {
  const cacheKey = `blocks_by_page:${pageId}:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        let query = supabase.from('blocks').select('*').eq('page_id', pageId);
        if (!includeHidden) {
          query = query.eq('is_visible', true);
        }
        const { data } = await query.order('sort_order', { ascending: true });
        if (data && data.length > 0) return data as Block[];
      } catch {
        // fallback
      }
    }
    return sampleBlocks
      .filter((b) => b.page_id === pageId && (includeHidden || b.is_visible))
      .sort((a, b) => a.sort_order - b.sort_order);
  });
}

export async function getTopicPageCount(topicId: string): Promise<number> {
  const pages = await getPagesByTopic(topicId);
  return pages.length;
}

export async function getTopicVideoCount(topicId: string): Promise<number> {
  const pages = await getPagesByTopic(topicId);
  let totalVideos = 0;
  for (const page of pages) {
    const blocks = await getBlocksByPage(page.id);
    for (const block of blocks) {
      if (block.type === 'videos') {
        totalVideos += block.data.videos.length;
      }
    }
  }
  return totalVideos;
}

export async function getContinue(): Promise<ContinueInfo | null> {
  return {
    topic_slug: 'cot-song',
    topic_title: 'Cột sống',
    page_slug: 'tong-quan-ve-cot-song',
    page_title: 'Tổng quan về cột sống',
    page_order_label: '01',
    video_index: 3,
    video_total: 4,
    video_title: 'Cơ – gân – dây chằng',
  };
}
