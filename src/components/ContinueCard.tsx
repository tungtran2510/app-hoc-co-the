import React from 'react';
import Link from 'next/link';
import { Clock, ArrowRight } from 'lucide-react';
import SpineIllustration from './SpineIllustration';
import { ContinueInfo } from '../lib/types';

interface ContinueCardProps {
  info: ContinueInfo;
}

export default function ContinueCard({ info }: ContinueCardProps) {
  const progressPercent = Math.round((info.video_index / info.video_total) * 100);

  return (
    <Link
      href={`/${info.topic_slug}/${info.page_slug}`}
      className="group relative block overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0E6B5A] to-[#0A4F43] p-4 text-white shadow-sm border border-primary-dark/40 transition-transform active:scale-[0.99]"
      aria-label={`Xem tiếp ${info.topic_title} bài ${info.page_title}`}
    >
      {/* Hình minh họa chìm mờ tinh tế phía sau (không bị che nút hay đè chữ) */}
      <div className="absolute -right-4 -bottom-6 w-[110px] h-[150px] pointer-events-none opacity-15">
        <SpineIllustration className="w-full h-full object-contain" />
      </div>

      <div className="relative z-10 flex flex-col gap-2.5">
        {/* Dòng 1: Huy hiệu chủ đề + Vị trí video */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/12 text-on-primary-muted text-[13px] font-bold">
            <Clock size={14} strokeWidth={2.5} />
            <span>Xem tiếp · {info.topic_title}</span>
          </div>

          <span className="text-[13px] font-bold text-on-primary-muted">
            Video {info.video_index}/{info.video_total}
          </span>
        </div>

        {/* Dòng 2: Tiêu đề trang gọn gàng & mô tả bài đang xem */}
        <div className="flex flex-col gap-0.5">
          <h2 className="text-[18px] sm:text-[19px] font-extrabold leading-snug text-white truncate">
            {info.page_order_label} · {info.page_title}
          </h2>
          <p className="text-[14px] text-on-primary-muted font-normal truncate">
            Đang ở: {info.video_title}
          </p>
        </div>

        {/* Dòng 3: Thanh tiến độ thanh mảnh + Nút Xem tiếp nhỏ gọn */}
        <div className="flex items-center justify-between gap-3 pt-0.5">
          <div
            className="flex-1 h-[6px] bg-primary-track/80 rounded-full overflow-hidden"
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

          <div className="shrink-0 flex items-center gap-1 h-[34px] px-3.5 rounded-full bg-white text-primary text-[14px] font-extrabold shadow-2xs group-hover:bg-[#F6F4EF] transition-colors">
            <span>Xem tiếp</span>
            <ArrowRight size={16} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
