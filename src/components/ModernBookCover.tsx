'use client';

import React from 'react';
import { BookOpen, Sparkles, Award } from 'lucide-react';

interface ModernBookCoverProps {
  title: string;
  coverUrl?: string | null;
  author?: string | null;
  className?: string;
  badgeText?: string | null;
  index?: number;
}

const LUXURY_PALETTES = [
  {
    bg: 'from-[#0B463A] via-[#0E6B5A] to-[#062821]',
    border: 'border-amber-300/40',
    accent: 'text-amber-200',
    badge: 'bg-amber-400/20 text-amber-100 border-amber-300/30',
  },
  {
    bg: 'from-[#0F1E36] via-[#1A335B] to-[#091322]',
    border: 'border-sky-300/40',
    accent: 'text-sky-200',
    badge: 'bg-sky-400/20 text-sky-100 border-sky-300/30',
  },
  {
    bg: 'from-[#421422] via-[#631F34] to-[#2E0E18]',
    border: 'border-rose-300/40',
    accent: 'text-rose-200',
    badge: 'bg-rose-400/20 text-rose-100 border-rose-300/30',
  },
  {
    bg: 'from-[#1E2530] via-[#2F3B4C] to-[#13171F]',
    border: 'border-emerald-300/40',
    accent: 'text-emerald-200',
    badge: 'bg-emerald-400/20 text-emerald-100 border-emerald-300/30',
  },
];

export default function ModernBookCover({
  title,
  coverUrl,
  author,
  className = '',
  badgeText,
  index = 0,
}: ModernBookCoverProps) {
  const palette = LUXURY_PALETTES[index % LUXURY_PALETTES.length];

  return (
    <div
      className={`relative aspect-[3/4] w-full rounded-r-[6px] rounded-l-[2px] overflow-hidden select-none transition-transform duration-300 group-hover:-translate-y-1 ${className}`}
      style={{
        boxShadow:
          '0 14px 28px -6px rgba(15, 23, 42, 0.22), 0 6px 10px -2px rgba(15, 23, 42, 0.1), inset -1px 0 2px rgba(255, 255, 255, 0.2)',
      }}
    >
      {/* 1. GÁY SÁCH 3D BÊN TRÁI (Spine Crease) */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[14px] sm:w-[16px] z-20"
        style={{
          background:
            'linear-gradient(to right, rgba(0,0,0,0.38) 0%, rgba(255,255,255,0.2) 20%, rgba(0,0,0,0.12) 60%, transparent 100%)',
        }}
      />

      {/* 2. MÉP TRANG SÁCH BÊN PHẢI (Book Edge Reflection) */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-[3px] z-20"
        style={{
          background:
            'linear-gradient(to left, rgba(255,255,255,0.3) 0%, transparent 100%)',
        }}
      />

      {/* 3. NỘI DUNG BÌA SÁCH */}
      {coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        /* BÌA SÁCH THIẾT KẾ CAO CẤP BẰNG CODE (LUXURY EDITORIAL COVER) */
        <div
          className={`w-full h-full bg-gradient-to-br ${palette.bg} p-2.5 sm:p-3.5 flex flex-col justify-between relative overflow-hidden`}
        >
          {/* Vân họa tiết chìm */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />

          {/* Khung viền mạ vàng / ánh kim kép bên trong */}
          <div
            className={`absolute inset-2 sm:inset-2.5 border ${palette.border} rounded-[4px] pointer-events-none opacity-80`}
          />

          {/* Đầu bìa: Nhãn chuyên san */}
          <div className="relative z-10 pl-3 pt-1 flex items-center justify-between">
            <span
              className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[1.5px] ${palette.accent}`}
            >
              Sức Khỏe · Cơ Thể
            </span>
            <Sparkles size={11} className={palette.accent} />
          </div>

          {/* Giữa bìa: Biểu tượng & Tên sách */}
          <div className="relative z-10 px-3 my-auto flex flex-col gap-1.5 text-center items-center">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border ${palette.border} flex items-center justify-center ${palette.accent} shadow-inner-xs`}
            >
              <BookOpen size={14} />
            </div>

            <h3
              className="text-[13.5px] sm:text-[15px] font-black text-white leading-snug line-clamp-3 tracking-wide drop-shadow-sm font-serif"
            >
              {title}
            </h3>

            <div className={`w-8 h-[1px] ${palette.border} mx-auto opacity-70`} />
          </div>

          {/* Chân bìa: Tác giả */}
          <div className="relative z-10 pl-3 pb-1 text-center">
            <span className="text-[10px] sm:text-[11px] font-bold text-white/80 line-clamp-1">
              {author || 'Tài liệu chuyên khảo'}
            </span>
          </div>
        </div>
      )}

      {/* 4. BADGE NỔI BẬT NẾU CÓ */}
      {badgeText && (
        <div className="absolute top-2 right-2 z-20 px-2 py-0.5 rounded-[8px] bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-black tracking-wide shadow-xs">
          {badgeText}
        </div>
      )}
    </div>
  );
}
