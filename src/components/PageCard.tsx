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

  const count = videoCount || 1;
  const watchedCount = watchedVideos.length;
  const isAllWatched = count > 0 && watchedCount >= count;
  const hasStarted = isCompleted || watchedCount > 0 || (lastVideo !== undefined && lastVideo > 0);

  let subtitle = `${count} video · Chưa xem`;
  let progressPercent = 0;

  if (isCompleted || isAllWatched) {
    subtitle = `Đã hiểu bài học ✓`;
    progressPercent = 100;
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
      className="flex flex-col gap-2 p-3.5 sm:p-4 bg-white rounded-[18px] border-[1.5px] border-line transition-all active:scale-[0.99] shadow-xs hover:border-primary/40"
    >
      {/* HÀNG TRÊN CÙNG: Ô SỐ THỨ TỰ + TIÊU ĐỀ ĐẦY ĐỦ + MŨI TÊN (KHÔNG BỊ CẮT BA CHẤM) */}
      <div className="flex items-start gap-2.5 w-full">
        {/* Badge số thứ tự gọn gàng, nổi bật */}
        <span
          className="h-6 px-2 rounded-[7px] text-[12px] font-black flex items-center justify-center shrink-0 mt-0.5 tracking-wide"
          style={{ backgroundColor: topic.color_bg, color: topic.color_fg }}
        >
          {formattedOrder}
        </span>

        {/* Tiêu đề nằm trên cùng, chiếm trọn chiều ngang, KHÔNG BAO GIỜ BỊ CẮT BA CHẤM (...) */}
        <h3 className="text-[17px] sm:text-[18px] font-extrabold text-ink leading-[1.35] flex-1 break-words">
          {page.title}
        </h3>

        {/* Mũi tên điều hướng nhỏ gọn */}
        <div className="shrink-0 text-muted mt-1">
          <ChevronRight size={18} strokeWidth={2.5} />
        </div>
      </div>

      {/* HÀNG DƯỚI: TRẠNG THÁI / TIẾN ĐỘ VÀ SỐ VIDEO */}
      <div className="flex items-center justify-between pl-8 gap-2">
        <p className="text-[14px] text-muted font-medium">
          {subtitle}
        </p>

        {/* Thanh tiến độ nếu đang học */}
        {hasStarted && (
          <div
            className="w-24 sm:w-32 h-1.5 bg-line rounded-full overflow-hidden shrink-0"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tiến độ bài học"
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isAllWatched ? 'bg-[#0E6B5A]' : 'bg-primary'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>
    </Link>
  );
}
