'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  'cot-song': 'OSTEOLOGY & SPINE',
  'dinh-duong': 'BIOCHEMISTRY & CELLS',
  'nuoc': 'PHYSIOLOGY & FLUIDS',
  'tieu-hoa': 'THORAX & ABDOMEN',
  'co-the-nguoi': 'GENERAL ANATOMY',
  'noi-tiet-chuyen-hoa': 'ENDOCRINOLOGY',
  'gan-mat-tuy': 'METABOLISM & LIVER',
  'mien-dich': 'IMMUNOLOGY & DEFENSE',
};

interface TopicCardProps {
  topic: Topic;
  pageCount: number;
}

export default function TopicCard({ topic, pageCount }: TopicCardProps) {
  const [imgError, setImgError] = useState(false);
  const isAvailable = pageCount > 0;
  const coverUrl = topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug] || null;
  const hasCoverImage = Boolean(coverUrl) && !imgError;
  const mindMapSubtitle = TOPIC_MIND_MAP_SUBTITLES[topic.slug] || 'ANATOMY MIND MAPS';

  return (
    <Link
      href={`/${topic.slug}`}
      prefetch={true}
      className="group relative flex flex-col justify-between p-3 sm:p-3.5 rounded-[14px] bg-gradient-to-br from-[#1E1342] via-[#160D30] to-[#0E0720] border-t border-t-white/20 border-r border-r-black/60 border-b border-b-black/80 border-l-[3.5px] border-l-[#A78BFA] text-white shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 overflow-hidden cursor-pointer min-h-[148px] sm:min-h-[160px]"
    >
      {/* 1. HIỆU ỨNG GÁY SÁCH 3D */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/40 via-purple-300/30 to-white/10 pointer-events-none" />
      <div className="absolute left-[3px] top-0 bottom-0 w-[1.5px] bg-black/50 pointer-events-none" />

      {/* 2. VẦNG SÁNG HUYỀN ẢO TÍM GÓC TRÊN BÊN PHẢI */}
      <div className="absolute -top-8 -right-8 w-28 h-28 bg-purple-600/25 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/35 transition-all" />

      {/* 3. ẢNH GIẢI PHẪU 3D BÊN PHẢI (RADIAL MASK + MIX-BLEND-SCREEN XÓA 100% VIỀN HỘP) */}
      <div className="absolute right-0 top-1.5 bottom-6 w-[48%] sm:w-[46%] flex items-center justify-center pointer-events-none overflow-visible select-none z-0">
        {hasCoverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl!}
            alt={topic.title}
            className={`w-full h-full max-h-[110px] sm:max-h-[120px] object-contain mix-blend-screen opacity-100 [-webkit-mask-image:radial-gradient(circle_at_50%_50%,black_28%,transparent_68%)] [mask-image:radial-gradient(circle_at_50%_50%,black_28%,transparent_68%)] group-hover:scale-105 transition-all duration-300 ${
              topic.slug === 'cot-song' ? 'scale-110 group-hover:scale-115' : ''
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

      {/* 4. CỘT THÔNG TIN BÊN TRÁI */}
      <div className="relative z-10 flex flex-col gap-0.5 max-w-[62%] sm:max-w-[64%]">
        {/* Nhãn thương hiệu nhỏ trên cùng */}
        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-purple-200/90 font-bold tracking-tight">
          <svg className="w-2.5 h-2.5 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 2a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5V11a2 2 0 0 0 2 2 2 2 0 0 0 2-2V9.5c1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4Z" />
          </svg>
          <span className="truncate">Học Cơ Thể</span>
        </div>

        {/* Dòng phụ đề Mind Map chuẩn y khoa */}
        <span className="text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider text-purple-300/80 leading-tight truncate">
          {mindMapSubtitle}
        </span>

        {/* Tiêu đề in hoa đậm nét chuẩn sách y khoa */}
        <h3 className="text-[13px] sm:text-[14.5px] font-black text-white uppercase tracking-tight leading-tight line-clamp-2 mt-1 drop-shadow-xs group-hover:text-[#F8DF7B] transition-colors">
          {topic.title}
        </h3>
      </div>

      {/* 5. RIBBON PHÍA DƯỚI - MÀU VÀNG KIM SANG TRỌNG */}
      <div className="relative z-10 mt-auto pt-2 flex items-center">
        <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#F8DF7B] text-[#160C2C] text-[8.5px] sm:text-[9.5px] font-black uppercase tracking-wider shadow-sm group-hover:bg-[#FDE68A] transition-colors">
          {isAvailable ? `${pageCount} BÀI CỐT LÕI` : 'QUICK REVISION'}
        </span>
      </div>
    </Link>
  );
}
