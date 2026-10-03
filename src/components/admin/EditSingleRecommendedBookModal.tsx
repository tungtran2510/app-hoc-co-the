'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  BookOpen,
  Image as ImageIcon,
  Save,
  Loader2,
  Film,
  Images,
  Sparkles,
  Plus,
  Trash2,
  Check,
} from 'lucide-react';
import { RecommendedBook } from '../../lib/types';
import { uploadImageFile } from '../../lib/storageUpload';
import { extractYouTubeId } from '../../lib/youtube';
import ModernBookCover from '../ModernBookCover';
import YouTubeEmbed from '../YouTubeEmbed';

interface EditSingleRecommendedBookModalProps {
  isOpen: boolean;
  book: RecommendedBook | null;
  onClose: () => void;
  onSaved: (updatedBook: RecommendedBook) => Promise<void> | void;
}

export default function EditSingleRecommendedBookModal({
  isOpen,
  book,
  onClose,
  onSaved,
}: EditSingleRecommendedBookModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [badgeTag, setBadgeTag] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && book) {
      setTitle(book.title || '');
      setCategory(book.category || book.tag || '');
      setBadgeTag(book.badge_tag || 'TÀI LIỆU NÊN ĐỌC');
      setAuthor(book.author || 'Tùng Dinh Dưỡng');
      setDescription(book.description || '');
      setCoverUrl(book.cover_url || null);
      setYoutubeUrl(book.youtube_url || '');
      setGalleryImages(Array.isArray(book.gallery_images) ? [...book.gallery_images] : []);
      setErrorMsg('');
      setSuccessNotice('');
    }
  }, [isOpen, book]);

  if (!isOpen || !book) return null;

  // Upload ảnh bìa sách
  const handleCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      if (res && res.url) {
        setCoverUrl(res.url);
      } else {
        setErrorMsg('Chưa tải được ảnh bìa.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh bìa.');
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  // Upload ảnh bộ sưu tập bên trong
  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      setErrorMsg('');
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const res = await uploadImageFile(files[i]);
        if (res && res.url) {
          uploadedUrls.push(res.url);
        }
      }
      setGalleryImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh tài liệu.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleDeleteGalleryImage = (idx: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setErrorMsg('Vui lòng nhập tên tài liệu / cuốn sách.');
      return;
    }

    if (youtubeUrl.trim() && !extractYouTubeId(youtubeUrl)) {
      setErrorMsg('Đường dẫn YouTube không hợp lệ. Vui lòng dán link dạng youtube.com/watch?v=... hoặc youtu.be/... hoặc ID 11 ký tự.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const updatedBook: RecommendedBook = {
        ...book,
        title: cleanTitle,
        category: category.trim() || null,
        tag: category.trim() || null,
        badge_tag: badgeTag.trim() || null,
        author: author.trim() || 'Tùng Dinh Dưỡng',
        description: description.trim(),
        cover_url: coverUrl ? coverUrl.trim() : null,
        youtube_url: youtubeUrl.trim() || null,
        gallery_images: galleryImages.filter(Boolean),
      };

      await onSaved(updatedBook);
      setSuccessNotice('✓ Đã lưu thay đổi thành công!');
      setTimeout(() => {
        onClose();
      }, 400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu sách.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[540px] max-h-[92vh] bg-white dark:bg-[#160E2E] rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200 border dark:border-white/10">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Input file ẩn */}
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
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line bg-surface">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[17px] font-extrabold text-ink leading-tight truncate">
                Sửa tài liệu: {book.title}
              </h3>
              <p className="text-[12px] text-muted truncate">
                Chỉnh sửa thông tin, bìa sách 3:4, video và ảnh chi tiết của cuốn sách này
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer shrink-0 ml-2"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body cuộn */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3.5 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold">
              {errorMsg}
            </div>
          )}

          {successNotice && (
            <div className="p-3 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold flex items-center gap-1.5">
              <Check size={16} />
              <span>{successNotice}</span>
            </div>
          )}

          {/* 1. Tên sách */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13.5px] font-extrabold text-ink flex items-center gap-1">
              <span>Tên tài liệu / Sách</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Giải Mã Cột Sống & Vận Động Đúng"
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14.5px] text-ink font-bold focus:border-primary"
            />
          </div>

          {/* 2. Thể loại & Huy hiệu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-ink">
                Thể loại / Nhãn phân loại
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ví dụ: Cột Sống & Đĩa Đệm"
                className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-ink">
                Huy hiệu nổi bật
              </label>
              <input
                type="text"
                value={badgeTag}
                onChange={(e) => setBadgeTag(e.target.value)}
                placeholder="Ví dụ: TÀI LIỆU NÊN ĐỌC"
                className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
              />
            </div>
          </div>

          {/* 3. Tác giả */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-ink">
              Tác giả / Người biên soạn
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ví dụ: Tùng Dinh Dưỡng"
              className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
            />
          </div>

          {/* 4. Mô tả tóm tắt nội dung */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-ink">
              Mô tả tóm tắt nội dung sách
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt ngắn gọn nội dung tài liệu..."
              className="w-full p-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary leading-relaxed"
            />
          </div>

          {/* 5. Ảnh bìa sách (Tỷ lệ 3:4) */}
          <div className="p-3.5 rounded-[16px] bg-surface-2/60 border border-line flex flex-col gap-2.5">
            <label className="text-[13px] font-extrabold text-ink flex items-center justify-between">
              <span>Ảnh bìa sách (Tỷ lệ 3:4)</span>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl(null)}
                  className="text-[11.5px] text-red-600 font-bold hover:underline cursor-pointer"
                >
                  Xóa ảnh bìa
                </button>
              )}
            </label>

            <div className="flex items-center gap-3">
              <div className="w-[84px] aspect-[3/4] rounded-[10px] overflow-hidden border border-line bg-surface shrink-0 shadow-sm relative">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={coverUrl}
                    alt="Bìa sách"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-1 text-center bg-primary-soft/30 text-muted">
                    <BookOpen size={24} className="text-primary/70 mb-1" />
                    <span className="text-[9px] font-bold">Chưa có bìa</span>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-[10px] bg-white dark:bg-white/10 border border-line text-ink font-bold text-[13px] hover:border-primary cursor-pointer shadow-2xs transition-colors"
                >
                  {isUploadingCover ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span>Đang nén & tải ảnh...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={14} className="text-primary" />
                      <span>Chọn ảnh bìa từ máy</span>
                    </>
                  )}
                </button>

                <input
                  type="url"
                  value={coverUrl || ''}
                  onChange={(e) => setCoverUrl(e.target.value.trim() || null)}
                  placeholder="Hoặc dán URL ảnh bìa (https://...)..."
                  className="w-full h-8 px-2.5 rounded-[8px] border border-line text-[12px] text-ink focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* 6. Link video YouTube */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-ink flex items-center gap-1.5">
              <Film size={14} className="text-primary" />
              <span>Link video YouTube giới thiệu sách</span>
            </label>
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... hoặc youtu.be/..."
              className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
            />

            {extractYouTubeId(youtubeUrl) ? (
              <div className="mt-2 rounded-[12px] overflow-hidden border border-line">
                <YouTubeEmbed
                  youtubeId={extractYouTubeId(youtubeUrl)!}
                  title={`Video giới thiệu ${title || 'cuốn sách'}`}
                  showAdminTip={false}
                  showExternalLink={true}
                />
              </div>
            ) : youtubeUrl.trim() ? (
              <p className="text-[11.5px] text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Không nhận diện được video từ link trên. Vui lòng kiểm tra lại đường dẫn YouTube.
              </p>
            ) : null}
          </div>

          {/* 7. Ảnh bên trong tài liệu (Gallery) */}
          <div className="p-3.5 rounded-[16px] bg-surface-2/60 border border-line flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-extrabold text-ink flex items-center gap-1.5">
                <Images size={14} className="text-primary" />
                <span>Ảnh trang sách bên trong ({galleryImages.length})</span>
              </label>

              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploadingGallery}
                className="flex items-center gap-1 h-8 px-2.5 rounded-[8px] bg-primary-soft text-primary text-[11.5px] font-extrabold hover:bg-primary-soft/80 cursor-pointer shadow-2xs transition-colors"
              >
                {isUploadingGallery ? (
                  <>
                    <Loader2 size={12} className="animate-spin" />
                    <span>Đang tải...</span>
                  </>
                ) : (
                  <>
                    <Plus size={13} strokeWidth={2.5} />
                    <span>Tải thêm ảnh</span>
                  </>
                )}
              </button>
            </div>

            {galleryImages.length > 0 ? (
              <div className="flex gap-2 overflow-x-auto py-1">
                {galleryImages.map((imgUrl, i) => (
                  <div
                    key={i}
                    className="relative w-16 aspect-[3/4] rounded-[8px] bg-surface border border-line overflow-hidden shrink-0 group shadow-2xs"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgUrl}
                      alt={`Trang ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(i)}
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
                Chưa có ảnh chụp trang sách. Bấm &quot;Tải thêm ảnh&quot; để bổ sung trang sách/bảng tra cứu.
              </p>
            )}
          </div>
        </form>

        {/* Footer Modal */}
        <div className="flex items-center justify-end gap-2.5 p-4 border-t border-line bg-surface">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 rounded-[12px] border border-line text-ink font-bold text-[13.5px] hover:bg-surface-2 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 px-5 rounded-[12px] bg-primary hover:bg-primary-dark text-white font-extrabold text-[13.5px] flex items-center gap-1.5 shadow-md shadow-primary/25 cursor-pointer disabled:opacity-50 transition-all active:scale-95"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu cuốn sách này</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
