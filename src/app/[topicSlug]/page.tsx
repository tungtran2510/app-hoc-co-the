import React from 'react';
import { notFound } from 'next/navigation';
import { getTopicBySlug, getPagesByTopic, getBlocksByPage, getSettings } from '../../lib/data';
import TopicHeaderNav from '../../components/TopicHeaderNav';
import TopicLearningExperience from '../../components/TopicLearningExperience';
import BottomNav from '../../components/BottomNav';
import { Metadata } from 'next';

interface TopicPageProps { params: { topicSlug: string } }

export const revalidate = 60;

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const [topic, settings] = await Promise.all([getTopicBySlug(params.topicSlug), getSettings()]);
  if (!topic) return { title: 'Không tìm thấy chủ đề' };
  return {
    title: `${topic.title} · ${settings?.app_name || 'Học Cơ Thể'}`,
    description: topic.description || `Khám phá kiến thức ${topic.title}`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await getTopicBySlug(params.topicSlug);
  if (!topic) notFound();

  const pages = await getPagesByTopic(topic.id, true);
  const pagesWithDetails = await Promise.all(pages.map(async (page, index) => {
    const blocks = await getBlocksByPage(page.id);
    let videoCount = 0;
    const pageVideos: Array<{ video: import('../../lib/types').Video; index: number; pageSlug: string }> = [];
    for (const block of blocks) {
      if (block.type === 'videos' && Array.isArray(block.data?.videos)) {
        block.data.videos.forEach((video) => pageVideos.push({ video, index: pageVideos.length + 1, pageSlug: page.slug }));
        videoCount += block.data.videos.length;
      }
    }
    const faqs = blocks.flatMap((block) => {
      if (block.type !== 'faq' || !block.is_visible) return [];
      return (block.data.items || []).map((item) => ({
        ...item,
        id: `${page.id}-${block.id}-${item.id}`,
        pageTitle: page.title,
        videos: pageVideos,
      }));
    });
    return { page, orderNumber: index + 1, videoCount, faqs };
  }));

  const totalVideos = pagesWithDetails.reduce((sum, item) => sum + item.videoCount, 0);
  const faqs = pagesWithDetails.flatMap((item) => item.faqs);

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-3.5 sm:gap-4">
      <TopicHeaderNav />
      <TopicLearningExperience topic={topic} pages={pagesWithDetails} totalVideos={totalVideos} faqs={faqs} />
      <BottomNav />
    </main>
  );
}
