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
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white border-t border-line"
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] h-[80px] pb-2 grid grid-cols-4 select-none">
        {/* 1. Trang chủ */}
        <Link
          href="/"
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isHome ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Trang chủ"
        >
          <Home size={24} strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Trang chủ</span>
        </Link>

        {/* 2. Đang xem */}
        <Link
          href={continueUrl}
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isReading ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Đang xem"
        >
          <BookOpen size={24} strokeWidth={isReading ? 2.5 : 2} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Đang xem</span>
        </Link>

        {/* 3. Đã lưu */}
        <Link
          href="/da-luu"
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isSaved ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Bài học đã lưu"
        >
          <Bookmark size={24} strokeWidth={isSaved ? 2.5 : 2} className={isSaved ? 'fill-primary' : ''} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Đã lưu</span>
        </Link>

        {/* 4. Trợ lý AI (Góc ngoài cùng bên phải, cạnh Đã lưu) */}
        <Link
          href="/tro-ly-ai"
          prefetch={true}
          className={`flex flex-col items-center justify-center gap-1 transition-all duration-100 active:scale-90 active:opacity-70 min-h-[48px] cursor-pointer ${
            isAi ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Trợ lý AI"
        >
          <div className="relative">
            <Sparkles size={24} strokeWidth={isAi ? 2.5 : 2} className={isAi ? 'fill-primary/20 text-primary' : ''} />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          <span className="text-[13px] sm:text-[14px] leading-tight">Trợ lý AI</span>
        </Link>
      </div>
    </nav>
  );
}
