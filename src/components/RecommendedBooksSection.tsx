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
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { RecommendedBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveSettingsApi } from '../lib/apiAdmin';
import EditRecommendedBooksModal from './admin/EditRecommendedBooksModal';
import SectionOrderControls from './admin/SectionOrderControls';
import ModernBookCover from './ModernBookCover';

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

  return (
    <section className="flex flex-col gap-4 mt-2">
      {/* TIÊU ĐỀ MỤC & NHÓM NÚT QUẢN TRỊ (2 HÀNG GỌN GÀNG, KHÔNG RỚT CHỮ) */}
      <div className="flex flex-col gap-1.5">
        {/* Hàng 1: Tiêu đề, số lượng & Nút chuyển chế độ xem, Sửa sách */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-[20px] font-extrabold text-ink leading-tight whitespace-nowrap">
              {title}
            </h2>
            {books.length > 0 && (
              <span className="text-[11.5px] font-extrabold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full shrink-0">
                {books.length} cuốn
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Nút chuyển đổi kiểu hiển thị: Lưới hoặc Lookbook */}
            <div className="inline-flex items-center bg-surface-2 border border-line rounded-[10px] p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => toggleLayoutMode('grid')}
                className={`w-7 h-7 rounded-[7px] flex items-center justify-center transition-all cursor-pointer ${
                  layoutMode === 'grid'
                    ? 'bg-white text-primary shadow-xs font-bold'
                    : 'text-muted hover:text-ink'
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
                    ? 'bg-white text-primary shadow-xs font-bold'
                    : 'text-muted hover:text-ink'
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
                className="flex items-center gap-1 h-7 px-2.5 rounded-[9px] bg-primary-soft text-primary text-[11.5px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs shrink-0 whitespace-nowrap"
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
        /* =================== KIỂU 1: LOOKBOOK CHUYÊN NGHIỆP =================== */
        <div className="flex flex-col gap-3.5">
          {books.map((book, idx) => (
            <div
              key={book.id || idx}
              onClick={() => setSelectedBook(book)}
              className="group p-4 sm:p-5 rounded-[24px] bg-white border border-line/80 hover:border-primary/30 shadow-xs hover:shadow-md transition-all duration-200 flex flex-row gap-4 sm:gap-5.5 cursor-pointer relative"
            >
              {/* BÌA SÁCH 3D HIỆN ĐẠI BÊN TRÁI */}
              <div className="w-[110px] sm:w-[130px] shrink-0 pt-0.5">
                <ModernBookCover
                  title={book.title}
                  coverUrl={book.cover_url}
                  author={book.author}
                  index={idx}
                />
              </div>

              {/* THÔNG TIN CHI TIẾT BÊN PHẢI */}
              <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-[6px] bg-primary/10 text-primary text-[11px] font-extrabold tracking-wide uppercase">
                      Tài liệu khuyên đọc
                    </span>
                    {book.author && (
                      <span className="text-[12px] font-bold text-muted truncate">
                        · {book.author}
                      </span>
                    )}
                  </div>

                  <h3 className="text-[16px] sm:text-[17.5px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title}
                  </h3>

                  {book.description && (
                    <p className="text-[12.5px] sm:text-[13px] text-muted leading-relaxed line-clamp-3 sm:line-clamp-4">
                      {book.description}
                    </p>
                  )}
                </div>

                <div className="pt-2.5 flex items-center justify-between border-t border-line/50 mt-2">
                  <span className="text-[12.5px] font-extrabold text-primary inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Xem chi tiết nội dung</span>
                    <ChevronRight size={14} strokeWidth={2.5} />
                  </span>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowEditModal(true);
                      }}
                      className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-surface-2 hover:bg-primary-soft text-muted hover:text-primary text-[11px] font-bold cursor-pointer shrink-0 transition-colors"
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
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4.5">
          {books.map((book, idx) => (
            <div
              key={book.id || idx}
              onClick={() => setSelectedBook(book)}
              className="group p-3 sm:p-4 rounded-[22px] bg-white border border-line/70 hover:border-primary/40 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col cursor-pointer relative"
            >
              {/* BÌA SÁCH 3D HIỆN ĐẠI */}
              <div className="w-full px-1.5 pt-1.5 pb-2 flex justify-center">
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
                  <p className="text-[11px] font-extrabold text-primary uppercase tracking-wider line-clamp-1">
                    {book.author}
                  </p>
                )}

                <h3 className="text-[14.5px] sm:text-[15.5px] font-extrabold text-ink leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>

                {book.description && (
                  <p className="text-[12px] text-muted leading-relaxed line-clamp-2 mt-0.5">
                    {book.description}
                  </p>
                )}

                <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-line/40">
                  <span className="text-[11.5px] font-extrabold text-primary inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
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
                      className="p-1 rounded-[6px] hover:bg-surface-2 text-muted hover:text-primary transition-colors"
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

      {/* MODAL CHI TIẾT SÁCH KHI BẤM VÀO */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-[480px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
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
                <div className="w-28 sm:w-32 shrink-0">
                  <ModernBookCover
                    title={selectedBook.title}
                    coverUrl={selectedBook.cover_url}
                    author={selectedBook.author}
                  />
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
                  <span>Mở liên kết tham khảo / đọc thử</span>
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {/* Footer Modal */}
            <div className="p-4 px-5 border-t border-line bg-surface flex justify-between items-center">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBook(null);
                    setShowEditModal(true);
                  }}
                  className="flex items-center gap-1.5 text-[12.5px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <Edit2 size={13} />
                  <span>Sửa thông tin cuốn này</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setSelectedBook(null)}
                className="h-9 px-4 rounded-[10px] bg-surface-2 text-ink text-[13px] font-bold hover:bg-surface-3 transition-colors cursor-pointer ml-auto"
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
