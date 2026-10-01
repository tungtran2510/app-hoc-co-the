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
import TopicIcon from '../../components/TopicIcon';
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
        if (b.type === 'videos' && Array.isArray(b.data?.videos)) {
          count += b.data.videos.length;
        }
      }

      return {
        page,
        orderNumber: index + 1,
        videoCount: count,
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
      {/* 2. Header Chủ đề: Thẻ Chuyên Đề Đào Tạo cao cấp */}
      <section className="w-full rounded-[20px] p-5 sm:p-6 bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-[#1E3A8A] shadow-md hover:shadow-lg dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:border-l-[#A78BFA] dark:text-white relative overflow-hidden flex flex-col gap-3">
        {/* Tia sáng vàng kim viền trên (dark mode) */}
        <div className="hidden dark:block absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F8DF7B]/60 to-transparent" />

        {/* Họa tiết trang trí nền */}
        <div className="hidden dark:block absolute -right-8 -top-8 w-40 h-40 rounded-full bg-purple-600/20 pointer-events-none blur-2xl" />
        <div className="absolute right-3 bottom-3 opacity-15 dark:opacity-20 pointer-events-none">
          {topic.slug === 'cot-song' ? (
            <SpineIllustration className="w-24 h-24 text-[#1E3A8A] dark:text-white" />
          ) : (
            <TopicIcon name={topic.icon || 'body'} size={64} className="text-[#1E3A8A] dark:text-white" />
          )}
        </div>

        <div className="flex flex-col z-10 gap-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[10.5px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] border border-blue-200 dark:bg-purple-950/80 dark:text-[#F8DF7B] dark:border-purple-800/50">
              CHUYÊN ĐỀ ĐÀO TẠO
            </span>
          </div>

          <h1 className="text-[23px] sm:text-[26px] font-black leading-tight tracking-tight text-slate-900 dark:text-white mt-0.5">
            {topic.title.toUpperCase()}
          </h1>

          <div className="flex items-center gap-2 text-[13.5px] text-slate-600 dark:text-white/90 font-medium">
            <span>Tác giả: <strong className="text-slate-900 dark:text-white font-bold">Tùng Dinh Dưỡng</strong></span>
          </div>

          {topic.description && (
            <p className="text-[13px] text-slate-600 dark:text-white/80 font-normal leading-snug line-clamp-2 mt-0.5">
              {topic.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-slate-500 dark:text-white/80 font-medium mt-1">
            <span>📚 {pages.length} bài học</span>
            <span>·</span>
            <span>🎬 {totalVideos} video bài giảng</span>
            <span>·</span>
            <span>⏱ ~{totalVideos * 5} phút</span>
          </div>
        </div>

        {/* Thanh tiến độ chuyên đề */}
        <div className="z-10 mt-1 pt-3 border-t border-slate-100 dark:border-white/15 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[12px] font-bold text-slate-700 dark:text-white/90">
            <span>Tiến độ chuyên đề</span>
            <span className="text-slate-500 dark:text-white/80">Lộ trình {pages.length} bước</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-black/30 overflow-hidden p-0.5">
            <div className="h-full rounded-full bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-amber-300 dark:via-amber-400 dark:to-amber-500 shadow-xs w-1/3 transition-all duration-500" />
          </div>
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
