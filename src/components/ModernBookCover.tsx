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
    bg: 'from-[#1C123D] via-[#160D30] to-[#0E0720]',
    border: 'border-[#F8DF7B]/50',
    accent: 'text-[#F8DF7B]',
    badge: 'bg-[#F8DF7B] text-[#160C2C]',
  },
  {
    bg: 'from-[#241548] via-[#1A0E38] to-[#100724]',
    border: 'border-purple-400/40',
    accent: 'text-purple-200',
    badge: 'bg-purple-950/80 text-purple-200 border-purple-700/40',
  },
  {
    bg: 'from-[#2A1030] via-[#1E0B24] to-[#120516]',
    border: 'border-rose-400/40',
    accent: 'text-rose-200',
    badge: 'bg-rose-950/80 text-rose-200 border-rose-700/40',
  },
  {
    bg: 'from-[#152033] via-[#0E1624] to-[#0A0E17]',
    border: 'border-cyan-400/40',
    accent: 'text-cyan-200',
    badge: 'bg-cyan-950/80 text-cyan-200 border-cyan-700/40',
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
      className={`relative aspect-[3/4] w-full select-none transition-transform duration-300 group-hover:-translate-y-1 ${className}`}
    >
      {/* THẺ TAG CỦA SÁCH: Ở TRÊN CÙNG GÓC TRÁI, CHỜM RA NGOÀI VIỀN 1 NỬA (50% TRONG, 50% NGOÀI), TĨNH KHÔNG FLASH */}
      {badgeText && (
        <div className="absolute -top-2 -left-2 sm:-top-2.5 sm:-left-2 z-30 rounded-[5px] bg-gradient-to-r from-[#991B1B] via-[#DC2626] to-[#991B1B] text-white font-black text-[8px] sm:text-[8.5px] px-1.5 py-[2px] shadow-md shadow-red-950/50 border border-red-300/50 flex items-center gap-1 select-none pointer-events-none drop-shadow-xs max-w-[92%] truncate">
          <Sparkles size={8} className="text-white fill-white shrink-0" />
          <span className="tracking-wider uppercase drop-shadow-xs truncate">{badgeText}</span>
        </div>
      )}

      {/* THÂN BÌA SÁCH 3D (ĐƯỢC BO GÓC & BẢO TOÀN HIỆU ỨNG GÁY SÁCH) */}
      <div
        className="w-full h-full rounded-r-[6px] rounded-l-[2px] overflow-hidden relative transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(248,223,123,0.45),0_12px_28px_rgba(15,23,42,0.35)] group-active:shadow-[0_0_24px_rgba(248,223,123,0.45)] group-hover:ring-1 group-hover:ring-amber-300/60"
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
              className="text-[13.5px] sm:text-[15px] font-black text-white leading-snug line-clamp-3 tracking-wide drop-shadow-sm"
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
      </div>
    </div>
  );
}
