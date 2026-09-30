'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Image as ImageType } from '../lib/types';

interface LightboxProps {
  isOpen: boolean;
  images: ImageType[];
  initialIndex?: number;
  onClose: () => void;
}

export default function Lightbox({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const lastTapRef = useRef<number>(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setScale(1);
  }, [initialIndex, isOpen]);

  // Xử lý nút quay lại của điện thoại (Back button / popstate)
  useEffect(() => {
    if (!isOpen) return;

    window.history.pushState({ isLightbox: true }, '');

    const handlePopState = () => {
      onClose();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  // Khóa cuộn trang khi mở lightbox
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[currentIndex] || images[0];

  const handleClose = () => {
    if (window.history.state?.isLightbox) {
      window.history.back();
    } else {
      onClose();
    }
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setScale(1);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Chạm đúp để phóng to 2 lần
  const handleTouchEnd = (e: React.TouchEvent) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      setScale((prev) => (prev === 1 ? 2 : 1));
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    // Vuốt trái/phải nếu không đang phóng to
    if (scale === 1 && touchStartXRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartXRef.current;
      if (diffX > 50) {
        handlePrev();
      } else if (diffX < -50) {
        handleNext();
      }
    }
    touchStartXRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Xem ảnh phóng to"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none animate-in fade-in duration-200"
      onClick={() => {
        if (scale > 1) setScale(1);
      }}
    >
      {/* Thanh trên: Chỉ số ảnh & Nút Đóng ≥ 52px */}
      <div className="relative w-full flex items-center justify-between p-4 z-20">
        <div className="text-white/80 font-bold text-[16px] px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs">
          {images.length > 1
            ? `${currentIndex + 1}/${images.length}`
            : 'Xem ảnh'}
        </div>

        {/* Nút Đóng to ≥ 52px */}
        <button
          type="button"
          onClick={handleClose}
          className="w-[54px] h-[54px] rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all cursor-pointer shadow-lg"
          aria-label="Đóng xem ảnh"
        >
          <X size={30} strokeWidth={2.5} />
        </button>
      </div>

      {/* Khu vực ảnh chính */}
      <div
        className="relative flex-1 w-full flex items-center justify-center p-2 overflow-hidden touch-pinch-zoom"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={() => setScale((prev) => (prev === 1 ? 2 : 1))}
      >
        {/* Nút chuyển trước */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 z-20 w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-90 transition-all cursor-pointer"
            aria-label="Ảnh trước"
          >
            <ChevronLeft size={30} />
          </button>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={currentImg.url}
          alt={currentImg.alt || currentImg.caption || 'Hình ảnh phóng to'}
          className="max-h-[82vh] max-w-full object-contain transition-transform duration-200 cursor-zoom-in"
          style={{ transform: `scale(${scale})` }}
          loading="eager"
        />

        {/* Nút chuyển sau */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 z-20 w-12 h-12 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/25 active:scale-90 transition-all cursor-pointer"
            aria-label="Ảnh sau"
          >
            <ChevronRight size={30} />
          </button>
        )}
      </div>

      {/* Thanh dưới: Chú thích ảnh */}
      <div className="w-full p-4 pb-6 text-center z-20">
        {currentImg.caption ? (
          <p className="text-white/90 text-[15px] font-medium leading-relaxed max-w-lg mx-auto bg-black/40 px-4 py-2 rounded-xl backdrop-blur-xs">
            {images.length > 1 && (
              <span className="font-bold text-white mr-1.5">
                {currentIndex + 1}/{images.length} ·
              </span>
            )}
            {currentImg.caption}
          </p>
        ) : (
          images.length > 1 && (
            <p className="text-white/60 text-[14px]">
              Chạm đúp để phóng to · Vuốt để đổi ảnh
            </p>
          )
        )}
      </div>
    </div>
  );
}
