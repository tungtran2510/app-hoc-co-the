'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  BookOpen,
  Film,
  Images,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Edit2,
  Play,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { extractYouTubeId } from '../lib/youtube';
import ModernBookCover from './ModernBookCover';
import FlipbookViewer from './FlipbookViewer';
import YouTubeEmbed from './YouTubeEmbed';

export interface UnifiedBookItem {
  id: string;
  title: string;
  cover_url?: string | null;
  author?: string | null;
  year?: string | null;
  description: string;
  youtube_url?: string | null;
  gallery_images?: string[];
  link_url?: string | null;
  type?: 'author' | 'recommended';
}

interface BookDetailModalProps {
  book: UnifiedBookItem | null;
  isAdmin?: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export default function BookDetailModal({
  book,
  isAdmin = false,
  onClose,
  onEdit,
}: BookDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [show3DFlipbook, setShow3DFlipbook] = useState(false);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1.0);
  const [lightboxPan, setLightboxPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingPanRef = useRef(false);
  const initialPinchDistRef = useRef<number | null>(null);
  const initialPinchScaleRef = useRef<number>(1.0);

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isPointerDown = useRef<boolean>(false);
  const bookId = book?.id;
  const hasPushedStateRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const handleClose = useCallback(() => {
    if (hasPushedStateRef.current && window.location.hash === '#chi-tiet-sach') {
      hasPushedStateRef.current = false;
      window.history.back();
    } else {
      onCloseRef.current();
    }
  }, []);

  // Xử lý nút Back của điện thoại / trình duyệt để đóng Modal mà KHÔNG chuyển sang trang khác
  const activeImageIndexRef = useRef(activeImageIndex);
  activeImageIndexRef.current = activeImageIndex;

  const show3DFlipbookRef = useRef(show3DFlipbook);
  show3DFlipbookRef.current = show3DFlipbook;

  useEffect(() => {
    if (!bookId) {
      hasPushedStateRef.current = false;
      return;
    }

    if (!hasPushedStateRef.current) {
      hasPushedStateRef.current = true;
      try {
        const nextState = {
          ...(window.history.state || {}),
          qbiz_modal: 'book_detail',
          qbiz_book_id: bookId,
        };
        window.history.pushState(
          nextState,
          '',
          window.location.pathname + window.location.search + '#chi-tiet-sach'
        );
      } catch {}
    }

    const handlePopState = () => {
      // Nếu đang mở Lightbox phóng to ảnh -> đóng Lightbox trước và giữ modal sách
      if (activeImageIndexRef.current !== null) {
        setActiveImageIndex(null);
        return;
      }

      // Nếu đang mở 3D Flipbook -> đóng 3D Flipbook trước và giữ modal sách
      if (show3DFlipbookRef.current) {
        setShow3DFlipbook(false);
        return;
      }

      // Đóng modal sách và giữ nguyên người dùng tại trang hiện tại
      hasPushedStateRef.current = false;
      onCloseRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (hasPushedStateRef.current && window.location.hash === '#chi-tiet-sach') {
        hasPushedStateRef.current = false;
        try {
          window.history.back();
        } catch {}
      }
    };
  }, [bookId]);

  // Tổng hợp toàn bộ ảnh có sẵn của cuốn sách: Bìa sách + Các ảnh trang sách chi tiết, loại bỏ trùng lặp
  const gallery = Array.from(
    new Set([
      ...(book?.cover_url ? [book.cover_url] : []),
      ...(Array.isArray(book?.gallery_images) ? book.gallery_images : []),
    ].filter(Boolean) as string[])
  );

  const resetLightboxZoom = useCallback(() => {
    setLightboxZoom(1.0);
    setLightboxPan({ x: 0, y: 0 });
    setTouchDeltaX(0);
  }, []);

  const handlePrevImage = useCallback(() => {
    if (!gallery.length) return;
    setIsTransitioning(true);
    setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : gallery.length - 1));
    resetLightboxZoom();
    setTimeout(() => setIsTransitioning(false), 240);
  }, [gallery.length, resetLightboxZoom]);

  const handleNextImage = useCallback(() => {
    if (!gallery.length) return;
    setIsTransitioning(true);
    setActiveImageIndex((prev) => (prev !== null && prev < gallery.length - 1 ? prev + 1 : 0));
    resetLightboxZoom();
    setTimeout(() => setIsTransitioning(false), 240);
  }, [gallery.length, resetLightboxZoom]);

  const handleToggleZoom = useCallback(() => {
    if (lightboxZoom > 1.0) {
      resetLightboxZoom();
    } else {
      setLightboxZoom(2.2);
    }
  }, [lightboxZoom, resetLightboxZoom]);

  // Keyboard navigation cho Lightbox (Esc, Left, Right)
  useEffect(() => {
    if (activeImageIndex === null || !gallery.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        if (lightboxZoom <= 1.0) handlePrevImage();
      } else if (e.key === 'ArrowRight') {
        if (lightboxZoom <= 1.0) handleNextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, gallery.length, handlePrevImage, handleNextImage, lightboxZoom]);

  // Touch Swipe & Pinch-to-Zoom Handlers (CẤM lật ảnh khi zoom)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // 2 ngón tay -> Pinch to zoom
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialPinchDistRef.current = dist;
      initialPinchScaleRef.current = lightboxZoom;
      isPointerDown.current = false;
      return;
    }

    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      isPointerDown.current = true;
      setIsTransitioning(false);

      if (lightboxZoom > 1.0) {
        // Đang zoom: Kéo pan ảnh để đọc chi tiết
        isDraggingPanRef.current = true;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // 1. Thao tác zoom 2 ngón tay
    if (e.touches.length === 2 && initialPinchDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / initialPinchDistRef.current;
      const newScale = Math.min(Math.max(initialPinchScaleRef.current * ratio, 1.0), 3.5);
      setLightboxZoom(Number(newScale.toFixed(2)));
      if (newScale === 1.0) {
        setLightboxPan({ x: 0, y: 0 });
      }
      return;
    }

    // 2. Thao tác khi đang zoom > 1.0: Kéo pan ảnh để đọc chữ (CẤM lật ảnh)
    if (lightboxZoom > 1.0 && isDraggingPanRef.current && touchStartX.current !== null && touchStartY.current !== null) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = currentX - touchStartX.current;
      const dy = currentY - touchStartY.current;
      touchStartX.current = currentX;
      touchStartY.current = currentY;

      setLightboxPan((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      return;
    }

    // 3. Thao tác khi ở 100% zoom: Vuốt ngang chuyển ảnh
    if (!isPointerDown.current || touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      const damped = Math.max(-100, Math.min(100, deltaX));
      setTouchDeltaX(damped);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    initialPinchDistRef.current = null;
    isDraggingPanRef.current = false;

    // Nếu đang zoom thì chỉ dừng pan, CẤM lật ảnh
    if (lightboxZoom > 1.0) {
      isPointerDown.current = false;
      touchStartX.current = null;
      touchStartY.current = null;
      return;
    }

    if (!isPointerDown.current || touchStartX.current === null) {
      setTouchDeltaX(0);
      isPointerDown.current = false;
      return;
    }
    const currentX = e.changedTouches[0].clientX;
    const currentY = e.changedTouches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = touchStartY.current !== null ? currentY - touchStartY.current : 0;

    isPointerDown.current = false;
    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaX) >= 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    } else {
      setIsTransitioning(true);
      setTouchDeltaX(0);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  // Mouse Drag Handlers (Dành cho chuột trên PC)
  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isPointerDown.current = true;
    setIsTransitioning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPointerDown.current || touchStartX.current === null) return;
    const deltaX = e.clientX - touchStartX.current;
    const damped = Math.max(-100, Math.min(100, deltaX));
    setTouchDeltaX(damped);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isPointerDown.current || touchStartX.current === null) {
      setTouchDeltaX(0);
      isPointerDown.current = false;
      return;
    }
    const deltaX = e.clientX - touchStartX.current;
    isPointerDown.current = false;
    touchStartX.current = null;

    if (Math.abs(deltaX) >= 50) {
      if (deltaX < 0) {
        handleNextImage();
      } else {
        handlePrevImage();
      }
    } else {
      setIsTransitioning(true);
      setTouchDeltaX(0);
      setTimeout(() => setIsTransitioning(false), 200);
    }
  };

  if (!book) return null;

  const youtubeId = book.youtube_url ? extractYouTubeId(book.youtube_url) : null;

  return (
    <>
      {/* ================= MODAL CHI TIẾT SÁCH CHÍNH ================= */}
      <div 
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200"
        onClick={handleClose}
      >
        <div 
          className="w-full max-w-[500px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút kéo trên mobile */}
          <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

          {/* Header modal */}
          <div className="flex items-center justify-between p-4 px-5 border-b border-line bg-surface">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <BookOpen size={18} strokeWidth={2.5} />
              </div>
              <div className="min-w-0">
                <h3 className="text-[16px] sm:text-[17px] font-extrabold text-ink leading-tight truncate">
                  {book.type === 'author' ? 'Tài liệu xuất bản chính thức' : 'Tài liệu tham khảo chuyên sâu'}
                </h3>
                <p className="text-[12px] text-muted truncate">
                  {book.author || 'Tài liệu chăm sóc sức khỏe & cơ thể'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer shrink-0 ml-2"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nội dung cuộn */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4.5">
            {/* 1. HERO SÁCH: Bìa gọn gàng + Tên sách rộng rãi, không rớt chữ vụn */}
            <div className="flex gap-3.5 sm:gap-4 items-start p-3 sm:p-3.5 rounded-[20px] bg-surface-2/60 border border-line/70">
              <div 
                className={`w-24 sm:w-28 shrink-0 pt-0.5 relative group ${gallery.length > 0 ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (gallery.length > 0) setActiveImageIndex(0);
                }}
                title={gallery.length > 0 ? 'Nhấn để phóng to và vuốt xem ảnh' : undefined}
              >
                <ModernBookCover
                  title={book.title}
                  coverUrl={book.cover_url}
                  author={book.author}
                />
                {gallery.length > 0 && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-[8px] transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 rounded-full bg-white/90 text-ink flex items-center justify-center shadow-md">
                      <ZoomIn size={14} strokeWidth={2.5} />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1.5 min-w-0 pt-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {book.year && (
                    <span className="px-2 py-0.5 rounded-[6px] bg-primary-soft text-primary text-[11px] font-extrabold">
                      Năm {book.year}
                    </span>
                  )}
                  {book.author && (
                    <span className="text-[11.5px] font-extrabold text-primary uppercase tracking-wide truncate">
                      {book.author}
                    </span>
                  )}
                </div>

                <h4 className="text-[16.5px] sm:text-[18px] font-extrabold text-ink leading-snug">
                  {book.title}
                </h4>

                {/* NÚT ĐỌC THỬ TÀI LIỆU 3D TO NỔI BẬT - VÀNG KIM CHAMPAGNE SANG TRỌNG THEO YÊU CẦU */}
                <div className="mt-2.5 w-full">
                  <button
                    type="button"
                    onClick={() => setShow3DFlipbook(true)}
                    className="relative w-full py-2.5 sm:py-3 px-4 rounded-[13px] bg-gradient-to-r from-[#FFF0BA] via-[#ECC45F] to-[#D4A028] hover:from-[#FFF5CE] hover:to-[#DFAC32] text-[#1A1608] font-black text-[14px] shadow-md shadow-[#D4A028]/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer overflow-hidden border border-[#F3D37A]"
                  >
                    {/* Hiệu ứng vệt sáng kim cương quét định kỳ */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-flash-sweep pointer-events-none" />
                    
                    <BookOpen size={16} strokeWidth={2.8} className="shrink-0 text-[#1A1608]" />
                    <span className="tracking-wide">Đọc thử tài liệu 3D</span>
                  </button>
                </div>

                  {book.link_url && (
                    <a
                      href={book.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-[11.5px] font-bold text-primary hover:underline py-0.5"
                    >
                      <span>Xem thêm liên kết ngoài</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>

            {/* 2. MÔ TẢ NỘI DUNG SÁCH */}
            <div className="flex flex-col gap-1.5 p-3.5 sm:p-4 rounded-[18px] bg-surface-2/80 border border-line">
              <span className="text-[12px] font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} className="text-primary" />
                <span>Nội dung & Giá trị cốt lõi</span>
              </span>
              <p className="text-[13.5px] sm:text-[14px] text-ink/90 leading-relaxed whitespace-pre-line font-medium">
                {book.description || 'Chưa có thông tin tóm tắt cho cuốn sách này.'}
              </p>
            </div>

            {/* 3. MỤC VIDEO GIỚI THIỆU & CHIA SẺ (KHOẢNG CÁCH THOÁNG ĐẸP, KHÔNG BỊ SÁT VIỀN) */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-line/60">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-ink uppercase tracking-wide flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                    <Play size={10} className="fill-red-600 translate-x-0.2" />
                  </div>
                  <span>Video giới thiệu & chia sẻ</span>
                </span>
                {youtubeId && (
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-full shrink-0">
                    YouTube HD
                  </span>
                )}
              </div>

              {youtubeId ? (
                <YouTubeEmbed
                  youtubeId={youtubeId}
                  title={`Video giới thiệu ${book.title}`}
                  showExternalLink={true}
                />
              ) : (
                <div className="p-4 rounded-[16px] bg-surface-2 border border-line text-center flex flex-col items-center justify-center gap-1.5 text-muted">
                  <Film size={22} className="text-muted/60" />
                  <p className="text-[12.5px] font-medium">
                    Video chia sẻ về cuốn sách này đang được biên tập.
                  </p>
                  {isAdmin && onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEdit();
                      }}
                      className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      + Nhấn vào đây để thêm link video YouTube
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. HÌNH ẢNH (NHẤN ĐỂ PHÓNG TO) - 1 DÒNG GỌN GÀNG, BỐ CỤC CHUYÊN NGHIỆP */}
            <div className="flex flex-col gap-2.5 pt-2 border-t border-line/60">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Images size={11} strokeWidth={2.5} />
                  </div>
                  <h4 className="text-[13px] font-extrabold text-ink uppercase tracking-wide truncate">
                    Hình ảnh <span className="text-[12px] font-semibold text-muted lowercase tracking-normal font-sans">(nhấn để phóng to)</span>
                  </h4>
                </div>
                {gallery.length > 0 && (
                  <span className="text-[11px] font-bold text-muted bg-surface-2 border border-line px-2.5 py-0.5 rounded-full shrink-0 whitespace-nowrap">
                    {gallery.length} ảnh
                  </span>
                )}
              </div>

              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {gallery.map((imgUrl, imgIdx) => (
                    <div
                      key={imgIdx}
                      onClick={() => setActiveImageIndex(imgIdx)}
                      className="group relative aspect-[3/4] rounded-[14px] bg-surface-2 border border-line overflow-hidden cursor-pointer shadow-2xs hover:shadow-md hover:border-primary/50 transition-all duration-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Trang sách ${imgIdx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />

                      {/* Nút phóng to nổi trên góc */}
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full bg-white/90 text-ink flex items-center justify-center shadow-md transform scale-90 group-hover:scale-100 transition-transform">
                          <ZoomIn size={15} strokeWidth={2.5} />
                        </div>
                      </div>

                      {/* Badge số trang góc dưới */}
                      <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-[6px] bg-black/60 text-white text-[10px] font-bold pointer-events-none">
                        #{imgIdx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-[16px] bg-surface-2 border border-line text-center flex flex-col items-center justify-center gap-1.5 text-muted">
                  <Images size={22} className="text-muted/60" />
                  <p className="text-[12.5px] font-medium">
                    Chưa có ảnh chụp các trang sách hoặc tài liệu mẫu.
                  </p>
                  {isAdmin && onEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onEdit();
                      }}
                      className="text-[12px] font-bold text-primary hover:underline cursor-pointer"
                    >
                      + Nhấn vào đây để tải ảnh trang sách lên
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 5. KHUNG ĐẶT SÁCH LIÊN HỆ ZALO DƯỚI ẢNH THEO YÊU CẦU */}
            <div className="pt-2">
              <a
                href={book.link_url || 'https://zalo.me/0987792400'}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full py-3.5 px-4 rounded-[14px] bg-gradient-to-r from-[#0068FF] via-[#005FEA] to-[#0047C2] hover:from-[#0058DB] hover:to-[#003EA6] text-white font-extrabold text-[14px] shadow-md shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] cursor-pointer overflow-hidden border border-blue-300/40"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle size={14} className="text-white fill-white" />
                </div>
                <span className="tracking-wide">Đặt sách liên hệ Zalo</span>
                <span className="text-[12px] opacity-90 font-medium font-sans">· 0974.248.716</span>
              </a>
            </div>
          </div>

          {/* Footer modal - Nút đóng màu xanh tinh tế, chiều cao thấp theo yêu cầu */}
          <div className="py-2.5 px-4 sm:px-5 border-t border-line flex items-center justify-between bg-surface/95 backdrop-blur-xs sticky bottom-0 z-20">
            {isAdmin && onEdit ? (
              <button
                type="button"
                onClick={() => {
                  handleClose();
                  onEdit();
                }}
                className="flex items-center gap-1.5 text-[12px] font-bold text-primary hover:underline cursor-pointer"
              >
                <Edit2 size={13} />
                <span>Sửa cuốn sách này</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleClose}
              className="flex items-center justify-center gap-1.5 h-8.5 px-4 rounded-[10px] bg-[#1E3A8A] hover:bg-[#172554] text-white font-extrabold text-[12.5px] cursor-pointer shadow-xs transition-all active:scale-95"
            >
              <X size={14} strokeWidth={2.5} />
              <span>Đóng</span>
            </button>
          </div>
        </div>
      </div>

      {/* ================= LIGHTBOX PHÓNG TO ẢNH FULL MÀN HÌNH ================= */}
      {activeImageIndex !== null && gallery[activeImageIndex] && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveImageIndex(null)}
        >
          {/* Thanh điều khiển trên cùng */}
          <div
            className="w-full max-w-4xl flex items-center justify-between text-white py-2 px-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-white/15 text-[13px] font-extrabold backdrop-blur-sm">
                Trang {activeImageIndex + 1} / {gallery.length}
              </span>
              <span className="text-[13px] text-white/70 hidden sm:inline truncate max-w-[280px]">
                {book.title}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setActiveImageIndex(null)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center cursor-pointer transition-colors"
              aria-label="Đóng phóng to"
            >
              <X size={20} />
            </button>
          </div>

          {/* Vùng hiển thị ảnh phóng to cực nét - HỖ TRỢ VUỐT TRÊN MÀN HÌNH CẢM ỨNG & KÉO CHUỘT */}
          <div
            className="relative flex-1 w-full max-w-4xl flex items-center justify-center my-auto p-2 touch-pan-y select-none cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Nút lùi ảnh */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-1 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer border border-white/20 transition-transform active:scale-95 shadow-lg"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            {/* Huy hiệu thông báo trạng thái đang phóng to (Chạm để reset) */}
            {lightboxZoom > 1.0 && (
              <button
                type="button"
                onClick={resetLightboxZoom}
                className="absolute top-2 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-black shadow-lg flex items-center gap-1.5 cursor-pointer backdrop-blur-xs transition-all animate-in fade-in"
                title="Bấm để về 100%"
              >
                <span>🔍 Phóng to {Math.round(lightboxZoom * 100)}% · Kéo rê để đọc · Chạm để về 100%</span>
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[activeImageIndex]}
              alt={`Trang sách ${activeImageIndex + 1} phóng to`}
              draggable={false}
              onDoubleClick={handleToggleZoom}
              style={{
                transform: lightboxZoom > 1.0
                  ? `scale(${lightboxZoom}) translate(${lightboxPan.x / lightboxZoom}px, ${lightboxPan.y / lightboxZoom}px)`
                  : `translateX(${touchDeltaX}px)`,
                transformOrigin: 'center center',
                transition: (isTransitioning || (!isDraggingPanRef.current && isPointerDown.current === false))
                  ? 'transform 0.22s cubic-bezier(0.2, 0.8, 0.2, 1)'
                  : 'none',
              }}
              className="max-h-[85vh] max-w-full object-contain rounded-[4px] shadow-2xl select-none pointer-events-auto cursor-zoom-in active:cursor-grab"
            />

            {/* Nút tiến ảnh */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-1 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer border border-white/20 transition-transform active:scale-95 shadow-lg"
                aria-label="Ảnh sau"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Dấu chấm chuyển trang trực quan */}
          {gallery.length > 1 && (
            <div
              className="flex items-center justify-center gap-1.5 py-1 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {gallery.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => {
                    setIsTransitioning(true);
                    setActiveImageIndex(dotIdx);
                    setTouchDeltaX(0);
                    setTimeout(() => setIsTransitioning(false), 200);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    dotIdx === activeImageIndex
                      ? 'w-6 bg-white shadow-xs'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Trang ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Hướng dẫn dưới chân */}
          <div
            className="text-white/75 text-[12px] font-medium text-center pb-1 z-10 flex items-center justify-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <span>👉 Vuốt trái / phải để xem các ảnh • Nhấn ✕ để đóng</span>
          </div>
        </div>
      )}

      {/* MODAL LẬT SÁCH 3D ĐỌC THỬ CHÂN THỰC */}
      <FlipbookViewer
        mode="modal-only"
        isOpen={show3DFlipbook}
        book={book}
        title={`Đọc thử tài liệu 3D: ${book.title}`}
        onClose={() => setShow3DFlipbook(false)}
      />
    </>
  );
}
