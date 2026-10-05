import React from 'react';
import { notFound } from 'next/navigation';
import { getCachedLearningBlocksByPages, getCachedPagesByTopic, getCachedSettings, getCachedTopicBySlug } from '../../lib/cachedData';
import TopicHeaderNav from '../../components/TopicHeaderNav';
import TopicLearningExperience from '../../components/TopicLearningExperience';
import BottomNav from '../../components/BottomNav';
import { Metadata } from 'next';

interface TopicPageProps { params: { topicSlug: string } }

export const revalidate = 60;

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const [topic, settings] = await Promise.all([getCachedTopicBySlug(params.topicSlug), getCachedSettings()]);
  if (!topic) return { title: 'Không tìm thấy chủ đề' };
  return {
    title: `${topic.title} · ${settings?.app_name || 'Học Cơ Thể'}`,
    description: topic.description || `Khám phá kiến thức ${topic.title}`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await getCachedTopicBySlug(params.topicSlug);
  if (!topic) notFound();

  const pages = await getCachedPagesByTopic(topic.id, true);
  const learningBlocks = await getCachedLearningBlocksByPages(pages.map((page) => page.id));
  const blocksByPage = new Map<string, typeof learningBlocks>();
  for (const block of learningBlocks) {
    const pageBlocks = blocksByPage.get(block.page_id) || [];
    pageBlocks.push(block);
    blocksByPage.set(block.page_id, pageBlocks);
  }
  const pagesWithDetails = pages.map((page, index) => {
    const blocks = blocksByPage.get(page.id) || [];
    let videoCount = 0;
    const pageVideos: Array<{ video: import('../../lib/types').Video; index: number; pageSlug: string }> = [];
    for (const block of blocks) {
      if (block.type === 'videos' && Array.isArray(block.data?.videos)) {
        block.data.videos.forEach((video) => pageVideos.push({ video, index: pageVideos.length + 1, pageSlug: page.slug }));
        videoCount += block.data.videos.length;
      }
    }
    const faqGroups = blocks.flatMap((block) => {
      if (block.type !== 'faq' || !block.is_visible || block.data.faq_surface === 'overview') return [];
      const items = (block.data.items || []).filter((item) => item.is_visible !== false && (item.question.trim() || item.answer.trim()));
      if (items.length === 0) return [];
      return [{
        id: block.id,
        title: block.data.title || 'Vấn đề thường gặp',
        description: block.data.description || '',
        scope: block.data.scope || 'topic',
        target_page_id: block.data.target_page_id || '',
        target_video_index: block.data.target_video_index || 0,
        pageTitle: page.title,
        items: items.map((item) => ({ ...item, id: `${page.id}-${block.id}-${item.id}` })),
      }];
    });
    return { page, orderNumber: index + 1, videoCount, pageVideos, faqGroups };
  });

  const totalVideos = pagesWithDetails.reduce((sum, item) => sum + item.videoCount, 0);
  const topicVideos = pagesWithDetails.flatMap(({ page, pageVideos }) => pageVideos.map((entry) => ({ ...entry, pageId: page.id })));
  const faqs = pagesWithDetails.flatMap((item) => item.faqGroups.map((group) => ({
    ...group,
    targetVideo: group.scope === 'video'
      ? topicVideos.find((entry) => entry.pageId === group.target_page_id && entry.index === group.target_video_index) || null
      : null,
    items: group.items.map((faqItem) => ({
      ...faqItem,
      learning_answers: (faqItem.learning_answers || []).map((answer) => {
        const video = topicVideos.find((entry) => entry.pageId === answer.target_page_id && entry.index === answer.target_video_index);
        return {
          ...answer,
          target_url: video ? `/${topic.slug}/${video.pageSlug}?v=${video.index}` : answer.target_topic_id === topic.id ? `/${topic.slug}` : undefined,
          target_kind: video ? 'video' : answer.target_topic_id === topic.id ? 'topic' : undefined,
          video_title: video?.video.title || (video ? `Video ${video.index}` : undefined),
        };
      }),
    })),
  })));

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-3.5 sm:gap-4">
      <TopicHeaderNav />
      <TopicLearningExperience topic={topic} pages={pagesWithDetails} totalVideos={totalVideos} faqs={faqs} />
      <BottomNav />
    </main>
  );
}
