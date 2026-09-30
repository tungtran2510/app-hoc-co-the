'use client';

import React from 'react';
import Link from 'next/link';
import { Play, ArrowRight, Edit2 } from 'lucide-react';
import { XemTiepInfo } from '../lib/learningProgress';

interface ContinueCardProps {
  info: XemTiepInfo;
  isAdmin?: boolean;
  onEditPage?: () => void;
}

export default function ContinueCard({ info, isAdmin, onEditPage }: ContinueCardProps) {
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
      className="group relative block overflow-hidden rounded-[20px] bg-gradient-to-r from-[#0F4C82] via-[#145C9E] to-[#0B3A65] px-4 py-3 sm:px-5 sm:py-3.5 text-white shadow-lg border border-sky-300/35 transition-all duration-150 active:scale-[0.98] cursor-pointer"
      aria-label={`Xem tiếp ${info.topic_title} bài ${info.page_title}`}
    >
      {/* Tia sáng ngọc viền trên */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-sky-200/60 to-transparent" />

      {/* 3D Anatomy / Avatar Render bên phải */}
      <div className="absolute -right-2 top-0 bottom-0 w-[42%] sm:w-[36%] pointer-events-none overflow-hidden select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={info.cover_url || '/images/lessons/tong-quan-ve-cot-song.png'}
          alt={info.page_title || 'Anatomy'}
          className={`w-full h-full object-cover object-center ${
            info.cover_url && !info.cover_url.endsWith('.png')
              ? 'opacity-90'
              : 'mix-blend-screen opacity-95 scale-105'
          }`}
        />
        {/* Gradient mờ chuyển từ nền xanh sapphire sang ảnh */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C82] via-[#0F4C82]/60 to-transparent w-16" />
      </div>

      <div className="relative z-10 flex flex-col gap-1 sm:gap-1.5">
        {/* Dòng 1: Huy hiệu chủ đề có icon Play + Nút sửa ảnh (nếu Admin) + Vị trí video */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-white/90 text-[11.5px] sm:text-[12px] font-bold">
            <span className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-sky-500 flex items-center justify-center text-white shrink-0 shadow-2xs">
              <Play size={8} fill="currentColor" className="ml-0.5" />
            </span>
            <span>Đang xem · {info.topic_title || 'Cột sống'}</span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && onEditPage && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEditPage();
                }}
                className="px-2 py-0.5 rounded-full bg-white/20 hover:bg-white/35 text-white text-[10.5px] font-bold flex items-center gap-1 backdrop-blur-xs cursor-pointer transition-colors shadow-2xs"
                title="Cài đặt ảnh đại diện & thông tin bài học này"
              >
                <Edit2 size={10} />
                <span>Đổi ảnh</span>
              </button>
            )}

            <span className="text-[11px] sm:text-[11.5px] font-bold text-white/75 pr-1">
              Video {String(current).padStart(2, '0')}/{String(total).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Dòng 2: Tiêu đề bài học chính - TO RÕ CHO DỄ NHÌN */}
        <h2 className="text-[17.5px] sm:text-[20px] font-black text-white leading-tight tracking-tight line-clamp-1 max-w-[84%] sm:max-w-[86%]">
          {String(info.page_number || 1).padStart(2, '0')} - {info.page_title || 'Tổng quan về cột sống'}
        </h2>

        {/* Dòng 3: Mô tả/Tiêu đề video - 1 dòng gọn gàng để chiều cao bé lại */}
        <p className="text-[11.5px] sm:text-[12px] text-white/80 leading-tight line-clamp-1 max-w-[70%] sm:max-w-[76%] font-medium">
          {info.video_title || 'Cấu tạo & chức năng cột sống'}
        </p>

        {/* Dòng 4: Thanh tiến độ + Phần trăm + Nút Xem tiếp */}
        <div className="flex items-center justify-between gap-2.5 pt-0.5 mt-0.5">
          <div className="flex-1 max-w-[56%] sm:max-w-[64%] flex items-center gap-2">
            <div
              className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-sky-400 rounded-full transition-all duration-300 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-white/85 shrink-0 font-mono">
              {progressPercent}%
            </span>
          </div>

          <div className="shrink-0 flex items-center gap-1 h-[28px] sm:h-[30px] px-3 sm:px-3.5 rounded-full bg-white text-[#072146] font-extrabold text-[12px] sm:text-[12.5px] shadow-sm group-hover:bg-slate-100 transition-colors">
            <span>Xem tiếp</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </Link>
  );
}
