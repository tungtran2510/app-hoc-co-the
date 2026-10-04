'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import TopicCard, { DEFAULT_TOPIC_COVERS, TOPIC_MIND_MAP_SUBTITLES } from './TopicCard';
import TopicIcon from './TopicIcon';
import { Topic } from '../lib/types';

export type TopicsDisplayMode = 'card' | 'text' | 'logo' | 'large';

export const TOPICS_DISPLAY_OPTIONS: { value: TopicsDisplayMode; label: string }[] = [
  { value: 'card', label: 'Thẻ sách' },
  { value: 'text', label: 'Chỉ chữ' },
  { value: 'logo', label: 'Logo + chữ' },
  { value: 'large', label: 'Khung to' },
];

/** Lớp CSS của khung chứa danh sách chuyên đề theo từng kiểu hiển thị */
export function topicsContainerClass(mode: TopicsDisplayMode): string {
  switch (mode) {
    case 'text':
      return 'flex flex-col gap-2 mt-1.5';
    case 'logo':
      return 'flex flex-col gap-2.5 mt-1.5';
    case 'large':
      return 'grid grid-cols-1 gap-3.5 mt-1.5';
    default:
      return 'grid grid-cols-2 gap-2 sm:gap-2.5 mt-1.5';
  }
}

interface TopicTileProps {
  mode: TopicsDisplayMode;
  topic: Topic;
  pageCount: number;
  isActive?: boolean;
  onActivate?: () => void;
  boldTitle?: boolean;
}

export default function TopicTile({ mode, topic, pageCount, isActive, onActivate, boldTitle }: TopicTileProps) {
  const [imgError, setImgError] = useState(false);
  const coverUrl = topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug] || null;
  const hasCover = Boolean(coverUrl) && !imgError;
  const countText = pageCount > 0 ? `${pageCount} bài học` : 'Sắp ra mắt';

  if (mode === 'text') {
    return (
      <Link
        href={`/${topic.slug}`}
        prefetch={true}
        onTouchStart={onActivate}
        className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-[14px] bg-white dark:bg-[#160D30] border border-slate-200/80 dark:border-purple-800/40 shadow-2xs active:scale-[0.99] transition-all"
      >
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">{topic.title}</p>
          <p className="text-[12px] text-slate-500 dark:text-purple-300/80 font-medium mt-0.5">{countText}</p>
        </div>
        <ChevronRight size={18} className="text-slate-400 dark:text-purple-300 shrink-0" />
      </Link>
    );
  }

  if (mode === 'logo') {
    return (
      <Link
        href={`/${topic.slug}`}
        prefetch={true}
        onTouchStart={onActivate}
        className="flex items-center gap-3 p-3 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200/80 dark:border-purple-800/40 shadow-2xs active:scale-[0.99] transition-all"
      >
        <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#231652] to-[#100629] p-1.5 flex items-center justify-center shrink-0 overflow-hidden">
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl!} alt={topic.title} className="w-full h-full object-contain" onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <TopicIcon name={topic.icon} size={28} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2">{topic.title}</p>
          <p className="text-[12px] text-slate-500 dark:text-purple-300/80 font-medium mt-0.5">{countText}</p>
        </div>
        <ChevronRight size={18} className="text-slate-400 dark:text-purple-300 shrink-0" />
      </Link>
    );
  }

  if (mode === 'large') {
    return (
      <Link
        href={`/${topic.slug}`}
        prefetch={true}
        onTouchStart={onActivate}
        className="relative flex flex-col justify-between min-h-[190px] sm:min-h-[210px] p-4 rounded-[20px] bg-gradient-to-br from-[#231652] via-[#1A0E3F] to-[#100629] border border-white/10 text-white overflow-hidden shadow-[0_10px_26px_-12px_rgba(0,0,0,0.55)] active:scale-[0.99] transition-all"
      >
        <div className="absolute right-1 top-2 bottom-2 w-[50%] flex items-center justify-center pointer-events-none">
          {hasCover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverUrl!} alt={topic.title} className="w-full h-full object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.55)]" onError={() => setImgError(true)} loading="lazy" />
          ) : (
            <TopicIcon name={topic.icon} size={72} />
          )}
        </div>
        <div className="relative z-10 flex flex-col gap-1.5 max-w-[52%]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200/90">
            {TOPIC_MIND_MAP_SUBTITLES[topic.slug] || 'ANATOMY'}
          </span>
          <h3 className="text-[19px] font-black uppercase leading-tight line-clamp-3">{topic.title}</h3>
        </div>
        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[#FCE38A] text-[#190E33] text-[11px] font-black uppercase tracking-wider">
            {pageCount > 0 ? `${pageCount} BÀI CỐT LÕI` : 'QUICK REVISION'}
          </span>
          <ChevronRight size={20} className="text-white/80" />
        </div>
      </Link>
    );
  }

  return <TopicCard topic={topic} pageCount={pageCount} isActive={isActive} onActivate={onActivate} boldTitle={boldTitle} />;
}
