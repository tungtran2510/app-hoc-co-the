'use client';

import React from 'react';
import { X, BookOpen, Film } from 'lucide-react';
import { AuthorBook } from '../lib/types';
import { extractYouTubeId } from '../lib/youtube';

interface BookDetailModalProps {
  book: AuthorBook | null;
  onClose: () => void;
}

export default function BookDetailModal({ book, onClose }: BookDetailModalProps) {
  if (!book) return null;

  const youtubeId = book.youtube_url ? extractYouTubeId(book.youtube_url) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[460px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header modal */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-ink leading-tight">
                Thông tin tác phẩm
              </h3>
              <p className="text-[12px] text-muted">
                Sách và tài liệu đã phát hành
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung chi tiết sách */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4.5">
          {/* Ảnh bìa + Tên sách */}
          <div className="flex gap-4 items-start">
            <div className="w-24 h-32 rounded-[14px] bg-surface-2 border border-line overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
              {book.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={book.cover_url}
                  alt={book.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-1 text-muted p-2 text-center">
                  <BookOpen size={28} className="text-primary/70" />
                  <span className="text-[10px] font-bold">Bìa sách</span>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col gap-1.5 pt-0.5">
              {book.year && (
                <span className="inline-block w-fit px-2.5 py-0.5 rounded-full bg-primary-soft text-primary text-[11px] font-extrabold">
                  Năm {book.year}
                </span>
              )}
              <h4 className="text-[19px] font-extrabold text-ink leading-snug">
                {book.title}
              </h4>
              <p className="text-[13px] text-muted">
                Tác phẩm nghiên cứu & chia sẻ cộng đồng
              </p>
            </div>
          </div>

          {/* Mô tả chi tiết sách */}
          <div className="flex flex-col gap-1.5 p-3.5 rounded-[16px] bg-surface-2 border border-line">
            <span className="text-[13px] font-extrabold text-ink uppercase tracking-wider">
              Nội dung chính của sách
            </span>
            <p className="text-[15px] text-ink leading-relaxed whitespace-pre-line font-medium">
              {book.description || 'Chưa có mô tả chi tiết cho cuốn sách này.'}
            </p>
          </div>

          {/* Video giới thiệu về sách (nếu có) */}
          {youtubeId && (
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                <Film size={16} className="text-primary" />
                <span>Video giới thiệu & chia sẻ về sách</span>
              </span>
              <div className="relative w-full aspect-video rounded-[16px] overflow-hidden border border-line bg-black shadow-xs">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`}
                  title={`Video giới thiệu ${book.title}`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer: Không có nút mua, chỉ nút Đóng */}
        <div className="p-3.5 px-5 border-t border-line flex items-center justify-end bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto h-11 px-6 rounded-[12px] bg-surface-2 hover:bg-surface text-ink font-bold text-[14px] cursor-pointer transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
