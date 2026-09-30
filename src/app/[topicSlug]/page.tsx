import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BookOpen,
  PlaySquare,
  Clock,
  ArrowRight,
} from 'lucide-react';
import {
  getTopics,
  getTopicBySlug,
  getPagesByTopic,
  getBlocksByPage,
  getContinue,
} from '../../lib/data';
import TopicHeaderNav from '../../components/TopicHeaderNav';
import PageListClient from '../../components/PageListClient';
import SpineIllustration from '../../components/SpineIllustration';
import BottomNav from '../../components/BottomNav';
import TopicMainButton from '../../components/TopicMainButton';
import { getSettings } from '../../lib/data';
import { Metadata } from 'next';

interface TopicPageProps {
  params: {
    topicSlug: string;
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
  const [topic, settings] = await Promise.all([
    getTopicBySlug(params.topicSlug),
    getSettings(),
  ]);
  if (!topic) return { title: 'Không tìm thấy chủ đề' };
  return {
    title: `${topic.title} · ${settings?.app_name || 'Học Cơ Thể'}`,
    description: topic.description || `Khám phá kiến thức ${topic.title}`,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { topicSlug } = params;
  const topic = await getTopicBySlug(topicSlug);

  if (!topic) {
    notFound();
  }

  const pages = await getPagesByTopic(topic.id, true);

  // Lấy số video cho từng trang
  const pagesWithVideoCount = await Promise.all(
    pages.map(async (page, index) => {
      const blocks = await getBlocksByPage(page.id);
      let count = 0;
      for (const b of blocks) {
        if (b.type === 'videos') {
          count += b.data.videos.length;
        }
      }
      const displayCount =
        page.slug === 'tong-quan-ve-cot-song'
          ? 4
          : page.slug === 'dia-dem'
          ? 5
          : page.slug === 'co-gan-day-chang'
          ? 6
          : page.slug === 'than-kinh'
          ? 4
          : page.slug === 'tu-the-va-van-dong'
          ? 5
          : page.slug === 'cac-van-de-thuong-gap'
          ? 7
          : Math.max(count, 1);

      return {
        page,
        orderNumber: index + 1,
        videoCount: displayCount,
      };
    })
  );

  const totalVideos = pagesWithVideoCount.reduce(
    (acc, cur) => acc + cur.videoCount,
    0
  );

  const hasPages = pages.length > 0;
  const firstPage = pages[0];

  return (
    <main className="flex-1 flex flex-col px-5 pt-3 pb-28 gap-5">
      {/* 1. Nút quay lại: ‹ Trang chủ và Lối tắt Quản trị */}
      <TopicHeaderNav />

      {/* 2. Header Chủ đề: Tinh gọn, chuyên nghiệp, không chiếm diện tích */}
      <section
        className="w-full rounded-[20px] p-4 flex items-center justify-between gap-3 shadow-xs border border-line/40 overflow-hidden relative"
        style={{ backgroundColor: topic.color_bg }}
      >
        <div className="flex flex-col z-10 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-black tracking-wider uppercase px-2 py-0.5 rounded-[6px] bg-white/70"
              style={{ color: topic.color_fg }}
            >
              CHỦ ĐỀ
            </span>
            {hasPages && (
              <span className="text-[13px] font-bold text-ink/75">
                {pages.length} bài học · {totalVideos} video
              </span>
            )}
          </div>

          <h1 className="text-[22px] sm:text-[24px] font-black text-ink leading-tight mt-1">
            {topic.title}
          </h1>

          {topic.description ? (
            <p className="text-[13px] sm:text-[14px] text-ink-2 font-normal leading-snug line-clamp-2 mt-1">
              {topic.description}
            </p>
          ) : (
            <p className="text-[13px] text-ink-2 font-normal mt-0.5">
              Kiến thức chuyên sâu và thực hành chăm sóc sức khỏe.
            </p>
          )}

          {topic.meta_note && (
            <span className="text-[12px] font-medium text-ink/65 mt-1">
              ⏱ {topic.meta_note}
            </span>
          )}
        </div>

        {/* Minh họa thu nhỏ tinh tế góc phải */}
        <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center pointer-events-none">
          {topic.slug === 'cot-song' ? (
            <SpineIllustration className="h-full w-auto object-contain" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-white/60 flex items-center justify-center">
              <BookOpen size={24} style={{ color: topic.color_fg }} />
            </div>
          )}
        </div>
      </section>

      {/* 3. Nút chính Xem tiếp / Bắt đầu (nhỏ gọn, thanh thoát) */}
      {hasPages && (
        <section>
          <TopicMainButton topic={topic} firstPage={firstPage} />
        </section>
      )}

      {/* 6 & 7. Danh sách nội dung kèm thanh công cụ quản trị */}
      <PageListClient initialPages={pagesWithVideoCount} topic={topic} />

      {/* Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
