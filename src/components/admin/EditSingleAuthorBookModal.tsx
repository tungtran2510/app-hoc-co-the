'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  BookOpen,
  Image as ImageIcon,
  Images,
  Save,
  Loader2,
  Film,
  Check,
  Plus,
  Trash2,
  Crop,
  Link2,
} from 'lucide-react';
import { AuthorBook } from '../../lib/types';
import { uploadImageFile } from '../../lib/storageUpload';
import { extractYouTubeId } from '../../lib/youtube';
import YouTubeEmbed from '../YouTubeEmbed';
import BookFlipbookAdminSection from './BookFlipbookAdminSection';
import ImageCropModal, { AspectRatioOption } from './ImageCropModal';
import { useImageAspectRatio } from '../../lib/imageAspectRatio';

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
  const [flipbookPages, setFlipbookPages] = useState<string[]>([]);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [singleGalleryUrl, setSingleGalleryUrl] = useState('');
  const [showCoverUrlInput, setShowCoverUrlInput] = useState(false);
  const [showGalleryUrlInput, setShowGalleryUrlInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  // Quản lý Modal Cắt Khung Ảnh
  const [cropModalData, setCropModalData] = useState<{
    isOpen: boolean;
    url: string;
    title: string;
    aspect: AspectRatioOption;
    target: 'cover' | { galleryIndex: number };
  } | null>(null);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const { dimensions: coverDimensions } = useImageAspectRatio(coverUrl);

  useEffect(() => {
    if (isOpen && book) {
      setTitle(book.title || '');
      setYear(book.year || '');
      setDescription(book.description || '');
      setCoverUrl(book.cover_url || null);
      setYoutubeUrl(book.youtube_url || '');
      setGalleryImages(Array.isArray(book.gallery_images) ? [...book.gallery_images] : []);
      setFlipbookPages(Array.isArray(book.flipbook_pages) ? [...book.flipbook_pages] : []);
      setFileUrl(book.file_url || null);
      setFileName(book.file_name || null);
      setPdfUrl(book.pdf_url || null);
      setSingleGalleryUrl('');
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

  // Upload nhiều ảnh chụp thực tế cuốn sách (gallery_images)
  const handleGalleryFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      setErrorMsg('');
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadImageFile(file);
        if (res && res.url) {
          newUrls.push(res.url);
        }
      }
      if (newUrls.length > 0) {
        setGalleryImages((prev) => [...prev, ...newUrls]);
        setSuccessNotice(`✓ Đã thêm ${newUrls.length} ảnh vào bộ ảnh chụp thực tế cuốn sách!`);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh chụp sách.');
    } finally {
      setIsUploadingGallery(false);
      e.target.value = '';
    }
  };

  const handleAddSingleGalleryUrl = () => {
    const trimmed = singleGalleryUrl.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      setErrorMsg('URL ảnh không hợp lệ. Vui lòng nhập link bắt đầu bằng https:// hoặc /');
      return;
    }
    setGalleryImages((prev) => [...prev, trimmed]);
    setSingleGalleryUrl('');
    setSuccessNotice('✓ Đã thêm 1 ảnh từ URL vào bộ ảnh chụp sách.');
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
        gallery_images: galleryImages.filter(Boolean),
        flipbook_pages: flipbookPages.filter(Boolean),
        file_url: fileUrl ? fileUrl.trim() : null,
        file_name: fileName ? fileName.trim() : null,
        pdf_url: pdfUrl ? pdfUrl.trim() : (fileUrl?.toLowerCase().endsWith('.pdf') ? fileUrl.trim() : null),
      };

      await onSaved(updatedBook);
      setSuccessNotice('✓ Đã lưu thành công cuốn sách!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi lưu sách.');
    } finally {
      setIsSaving(false);
    }
  };

  const detectedYtId = youtubeUrl ? extractYouTubeId(youtubeUrl) : null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#160D2D] rounded-[24px] border border-slate-200/90 dark:border-purple-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[94vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL TINH GỌN */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-purple-500/20 bg-gradient-to-r from-slate-50 via-purple-50/30 to-white dark:from-[#211142] dark:to-[#160D2D] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-[10px] bg-purple-900 text-amber-300 flex items-center justify-center shadow-xs shrink-0">
              <BookOpen size={18} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-[16px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  Cài Đặt Sách: {title || book.title}
                </h3>
                <span className="px-2 py-0.5 rounded-[6px] bg-amber-100 text-amber-900 border border-amber-300 dark:bg-purple-900/60 dark:text-purple-200 text-[10px] font-black uppercase shrink-0">
                  Tác giả
                </span>
              </div>
              <p className="text-[11.5px] text-slate-500 dark:text-purple-200/70 truncate">
                Chỉnh sửa thông tin, bìa sách 3:4, video và tệp đọc thử 3D
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-slate-600 dark:text-purple-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* THÔNG BÁO LỖI / THÀNH CÔNG */}
        {errorMsg && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-200 text-red-700 text-[12.5px] font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg('')} className="text-red-500 font-bold ml-2">×</button>
          </div>
        )}
        {successNotice && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-[12.5px] font-bold flex items-center gap-2">
            <Check size={15} className="text-emerald-600" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* FORM NỘI DUNG CUỘN */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-slate-800 dark:text-purple-100 text-[13px]">
          {/* KHỐI 1: THÔNG TIN CƠ BẢN TINH GỌN */}
          <div className="space-y-2.5 p-3 rounded-[16px] bg-slate-50/80 dark:bg-[#1A0E35]/60 border border-slate-200/80 dark:border-purple-500/20">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
              <div className="sm:col-span-3 space-y-1">
                <label className="block text-[12px] font-black text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                  Tên cuốn sách <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Hiểu Đúng Về Cột Sống..."
                  className="w-full h-9.5 px-3 rounded-[10px] bg-white dark:bg-[#120824] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-bold text-[13.5px] focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[12px] font-black text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                  Năm xuất bản
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="VD: 2025"
                  className="w-full h-9.5 px-3 rounded-[10px] bg-white dark:bg-[#120824] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-bold text-[13.5px] focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[12px] font-black text-slate-700 dark:text-purple-200 uppercase tracking-wide">
                Mô tả tóm tắt nội dung cuốn sách
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Nhập nội dung tóm tắt, giá trị cốt lõi hoặc đối tượng độc giả..."
                className="w-full p-2.5 rounded-[10px] bg-white dark:bg-[#120824] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-medium text-[12.5px] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* KHỐI 2: ẢNH BÌA & VIDEO YOUTUBE (GỌN 2 CỘT) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Cột 1: Ảnh bìa sách (Tỷ lệ 3:4 & Cắt khung) */}
            <div className="p-3 rounded-[16px] bg-slate-50/80 dark:bg-[#1A0E35]/60 border border-slate-200/80 dark:border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-black text-slate-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-amber-600 dark:text-[#F8DF7B]" />
                  <span>Ảnh bìa (Tỷ lệ 3:4)</span>
                </label>
                <div className="flex items-center gap-2">
                  {coverUrl && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setCropModalData({
                            isOpen: true,
                            url: coverUrl,
                            title: 'Cắt Khung Ảnh Bìa Sách',
                            aspect: '3:4',
                            target: 'cover',
                          })
                        }
                        className="text-[11px] text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        title="Cắt chỉnh khung ảnh bìa"
                      >
                        <Crop size={12} strokeWidth={2.5} />
                        <span>Cắt ảnh</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setCoverUrl(null)}
                        className="text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                      >
                        Xóa bìa
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Vùng xem trước ảnh bìa - Nhấn vào để cắt ảnh */}
                <div
                  onClick={() => {
                    if (coverUrl) {
                      setCropModalData({
                        isOpen: true,
                        url: coverUrl,
                        title: 'Cắt Khung Ảnh Bìa Sách',
                        aspect: '3:4',
                        target: 'cover',
                      });
                    } else {
                      coverInputRef.current?.click();
                    }
                  }}
                  className={`w-[70px] aspect-[3/4] rounded-[10px] bg-slate-200 dark:bg-[#251547] overflow-hidden shrink-0 shadow-xs border border-slate-300 dark:border-purple-400/40 relative flex items-center justify-center group cursor-pointer ${
                    coverUrl ? 'hover:border-amber-400' : ''
                  }`}
                  title={coverUrl ? 'Nhấn để cắt và chỉnh khung ảnh bìa' : 'Nhấn để chọn ảnh từ máy'}
                >
                  {coverUrl ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={coverUrl} alt="Bìa sách" className="w-full h-full object-cover" />
                      {/* Lớp phủ hover cắt ảnh */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-0.5 text-white">
                        <Crop size={15} strokeWidth={2.5} className="text-amber-300" />
                        <span className="text-[8px] font-black uppercase text-amber-300">Cắt ảnh</span>
                      </div>
                      {/* Badge tỷ lệ tự động nhận diện */}
                      {coverDimensions && (
                        <div className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/75 text-amber-300 font-black text-[7.5px] uppercase">
                          {coverDimensions.label.split(' ')[0]}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-1 text-center text-slate-400 group-hover:text-purple-600 transition-colors">
                      <BookOpen size={18} />
                      <span className="text-[8.5px] font-bold mt-0.5">Tải ảnh</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={isUploadingCover}
                      onClick={() => coverInputRef.current?.click()}
                      className="flex-1 h-8 px-2.5 rounded-[9px] bg-purple-900 hover:bg-purple-950 text-white text-[11.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingCover ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={12} />
                          <span>Tải ảnh bìa từ máy</span>
                        </>
                      )}
                    </button>

                    {/* Nút Cắt ảnh nhanh nếu đã có ảnh */}
                    {coverUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setCropModalData({
                            isOpen: true,
                            url: coverUrl,
                            title: 'Cắt Khung Ảnh Bìa Sách',
                            aspect: '3:4',
                            target: 'cover',
                          })
                        }
                        className="h-8 px-2.5 rounded-[9px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-xs"
                        title="Kéo trượt cắt khung vừa ý"
                      >
                        <Crop size={12} strokeWidth={2.5} />
                        <span>Cắt</span>
                      </button>
                    )}
                  </div>

                  {/* Nút thu gọn / mở ô dán link URL để không làm lộ URL dài thô */}
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowCoverUrlInput(!showCoverUrlInput)}
                      className="text-[10.5px] text-slate-500 dark:text-purple-300 hover:text-purple-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Link2 size={11} />
                      <span>{showCoverUrlInput ? 'Ẩn ô dán link' : 'Hoặc dán link URL ảnh'}</span>
                    </button>
                  </div>

                  {showCoverUrlInput && (
                    <input
                      type="url"
                      value={coverUrl || ''}
                      onChange={(e) => setCoverUrl(e.target.value)}
                      placeholder="Dán link URL ảnh bìa https://..."
                      className="w-full h-7.5 px-2.5 rounded-[8px] bg-white dark:bg-[#120824] border border-slate-200 dark:border-purple-500/30 text-[11px] font-medium focus:outline-hidden focus:ring-1 focus:ring-purple-500 animate-in fade-in duration-150"
                    />
                  )}
                </div>
              </div>

              {/* NGAY DƯỚI ẢNH BÌA: CÁC KHUNG CHO "HÌNH ẢNH CỦA SÁCH" */}
              <div className="pt-2.5 border-t border-slate-200/80 dark:border-purple-500/20 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11.5px] font-black text-slate-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                    <Images size={13} className="text-emerald-600 dark:text-emerald-400" />
                    <span>Hình ảnh của sách ({galleryImages.length} ảnh)</span>
                  </label>
                  {galleryImages.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setGalleryImages([])}
                      className="text-[10.5px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>

                <p className="text-[10.5px] text-slate-500 dark:text-purple-300/70 leading-tight">
                  Chạm vào ảnh để kéo trượt cắt khung vừa ý
                </p>

                {/* Input file chọn nhiều ảnh chụp sách */}
                <input
                  type="file"
                  ref={galleryInputRef}
                  onChange={handleGalleryFilesChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                {/* Dãy các khung ảnh dưới ảnh bìa: Tự động nhận diện & Cắt ảnh khi bấm */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  {galleryImages.map((imgUrl, gIdx) => (
                    <div
                      key={gIdx}
                      onClick={() =>
                        setCropModalData({
                          isOpen: true,
                          url: imgUrl,
                          title: `Cắt Ảnh #${gIdx + 1} Của Sách`,
                          aspect: 'auto',
                          target: { galleryIndex: gIdx },
                        })
                      }
                      className="relative w-12 h-16 sm:w-13 sm:h-17 aspect-[3/4] rounded-[8px] overflow-hidden border border-slate-300 dark:border-purple-400/40 bg-slate-100 dark:bg-purple-950/40 shadow-2xs group shrink-0 cursor-pointer hover:border-amber-400 transition-all"
                      title={`Nhấn vào ảnh #${gIdx + 1} để kéo trượt cắt khung`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imgUrl}
                        alt={`Ảnh sách ${gIdx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Nút cắt & xóa nổi khi hover */}
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCropModalData({
                              isOpen: true,
                              url: imgUrl,
                              title: `Cắt Ảnh #${gIdx + 1} Của Sách`,
                              aspect: 'auto',
                              target: { galleryIndex: gIdx },
                            });
                          }}
                          className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-xs"
                          title="Cắt ảnh này"
                        >
                          <Crop size={11} strokeWidth={2.5} />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGalleryImages(galleryImages.filter((_, idx) => idx !== gIdx));
                          }}
                          className="w-5 h-5 rounded-full bg-red-600/90 text-white flex items-center justify-center hover:scale-110 transition-transform cursor-pointer shadow-xs"
                          title="Xóa ảnh này"
                        >
                          <X size={11} strokeWidth={2.5} />
                        </button>
                      </div>
                      <span className="absolute bottom-0.5 left-0.5 px-1 py-0.2 rounded bg-black/75 text-white text-[8px] font-black leading-none pointer-events-none">
                        #{gIdx + 1}
                      </span>
                    </div>
                  ))}

                  {/* Nút thêm ảnh: Khung nhỏ nét đứt dấu + */}
                  <button
                    type="button"
                    disabled={isUploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="w-12 h-16 sm:w-13 sm:h-17 aspect-[3/4] rounded-[8px] border-2 border-dashed border-amber-500/40 hover:border-amber-500 dark:border-purple-400/40 dark:hover:border-purple-300 bg-amber-50/40 hover:bg-amber-100/50 dark:bg-purple-950/30 text-amber-800 dark:text-purple-200 flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                    title="Thêm ảnh chụp thực tế cuốn sách"
                  >
                    {isUploadingGallery ? (
                      <Loader2 size={13} className="animate-spin text-amber-600" />
                    ) : (
                      <>
                        <Plus size={15} strokeWidth={2.5} />
                        <span className="text-[8px] font-black uppercase text-center leading-none">Thêm ảnh</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Nút chọn ảnh từ máy & dán URL */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <button
                    type="button"
                    disabled={isUploadingGallery}
                    onClick={() => galleryInputRef.current?.click()}
                    className="h-6.5 px-2 rounded-[6px] bg-slate-200 hover:bg-slate-300 dark:bg-purple-900/60 dark:hover:bg-purple-800 text-slate-800 dark:text-purple-100 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Plus size={11} />
                    <span>Chọn ảnh từ máy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowGalleryUrlInput(!showGalleryUrlInput)}
                    className="text-[10px] text-slate-500 dark:text-purple-300 hover:text-purple-600 font-bold flex items-center gap-0.5 cursor-pointer ml-auto"
                  >
                    <Link2 size={10} />
                    <span>{showGalleryUrlInput ? 'Ẩn URL' : 'Dán URL'}</span>
                  </button>
                </div>

                {showGalleryUrlInput && (
                  <input
                    type="url"
                    value={singleGalleryUrl}
                    onChange={(e) => setSingleGalleryUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSingleGalleryUrl();
                      }
                    }}
                    placeholder="Dán link ảnh + Enter..."
                    className="w-full h-6.5 px-2 rounded-[6px] bg-white dark:bg-[#120824] border border-slate-200 dark:border-purple-500/30 text-[10.5px] font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-purple-500 animate-in fade-in duration-150"
                  />
                )}
              </div>
            </div>

            {/* Cột 2: Video YouTube giới thiệu */}
            <div className="p-3 rounded-[16px] bg-slate-50/80 dark:bg-[#1A0E35]/60 border border-slate-200/80 dark:border-purple-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[12px] font-black text-slate-800 dark:text-purple-200 uppercase tracking-wide flex items-center gap-1.5">
                  <Film size={14} className="text-red-500" />
                  <span>Video YouTube giới thiệu</span>
                </label>
                {youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => setYoutubeUrl('')}
                    className="text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
                  >
                    Xóa video
                  </button>
                )}
              </div>

              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="Dán link YouTube (VD: https://youtu.be/...)"
                className="w-full h-8 px-2.5 rounded-[8px] bg-white dark:bg-[#120824] border border-slate-200 dark:border-purple-500/30 text-slate-900 dark:text-white font-medium text-[11.5px] focus:outline-hidden focus:ring-1 focus:ring-red-500"
              />

              {detectedYtId ? (
                <div className="rounded-[10px] overflow-hidden border border-slate-200 dark:border-purple-500/30 max-h-[90px]">
                  <YouTubeEmbed
                    youtubeId={detectedYtId}
                    title={`Video ${title || 'cuốn sách'}`}
                    showAdminTip={false}
                    showExternalLink={false}
                  />
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 dark:text-purple-300/60 italic">
                  Tùy chọn: Nhập link YouTube để hiển thị video giới thiệu trực tiếp cho cuốn sách.
                </p>
              )}
            </div>
          </div>

          {/* KHỐI 3: TÀI LIỆU XEM THỬ 3D (FLIPBOOK) - Ở PHẦN DƯỚI CỦA HÌNH ẢNH SÁCH */}
          <BookFlipbookAdminSection
            bookTitle={title || book.title}
            coverUrl={coverUrl}
            flipbookPages={flipbookPages}
            onChangeFlipbookPages={setFlipbookPages}
            fileUrl={fileUrl}
            fileName={fileName}
            onChangeFile={(newUrl, newName) => {
              setFileUrl(newUrl);
              setFileName(newName);
              if (newUrl?.toLowerCase().endsWith('.pdf')) {
                setPdfUrl(newUrl);
              }
            }}
            onSetCoverUrlIfNotSet={(firstPageUrl) => {
              if (!coverUrl) setCoverUrl(firstPageUrl);
            }}
          />
        </form>

        {/* FOOTER ACTIONS TINH GỌN */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-100 dark:border-purple-500/20 bg-slate-50/90 dark:bg-[#180E33] flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-9 px-4 rounded-[10px] bg-slate-200/90 hover:bg-slate-300 dark:bg-purple-950 dark:hover:bg-purple-900 text-slate-700 dark:text-purple-200 text-[12.5px] font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="h-9 px-5 rounded-[10px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-[13px] flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Save size={15} />
                <span>Lưu Thay Đổi Cuốn Sách Này</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* MODAL CẮT VÀ CĂN KHUNG ẢNH */}
      {cropModalData && (
        <ImageCropModal
          isOpen={cropModalData.isOpen}
          imageUrl={cropModalData.url}
          title={cropModalData.title}
          defaultAspect={cropModalData.aspect}
          onClose={() => setCropModalData(null)}
          onCropSaved={async (newUrl) => {
            if (cropModalData.target === 'cover') {
              setCoverUrl(newUrl);
              setSuccessNotice('✓ Đã cắt và cập nhật ảnh bìa sách thành công!');
            } else {
              const idx = cropModalData.target.galleryIndex;
              setGalleryImages((prev) => {
                const next = [...prev];
                next[idx] = newUrl;
                return next;
              });
              setSuccessNotice(`✓ Đã cắt và cập nhật ảnh #${idx + 1} của cuốn sách!`);
            }
            setCropModalData(null);
          }}
        />
      )}
    </div>
  );
}
