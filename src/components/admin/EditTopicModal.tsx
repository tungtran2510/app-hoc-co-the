'use client';

import React, { useState } from 'react';
import { X, Save, Upload, Image as ImageIcon, Crop, Trash2, Eye, EyeOff } from 'lucide-react';
import { Topic } from '../../lib/types';
import { generateSlug } from '../../lib/slug';
import { uploadImageFile } from '../../lib/storageUpload';
import { saveTopicApi } from '../../lib/apiAdmin';
import { generateUuid, isValidUuid } from '../../lib/uuid';
import TopicIcon from '../TopicIcon';
import ImageCropModal from './ImageCropModal';

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
  onDelete?: (id: string, title: string) => void;
}

export default function EditTopicModal({
  topic,
  nextSortOrder = 1,
  onClose,
  onSaved,
  onDelete,
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
  const [isVisible, setIsVisible] = useState<boolean>(topic?.is_visible !== false);

  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
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

      const topicId = topic?.id && isValidUuid(topic.id) ? topic.id : generateUuid();
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
        is_visible: isVisible,
      };

      const res = await saveTopicApi(payload);
      if (!res.success) {
        throw new Error(res.error || 'Chưa lưu được chủ đề, thử lại');
      }

      onSaved(res.topic || payload);
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
              Ghi chú học tập (hiện ngay dưới chuyên đề)
            </label>
            <textarea
              value={metaNote}
              onChange={(e) => setMetaNote(e.target.value)}
              rows={2}
              maxLength={160}
              placeholder="Ví dụ: Nên học chuyên đề này đầu tiên vì nó giúp bạn hiểu nền tảng trước khi học các phần sau."
              className="w-full p-3 rounded-[12px] border border-line text-[14px] text-ink focus:border-primary"
            />
            <span className="text-[12px] text-muted">Hiển thị trong khung ghi chú, tối đa 2 dòng.</span>
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
                <div
                  onClick={() => setIsCropOpen(true)}
                  className="w-14 h-14 rounded-[10px] overflow-hidden bg-white border border-line shrink-0 shadow-2xs relative group cursor-pointer hover:border-amber-400"
                  title="Nhấn để cắt và chỉnh khung ảnh bìa"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt="Xem trước ảnh bìa"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Crop size={14} className="text-amber-300" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[12px] font-bold text-ink block truncate">
                    Đã chọn ảnh bìa (Chạm ảnh để cắt)
                  </span>
                  <span className="text-[11px] text-muted block truncate font-mono">
                    {coverUrl}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCropOpen(true)}
                  className="h-8 px-2.5 rounded-[8px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11.5px] flex items-center gap-1 cursor-pointer transition-colors shadow-2xs shrink-0"
                >
                  <Crop size={12} strokeWidth={2.5} />
                  <span>Cắt ảnh</span>
                </button>
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

          {/* Trạng thái hiển thị (Bật/Ẩn) */}
          <div className="flex items-center justify-between p-3.5 rounded-[14px] bg-slate-50 dark:bg-purple-950/20 border border-slate-200 dark:border-purple-800/30">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-[9px] flex items-center justify-center shrink-0 ${isVisible ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'}`}>
                {isVisible ? <Eye size={16} strokeWidth={2.4} /> : <EyeOff size={16} strokeWidth={2.4} />}
              </div>
              <div className="flex flex-col">
                <span className="text-[13.5px] font-bold text-slate-800 dark:text-white">
                  Trạng thái hiển thị
                </span>
                <span className="text-[11.5px] text-slate-500 dark:text-slate-400">
                  {isVisible ? 'Công khai – Học viên có thể thấy' : 'Đang ẩn – Chỉ quản trị viên nhìn thấy'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                isVisible ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-white/20'
              }`}
              title={isVisible ? 'Bấm để ẩn chuyên đề' : 'Bấm để hiển thị công khai'}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform absolute top-0.5 ${
                  isVisible ? 'left-6' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-line flex items-center justify-between gap-2.5 bg-surface">
          {topic && onDelete ? (
            <button
              type="button"
              onClick={() => {
                if (confirm(`Bạn có chắc chắn muốn xóa chủ đề "${topic.title}"?`)) {
                  onDelete(topic.id, topic.title);
                  onClose();
                }
              }}
              className="flex items-center gap-1.5 h-[42px] px-3.5 rounded-[12px] bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[13px] cursor-pointer transition-colors border border-red-200"
              title="Xóa chủ đề này khỏi hệ thống"
            >
              <Trash2 size={15} />
              <span>Xóa chủ đề</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-[42px] px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="flex items-center justify-center gap-1.5 h-[42px] px-5 rounded-[12px] bg-primary text-white font-extrabold text-[14px] shadow-sm cursor-pointer disabled:opacity-60"
            >
              <Save size={16} />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu chủ đề'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CẮT VÀ CĂN KHUNG ẢNH */}
      {isCropOpen && coverUrl && (
        <ImageCropModal
          isOpen={isCropOpen}
          imageUrl={coverUrl}
          title="Cắt & Căn Khung Ảnh Bìa Chủ Đề"
          defaultAspect="1:1"
          onClose={() => setIsCropOpen(false)}
          onCropSaved={async (newUrl) => {
            setCoverUrl(newUrl);
            setIsCropOpen(false);
          }}
        />
      )}
    </div>
  );
}
