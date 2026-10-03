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
    bg: 'from-[#0F172A] via-[#1E293B] to-[#0A0F1D]',
    border: 'border-amber-300/40',
    accent: 'text-amber-300',
    badge: 'bg-amber-400 text-slate-900',
  },
  {
    bg: 'from-[#1E3A8A] via-[#172554] to-[#0F172A]',
    border: 'border-blue-300/40',
    accent: 'text-blue-200',
    badge: 'bg-blue-900 text-blue-200 border-blue-700/40',
  },
  {
    bg: 'from-[#134E4A] via-[#0F3633] to-[#0A201E]',
    border: 'border-emerald-300/40',
    accent: 'text-emerald-200',
    badge: 'bg-emerald-950 text-emerald-200 border-emerald-700/40',
  },
  {
    bg: 'from-[#1E293B] via-[#0F172A] to-[#020617]',
    border: 'border-amber-400/40',
    accent: 'text-amber-200',
    badge: 'bg-slate-900 text-amber-200 border-amber-700/40',
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
  const [imgError, setImgError] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [coverUrl]);

  // Chuẩn hóa nhãn huy hiệu ngắn gọn, không bị cắt cụt dấu ba chấm
  const displayBadge = React.useMemo(() => {
    if (!badgeText) return null;
    if (badgeText.toUpperCase().includes('TÀI LIỆU NÊN ĐỌC')) return 'NÊN ĐỌC';
    return badgeText;
  }, [badgeText]);

  return (
    <div
      className={`relative aspect-[3/4] w-full select-none transition-transform duration-300 group-hover:-translate-y-1 ${className}`}
    >
      {/* THẺ TAG CỦA SÁCH: MÀU XANH NAVY CHỮ VÀNG, KÍCH THƯỚC BÉ TINH TẾ & DỊCH LÊN TRÊN */}
      {displayBadge && (
        <div className="absolute -top-2.5 -left-1 sm:-top-3 sm:-left-1.5 z-30 rounded-[4px] bg-[#1E3A8A] text-[#FDE047] font-bold text-[7px] sm:text-[7.5px] px-1.5 py-[1.5px] shadow-sm border border-amber-300/40 flex items-center gap-1 select-none pointer-events-none max-w-[92%] truncate">
          <Sparkles size={7} className="text-[#FDE047] fill-[#FDE047] shrink-0" />
          <span className="tracking-wider uppercase truncate">{displayBadge}</span>
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
      {coverUrl && !imgError ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverUrl}
          alt={title}
          onError={() => setImgError(true)}
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
              className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[1.5px] ${palette.accent}`}
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
              className="text-[13.5px] sm:text-[15px] font-bold text-white leading-snug line-clamp-3 tracking-wide drop-shadow-sm font-sans"
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
