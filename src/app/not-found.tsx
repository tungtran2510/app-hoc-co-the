import React from 'react';
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-6">
      <div className="w-20 h-20 rounded-[24px] bg-primary-soft text-primary flex items-center justify-center">
        <Home size={38} strokeWidth={2.5} />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-[28px] font-extrabold text-ink leading-tight">
          Không tìm thấy nội dung này
        </h1>
        <p className="text-[17px] text-muted font-normal leading-relaxed max-w-[340px]">
          Nội dung bạn đang tìm kiếm có thể đã bị di chuyển hoặc không còn tồn tại.
        </p>
      </div>

      <Link
        href="/"
        className="flex items-center justify-center gap-2 h-[60px] min-h-[48px] px-8 rounded-[18px] bg-primary text-white font-extrabold text-[20px] transition-transform active:scale-[0.98] shadow-sm"
      >
        <span>Về trang chủ</span>
      </Link>
    </main>
  );
}
