'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopicIcon from './TopicIcon';
import { Topic } from '../lib/types';
import { Play, ArrowRight } from 'lucide-react';

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

interface TopicCardProps {
  topic: Topic;
  pageCount: number;
}

export default function TopicCard({ topic, pageCount }: TopicCardProps) {
  const [imgError, setImgError] = useState(false);
  const isAvailable = pageCount > 0;
  const coverUrl = topic.cover_url || DEFAULT_TOPIC_COVERS[topic.slug] || null;
  const hasCoverImage = Boolean(coverUrl) && !imgError;

  return (
    <Link
      href={`/${topic.slug}`}
      prefetch={true}
      className="flex flex-col p-2.5 sm:p-3 rounded-[20px] bg-[#131A26] hover:bg-[#182232] border border-white/10 hover:border-amber-400/40 transition-all duration-200 active:scale-[0.98] group overflow-hidden relative cursor-pointer shadow-md"
    >
      {/* 1. KHUNG ẢNH 3D CÓ VIỀN VÀNG SÂM PANH TINH TẾ (THEO ẢNH MẪU CỦA BẠN) */}
      <div className="relative w-full aspect-[4/3] rounded-[14px] overflow-hidden bg-[#0A0F17] border border-amber-300/35 shrink-0 flex items-center justify-center shadow-inner">
        {hasCoverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl!}
            alt={topic.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B1521] via-[#06332A] to-[#0E6B5A] text-white/80">
            <TopicIcon name={topic.icon} size={36} />
          </div>
        )}
      </div>

      {/* 2. PHẦN CHỮ NẰM DƯỚI NỀN TỐI SANG TRỌNG */}
      <div className="mt-2.5 px-0.5 flex flex-col justify-between flex-1 min-w-0">
        <h3 className="text-[15px] sm:text-[16px] font-extrabold text-white leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
          {topic.title}
        </h3>

        <div className="mt-1 flex items-center">
          {isAvailable ? (
            <span className="flex items-center gap-1.5 text-slate-300 text-[12px] font-medium">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-xs bg-white/15 text-white/90">
                <Play size={8} fill="currentColor" />
              </span>
              <span>{pageCount} bài học{topic.slug === 'cot-song' ? ' · 9 video' : ''}</span>
            </span>
          ) : (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#06332A]/90 border border-[#0E6B5A]/60 text-emerald-400 text-[11px] font-bold">
              Sắp ra mắt
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
