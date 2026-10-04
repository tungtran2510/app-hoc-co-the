import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import {
  getPageBySlug,
  getBlocksByPage,
  getPagesByTopic,
  getSettings,
  getAllPageSlugMap,
} from '../../../lib/data';
import ContentViewer from '../../../components/ContentViewer';

export const revalidate = 60;

interface PageProps {
  params: {
    topicSlug: string;
    pageSlug: string;
  };
  searchParams?: {
    v?: string;
    autoplay?: string;
    play?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topicSlug, pageSlug } = params;
  const [result, settings] = await Promise.all([
    getPageBySlug(topicSlug, pageSlug),
    getSettings(),
  ]);

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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ContentPage({ params, searchParams }: PageProps) {
  const { topicSlug, pageSlug } = params;

  const result = await getPageBySlug(topicSlug, pageSlug);
  if (!result) {
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
