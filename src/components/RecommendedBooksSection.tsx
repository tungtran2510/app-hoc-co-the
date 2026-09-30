'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Edit2,
  ExternalLink,
  X,
  Sparkles,
  Bookmark,
  Plus,
} from 'lucide-react';
import { RecommendedBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import EditRecommendedBooksModal from './admin/EditRecommendedBooksModal';

interface RecommendedBooksSectionProps {
  initialTitle?: string | null;
  initialSubtitle?: string | null;
  initialBooks?: RecommendedBook[];
}

export default function RecommendedBooksSection({
  initialTitle,
  initialSubtitle,
  initialBooks = [],
}: RecommendedBooksSectionProps) {
  const [title, setTitle] = useState(initialTitle || 'Sách nên đọc');
  const [subtitle, setSubtitle] = useState(
    initialSubtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'
  );
  const [books, setBooks] = useState<RecommendedBook[]>(initialBooks);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialTitle) setTitle(initialTitle);
    if (initialSubtitle) setSubtitle(initialSubtitle);
    if (initialBooks && initialBooks.length > 0) setBooks(initialBooks);
  }, [initialTitle, initialSubtitle, initialBooks]);

  const handleSaved = (data: {
    title: string;
    subtitle: string;
    books: RecommendedBook[];
  }) => {
    setTitle(data.title);
    setSubtitle(data.subtitle);
    setBooks(data.books);
  };

  // Nếu không có sách và không phải admin thì ẩn khối
  if (books.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4 mt-2">
      {/* Tiêu đề mục & Nút Quản trị */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-extrabold text-ink leading-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="text-[12px] font-extrabold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
              {books.length} cuốn
            </span>
          </h2>
          {subtitle && (
            <p className="text-[13px] text-muted mt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-primary-soft text-primary text-[13px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs shrink-0"
          >
            <Edit2 size={13} />
            <span>Sửa danh sách</span>
          </button>
        )}
      </div>

      {/* LƯỚI 2 CỘT: 2 khối ảnh một hàng · Dọc 3:4 */}
      {books.length === 0 && isAdmin ? (
        <div
          onClick={() => setShowEditModal(true)}
          className="p-8 rounded-[24px] bg-white border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-primary-soft/20 transition-colors shadow-2xs"
        >
          <div className="w-12 h-12 rounded-full bg-primary-soft text-primary flex items-center justify-center">
            <Plus size={24} />
          </div>
          <h3 className="text-[16px] font-extrabold text-ink">
            Chưa có cuốn sách nào được thêm
          </h3>
          <p className="text-[13px] text-muted max-w-[320px]">
            Nhấn vào đây để thêm các đầu sách nên đọc (hiển thị lưới 2 ảnh/hàng, tỷ lệ ảnh dọc 3:4).
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4.5">
          {books.map((book, idx) => (
            <div
              key={book.id || idx}
              onClick={() => setSelectedBook(book)}
              className="group p-3 sm:p-3.5 rounded-[22px] bg-white border border-line shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer"
            >
              {/* Ảnh bìa dọc tỷ lệ 3:4 */}
              <div className="relative w-full aspect-[3/4] rounded-[15px] overflow-hidden bg-surface-2 border border-line/70 flex items-center justify-center shrink-0">
                {book.cover_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.cover_url}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center text-muted">
                    <BookOpen size={32} className="text-primary/60" />
                    <span className="text-[11px] font-bold text-muted/80">Ảnh dọc 3:4</span>
                  </div>
                )}

                {/* Badge số thứ tự */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/55 backdrop-blur-xs text-white text-[10.5px] font-extrabold">
                  #{idx + 1}
                </div>
              </div>

              {/* Phần mô tả & thông tin bên dưới ảnh */}
              <div className="flex-1 flex flex-col pt-3 gap-1">
                {book.author && (
                  <p className="text-[11.5px] font-extrabold text-primary uppercase tracking-wide line-clamp-1">
                    {book.author}
                  </p>
                )}

                <h3 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>

                {book.description && (
                  <p className="text-[12px] sm:text-[12.5px] text-muted leading-relaxed line-clamp-3 mt-0.5">
                    {book.description}
                  </p>
                )}

                {book.link_url && (
                  <div className="mt-auto pt-2 flex items-center gap-1 text-[11.5px] font-extrabold text-primary">
                    <span>Tìm hiểu thêm</span>
                    <ExternalLink size={12} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CHI TIẾT SÁCH KHI BẤM VÀO */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[460px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
            {/* Nút kéo mobile */}
            <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 px-5 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center">
                  <Bookmark size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-[17px] font-extrabold text-ink leading-tight">
                    Sách nên đọc
                  </h3>
                  <p className="text-[12px] text-muted">
                    Tài liệu bổ trợ kiến thức sức khỏe
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body chi tiết */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              <div className="flex gap-4 items-start">
                <div className="w-28 aspect-[3/4] rounded-[16px] bg-surface-2 border border-line overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
                  {selectedBook.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedBook.cover_url}
                      alt={selectedBook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-muted p-2 text-center">
                      <BookOpen size={28} className="text-primary/70" />
                      <span className="text-[10px] font-bold">Khung 3:4</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1 pt-1">
                  {selectedBook.author && (
                    <span className="text-[12px] font-extrabold text-primary uppercase tracking-wide">
                      {selectedBook.author}
                    </span>
                  )}
                  <h4 className="text-[18px] font-extrabold text-ink leading-snug">
                    {selectedBook.title}
                  </h4>
                  <p className="text-[12.5px] text-muted">
                    Khuyến nghị từ chuyên gia
                  </p>
                </div>
              </div>

              {selectedBook.description && (
                <div className="p-4 rounded-[18px] bg-surface-2/70 border border-line/60 flex flex-col gap-1.5">
                  <span className="text-[12px] font-extrabold text-ink flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary" />
                    <span>Nội dung & Giá trị nổi bật</span>
                  </span>
                  <p className="text-[13.5px] text-ink/90 leading-relaxed whitespace-pre-line">
                    {selectedBook.description}
                  </p>
                </div>
              )}

              {selectedBook.link_url && (
                <a
                  href={selectedBook.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-[14px] bg-primary text-white text-[14px] font-extrabold hover:bg-primary-hover transition-colors shadow-sm"
                >
                  <span>Mở liên kết tham khảo</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 px-5 border-t border-line bg-surface flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="h-9 px-4 rounded-[10px] bg-surface-2 text-ink text-[13px] font-bold hover:bg-surface-3 transition-colors cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL QUẢN TRỊ VIÊN SỬA SÁCH */}
      <EditRecommendedBooksModal
        isOpen={showEditModal}
        initialTitle={title}
        initialSubtitle={subtitle}
        initialBooks={books}
        onClose={() => setShowEditModal(false)}
        onSaved={handleSaved}
      />
    </section>
  );
}
