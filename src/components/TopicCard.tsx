'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopicIcon from './TopicIcon';
import { Topic } from '../lib/types';

export const DEFAULT_TOPIC_COVERS: Record<string, string> = {
  'cot-song': '/images/topics/cot-song.png',
  'dinh-duong': '/images/topics/dinh-duong.png',
  'nuoc': '/images/topics/nuoc.png',
  'tieu-hoa': '/images/topics/tieu-hoa.png',
  'co-the-nguoi': '/images/topics/co-the-nguoi.png',
  'noi-tiet-chuyen-hoa': '/images/topics/noi-tiet-chuyen-hoa.png',
  'gan-mat-tuy': '/images/topics/gan-mat-tuy.png',
  'mien-dich': '/images/topics/mien-dich.png',
};

export const TOPIC_MIND_MAP_SUBTITLES: Record<string, string> = {
  'cot-song': 'SPINE & BONE',
  'dinh-duong': 'NUTRITION',
  'nuoc': 'FLUIDS & CELL',
  'tieu-hoa': 'DIGESTIVE',
  'co-the-nguoi': 'ANATOMY',
  'noi-tiet-chuyen-hoa': 'ENDOCRINE',
  'gan-mat-tuy': 'LIVER & GLAND',
  'mien-dich': 'IMMUNITY',
};

interface TopicCardProps {
  topic: Topic;
  pageCount: number;
  isActive?: boolean;
  onActivate?: () => void;
  /** Tiêu đề đậm hơn (chỉ dùng ở trang chủ) */
  boldTitle?: boolean;
}

