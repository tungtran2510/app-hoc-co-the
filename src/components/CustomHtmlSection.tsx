'use client';

import React, { useState } from 'react';
import { Upload, Trash2, X, Code, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { CustomHtmlBlockData } from '../lib/types';
import { uploadImageFile } from '../lib/storageUpload';
import { sanitizeHtml } from './blocks/TextBlock';
import SectionOrderControls from './admin/SectionOrderControls';

export function CustomHtmlContent({ data }: { data: CustomHtmlBlockData }) {
  const lines = (data.text || '').split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className="w-full flex flex-col gap-3 text-slate-900 dark:text-white">
      {data.title ? (
        <h3 className="text-[19px] font-extrabold tracking-tight m-0 text-slate-900 dark:text-white">{data.title}</h3>
      ) : null}
      {data.images && data.images.length > 0 && (
        <div className="flex flex-col gap-2.5">
          {data.images.map((img, i) => (
            <figure key={i} className="m-0 rounded-[14px] overflow-hidden border border-slate-200 dark:border-white/15 bg-white dark:bg-[#111827]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.caption || ''} className="w-full h-auto block" />
              {img.caption ? (
                <figcaption className="px-3 py-2 text-[13px] text-slate-600 dark:text-slate-300">{img.caption}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      )}
      {lines.length > 0 && (
        <div className="flex flex-col gap-2 text-[16px] leading-relaxed text-slate-800 dark:text-slate-100">
          {lines.map((l, i) => (
            <p key={i} className="m-0">{l}</p>
          ))}
        </div>
      )}
      {data.html ? (
        <div
          className="w-full overflow-hidden text-[16px] leading-relaxed qbiz-custom-html-block"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(data.html) }}
        />
      ) : null}
    </div>
  );
}

interface ModalProps {
  initial: CustomHtmlBlockData;
  onClose: () => void;
  onSave: (data: CustomHtmlBlockData) => Promise<void> | void;
  onDelete?: () => void;
}

export function CustomHtmlModal({ initial, onClose, onSave, onDelete }: ModalProps) {
  const [title, setTitle] = useState(initial.title || '');
  const [images, setImages] = useState(initial.images || []);
  const [text, setText] = useState(initial.text || '');
  const [html, setHtml] = useState(initial.html || '');
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const added: { url: string; caption?: string }[] = [];
      for (const f of Array.from(files)) {
        const res = await uploadImageFile(f);
        added.push({ url: res.url });
      }
      setImages((prev) => [...prev, ...added]);
    } catch (err: any) {
      alert(err?.message || 'Lỗi tải ảnh');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        title: title.trim() || undefined,
        images: images.length > 0 ? images : undefined,
        text: text.trim() || undefined,
        html: html.trim() || undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    'w-full px-3 py-2.5 rounded-[12px] border border-slate-300 dark:border-white/20 bg-white dark:bg-[#0B132B] text-slate-900 dark:text-white text-[15px] focus:outline-none focus:border-[#0068FF]';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4">
      <div className="w-full max-w-[520px] max-h-[92vh] bg-white dark:bg-[#111827] text-slate-900 dark:text-white rounded-t-[24px] sm:rounded-[24px] flex flex-col overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2 font-bold text-[16px]">
            <Code size={18} /> Khối tùy biến (Ảnh · Văn bản · HTML)
          </div>
          <button type="button" onClick={onClose} className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center" aria-label="Đóng">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-4 overflow-y-auto">
          <label className="flex flex-col gap-1">
            <span className="text-[13.5px] font-bold">Tiêu đề (tùy chọn)</span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} placeholder="VD: Giới thiệu" />
          </label>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[13.5px] font-bold flex items-center gap-1"><ImageIcon size={14} /> Ảnh</span>
              <label className="flex items-center gap-1 h-8 px-3 rounded-[8px] bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[12.5px] font-bold cursor-pointer">
                <Upload size={13} /> {uploading ? 'Đang tải...' : 'Tải ảnh lên'}
                <input type="file" accept="image/*" multiple className="hidden" disabled={uploading} onChange={(e) => { handleUpload(e.target.files); e.target.value = ''; }} />
              </label>
            </div>
            {images.map((img, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-[12px] border border-slate-200 dark:border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt="" className="w-14 h-14 object-cover rounded-[8px] shrink-0" />
                <input
                  value={img.caption || ''}
                  onChange={(e) => setImages(images.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
                  placeholder="Chú thích (tùy chọn)"
                  className={inputCls + ' !py-2 text-[14px]'}
                />
                <button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} className="w-8 h-8 shrink-0 rounded-full text-red-600 flex items-center justify-center" aria-label="Xóa ảnh">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-[13.5px] font-bold">Văn bản thường (mỗi dòng 1 đoạn)</span>
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} className={inputCls} placeholder="Nhập nội dung chữ..." />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[13.5px] font-bold flex items-center justify-between">
              <span>Mã HTML</span>
              <button type="button" onClick={(e) => { e.preventDefault(); setPreview(!preview); }} className="flex items-center gap-1 text-[12px] font-bold px-2 py-0.5 rounded-[6px] border border-slate-300 dark:border-white/20">
                {preview ? <EyeOff size={12} /> : <Eye size={12} />} {preview ? 'Ẩn xem trước' : 'Xem trước'}
              </button>
            </span>
            <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={6} className={inputCls + ' font-mono text-[13.5px]'} placeholder="<div>Dán mã HTML tại đây...</div>" />
          </label>

          {preview && (
            <div className="p-3 rounded-[12px] border border-dashed border-slate-400 dark:border-white/30">
              <CustomHtmlContent data={{ title: title.trim() || undefined, images, text, html }} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 p-4 border-t border-slate-200 dark:border-white/10">
          {onDelete && (
            <button type="button" onClick={onDelete} className="h-11 px-4 rounded-[12px] border border-red-300 text-red-600 font-bold text-[14px]">Xóa khối</button>
          )}
          <button type="button" onClick={onClose} className="h-11 px-4 rounded-[12px] bg-slate-100 dark:bg-white/10 font-bold text-[14px] ml-auto">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving || uploading} className="h-11 px-5 rounded-[12px] bg-[#0068FF] text-white font-bold text-[14px] disabled:opacity-60">
            {saving ? 'Đang lưu...' : 'Lưu khối'}
          </button>
        </div>
      </div>
    </div>
  );
}

interface SectionProps {
  data: CustomHtmlBlockData;
  isAdmin: boolean;
  isHidden: boolean;
  sectionIndex: number;
  totalSections: number;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onOpenReorderModal: () => void;
  onEdit: () => void;
}

export default function CustomHtmlSection({ data, isAdmin, isHidden, sectionIndex, totalSections, onToggleVisibility, onMoveUp, onMoveDown, onOpenReorderModal, onEdit }: SectionProps) {
  const empty = !data.title && !data.html && !data.text && !(data.images && data.images.length);
  if (empty && !isAdmin) return null;
  return (
    <section className="flex flex-col gap-2 mt-1">
      {isAdmin && (
        <SectionOrderControls
          sectionTitle="KHỐI TÙY BIẾN"
          sectionIndex={sectionIndex}
          totalSections={totalSections}
          isHidden={isHidden}
          onToggleVisibility={onToggleVisibility}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onOpenReorderModal={onOpenReorderModal}
          onEdit={onEdit}
          editLabel="Sửa khối"
        />
      )}
      {empty ? (
        <div className="p-4 rounded-[14px] border border-dashed border-slate-400 dark:border-white/30 text-[14px] text-slate-600 dark:text-slate-300">
          Khối tùy biến đang trống – bấm "Sửa khối" để thêm ảnh, văn bản hoặc HTML.
        </div>
      ) : (
        <CustomHtmlContent data={data} />
      )}
    </section>
  );
}
