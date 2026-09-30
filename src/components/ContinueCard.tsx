import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import SpineIllustration from './SpineIllustration';
import { ContinueInfo } from '../lib/types';

interface ContinueCardProps {
  info: ContinueInfo;
}

export default function ContinueCard({ info }: ContinueCardProps) {
  // Tiến độ: video 3 trên 4 => 75%
  const progressPercent = Math.round((info.video_index / info.video_total) * 100);

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-primary p-[22px] text-white shadow-sm">
      {/* Hình minh họa cột sống bên phải mờ / lồng */}
      <div className="absolute -right-2 -bottom-2 w-[140px] h-[190px] pointer-events-none opacity-90">
        <SpineIllustration className="w-full h-full object-contain" />
      </div>

      <div className="relative z-10 flex flex-col gap-[14px] pr-16 sm:pr-24">
        {/* Dòng nhỏ: Xem tiếp · [Chủ đề] */}
        <div className="flex items-center gap-1.5 text-on-primary-muted text-[16px] font-semibold">
          <Clock size={18} strokeWidth={2.5} />
          <span>
            Xem tiếp · {info.topic_title}
          </span>
        </div>

        {/* Tiêu đề trang: 01 · Tổng quan về cột sống */}
        <h2 className="text-[24px] font-extrabold leading-[1.25] text-white">
          {info.page_order_label} · {info.page_title}
        </h2>

        {/* Thanh tiến độ + Dòng vị trí */}
        <div className="flex flex-col gap-1.5">
          <div
            className="w-full h-[10px] bg-primary-track rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Tiến độ học tập"
          >
            <div
              className="h-full bg-accent-soft rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[16px] text-on-primary-muted font-normal leading-normal">
            Đang ở video {String(info.video_index).padStart(2, '0')} · {info.video_title}
          </p>
        </div>

        {/* Nút Xem tiếp */}
        <Link
          href={`/${info.topic_slug}/${info.page_slug}`}
          className="mt-1 flex items-center justify-center gap-2 h-[58px] min-h-[48px] w-full rounded-[16px] bg-white text-primary font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm"
        >
          <span>Xem tiếp</span>
          <ArrowRight size={22} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
