'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopicIcon from './TopicIcon';
import { Topic } from '../lib/types';
import { playTapSound } from '../lib/audioFeedback';

export const DEFAULT_TOPIC_COVERS: Record<string, string> = {
  'cot-song': '/images/topics/cot-song.webp',
  'dinh-duong': '/images/topics/dinh-duong.webp',
  'nuoc': '/images/topics/nuoc.webp',
  'tieu-hoa': '/images/topics/tieu-hoa.webp',
  'co-the-nguoi': '/images/topics/co-the-nguoi.webp',
  'noi-tiet-chuyen-hoa': '/images/topics/noi-tiet-chuyen-hoa.webp',
  'gan-mat-tuy': '/images/topics/gan-mat-tuy.webp',
  'tung-dinh-duong': '/images/topics/tung-dinh-duong.webp',
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
  'tung-dinh-duong': 'EXPERT TRAINING',
};

export const TOPIC_ACCENTS: Record<string, {
  tagBg: string;
  tagText: string;
  tagBorder: string;
  badgeDot: string;
}> = {
  'cot-song': {
    tagBg: 'bg-blue-50/90 dark:bg-blue-950/60',
    tagText: 'text-[#1E3A8A] dark:text-blue-300',
    tagBorder: 'border-blue-200/80 dark:border-blue-800/60',
    badgeDot: 'bg-[#1E3A8A] dark:bg-blue-400',
  },
  'dinh-duong': {
    tagBg: 'bg-amber-50/90 dark:bg-amber-950/60',
    tagText: 'text-amber-800 dark:text-amber-300',
    tagBorder: 'border-amber-200/80 dark:border-amber-800/60',
    badgeDot: 'bg-amber-600 dark:bg-amber-400',
  },
  'tieu-hoa': {
    tagBg: 'bg-rose-50/90 dark:bg-rose-950/60',
    tagText: 'text-rose-800 dark:text-rose-300',
    tagBorder: 'border-rose-200/80 dark:border-rose-800/60',
    badgeDot: 'bg-rose-600 dark:bg-rose-400',
  },
  'nuoc': {
    tagBg: 'bg-cyan-50/90 dark:bg-cyan-950/60',
    tagText: 'text-cyan-800 dark:text-cyan-300',
    tagBorder: 'border-cyan-200/80 dark:border-cyan-800/60',
    badgeDot: 'bg-cyan-600 dark:bg-cyan-400',
  },
  'mien-dich': {
    tagBg: 'bg-purple-50/90 dark:bg-purple-950/60',
    tagText: 'text-purple-800 dark:text-purple-300',
    tagBorder: 'border-purple-200/80 dark:border-purple-800/60',
    badgeDot: 'bg-purple-600 dark:bg-purple-400',
  },
  'co-the-nguoi': {
    tagBg: 'bg-slate-100/90 dark:bg-slate-800/60',
    tagText: 'text-slate-800 dark:text-slate-200',
    tagBorder: 'border-slate-300/80 dark:border-slate-700/60',
    badgeDot: 'bg-slate-600 dark:bg-slate-400',
  },
  'noi-tiet-chuyen-hoa': {
    tagBg: 'bg-indigo-50/90 dark:bg-indigo-950/60',
    tagText: 'text-indigo-800 dark:text-indigo-300',
    tagBorder: 'border-indigo-200/80 dark:border-indigo-800/60',
    badgeDot: 'bg-indigo-600 dark:bg-indigo-400',
  },
  'gan-mat-tuy': {
    tagBg: 'bg-emerald-50/90 dark:bg-emerald-950/60',
    tagText: 'text-emerald-800 dark:text-emerald-300',
    tagBorder: 'border-emerald-200/80 dark:border-emerald-800/60',
    badgeDot: 'bg-emerald-600 dark:bg-emerald-400',
  },
  'tung-dinh-duong': {
    tagBg: 'bg-blue-50/90 dark:bg-blue-950/60',
    tagText: 'text-blue-800 dark:text-blue-300',
    tagBorder: 'border-blue-200/80 dark:border-blue-800/60',
    badgeDot: 'bg-blue-600 dark:bg-blue-400',
  },
};

