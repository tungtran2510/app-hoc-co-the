'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { playTapSound } from '../../lib/audioFeedback';

const SYSTEMS = [
  { id: 'skeletal', label: 'Hệ Xương', icon: '🦴' },
  { id: 'joints', label: 'Hệ Khớp', icon: '🔗' },
  { id: 'muscular', label: 'Hệ Cơ', icon: '💪' },
  { id: 'visceral', label: 'Nội Tạng', icon: '🫁' },
  { id: 'cardiovascular', label: 'Tim Mạch', icon: '🫀' },
  { id: 'nervous', label: 'Thần Kinh', icon: '🧠' },
  { id: 'lymphatic', label: 'Bạch Huyết', icon: '🛡️' },
];

export default function GiaiPhau3DPage() {
  const [activeSystem, setActiveSystem] = useState('skeletal');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleSelectSystem = (sysId: string) => {
    playTapSound();
    setActiveSystem(sysId);
    setIsLoading(true);
  };

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
            <span>Atlas Giải Phẫu 3D</span>
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

      {/* Systems switcher */}
      <nav aria-label="Các hệ cơ quan 3D" className="flex items-center gap-1.5 px-3 py-2 bg-[#0A0E1A] border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
        {SYSTEMS.map((sys) => {
          const isActive = activeSystem === sys.id;
          return (
            <button
              key={sys.id}
              type="button"
              onClick={() => handleSelectSystem(sys.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs ring-2 ring-blue-400/40'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{sys.icon}</span>
              <span>{sys.label}</span>
            </button>
          );
        })}
      </nav>

      {/* 3D Frame */}
      <div className="relative flex-1 w-full bg-[#050811] overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#050811] text-slate-300 gap-2">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] font-bold text-blue-300">
              Đang nạp mô hình 3D giải phẫu...
            </span>
          </div>
        )}

        <iframe
          key={activeSystem}
          src={`/3d/index.html?system=${activeSystem}`}
          title={`Mô hình 3D hệ ${activeSystem}`}
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen; accelerometer; gyroscope"
        />
      </div>
    </div>
  );
}
