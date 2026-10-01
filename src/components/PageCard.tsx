import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Page, Topic } from '../lib/types';

interface PageCardProps {
  page: Page;
  topic: Topic;
  orderNumber: number;
  videoCount: number;
  watchedVideos?: number[];
  lastVideo?: number;
  isCompleted?: boolean;
}

export default function PageCard({
  page,
  topic,
  orderNumber,
  videoCount,
  watchedVideos = [],
  lastVideo,
  isCompleted = false,
}: PageCardProps) {
  const formattedOrder = String(orderNumber).padStart(2, '0');

  const count = typeof videoCount === 'number' ? videoCount : 0;
  const watchedCount = watchedVideos.length;
  const isAllWatched = count > 0 && watchedCount >= count;
  const hasStarted = isCompleted || watchedCount > 0 || (lastVideo !== undefined && lastVideo > 0);

  let subtitle = count > 0 ? `${count} video · Chưa xem` : `Bài học · Chưa xem`;
  let progressPercent = 0;

  if (isCompleted || isAllWatched) {
    subtitle = `Đã hiểu bài học ✓`;
    progressPercent = 100;
  } else if (count === 0) {
    subtitle = hasStarted ? `Đang học bài` : `Bài học lý thuyết`;
    progressPercent = hasStarted ? 50 : 0;
  } else if (hasStarted) {
    const currentVideo = lastVideo || (watchedVideos.length > 0 ? Math.max(...watchedVideos) : 1);
    subtitle = `${count} video · Đang ở video ${String(currentVideo).padStart(2, '0')}`;
    progressPercent = Math.min(100, Math.round((watchedCount / count) * 100));
    if (progressPercent === 0 && currentVideo > 0) {
      progressPercent = Math.round((1 / count) * 100);
    }
  }

  const targetUrl = lastVideo
    ? `/${topic.slug}/${page.slug}?v=${lastVideo}`
    : `/${topic.slug}/${page.slug}`;

  return (
    <Link
      href={targetUrl}
      className="flex items-center gap-2.5 sm:gap-3 p-2.5 sm:p-3 bg-white dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] rounded-[16px] border border-slate-200 dark:border-purple-500/25 border-l-[4px] border-l-[#1E3A8A] dark:border-l-[#A78BFA] transition-all active:scale-[0.99] shadow-xs hover:border-slate-300 group"
    >
      {/* Ô ẢNH ĐẠI DIỆN BÀI HỌC (AVATAR / THUMBNAIL) */}
      <div className="relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-[12px] overflow-hidden bg-slate-100 dark:bg-[#0A0515] border border-slate-200 dark:border-purple-500/30 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-200">
        {page.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.cover_url}
            alt={page.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center bg-blue-50 dark:bg-purple-950/60 text-[#1E3A8A] dark:text-purple-200"
          >
            <span className="text-[17px] font-black">{formattedOrder}</span>
          </div>
        )}

        {/* Badge số thứ tự nhỏ gọn ở góc trên của ảnh (nếu có ảnh) */}
        {page.cover_url && (
          <span
            className="absolute top-1 left-1 h-4.5 px-1.5 rounded-[4px] text-[10.5px] font-black flex items-center justify-center tracking-wide bg-[#1E3A8A] text-white dark:bg-[#F8DF7B] dark:text-[#160C2C] shadow-xs"
          >
            {formattedOrder}
          </span>
        )}
      </div>

      {/* NỘI DUNG BÊN PHẢI: TIÊU ĐỀ RỘNG RÃI TRẢI DÀI + TRẠNG THÁI TIẾN ĐỘ */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 self-stretch">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#1E3A8A] dark:group-hover:text-amber-200 transition-colors">
            {page.title}
          </h3>
          <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
            {isCompleted ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-500/30 dark:text-emerald-300 text-[10.5px] font-black tracking-wide shrink-0">
                ĐÃ XONG
              </span>
            ) : hasStarted ? (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 dark:bg-[#F8DF7B] dark:text-[#160C2C] dark:border-transparent text-[10.5px] font-black tracking-wide shrink-0">
                ĐANG HỌC
              </span>
            ) : orderNumber === 1 ? (
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#1E3A8A] border border-blue-200 dark:bg-purple-900/60 dark:text-purple-200 text-[10.5px] font-bold shrink-0">
                BẮT ĐẦU
              </span>
            ) : null}
            <ChevronRight size={16} strokeWidth={2.5} className="text-slate-400 group-hover:text-[#1E3A8A] dark:group-hover:text-white transition-colors" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-[12px] sm:text-[12.5px] text-slate-500 dark:text-purple-300/70 font-medium truncate">
            {subtitle}
          </p>

          {/* Thanh tiến độ nếu đang học */}
          {hasStarted && (
            <div
              className="w-18 sm:w-24 h-1.5 bg-slate-200 dark:bg-purple-950/80 border border-slate-300/60 dark:border-purple-900/30 rounded-full overflow-hidden shrink-0"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tiến độ bài học"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isAllWatched ? 'bg-emerald-500' : 'bg-[#1E3A8A] dark:bg-gradient-to-r dark:from-purple-500 dark:to-[#F8DF7B]'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
