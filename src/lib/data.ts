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
import { getSupabaseServer } from './supabaseServer';

function getSupabase() {
  if (typeof window === 'undefined') {
    const srv = getSupabaseServer();
    if (srv) return srv;
  }
  return getSupabaseClient();
}

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
    category: item.category || item.tag || null,
    badge_tag: item.badge_tag || null,
    tag: item.tag || null,
    color_theme: item.color_theme || null,
    cover_url: item.cover_url || null,
    description: item.description || '',
    author: item.author || '',
    link_url: item.link_url || '',
    youtube_url: item.youtube_url || null,
    gallery_images: Array.isArray(item.gallery_images) ? item.gallery_images.filter(Boolean) : [],
    flipbook_pages: Array.isArray(item.flipbook_pages) ? item.flipbook_pages.filter(Boolean) : [],
    file_url: item.file_url || null,
    file_name: item.file_name || null,
    pdf_url: item.pdf_url || null,
    is_visible: item.is_visible !== undefined ? Boolean(item.is_visible) : true,
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
    title: raw.title !== undefined && raw.title !== null ? raw.title : DEFAULT_AUTHOR_PROFILE.title,
    avatar_url: raw.avatar_url !== undefined && raw.avatar_url !== null && raw.avatar_url !== '' ? raw.avatar_url : DEFAULT_AUTHOR_PROFILE.avatar_url,
    extra_title: raw.extra_title !== undefined && raw.extra_title !== null ? raw.extra_title : DEFAULT_AUTHOR_PROFILE.extra_title,
    extra_content: raw.extra_content !== undefined && raw.extra_content !== null ? raw.extra_content : DEFAULT_AUTHOR_PROFILE.extra_content,
    books_title: raw.books_title !== undefined && raw.books_title !== null ? raw.books_title : 'Sách & Tác phẩm đã làm',
    books_subtitle: raw.books_subtitle !== undefined && raw.books_subtitle !== null ? raw.books_subtitle : '',
    contact_title: raw.contact_title !== undefined && raw.contact_title !== null ? raw.contact_title : 'Thông tin liên hệ & Kết nối',
    contact_subtitle: raw.contact_subtitle !== undefined && raw.contact_subtitle !== null ? raw.contact_subtitle : 'Kết nối trực tiếp cùng chuyên gia / tác giả',
    books: Array.isArray(raw.books)
      ? raw.books.map((b: any) => ({
          ...b,
          gallery_images: Array.isArray(b.gallery_images) ? b.gallery_images.filter(Boolean) : [],
          flipbook_pages: Array.isArray(b.flipbook_pages) ? b.flipbook_pages.filter(Boolean) : [],
          is_visible: b.is_visible !== undefined ? Boolean(b.is_visible) : true,
        }))
      : DEFAULT_AUTHOR_PROFILE.books,
    phone: raw.phone !== undefined && raw.phone !== null ? raw.phone : DEFAULT_AUTHOR_PROFILE.phone,
    zalo_url: raw.zalo_url !== undefined && raw.zalo_url !== null ? raw.zalo_url : DEFAULT_AUTHOR_PROFILE.zalo_url,
    email: raw.email !== undefined && raw.email !== null ? raw.email : DEFAULT_AUTHOR_PROFILE.email,
    facebook_url: raw.facebook_url !== undefined && raw.facebook_url !== null ? raw.facebook_url : DEFAULT_AUTHOR_PROFILE.facebook_url,
    address: raw.address !== undefined && raw.address !== null ? raw.address : DEFAULT_AUTHOR_PROFILE.address,
    contact_note: raw.contact_note !== undefined && raw.contact_note !== null ? raw.contact_note : DEFAULT_AUTHOR_PROFILE.contact_note,
  };
}

export const DEFAULT_HOME_SECTIONS_ORDER = [
  'brand_card',
  'topics',
  'recent_activity',
  'author_profile',
  'author_books',
  'author_philosophy',
  'recommended_books',
  'flat_books',
  'author_contact',
];

export function isCustomHomeSectionKey(key: string): boolean {
  return /^custom_[A-Za-z0-9-]{4,64}$/.test(key);
}

