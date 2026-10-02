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

export const revalidate = 60;

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
      {/* 2. Header Chủ đề: Thẻ Chuyên Đề Đào Tạo cao cấp, gọn 2/3, bo viền hiện đại toàn bộ, nổi bật */}
      <section className="w-full rounded-[14px] p-3.5 sm:p-4 bg-gradient-to-br from-white via-blue-50/25 to-slate-50/60 dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] text-slate-900 dark:text-white border-[1.5px] border-[#1E3A8A]/30 dark:border-purple-400/40 shadow-[0_4px_16px_rgba(30,58,138,0.10)] dark:shadow-[0_4px_22px_rgba(168,85,247,0.2)] relative overflow-hidden flex flex-col gap-2">
        {/* Tia sáng viền trên cao cấp */}
        <div className="dark:hidden absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#1E3A8A]/30 via-[#1E3A8A] to-[#1E3A8A]/30" />
        <div className="hidden dark:block absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F8DF7B]/60 to-transparent" />

        {/* Họa tiết trang trí nền */}
        <div className="hidden dark:block absolute -right-8 -top-8 w-40 h-40 rounded-full bg-purple-600/20 pointer-events-none blur-2xl" />
        <div className="absolute right-2.5 bottom-2.5 opacity-10 dark:opacity-20 pointer-events-none">
          {topic.slug === 'cot-song' ? (
            <SpineIllustration className="w-20 h-20 text-[#1E3A8A] dark:text-white" />
          ) : (
            <TopicIcon name={topic.icon || 'body'} size={56} className="text-[#1E3A8A] dark:text-white" />
          )}
        </div>

        {/* Hàng 1: Badge Chuyên Đề + Tác giả trên cùng 1 hàng gọn gàng */}
        <div className="flex items-center justify-between gap-2 z-10">
          <span className="text-[10px] sm:text-[10.5px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-[#1E3A8A] text-white shadow-2xs dark:bg-purple-950/90 dark:text-[#F8DF7B] dark:border dark:border-purple-700/60">
            CHUYÊN ĐỀ ĐÀO TẠO
          </span>
          <span className="text-[11.5px] sm:text-[12px] text-slate-600 dark:text-white/80 font-medium">
            Tác giả: <strong className="text-slate-900 dark:text-white font-bold">Tùng Dinh Dưỡng</strong>
          </span>
        </div>

        {/* Hàng 2: Tiêu đề chuyên đề nổi bật, sắc nét */}
        <h1 className="text-[19px] sm:text-[21px] font-black leading-tight tracking-tight text-[#1E3A8A] dark:text-white uppercase z-10">
          {topic.title.toUpperCase()}
        </h1>

        {/* Hàng 3: Mô tả ngắn gọn */}
        {topic.description && (
          <p className="text-[12px] sm:text-[12.5px] text-slate-600 dark:text-white/80 font-normal leading-snug line-clamp-2 z-10 -mt-0.5">
            {topic.description}
          </p>
        )}

        {/* Hàng 4: Thống kê bài học / video / thời lượng dạng thẻ pill trên 1 hàng */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[11.5px] text-slate-600 dark:text-white/85 font-semibold z-10">
          <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-white/10 px-2 py-0.5 rounded-[6px] border border-blue-200/80 dark:border-white/10 shadow-2xs">
            📚 <span className="font-bold text-slate-900 dark:text-white">{pages.length}</span> bài học
          </span>
          <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-white/10 px-2 py-0.5 rounded-[6px] border border-blue-200/80 dark:border-white/10 shadow-2xs">
            🎬 <span className="font-bold text-slate-900 dark:text-white">{totalVideos}</span> video
          </span>
          <span className="inline-flex items-center gap-1 bg-white/90 dark:bg-white/10 px-2 py-0.5 rounded-[6px] border border-blue-200/80 dark:border-white/10 shadow-2xs">
            ⏱ <span className="font-bold text-slate-900 dark:text-white">~{totalVideos * 5}</span> phút
          </span>
        </div>

        {/* Hàng 5: Thanh tiến độ chuyên đề tích hợp mượt mà */}
        <div className="z-10 mt-0.5 pt-2 border-t border-blue-100/90 dark:border-white/10 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] sm:text-[11.5px] font-bold text-slate-700 dark:text-white/90">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E3A8A] dark:bg-amber-400" />
              Tiến độ chuyên đề
            </span>
            <span className="text-[11px] text-slate-500 dark:text-white/70 font-semibold">Lộ trình {pages.length} bước</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200/80 dark:bg-black/30 overflow-hidden">
            <div className="h-full rounded-full bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-amber-300 dark:via-amber-400 dark:to-amber-500 w-1/3 transition-all duration-500 shadow-2xs" />
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
