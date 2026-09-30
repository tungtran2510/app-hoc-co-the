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
      className="flex items-center gap-3 p-3 sm:p-3.5 bg-white rounded-[18px] border-[1.5px] border-line transition-all active:scale-[0.99] shadow-xs hover:border-primary/40 group"
    >
      {/* Ô ẢNH ĐẠI DIỆN BÀI HỌC (AVATAR / THUMBNAIL) */}
      <div className="relative w-[68px] h-[68px] sm:w-[74px] sm:h-[74px] rounded-[14px] overflow-hidden bg-surface-2 border border-line shrink-0 shadow-2xs group-hover:border-primary/50 transition-colors">
        {page.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={page.cover_url}
            alt={page.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center"
            style={{ backgroundColor: topic.color_bg, color: topic.color_fg }}
          >
            <span className="text-[18px] font-black">{formattedOrder}</span>
          </div>
        )}

        {/* Badge số thứ tự nhỏ gọn ở góc trên của ảnh (nếu có ảnh) */}
        {page.cover_url && (
          <span
            className="absolute top-1 left-1 h-5 px-1.5 rounded-[5px] text-[11px] font-black flex items-center justify-center tracking-wide shadow-xs"
            style={{ backgroundColor: topic.color_bg, color: topic.color_fg }}
          >
            {formattedOrder}
          </span>
        )}
      </div>

      {/* NỘI DUNG BÊN PHẢI: TIÊU ĐỀ + TRẠNG THÁI TIẾN ĐỘ */}
      <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 self-stretch">
        <div className="flex items-start justify-between gap-1.5">
          <h3 className="text-[15px] sm:text-[16.5px] font-extrabold text-ink leading-snug line-clamp-2">
            {page.title}
          </h3>
          <div className="shrink-0 flex items-center gap-1.5 mt-0.5">
            {isCompleted ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-black tracking-wide shrink-0">
                ĐÃ XONG
              </span>
            ) : hasStarted ? (
              <span className="px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20 text-[10.5px] font-black tracking-wide shrink-0">
                ĐANG HỌC
              </span>
            ) : orderNumber === 1 ? (
              <span className="px-2 py-0.5 rounded-full bg-surface-2 text-ink-2 text-[10.5px] font-bold shrink-0">
                BẮT ĐẦU
              </span>
            ) : null}
            <ChevronRight size={17} strokeWidth={2.5} className="text-muted group-hover:text-primary transition-colors" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 mt-1">
          <p className="text-[13px] text-muted font-medium truncate">
            {subtitle}
          </p>

          {/* Thanh tiến độ nếu đang học */}
          {hasStarted && (
            <div
              className="w-20 sm:w-28 h-1.5 bg-line rounded-full overflow-hidden shrink-0"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Tiến độ bài học"
            >
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isAllWatched ? 'bg-emerald-500' : 'bg-primary'
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
