import {
  sampleSettings,
  sampleTopics,
  samplePages,
  sampleBlocks,
  DEFAULT_AUTHOR_PROFILE,
  DEFAULT_RECOMMENDED_BOOKS,
} from '../data/sample';
import {
  Settings,
  Topic,
  Page,
  Block,
  ContinueInfo,
  AuthorProfile,
  RecommendedBook,
} from './types';
import { getSupabaseClient } from './supabaseClient';

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
    books: Array.isArray(raw.books) && raw.books.length > 0 ? raw.books : DEFAULT_AUTHOR_PROFILE.books,
    phone: raw.phone !== undefined ? raw.phone : DEFAULT_AUTHOR_PROFILE.phone,
    zalo_url: raw.zalo_url !== undefined ? raw.zalo_url : DEFAULT_AUTHOR_PROFILE.zalo_url,
    email: raw.email !== undefined ? raw.email : DEFAULT_AUTHOR_PROFILE.email,
    facebook_url: raw.facebook_url !== undefined ? raw.facebook_url : DEFAULT_AUTHOR_PROFILE.facebook_url,
    address: raw.address !== undefined ? raw.address : DEFAULT_AUTHOR_PROFILE.address,
    contact_note: raw.contact_note !== undefined ? raw.contact_note : DEFAULT_AUTHOR_PROFILE.contact_note,
  };
}

export async function getSettings(): Promise<Settings> {
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
          recommended_books_subtitle: data.recommended_books_subtitle || data.block_styles?.recommended_books_subtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày',
          recommended_books: normalizeRecommendedBooks(data.recommended_books || data.block_styles?.recommended_books),
        } as Settings;
      }
    } catch {
      // fallback
    }
  }
  return sampleSettings;
}

export async function getTopics(includeHidden = false): Promise<Topic[]> {
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
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
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
}

export async function getPagesByTopic(topicId: string, includeHidden = false): Promise<Page[]> {
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
