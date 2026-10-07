'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Play, BookOpen, Flame, ChevronDown, ChevronUp, X } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface FeaturedItem {
  id: string;
  topicSlug: string;
  topicTitle: string;
  pageSlug: string;
  pageTitle: string;
  badge: string;
  badgeColor: string;
  description: string;
  coverUrl: string;
  videoCount: number;
}

const FEATURED_ITEMS: FeaturedItem[] = [
  {
    id: 'cot-song-1',
    topicSlug: 'cot-song',
    topicTitle: 'Cột sống',
    pageSlug: 'tong-quan-ve-cot-song',
    pageTitle: 'Tổng quan về cột sống & Đường cong sinh lý',
    badge: 'CỐT LÕI Y KHOA',
    badgeColor: 'bg-blue-600 text-white',
    description: 'Khám phá 4 đoạn cong sinh lý, đĩa đệm và cơ chế phân bổ tải trọng cơ thể.',
    coverUrl: '/images/lessons/tong-quan-ve-cot-song.png',
    videoCount: 4,
  },
  {
    id: 'cot-song-2',
    topicSlug: 'cot-song',
    topicTitle: 'Cột sống',
    pageSlug: 'dia-dem',
    pageTitle: 'Đĩa đệm & Cơ chế thoát vị đĩa đệm',
    badge: 'PHỔ BIẾN NHẤT',
    badgeColor: 'bg-amber-600 text-white',
    description: 'Cơ chế nhân nhầy thoát ra ngoài bao xơ chèn ép rễ thần kinh tọa.',
    coverUrl: '/images/lessons/tong-quan-ve-cot-song.png',
    videoCount: 4,
  },
  {
    id: 'cot-song-3',
    topicSlug: 'cot-song',
    topicTitle: 'Cột sống',
    pageSlug: 'co-gan-day-chang',
    pageTitle: 'Cơ – Gân – Dây chằng cột sống',
    badge: 'VẬN ĐỘNG & TƯ THẾ',
    badgeColor: 'bg-emerald-600 text-white',
    description: 'Hệ thống cơ sâu giữ vững cột sống và chống co thắt cơ thắt lưng.',
    coverUrl: '/images/lessons/tong-quan-ve-cot-song.png',
    videoCount: 4,
  },
];

interface HomeFeaturedSlideSectionProps {
  defaultHidden?: boolean;
}

export default function HomeFeaturedSlideSection({ defaultHidden = false }: HomeFeaturedSlideSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(!defaultHidden);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const idx = Math.round(scrollLeft / clientWidth);
      setActiveIndex(idx);
    }
  };

  const scrollToSlide = (idx: number) => {
    playTapSound();
    if (!scrollRef.current) return;
    const clientWidth = scrollRef.current.clientWidth;
    scrollRef.current.scrollTo({
      left: idx * clientWidth,
      behavior: 'smooth',
    });
    setActiveIndex(idx);
  };

  // Trạng thái thu gọn mặc định: thanh 1 dòng tinh gọn, không choáng ngợp trang chủ
  if (!isExpanded) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={() => {
            playTapSound();
            setIsExpanded(true);
          }}
          className="w-full flex items-center justify-between px-3 py-2 rounded-[14px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-900/50 shadow-2xs hover:border-blue-400 active:scale-[0.99] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
              <Flame size={12} className="text-rose-600 fill-rose-500" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-black text-slate-800 dark:text-white truncate">
              Bài giảng nổi bật trong tuần ({FEATURED_ITEMS.length} bài)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-sky-300 shrink-0">
            <span>Mở xem</span>
            <ChevronDown size={13} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-2 mt-1 w-full select-none animate-fadeIn">
      {/* Tiêu đề khối & Nút thu gọn */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-rose-500/10 flex items-center justify-center">
            <Flame size={13} className="text-rose-600 fill-rose-500" />
          </div>
          <h3 className="text-[13.5px] sm:text-[14.5px] font-black tracking-tight text-slate-900 dark:text-white">
            Nổi bật trong tuần
          </h3>
        </div>

        {/* Nút Thu gọn & Chấm tròn slide */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {FEATURED_ITEMS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i
                    ? 'w-5 bg-[#1E3A8A] dark:bg-[#F8DF7B]'
                    : 'w-1.5 bg-slate-300 dark:bg-purple-900/60 hover:bg-slate-400'
                }`}
                aria-label={`Chuyển đến slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              playTapSound();
              setIsExpanded(false);
            }}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-[6px] text-[10.5px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all cursor-pointer"
            title="Thu gọn khối nổi bật"
          >
            <ChevronUp size={12} strokeWidth={2.5} />
            <span>Thu gọn</span>
          </button>
        </div>
      </div>

      {/* Slide lướt ngang chuẩn 16:9 Snap Scroll */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 py-0.5"
      >
        {FEATURED_ITEMS.map((item, idx) => {
          const itemHref = `/${item.topicSlug}/${item.pageSlug}`;

          return (
            <article
              key={item.id}
              className="relative w-full shrink-0 snap-start rounded-[20px] overflow-hidden border border-slate-200/90 dark:border-purple-800/40 shadow-xs bg-slate-900 group"
            >
              {/* Khung ảnh 16:9 với lớp phủ Gradient */}
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.coverUrl}
                  alt={item.pageTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* Gradient nền để chữ luôn tương phản hoàn hảo */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#061226] via-[#0B254E]/75 to-black/30" />

                {/* Huy hiệu góc trên bên trái */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${item.badgeColor}`}
                  >
                    <Sparkles size={10} />
                    <span>{item.badge}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold">
                    {item.topicTitle} · {item.videoCount} video
                  </span>
                </div>

                {/* Nội dung chữ ở góc dưới */}
                <div className="absolute bottom-2.5 left-3 right-3 flex flex-col gap-1 text-white">
                  <h4 className="text-[14px] sm:text-[16px] font-black leading-snug line-clamp-1 drop-shadow-sm">
                    {item.pageTitle}
                  </h4>
                  <p className="text-[11px] sm:text-[12px] text-slate-200 line-clamp-1 font-normal opacity-90">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-1">
                    <Link
                      href={itemHref}
                      className="inline-flex items-center gap-1.5 h-7 px-3 rounded-[9px] bg-white text-[#1E3A8A] text-[11px] font-black shadow-xs active:scale-95 transition-transform hover:bg-blue-50"
                    >
                      <Play size={11} fill="currentColor" />
                      <span>Học ngay</span>
                      <ArrowRight size={12} strokeWidth={2.5} />
                    </Link>

                    <span className="text-[10px] text-white/75 font-semibold">
                      Vuốt để xem tiếp ➔
                    </span>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
