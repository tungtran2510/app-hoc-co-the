'use client';

import React, { useState, useEffect } from 'react';
import {
  Edit2,
  Plus,
  LayoutGrid,
  List,
  ChevronRight,
} from 'lucide-react';
import { RecommendedBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveSettingsApi } from '../lib/apiAdmin';
import EditRecommendedBooksModal from './admin/EditRecommendedBooksModal';
import SectionOrderControls from './admin/SectionOrderControls';
import ModernBookCover from './ModernBookCover';
import BookDetailModal, { UnifiedBookItem } from './BookDetailModal';

interface RecommendedBooksSectionProps {
  initialTitle?: string | null;
  initialSubtitle?: string | null;
  initialBooks?: RecommendedBook[];
  initialLayout?: 'grid' | 'lookbook' | null;
  sectionIndex?: number;
  totalSections?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onOpenReorderModal?: () => void;
}

export default function RecommendedBooksSection({
  initialTitle,
  initialSubtitle,
  initialBooks = [],
  initialLayout = 'grid',
  sectionIndex,
  totalSections,
  onMoveUp,
  onMoveDown,
  onOpenReorderModal,
}: RecommendedBooksSectionProps) {
  const [title, setTitle] = useState(initialTitle || 'Sách nên đọc');
  const [subtitle, setSubtitle] = useState(
    initialSubtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'
  );
  const [books, setBooks] = useState<RecommendedBook[]>(initialBooks);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'lookbook'>(
    initialLayout === 'lookbook' ? 'lookbook' : 'grid'
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<RecommendedBook | null>(null);

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialTitle) setTitle(initialTitle);
    if (initialSubtitle) setSubtitle(initialSubtitle);
    if (initialBooks && initialBooks.length > 0) setBooks(initialBooks);
    if (initialLayout) setLayoutMode(initialLayout === 'lookbook' ? 'lookbook' : 'grid');
  }, [initialTitle, initialSubtitle, initialBooks, initialLayout]);

  const handleSaved = (data: {
    title: string;
    subtitle: string;
    books: RecommendedBook[];
  }) => {
    setTitle(data.title);
    setSubtitle(data.subtitle);
    setBooks(data.books);
  };

  const toggleLayoutMode = async (mode: 'grid' | 'lookbook') => {
    setLayoutMode(mode);
    if (isAdmin) {
      await saveSettingsApi({
        recommended_books_layout: mode,
      });
    }
  };

  // Nếu không có sách và không phải admin thì ẩn khối
  if (books.length === 0 && !isAdmin) {
    return null;
  }

  const selectedUnifiedBook: UnifiedBookItem | null = selectedBook
    ? {
        id: selectedBook.id,
        title: selectedBook.title,
        cover_url: selectedBook.cover_url,
        author: selectedBook.author,
        description: selectedBook.description,
        youtube_url: selectedBook.youtube_url,
        gallery_images: selectedBook.gallery_images,
        link_url: selectedBook.link_url,
        type: 'recommended',
      }
    : null;

  return (
    <section className="flex flex-col gap-3.5 mt-2">
      {/* TIÊU ĐỀ MỤC & NHÓM NÚT QUẢN TRỊ (2 HÀNG GỌN GÀNG, KHÔNG RỚT CHỮ) */}
      <div className="flex flex-col gap-1.5">
        {/* Hàng 1: Tiêu đề, số lượng & Nút chuyển chế độ xem, Sửa sách */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-[19px] sm:text-[20px] font-extrabold text-ink leading-tight whitespace-nowrap">
              {title}
            </h2>
            {books.length > 0 && (
              <span className="text-[11.5px] font-extrabold text-[#1E3A8A] bg-blue-100 dark:text-[#F8DF7B] dark:bg-[#2E1B58] px-2.5 py-0.5 rounded-full shrink-0">
                {books.length} cuốn
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút chuyển đổi kiểu hiển thị: Lưới hoặc Lookbook */}
            <div className="inline-flex items-center bg-white dark:bg-[#180E32] border border-slate-200 dark:border-[#3A2268] rounded-[10px] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => toggleLayoutMode('grid')}
                className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-[#1E3A8A] text-white dark:bg-[#F8DF7B] dark:text-[#160C2C] shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:text-purple-300 dark:hover:text-white'
                }`}
                title="Xem dạng lưới 2 cột"
                aria-label="Xem dạng lưới 2 cột"
              >
                <LayoutGrid size={13} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => toggleLayoutMode('lookbook')}
                className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  layoutMode === 'lookbook'
                    ? 'bg-[#1E3A8A] text-white dark:bg-[#F8DF7B] dark:text-[#160C2C] shadow-xs font-bold'
                    : 'text-slate-400 hover:text-slate-700 dark:text-purple-300 dark:hover:text-white'
                }`}
                title="Xem dạng thẻ chi tiết (Lookbook)"
                aria-label="Xem dạng thẻ chi tiết (Lookbook)"
              >
                <List size={14} strokeWidth={2.5} />
              </button>
            </div>

            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1 h-7 px-2.5 rounded-[9px] bg-blue-50 text-[#1E3A8A] border border-blue-200 hover:bg-blue-100 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 dark:hover:bg-purple-900 text-[11.5px] font-extrabold cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
              >
                <Edit2 size={11} />
                <span>Sửa sách</span>
              </button>
            )}
          </div>
        </div>

        {/* Hàng 2: Mô tả phụ & Nút điều khiển vị trí lên/xuống (cho admin) */}
        <div className="flex items-center justify-between gap-2">
          {subtitle ? (
            <p className="text-[12.5px] text-muted leading-snug line-clamp-1">
              {subtitle}
            </p>
          ) : (
            <div />
          )}

          {isAdmin && onMoveUp && onMoveDown && onOpenReorderModal && typeof sectionIndex === 'number' && typeof totalSections === 'number' && (
            <SectionOrderControls
              sectionIndex={sectionIndex}
              totalSections={totalSections}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onOpenReorderModal={onOpenReorderModal}
              className="ml-auto"
            />
          )}
        </div>
      </div>

      {/* NỘI DUNG DANH SÁCH SÁCH */}
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
            Nhấn vào đây để thêm các đầu sách khuyên đọc với bìa 3D hiện đại và thông tin chuyên sâu.
          </p>
        </div>
      ) : layoutMode === 'lookbook' ? (
        /* =================== KIỂU 1: LOOKBOOK CHUYÊN NGHIỆP (CÂN ĐỐI, KHÔNG RỚT CHỮ) =================== */
        <div className="flex flex-col gap-3">
          {books.map((book, idx) => (
            <div
              key={book.id || idx}
              onClick={() => setSelectedBook(book)}
              className="group p-3 sm:p-4 rounded-[20px] bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-[#1E3A8A] shadow-md hover:shadow-lg hover:border-slate-300 dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:border-l-[#A78BFA] dark:text-white transition-all duration-200 flex flex-row gap-3 sm:gap-4.5 cursor-pointer relative"
            >
              {/* BÌA SÁCH 3D HIỆN ĐẠI BÊN TRÁI - TO RÕ RÀNG THEO YÊU CẦU */}
              <div className="w-[116px] sm:w-[138px] shrink-0 pt-0.5">
                <ModernBookCover
                  title={book.title}
                  coverUrl={book.cover_url}
                  author={book.author}
                  index={idx}
                />
              </div>

              {/* THÔNG TIN CHI TIẾT BÊN PHẢI - RỘNG RÃI */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded-[5px] bg-blue-50 text-[#1E3A8A] border border-blue-200 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 text-[10px] font-extrabold tracking-wide uppercase shrink-0">
                      Tài liệu khuyên đọc
                    </span>
                    {book.author && (
                      <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300/80 truncate max-w-[110px] sm:max-w-none">
                        · {book.author}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[15px] sm:text-[16.5px] font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 break-normal group-hover:text-[#1E3A8A] dark:group-hover:text-[#F8DF7B] transition-colors">
                    {book.title}
                  </h3>

                  {book.description && (
                    <p className="text-[12px] sm:text-[12.5px] text-slate-600 dark:text-purple-200/90 leading-relaxed line-clamp-2">
                      {book.description}
                    </p>
                  )}
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-purple-800/40 mt-1.5">
                  <span className="text-[12px] font-black text-[#1E3A8A] dark:text-[#F8DF7B] inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                    <span>Xem chi tiết & video</span>
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                      }}
                      className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-blue-50 text-[#1E3A8A] border border-blue-200 hover:bg-blue-100 dark:bg-purple-950/80 dark:text-purple-200 dark:border-purple-800/40 text-[11px] font-bold cursor-pointer shrink-0 ml-auto transition-colors"
                      title="Sửa danh sách sách"
                    >
                      <Edit2 size={10} />
                      <span>Sửa</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* =================== KIỂU 2: LƯỚI 2 CỘT HIỆN ĐẠI (MODERN LUXURY GRID) =================== */
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {books.map((book, idx) => (
            <div
              key={book.id || idx}
              onClick={() => setSelectedBook(book)}
              className="group p-3 sm:p-3.5 rounded-[20px] bg-white text-slate-900 border border-slate-200 border-l-[4px] border-l-[#1E3A8A] shadow-md hover:shadow-lg hover:border-slate-300 dark:bg-gradient-to-br dark:from-[#1C123D] dark:via-[#160D30] dark:to-[#0E0720] dark:border-t-white/15 dark:border-r-black/50 dark:border-b-black/70 dark:border-l-[#A78BFA] dark:text-white transition-all duration-200 flex flex-col cursor-pointer relative"
            >
              {/* BÌA SÁCH 3D HIỆN ĐẠI */}
              <div className="w-full px-1 pt-1 pb-1.5 flex justify-center">
                <ModernBookCover
                  title={book.title}
                  coverUrl={book.cover_url}
                  author={book.author}
                  index={idx}
                />
              </div>

              {/* NỘI DUNG CHÂN THẺ */}
              <div className="flex-1 flex flex-col pt-1.5 gap-1">
                {book.author && (
                  <p className="text-[10.5px] font-extrabold text-[#1E3A8A] dark:text-[#F8DF7B] uppercase tracking-wider line-clamp-1">
                    {book.author}
                  </p>
                )}

                <h3 className="text-[14px] sm:text-[15px] font-extrabold text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-[#1E3A8A] dark:group-hover:text-[#F8DF7B] transition-colors">
                  {book.title}
                </h3>

                {book.description && (
                  <p className="text-[11.5px] text-slate-600 dark:text-purple-200/90 leading-relaxed line-clamp-2 mt-0.5">
                    {book.description}
                  </p>
                )}

                <div className="mt-auto pt-2 flex items-center justify-between border-t border-slate-100 dark:border-purple-800/40">
                  <span className="text-[11.5px] font-black text-[#1E3A8A] dark:text-[#F8DF7B] inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform whitespace-nowrap">
                    <span>Khám phá</span>
                    <ChevronRight size={13} strokeWidth={2.5} />
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                      }}
                      className="p-1 rounded-[6px] hover:bg-surface-2 text-muted hover:text-primary transition-colors shrink-0 ml-auto"
                      title="Sửa sách"
                    >
                      <Edit2 size={11} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL CHI TIẾT SÁCH TOÀN DIỆN (VIDEO YOUTUBE + BỘ SƯU TẬP ẢNH BÊN TRONG CÓ PHÓNG TO) */}
      <BookDetailModal
        book={selectedUnifiedBook}
        isAdmin={isAdmin}
        onClose={() => setSelectedBook(null)}
        onEdit={() => {
          setSelectedBook(null);
          setShowEditModal(true);
        }}
      />

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
