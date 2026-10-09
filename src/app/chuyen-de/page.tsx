import React from 'react';
import { Metadata } from 'next';
import { getAllBlocks, getAllPages, getSettings, getTopicsWithCounts } from '../../lib/data';
import TopicListClient from '../../components/TopicListClient';
import BottomNav from '../../components/BottomNav';
import { Block } from '../../lib/types';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Chuyên đề · Tất cả bài học',
  description: 'Tất cả chuyên đề và bài học giải phẫu, chăm sóc cơ thể',
};

export default async function AllTopicsPage() {
  const [settings, topicsWithCounts, allPages, allBlocks] = await Promise.all([
    getSettings(),
    getTopicsWithCounts(true),
    getAllPages(true),
    getAllBlocks(true),
  ]);
  const visibleTopics = topicsWithCounts;
  const topicFaqs: Array<{
    id: string; blockId: string; itemId: string; block: Extract<Block, { type: 'faq' }>;
    question: string; answer: string; topicId: string; topicTitle: string; faqCategoryId: string; faqCategoryTitle: string; topicSlug: string; pageTitle: string;
    learningAnswers: Array<{ id: string; text: string; topicId: string; topicTitle: string; destinationType?: 'video' | 'topic'; href?: string; videoTitle: string; thumbnailUrl?: string | null }>;
    videos: { title: string; thumbnailUrl?: string | null; href: string }[];
  }> = [];
  const topicPageRecords: Array<{ topic: (typeof visibleTopics)[number]['topic']; page: (typeof allPages)[number]; blocks: Block[]; videos: { title: string; thumbnailUrl?: string | null; href: string }[] }> = [];

  // Nhóm blocks và pages theo id trong bộ nhớ RAM (0ms)
  const blocksByPageMap = new Map<string, Block[]>();
  for (const b of allBlocks) {
    const list = blocksByPageMap.get(b.page_id);
    if (list) {
      list.push(b);
    } else {
      blocksByPageMap.set(b.page_id, [b]);
    }
  }

  const pagesByTopicMap = new Map<string, typeof allPages>();
  for (const p of allPages) {
    const list = pagesByTopicMap.get(p.topic_id);
    if (list) {
      list.push(p);
    } else {
      pagesByTopicMap.set(p.topic_id, [p]);
    }
  }

  for (const { topic } of visibleTopics) {
    const pages = (pagesByTopicMap.get(topic.id) || []).sort((a, b) => a.sort_order - b.sort_order);
    for (const page of pages) {
      const blocks = blocksByPageMap.get(page.id) || [];
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
  const faqVideoOptions = topicPageRecords.flatMap(({ topic, page, blocks }) => {
    let index = 0;
    return blocks.flatMap((block) => block.type === 'videos' && Array.isArray(block.data?.videos) ? block.data.videos.map((video) => {
      index += 1;
      return { key: `${page.id}:${index}`, page_id: page.id, page_title: page.title, page_slug: page.slug, video_title: video.title || `Video ${index}`, thumbnail_url: video.thumbnail_url, index, topic_id: topic.id, topic_title: topic.title, topic_slug: topic.slug };
    }) : []);
  });
  for (const { topic, page, blocks, videos } of topicPageRecords) {
    for (const block of blocks) {
      if (block.type !== 'faq' || !block.is_visible || block.data.faq_surface !== 'overview') continue;
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
        initialDisplay="catalog"
        initialFeaturedTopicIds={settings.featured_topic_ids}
        initialHiddenHomeTopicIds={settings.hidden_home_topic_ids}
        settingsScope="page"
        initialDescription={settings.topics_description}
        initialGuide={settings.topics_guide}
        initialFaqs={topicFaqs}
        initialFaqVideos={faqVideoOptions}
        initialFaqTopics={visibleTopics.map(({ topic }) => ({ id: topic.id, title: topic.title }))}
        hideViewAll
        enableSearch
      />

      <BottomNav />
    </main>
  );
}
