'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Bookmark, Search } from 'lucide-react';
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
  const isSaved = pathname === '/da-luu';
  const isSearch = pathname === '/tim-kiem';
  const isReading = !isHome && !isSaved && !isSearch && !pathname.startsWith('/dang-nhap');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white border-t border-line"
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] h-[80px] pb-2 grid grid-cols-4">
        {/* Trang chủ */}
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

        {/* Đang xem */}
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

        {/* Đã lưu */}
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

        {/* Tìm kiếm */}
        <Link
          href="/tim-kiem"
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
            isSearch ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Tìm kiếm"
        >
          <Search size={24} strokeWidth={isSearch ? 2.5 : 2} />
          <span className="text-[13px] sm:text-[14px] leading-tight">Tìm kiếm</span>
        </Link>
      </div>
    </nav>
  );
}
