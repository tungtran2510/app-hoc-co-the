'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, PlayCircle, Check, ArrowRight, X, ChevronRight, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import {
  getReviewVideos,
  removeReviewVideo,
  ReviewVideoItem,
  saveVideoWatched,
} from '../lib/learningProgress';
import { LEARNING_PROGRESS_EVENT } from '../lib/userSync';
import { playTapSound } from '../lib/audioFeedback';

interface HomeReviewVideosSectionProps {
  defaultHidden?: boolean;
}

export default function HomeReviewVideosSection({ defaultHidden = false }: HomeReviewVideosSectionProps) {
  const [reviewList, setReviewList] = useState<ReviewVideoItem[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(!defaultHidden);
  const [mounted, setMounted] = useState(false);

  const loadData = () => {
    try {
      const list = getReviewVideos();
      setReviewList(list);
      const hidden = localStorage.getItem('qbiz_hide_home_review') === 'true';
      setIsDismissed(hidden);
    } catch {
      setReviewList([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadData();

    const handleUpdate = () => {
      loadData();
    };

    window.addEventListener('learning_progress_changed', handleUpdate);
    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    return () => {
      window.removeEventListener('learning_progress_changed', handleUpdate);
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    };
  }, []);

  const handleDismiss = () => {
    playTapSound();
    setIsDismissed(true);
    try {
      localStorage.setItem('qbiz_hide_home_review', 'true');
    } catch {}
  };

  const handleMarkUnderstood = (e: React.MouseEvent, item: ReviewVideoItem) => {
    e.preventDefault();
    e.stopPropagation();
    playTapSound();
    removeReviewVideo(item.page_id, item.video_index);
    saveVideoWatched(item.page_id, item.video_index);
    loadData();
  };

  // Tự động ẩn hoàn toàn nếu không có video nào hoặc người dùng đã bấm ẩn
  if (!mounted || isDismissed || reviewList.length === 0) {
    return null;
  }

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
          className="w-full flex items-center justify-between px-3 py-2 rounded-[14px] bg-amber-50/80 dark:bg-amber-950/30 border border-amber-300/80 dark:border-amber-800/50 shadow-2xs hover:border-amber-500 active:scale-[0.99] transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0">
              <Zap size={12} className="text-amber-600 fill-amber-500" />
            </div>
            <span className="text-[12px] sm:text-[13px] font-black text-amber-950 dark:text-amber-200 truncate">
              Video chưa hiểu cần ôn tập ({reviewList.length} video)
            </span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300 shrink-0">
            <span>Ôn tập ngay</span>
            <ChevronDown size={13} strokeWidth={2.5} className="group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-2 mt-2 w-full animate-fadeIn">
      {/* Tiêu đề khối & Nút ẩn / Xem tất cả / Thu gọn */}
      <div className="flex items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <Zap size={13} className="text-amber-600 fill-amber-500" />
          </div>
          <h3 className="text-[14px] sm:text-[15px] font-black tracking-tight text-slate-900 dark:text-white truncate">
            Cần ôn tập
          </h3>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 text-[10px] font-black border border-amber-300 dark:border-amber-700 shrink-0">
            {reviewList.length} video
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/da-luu?tab=review"
            className="inline-flex items-center gap-0.5 text-[11.5px] font-extrabold text-blue-700 dark:text-blue-300 hover:text-blue-900 active:opacity-75 transition-opacity"
          >
            <span>Tất cả</span>
            <ChevronRight size={13} strokeWidth={2.5} />
          </Link>
          <button
            type="button"
            onClick={() => {
              playTapSound();
              setIsExpanded(false);
            }}
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-[6px] text-[10.5px] font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all cursor-pointer"
            title="Thu gọn danh sách ôn tập"
          >
            <ChevronUp size={12} strokeWidth={2.5} />
            <span>Thu gọn</span>
          </button>
        </div>
      </div>

      {/* Danh sách video cần ôn tập dạng Slide lướt ngang (Scroll Snap) */}
      <div className="flex items-stretch gap-2.5 overflow-x-auto pb-1.5 pt-0.5 scrollbar-none snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
        {reviewList.map((item) => {
          const lessonUrl = `/${item.topic_slug}/${item.page_slug}?v=${item.video_index}`;

          return (
            <div
              key={item.id}
              className="flex flex-col gap-2 p-2.5 rounded-[16px] bg-white dark:bg-[#160D30] border border-amber-200/80 dark:border-amber-800/40 shadow-2xs w-[240px] sm:w-[260px] shrink-0 snap-start select-none"
            >
              {/* Thumbnail 16:9 */}
              <Link
                href={lessonUrl}
                className="relative aspect-video w-full rounded-[10px] overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-purple-800/50 block group active:opacity-90"
              >
                {item.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.cover_url}
                    alt={item.video_title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                    <PlayCircle size={24} />
                  </div>
                )}
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/80 text-[8.5px] font-black text-white">
                  #{item.video_index}
                </span>
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                  <PlayCircle size={22} className="text-white drop-shadow" />
                </div>
              </Link>

              {/* Thông tin video */}
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider text-blue-700 dark:text-blue-300 truncate">
                  {item.topic_title} · {item.page_title}
                </span>
                <Link href={lessonUrl} className="active:opacity-80">
                  <h4 className="text-[12px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-blue-700 transition-colors">
                    {item.video_title}
                  </h4>
                </Link>
              </div>

              {/* Hàng nút bấm 1 dòng: Xem lại · Đã hiểu */}
              <div className="flex items-center justify-between gap-1.5 mt-auto pt-1 border-t border-slate-100 dark:border-white/5">
                <Link
                  href={lessonUrl}
                  className="inline-flex items-center gap-1 h-6.5 px-2 rounded-md bg-[#1E3A8A] text-white text-[10.5px] font-extrabold shadow-2xs active:scale-95 transition-transform whitespace-nowrap"
                >
                  <PlayCircle size={11} fill="currentColor" />
                  <span>Xem lại</span>
                </Link>

                <button
                  type="button"
                  onClick={(e) => handleMarkUnderstood(e, item)}
                  className="inline-flex items-center gap-1 h-6.5 px-2 rounded-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 text-[10.5px] font-black cursor-pointer active:scale-95 transition-all shadow-2xs whitespace-nowrap"
                  title="Đánh dấu đã hiểu để gỡ khỏi danh sách ôn tập"
                >
                  <Check size={11} strokeWidth={3} />
                  <span>Đã hiểu</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
