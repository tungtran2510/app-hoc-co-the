'use client';

import React, { useState } from 'react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

interface Anatomy3DModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSystem?: string;
  topicTitle?: string;
}

export default function Anatomy3DModal({
  isOpen,
  onClose,
  topicTitle,
}: Anatomy3DModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-3 animate-in fade-in duration-200">
      <div
        className={`w-full bg-[#0E131F] text-white flex flex-col overflow-hidden shadow-2xl transition-all duration-300 border border-slate-700/60 ${
          isFullscreen
            ? 'h-full w-full rounded-0'
            : 'h-full sm:h-[92vh] sm:max-w-[760px] md:max-w-[900px] sm:rounded-[24px]'
        }`}
      >
        {/* Header bar tinh gọn */}
        <div className="flex items-center justify-between px-3.5 sm:px-5 py-2.5 bg-[#141C2E] border-b border-slate-700/60 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center text-[15px] shrink-0">
              🦴
            </span>
            <div className="min-w-0">
              <h3 className="text-[14.5px] sm:text-[16px] font-black text-white flex items-center gap-1.5 truncate">
                <span>Mô hình 3D Cột sống & Đĩa đệm</span>
                {topicTitle && (
                  <span className="hidden sm:inline text-slate-400 font-normal text-[13px] truncate">
                    · {topicTitle}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-blue-300/80 hidden sm:block">
                Tương tác xoay 360°, phóng to thu nhỏ & phân tích chi tiết đĩa đệm
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

        {/* Khung nhúng Three.js 3D Viewer: Tải trực tiếp Xương và Đĩa đệm (skeletal,joints) */}
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

        {/* Footer tip */}
        <div className="px-3 py-2 bg-[#0B0F19] border-t border-slate-800/80 text-[11px] sm:text-[11.5px] text-slate-400 flex items-center justify-between shrink-0">
          <span className="truncate">
            💡 <strong>Thao tác:</strong> 1 ngón tay xoay · 2 ngón tay thu phóng · Chạm 2 lần để reset góc nhìn
          </span>
          <span className="hidden sm:inline-block text-blue-400 font-semibold shrink-0">
            Cột sống & Đĩa đệm 3D
          </span>
        </div>
      </div>
    </div>
  );
}
