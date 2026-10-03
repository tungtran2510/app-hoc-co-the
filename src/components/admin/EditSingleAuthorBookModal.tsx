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
import { AuthorBook } from '../../lib/types';
import { uploadImageFile } from '../../lib/storageUpload';
import { extractYouTubeId } from '../../lib/youtube';
import YouTubeEmbed from '../YouTubeEmbed';

interface EditSingleAuthorBookModalProps {
  isOpen: boolean;
  book: AuthorBook | null;
  onClose: () => void;
  onSaved: (updatedBook: AuthorBook) => Promise<void> | void;
}

export default function EditSingleAuthorBookModal({
  isOpen,
  book,
  onClose,
  onSaved,
}: EditSingleAuthorBookModalProps) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
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
      setYear(book.year || '');
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
      if (uploadedUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh trang sách.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    setGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tên cuốn sách');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');
      
      const updatedBook: AuthorBook = {
        ...book,
        title: title.trim(),
        year: year.trim() || undefined,
        description: description.trim(),
        cover_url: coverUrl ? coverUrl.trim() : null,
        youtube_url: youtubeUrl.trim() || null,
        gallery_images: galleryImages,
      };

      await onSaved(updatedBook);
      setSuccessNotice('Đã lưu thành công cuốn sách!');
      setTimeout(() => {
        onClose();
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu sách.');
    } finally {
      setIsSaving(false);
    }
  };

  const detectedYtId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white dark:bg-[#160D2D] rounded-[24px] border border-slate-200/90 dark:border-purple-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-purple-500/20 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white dark:from-[#211142] dark:to-[#160D2D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-[#1E3A8A] text-white flex items-center justify-center shadow-md shadow-blue-900/20">
              <BookOpen size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-black text-slate-900 dark:text-white leading-tight">
                  Chỉnh Sửa Cuốn Sách Này
                </h3>
                <span className="px-2 py-0.5 rounded-[6px] bg-blue-100 text-[#1E3A8A] dark:bg-purple-900/60 dark:text-purple-200 text-[10.5px] font-black uppercase">
                  Tác giả
                </span>
              </div>
              <p className="text-[12px] text-slate-500 dark:text-purple-200/70 mt-0.5 line-clamp-1">
                {book.title || 'Sách chuyên sâu'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-slate-600 dark:text-purple-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
        {errorMsg && (
          <div className="px-5 py-2.5 bg-red-50 border-b border-red-200 text-red-700 text-[13px] font-medium flex items-center justify-between">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg('')} className="text-red-500 font-bold ml-2">×</button>
          </div>
        )}
        {successNotice && (
          <div className="px-5 py-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-[13px] font-bold flex items-center gap-2">
            <Check size={16} className="text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* FORM NỘI DUNG CUỘN */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-slate-800 dark:text-purple-100 text-[13.5px]">
          {/* 1. TÊN SÁCH & NĂM */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3 space-y-1.5">
              <label className="block text-[12.5px] font-black text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                Tên cuốn sách <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Hiểu Đúng Về Cột Sống..."
                className="w-full h-10 px-3.5 rounded-[12px] bg-slate-50 dark:bg-[#1E113B] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-bold text-[14px] focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[12.5px] font-black text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                Năm xuất bản
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="VD: 2025"
                className="w-full h-10 px-3 rounded-[12px] bg-slate-50 dark:bg-[#1E113B] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-bold text-[14px] focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
              />
            </div>
          </div>

          {/* 2. BÌA SÁCH (TỶ LỆ 3:4) */}
          <div className="space-y-2 p-3.5 rounded-[16px] bg-slate-50/80 dark:bg-[#1C1037]/70 border border-slate-200/80 dark:border-purple-500/25">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-black text-slate-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                <span>Ảnh bìa cuốn sách (Tỷ lệ đứng 3:4)</span>
              </label>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl(null)}
                  className="text-[11.5px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                >
                  Xóa ảnh bìa
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              {/* Preview Bìa */}
              <div className="w-[100px] aspect-[3/4] rounded-[12px] bg-slate-200 dark:bg-[#251547] overflow-hidden shrink-0 shadow-md border border-slate-300 dark:border-purple-400/40 relative flex items-center justify-center">
                {coverUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverUrl} alt="Bìa sách" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                    <BookOpen size={24} />
                    <span className="text-[9px] font-bold mt-1">Chưa có ảnh</span>
                  </div>
                )}
                {/* Gáy sách bóng */}
                <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/25 to-transparent pointer-events-none" />
              </div>

              {/* Nút Upload & Nhập URL */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploadingCover}
                    onClick={() => coverInputRef.current?.click()}
                    className="flex-1 h-9 px-3 rounded-[10px] bg-[#1E3A8A] hover:bg-[#152a65] text-white text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isUploadingCover ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Đang tải ảnh lên...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={14} />
                        <span>Tải ảnh từ máy / điện thoại</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type="url"
                    value={coverUrl || ''}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Hoặc dán trực tiếp link ảnh (https://...)"
                    className="w-full h-8.5 px-3 rounded-[9px] bg-white dark:bg-[#130926] border border-slate-200 dark:border-purple-500/30 text-[12px] font-medium focus:outline-hidden focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. VIDEO YOUTUBE GIỚI THIỆU SÁCH */}
          <div className="space-y-2 p-3.5 rounded-[16px] bg-slate-50/80 dark:bg-[#1C1037]/70 border border-slate-200/80 dark:border-purple-500/25">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-black text-slate-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                <Film size={14} className="text-red-500" />
                <span>Link Video YouTube giới thiệu cuốn sách</span>
              </label>
              {youtubeUrl && (
                <button
                  type="button"
                  onClick={() => setYoutubeUrl('')}
                  className="text-[11.5px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                >
                  Xóa video
                </button>
              )}
            </div>

            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Dán link YouTube (VD: https://youtu.be/... hoặc shorts)"
              className="w-full h-9 px-3.5 rounded-[11px] bg-white dark:bg-[#130926] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-medium text-[12.5px] focus:outline-hidden focus:ring-2 focus:ring-red-500"
            />

            {detectedYtId ? (
              <div className="mt-2 rounded-[12px] overflow-hidden border border-slate-200 dark:border-purple-500/30">
                <YouTubeEmbed
                  youtubeId={detectedYtId}
                  title={`Video giới thiệu ${title || 'cuốn sách'}`}
                  showAdminTip={false}
                  showExternalLink={true}
                />
              </div>
            ) : youtubeUrl.trim() ? (
              <p className="text-[11.5px] text-amber-600 dark:text-amber-400 font-medium">
                ⚠️ Không nhận diện được video từ link này. Vui lòng kiểm tra lại đường dẫn YouTube.
              </p>
            ) : null}
          </div>

          {/* 4. MÔ TẢ CHI TIẾT */}
          <div className="space-y-1.5">
            <label className="block text-[12.5px] font-black text-slate-700 dark:text-purple-200 uppercase tracking-wide">
              Mô tả chi tiết cuốn sách
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Nhập nội dung tóm tắt, giá trị cốt lõi hoặc đối tượng độc giả..."
              className="w-full p-3 rounded-[12px] bg-slate-50 dark:bg-[#1E113B] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-medium text-[13px] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          {/* 5. ẢNH CÁC TRANG SÁCH BÊN TRONG (ĐỌC THỬ) */}
          <div className="space-y-2 p-3.5 rounded-[16px] bg-slate-50/80 dark:bg-[#1C1037]/70 border border-slate-200/80 dark:border-purple-500/25">
            <div className="flex items-center justify-between">
              <label className="text-[12.5px] font-black text-slate-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                <Images size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>Ảnh các trang đọc thử bên trong ({galleryImages.length} ảnh)</span>
              </label>
              {galleryImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => setGalleryImages([])}
                  className="text-[11.5px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                >
                  Xóa tất cả ảnh trang
                </button>
              )}
            </div>

            <p className="text-[11.5px] text-slate-500 dark:text-purple-300/70">
              Đăng tải ảnh chụp các trang hay nhất để độc giả lật trang đọc thử trực tiếp trong app.
            </p>

            {/* Danh sách ảnh hiện tại */}
            {galleryImages.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                {galleryImages.map((imgUrl, gIdx) => (
                  <div key={gIdx} className="relative aspect-[3/4] rounded-[10px] overflow-hidden border border-slate-300 dark:border-purple-400/40 group bg-slate-100 shadow-2xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Trang ${gIdx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemoveGalleryImage(gIdx)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-md"
                      title="Xóa trang này"
                    >
                      <Trash2 size={12} />
                    </button>
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-white text-[9.5px] font-black">
                      #{gIdx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Nút thêm ảnh trang */}
            <div className="pt-2">
              <input
                type="file"
                ref={galleryInputRef}
                onChange={handleGalleryFilesChange}
                accept="image/*"
                multiple
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploadingGallery}
                onClick={() => galleryInputRef.current?.click()}
                className="w-full h-9 rounded-[11px] border border-dashed border-[#1E3A8A]/50 dark:border-purple-400/50 bg-blue-50/50 dark:bg-purple-950/40 hover:bg-blue-100/60 text-[#1E3A8A] dark:text-purple-200 text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                {isUploadingGallery ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Đang tải các trang sách lên...</span>
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    <span>+ Tải thêm ảnh các trang sách (Chọn nhiều ảnh cùng lúc)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* FOOTER ACTIONS */}
        <div className="p-3.5 sm:p-4 border-t border-slate-100 dark:border-purple-500/20 bg-slate-50/90 dark:bg-[#180E33] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 rounded-[12px] bg-slate-200/90 hover:bg-slate-300 dark:bg-purple-950 dark:hover:bg-purple-900 text-slate-700 dark:text-purple-200 text-[13px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-10 px-5 rounded-[12px] bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] hover:from-[#152a65] hover:to-[#1d4ed8] text-white text-[13.5px] font-black flex items-center gap-2 shadow-md shadow-blue-900/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu Thay Đổi Cuốn Sách Này</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
