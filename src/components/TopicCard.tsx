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
  'cot-song': 'Đốt Sống, Đĩa Đệm & Thần Kinh',
  'dinh-duong': 'Dưỡng Chất, Vi Chất & Tế Bào',
  'nuoc': 'Tế Bào, Nước & Cân Bằng Dịch',
  'tieu-hoa': 'Dạ Dày, Ruột Non & Đại Tràng',
  'co-the-nguoi': 'Hệ Vận Động & Khung Xương',
  'noi-tiet-chuyen-hoa': 'Tuyến Nội Tiết & Hormone',
  'gan-mat-tuy': 'Thải Độc & Chức Năng Gan Mật',
  'mien-dich': 'Bạch Cầu, Kháng Thể & Miễn Dịch',
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
  const subtitle = TOPIC_SUBTITLES[topic.slug] || topic.description || 'Chuyên đề giải phẫu & sức khỏe';

  return (
    <Link
      href={`/${topic.slug}`}
      prefetch={true}
      className="flex flex-col p-3.5 pb-4 rounded-[26px] bg-gradient-to-b from-[#2E68EE] via-[#1B44C2] to-[#0D2478] hover:from-[#3572FA] hover:to-[#0F2A8C] border border-sky-300/40 hover:border-amber-300/70 transition-all duration-200 active:scale-[0.98] group overflow-hidden relative cursor-pointer shadow-[0_12px_28px_rgba(20,55,180,0.28)] hover:shadow-[0_16px_36px_rgba(46,104,238,0.4)]"
    >
      {/* Vầng hào quang sáng ngọc phía sau khung tròn */}
      <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-32 bg-sky-300/25 rounded-full blur-xl pointer-events-none group-hover:bg-sky-300/40 transition-all" />

      {/* 1. KHUNG HUY HIỆU VÀNG KIM KIM LOẠI 3D (CHÍNH XÁC THEO ẢNH IPHONE) */}
      <div className="relative w-[114px] h-[114px] sm:w-[124px] sm:h-[124px] rounded-full p-[4px] bg-gradient-to-b from-[#FFF2B2] via-[#E5A730] to-[#7A4500] shadow-[0_8px_20px_rgba(0,0,0,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.85)] mx-auto mt-0.5 shrink-0">
        <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#0B2154] via-[#051130] to-[#020714] border border-amber-300/60 flex items-center justify-center relative shadow-inner">
          {hasCoverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coverUrl!}
              alt={topic.title}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ${
                topic.slug === 'cot-song' ? 'scale-125' : ''
              }`}
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B253D] via-[#0E3A5F] to-[#124B79] text-white/80">
              <TopicIcon name={topic.icon} size={40} />
            </div>
          )}
        </div>
      </div>

      {/* 2. TIÊU ĐỀ IN HOA ĐẬM NÉT & DÒNG PHỤ ĐỀ 2 DÒNG NHƯ MẪU ẢNH */}
      <div className="mt-2.5 flex flex-col items-center text-center flex-1 min-w-0">
        <h3 className="text-[13.5px] sm:text-[14.5px] font-black text-white uppercase tracking-wider leading-snug line-clamp-1 drop-shadow-sm group-hover:text-amber-200 transition-colors">
          {topic.title}
        </h3>

        <p className="text-[10.5px] sm:text-[11px] text-sky-100/80 text-center leading-snug line-clamp-2 mt-1 px-1 font-medium min-h-[30px] flex items-center justify-center">
          {subtitle}
        </p>
      </div>

      {/* 3. THANH TIẾN ĐỘ & HUY HIỆU VÀNG KIM PHÁT SÁNG THEO CHUẨN MẪU IPHONE */}
      <div className="mt-2 pt-2 border-t border-white/15 flex flex-col gap-1 w-full">
        <div className="flex items-center justify-center gap-1.5 text-amber-300 text-[10.5px] font-black tracking-wider uppercase">
          {/* Huy hiệu tròn vàng kim có tích V */}
          <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 flex items-center justify-center text-slate-900 shadow-xs shrink-0">
            <svg className="w-2 h-2" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2.5 6.5 5 9 9.5 3.5" />
            </svg>
          </div>
          <span>{isAvailable ? `${pageCount} BÀI · 9 VIDEO` : 'SẮP RA MẮT'}</span>
        </div>

        {/* Thanh tiến độ vàng kim sáng rực */}
        <div className="w-full h-[5px] rounded-full bg-[#061230] overflow-hidden p-[0.5px] mt-1 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
            style={{ width: isAvailable ? '85%' : '18%' }}
          />
        </div>
      </div>
    </Link>
  );
}
