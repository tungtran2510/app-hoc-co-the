'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LayoutGrid, Bookmark, Search } from 'lucide-react';

import { playTapSound } from '../lib/audioFeedback';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Tải trước (pre-warm) toàn bộ các tab chính vào bộ nhớ đệm Next.js router
  useEffect(() => {
    try {
      router.prefetch('/');
      router.prefetch('/chuyen-de');
      router.prefetch('/da-luu');
      router.prefetch('/tim-kiem');
      router.prefetch('/tro-ly-ai');
    } catch {}
  }, [router]);

  const isHome = pathname === '/';
  const isSaved = pathname === '/da-luu';
  const isSearch = pathname === '/tim-kiem';
  // Tab "Chuyên đề" sáng khi đang ở trang tất cả chuyên đề, trong một chuyên đề hoặc trong một bài học
  const isTopics = !isHome && !isSearch && !isSaved && !pathname.startsWith('/dang-nhap') && !pathname.startsWith('/tro-ly-ai');

  // Không hiệu ứng giật/nảy, không scale, hiển thị chắc chắn và tức thì
  const baseItem =
    'flex flex-col items-center justify-center gap-1 min-h-[48px] select-none cursor-pointer';
  const activeText = 'text-[#1E3A8A] dark:text-[#F8DF7B] font-extrabold';
  const idleText = 'text-slate-500 dark:text-purple-300/70 font-medium hover:text-slate-800 dark:hover:text-purple-200';

  const handleTabClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    playTapSound();
    if (pathname === href) {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    e.preventDefault();
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white dark:bg-[#100922] border-t border-slate-200 dark:border-[#2A184D] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0_-8px_20px_rgba(0,0,0,0.6)]"
      style={{ transform: 'translateZ(0)' }}
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] md:max-w-[820px] lg:max-w-[820px] h-[80px] pb-2 grid grid-cols-4 select-none bg-white dark:bg-[#100922]">
        {/* 1. Tổng quan */}
        <Link
          href="/"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/')}
          className={`${baseItem} ${isHome ? activeText : idleText}`}
          aria-label="Tổng quan"
        >
          <Home size={22} strokeWidth={isHome ? 2.5 : 2} className="pointer-events-none" />
          <span className="text-[11px] sm:text-[12px] leading-tight pointer-events-none">Tổng quan</span>
        </Link>

        {/* 2. Chuyên đề */}
        <Link
          href="/chuyen-de"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/chuyen-de')}
          className={`${baseItem} ${isTopics ? activeText : idleText}`}
          aria-label="Chuyên đề"
        >
          <LayoutGrid size={22} strokeWidth={isTopics ? 2.5 : 2} className="pointer-events-none" />
          <span className="text-[11px] sm:text-[12px] leading-tight pointer-events-none">Chuyên đề</span>
        </Link>

        {/* 3. Đã lưu */}
        <Link
          href="/da-luu"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/da-luu')}
          className={`${baseItem} ${isSaved ? activeText : idleText}`}
          aria-label="Bài học đã lưu"
        >
          <Bookmark size={22} strokeWidth={isSaved ? 2.5 : 2} className={`pointer-events-none ${isSaved ? 'fill-[#1E3A8A] dark:fill-[#F8DF7B]' : ''}`} />
          <span className="text-[11px] sm:text-[12px] leading-tight pointer-events-none">Đã lưu</span>
        </Link>

        {/* 4. Tìm kiếm */}
        <Link
          href="/tim-kiem"
          prefetch={true}
          onClick={(e) => handleTabClick(e, '/tim-kiem')}
          className={`${baseItem} ${isSearch ? activeText : idleText}`}
          aria-label="Tìm kiếm"
        >
          <Search size={22} strokeWidth={isSearch ? 2.5 : 2} className="pointer-events-none" />
          <span className="text-[11px] sm:text-[12px] leading-tight pointer-events-none">Tìm kiếm</span>
        </Link>
      </div>
    </nav>
  );
}
