'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Bookmark, Sparkles } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

export default function BottomNav() {
  const pathname = usePathname();

  const isHome = pathname === '/';
  const isSaved = pathname === '/da-luu';
  const isAi = pathname === '/tro-ly-ai';
  // Tab "Chuyên đề" sáng khi đang ở trang tất cả chuyên đề, trong một chuyên đề hoặc trong một bài học
  const isTopics = !isHome && !isAi && !isSaved && !pathname.startsWith('/dang-nhap') && !pathname.startsWith('/tim-kiem');

  const baseItem =
    'flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer';
  const activeText = 'text-[#1E3A8A] dark:text-[#F8DF7B] font-black scale-105';
  const idleText = 'text-slate-600 dark:text-purple-300/80 font-bold hover:text-[#172554] dark:hover:text-purple-200';

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    playTapSound();
    if (pathname === href) {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white dark:bg-[#100922] border-t border-slate-200 dark:border-[#2A184D] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.6)] transition-colors duration-200"
      style={{ transform: 'translateZ(0)' }}
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] md:max-w-[820px] lg:max-w-[820px] h-[80px] pb-2 grid grid-cols-4 select-none bg-white dark:bg-[#100922] transition-all">
        {/* 1. Tổng quan */}
        <Link
          href="/"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/')}
          className={`${baseItem} ${isHome ? activeText : idleText}`}
          aria-label="Tổng quan"
        >
          <Home size={22} strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[11px] sm:text-[12px] leading-tight">Tổng quan</span>
        </Link>

        {/* 2. Chuyên đề */}
        <Link
          href="/chuyen-de"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/chuyen-de')}
          className={`${baseItem} ${isTopics ? activeText : idleText}`}
          aria-label="Chuyên đề"
        >
          <LayoutGrid size={22} strokeWidth={isTopics ? 2.5 : 2} />
          <span className="text-[11px] sm:text-[12px] leading-tight">Chuyên đề</span>
        </Link>

        {/* 3. Đã lưu */}
        <Link
          href="/da-luu"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/da-luu')}
          className={`${baseItem} ${isSaved ? activeText : idleText}`}
          aria-label="Bài học đã lưu"
        >
          <Bookmark size={22} strokeWidth={isSaved ? 2.5 : 2} className={isSaved ? 'fill-[#1E3A8A] dark:fill-[#F8DF7B]' : ''} />
          <span className="text-[11px] sm:text-[12px] leading-tight">Đã lưu</span>
        </Link>

        {/* 4. Hỏi đáp AI */}
        <Link
          href="/tro-ly-ai"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/tro-ly-ai')}
          className={`${baseItem} ${isAi ? activeText : idleText}`}
          aria-label="Hỏi đáp AI"
        >
          <div className="relative">
            <Sparkles size={22} strokeWidth={isAi ? 2.5 : 2} className={isAi ? 'fill-[#1E3A8A]/20 text-[#1E3A8A] dark:fill-[#F8DF7B]/20 dark:text-[#F8DF7B]' : ''} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1E3A8A] dark:bg-[#F8DF7B] animate-pulse" />
          </div>
          <span className="text-[11px] sm:text-[12px] leading-tight">Hỏi đáp AI</span>
        </Link>
      </div>
    </nav>
  );
}
