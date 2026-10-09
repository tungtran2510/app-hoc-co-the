'use client';

import React from 'react';
import { Play, ArrowRight, Edit2 } from 'lucide-react';
import { XemTiepInfo } from '../lib/learningProgress';
import { playTapSound } from '../lib/audioFeedback';

interface ContinueCardProps {
  info: XemTiepInfo;
  isAdmin?: boolean;
  onEditPage?: () => void;
}

export default function ContinueCard({ info, isAdmin, onEditPage }: ContinueCardProps) {
  const total = info.video_total || 1;
  const current = info.video_index || 1;
  const hasMultipleVideos = total > 1;
  const progressPercent = hasMultipleVideos
    ? Math.min(100, Math.round((current / total) * 100))
    : 100;
  const cleanTopicSlug = (info.topic_slug || 'cot-song').replace('cot-song-that-lung', 'cot-song');
  const cleanPageSlug = info.page_slug || 'tu-the-va-van-dong';
  const targetUrl = `/${cleanTopicSlug}/${cleanPageSlug}?v=${current}`;

  // Kiểm tra trùng lặp tiêu đề bài học và tiêu đề video để khử lặp chữ
  const stripPrefix = (str: string) => str.replace(/^(\d+[\.\-\s:]+)+/, '').trim().toLowerCase();
  const pageTitleCore = stripPrefix(info.page_title || '');
  const videoTitleCore = stripPrefix(info.video_title || '');
  const isSameTitle =
    !videoTitleCore ||
    pageTitleCore === videoTitleCore ||
    pageTitleCore.includes(videoTitleCore) ||
    videoTitleCore.includes(pageTitleCore);

  return (
    <a
      href={targetUrl}
      onClick={playTapSound}
      className="group relative block overflow-hidden rounded-[18px] bg-white text-slate-900 border border-slate-200/90 border-l-[4px] border-l-amber-500 shadow-md hover:shadow-[0_0_24px_rgba(248,223,123,0.35)] hover:border-amber-400 dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:border-l-[#A78BFA] dark:text-white dark:hover:border-amber-300/80 dark:hover:shadow-[0_0_26px_rgba(248,223,123,0.4),0_10px_28px_rgba(109,40,217,0.35)] px-3.5 py-2.5 sm:px-4.5 sm:py-3 transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] cursor-pointer"
      aria-label={`Xem tiếp ${info.topic_title} bài ${info.page_title}`}
    >
      {/* Tia sáng vàng kim viền trên (dark mode) */}
      <div className="hidden dark:block absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#F8DF7B]/60 to-transparent" />

      {/* 3D Anatomy / Avatar Render bên phải */}
      <div className="absolute -right-2 top-0 bottom-0 w-[42%] sm:w-[36%] pointer-events-none overflow-hidden select-none">
        {/* Điểm sáng hào quang đốt sống thở nhẹ (Spine Ambient Glow) */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-amber-500/25 dark:bg-amber-400/20 blur-xl pointer-events-none animate-pulse" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={info.cover_url || '/images/lessons/tong-quan-ve-cot-song.png'}
          alt={info.page_title || 'Anatomy'}
          className={`w-full h-full object-cover object-center ${
            info.cover_url && !info.cover_url.endsWith('.png')
              ? 'opacity-90'
              : 'mix-blend-multiply opacity-80 dark:mix-blend-screen dark:opacity-95 scale-105'
          }`}
        />
        {/* Gradient mờ chuyển từ nền sang ảnh */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 via-50% to-transparent dark:from-[#1C123D] dark:via-[#1C123D]/80 dark:via-50% dark:to-transparent w-28 pointer-events-none" />
      </div>

      <div className="relative z-10 flex flex-col gap-0.5 sm:gap-1">
        {/* Dòng 1: Huy hiệu chủ đề có icon Play + Nút sửa ảnh (nếu Admin) + Vị trí video */}
        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 text-amber-600 dark:text-white/90 text-[11px] sm:text-[11.5px] font-bold min-w-0 flex-1">
            <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 dark:bg-[#F8DF7B] dark:text-[#160C2C] flex items-center justify-center shrink-0 shadow-2xs">
              <Play size={7.5} fill="currentColor" className="ml-0.5" />
            </span>
            <span className="truncate">{info.topic_title || 'Cột sống'}</span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isAdmin && onEditPage && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditPage();
                }}
                className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 dark:bg-white/20 dark:hover:bg-white/35 dark:text-white text-[9.5px] sm:text-[10px] font-bold flex items-center gap-1 backdrop-blur-xs cursor-pointer transition-colors shadow-2xs shrink-0 whitespace-nowrap"
                title="Cài đặt ảnh đại diện & thông tin bài học này"
              >
                <Edit2 size={9.5} />
                <span>Đổi ảnh</span>
              </button>
            )}

            {hasMultipleVideos && (
              <span className="px-1.5 py-0.5 rounded-md bg-white/90 dark:bg-black/60 border border-slate-200/80 dark:border-white/10 text-[9.5px] sm:text-[10px] font-bold text-slate-700 dark:text-white/90 shrink-0 backdrop-blur-xs shadow-2xs">
                Video {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        {/* Dòng 2: Tiêu đề bài học chính - TO RÕ CHO DỄ NHÌN */}
        <h2 className="text-[15.5px] sm:text-[17px] font-black text-slate-900 dark:text-white leading-tight tracking-tight line-clamp-1 max-w-[84%] sm:max-w-[86%]">
          {String(info.page_number || 1).padStart(2, '0')} - {info.page_title || 'Tổng quan về cột sống'}
        </h2>

        {/* Dòng 3: Mô tả/Tiêu đề video - CHỈ HIỂN THỊ KHI KHÁC TIÊU ĐỀ BÀI (KHỬ LẶP CHỮ) */}
        {!isSameTitle && Boolean(info.video_title) && (
          <p className="text-[11px] sm:text-[11.5px] text-slate-600 dark:text-white/80 leading-tight line-clamp-1 max-w-[70%] sm:max-w-[76%] font-medium">
            {info.video_title}
          </p>
        )}

        {/* Dòng 4: Thanh tiến độ + Phần trăm + Nút Xem tiếp phát sáng chuyên nghiệp */}
        <div className="flex items-center justify-between gap-2.5 pt-0.5">
          {hasMultipleVideos ? (
            <div className="flex-1 max-w-[54%] sm:max-w-[62%] flex items-center gap-2">
              <div
                className="flex-1 h-1.5 bg-slate-200 dark:bg-black/30 rounded-full overflow-hidden p-[0.5px]"
                role="progressbar"
                aria-valuenow={progressPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full bg-amber-500 dark:bg-gradient-to-r dark:from-amber-300 dark:via-amber-400 dark:to-amber-500 rounded-full transition-all duration-300 shadow-xs"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-300 shrink-0 font-mono">
                {progressPercent}%
              </span>
            </div>
          ) : (
            <div className="flex-1 max-w-[54%] sm:max-w-[62%] flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-200 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                Bài học trọng tâm
              </span>
            </div>
          )}

          {/* Nút Xem tiếp */}
          <div className="relative shrink-0 flex items-center gap-1.5 h-[27px] sm:h-[29px] px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 hover:from-amber-600 hover:to-amber-700 dark:from-[#FDE68A] dark:via-[#F8DF7B] dark:to-[#F59E0B] text-slate-950 font-black text-[11.5px] sm:text-[12px] shadow-sm transition-all duration-300 animate-pulse-glow overflow-hidden select-none">
            {/* Vệt sáng quét ngang lấp lánh (Shimmer Sweep Light) */}
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 dark:via-white/60 to-transparent animate-shimmer-sweep" />

            {/* Chấm tròn phát sáng nhịp tim LIVE / Đang học dở */}
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-200 dark:bg-amber-800 opacity-80" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-300 dark:bg-[#160C2C]" />
            </span>

            <span className="tracking-tight">Xem tiếp</span>
            <ArrowRight size={12} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </a>
  );
}
