'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Ghi log lỗi để kiểm tra nếu cần
    console.error('Lỗi hiển thị trang:', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-6 min-h-[60vh]">
      <div className="w-16 h-16 rounded-[20px] bg-[#FBE7E1] text-[#7A2F12] flex items-center justify-center">
        <AlertCircle size={32} />
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-[22px] font-extrabold text-ink leading-tight">
          Đang tải lại trang...
        </h2>
        <p className="text-[15px] text-muted max-w-[320px]">
          Trang đang được làm mới hoặc đã xảy ra gián đoạn kết nối.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center gap-2 h-12 px-5 rounded-[14px] bg-primary text-white font-bold text-[15px] shadow-xs"
        >
          <RotateCcw size={16} />
          <span>Thử lại</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 h-12 px-5 rounded-[14px] bg-white border border-line text-ink font-bold text-[15px] shadow-xs"
        >
          <Home size={16} />
          <span>Về trang chủ</span>
        </Link>
      </div>
    </div>
  );
}
