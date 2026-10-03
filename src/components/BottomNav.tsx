'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Bookmark, Sparkles } from 'lucide-react';
import { getStoredXemTiep } from '../lib/learningProgress';

export default function BottomNav() {
  const pathname = usePathname();
  const [continueUrl, setContinueUrl] = useState<string>('/cot-song/tu-the-va-van-dong?v=1');

  useEffect(() => {
    try {
      const stored = getStoredXemTiep();
      if (stored && stored.topic_slug && stored.page_slug) {
        const cleanTopic = stored.topic_slug.replace('cot-song-that-lung', 'cot-song');
        setContinueUrl(`/${cleanTopic}/${stored.page_slug}?v=${stored.video_index || 1}`);
      } else {
        setContinueUrl('/cot-song/tu-the-va-van-dong?v=1');
      }
    } catch {
      setContinueUrl('/cot-song/tu-the-va-van-dong?v=1');
    }
  }, [pathname]);

  const isHome = pathname === '/';
  const isSaved = pathname === '/da-luu';
  const isAi = pathname === '/tro-ly-ai';
  const isReading = !isHome && !isAi && !isSaved && !pathname.startsWith('/dang-nhap') && !pathname.startsWith('/tim-kiem');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white dark:bg-[#100922] border-t border-slate-200 dark:border-[#2A184D] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.6)] transition-colors duration-200"
      style={{ transform: 'translateZ(0)' }}
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] md:max-w-[820px] lg:max-w-[820px] h-[80px] pb-2 grid grid-cols-4 select-none bg-white dark:bg-[#100922] transition-all">
        {/* 1. Trang chủ */}
        <Link
          href="/"
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isHome
              ? 'text-purple-900 dark:text-[#F8DF7B] font-black'
              : 'text-slate-600 dark:text-purple-300/80 font-bold hover:text-purple-800 dark:hover:text-purple-200'
          }`}
          aria-label="Trang chủ"
        >
          <Home size={22} strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[11px] sm:text-[12px] leading-tight">Trang chủ</span>
        </Link>

        {/* 2. Đang xem */}
        <Link
          href={continueUrl}
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isReading
              ? 'text-purple-900 dark:text-[#F8DF7B] font-black'
              : 'text-slate-600 dark:text-purple-300/80 font-bold hover:text-purple-800 dark:hover:text-purple-200'
          }`}
          aria-label="Đang xem"
        >
          <BookOpen size={22} strokeWidth={isReading ? 2.5 : 2} />
          <span className="text-[11px] sm:text-[12px] leading-tight">Đang xem</span>
        </Link>

        {/* 3. Đã lưu */}
        <Link
          href="/da-luu"
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isSaved
              ? 'text-purple-900 dark:text-[#F8DF7B] font-black'
              : 'text-slate-600 dark:text-purple-300/80 font-bold hover:text-purple-800 dark:hover:text-purple-200'
          }`}
          aria-label="Bài học đã lưu"
        >
          <Bookmark size={22} strokeWidth={isSaved ? 2.5 : 2} className={isSaved ? 'fill-purple-900 dark:fill-[#F8DF7B]' : ''} />
          <span className="text-[11px] sm:text-[12px] leading-tight">Đã lưu</span>
        </Link>

        {/* 4. Trợ lý AI */}
        <Link
          href="/tro-ly-ai"
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isAi
              ? 'text-purple-900 dark:text-[#F8DF7B] font-black'
              : 'text-slate-600 dark:text-purple-300/80 font-bold hover:text-purple-800 dark:hover:text-purple-200'
          }`}
          aria-label="Trợ lý AI"
        >
          <div className="relative">
            <Sparkles size={22} strokeWidth={isAi ? 2.5 : 2} className={isAi ? 'fill-purple-900/20 text-purple-900 dark:fill-[#F8DF7B]/20 dark:text-[#F8DF7B]' : ''} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-900 dark:bg-[#F8DF7B] animate-pulse" />
          </div>
          <span className="text-[11px] sm:text-[12px] leading-tight">Trợ lý AI</span>
        </Link>
      </div>
    </nav>
  );
}
