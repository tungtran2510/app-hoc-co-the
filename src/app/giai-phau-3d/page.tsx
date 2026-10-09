'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Maximize2, Minimize2 } from 'lucide-react';
import { playTapSound } from '../../lib/audioFeedback';

export default function GiaiPhau3DPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#050811] text-white">
      {/* Top Header */}
      <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 bg-[#0F172A] border-b border-slate-800 shrink-0">
        <Link
          href="/"
          onClick={playTapSound}
          className="flex items-center gap-1 h-9 px-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-[13px] font-extrabold transition-all"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[14px] sm:text-[15px] font-black text-white flex items-center gap-1.5">
            <span>🦴</span>
            <span>Mô hình 3D Cột sống & Đĩa đệm</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center cursor-pointer transition-colors"
          title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </header>

      {/* 3D Frame: Chỉ nạp Xương và Đĩa đệm */}
      <div className="relative flex-1 w-full bg-[#050811] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050811] text-slate-300 gap-2">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] font-bold text-blue-300">
              Đang nạp mô hình 3D cột sống & đĩa đệm...
            </span>
          </div>
        )}

        <iframe
          src="/3d/index.html#sys=skeletal,joints&cam=0,1.15,1.6,0,1.15,0"
          title="Mô hình 3D Cột sống & Đĩa đệm"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen; accelerometer; gyroscope"
        />
      </div>
    </div>
  );
}
