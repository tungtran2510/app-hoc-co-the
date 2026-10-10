import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import {
  getPageBySlug,
  getPageById,
  getTopicById,
  getBlocksByPage,
  getPagesByTopic,
  getSettings,
  getAllPageSlugMap,
  getTopics,
} from '../../../lib/data';
import ContentViewer from '../../../components/ContentViewer';

export const revalidate = 300;

export async function generateStaticParams() {
  const topics = await getTopics();
  const allParams: { topicSlug: string; pageSlug: string }[] = [];
  for (const topic of topics) {
    const pages = await getPagesByTopic(topic.id);
    for (const page of pages) {
      allParams.push({ topicSlug: topic.slug, pageSlug: page.slug });
    }
  }
  return allParams;
}

interface PageProps {
  params: {
    topicSlug: string;
    pageSlug: string;
  };
  searchParams?: {
    v?: string;
    autoplay?: string;
    play?: string;
    page_id?: string;
  };
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { topicSlug, pageSlug } = params;
  let [result, settings] = await Promise.all([
    getPageBySlug(topicSlug, pageSlug),
    getSettings(),
  ]);

  if (!result && searchParams?.page_id) {
    try {
      const fallbackPage = await getPageById(searchParams.page_id);
      if (fallbackPage && fallbackPage.topic_id) {
        const fallbackTopic = await getTopicById(fallbackPage.topic_id);
        if (fallbackTopic) {
          result = await getPageBySlug(fallbackTopic.slug, fallbackPage.slug);
        }
      }
    } catch {}
  }

  if (!result) {
    return {
      title: 'Không tìm thấy trang · ' + (settings?.app_name || 'Học Cơ Thể'),
    };
  }

  const { page, topic } = result;
  const blocks = await getBlocksByPage(page.id);

  let imageUrl = page.cover_url || topic.cover_url || '';
  if (!imageUrl) {
    const videoBlock = blocks.find((b) => b.type === 'videos');
    if (videoBlock && videoBlock.type === 'videos' && videoBlock.data.videos.length > 0) {
      const firstVid = videoBlock.data.videos[0];
      if (firstVid.thumbnail_url) {
        imageUrl = firstVid.thumbnail_url;
      } else if (firstVid.youtube_id) {
        imageUrl = `https://i.ytimg.com/vi/${firstVid.youtube_id}/hqdefault.jpg`;
      }
    }
  }

  const title = `${page.title} · ${settings.app_name}`;
  const description = page.summary || `${topic.title} - Kiến thức cấu trúc cơ thể và sức khỏe`;

  const ogImage = imageUrl || '/spine_hero_clean.png';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale: 'vi_VN',
      siteName: settings.app_name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
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

export default async function ContentPage({ params, searchParams }: PageProps) {
  const { topicSlug, pageSlug } = params;

  let result = await getPageBySlug(topicSlug, pageSlug);
  if (!result) {
    // Nếu slug không còn (hoặc đã đổi), tìm theo page_id rồi chuyển hướng tới đúng trang
    const pageId = searchParams?.page_id;
    if (pageId) {
      try {
        const foundPage = await getPageById(pageId);
        if (foundPage && foundPage.topic_id) {
          const foundTopic = await getTopicById(foundPage.topic_id);
          if (foundTopic) {
            const vQuery = searchParams?.v ? `?v=${encodeURIComponent(searchParams.v)}` : '';
            redirect(`/${foundTopic.slug}/${foundPage.slug}${vQuery}`);
          }
        }
      } catch (err: any) {
        if (err?.digest?.startsWith('NEXT_REDIRECT')) {
          throw err;
        }
      }
    }
    notFound();
  }

  const { topic, page, pageIndex, totalPages } = result;
  const [blocks, allPages, pageSlugMap] = await Promise.all([
    getBlocksByPage(page.id),
    getPagesByTopic(topic.id),
    getAllPageSlugMap(),
  ]);

  // Tìm trang trước và trang kế tiếp trong cùng chủ đề
  const currentIdx = allPages.findIndex((p) => p.id === page.id);
  const prevPage = currentIdx > 0 ? allPages[currentIdx - 1] : null;
  const prevPageIndex = prevPage ? currentIdx : null;

  const nextPage =
    currentIdx >= 0 && currentIdx + 1 < allPages.length
      ? allPages[currentIdx + 1]
      : null;
  const nextPageIndex = nextPage ? currentIdx + 2 : null;

  // Xác định video bắt đầu: ưu tiên param ?v=n
  let defaultActiveVideoIndex = 0;
  if (searchParams?.v) {
    const parsed = parseInt(searchParams.v, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      defaultActiveVideoIndex = parsed - 1;
    }
  }

  return (
    <ContentViewer
      topic={topic}
      page={page}
      pageIndex={pageIndex}
      totalPages={totalPages}
      blocks={blocks}
      prevPage={prevPage}
      prevPageIndex={prevPageIndex}
      nextPage={nextPage}
      nextPageIndex={nextPageIndex}
      defaultActiveVideoIndex={defaultActiveVideoIndex}
      pageSlugMap={pageSlugMap}
    />
  );
}
