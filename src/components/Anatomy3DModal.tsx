'use client';

import React, { useState, useEffect } from 'react';
import { X, Maximize2, Minimize2, Sparkles, RefreshCw } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

interface Anatomy3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSystem?: string; // skeletal | joints | muscular | cardiovascular | lymphatic | nervous | visceral
  topicTitle?: string;
}

const SYSTEMS = [
  { id: 'skeletal', label: 'Hệ Xương', icon: '🦴', color: 'from-amber-500/20 to-orange-500/20' },
  { id: 'joints', label: 'Hệ Khớp', icon: '🔗', color: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'muscular', label: 'Hệ Cơ', icon: '💪', color: 'from-red-500/20 to-rose-500/20' },
  { id: 'visceral', label: 'Nội Tạng', icon: '🫁', color: 'from-emerald-500/20 to-teal-500/20' },
  { id: 'cardiovascular', label: 'Tim Mạch', icon: '🫀', color: 'from-rose-500/20 to-pink-500/20' },
  { id: 'nervous', label: 'Thần Kinh', icon: '🧠', color: 'from-purple-500/20 to-violet-500/20' },
  { id: 'lymphatic', label: 'Bạch Huyết', icon: '🛡️', color: 'from-teal-500/20 to-cyan-500/20' },
];

export default function Anatomy3DModal({
  isOpen,
  onClose,
  initialSystem = 'skeletal',
  topicTitle,
}: Anatomy3DModalProps) {
  const [activeSystem, setActiveSystem] = useState(initialSystem);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (initialSystem) {
      setActiveSystem(initialSystem);
    }
  }, [initialSystem]);

  if (!isOpen) return null;

  const handleSelectSystem = (sysId: string) => {
    playTapSound();
    setActiveSystem(sysId);
    setIsLoading(true);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-3 animate-in fade-in duration-200">
      <div
        className={`w-full bg-[#0E131F] text-white flex flex-col overflow-hidden shadow-2xl transition-all duration-300 border border-slate-700/60 ${
          isFullscreen
            ? 'h-full w-full rounded-0'
            : 'h-full sm:h-[92vh] sm:max-w-[760px] md:max-w-[900px] sm:rounded-[24px]'
        }`}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 bg-[#141C2E] border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center text-[15px] shrink-0">
              🦴
            </span>
            <div className="min-w-0">
              <h3 className="text-[14.5px] sm:text-[16px] font-black text-white flex items-center gap-1.5 truncate">
                <span>Mô hình Giải phẫu 3D</span>
                {topicTitle && (
                  <span className="hidden sm:inline text-slate-400 font-normal text-[13px] truncate">
                    · {topicTitle}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-blue-300/80 hidden sm:block">
                Tương tác xoay 360°, phóng to thu nhỏ & phân tích lớp giải phẫu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              title={isFullscreen ? 'Thu nhỏ' : 'Toàn màn hình'}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-900/60 hover:text-red-300 text-slate-300 flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Đóng mô hình 3D"
            >
              <X size={17} strokeWidth={2.5} />
            </button>
          </div>
        </div>

        {/* Thanh chuyển nhanh 7 hệ cơ quan */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#0B0F19] border-b border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          {SYSTEMS.map((sys) => {
            const isActive = activeSystem === sys.id;
            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => handleSelectSystem(sys.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
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
        </div>

        {/* Khung nhúng Three.js 3D Viewer */}
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

        {/* Footer tip */}
        <div className="px-3 py-2 bg-[#0B0F19] border-t border-slate-800/80 text-[11px] sm:text-[11.5px] text-slate-400 flex items-center justify-between shrink-0">
          <span className="truncate">
            💡 <strong>Thao tác:</strong> 1 ngón tay xoay · 2 ngón tay thu phóng · Chạm 2 lần để reset góc nhìn
          </span>
          <span className="hidden sm:inline-block text-blue-400 font-semibold shrink-0">
            Atlas Giải Phẫu Y Khoa 3D
          </span>
        </div>
      </div>
    </div>
  );
}
