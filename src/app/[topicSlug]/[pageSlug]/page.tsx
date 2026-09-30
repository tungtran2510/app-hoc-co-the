import React from 'react';
import { notFound } from 'next/navigation';
import {
  getPageBySlug,
  getBlocksByPage,
  getPagesByTopic,
} from '../../../lib/data';
import ContentViewer from '../../../components/ContentViewer';

export const revalidate = 0;

interface PageProps {
  params: {
    topicSlug: string;
    pageSlug: string;
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { topicSlug, pageSlug } = params;

  const result = await getPageBySlug(topicSlug, pageSlug);
  if (!result) {
    notFound();
  }

  const { topic, page, pageIndex, totalPages } = result;
  const [blocks, allPages] = await Promise.all([
    getBlocksByPage(page.id),
    getPagesByTopic(topic.id),
  ]);

  // Tìm trang kế tiếp trong cùng chủ đề
  const currentIdx = allPages.findIndex((p) => p.id === page.id);
  const nextPage =
    currentIdx >= 0 && currentIdx + 1 < allPages.length
      ? allPages[currentIdx + 1]
      : null;
  const nextPageIndex = nextPage ? currentIdx + 2 : null;

  // Lệnh 01: Mặc định đang phát video thứ 3 ở trang Tổng quan (khớp thẻ Xem tiếp), video thứ 1 ở trang khác.
  const defaultActiveVideoIndex =
    page.slug === 'tong-quan-ve-cot-song' ? 2 : 0;

  return (
    <ContentViewer
      topic={topic}
      page={page}
      pageIndex={pageIndex}
      totalPages={totalPages}
      blocks={blocks}
      nextPage={nextPage}
      nextPageIndex={nextPageIndex}
      defaultActiveVideoIndex={defaultActiveVideoIndex}
    />
  );
}
