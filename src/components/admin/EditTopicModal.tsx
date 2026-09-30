'use client';

import React, { useState } from 'react';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { Topic } from '../../lib/types';
import { generateSlug } from '../../lib/slug';
import { uploadImageFile } from '../../lib/storageUpload';
import { saveTopicApi } from '../../lib/apiAdmin';
import TopicIcon from '../TopicIcon';

const AVAILABLE_ICONS = [
  { key: 'spine', label: 'Cột sống' },
  { key: 'bowl', label: 'Dinh dưỡng' },
  { key: 'droplet', label: 'Nước' },
  { key: 'stomach', label: 'Tiêu hóa' },
  { key: 'body', label: 'Cơ thể người' },
  { key: 'molecule', label: 'Nội tiết' },
  { key: 'liver', label: 'Gan mật' },
  { key: 'shield', label: 'Miễn dịch' },
];

const PRESET_COLORS = [
  { bg: '#E3ECF7', fg: '#2D5B94' },
  { bg: '#F6E7D3', fg: '#8A4F10' },
  { bg: '#DDF0F6', fg: '#1F6E8C' },
  { bg: '#F4E1DF', fg: '#9B3B32' },
  { bg: '#E9E4F3', fg: '#5A4A8A' },
  { bg: '#F3EFD2', fg: '#6B5C0E' },
  { bg: '#E6EEDD', fg: '#4E6B2A' },
  { bg: '#E0EDEB', fg: '#2F6B63' },
];

interface EditTopicModalProps {
  topic?: Topic | null; // null nếu là tạo mới
  nextSortOrder?: number;
  onClose: () => void;
  onSaved: (topic: Topic) => void;
}

export default function EditTopicModal({
  topic,
  nextSortOrder = 1,
  onClose,
  onSaved,
}: EditTopicModalProps) {
  const isCreating = !topic;

  const [title, setTitle] = useState(topic?.title || '');
  const [slug, setSlug] = useState(topic?.slug || '');
  const [description, setDescription] = useState(topic?.description || '');
  const [metaNote, setMetaNote] = useState(topic?.meta_note || '');
  const [colorBg, setColorBg] = useState(topic?.color_bg || '#E3ECF7');
  const [colorFg, setColorFg] = useState(topic?.color_fg || '#2D5B94');
  const [icon, setIcon] = useState(topic?.icon || 'body');
  const [coverUrl, setCoverUrl] = useState(topic?.cover_url || '');

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isCreating) {
      setSlug(generateSlug(val));
    }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setErrorMsg('Vui lòng nhập tên chủ đề.');
      return;
    }
    if (!slug.trim()) {
      setErrorMsg('Vui lòng nhập đường dẫn (slug).');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const topicId = topic?.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `topic-${Date.now()}`);
      const payload: Topic = {
        id: topicId,
        workspace_id: 'default',
        slug: slug.trim(),
        title: title.trim(),
        description: description.trim() || null,
        meta_note: metaNote.trim() || null,
        cover_url: coverUrl.trim() || null,
        icon,
        color_bg: colorBg,
        color_fg: colorFg,
        sort_order: topic?.sort_order ?? nextSortOrder,
        is_visible: topic?.is_visible ?? true,
      };

      const res = await saveTopicApi(payload);
      if (!res.success) {
        throw new Error(res.error || 'Chưa lưu được chủ đề, thử lại');
      }

      onSaved(payload);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Chưa lưu được chủ đề, thử lại');
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div>
            <h3 className="text-[19px] font-extrabold text-ink leading-tight">
              {isCreating ? 'Thêm chủ đề mới' : 'Chỉnh sửa chủ đề'}
            </h3>
            <p className="text-[13px] text-muted leading-tight">
              {isCreating ? 'Tạo mới một chuyên mục sức khỏe' : 'Cập nhật thông tin chuyên đề'}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-[#FBE7E1] border border-[#F2B38A] text-[#7A2F12] text-[14px] font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Tên chủ đề */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Tên chủ đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Ví dụ: Cột sống, Dinh dưỡng, Nước..."
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[16px] text-ink font-semibold focus:border-primary"
              autoFocus
            />
          </div>

          {/* Đường dẫn Slug */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Đường dẫn tĩnh (Slug)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="cot-song"
              className="w-full h-10 px-3.5 rounded-[12px] border border-line text-[14px] text-ink font-mono focus:border-primary"
            />
            <span className="text-[12px] text-muted">
              Đổi tên sau này không làm thay đổi đường dẫn đã chia sẻ.
            </span>
          </div>

          {/* Mô tả */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Mô tả ngắn
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Hiểu cấu tạo và chăm sóc hằng ngày..."
              className="w-full p-3 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary"
            />
          </div>

          {/* Ghi chú thời lượng / meta */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Ghi chú nhanh
            </label>
            <input
              type="text"
              value={metaNote}
              onChange={(e) => setMetaNote(e.target.value)}
              placeholder="Ví dụ: Mỗi video 4–6 phút"
              className="w-full h-10 px-3.5 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary"
            />
          </div>

          {/* Biểu tượng (Icon) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Biểu tượng (Icon)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {AVAILABLE_ICONS.map((ic) => (
                <button
                  key={ic.key}
                  type="button"
                  onClick={() => setIcon(ic.key)}
                  className={`flex flex-col items-center justify-center p-2 rounded-[14px] border transition-all cursor-pointer ${
                    icon === ic.key
                      ? 'border-primary bg-primary-soft text-primary font-bold'
                      : 'border-line bg-surface text-ink hover:border-line-strong'
                  }`}
                >
                  <TopicIcon name={ic.key} size={24} />
                  <span className="text-[11px] mt-1 line-clamp-1">{ic.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Màu sắc */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Màu sắc chủ đạo
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((col, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setColorBg(col.bg);
                    setColorFg(col.fg);
                  }}
                  className={`w-9 h-9 rounded-full border-2 transition-transform cursor-pointer ${
                    colorBg === col.bg ? 'scale-110 border-primary' : 'border-white'
                  }`}
                  style={{ backgroundColor: col.bg }}
                />
              ))}
            </div>
          </div>

          {/* Ảnh bìa */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[14px] font-bold text-ink">
                Ảnh bìa chủ đề (tùy chọn)
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
                    alt="Xem trước ảnh bìa"
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
                  onChange={handleUploadImage}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
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
            <span>{isSaving ? 'Đang lưu...' : 'Lưu chủ đề'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
