import React from 'react';
import { Metadata } from 'next';
import { getBlocksByPage, getPagesByTopic, getSettings, getTopicsWithCounts } from '../../lib/data';
import TopicListClient from '../../components/TopicListClient';
import BottomNav from '../../components/BottomNav';

export const revalidate = 30;

export const metadata: Metadata = {
  title: 'Chuyên đề · Tất cả bài học',
  description: 'Tất cả chuyên đề và bài học giải phẫu, chăm sóc cơ thể',
};

export default async function AllTopicsPage() {
  const [settings, topicsWithCounts] = await Promise.all([getSettings(), getTopicsWithCounts(true)]);
  const visibleTopics = topicsWithCounts.filter(({ topic }) => topic.is_visible);
  const topicFaqs = (await Promise.all(visibleTopics.map(async ({ topic }) => {
    const pages = await getPagesByTopic(topic.id);
    return Promise.all(pages.map(async (page) => {
      const blocks = await getBlocksByPage(page.id);
      let videoIndex = 0;
      const videos = blocks.flatMap((block) => block.type === 'videos' && Array.isArray(block.data?.videos)
        ? block.data.videos.map((video) => {
            videoIndex += 1;
            return {
              title: video.title || `Video ${videoIndex}`,
              thumbnailUrl: video.thumbnail_url,
              href: `/${topic.slug}/${page.slug}?v=${videoIndex}`,
            };
          })
        : []);

      return blocks.flatMap((block) => block.type === 'faq'
        ? (block.data.items || []).map((item) => ({
            id: `${page.id}-${block.id}-${item.id}`,
            question: item.question,
            answer: item.answer,
            topicTitle: topic.title,
            topicSlug: topic.slug,
            pageTitle: page.title,
            videos,
          }))
        : []);
    }));
  }))).flat(2);

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
        hideViewAll
        enableSearch
      />

      <BottomNav />
    </main>
  );
}
