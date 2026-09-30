'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  User,
  BookOpen,
  Plus,
  Trash2,
  Image as ImageIcon,
  Save,
  Loader2,
  Sliders,
  Film,
  PhoneCall,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
  Images,
} from 'lucide-react';
import { AuthorProfile, AuthorBook } from '../../lib/types';
import { uploadImageFile } from '../../lib/storageUpload';
import { saveSettingsApi } from '../../lib/apiAdmin';
import { normalizeAuthorProfile } from '../../lib/data';

interface EditAuthorModalProps {
  isOpen: boolean;
  initialProfile: AuthorProfile;
  initialTab?: 'author' | 'books' | 'contact' | 'extra';
  onClose: () => void;
  onSaved: (newProfile: AuthorProfile) => void;
}

export default function EditAuthorModal({
  isOpen,
  initialProfile,
  initialTab = 'author',
  onClose,
  onSaved,
}: EditAuthorModalProps) {
  const [activeTab, setActiveTab] = useState<'author' | 'books' | 'contact' | 'extra'>(initialTab);
  const [profile, setProfile] = useState<AuthorProfile>(() => normalizeAuthorProfile(initialProfile));
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingIntroImage, setIsUploadingIntroImage] = useState(false);
  const [uploadingBookId, setUploadingBookId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const introImageInputRef = useRef<HTMLInputElement>(null);
  const bookCoverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [activeBookForUpload, setActiveBookForUpload] = useState<string | null>(null);
  const [activeBookForGallery, setActiveBookForGallery] = useState<string | null>(null);
  const [uploadingGalleryBookId, setUploadingGalleryBookId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setProfile(normalizeAuthorProfile(initialProfile));
      setActiveTab(initialTab);
      setErrorMsg('');
    }
  }, [isOpen, initialProfile, initialTab]);

  if (!isOpen) return null;

  // Xử lý tải ảnh đại diện
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingAvatar(true);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      if (res && res.url) {
        setProfile((prev) => ({ ...prev, avatar_url: res.url }));
      } else {
        setErrorMsg('Chưa tải được ảnh đại diện lên kho lưu trữ.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh đại diện.');
    } finally {
      setIsUploadingAvatar(false);
      e.target.value = '';
    }
  };

  // Xử lý tải ảnh minh họa giới thiệu
  const handleIntroImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingIntroImage(true);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      if (res && res.url) {
        setProfile((prev) => ({ ...prev, intro_image_url: res.url }));
      } else {
        setErrorMsg('Chưa tải được ảnh minh họa lên kho lưu trữ.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh minh họa.');
    } finally {
      setIsUploadingIntroImage(false);
      e.target.value = '';
    }
  };

  // Xử lý tải ảnh bìa sách
  const handleBookCoverFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeBookForUpload) return;
    try {
      setUploadingBookId(activeBookForUpload);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      if (res && res.url) {
        setProfile((prev) => ({
          ...prev,
          books: prev.books.map((b) => (b.id === activeBookForUpload ? { ...b, cover_url: res.url } : b)),
        }));
      } else {
        setErrorMsg('Chưa tải được ảnh bìa sách.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh bìa sách.');
    } finally {
      setUploadingBookId(null);
      setActiveBookForUpload(null);
      e.target.value = '';
    }
  };

  // Xử lý tải ảnh trang sách (Gallery)
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
        setProfile((prev) => ({
          ...prev,
          books: prev.books.map((b) =>
            b.id === activeBookForGallery
              ? {
                  ...b,
                  gallery_images: [...(b.gallery_images || []), ...uploadedUrls],
                }
              : b
          ),
        }));
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
    setProfile((prev) => ({
      ...prev,
      books: prev.books.map((b) =>
        b.id === bookId
          ? {
              ...b,
              gallery_images: (b.gallery_images || []).filter((_, i) => i !== imgIdx),
            }
          : b
      ),
    }));
  };

  // Thêm sách mới
  const handleAddBook = () => {
    const newBook: AuthorBook = {
      id: `book-${Date.now()}`,
      title: 'Tên sách mới',
      cover_url: null,
      description: 'Mô tả ngắn gọn về cuốn sách hoặc nội dung chính.',
      year: new Date().getFullYear().toString(),
      youtube_url: '',
      gallery_images: [],
    };
    setProfile((prev) => ({ ...prev, books: [...prev.books, newBook] }));
  };

  // Cập nhật thông tin từng cuốn sách
  const handleUpdateBook = (id: string, patch: Partial<AuthorBook>) => {
    setProfile((prev) => ({
      ...prev,
      books: prev.books.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    }));
  };

  // Xóa sách
  const handleDeleteBook = (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này khỏi danh sách?')) return;
    setProfile((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== id),
    }));
  };

  // Lưu cấu hình
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = normalizeAuthorProfile(profile);
    if (!normalized.name.trim()) {
      setErrorMsg('Vui lòng nhập tên tác giả / chuyên gia.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const res = await saveSettingsApi({
        author_profile: normalized,
      });

      if (res.success) {
        onSaved(normalized);
        onClose();
      } else {
        setErrorMsg(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div>
            <h3 className="text-[19px] font-extrabold text-ink leading-tight">
              Cài đặt khối giới thiệu & Sách
            </h3>
            <p className="text-[13px] text-muted">
              Hiển thị ở chân trang tổng quan trang chủ
            </p>
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

        {/* 4 Tabs điều hướng */}
        <div className="grid grid-cols-4 border-b border-line bg-surface p-1.5 gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('author')}
            className={`h-10 rounded-[10px] text-[12px] sm:text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'author'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <User size={14} />
            <span>Tác giả</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('books')}
            className={`h-10 rounded-[10px] text-[12px] sm:text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'books'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <BookOpen size={14} />
            <span>Sách ({profile.books?.length || 0})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`h-10 rounded-[10px] text-[12px] sm:text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'contact'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <PhoneCall size={14} />
            <span>Liên hệ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('extra')}
            className={`h-10 rounded-[10px] text-[12px] sm:text-[13px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1 ${
              activeTab === 'extra'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            <Sparkles size={14} />
            <span>Triết lý</span>
          </button>
        </div>

        {/* Ẩn input file */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarFileChange}
          className="hidden"
        />
        <input
          ref={introImageInputRef}
          type="file"
          accept="image/*"
          onChange={handleIntroImageFileChange}
          className="hidden"
        />
        <input
          ref={bookCoverInputRef}
          type="file"
          accept="image/*"
          onChange={handleBookCoverFileChange}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryFilesChange}
          className="hidden"
        />

        {/* Form Body cuộn */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[14px] font-bold">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: THÔNG TIN TÁC GIẢ */}
          {activeTab === 'author' && (
            <div className="flex flex-col gap-4">
              {/* Ảnh tác giả / Logo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Ảnh tác giả / Logo (không khung tròn)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-[12px] flex items-center justify-center overflow-hidden shrink-0 border border-line bg-surface">
                    {profile.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile.avatar_url}
                        alt="Avatar/Logo"
                        className="w-full h-full object-cover rounded-[12px]"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary-soft rounded-[12px] flex items-center justify-center">
                        <User size={30} className="text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-[10px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary cursor-pointer shadow-2xs"
                    >
                      {isUploadingAvatar ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-primary" />
                          <span>Đang nén & tải ảnh...</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={14} className="text-primary" />
                          <span>Chọn ảnh tác giả / logo mới</span>
                        </>
                      )}
                    </button>
                    {profile.avatar_url && (
                      <button
                        type="button"
                        onClick={() => setProfile({ ...profile, avatar_url: null })}
                        className="text-[12px] text-red-600 font-bold hover:underline text-left cursor-pointer"
                      >
                        Xóa ảnh (dùng icon mặc định)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tên tác giả */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Tên tác giả / Chuyên gia
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Ví dụ: Bác sĩ Nguyễn Văn A"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink font-bold focus:border-primary"
                  required
                />
              </div>

              {/* Chức danh / Lĩnh vực */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Chức danh / Định vị ngắn
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  placeholder="Ví dụ: Chuyên gia Phục hồi Cột sống & Tác giả sách"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary"
                />
              </div>

              {/* Mô tả chi tiết giới thiệu */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Mô tả chi tiết / Lời giới thiệu bản thân
                </label>
                <textarea
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Đôi lời chia sẻ về hành trình, kinh nghiệm và giá trị mang đến cho người học..."
                  className="w-full p-3 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary leading-relaxed"
                />
              </div>

              {/* Ảnh minh họa thêm (tùy chọn) */}
              <div className="flex flex-col gap-1.5 pt-2 border-t border-line">
                <label className="text-[14px] font-bold text-ink">
                  Ảnh minh họa thêm (chứng chỉ / hoạt động)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={profile.intro_image_url || ''}
                    onChange={(e) => setProfile({ ...profile, intro_image_url: e.target.value })}
                    placeholder="URL ảnh hoặc bấm tải lên..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => introImageInputRef.current?.click()}
                    disabled={isUploadingIntroImage}
                    className="flex items-center justify-center gap-1 h-10 px-3 rounded-[10px] bg-surface-2 text-ink text-[13px] font-bold hover:bg-surface border border-line shrink-0 cursor-pointer"
                  >
                    {isUploadingIntroImage ? (
                      <Loader2 size={14} className="animate-spin text-primary" />
                    ) : (
                      <ImageIcon size={14} className="text-primary" />
                    )}
                    <span>Tải ảnh</span>
                  </button>
                </div>
              </div>

              {/* Link video giới thiệu (YouTube) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                  <Film size={15} className="text-primary" />
                  <span>Link video giới thiệu (YouTube)</span>
                </label>
                <input
                  type="text"
                  value={profile.intro_video_url || ''}
                  onChange={(e) => setProfile({ ...profile, intro_video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full h-10 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary"
                />
                <span className="text-[12px] text-muted">
                  Dán đường dẫn video YouTube giới thiệu về bạn hoặc lớp học.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: QUẢN LÝ SÁCH ĐÃ LÀM */}
          {activeTab === 'books' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[15px] font-extrabold text-ink">
                    Các sách đã phát hành
                  </h4>
                  <p className="text-[12px] text-muted">
                    Bấm vào từng cuốn để xem chi tiết & video giới thiệu (không có nút mua)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBook}
                  className="flex items-center gap-1 h-9 px-3 rounded-[10px] bg-primary-soft text-primary font-bold text-[13px] hover:bg-primary-soft/80 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Thêm sách</span>
                </button>
              </div>

              {profile.books.length === 0 ? (
                <div className="p-6 text-center rounded-[16px] bg-surface-2 border border-dashed border-line text-muted">
                  <BookOpen size={32} className="mx-auto mb-2 text-muted" />
                  <p className="text-[14px] font-bold">Chưa có cuốn sách nào</p>
                  <p className="text-[12px]">Bấm nút &quot;+ Thêm sách&quot; để thêm tác phẩm bạn đã làm.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {profile.books.map((book, idx) => (
                    <div
                      key={book.id}
                      className="p-3.5 rounded-[16px] bg-surface border border-line flex flex-col gap-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-extrabold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                          Sách #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteBook(book.id)}
                          className="w-7 h-7 rounded-full text-red-500 hover:bg-red-50 flex items-center justify-center cursor-pointer"
                          title="Xóa cuốn sách này"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {/* Tên sách & Năm */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 flex flex-col gap-1">
                          <label className="text-[12px] font-bold text-ink">
                            Tên sách
                          </label>
                          <input
                            type="text"
                            value={book.title}
                            onChange={(e) => handleUpdateBook(book.id, { title: e.target.value })}
                            placeholder="Ví dụ: Hiểu Đúng Về Cột Sống"
                            className="w-full h-9 px-2.5 rounded-[8px] border border-line text-[14px] text-ink font-bold focus:border-primary"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[12px] font-bold text-ink">
                            Năm
                          </label>
                          <input
                            type="text"
                            value={book.year || ''}
                            onChange={(e) => handleUpdateBook(book.id, { year: e.target.value })}
                            placeholder="2025"
                            className="w-full h-9 px-2.5 rounded-[8px] border border-line text-[14px] text-ink focus:border-primary text-center"
                          />
                        </div>
                      </div>

                      {/* Bìa sách */}
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-14 rounded-[8px] bg-surface-2 border border-line overflow-hidden shrink-0 flex items-center justify-center">
                          {book.cover_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={book.cover_url}
                              alt="Bìa"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen size={16} className="text-muted" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveBookForUpload(book.id);
                              bookCoverInputRef.current?.click();
                            }}
                            disabled={uploadingBookId === book.id}
                            className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-[8px] bg-white border border-line text-ink font-bold text-[12px] hover:border-primary cursor-pointer shadow-2xs"
                          >
                            {uploadingBookId === book.id ? (
                              <>
                                <Loader2 size={12} className="animate-spin text-primary" />
                                <span>Đang nén & tải ảnh...</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon size={12} className="text-primary" />
                                <span>Tải ảnh bìa sách</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Mô tả ngắn */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-ink">
                          Mô tả tóm tắt nội dung sách
                        </label>
                        <textarea
                          rows={2}
                          value={book.description}
                          onChange={(e) => handleUpdateBook(book.id, { description: e.target.value })}
                          placeholder="Tóm tắt ngắn gọn nội dung cuốn sách..."
                          className="w-full p-2 rounded-[8px] border border-line text-[13px] text-ink focus:border-primary"
                        />
                      </div>

                      {/* Link video YouTube về cuốn sách */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[12px] font-bold text-ink flex items-center gap-1">
                          <Film size={13} className="text-primary" />
                          <span>Link video YouTube giới thiệu sách</span>
                        </label>
                        <input
                          type="text"
                          value={book.youtube_url || ''}
                          onChange={(e) => handleUpdateBook(book.id, { youtube_url: e.target.value })}
                          placeholder="https://www.youtube.com/watch?v=..."
                          className="w-full h-8 px-2.5 rounded-[8px] border border-line text-[13px] text-ink focus:border-primary"
                        />
                      </div>

                      {/* Quản lý ảnh bên trong cuốn sách (Gallery) */}
                      <div className="pt-2 border-t border-line/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[12px] font-bold text-ink flex items-center gap-1.5">
                            <Images size={13} className="text-primary" />
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
                                <span>Tải ảnh trang sách</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Danh sách ảnh trang sách đã tải lên */}
                        {book.gallery_images && book.gallery_images.length > 0 ? (
                          <div className="flex gap-2 overflow-x-auto py-1">
                            {book.gallery_images.map((imgUrl, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="relative w-14 aspect-[3/4] rounded-[8px] bg-surface-2 border border-line overflow-hidden shrink-0 group shadow-2xs"
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
                                  className="absolute top-0.5 right-0.5 w-4.5 h-4.5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow-sm opacity-90 hover:opacity-100 transition-opacity"
                                  title="Xóa ảnh này"
                                >
                                  <X size={10} strokeWidth={3} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11.5px] text-muted italic">
                            Chưa có ảnh chụp trang sách. Bấm &quot;Tải ảnh trang sách&quot; để thêm ảnh minh họa bên trong.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: THÔNG TIN LIÊN HỆ & KẾT NỐI */}
          {activeTab === 'contact' && (
            <div className="flex flex-col gap-4">
              <div className="p-3 bg-primary-soft/50 rounded-[14px] border border-primary/20 flex flex-col gap-1 text-[13px] text-ink">
                <span className="font-extrabold text-primary flex items-center gap-1.5">
                  <PhoneCall size={14} />
                  <span>Kênh kết nối trực tiếp với người học</span>
                </span>
                <p className="text-muted text-[12px] leading-relaxed">
                  Các thông tin này sẽ hiển thị thành nút gọi điện và nhắn tin Zalo tiện lợi ở chân trang để người học có thể kết nối ngay với bạn.
                </p>
              </div>

              {/* Số điện thoại / Hotline */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <Phone size={14} className="text-primary" />
                  <span>Số điện thoại / Hotline tư vấn</span>
                </label>
                <input
                  type="tel"
                  value={profile.phone || ''}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="Ví dụ: 0988.123.456"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary font-medium"
                />
              </div>

              {/* Link Zalo hoặc SĐT Zalo */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#0068FF] text-white flex items-center justify-center text-[10px] font-extrabold">Z</span>
                  <span>Link Zalo hoặc Số điện thoại Zalo</span>
                </label>
                <input
                  type="text"
                  value={profile.zalo_url || ''}
                  onChange={(e) => setProfile({ ...profile, zalo_url: e.target.value })}
                  placeholder="Ví dụ: https://zalo.me/0988123456 hoặc 0988123456"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary font-medium"
                />
              </div>

              {/* Email liên hệ */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <Mail size={14} className="text-primary" />
                  <span>Email liên hệ</span>
                </label>
                <input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="Ví dụ: chuyengia@gmail.com"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary font-medium"
                />
              </div>

              {/* Link Facebook */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <Globe size={14} className="text-primary" />
                  <span>Link Facebook / Trang cá nhân</span>
                </label>
                <input
                  type="url"
                  value={profile.facebook_url || ''}
                  onChange={(e) => setProfile({ ...profile, facebook_url: e.target.value })}
                  placeholder="Ví dụ: https://facebook.com/trantunghoa"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary font-medium"
                />
              </div>

              {/* Địa chỉ phòng khám / làm việc */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  <span>Địa chỉ phòng khám / văn phòng</span>
                </label>
                <input
                  type="text"
                  value={profile.address || ''}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  placeholder="Ví dụ: Hà Nội & TP. Hồ Chí Minh"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary font-medium"
                />
              </div>

              {/* Lời nhắn kết nối */}
              <div className="flex flex-col gap-1.5 pt-1 border-t border-line/60">
                <label className="text-[13px] font-bold text-ink">
                  Lời nhắn kết nối / Ghi chú tư vấn
                </label>
                <textarea
                  rows={2}
                  value={profile.contact_note || ''}
                  onChange={(e) => setProfile({ ...profile, contact_note: e.target.value })}
                  placeholder="Ví dụ: Mọi thắc mắc về lộ trình phục hồi, vui lòng kết nối trực tiếp với chuyên gia..."
                  className="w-full p-3 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: TRIẾT LÝ PHỤNG SỰ & LỜI NHẮN GỬI */}
          {activeTab === 'extra' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Tiêu đề khung (mặc định: Triết lý phụng sự)
                </label>
                <input
                  type="text"
                  value={profile.extra_title || ''}
                  onChange={(e) => setProfile({ ...profile, extra_title: e.target.value })}
                  placeholder="Ví dụ: Triết lý phụng sự"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink font-bold focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Nội dung triết lý / Lời nhắn gửi
                </label>
                <textarea
                  rows={4}
                  value={profile.extra_content || ''}
                  onChange={(e) => setProfile({ ...profile, extra_content: e.target.value })}
                  placeholder="Nhập nội dung lời nhắn gửi của bạn gửi tới người học..."
                  className="w-full p-3 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* Nút lưu */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line mt-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px] cursor-pointer hover:bg-surface"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingAvatar || isUploadingIntroImage}
              className="flex items-center justify-center gap-1.5 h-11 px-5 rounded-[12px] bg-primary text-white font-extrabold text-[14px] shadow-sm cursor-pointer hover:bg-primary-dark disabled:opacity-50"
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
        </form>
      </div>
    </div>
  );
}
