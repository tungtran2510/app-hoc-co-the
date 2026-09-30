'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopicIcon from './TopicIcon';
import { Topic } from '../lib/types';
import { Play, ArrowRight } from 'lucide-react';

export const DEFAULT_TOPIC_COVERS: Record<string, string> = {
  'cot-song': '/spine_hero_clean.png',
  'dinh-duong': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop',
  'nuoc': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=600&auto=format&fit=crop',
  'tieu-hoa': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600&auto=format&fit=crop',
  'co-the-nguoi': 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=600&auto=format&fit=crop',
  'noi-tiet-chuyen-hoa': 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop',
  'gan-mat-tuy': 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop',
  'mien-dich': 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop',
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
      className={`flex flex-col rounded-[20px] bg-white border transition-all duration-200 active:scale-[0.98] group overflow-hidden relative cursor-pointer shadow-xs hover:shadow-md ${
        isAvailable ? 'border-primary/40 ring-1 ring-primary/10' : 'border-line hover:border-line-strong'
      }`}
    >
      {/* 1. KHUNG ẢNH BÌA Y HỌC / ANATOMY 16:10 */}
      <div className="relative w-full aspect-[16/10] sm:h-[110px] overflow-hidden bg-slate-900 shrink-0">
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

        {/* Lớp phủ chuyển màu gradient nhẹ */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Huy hiệu trạng thái trên góc ảnh */}
        <div className="absolute top-2 right-2">
          {isAvailable ? (
            <span className="px-2 py-0.5 rounded-full bg-[#0E6B5A] text-white text-[10px] font-black uppercase tracking-wider shadow-xs backdrop-blur-xs">
              {pageCount} BÀI HỌC
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-black/60 text-white/80 text-[10px] font-bold backdrop-blur-xs border border-white/10">
              SẮP CÓ
            </span>
          )}
        </div>

        {/* Icon Play mờ khi có bài học */}
        {isAvailable && (
          <div className="absolute bottom-2 left-2 w-6 h-6 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-xs">
            <Play size={10} fill="#0E6B5A" className="ml-0.5 text-primary" />
          </div>
        )}
      </div>

      {/* 2. PHẦN CHỮ NẰM DƯỚI NỀN TRẮNG SẠCH SẼ */}
      <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 bg-white min-w-0">
        <h3 className="text-[15.5px] sm:text-[16.5px] font-extrabold text-ink leading-snug line-clamp-1 group-hover:text-primary transition-colors">
          {topic.title}
        </h3>

        <div className="flex items-center justify-between mt-1 text-[12px]">
          {isAvailable ? (
            <span className="text-primary font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0E6B5A] animate-pulse" />
              <span>Sẵn sàng học</span>
            </span>
          ) : (
            <span className="text-muted font-medium">Đang biên soạn</span>
          )}
          <ArrowRight size={13} className="text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
