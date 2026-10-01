'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Maximize2, Minimize2, Activity } from 'lucide-react';

export default function GiaiPhau3DPage() {
  const router = useRouter();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'NAVIGATE_LESSON' && event.data.url) {
        router.push(event.data.url);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0d1117] flex flex-col overflow-hidden text-white select-none">
      {/* Top Header Bar */}
      <header className="h-12 bg-[#161b22]/95 backdrop-blur border-b border-[#30363d] flex items-center justify-between px-3 z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#21262d] text-[#c9d1d9] hover:text-white hover:bg-[#30363d] transition-colors text-xs font-semibold"
            aria-label="Về trang chủ"
          >
            <ArrowLeft size={16} />
            <span>Trang chủ</span>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-white leading-tight flex items-center gap-1.5">
              <span>Atlas Giải Phẫu 3D</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#1f6feb]/20 text-[#58a6ff] border border-[#388bfd]/30 font-medium">
                PRO
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Link
            href="/chan-doan-hinh-anh"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#21262d] text-[#58a6ff] hover:text-white hover:bg-[#30363d] transition-colors text-xs font-semibold"
            title="Chẩn đoán hình ảnh & Lâm sàng"
          >
            <Activity size={14} className="text-emerald-400" />
            <span className="hidden sm:inline">Chẩn đoán hình ảnh</span>
          </Link>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
            title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            aria-label="Toàn màn hình"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* 3D Atlas Frame */}
      <main className="flex-1 w-full h-full relative">
        <iframe
          src="/3d/index.html"
          title="Mô hình Giải phẫu 3D"
          className="w-full h-full border-0 absolute inset-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"
        />
      </main>
    </div>
  );
}
