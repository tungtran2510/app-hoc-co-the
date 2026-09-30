'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Search } from 'lucide-react';

interface BottomNavProps {
  continueUrl?: string;
}

export default function BottomNav({ continueUrl = '/cot-song/tong-quan-ve-cot-song' }: BottomNavProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isReading = pathname.includes('/cot-song/');

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 flex justify-center bg-white border-t border-line"
      aria-label="Điều hướng chính"
    >
      <div className="w-full max-w-[480px] h-[84px] pb-3 grid grid-cols-3">
        {/* Trang chủ */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
            isHome ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Trang chủ"
        >
          <Home size={26} strokeWidth={isHome ? 2.5 : 2} />
          <span className="text-[15px] leading-tight">Trang chủ</span>
        </Link>

        {/* Đang xem */}
        <Link
          href={continueUrl}
          className={`flex flex-col items-center justify-center gap-1 transition-opacity active:opacity-80 min-h-[48px] ${
            isReading ? 'text-primary font-bold' : 'text-muted font-medium'
          }`}
          aria-label="Đang xem"
        >
          <BookOpen size={26} strokeWidth={isReading ? 2.5 : 2} />
          <span className="text-[15px] leading-tight">Đang xem</span>
        </Link>

        {/* Tìm kiếm */}
        <button
          type="button"
          onClick={() => {
            // Lệnh 01: chỉ hiển thị, bấm chưa cần làm gì
          }}
          className="flex flex-col items-center justify-center gap-1 text-muted font-medium transition-opacity active:opacity-80 min-h-[48px]"
          aria-label="Tìm kiếm"
        >
          <Search size={26} strokeWidth={2} />
          <span className="text-[15px] leading-tight">Tìm kiếm</span>
        </button>
      </div>
    </nav>
  );
}
