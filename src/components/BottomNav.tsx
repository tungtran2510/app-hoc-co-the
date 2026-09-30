'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Bookmark, Sparkles } from 'lucide-react';
import { getStoredXemTiep } from '../lib/learningProgress';

export default function BottomNav() {
  const pathname = usePathname();
  const [continueUrl, setContinueUrl] = useState<string>('/');

  useEffect(() => {
    try {
      const stored = getStoredXemTiep();
      if (stored && stored.topic_slug && stored.page_slug) {
        setContinueUrl(`/${stored.topic_slug}/${stored.page_slug}?v=${stored.video_index || 1}`);
      } else {
        setContinueUrl('/');
      }
    } catch {
      setContinueUrl('/');
    }
  }, [pathname]);

  const isHome = pathname === '/';
  const isAi = pathname === '/tro-ly-ai';
  const isSaved = pathname === '/da-luu';
  const isReading = !isHome && !isAi && !isSaved && !pathname.startsWith('/dang-nhap') && !pathname.startsWith('/tim-kiem');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white border-t border-line"
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] h-[80px] pb-2 grid grid-cols-4">
        {/* 1. Trang chủ */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
            isHome ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Trang chủ"
        >
          <Home size={24} strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Trang chủ</span>
        </Link>

        {/* 2. Trợ lý AI */}
        <Link
          href="/tro-ly-ai"
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
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

        {/* 3. Đang xem */}
        <Link
          href={continueUrl}
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
            isReading ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Đang xem"
        >
          <BookOpen size={24} strokeWidth={isReading ? 2.5 : 2} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Đang xem</span>
        </Link>

        {/* 4. Đã lưu */}
        <Link
          href="/da-luu"
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
            isSaved ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Bài học đã lưu"
        >
          <Bookmark size={24} strokeWidth={isSaved ? 2.5 : 2} className={isSaved ? 'fill-primary' : ''} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Đã lưu</span>
        </Link>
      </div>
    </nav>
  );
}
