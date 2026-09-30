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
}

export default function PageCard({
  page,
  topic,
  orderNumber,
  videoCount,
  watchedVideos = [],
  lastVideo,
}: PageCardProps) {
  const formattedOrder = String(orderNumber).padStart(2, '0');

  const count = videoCount || 1;
  const watchedCount = watchedVideos.length;
  const isAllWatched = count > 0 && watchedCount >= count;
  const hasStarted = watchedCount > 0 || (lastVideo !== undefined && lastVideo > 0);

  let subtitle = `${count} video · Chưa xem`;
  let progressPercent = 0;

  if (isAllWatched) {
    subtitle = `${count} video · Đã xem hết`;
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
      className="flex items-center gap-4 min-h-[112px] p-4 bg-white rounded-[22px] border-[1.5px] border-line transition-transform active:scale-[0.99] shadow-xs"
    >
      {/* Ô số lớn 64x64 bo 18px */}
      <div
        className="w-16 h-16 rounded-[18px] flex items-center justify-center shrink-0"
        style={{ backgroundColor: topic.color_bg, color: topic.color_fg }}
      >
        <span className="text-[24px] font-extrabold leading-none">
          {formattedOrder}
        </span>
      </div>

      {/* Thông tin ở giữa */}
      <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <h3 className="text-[19px] font-extrabold text-ink leading-[1.3] truncate">
          {page.title}
        </h3>
        <p className="text-[16px] text-muted font-normal leading-[1.45]">
          {subtitle}
        </p>

        {/* Thanh tiến độ theo số video đã xem */}
        {hasStarted && (
          <div
            className="w-full h-2 bg-line rounded-full overflow-hidden mt-1 max-w-[180px]"
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

      {/* ChevronRight */}
      <div className="shrink-0 text-muted">
        <ChevronRight size={22} strokeWidth={2.5} />
      </div>
    </Link>
  );
}
