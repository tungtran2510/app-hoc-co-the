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
      className={`relative aspect-[3/4] w-full select-none pl-[5%] pr-[2%] pb-[3%] transition-transform duration-300 group-hover:-translate-y-1 ${className}`}
      style={{ perspective: '1100px' }}
    >
      {/* THÂN BÌA SÁCH 3D (ĐƯỢC BO GÓC & BẢO TOÀN HIỆU ỨNG GÁY SÁCH) */}
      <div className="absolute bottom-0 left-[7%] right-[3%] h-[2.2%] rounded-[50%] bg-slate-950/15 blur-[3px]" />

      <div
        className="w-full h-full rounded-r-[7px] rounded-l-[2px] overflow-visible relative transition-all duration-300 group-hover:shadow-[0_0_24px_rgba(248,223,123,0.28)]"
        style={{
          transform: 'rotateY(-4deg) rotateZ(-0.2deg)',
          transformOrigin: 'left center',
          boxShadow: '8px 12px 20px -10px rgba(15, 23, 42, 0.38)',
        }}
      >
      {/* Khối gáy nằm ngoài ảnh nên mọi ảnh tải lên đều tự thành một cuốn sách */}
      <div
        className="pointer-events-none absolute inset-y-[1px] -left-[5%] w-[6%] z-0 rounded-l-[3px] border-y border-l border-slate-900/20"
        style={{
          background: 'linear-gradient(to right, #0f2e62 0%, #184781 45%, #0b224d 100%)',
          transform: 'skewY(-0.5deg)',
          boxShadow: '-2px 4px 7px rgba(15,23,42,.16)',
        }}
      />
      {/* Tag nằm sát bên trong mép trên, vắt nhẹ từ gáy sang mặt bìa. */}
      {displayBadge && (
        <div className="pointer-events-none absolute top-0 -left-[4.2%] z-30 flex h-[10px] max-w-[78%] select-none items-center gap-[2px] truncate rounded-[2.5px] border border-[#E7C84C]/60 bg-[#173A79] px-[4px] text-[5.75px] font-extrabold uppercase leading-none tracking-[0.06em] text-[#FFE66A] shadow-[0_1px_4px_rgba(15,23,42,.22)] sm:h-[11px] sm:px-[4.5px] sm:text-[6.25px]">
          <Sparkles size={5.5} strokeWidth={2.2} className="shrink-0 fill-[#FFE66A] text-[#FFE66A]" />
          <span className="truncate">{displayBadge}</span>
        </div>
      )}
      <div className="pointer-events-none absolute top-[1.5%] -right-[1.5%] bottom-[2.5%] w-[2%] z-0 rounded-r-[3px] border-r border-slate-300 bg-[repeating-linear-gradient(to_right,#fff_0px,#eef1f5_1px,#fff_2px)]" />
      <div className="pointer-events-none absolute -bottom-[1.3%] left-[1%] right-[1.5%] h-[1.6%] z-0 rounded-b-[2px] border-b border-slate-300/80 bg-[repeating-linear-gradient(to_bottom,#fff_0px,#e5e7eb_1px,#fff_2px)]" />

      <div className="absolute inset-0 z-10 overflow-hidden rounded-r-[7px] rounded-l-[2px] bg-white ring-1 ring-slate-900/10">
      {/* 1. Nếp gấp gáy sách */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-[5%] z-20"
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
    </div>
  );
}
