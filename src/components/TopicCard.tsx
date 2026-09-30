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

export const TOPIC_SUBTITLES: Record<string, string> = {
  'cot-song': 'Đốt sống & Thần kinh',
  'dinh-duong': 'Dưỡng chất & Tế bào',
  'nuoc': 'Tế bào & Cân bằng dịch',
  'tieu-hoa': 'Dạ dày, Ruột & Hấp thu',
  'co-the-nguoi': 'Hệ cơ xương & Vận động',
  'noi-tiet-chuyen-hoa': 'Nội tiết & Hormone',
  'gan-mat-tuy': 'Thải độc & Chức năng gan',
  'mien-dich': 'Bạch cầu & Kháng thể',
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
  const subtitle = TOPIC_SUBTITLES[topic.slug] || topic.description || 'Chuyên đề giải phẫu';

  return (
    <Link
      href={`/${topic.slug}`}
      prefetch={true}
      className="flex flex-col p-3 sm:p-3.5 rounded-[22px] bg-gradient-to-b from-[#2052C4] via-[#123696] to-[#0A1D54] hover:from-[#255DE0] hover:to-[#0C2260] border border-sky-300/30 hover:border-amber-300/60 transition-all duration-200 active:scale-[0.98] group overflow-hidden relative cursor-pointer shadow-[0_8px_20px_rgba(10,29,84,0.22)] hover:shadow-[0_12px_28px_rgba(32,82,196,0.35)]"
    >
      {/* Tia sáng hào quang phía sau khung tròn */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-28 bg-sky-300/20 rounded-full blur-xl pointer-events-none group-hover:bg-sky-300/35 transition-all" />

      {/* 1. KHUNG HUY HIỆU VÀNG KIM TRÒN (MEDALLION) CHỨA MÔ HÌNH 3D NHƯ MẪU THIẾT KẾ BẠN CHỌN */}
      <div className="relative w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] rounded-full p-[2.5px] bg-gradient-to-b from-[#FFE58F] via-[#D4A338] to-[#8C6415] shadow-[0_4px_14px_rgba(0,0,0,0.45)] mx-auto mt-0.5 shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#0F2856] to-[#061126] border border-amber-300/40 flex items-center justify-center relative shadow-inner">
          {hasCoverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl!}
              alt={topic.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B253D] via-[#0E3A5F] to-[#124B79] text-white/80">
              <TopicIcon name={topic.icon} size={36} />
            </div>
          )}
        </div>
      </div>

      {/* 2. TIÊU ĐỀ IN HOA BOLD & PHỤ ĐỀ Y KHOA ĐẲNG CẤP */}
      <div className="mt-2.5 flex flex-col items-center text-center flex-1 min-w-0">
        <h3 className="text-[14px] sm:text-[15px] font-black text-white uppercase tracking-wider leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
          {topic.title}
        </h3>

        <p className="text-[11px] sm:text-[11.5px] text-sky-100/75 leading-tight line-clamp-1 mt-0.5 font-medium">
          {subtitle}
        </p>
      </div>

      {/* 3. THANH TIẾN ĐỘ & HUY HIỆU VÀNG KIM THEO CHUẨN MẪU IPHONE */}
      <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-col gap-1.5 w-full">
        {isAvailable ? (
          <>
            <div className="flex items-center justify-center gap-1.5 text-amber-300 text-[10.5px] font-extrabold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24] animate-pulse" />
              <span>6 BÀI · 9 VIDEO</span>
            </div>
            <div className="w-full h-[5px] rounded-full bg-black/40 overflow-hidden p-[0.5px]">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-[0_0_8px_rgba(251,191,36,0.8)] w-[85%]" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center gap-1.5 text-amber-200/80 text-[10.5px] font-bold tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
              <span>SẮP RA MẮT</span>
            </div>
            <div className="w-full h-[5px] rounded-full bg-black/40 overflow-hidden p-[0.5px]">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400/60 to-amber-500/60 w-[20%]" />
            </div>
          </>
        )}
      </div>
    </Link>
  );
}