export default function TopicCard({
  topic,
  pageCount,
  isActive = false,
  onActivate,
  boldTitle = false,
}: TopicCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const isAvailable = pageCount > 0;
  const coverUrl = topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug] || null;
  const hasCoverImage = Boolean(coverUrl) && !imgError;
  const mindMapSubtitle = TOPIC_MIND_MAP_SUBTITLES[topic.slug] || 'ANATOMY';

  // Định dạng tiêu đề hiển thị đồng bộ, ngắt dòng tự nhiên không bị cắt dấu
  const displayTitle = topic.title
    .replace(' – ', '\n')
    .replace(' - ', '\n');

  return (
    <Link
      href={`/${topic.slug}`}
      prefetch={true}
      onClick={(e) => {
        onActivate?.();
        e.preventDefault();
        if (typeof window !== 'undefined') {
          window.location.href = `/${topic.slug}`;
        }
      }}
      className={`topic-card-container group relative flex flex-col cursor-pointer select-none transition-transform duration-100 active:scale-[0.98] [&.is-active]:scale-[0.98] ${
        isActive ? 'is-active' : ''
      }`}
    >
      {/* 1. GÁY TRÊN 3D CỦA CUỐN SÁCH (Bừng sáng viền vàng rực rỡ khi lướt tay / chạm) */}
      <div className="topic-card-spine mx-1.5 h-[5px] sm:h-[6px] bg-gradient-to-r from-[#CBC3E3] via-[#FAF9FD] to-[#B8ADD6] rounded-t-[3px] border-t border-l border-r border-white/50 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-100 group-active:border-[#FDE047] group-[.is-active]:border-[#FDE047] group-active:brightness-125 group-[.is-active]:brightness-125 group-active:shadow-[0_0_16px_rgba(250,204,21,0.95)] group-[.is-active]:shadow-[0_0_16px_rgba(250,204,21,0.95)]">
        {/* Rãnh trang giấy xếp lớp */}
        <div className="w-full h-[1px] bg-purple-950/20" />
      </div>

      {/* 2. MẶT BÌA CHÍNH CỦA CUỐN SÁCH (3D HARDCOVER VỚI HÀO QUANG VÀNG PHÁT QUANG RỰC RỠ KHI NHẤN) */}
      <div className="topic-card-glow relative flex flex-col justify-between p-3 sm:p-3.5 rounded-b-[14px] rounded-tl-[3px] rounded-tr-[12px] bg-gradient-to-br from-[#231652] via-[#1A0E3F] to-[#100629] border-t border-t-white/25 border-r border-r-black/60 border-b-2 border-b-black/80 border-l-[4px] border-l-[#4A2D9E] text-white overflow-hidden min-h-[148px] sm:min-h-[158px] shadow-[3px_8px_18px_rgba(0,0,0,0.45)] transition-all duration-100 group-active:ring-2 group-active:ring-[#FDE047] group-active:shadow-[0_0_35px_rgba(250,204,21,0.95)] group-[.is-active]:ring-2 group-[.is-active]:ring-[#FDE047] group-[.is-active]:shadow-[0_0_35px_rgba(250,204,21,0.95)] group-active:border-[#FDE047] group-[.is-active]:border-[#FDE047]">
        {/* Đường gân gáy sách (Spine crease) */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/35 via-purple-300/20 to-white/10 pointer-events-none" />
        <div className="absolute left-[2.5px] top-0 bottom-0 w-[1.5px] bg-black/40 pointer-events-none" />

        {/* VẦNG SÁNG HÀO QUANG KÉP - BỪNG SÁNG VÀNG RỰC RỠ KHI NHẤN */}
        <div className="topic-card-inner-glow absolute -top-10 -right-10 w-32 h-32 rounded-full blur-xl pointer-events-none bg-purple-600/25 transition-all duration-100 group-active:!bg-[#FDE047]/40 group-active:!opacity-100 group-active:scale-125 group-[.is-active]:!bg-[#FDE047]/40 group-[.is-active]:!opacity-100 group-[.is-active]:scale-125" />
        <div className="topic-card-inner-glow absolute -bottom-8 -left-8 w-28 h-28 rounded-full blur-xl pointer-events-none bg-purple-600/15 transition-all duration-100 group-active:!bg-[#FDE047]/30 group-active:!opacity-100 group-[.is-active]:!bg-[#FDE047]/30 group-[.is-active]:!opacity-100" />

        {/* VỆT SÁNG PHẢN CHIẾU ÁNH KIM (SHINE GLINT) */}
        <div className="topic-card-inner-glow absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none opacity-0" />

        {/* 3. ẢNH GIẢI PHẪU 3D TRONG SUỐT BÊN PHẢI (TO HẲN, NỔI BẬT KHÔNG NỀN ĐEN) */}
        <div className={`absolute right-0.5 top-1 bottom-4 flex items-center justify-center pointer-events-none overflow-visible select-none z-0 ${boldTitle ? 'w-[49%]' : 'w-[54%] sm:w-[52%]'}`}>
          {hasCoverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl!}
              alt={topic.title}
              decoding="async"
              className={`topic-card-img w-full h-full max-h-[120px] sm:max-h-[132px] object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] transition-all duration-100 group-active:scale-110 group-[.is-active]:scale-110 ${
                topic.slug === 'cot-song' ? 'scale-115' : ''
              }`}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="text-purple-300/60 drop-shadow-md">
              <TopicIcon name={topic.icon} size={44} />
            </div>
          )}
        </div>

        {/* 4. CỘT THÔNG TIN BÊN TRÁI: TIẾNG ANH PHỤ TRÊN CÙNG + TIÊU ĐỀ TIẾNG VIỆT TO RÕ ĐỒNG BỘ */}
        <div className={`relative z-10 flex flex-col gap-1 ${boldTitle ? 'max-w-[65%]' : 'max-w-[60%] sm:max-w-[58%]'}`}>
          {/* Nhãn tiếng Anh phụ trên cùng (ngắn gọn, chuẩn nhãn bìa sách) */}
          <div className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-purple-200/90 leading-tight">
            <svg className="w-2.5 h-2.5 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="truncate">{mindMapSubtitle}</span>
          </div>

          {/* Tiêu đề tiếng Việt in hoa ĐỒNG BỘ KÍCH THƯỚC, CHUẨN DẤU VÀ KHOẢNG CÁCH FONT */}
          <h3 className={`font-extrabold text-white uppercase tracking-normal leading-[1.25] drop-shadow-sm mt-0.5 line-clamp-2 text-[14.5px] sm:text-[15.5px] whitespace-pre-line ${boldTitle ? 'topic-card-title-bold' : ''}`}>
            {displayTitle}
          </h3>
        </div>

        {/* 5. KHUNG VÀNG NỔI BẬT PHÍA DƯỚI (PHÁT QUANG RỰC RỠ KHI NHẤN HOẶC HOVER) */}
        <div className="relative z-10 mt-auto pt-2 flex items-center">
          <span className="topic-card-badge inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#FCE38A] dark:bg-[#FADB67] text-[#190E33] text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-100 group-active:!bg-[#FEF08A] group-active:!text-black group-[.is-active]:!bg-[#FEF08A] group-[.is-active]:!text-black group-active:shadow-[0_0_16px_rgba(250,204,21,0.95)] group-[.is-active]:shadow-[0_0_16px_rgba(250,204,21,0.95)]">
            {isAvailable ? `${pageCount} BÀI CỐT LÕI` : 'QUICK REVISION'}
          </span>
        </div>
      </div>
    </Link>
  );
}
