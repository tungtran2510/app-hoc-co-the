import {
  sampleSettings,
  sampleTopics,
  samplePages,
  sampleBlocks,
} from '../data/sample';
import {
  Settings,
  Topic,
  Page,
  Block,
  ContinueInfo,
} from './types';

export async function getSettings(): Promise<Settings> {
  return sampleSettings;
}

export async function getTopics(): Promise<Topic[]> {
  return sampleTopics
    .filter((t) => t.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const topic = sampleTopics.find((t) => t.slug === slug && t.is_visible);
  return topic || null;
}

export async function getPagesByTopic(topicId: string): Promise<Page[]> {
  return samplePages
    .filter((p) => p.topic_id === topicId && p.is_visible && p.status === 'published')
    .sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPageBySlug(
  topicSlug: string,
  pageSlug: string
): Promise<{ topic: Topic; page: Page; pageIndex: number; totalPages: number } | null> {
  const topic = await getTopicBySlug(topicSlug);
  if (!topic) return null;

  const pages = await getPagesByTopic(topic.id);
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
  const page = samplePages.find(
    (p) => p.id === id && p.is_visible && p.status === 'published'
  );
  return page || null;
}

export async function getBlocksByPage(pageId: string): Promise<Block[]> {
  return sampleBlocks
    .filter((b) => b.page_id === pageId && b.is_visible)
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
  // Lệnh 01: Dữ liệu cứng = trang tong-quan-ve-cot-song, video thứ 3
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
