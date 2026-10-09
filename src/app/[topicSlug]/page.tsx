import React from 'react';
import { notFound } from 'next/navigation';
import { getTopics, getTopicBySlug, getPagesByTopic, getBlocksByPages, getSettings } from '../../lib/data';
import { getTopicMasterFaqs } from '../../data/topicFaqs';
import TopicHeaderNav from '../../components/TopicHeaderNav';
import TopicLearningExperience from '../../components/TopicLearningExperience';
import BottomNav from '../../components/BottomNav';
import { Metadata } from 'next';

interface TopicPageProps { params: { topicSlug: string } }

export const revalidate = 300;

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((t) => ({ topicSlug: t.slug }));
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const [topic, settings] = await Promise.all([getTopicBySlug(params.topicSlug), getSettings()]);
  if (!topic) return { title: 'Không tìm thấy chủ đề' };
  const title = `${topic.title} · ${settings?.app_name || 'Học Cơ Thể'}`;
  const description = topic.description || `Khám phá kiến thức chuyên sâu về ${topic.title}`;
  const ogImage = topic.cover_url || topic.icon || '/spine_hero_clean.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'vi_VN',
      siteName: settings?.app_name || 'Qbiz Books',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: topic.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const topic = await getTopicBySlug(params.topicSlug);
  if (!topic) notFound();

  const pages = await getPagesByTopic(topic.id, true);
  const blocksByPage = await getBlocksByPages(pages.map((p) => p.id), false);
  const pagesWithDetails = pages.map((page, index) => {
    const blocks = blocksByPage[page.id] || [];
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
  const dbFaqs = pagesWithDetails.flatMap((item) => item.faqGroups.map((group) => ({
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

  const masterFaqCategories = getTopicMasterFaqs(topic.slug);
  const masterFaqs = masterFaqCategories.map((cat) => ({
    id: cat.id,
    title: cat.title,
    subtitle: cat.subtitle,
    badge: cat.badge,
    colorTheme: cat.colorTheme,
    iconName: cat.iconName,
    items: cat.items.map((item) => ({
      id: item.id,
      question: item.question,
      answer: item.answer,
      key_takeaway: item.key_takeaway,
      learning_answers: item.related_lesson ? [{
        id: `link-${item.id}`,
        text: item.related_lesson.title,
        target_url: `/${topic.slug}/${item.related_lesson.slug}${item.related_lesson.video_index ? `?v=${item.related_lesson.video_index}` : ''}`,
        target_kind: 'video',
        video_title: item.related_lesson.title,
      }] : [],
    })),
  }));

  const faqs = dbFaqs.length > 0 ? [...dbFaqs, ...masterFaqs] : masterFaqs;

  return (
    <main className="flex-1 flex flex-col px-3.5 sm:px-5 pt-2 pb-24 gap-2.5 sm:gap-3.5">
      <TopicHeaderNav topicTitle={topic.title} topicSlug={topic.slug} />
      <TopicLearningExperience topic={topic} pages={pagesWithDetails} totalVideos={totalVideos} faqs={faqs} />
      <BottomNav />
    </main>
  );
}