export function normalizeHiddenHomeSections(raw?: any): string[] {
  if (!Array.isArray(raw)) return [];
  const validSet = new Set(DEFAULT_HOME_SECTIONS_ORDER);
  // Khối chuyên đề ('topics') là khối học tập cốt lõi của ứng dụng, luôn luôn hiển thị trên Trang chủ
  return raw.filter((key): key is string => typeof key === 'string' && key !== 'topics' && (validSet.has(key) || isCustomHomeSectionKey(key)));
}

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
  const unique = Array.from(new Set(expanded)).filter((k) => validSet.has(k) || isCustomHomeSectionKey(k));

  // Tự động bổ sung brand_card lên đầu nếu dữ liệu cũ chưa có
  if (!unique.includes('brand_card')) {
    unique.unshift('brand_card');
  }

  // Tự động đảm bảo topics luôn hiện diện và nằm ngay sau brand_card
  if (!unique.includes('topics')) {
    const brandIdx = unique.indexOf('brand_card');
    if (brandIdx !== -1) {
      unique.splice(brandIdx + 1, 0, 'topics');
    } else {
      unique.unshift('topics');
    }
  } else {
    // Đưa topics lên đúng vị trí ngay sau brand_card
    const brandIdx = unique.indexOf('brand_card');
    const topicsIdx = unique.indexOf('topics');
    if (brandIdx !== -1 && topicsIdx !== brandIdx + 1) {
      unique.splice(topicsIdx, 1);
      unique.splice(brandIdx + 1, 0, 'topics');
    }
  }

  // Tự động bổ sung recent_activity ngay sau topics nếu dữ liệu cũ chưa có
  if (!unique.includes('recent_activity')) {
    const topicsIdx = unique.indexOf('topics');
    if (topicsIdx !== -1) {
      unique.splice(topicsIdx + 1, 0, 'recent_activity');
    } else {
      unique.push('recent_activity');
    }
  }

  // Tự động bổ sung flat_books ngay sau recommended_books nếu dữ liệu cũ chưa có
  if (!unique.includes('flat_books')) {
    const recIdx = unique.indexOf('recommended_books');
    if (recIdx !== -1) {
      unique.splice(recIdx + 1, 0, 'flat_books');
    } else {
      unique.push('flat_books');
    }
  }

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
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 phút tối ưu hiệu năng, tự động làm mới tức thì khi Admin bấm lưu

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

