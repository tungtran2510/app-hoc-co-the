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
      {/* THẺ NGUYÊN KHỐI LIỀN MẠCH CHUẨN THƯƠNG MẠI CAO CẤP */}
      <div className="topic-card-glow relative flex flex-col justify-between p-3.5 sm:p-4 rounded-[18px] bg-gradient-to-br from-white via-[#FAFBFD] to-[#F4F6FB] dark:from-[#1E1238] dark:via-[#160D2C] dark:to-[#0F0820] border border-slate-200/90 dark:border-white/10 text-slate-900 dark:text-white overflow-hidden min-h-[150px] sm:min-h-[160px] shadow-[0_4px_20px_-4px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04)] dark:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)] transition-all duration-100">
        
        {/* VẦNG SÁNG HÀO QUANG KÍNH MỜ ÊM DỊU */}
        <div className="topic-card-inner-glow absolute -top-8 -right-8 w-28 h-28 rounded-full blur-xl pointer-events-none bg-blue-500/5 dark:bg-purple-600/20 transition-all duration-100" />
        <div className="topic-card-inner-glow absolute -bottom-8 -left-8 w-24 h-24 rounded-full blur-xl pointer-events-none bg-blue-500/5 dark:bg-purple-600/15 transition-all duration-100" />

        {/* 1. ẢNH GIẢI PHẪU 3D TRONG SUỐT BÊN PHẢI (NỔI BẬT NHƯ TÁC PHẨM NGHỆ THUẬT Y KHOA) */}
        <div className={`absolute right-1 top-2 bottom-2 flex items-center justify-center pointer-events-none overflow-visible select-none z-0 ${boldTitle ? 'w-[48%]' : 'w-[52%] sm:w-[50%]'}`}>
          {hasCoverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl!}
              alt={topic.title}
              decoding="async"
              className={`topic-card-img w-full h-full max-h-[118px] sm:max-h-[128px] drop-shadow-[0_4px_12px_rgba(15,23,42,0.14)] dark:drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)] transition-all duration-100 group-active:scale-105 group-[.is-active]:scale-105 ${
                topic.slug === 'tung-dinh-duong'
                  ? 'max-w-[74px] max-h-[74px] sm:max-w-[82px] sm:max-h-[82px] object-cover rounded-[14px] border border-slate-200 dark:border-white/25 shadow-md'
                  : 'object-contain'
              } ${topic.slug === 'cot-song' ? 'scale-110' : ''}`}
              onError={() => setImgError(true)}
              loading="eager"
            />
          ) : (
            <div className="text-[#1E3A8A] dark:text-purple-300/60 drop-shadow-md">
              <TopicIcon name={topic.icon} size={44} />
            </div>
          )}
        </div>

        {/* 2. CỘT THÔNG TIN BÊN TRÁI: NHÃN PHÂN LOẠI Y KHOA ĐẶC TRƯNG + TIÊU ĐỀ XANH THAN QUYỀN LỰC */}
        <div className={`relative z-10 flex flex-col gap-1 ${boldTitle ? 'max-w-[66%]' : 'max-w-[62%] sm:max-w-[58%]'}`}>
          {/* Nhãn phân loại chuyên khoa y tế nhỏ gọn, tinh tế, riêng biệt cho từng khối */}
          <div className="flex items-center">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[7.5px] sm:text-[8px] font-black uppercase tracking-wider leading-tight shadow-3xs ${accent.tagBg} ${accent.tagText} ${accent.tagBorder}`}>
              <span className={`w-1 h-1 rounded-full ${accent.badgeDot} shrink-0`} />
              <span className="truncate">{mindMapSubtitle}</span>
            </span>
          </div>

          {/* Tiêu đề tiếng Việt in hoa đồng bộ: Xanh Than #071735 ở Light Mode & Trắng sáng ở Dark Mode */}
          <h3 className={`font-extrabold text-[#071735] dark:text-white uppercase tracking-normal leading-[1.2] drop-shadow-none dark:drop-shadow-sm mt-0.5 line-clamp-2 text-[13.5px] min-[390px]:text-[14px] sm:text-[15px] whitespace-pre-line ${boldTitle ? 'topic-card-title-bold' : ''}`}>
            {displayTitle}
          </h3>
        </div>

        {/* 3. HUY HIỆU DẠNG VIÊN THUỐC (PILL BADGE) TINH TẾ & THÔNG MINH */}
        <div className="relative z-10 mt-auto pt-2 flex items-center">
          <span className="topic-card-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100/90 dark:bg-purple-950/70 border border-slate-200/80 dark:border-purple-800/50 text-slate-700 dark:text-purple-200 text-[9.5px] sm:text-[10px] font-bold tracking-tight shadow-2xs transition-all duration-100 group-active:!bg-[#1E3A8A] group-active:!text-white group-active:!border-[#1E3A8A] group-[.is-active]:!bg-[#1E3A8A] group-[.is-active]:!text-white group-[.is-active]:!border-[#1E3A8A] dark:group-active:!bg-[#FDE047] dark:group-active:!text-black dark:group-[.is-active]:!bg-[#FDE047] dark:group-[.is-active]:!text-black">
            <span className={`w-1.5 h-1.5 rounded-full ${accent.badgeDot} shrink-0`} />
            <span>{isAvailable ? `${pageCount} bài cốt lõi` : 'Sắp ra mắt'}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