const DEFAULT_TOPIC_ACCENT = {
  tagBg: 'bg-slate-100/90 dark:bg-purple-950/60',
  tagText: 'text-slate-700 dark:text-purple-200',
  tagBorder: 'border-slate-200/80 dark:border-purple-800/50',
  badgeDot: 'bg-[#1E3A8A] dark:bg-purple-400',
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
  const coverUrl = (topic.slug === 'tung-dinh-duong' ? DEFAULT_TOPIC_COVERS[topic.slug] : (topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug])) || null;
  const hasCoverImage = Boolean(coverUrl) && !imgError;
  const mindMapSubtitle = TOPIC_MIND_MAP_SUBTITLES[topic.slug] || 'ANATOMY';
  const accent = TOPIC_ACCENTS[topic.slug] || DEFAULT_TOPIC_ACCENT;

  // Định dạng tiêu đề hiển thị đồng bộ, ngắt dòng tự nhiên không bị cắt dấu
  const formatTopicTitle = (title: string) => {
    let t = title.replace(' – ', '\n').replace(' - ', '\n');
    if (/dinh\s+dưỡng\s+nền\s+tảng/i.test(t)) {
      t = t.replace(/dinh\s+dưỡng\s+nền\s+tảng/i, (m) => m.replace(/\s+nền/i, '\nNền'));
    }
    return t;
  };
  const displayTitle = formatTopicTitle(topic.title);

  const handleNavigate = () => {
    playTapSound();
    onActivate?.();
    const targetUrl = `/${topic.slug}`;
    if (typeof window !== 'undefined') {
      try {
        router.push(targetUrl);
      } catch {}
      setTimeout(() => {
        if (window.location.pathname !== targetUrl) {
          window.location.href = targetUrl;
        }
      }, 70);
    }
  };

  return (
    <Link
      href={`/${topic.slug}`}
      prefetch={true}
      onClick={handleNavigate}
      className={`topic-card-container group relative flex flex-col cursor-pointer select-none transition-transform duration-100 active:scale-[0.985] [&.is-active]:scale-[0.985] ${
        isActive ? 'is-active' : ''
      }`}
    >
      {/* 1. GÁY TRÊN 3D CỦA CUỐN SÁCH (Tự động ẩn ở theme tối giản) */}
      <div className="topic-card-spine mx-1.5 h-[5px] sm:h-[6px] bg-gradient-to-r from-[#CBC3E3] via-[#FAF9FD] to-[#B8ADD6] rounded-t-[3px] border-t border-l border-r border-white/50 shadow-xs flex items-center justify-center overflow-hidden transition-all duration-100 group-active:border-[#FDE047] group-[.is-active]:border-[#FDE047]">
        <div className="w-full h-[1px] bg-purple-950/20" />
      </div>

      {/* 2. MẶT BÌA CHÍNH CỦA CUỐN SÁCH */}
      <div className="topic-card-glow relative flex flex-col justify-between p-3 sm:p-3.5 rounded-b-[14px] rounded-tl-[3px] rounded-tr-[12px] bg-gradient-to-br from-[#231652] via-[#1A0E3F] to-[#100629] border-t border-t-white/25 border-r border-r-black/60 border-b-2 border-b-black/80 border-l-[4px] border-l-[#4A2D9E] text-white overflow-hidden min-h-[148px] sm:min-h-[158px] shadow-[3px_8px_18px_rgba(0,0,0,0.45)] transition-all duration-100 group-active:ring-2 group-active:ring-[#FDE047] group-[.is-active]:ring-2 group-[.is-active]:ring-[#FDE047]">
        {/* Đường gân gáy sách (Spine crease) */}
        <div className="topic-card-crease-1 absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-white/35 via-purple-300/20 to-white/10 pointer-events-none" />
        <div className="topic-card-crease-2 absolute left-[2.5px] top-0 bottom-0 w-[1.5px] bg-black/40 pointer-events-none" />

        {/* VẦNG SÁNG HÀO QUANG */}
        <div className="topic-card-inner-glow absolute -top-8 -right-8 w-28 h-28 rounded-full blur-xl pointer-events-none bg-blue-500/10 dark:bg-purple-600/20 transition-all duration-100" />
        <div className="topic-card-inner-glow absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-xl pointer-events-none bg-blue-500/10 dark:bg-purple-600/15 transition-all duration-100" />

        {/* 1. ẢNH GIẢI PHẪU 3D TRONG SUỐT BÊN PHẢI */}
        <div className={`absolute right-0.5 top-1 bottom-3 flex items-center justify-center pointer-events-none overflow-visible select-none z-0 ${boldTitle ? 'w-[48%]' : 'w-[52%] sm:w-[50%]'}`}>
          {hasCoverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl!}
              alt={topic.title}
              decoding="async"
              className={`topic-card-img w-full h-full max-h-[118px] sm:max-h-[128px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] transition-all duration-100 group-active:scale-105 group-[.is-active]:scale-105 ${
                topic.slug === 'tung-dinh-duong'
                  ? 'max-w-[74px] max-h-[74px] sm:max-w-[82px] sm:max-h-[82px] object-cover rounded-[14px] border border-white/25 shadow-md'
                  : 'object-contain'
              } ${topic.slug === 'cot-song' ? 'scale-110' : ''}`}
              onError={() => setImgError(true)}
              loading="eager"
            />
          ) : (
            <div className="text-white drop-shadow-md">
              <TopicIcon name={topic.icon} size={44} />
            </div>
          )}
        </div>

        <div className={`relative z-10 flex flex-col gap-1 ${boldTitle ? 'max-w-[70%]' : 'max-w-[66%] sm:max-w-[62%]'}`}>
          <div className="flex items-center gap-1 text-[8.5px] sm:text-[9.5px] font-bold uppercase tracking-wider text-purple-200/90 leading-tight">
            <svg className="topic-card-heart w-2.5 h-2.5 text-purple-300 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span className="truncate">{mindMapSubtitle}</span>
          </div>

          <h3 className={`font-extrabold text-white uppercase tracking-normal leading-[1.2] drop-shadow-sm mt-0.5 line-clamp-2 text-[13.5px] min-[390px]:text-[14px] sm:text-[15px] whitespace-pre-line ${boldTitle ? 'topic-card-title-bold' : ''}`}>
            {displayTitle}
          </h3>
        </div>

        {/* 3. HUY HIỆU VÀNG NỔI BẬT PHÍA DƯỚI */}
        <div className="relative z-10 mt-auto pt-2 flex items-center">
          <span className="topic-card-badge inline-flex items-center px-2 py-0.5 rounded-[4px] bg-[#FCE38A] text-[#190E33] text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm transition-all duration-100 group-active:!bg-[#FEF08A] group-[.is-active]:!bg-[#FEF08A]">
            {isAvailable ? `${pageCount} BÀI CỐT LÕI` : 'SẮP RA MẮT'}
          </span>
        </div>
      </div>
    </Link>
  );
}
