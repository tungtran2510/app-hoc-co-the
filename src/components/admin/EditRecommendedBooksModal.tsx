'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Sparkles,
  Film,
  Images,
  LayoutGrid,
  List,
} from 'lucide-react';
import { RecommendedBook } from '../../lib/types';
import { uploadImageFile } from '../../lib/storageUpload';
import { saveSettingsApi } from '../../lib/apiAdmin';

interface EditRecommendedBooksModalProps {
  isOpen: boolean;
  initialTitle?: string | null;
  initialSubtitle?: string | null;
  initialBooks?: RecommendedBook[];
  initialLayout?: 'grid' | 'lookbook' | null;
  onClose: () => void;
  onSaved: (data: {
    title: string;
    subtitle: string;
    books: RecommendedBook[];
    layout?: 'grid' | 'lookbook';
  }) => void;
}

export default function EditRecommendedBooksModal({
  isOpen,
  initialTitle,
  initialSubtitle,
  initialBooks = [],
  initialLayout = 'grid',
  onClose,
  onSaved,
}: EditRecommendedBooksModalProps) {
  const [title, setTitle] = useState(initialTitle || 'Tài Liệu Y Khoa');
  const [subtitle, setSubtitle] = useState(
    initialSubtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'
  );
  const [layout, setLayout] = useState<'grid' | 'lookbook'>(
    initialLayout === 'lookbook' ? 'lookbook' : 'grid'
  );
  const [books, setBooks] = useState<RecommendedBook[]>([]);
  const [uploadingBookId, setUploadingBookId] = useState<string | null>(null);
  const [activeBookForUpload, setActiveBookForUpload] = useState<string | null>(null);
  const [uploadingGalleryBookId, setUploadingGalleryBookId] = useState<string | null>(null);
  const [activeBookForGallery, setActiveBookForGallery] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle || 'Tài Liệu Y Khoa');
      setSubtitle(
        initialSubtitle || 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'
      );
      setLayout(initialLayout === 'lookbook' ? 'lookbook' : 'grid');
      setBooks(
        Array.isArray(initialBooks) && initialBooks.length > 0
          ? initialBooks.map((b) => ({
              ...b,
              gallery_images: Array.isArray(b.gallery_images) ? [...b.gallery_images] : [],
            }))
          : []
      );
      setErrorMsg('');
    }
  }, [isOpen, initialTitle, initialSubtitle, initialBooks, initialLayout]);

  if (!isOpen) return null;

  // Xử lý upload ảnh bìa (tỷ lệ 3:4)
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeBookForUpload) return;
    try {
      setUploadingBookId(activeBookForUpload);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      if (res && res.url) {
        setBooks((prev) =>
          prev.map((b) => (b.id === activeBookForUpload ? { ...b, cover_url: res.url } : b))
        );
      } else {
        setErrorMsg('Chưa tải được ảnh bìa sách lên kho lưu trữ.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh bìa sách.');
    } finally {
      setUploadingBookId(null);
      setActiveBookForUpload(null);
      if (coverInputRef.current) coverInputRef.current.value = '';
      e.target.value = '';
    }
  };

  const triggerUploadCover = (bookId: string) => {
    setActiveBookForUpload(bookId);
    coverInputRef.current?.click();
  };

  // Xử lý upload ảnh trang sách (Gallery)
  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !activeBookForGallery) return;
    try {
      setUploadingGalleryBookId(activeBookForGallery);
      setErrorMsg('');

      const uploadedUrls: string[] = [];
      for (const f of files) {
        const res = await uploadImageFile(f);
        if (res && res.url) {
          uploadedUrls.push(res.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setBooks((prev) =>
          prev.map((b) =>
            b.id === activeBookForGallery
              ? {
                  ...b,
                  gallery_images: [...(b.gallery_images || []), ...uploadedUrls],
                }
              : b
          )
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh trang sách.');
    } finally {
      setUploadingGalleryBookId(null);
      setActiveBookForGallery(null);
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      e.target.value = '';
    }
  };

  const triggerUploadGallery = (bookId: string) => {
    setActiveBookForGallery(bookId);
    galleryInputRef.current?.click();
  };

  const handleDeleteGalleryImage = (bookId: string, imageIndex: number) => {
    setBooks((prev) =>
      prev.map((b) => {
        if (b.id !== bookId) return b;
        const nextGallery = (b.gallery_images || []).filter((_, idx) => idx !== imageIndex);
        return { ...b, gallery_images: nextGallery };
      })
    );
  };

  const handleUpdateBook = (id: string, updates: Partial<RecommendedBook>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const handleAddBook = () => {
    const newBook: RecommendedBook = {
      id: `book-${Date.now()}`,
      title: 'Tài liệu y khoa mới',
      category: 'Chăm sóc sức khỏe',
      badge_tag: 'KHUYÊN ĐỌC',
      cover_url: null,
      description: 'Tài liệu hướng dẫn trực quan, khoa học và dễ ứng dụng...',
      author: 'Chuyên gia y khoa',
      link_url: '',
      youtube_url: '',
      gallery_images: [],
      is_visible: true,
    };
    setBooks([newBook, ...books]);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa cuốn sách này khỏi danh sách?')) {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= books.length) return;
    const nextBooks = [...books];
    const temp = nextBooks[index];
    nextBooks[index] = nextBooks[nextIndex];
    nextBooks[nextIndex] = temp;
    setBooks(nextBooks);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề cho khối tài liệu');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const cleanBooks = books.map((b) => ({
        ...b,
        title: b.title.trim(),
        category: b.category ? b.category.trim() : null,
        badge_tag: b.badge_tag ? b.badge_tag.trim() : null,
        description: b.description ? b.description.trim() : '',
        author: b.author ? b.author.trim() : null,
        link_url: b.link_url ? b.link_url.trim() : null,
        youtube_url: b.youtube_url ? b.youtube_url.trim() : null,
        gallery_images: Array.isArray(b.gallery_images) ? b.gallery_images.filter(Boolean) : [],
      }));

      await saveSettingsApi({
        recommended_books_title: title.trim(),
        recommended_books_subtitle: subtitle.trim(),
        recommended_books: cleanBooks,
        recommended_books_layout: layout,
      });

      onSaved({
        title: title.trim(),
        subtitle: subtitle.trim(),
        books: cleanBooks,
        layout,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu cài đặt sách.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4">
      {/* Input file ẩn cho bìa & gallery */}
      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleGalleryFilesChange}
        accept="image/*"
        multiple
        className="hidden"
      />

      <div className="w-full max-w-2xl bg-surface rounded-[24px] border border-line shadow-2xl flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in duration-200">
        {/* Header tinh gọn */}
        <div className="flex items-center justify-between p-3.5 px-4 sm:px-5 border-b border-line bg-gradient-to-r from-surface to-surface-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[9px] bg-primary text-white flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[16px] font-black text-ink truncate leading-tight">
                Cài Đặt Sách & Tài Liệu Y Khoa
              </h3>
              <p className="text-[11.5px] text-muted truncate">
                Quản lý danh sách sách tham khảo, ảnh bìa 3:4 và video
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-3.5 sm:p-4 flex flex-col gap-3">
          {errorMsg && (
            <div className="p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-[12px] font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Cài đặt chung mục sách (tinh gọn, 1 hàng) */}
          <div className="p-3 rounded-[14px] bg-surface-2/60 border border-line flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-primary text-[11.5px] font-black uppercase tracking-wider">
                <Sparkles size={13} />
                <span>Cài đặt chung</span>
              </div>

              {/* Segmented layout switch */}
              <div className="flex items-center gap-1 bg-surface p-0.5 rounded-[8px] border border-line">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer ${
                    layout === 'grid'
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <LayoutGrid size={12} />
                  <span>Lưới 2 cột</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLayout('lookbook')}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer ${
                    layout === 'lookbook'
                      ? 'bg-primary text-white shadow-2xs'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  <List size={12} />
                  <span>Danh sách</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-ink mb-0.5">
                  Tiêu đề mục hiển thị
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ví dụ: Tài Liệu Y Khoa Chuyên Sâu"
                  className="w-full h-8 px-2.5 rounded-[8px] bg-surface border border-line text-[12px] text-ink focus:border-primary focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink mb-0.5">
                  Mô tả phụ
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ví dụ: Tài liệu tham khảo chuyên sâu..."
                  className="w-full h-8 px-2.5 rounded-[8px] bg-surface border border-line text-[12px] text-ink focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Danh sách các cuốn sách */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-extrabold text-ink">
                Danh sách sách & tài liệu ({books.length})
              </span>

              <button
                type="button"
                onClick={handleAddBook}
                className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-primary text-white text-[11.5px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-2xs"
              >
                <Plus size={13} strokeWidth={2.5} />
                <span>Thêm tài liệu</span>
              </button>
            </div>

            {books.length === 0 ? (
              <div className="p-6 rounded-[14px] border border-dashed border-line text-center flex flex-col items-center justify-center gap-1.5">
                <BookOpen size={24} className="text-muted/60" />
                <p className="text-[12.5px] text-muted font-medium">
                  Chưa có cuốn sách nào.
                </p>
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="text-[12px] font-extrabold text-primary hover:underline cursor-pointer"
                >
                  + Nhấn vào đây để thêm cuốn đầu tiên
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {books.map((book, idx) => (
                  <div
                    key={book.id || idx}
                    className="p-3 sm:p-3.5 rounded-[16px] bg-surface border border-line shadow-xs flex flex-col gap-2.5 relative"
                  >
                    {/* Hàng điều khiển phía trên mỗi sách */}
                    <div className="flex items-center justify-between pb-1.5 border-b border-line/60">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-[11px] font-extrabold text-primary bg-primary-soft px-2 py-0.5 rounded-full shrink-0">
                          Cuốn #{idx + 1}
                        </span>
                        <span className="text-[12px] font-bold text-ink truncate max-w-[180px] sm:max-w-xs">
                          {book.title || 'Chưa đặt tên'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="w-6.5 h-6.5 rounded-[6px] bg-surface-2 text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                          title="Lên trên"
                        >
                          <ArrowUp size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === books.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="w-6.5 h-6.5 rounded-[6px] bg-surface-2 text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                          title="Xuống dưới"
                        >
                          <ArrowDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id)}
                          className="w-6.5 h-6.5 rounded-[6px] bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center ml-0.5 cursor-pointer"
                          title="Xóa cuốn này"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Nội dung chi tiết từng sách: Bố cục ngang tinh gọn, không chiếm diện tích */}
                    <div className="flex flex-col sm:flex-row gap-3 items-start">
                      {/* Ảnh bìa nhỏ gọn (64x86px) + nút hành động */}
                      <div className="flex sm:flex-col items-center sm:items-stretch gap-2 shrink-0 w-full sm:w-auto">
                        <div className="relative w-16 h-22 sm:w-18 sm:h-24 aspect-[3/4] rounded-[9px] bg-surface-2 border border-line overflow-hidden flex items-center justify-center shrink-0 shadow-2xs group">
                          {book.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={book.cover_url}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-1 text-center text-muted">
                              <BookOpen size={18} className="text-primary/60" />
                              <span className="text-[8.5px] font-bold mt-0.5">3:4</span>
                            </div>
                          )}

                          {uploadingBookId === book.id && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-[10px] font-bold">
                              <Loader2 size={14} className="animate-spin" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 sm:w-18 flex flex-col gap-1 min-w-0">
                          <button
                            type="button"
                            disabled={uploadingBookId === book.id}
                            onClick={() => triggerUploadCover(book.id)}
                            className="w-full h-7 px-1.5 rounded-[7px] bg-primary-soft text-primary text-[10.5px] font-extrabold flex items-center justify-center gap-1 hover:bg-primary-soft/80 cursor-pointer"
                          >
                            <ImageIcon size={11} />
                            <span>{book.cover_url ? 'Đổi ảnh' : 'Tải bìa'}</span>
                          </button>

                          {book.cover_url && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBook(book.id, { cover_url: null })}
                              className="w-full h-5.5 rounded-[6px] bg-surface-2 hover:bg-red-50 text-muted hover:text-red-600 text-[10px] font-medium"
                              title="Gỡ ảnh"
                            >
                              Gỡ bìa
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Các trường thông tin dạng lưới 2 cột gọn gàng */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-ink mb-0.5">
                            Tên sách <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={book.title}
                            onChange={(e) => handleUpdateBook(book.id, { title: e.target.value })}
                            placeholder="Ví dụ: Lắng Nghe Cơ Thể Để Tự Chữa Lành"
                            className="w-full h-8 px-2.5 rounded-[8px] bg-surface border border-line text-[12.5px] font-bold text-ink focus:border-primary focus:outline-hidden"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink mb-0.5">
                            Thể loại / Chủ đề
                          </label>
                          <input
                            type="text"
                            value={book.category || book.tag || ''}
                            onChange={(e) => handleUpdateBook(book.id, { category: e.target.value, tag: e.target.value })}
                            placeholder="Ví dụ: Cột sống, Dinh dưỡng..."
                            className="w-full h-7.5 px-2 rounded-[7px] bg-surface border border-line text-[11.5px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink mb-0.5 flex items-center gap-1">
                            <Sparkles size={11} className="text-amber-500" />
                            <span>Thẻ Flash bìa</span>
                          </label>
                          <input
                            type="text"
                            value={book.badge_tag || ''}
                            onChange={(e) => handleUpdateBook(book.id, { badge_tag: e.target.value })}
                            placeholder="Ví dụ: NÊN ĐỌC..."
                            className="w-full h-7.5 px-2 rounded-[7px] bg-surface border border-line text-[11.5px] text-ink focus:border-primary focus:outline-hidden font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink mb-0.5">
                            Tác giả / Đơn vị
                          </label>
                          <input
                            type="text"
                            value={book.author || ''}
                            onChange={(e) => handleUpdateBook(book.id, { author: e.target.value })}
                            placeholder="Ví dụ: Bs. Nguyễn Văn A"
                            className="w-full h-7.5 px-2 rounded-[7px] bg-surface border border-line text-[11.5px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink mb-0.5 flex items-center gap-1">
                            <Film size={11} className="text-red-600" />
                            <span>Link video YouTube</span>
                          </label>
                          <input
                            type="url"
                            value={book.youtube_url || ''}
                            onChange={(e) =>
                              handleUpdateBook(book.id, { youtube_url: e.target.value.trim() || null })
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full h-7.5 px-2 rounded-[7px] bg-surface border border-line text-[11.5px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink mb-0.5 flex items-center gap-1">
                            <ExternalLink size={11} className="text-muted" />
                            <span>Link tìm hiểu thêm</span>
                          </label>
                          <input
                            type="url"
                            value={book.link_url || ''}
                            onChange={(e) =>
                              handleUpdateBook(book.id, { link_url: e.target.value })
                            }
                            placeholder="https://..."
                            className="w-full h-7.5 px-2 rounded-[7px] bg-surface border border-line text-[11.5px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-ink mb-0.5">
                            Mô tả tóm tắt sách
                          </label>
                          <input
                            type="text"
                            value={book.description}
                            onChange={(e) =>
                              handleUpdateBook(book.id, { description: e.target.value })
                            }
                            placeholder="Tóm tắt ngắn gọn nội dung, giá trị..."
                            className="w-full h-7.5 px-2 rounded-[7px] bg-surface border border-line text-[11.5px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dãy ảnh bên trong trang sách (Gallery) tinh gọn */}
                    <div className="pt-2 border-t border-line/60 flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-ink flex items-center gap-1">
                          <Images size={12} className="text-primary" />
                          <span>Ảnh trang sách ({book.gallery_images?.length || 0})</span>
                        </span>

                        <button
                          type="button"
                          disabled={uploadingGalleryBookId === book.id}
                          onClick={() => triggerUploadGallery(book.id)}
                          className="flex items-center gap-1 h-6 px-2 rounded-[6px] bg-primary-soft text-primary text-[10.5px] font-extrabold hover:bg-primary-soft/80 cursor-pointer"
                        >
                          {uploadingGalleryBookId === book.id ? (
                            <>
                              <Loader2 size={10} className="animate-spin" />
                              <span>Đang tải...</span>
                            </>
                          ) : (
                            <>
                              <Plus size={11} strokeWidth={2.5} />
                              <span>Thêm ảnh</span>
                            </>
                          )}
                        </button>
                      </div>

                      {book.gallery_images && book.gallery_images.length > 0 ? (
                        <div className="flex gap-1.5 overflow-x-auto py-0.5">
                          {book.gallery_images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative w-11 h-15 aspect-[3/4] rounded-[6px] bg-surface-2 border border-line overflow-hidden shrink-0 group shadow-2xs"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={imgUrl}
                                alt={`Trang ${imgIdx + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteGalleryImage(book.id, imgIdx)}
                                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-xs opacity-90 hover:opacity-100"
                                title="Xóa ảnh này"
                              >
                                <X size={9} strokeWidth={3} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer lưu & hủy */}
        <div className="flex items-center justify-between p-3 px-4 sm:px-5 border-t border-line bg-surface shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-8.5 px-3.5 rounded-[9px] bg-surface-2 text-ink text-[12.5px] font-bold hover:bg-surface-3 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 h-8.5 px-4 rounded-[9px] bg-primary text-white text-[12.5px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
