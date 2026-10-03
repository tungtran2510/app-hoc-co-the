'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  FileCheck,
  Check,
  Trash2,
  Link as LinkIcon,
  FileText,
  Bookmark,
  Layers,
  Sparkles,
} from 'lucide-react';
import { MedicalDocument } from '../MedicalDocumentsTab';

interface EditMedicalDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: MedicalDocument | null;
  onSave: (savedDoc: MedicalDocument) => void;
  onDelete?: (docId: string) => void;
}

export default function EditMedicalDocumentModal({
  isOpen,
  onClose,
  document: initialDoc,
  onSave,
  onDelete,
}: EditMedicalDocumentModalProps) {
  const isNew = !initialDoc;

  const [title, setTitle] = useState('');
  const [badge, setBadge] = useState('PDF Y KHOA');
  const [format, setFormat] = useState('PDF Sách Y Khoa');
  const [size, setSize] = useState('393 KB (14 trang)');
  const [pages, setPages] = useState<number>(14);
  const [source, setSource] = useState('Bộ Y Tế & Atlas Y Khoa');
  const [pdfUrl, setPdfUrl] = useState('/documents/atlas_giai_phau_cot_song_toan_dien.pdf');
  const [imageUrl, setImageUrl] = useState('');
  const [txtUrl, setTxtUrl] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialDoc) {
        setTitle(initialDoc.title || '');
        setBadge(initialDoc.badge || 'PDF Y KHOA');
        setFormat(initialDoc.format || 'PDF Sách Y Khoa');
        setSize(initialDoc.size || '393 KB (14 trang)');
        setPages(initialDoc.pages || 14);
        setSource(initialDoc.source || 'Bộ Y Tế & Atlas Y Khoa');
        setPdfUrl(initialDoc.pdfUrl || '');
        setImageUrl(initialDoc.imageUrl || '');
        setTxtUrl(initialDoc.txtUrl || '');
        setDescription(initialDoc.description || '');
      } else {
        setTitle('');
        setBadge('PDF Y KHOA');
        setFormat('PDF Sách Y Khoa');
        setSize('Khoảng 500 KB');
        setPages(10);
        setSource('Tủ Sách Y Khoa Qbiz Books');
        setPdfUrl('/documents/atlas_giai_phau_cot_song_toan_dien.pdf');
        setImageUrl('');
        setTxtUrl('');
        setDescription('');
      }
    }
  }, [isOpen, initialDoc]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Vui lòng nhập tiêu đề tài liệu.');
      return;
    }

    const badgeColors: Record<string, string> = {
      'PDF Y KHOA': 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      'BẢNG TRA CỨU': 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
      'HƯỚNG DẪN THỰC HÀNH': 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      'CẨM NANG Y HỌC': 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
    };

    const docId = initialDoc?.id || `custom-doc-${Date.now()}`;

    const saved: MedicalDocument = {
      id: docId,
      title: trimmedTitle,
      badge: badge.trim() || 'PDF Y KHOA',
      badgeColor: badgeColors[badge.trim()] || 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      description: description.trim() || 'Tài liệu hướng dẫn & tài liệu thực chứng y khoa chuyên sâu.',
      format: format.trim() || 'Tài liệu PDF',
      pages: Number(pages) || 1,
      size: size.trim() || 'PDF chuẩn',
      source: source.trim() || 'Qbiz Books',
      pdfUrl: pdfUrl.trim() || '/documents/atlas_giai_phau_cot_song_toan_dien.pdf',
      imageUrl: imageUrl.trim() || undefined,
      txtUrl: txtUrl.trim() || undefined,
      content: initialDoc?.content || {
        overview: description.trim() || 'Tài liệu hướng dẫn & giải phẫu ứng dụng y khoa.',
        sections: [
          {
            heading: '1. Nội dung tài liệu',
            paragraphs: [description.trim() || 'Xem chi tiết trong tệp tài liệu PDF đính kèm bên dưới.'],
          },
        ],
        clinicalAdvice: ['Áp dụng kiến thức bài học vào thực tiễn chăm sóc sức khỏe chủ động.'],
      },
    };

    onSave(saved);
    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title || 'này'}" không?`)) {
      if (onDelete && initialDoc?.id) {
        onDelete(initialDoc.id);
        onClose();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] max-h-[92vh] flex flex-col rounded-[22px] bg-white dark:bg-[#160D30] text-slate-900 dark:text-white border border-slate-200 dark:border-purple-800/60 shadow-2xl overflow-hidden"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-purple-900/40 bg-slate-50/70 dark:bg-purple-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-purple-100 text-purple-900 dark:bg-[#F8DF7B] dark:text-[#160C2C] flex items-center justify-center shrink-0 shadow-2xs">
              <FileCheck size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[16px] font-black leading-tight">
                {isNew ? 'Thêm tài liệu mới vào bài học' : 'Chỉnh sửa tài liệu y khoa'}
              </h3>
              <span className="text-[11.5px] text-muted block">
                {isNew ? 'Bổ sung tài liệu tham khảo cho học viên' : 'Sửa tiêu đề, link tải file PDF và thông số'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200 dark:hover:bg-white/10 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nội dung Form */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
          {/* 1. Tiêu đề tài liệu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
              <FileText size={13} className="text-purple-700 dark:text-[#F8DF7B]" />
              <span>Tiêu đề tài liệu <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Atlas & Cẩm Nang Giải Phẫu Cột Sống..."
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-bold shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* 2. Huy hiệu phân loại & Định dạng */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
                <Bookmark size={13} className="text-purple-700 dark:text-[#F8DF7B]" />
                <span>Huy hiệu</span>
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="h-9 px-2 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-bold shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              >
                <option value="PDF Y KHOA">PDF Y KHOA</option>
                <option value="BẢNG TRA CỨU">BẢNG TRA CỨU</option>
                <option value="HƯỚNG DẪN THỰC HÀNH">HƯỚNG DẪN THỰC HÀNH</option>
                <option value="CẨM NANG Y HỌC">CẨM NANG Y HỌC</option>
                <option value="TÀI LIỆU CHUẨN">TÀI LIỆU CHUẨN</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
                <Layers size={13} className="text-purple-700 dark:text-[#F8DF7B]" />
                <span>Số trang</span>
              </label>
              <input
                type="number"
                value={pages}
                onChange={(e) => setPages(parseInt(e.target.value, 10) || 1)}
                min={1}
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-bold shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 3. Đường dẫn file PDF / Tải về */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
              <LinkIcon size={13} className="text-purple-700 dark:text-[#F8DF7B]" />
              <span>Đường dẫn File PDF / Tải về</span>
            </label>
            <input
              type="text"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              placeholder="/documents/ten_file.pdf hoặc https://..."
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-mono shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
            />
          </div>

          {/* 4. Định dạng & Dung lượng hiển thị */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Định dạng
              </label>
              <input
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="Ví dụ: PDF Sách Y Khoa"
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-medium shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Dung lượng hiển thị
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Ví dụ: 393 KB (14 trang)"
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-medium shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 5. Nguồn tài liệu & Ảnh HD tùy chọn */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Nguồn tài liệu
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Bộ Y Tế & Atlas..."
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-medium shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Ảnh HD (tùy chọn)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="/documents/anh.png"
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-mono shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 6. Mô tả tóm tắt tài liệu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
              Mô tả ngắn gọn nội dung tài liệu
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tổng quan chi tiết cấu trúc tài liệu, đối tượng học viên..."
              rows={2}
              className="p-2.5 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-normal shadow-2xs focus:border-purple-600 dark:focus:border-amber-400 focus:outline-hidden resize-none"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-purple-900/40 bg-slate-50/70 dark:bg-purple-950/40 flex items-center justify-between gap-2">
          {!isNew && onDelete ? (
            <button
              type="button"
              onClick={handleDelete}
              className="h-9 px-3 rounded-[10px] bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800/50 flex items-center gap-1.5 text-[12px] font-bold cursor-pointer shadow-2xs hover:bg-red-100"
              title="Xóa tài liệu này"
            >
              <Trash2 size={13} />
              <span>Xóa</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 text-slate-700 dark:text-purple-200 text-[12px] font-bold hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 h-9 px-4 rounded-[10px] bg-purple-900 text-white hover:bg-purple-950 dark:bg-[#F8DF7B] dark:text-[#160C2C] dark:hover:bg-amber-300 text-[12.5px] font-black cursor-pointer shadow-xs transition-colors"
            >
              <Check size={14} strokeWidth={2.5} />
              <span>{isNew ? 'Thêm tài liệu' : 'Lưu tài liệu'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
