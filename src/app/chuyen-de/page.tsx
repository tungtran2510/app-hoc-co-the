import React from 'react';
import { createHash } from 'node:crypto';
import { Metadata } from 'next';
import { getCachedLearningBlocksByPages, getCachedPagesByTopics, getCachedSettings, getCachedTopicsWithCounts } from '../../lib/cachedData';
import TopicListClient from '../../components/TopicListClient';
import BottomNav from '../../components/BottomNav';
import { Block } from '../../lib/types';

// Pre-render public FAQ/text at build time; admin edits invalidate this route.
export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Chuyên đề · Tất cả bài học',
  description: 'Tất cả chuyên đề và bài học giải phẫu, chăm sóc cơ thể',
};

export default async function AllTopicsPage() {
  const [settings, topicsWithCounts] = await Promise.all([getCachedSettings(), getCachedTopicsWithCounts(true)]);
  const visibleTopics = topicsWithCounts.filter(({ topic }) => topic.is_visible);
  const topicFaqs: Array<{
    id: string; blockId: string; itemId: string; block: Extract<Block, { type: 'faq' }>;
    question: string; answer: string; topicId: string; topicTitle: string; faqCategoryId: string; faqCategoryTitle: string; topicSlug: string; pageTitle: string;
    learningAnswers: Array<{ id: string; text: string; topicId: string; topicTitle: string; destinationType?: 'video' | 'topic'; href?: string; videoTitle: string; thumbnailUrl?: string | null }>;
    videos: { title: string; thumbnailUrl?: string | null; href: string }[];
  }> = [];
  const allPages = await getCachedPagesByTopics(visibleTopics.map(({ topic }) => topic.id), true);
  const pageIds = allPages.map((page) => page.id);
  const allLearningBlocks = await getCachedLearningBlocksByPages(pageIds);
  const blocksByPage = new Map<string, Block[]>();
  for (const block of allLearningBlocks) {
    const pageBlocks = blocksByPage.get(block.page_id) || [];
    pageBlocks.push(block);
    blocksByPage.set(block.page_id, pageBlocks);
  }
  const topicPageRecords: Array<{ topic: (typeof visibleTopics)[number]['topic']; page: (typeof allPages)[number]; blocks: Block[]; videos: { title: string; thumbnailUrl?: string | null; href: string }[] }> = [];
  for (const { topic } of visibleTopics) {
    for (const page of allPages.filter((entry) => entry.topic_id === topic.id)) {
      const blocks = blocksByPage.get(page.id) || [];
      let videoIndex = 0;
      const videos = blocks.flatMap((block) => block.type === 'videos' && Array.isArray(block.data?.videos)
        ? block.data.videos.map((video) => {
            videoIndex += 1;
            const title = video.title || `Video ${videoIndex}`;
            return { title, thumbnailUrl: video.thumbnail_url, href: `/${topic.slug}/${page.slug}?v=${videoIndex}` };
          })
        : []);
      topicPageRecords.push({ topic, page, blocks, videos });
    }
  }
  topicPageRecords.sort((a, b) => visibleTopics.findIndex(({ topic }) => topic.id === a.topic.id) - visibleTopics.findIndex(({ topic }) => topic.id === b.topic.id) || a.page.sort_order - b.page.sort_order);
  const faqVideoOptions = topicPageRecords.flatMap(({ topic, page, blocks }) => {
    let index = 0;
    return blocks.flatMap((block) => block.type === 'videos' && Array.isArray(block.data?.videos) ? block.data.videos.map((video) => {
      index += 1;
      return { key: `${page.id}:${index}`, page_id: page.id, page_title: page.title, page_slug: page.slug, video_title: video.title || `Video ${index}`, thumbnail_url: video.thumbnail_url, index, topic_id: topic.id, topic_title: topic.title, topic_slug: topic.slug };
    }) : []);
  });
  const persistedOverviewSources = new Set(allLearningBlocks.flatMap((block) =>
    block.type === 'faq' && block.data.faq_surface === 'overview' && block.data.faq_legacy_source_id
      ? [block.data.faq_legacy_source_id]
      : []
  ));
  const makeStableId = (value: string) => {
    const hex = createHash('sha256').update(`qbiz-faq-overview:${value}`).digest('hex').slice(0, 32).split('');
    hex[12] = '5';
    hex[16] = ((parseInt(hex[16], 16) & 0x3) | 0x8).toString(16);
    const raw = hex.join('');
    return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
  };
  for (const { topic, page, blocks, videos } of topicPageRecords) {
    for (const sourceBlock of blocks) {
      if (sourceBlock.type !== 'faq' || !sourceBlock.is_visible) continue;
      const isOverview = sourceBlock.data.faq_surface === 'overview';
      if (!isOverview && persistedOverviewSources.has(sourceBlock.id)) continue;
      // Legacy topic FAQs are copied as independent overview records. Editing one
      // surface never writes through to the other; saving materializes this copy.
      const block = isOverview ? sourceBlock : {
        ...sourceBlock,
        id: makeStableId(`block:${sourceBlock.id}`),
        data: {
          ...sourceBlock.data,
          title: `Vấn đề thường gặp · ${topic.title}`,
          faq_surface: 'overview' as const,
          faq_category_id: makeStableId(`category:${topic.id}`),
          faq_category_title: topic.title,
          faq_legacy_source_id: sourceBlock.id,
          items: sourceBlock.data.items.map((item) => ({
            ...item,
            id: makeStableId(`item:${sourceBlock.id}:${item.id}`),
            learning_answers: (item.learning_answers || []).map((answer) => ({
              ...answer,
              id: makeStableId(`answer:${sourceBlock.id}:${answer.id}`),
              video_links: (answer.video_links || []).map((link) => ({
                ...link,
                id: makeStableId(`video-link:${sourceBlock.id}:${link.id}`),
              })),
            })),
          })),
        },
      };
      for (const item of block.data.items || []) {
        if (item.is_visible === false || !item.question.trim()) continue;
        const learningAnswers = (item.learning_answers || []).flatMap((answer) => {
          const video = faqVideoOptions.find((option) => option.page_id === answer.target_page_id && option.index === answer.target_video_index);
          const category = { topic };
          const targetTopicId = topic.id;
          const targetTopic = visibleTopics.find(({ topic: option }) => option.id === targetTopicId)?.topic || topic;
          if (!video && !answer.target_topic_id && !answer.text.trim()) return [];
          const linkedVideos = (answer.video_links || []).flatMap((linked) => {
            const linkedVideo = faqVideoOptions.find((option) => option.page_id === linked.target_page_id && option.index === linked.target_video_index);
            return linkedVideo ? [{ href: `/${linkedVideo.topic_slug}/${linkedVideo.page_slug}?v=${linkedVideo.index}`, title: linkedVideo.video_title, thumbnailUrl: linkedVideo.thumbnail_url }] : [];
          });
          return [{ id: answer.id, text: answer.text, topicId: targetTopicId, topicTitle: category.topic.title, destinationType: video ? 'video' as const : answer.target_topic_id ? 'topic' as const : undefined, href: video ? `/${video.topic_slug}/${video.page_slug}?v=${video.index}` : answer.target_topic_id ? `/${targetTopic.slug}` : undefined, videoTitle: video?.video_title || (answer.target_topic_id ? `Mở chuyên đề ${targetTopic.title}` : ''), thumbnailUrl: video?.thumbnail_url, linkedVideos }];
        });
        topicFaqs.push({
          id: `${page.id}-${block.id}-${item.id}`, blockId: block.id, itemId: item.id, block,
          question: item.question, answer: item.answer, topicId: topic.id, topicTitle: topic.title,
          faqCategoryId: block.data.faq_category_id || topic.id,
          faqCategoryTitle: block.data.faq_category_title || topic.title,
          topicSlug: topic.slug, pageTitle: page.title, learningAnswers, videos,
        });
      }
    }
  }

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-4 pb-28 gap-4 max-w-lg md:max-w-3xl mx-auto w-full">

      <TopicListClient
        initialTopics={topicsWithCounts}
        initialTopicsTitle={settings.topics_title || 'Chuyên Đề Học'}
        initialDisplay={settings.topics_page_display || settings.topics_display}
        initialFeaturedTopicIds={settings.featured_topic_ids}
        settingsScope="page"
        initialDescription={settings.topics_description}
        initialGuide={settings.topics_guide}
        initialFaqs={topicFaqs}
        initialFaqVideos={faqVideoOptions}
        initialFaqTopics={visibleTopics.map(({ topic }) => ({ id: topic.id, title: topic.title }))}
        initialFaqStoragePageId={allPages.find((page) => page.is_visible && page.status === 'published')?.id}
        hideViewAll
        enableSearch
      />

      <BottomNav />
    </main>
  );
}
