'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { extractYouTubeId } from '../lib/youtube';
import ModernBookCover from './ModernBookCover';

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

  // Keyboard navigation cho Lightbox (Esc, Left, Right)
  useEffect(() => {
    if (activeImageIndex === null || !book?.gallery_images?.length) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) =>
          prev !== null && prev > 0 ? prev - 1 : (book.gallery_images?.length || 1) - 1
        );
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) =>
          prev !== null && prev < (book.gallery_images?.length || 1) - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, book?.gallery_images]);

  if (!book) return null;

  const youtubeId = book.youtube_url ? extractYouTubeId(book.youtube_url) : null;
  const gallery = Array.isArray(book.gallery_images) ? book.gallery_images.filter(Boolean) : [];

  return (
    <>
      {/* ================= MODAL CHI TIẾT SÁCH CHÍNH ================= */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-[500px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
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
                  {book.type === 'author' ? 'Tác phẩm đã xuất bản' : 'Sách & Tài liệu khuyên đọc'}
                </h3>
                <p className="text-[12px] text-muted truncate">
                  {book.author || 'Tài liệu chăm sóc sức khỏe & cơ thể'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
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
              <div className="w-24 sm:w-28 shrink-0 pt-0.5">
                <ModernBookCover
                  title={book.title}
                  coverUrl={book.cover_url}
                  author={book.author}
                />
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

                {book.link_url && (
                  <a
                    href={book.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline mt-0.5"
                  >
                    <span>Mở link đọc thử / tài liệu</span>
                    <ExternalLink size={12} />
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

            {/* 3. MỤC VIDEO ("tất cả mọi cái sách đều phải có mục video") */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-ink uppercase tracking-wide flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Play size={10} className="fill-red-600 translate-x-0.2" />
                  </div>
                  <span>Video giới thiệu & chia sẻ</span>
                </span>
                {youtubeId && (
                  <span className="text-[11px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    YouTube HD
                  </span>
                )}
              </div>

              {youtubeId ? (
                <div className="relative w-full aspect-video rounded-[18px] overflow-hidden border border-line bg-black shadow-xs">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                    title={`Video giới thiệu ${book.title}`}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
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

            {/* 4. HÌNH ẢNH BÊN TRONG TRANG SÁCH DƯỚI VIDEO (CLICK ĐỂ PHÓNG TO) */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-extrabold text-ink uppercase tracking-wide flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary-soft text-primary flex items-center justify-center">
                    <Images size={11} strokeWidth={2.5} />
                  </div>
                  <span>Hình ảnh bên trong sách & trích dẫn</span>
                </span>
                {gallery.length > 0 && (
                  <span className="text-[11px] font-extrabold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                    {gallery.length} ảnh (nhấn xem to)
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
          </div>

          {/* Footer modal */}
          <div className="p-3.5 px-5 border-t border-line flex items-center justify-between bg-surface">
            {isAdmin && onEdit ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEdit();
                }}
                className="flex items-center gap-1.5 text-[12.5px] font-bold text-primary hover:underline cursor-pointer"
              >
                <Edit2 size={13} />
                <span>Sửa cuốn sách này</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-[12px] bg-surface-2 hover:bg-surface-3 text-ink font-bold text-[13.5px] cursor-pointer transition-colors"
            >
              Đóng
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

          {/* Vùng hiển thị ảnh phóng to cực nét */}
          <div
            className="relative flex-1 w-full max-w-4xl flex items-center justify-center my-auto p-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Nút lùi ảnh */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null && prev > 0 ? prev - 1 : gallery.length - 1
                  )
                }
                className="absolute left-1 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer border border-white/20 transition-transform active:scale-95 shadow-lg"
                aria-label="Ảnh trước"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gallery[activeImageIndex]}
              alt={`Trang sách ${activeImageIndex + 1} phóng to`}
              className="max-h-[82vh] max-w-[92vw] object-contain rounded-[12px] shadow-2xl animate-in zoom-in-95 duration-200 select-none"
            />

            {/* Nút tiến ảnh */}
            {gallery.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) =>
                    prev !== null && prev < gallery.length - 1 ? prev + 1 : 0
                  )
                }
                className="absolute right-1 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer border border-white/20 transition-transform active:scale-95 shadow-lg"
                aria-label="Ảnh sau"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Hướng dẫn dưới chân */}
          <div
            className="text-white/60 text-[12px] font-medium text-center pb-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            Chạm ra ngoài hoặc nhấn dấu ✕ để đóng phóng to
          </div>
        </div>
      )}
    </>
  );
}