export async function getSettings(includeAiTraining = false): Promise<Settings> {
  const cacheKey = includeAiTraining ? 'settings:full' : 'settings:light';
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('settings')
          .select('*')
          .eq('workspace_id', 'default')
          .single();
        if (data) {
          const authProfile = normalizeAuthorProfile(data.author_profile);
          const finalHotline = data.hotline || authProfile.phone || DEFAULT_AUTHOR_PROFILE.phone;
          const finalZaloUrl = data.zalo_url || authProfile.zalo_url || DEFAULT_AUTHOR_PROFILE.zalo_url;

          // Loại bỏ trường nặng ai_training khỏi block_styles nếu không cần thiết để giảm tải >67KB payload
          const sanitizedBlockStyles = (data.block_styles && typeof data.block_styles === 'object')
            ? { ...data.block_styles }
            : {};
          if (!includeAiTraining && 'ai_training' in sanitizedBlockStyles) {
            delete sanitizedBlockStyles.ai_training;
          }

          return {
            ...data,
            block_styles: sanitizedBlockStyles,
            app_name: data.app_name || 'Qbiz Books',
            primary_color: data.primary_color || '#0C0817',
            hotline: finalHotline,
            zalo_url: finalZaloUrl,
            app_subtitle: data.app_subtitle !== undefined ? data.app_subtitle : (sanitizedBlockStyles.app_subtitle !== undefined ? sanitizedBlockStyles.app_subtitle : null),
            brand_tagline: data.brand_tagline !== undefined ? data.brand_tagline : (sanitizedBlockStyles.brand_tagline !== undefined ? sanitizedBlockStyles.brand_tagline : 'EMPOWERING MEDICAL KNOWLEDGE'),
            author_profile: {
              ...authProfile,
              phone: finalHotline,
              zalo_url: finalZaloUrl,
            },
            home_greeting: data.home_greeting || sanitizedBlockStyles.home_greeting || 'Xin chào!',
            home_title: data.home_title || sanitizedBlockStyles.home_title || 'Hôm nay mình học gì?',
            search_placeholder: data.search_placeholder || sanitizedBlockStyles.search_placeholder || 'Tìm bài, ví dụ: đĩa đệm',
            topics_title: data.topics_title || sanitizedBlockStyles.topics_title || 'Chuyên Đề Học',
            home_topics_display: sanitizedBlockStyles.home_topics_display || sanitizedBlockStyles.topics_display || 'card',
            topics_page_display: sanitizedBlockStyles.topics_page_display || sanitizedBlockStyles.topics_display || 'card',
            featured_topic_ids: Array.isArray(sanitizedBlockStyles.featured_topic_ids) ? sanitizedBlockStyles.featured_topic_ids : [],
            recommended_books_title: data.recommended_books_title || sanitizedBlockStyles.recommended_books_title || 'Tài Liệu Y Khoa',
            recommended_books_subtitle: data.recommended_books_subtitle || sanitizedBlockStyles.recommended_books_subtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày',
            recommended_books: normalizeRecommendedBooks(data.recommended_books || sanitizedBlockStyles.recommended_books),
            recommended_books_layout: data.recommended_books_layout || sanitizedBlockStyles.recommended_books_layout || 'grid',
            flat_books_title: data.flat_books_title || sanitizedBlockStyles.flat_books_title || 'Tủ Sách Tối Giản',
            flat_books: normalizeRecommendedBooks(data.flat_books || sanitizedBlockStyles.flat_books || DEFAULT_RECOMMENDED_BOOKS),
            home_sections_order: normalizeHomeSectionsOrder(data.home_sections_order || sanitizedBlockStyles.home_sections_order),
            hidden_home_sections: normalizeHiddenHomeSections(data.hidden_home_sections || sanitizedBlockStyles.hidden_home_sections),
            ai_training: includeAiTraining ? normalizeAiTraining(data.ai_training || data.block_styles?.ai_training) : DEFAULT_AI_TRAINING,
            welcome_title: data.welcome_title || sanitizedBlockStyles.welcome_title || 'Chào mừng bạn đến với Qbiz Books',
            welcome_message: data.welcome_message || sanitizedBlockStyles.welcome_message || 'Hi vọng nền tảng học hiểu cơ thể và chăm sóc sức khỏe chủ động này sẽ giúp bạn hiểu sâu hơn về cơ thể mình, nuôi dưỡng hệ cơ xương khớp và sống khỏe mỗi ngày.',
            welcome_video_url: data.welcome_video_url || sanitizedBlockStyles.welcome_video_url || 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
            home_custom_blocks: (sanitizedBlockStyles.home_custom_blocks && typeof sanitizedBlockStyles.home_custom_blocks === 'object') ? sanitizedBlockStyles.home_custom_blocks : {},
            topics_display: ['card', 'text', 'logo', 'large'].includes(sanitizedBlockStyles.topics_display) ? sanitizedBlockStyles.topics_display : 'card',
            topics_description: sanitizedBlockStyles.topics_description || 'Hệ thống chuyên đề & bài học giải phẫu cơ thể',
            topics_guide: (sanitizedBlockStyles.topics_guide && typeof sanitizedBlockStyles.topics_guide === 'object') ? sanitizedBlockStyles.topics_guide : null,
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
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
    const supabase = getSupabase();
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
  const supabase = getSupabase();
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

/**
 * Khối Hỏi-Đáp (FAQ) được lưu trong bảng blocks dưới dạng type 'text' + data.__kind = 'faq'
 * (vì ràng buộc blocks_type_check của CSDL chưa cho phép type 'faq'). Hàm này giải mã lại khi đọc.
 */
export function decodeBlockRow(row: any): Block {
  if (row && row.type === 'text' && row.data && row.data.__kind === 'faq') {
    const { __kind, __style, ...rest } = row.data;
    return { ...row, type: 'faq', display_style: __style || 'accordion', data: rest } as Block;
  }
  if (row && row.type === 'text' && row.data && row.data.__kind === 'books') {
    const { __kind, __style, ...rest } = row.data;
    return { ...row, type: 'books', display_style: __style || 'list', data: rest } as Block;
  }
  return row as Block;
}

export async function getBlocksByPage(pageId: string, includeHidden = false): Promise<Block[]> {
  const cacheKey = `blocks_by_page:${pageId}:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('blocks').select('*').eq('page_id', pageId);
        if (!includeHidden) {
          query = query.eq('is_visible', true);
        }
        const { data } = await query.order('sort_order', { ascending: true });
        if (data && data.length > 0) return data.map(decodeBlockRow);
      } catch {
        // fallback
      }
    }
    return sampleBlocks
      .filter((b) => b.page_id === pageId && (includeHidden || b.is_visible))
      .sort((a, b) => a.sort_order - b.sort_order);
  });
}

/**
 * Tải toàn bộ khối (blocks) của nhiều bài học trong 1 truy vấn duy nhất.
 * Giảm triệt để N+1 queries, tăng tốc độ tải trang chuyên đề từ 2.8s xuống < 200ms.
 */
export async function getBlocksByPages(pageIds: string[], includeHidden = false): Promise<Record<string, Block[]>> {
  if (!pageIds || pageIds.length === 0) return {};
  const cacheKey = `blocks_by_pages:${pageIds.sort().join(',')}:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabase();
    const result: Record<string, Block[]> = {};
    pageIds.forEach((id) => {
      result[id] = [];
    });

    if (supabase) {
      try {
        let query = supabase.from('blocks').select('id, page_id, type, data, is_visible, sort_order').in('page_id', pageIds);
        if (!includeHidden) {
          query = query.eq('is_visible', true);
        }
        const { data } = await query.order('sort_order', { ascending: true });
        if (data && data.length > 0) {
          for (const row of data) {
            const decoded = decodeBlockRow(row);
            if (result[decoded.page_id]) {
              result[decoded.page_id].push(decoded);
            } else {
              result[decoded.page_id] = [decoded];
            }
          }
          return result;
        }
      } catch {
        // fallback
      }
    }

    sampleBlocks
      .filter((b) => pageIds.includes(b.page_id) && (includeHidden || b.is_visible))
      .sort((a, b) => a.sort_order - b.sort_order)
      .forEach((b) => {
        const decoded = decodeBlockRow(b);
        if (result[decoded.page_id]) {
          result[decoded.page_id].push(decoded);
        } else {
          result[decoded.page_id] = [decoded];
        }
      });

    return result;
  });
}

export async function getAllPages(includeHidden = false): Promise<Page[]> {
  const cacheKey = `all_pages:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('pages').select('*');
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
      .filter((p) => includeHidden || (p.is_visible && p.status === 'published'))
      .sort((a, b) => a.sort_order - b.sort_order);
  });
}

export async function getAllBlocks(includeHidden = false): Promise<Block[]> {
  const cacheKey = `all_blocks:${includeHidden}`;
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabase();
    if (supabase) {
      try {
        let query = supabase.from('blocks').select('id, page_id, type, data, is_visible, sort_order');
        if (!includeHidden) {
          query = query.eq('is_visible', true);
        }
        const { data } = await query.order('sort_order', { ascending: true });
        if (data && data.length > 0) return data.map(decodeBlockRow);
      } catch {
        // fallback
      }
    }
    return sampleBlocks
      .filter((b) => includeHidden || b.is_visible)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(decodeBlockRow);
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

export async function getAllPageSlugMap(): Promise<Record<string, { slug: string; topicSlug: string; title: string; cover_url: string }>> {
  const cacheKey = 'all_page_slug_map';
  return getCachedOrFetch(cacheKey, async () => {
    const supabase = getSupabase();
    const map: Record<string, { slug: string; topicSlug: string; title: string; cover_url: string }> = {};
    if (supabase) {
      try {
        const [{ data: topics }, { data: pages }] = await Promise.all([
          supabase.from('topics').select('id, slug'),
          supabase.from('pages').select('id, topic_id, slug, title, cover_url'),
        ]);
        if (topics && pages) {
          const topicMap = Object.fromEntries(topics.map((t) => [t.id, t.slug]));
          pages.forEach((p) => {
            const topicSlug = topicMap[p.topic_id] || 'cot-song';
            const info = {
              slug: p.slug,
              topicSlug,
              title: p.title,
              cover_url: p.cover_url || `/images/lessons/${p.slug}.jpg`,
            };
            map[p.id] = info;
            map[p.slug] = info;
          });
          return map;
        }
      } catch {
        // fallback
      }
    }
    const sampleTopicMap = Object.fromEntries(sampleTopics.map((t) => [t.id, t.slug]));
    samplePages.forEach((p) => {
      const topicSlug = sampleTopicMap[p.topic_id] || 'cot-song';
      const info = {
        slug: p.slug,
        topicSlug,
        title: p.title,
        cover_url: p.cover_url || `/images/lessons/${p.slug}.jpg`,
      };
      map[p.id] = info;
      map[p.slug] = info;
    });
    return map;
  });
}
