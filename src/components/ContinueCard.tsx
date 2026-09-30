'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ArrowRight } from 'lucide-react';
import { XemTiepInfo } from '../lib/learningProgress';

interface ContinueCardProps {
  info: XemTiepInfo;
}

export default function ContinueCard({ info }: ContinueCardProps) {
  const total = info.video_total || 1;
  const current = info.video_index || 1;
  const progressPercent =
    info.video_total && info.video_total > 1
      ? Math.min(100, Math.round((current / total) * 100))
      : 60;
  const cleanTopicSlug = (info.topic_slug || 'cot-song').replace('cot-song-that-lung', 'cot-song');
  const cleanPageSlug = info.page_slug || 'tu-the-va-van-dong';
  const targetUrl = `/${cleanTopicSlug}/${cleanPageSlug}?v=${current}`;

  return (
    <Link
      href={targetUrl}
      prefetch={true}
      className="group relative block overflow-hidden rounded-[22px] bg-gradient-to-r from-[#0047AB] via-[#0055D4] to-[#00388A] p-4 sm:p-5 text-white shadow-md border border-blue-400/20 transition-all duration-150 active:scale-[0.98] cursor-pointer"
      aria-label={`Xem tiếp ${info.topic_title} bài ${info.page_title}`}
    >
      {/* 3D Anatomy Spine Render bên phải */}
      <div className="absolute -right-2 top-0 bottom-0 w-[44%] sm:w-[38%] pointer-events-none overflow-hidden select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/spine_hero_clean.png"
          alt="Spine Anatomy"
          className="w-full h-full object-cover object-center mix-blend-screen opacity-95 scale-110"
        />
        {/* Gradient mờ nhẹ chuyển từ nền xanh sang ảnh */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB] via-[#0047AB]/40 to-transparent w-16" />
      </div>

      <div className="relative z-10 flex flex-col gap-2">
        {/* Dòng 1: Huy hiệu chủ đề có icon Play + Vị trí video */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/95 text-[12px] sm:text-[12.5px] font-bold">
            <span className="w-5 h-5 rounded-full bg-[#0066FF] flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Play size={10} fill="currentColor" className="ml-0.5" />
            </span>
            <span>Đang xem · {info.topic_title || 'Cột sống'}</span>
          </div>

          <span className="text-[11.5px] sm:text-[12px] font-bold text-white/80 pr-1">
            Video {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
          </span>
        </div>

        {/* Dòng 2: Tiêu đề bài học */}
        <h2 className="text-[17px] sm:text-[19px] font-black text-white leading-tight line-clamp-1 max-w-[70%] sm:max-w-[75%]">
          {String(info.page_number || 5).padStart(2, '0')} - {info.page_title || 'Tư thế và vận động'}
        </h2>

        {/* Dòng 3: Mô tả bài học */}
        <p className="text-[11px] sm:text-[12px] text-white/85 leading-snug line-clamp-2 max-w-[76%] sm:max-w-[80%]">
          {info.video_title || (
            <>
              Tư thế sinh hoạt và vận động đúng giúp<br className="sm:hidden" /> bảo vệ cột sống, giảm đau và phòng ngừa chấn thương.
            </>
          )}
        </p>

        {/* Dòng 4: Thanh tiến độ + Phần trăm + Nút Xem tiếp */}
        <div className="flex items-center justify-between gap-3 pt-1 mt-0.5">
          <div className="flex-1 max-w-[58%] sm:max-w-[64%] flex items-center gap-2.5">
            <div
              className="flex-1 h-1.5 bg-white/25 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-[#00D2FF] rounded-full transition-all duration-300 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11.5px] font-bold text-white/90 shrink-0">
              {progressPercent}%
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-1 h-[32px] sm:h-[34px] px-3.5 sm:px-4 rounded-full bg-white text-[#0047AB] font-extrabold text-[12.5px] sm:text-[13px] shadow-sm group-hover:bg-slate-50 transition-colors">
            <span>Xem tiếp</span>
            <ArrowRight size={14} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
