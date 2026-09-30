'use client';

import React, { useState } from 'react';
import { X, Save, Edit, Upload } from 'lucide-react';
import { Page } from '../../lib/types';
import { generateSlug } from '../../lib/slug';
import { uploadImageFile } from '../../lib/storageUpload';
import { savePageApi } from '../../lib/apiAdmin';

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page?: Page | null; // null nếu là tạo trang mới
  topicId: string;
  nextSortOrder?: number;
  onSaved: (page: Page) => void;
}

export default function EditPageModal({
  isOpen,
  onClose,
  page,
  topicId,
  nextSortOrder = 1,
  onSaved,
}: EditPageModalProps) {
  const isCreating = !page;

  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');
  const [summary, setSummary] = useState(page?.summary || '');
  const [coverUrl, setCoverUrl] = useState(page?.cover_url || '');
  const [status, setStatus] = useState<'published' | 'draft'>(page?.status || 'published');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isCreating) {
      setSlug(generateSlug(val));
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      setCoverUrl(res.url);
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh lên.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorMsg('Vui lòng nhập tiêu đề bài học.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn tĩnh (slug).');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const pageId = page?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `page-${Date.now()}`);
      const payload: Page = {
        id: pageId,
        workspace_id: 'default',
        topic_id: topicId,
        slug: slug.trim(),
        title: title.trim(),
        summary: summary.trim() || null,
        cover_url: coverUrl.trim() || null,
        sort_order: page?.sort_order ?? nextSortOrder,
        is_visible: page?.is_visible ?? true,
        status,
        access_mode: page?.access_mode || null,
      };

      const res = await savePageApi(payload);
      if (!res.success) {
        throw new Error(res.error || 'Chưa lưu được trang, thử lại');
      }

      onSaved(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Chưa lưu được trang, thử lại');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2 text-ink">
            <Edit size={20} className="text-primary" />
            <h3 className="text-[19px] font-extrabold">
              {isCreating ? 'Thêm trang nội dung mới' : 'Sửa thông tin bài học'}
            </h3>
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

        {/* Body */}
        <div className="p-5 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-[#FBE7E1] border border-[#F2B38A] text-[#7A2F12] text-[14px] font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Tiêu đề */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Tiêu đề bài học <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Nhập tiêu đề bài học..."
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[16px] text-ink font-bold focus:outline-hidden focus:border-primary"
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="tong-quan-ve-cot-song"
              className="w-full h-10 px-3.5 rounded-[12px] border border-line text-[14px] text-ink font-mono focus:border-primary"
            />
            <span className="text-[12px] text-muted">
              Đổi tên sau này không làm thay đổi đường dẫn đã chia sẻ.
            </span>
          </div>

          {/* Tóm tắt */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Tóm tắt ngắn (1–2 câu)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn nội dung bài học..."
              className="w-full p-3 rounded-[12px] border border-line text-[15px] text-ink leading-relaxed focus:outline-hidden focus:border-primary"
            />
          </div>

          {/* Ảnh bìa */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-ink">
                Ảnh bìa bài học (tùy chọn)
              </label>
              {coverUrl && (
                <button
                  type="button"
                  onClick={() => setCoverUrl('')}
                  className="text-[12px] font-bold text-red-600 hover:underline cursor-pointer"
                >
                  Gỡ ảnh bìa
                </button>
              )}
            </div>

            {/* Thumbnail xem trước nếu đã có ảnh */}
            {coverUrl && (
              <div className="flex items-center gap-3 p-2.5 rounded-[14px] bg-surface-2 border border-line">
                <div className="w-14 h-14 rounded-[10px] overflow-hidden bg-white border border-line shrink-0 shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt="Xem trước ảnh bìa bài học"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-bold text-ink block truncate">
                    Đã chọn ảnh bìa
                  </span>
                  <span className="text-[11px] text-muted block truncate font-mono">
                    {coverUrl}
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="Dán link ảnh hoặc tải từ máy..."
                className="flex-1 h-10 px-3 rounded-[12px] border border-line text-[14px] focus:border-primary"
              />
              <label className="flex items-center gap-1.5 h-10 px-3.5 rounded-[12px] bg-primary text-white font-bold text-[13px] cursor-pointer hover:bg-primary-hover shadow-xs transition-colors shrink-0">
                <Upload size={14} strokeWidth={2.5} />
                <span>{isUploading ? 'Đang tải...' : 'Chọn ảnh'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadCover}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Trạng thái xuất bản */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Trạng thái hiển thị
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`h-11 rounded-[12px] font-bold text-[14px] border transition-all cursor-pointer ${
                  status === 'published'
                    ? 'bg-[#E6F2EF] text-[#0A4F43] border-primary'
                    : 'bg-white border-line text-muted hover:border-line-strong'
                }`}
              >
                Đang hiện
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`h-11 rounded-[12px] font-bold text-[14px] border transition-all cursor-pointer ${
                  status === 'draft'
                    ? 'bg-[#FFF1E6] text-[#8A3A14] border-[#F2B38A]'
                    : 'bg-white border-line text-muted hover:border-line-strong'
                }`}
              >
                Bản nháp
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-line flex items-center justify-end gap-2.5 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="h-[44px] px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px] cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="flex items-center justify-center gap-1.5 h-[44px] px-5 rounded-[12px] bg-primary text-white font-extrabold text-[14px] shadow-sm cursor-pointer disabled:opacity-60"
          >
            <Save size={16} />
            <span>{isSaving ? 'Đang lưu...' : 'Lưu trang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
