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

  const handleDeleteGalleryImage = (bookId: string, imgIdx: number) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId
          ? {
              ...b,
              gallery_images: (b.gallery_images || []).filter((_, i) => i !== imgIdx),
            }
          : b
      )
    );
  };

  // Thêm sách mới
  const handleAddBook = () => {
    const newBook: RecommendedBook = {
      id: `rec-book-${Date.now()}`,
      title: 'Tên sách mới',
      cover_url: null,
      description: 'Mô tả ngắn gọn về cuốn sách hoặc giá trị cốt lõi.',
      author: '',
      link_url: '',
      youtube_url: '',
      gallery_images: [],
    };
    setBooks((prev) => [...prev, newBook]);
  };

  // Cập nhật thông tin từng cuốn sách
  const handleUpdateBook = (id: string, patch: Partial<RecommendedBook>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  // Xóa sách
  const handleDeleteBook = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này khỏi danh sách?')) return;
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Đổi thứ tự
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= books.length) return;
    const newBooks = [...books];
    const [moved] = newBooks.splice(index, 1);
    newBooks.splice(targetIndex, 0, moved);
    setBooks(newBooks);
  };

  // Lưu cài đặt
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng không để trống tiêu đề mục sách.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const cleanBooks: RecommendedBook[] = books.map((b) => ({
        id: b.id || `rec-book-${Date.now()}`,
        title: (b.title || '').trim(),
        cover_url: b.cover_url || null,
        description: (b.description || '').trim(),
        author: (b.author || '').trim() || null,
        category: (b.category || b.tag || '').trim() || null,
        badge_tag: (b.badge_tag || '').trim() || null,
        tag: (b.tag || b.category || '').trim() || null,
        link_url: (b.link_url || '').trim() || null,
        youtube_url: (b.youtube_url || '').trim() || null,
        gallery_images: Array.isArray(b.gallery_images) ? b.gallery_images.filter(Boolean) : [],
        is_visible: b.is_visible !== undefined ? Boolean(b.is_visible) : true,
      }));

      const res = await saveSettingsApi({
        recommended_books_title: title.trim(),
        recommended_books_subtitle: subtitle.trim(),
        recommended_books: cleanBooks,
        recommended_books_layout: layout,
      });

      if (res.success) {
        onSaved({
          title: title.trim(),
          subtitle: subtitle.trim(),
          books: cleanBooks,
          layout,
        });
        onClose();
      } else {
        setErrorMsg(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi lưu danh sách sách.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[580px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Input file ẩn cho upload ảnh bìa & gallery */}
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

        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-ink leading-tight">
                Quản lý mục Tài Liệu Nên Đọc
              </h3>
              <p className="text-[12px] text-muted">
                Bìa 3:4 · Video YouTube · Ảnh chi tiết bên trong tài liệu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
          {errorMsg && (
            <div className="p-3.5 rounded-[14px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Cấu hình tiêu đề & mô tả chung */}
          <div className="p-4 rounded-[18px] bg-surface-2/60 border border-line flex flex-col gap-3">
            <div className="flex items-center gap-1.5 text-primary text-[12px] font-extrabold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Tiêu đề & Chú thích khối</span>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-ink mb-1">
                Tiêu đề khối
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Tài Liệu Y Khoa Chuyên Sâu"
                className="w-full h-10 px-3.5 rounded-[12px] bg-white border border-line text-[14px] text-ink focus:border-primary focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-ink mb-1">
                Mô tả phụ (dưới tiêu đề)
              </label>
              <textarea
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                rows={2}
                placeholder="Ví dụ: Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày"
                className="w-full p-3 rounded-[12px] bg-white border border-line text-[13px] text-ink focus:border-primary focus:outline-hidden resize-none"
              />
            </div>

            {/* Cài đặt chế độ hiển thị mặc định cho người xem */}
            <div>
              <label className="block text-[13px] font-bold text-ink mb-1.5">
                Chế độ hiển thị mặc định cho người xem
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setLayout('grid')}
                  className={`flex items-center gap-2 p-2.5 rounded-[12px] border text-left transition-all cursor-pointer ${
                    layout === 'grid'
                      ? 'bg-primary/5 border-primary text-primary font-bold shadow-xs'
                      : 'bg-white border-line text-ink hover:bg-surface-2'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${
                      layout === 'grid'
                        ? 'bg-primary text-white'
                        : 'bg-surface-2 text-muted'
                    }`}
                  >
                    <LayoutGrid size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight">Dạng lưới (Grid)</p>
                    <p className="text-[11px] text-muted leading-tight mt-0.5">2 cột gọn gàng</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setLayout('lookbook')}
                  className={`flex items-center gap-2 p-2.5 rounded-[12px] border text-left transition-all cursor-pointer ${
                    layout === 'lookbook'
                      ? 'bg-primary/5 border-primary text-primary font-bold shadow-xs'
                      : 'bg-white border-line text-ink hover:bg-surface-2'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0 ${
                      layout === 'lookbook'
                        ? 'bg-primary text-white'
                        : 'bg-surface-2 text-muted'
                    }`}
                  >
                    <List size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold leading-tight">Dạng danh sách</p>
                    <p className="text-[11px] text-muted leading-tight mt-0.5">Chi tiết kèm mô tả</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Danh sách các cuốn sách */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[15px] font-extrabold text-ink">
                  Danh sách tài liệu hiển thị ({books.length})
                </h4>
                <p className="text-[12px] text-muted">
                  Tất cả tài liệu đều có mục video & ảnh bên trong
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddBook}
                className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-primary text-white text-[12.5px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-2xs"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>Thêm tài liệu</span>
              </button>
            </div>

            {books.length === 0 ? (
              <div className="p-8 rounded-[18px] border-2 border-dashed border-line text-center flex flex-col items-center justify-center gap-2">
                <BookOpen size={32} className="text-muted/60" />
                <p className="text-[13.5px] text-muted font-medium">
                  Chưa có cuốn sách nào trong danh sách.
                </p>
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="mt-1 text-[13px] font-extrabold text-primary hover:underline cursor-pointer"
                >
                  + Nhấn vào đây để thêm cuốn đầu tiên
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {books.map((book, idx) => (
                  <div
                    key={book.id || idx}
                    className="p-4 rounded-[18px] bg-white border border-line shadow-xs flex flex-col gap-3.5 relative"
                  >
                    {/* Hàng điều khiển phía trên mỗi sách */}
                    <div className="flex items-center justify-between pb-2 border-b border-line/60">
                      <span className="text-[12px] font-extrabold text-primary bg-primary-soft px-2.5 py-0.5 rounded-full">
                        Cuốn #{idx + 1}
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, 'up')}
                          className="w-7 h-7 rounded-[8px] bg-surface-2 text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                          title="Lên trên"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          type="button"
                          disabled={idx === books.length - 1}
                          onClick={() => handleMove(idx, 'down')}
                          className="w-7 h-7 rounded-[8px] bg-surface-2 text-muted hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                          title="Xuống dưới"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id)}
                          className="w-7 h-7 rounded-[8px] bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center ml-1 cursor-pointer"
                          title="Xóa cuốn này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Nội dung chi tiết từng sách */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start">
                      {/* Cột trái: Ảnh bìa 3:4 */}
                      <div className="sm:col-span-4 flex flex-col gap-2">
                        <label className="text-[12px] font-bold text-ink">
                          Ảnh bìa sách (Dọc 3:4)
                        </label>
                        <div className="relative w-full aspect-[3/4] rounded-[14px] bg-surface-2 border border-line overflow-hidden flex items-center justify-center group shadow-2xs">
                          {book.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={book.cover_url}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-1.5 p-3 text-center text-muted">
                              <BookOpen size={28} className="text-primary/60" />
                              <span className="text-[11px] font-bold">Khung 3:4</span>
                            </div>
                          )}

                          {uploadingBookId === book.id && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white gap-1.5 text-[12px] font-bold">
                              <Loader2 size={16} className="animate-spin" />
                              <span>Đang tải...</span>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            disabled={uploadingBookId === book.id}
                            onClick={() => triggerUploadCover(book.id)}
                            className="flex-1 h-8 rounded-[9px] bg-primary-soft text-primary text-[11.5px] font-extrabold flex items-center justify-center gap-1 hover:bg-primary-soft/80 transition-colors cursor-pointer"
                          >
                            <ImageIcon size={13} />
                            <span>Tải ảnh bìa</span>
                          </button>
                          {book.cover_url && (
                            <button
                              type="button"
                              onClick={() => handleUpdateBook(book.id, { cover_url: null })}
                              className="h-8 px-2 rounded-[9px] bg-surface-2 text-muted hover:text-red-600 text-[11.5px] font-medium"
                              title="Gỡ ảnh"
                            >
                              Gỡ
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          value={book.cover_url || ''}
                          onChange={(e) =>
                            handleUpdateBook(book.id, { cover_url: e.target.value.trim() || null })
                          }
                          placeholder="Hoặc dán URL ảnh bìa"
                          className="w-full h-7 px-2 text-[11px] rounded-[8px] bg-surface border border-line text-ink placeholder:text-muted/60"
                        />
                      </div>

                      {/* Cột phải: Các trường thông tin */}
                      <div className="sm:col-span-8 flex flex-col gap-2.5">
                        <div>
                          <label className="block text-[12px] font-bold text-ink mb-1">
                            Tên sách <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={book.title}
                            onChange={(e) => handleUpdateBook(book.id, { title: e.target.value })}
                            placeholder="Ví dụ: Lắng Nghe Cơ Thể Để Tự Chữa Lành"
                            className="w-full h-9 px-3 rounded-[10px] bg-surface border border-line text-[13.5px] font-bold text-ink focus:border-primary focus:outline-hidden"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[12px] font-bold text-ink mb-1">
                              Đầu mục / Thể loại
                            </label>
                            <input
                              type="text"
                              value={book.category || book.tag || ''}
                              onChange={(e) => handleUpdateBook(book.id, { category: e.target.value, tag: e.target.value })}
                              placeholder="Ví dụ: Cột sống, Dinh dưỡng..."
                              className="w-full h-8 px-2.5 rounded-[9px] bg-surface border border-line text-[12.5px] text-ink focus:border-primary focus:outline-hidden"
                            />
                          </div>

                          <div>
                            <label className="block text-[12px] font-bold text-ink mb-1 flex items-center gap-1">
                              <Sparkles size={11} className="text-amber-500" />
                              <span>Thẻ Flash bìa</span>
                            </label>
                            <input
                              type="text"
                              value={book.badge_tag || ''}
                              onChange={(e) => handleUpdateBook(book.id, { badge_tag: e.target.value })}
                              placeholder="Ví dụ: NÊN ĐỌC, KHUYÊN ĐỌC..."
                              className="w-full h-8 px-2.5 rounded-[9px] bg-surface border border-line text-[12.5px] text-ink focus:border-primary focus:outline-hidden font-bold"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[12px] font-bold text-ink mb-1">
                            Tác giả / Đơn vị biên soạn (tùy chọn)
                          </label>
                          <input
                            type="text"
                            value={book.author || ''}
                            onChange={(e) => handleUpdateBook(book.id, { author: e.target.value })}
                            placeholder="Ví dụ: Bs. Nguyễn Văn A / Viện Trị liệu"
                            className="w-full h-8 px-3 rounded-[10px] bg-surface border border-line text-[12.5px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[12px] font-bold text-ink mb-1">
                            Mô tả cuốn sách & Điểm nổi bật
                          </label>
                          <textarea
                            value={book.description}
                            onChange={(e) =>
                              handleUpdateBook(book.id, { description: e.target.value })
                            }
                            rows={2}
                            placeholder="Tóm tắt ngắn gọn nội dung, giá trị ứng dụng thực tế..."
                            className="w-full p-2 rounded-[10px] bg-surface border border-line text-[12.5px] text-ink focus:border-primary focus:outline-hidden resize-none leading-relaxed"
                          />
                        </div>

                        {/* MỤC VIDEO YOUTUBE ("tất cả mọi cái sách đều phải có mục video") */}
                        <div>
                          <label className="block text-[12px] font-bold text-ink mb-1 flex items-center gap-1.5">
                            <Film size={13} className="text-red-600" />
                            <span>Link video YouTube giới thiệu về sách</span>
                          </label>
                          <input
                            type="url"
                            value={book.youtube_url || ''}
                            onChange={(e) =>
                              handleUpdateBook(book.id, { youtube_url: e.target.value.trim() || null })
                            }
                            placeholder="https://www.youtube.com/watch?v=..."
                            className="w-full h-8 px-3 rounded-[10px] bg-surface border border-line text-[12px] text-ink focus:border-primary focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-[12px] font-bold text-ink mb-1">
                            Đường link tìm hiểu thêm / đọc thử (tùy chọn)
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={book.link_url || ''}
                              onChange={(e) =>
                                handleUpdateBook(book.id, { link_url: e.target.value })
                              }
                              placeholder="https://..."
                              className="w-full h-8 pl-8 pr-3 rounded-[10px] bg-surface border border-line text-[12px] text-ink focus:border-primary focus:outline-hidden"
                            />
                            <ExternalLink
                              size={13}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* HÀNG QUẢN LÝ ẢNH BÊN TRONG TRANG SÁCH (GALLERY IMAGES) */}
                    <div className="pt-3 border-t border-line/60 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[12.5px] font-bold text-ink flex items-center gap-1.5">
                          <Images size={14} className="text-primary" />
                          <span>
                            Ảnh bên trong trang sách ({book.gallery_images?.length || 0})
                          </span>
                        </label>

                        <button
                          type="button"
                          disabled={uploadingGalleryBookId === book.id}
                          onClick={() => triggerUploadGallery(book.id)}
                          className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-primary-soft text-primary text-[11px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs transition-colors"
                        >
                          {uploadingGalleryBookId === book.id ? (
                            <>
                              <Loader2 size={12} className="animate-spin" />
                              <span>Đang tải...</span>
                            </>
                          ) : (
                            <>
                              <Plus size={12} strokeWidth={2.5} />
                              <span>Tải thêm ảnh trang sách</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Danh sách ảnh trang sách đã tải lên */}
                      {book.gallery_images && book.gallery_images.length > 0 ? (
                        <div className="flex gap-2.5 overflow-x-auto py-1">
                          {book.gallery_images.map((imgUrl, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="relative w-16 h-20 aspect-[3/4] rounded-[10px] bg-surface-2 border border-line overflow-hidden shrink-0 group shadow-2xs"
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
                                className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                                title="Xóa ảnh này"
                              >
                                <X size={11} strokeWidth={3} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[12px] text-muted italic">
                          Chưa có ảnh chụp trang sách. Bấm &quot;Tải thêm ảnh trang sách&quot; để thêm ảnh minh họa bên trong.
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        {/* Footer lưu & hủy */}
        <div className="flex items-center justify-between p-4 px-5 border-t border-line bg-surface">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 rounded-[12px] bg-surface-2 text-ink text-[13.5px] font-bold hover:bg-surface-3 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 h-10 px-5 rounded-[12px] bg-primary text-white text-[13.5px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
