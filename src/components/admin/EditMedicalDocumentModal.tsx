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
  FileSpreadsheet,
  BookOpen,
  Image as ImageIcon,
} from 'lucide-react';
import { MedicalDocument, DocumentFormatType } from '../MedicalDocumentsTab';

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
  const [badge, setBadge] = useState('TÀI LIỆU Y KHOA');
  const [format, setFormat] = useState('PDF Giáo Trình Chuẩn');
  const [fileType, setFileType] = useState<DocumentFormatType>('pdf');
  const [size, setSize] = useState('531 KB');
  const [pages, setPages] = useState<number>(10);
  const [source, setSource] = useState('Tủ Sách Y Khoa Qbiz Books');
  const [fileUrl, setFileUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [txtUrl, setTxtUrl] = useState('');
  const [description, setDescription] = useState('');
  const [overview, setOverview] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialDoc) {
        setTitle(initialDoc.title || '');
        setBadge(initialDoc.badge || 'TÀI LIỆU Y KHOA');
        setFormat(initialDoc.format || 'PDF Giáo Trình Chuẩn');
        setFileType(initialDoc.fileType || (initialDoc.fileUrl?.endsWith('.docx') ? 'docx' : initialDoc.fileUrl?.endsWith('.epub') ? 'epub' : initialDoc.imageUrl ? 'image' : 'pdf'));
        setSize(initialDoc.size || '531 KB');
        setPages(initialDoc.pages || 10);
        setSource(initialDoc.source || 'Tủ Sách Y Khoa Qbiz Books');
        setFileUrl(initialDoc.fileUrl || initialDoc.pdfUrl || '');
        setImageUrl(initialDoc.imageUrl || '');
        setTxtUrl(initialDoc.txtUrl || '');
        setDescription(initialDoc.description || '');
        setOverview(initialDoc.content?.overview || initialDoc.description || '');
      } else {
        setTitle('');
        setBadge('TÀI LIỆU Y KHOA');
        setFormat('PDF Giáo Trình Chuẩn');
        setFileType('pdf');
        setSize('Khoảng 500 KB');
        setPages(10);
        setSource('Tủ Sách Y Khoa Qbiz Books');
        setFileUrl('/documents/giao_trinh_y_khoa_tong_quan.pdf');
        setImageUrl('');
        setTxtUrl('');
        setDescription('');
        setOverview('');
      }
    }
  }, [isOpen, initialDoc]);

  if (!isOpen) return null;

  // Khi đổi định dạng, gợi ý format và fileType phù hợp
  const handleFileTypeChange = (type: DocumentFormatType) => {
    setFileType(type);
    if (type === 'docx') {
      setFormat('File Word (.docx)');
      setBadge('FILE WORD DOCX');
      if (!fileUrl || fileUrl.endsWith('.pdf')) setFileUrl('/documents/cam_nang_dinh_duong_nen_tang.docx');
    } else if (type === 'epub') {
      setFormat('Ebook EPUB');
      setBadge('EBOOK EPUB');
      if (!fileUrl || fileUrl.endsWith('.pdf') || fileUrl.endsWith('.docx')) setFileUrl('/documents/ebook_giai_phau_va_dinh_duong.epub');
    } else if (type === 'image') {
      setFormat('Bản Ảnh HD');
      setBadge('BẢNG TRA CỨU');
      if (!imageUrl) setImageUrl('/documents/bang_tra_cuu_re_than_kinh_cot_song.png');
    } else if (type === 'text') {
      setFormat('Bản Đọc Y Khoa');
      setBadge('BẢN ĐỌC CHUẨN');
    } else {
      setFormat('PDF Giáo Trình Chuẩn');
      setBadge('PDF Y KHOA');
      if (!fileUrl || fileUrl.endsWith('.docx') || fileUrl.endsWith('.epub')) setFileUrl('/documents/so_tay_nuoc_va_dien_giai.pdf');
    }
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('Vui lòng nhập tiêu đề tài liệu.');
      return;
    }

    const badgeColors: Record<string, string> = {
      'PDF Y KHOA': 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      'TÀI LIỆU Y KHOA': 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
      'FILE WORD DOCX': 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800',
      'EBOOK EPUB': 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
      'BẢNG TRA CỨU': 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/80 dark:text-teal-300 dark:border-teal-800',
      'HƯỚNG DẪN THỰC HÀNH': 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      'CẨM NANG Y HỌC': 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
      'BẢN ĐỌC CHUẨN': 'bg-sky-100 text-sky-900 border-sky-300 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800',
    };

    const docId = initialDoc?.id || `custom-doc-${Date.now()}`;
    const cleanUrl = fileUrl.trim();

    const saved: MedicalDocument = {
      id: docId,
      title: trimmedTitle,
      badge: badge.trim() || 'TÀI LIỆU Y KHOA',
      badgeColor: badgeColors[badge.trim()] || 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
      description: description.trim() || 'Tài liệu hướng dẫn & tài liệu thực chứng y khoa chuyên sâu.',
      format: format.trim() || (fileType === 'docx' ? 'File Word DOCX' : fileType === 'epub' ? 'Ebook EPUB' : 'File PDF Chuẩn'),
      fileType: fileType,
      pages: Number(pages) || 1,
      size: size.trim() || 'Tài liệu chuẩn',
      source: source.trim() || 'Qbiz Books',
      fileUrl: cleanUrl || undefined,
      pdfUrl: cleanUrl.endsWith('.pdf') ? cleanUrl : initialDoc?.pdfUrl || undefined,
      imageUrl: imageUrl.trim() || undefined,
      txtUrl: txtUrl.trim() || undefined,
      content: initialDoc?.content || {
        overview: overview.trim() || description.trim() || 'Tài liệu hướng dẫn & giải phẫu ứng dụng y khoa.',
        sections: [
          {
            heading: '1. Nội dung tài liệu y khoa',
            paragraphs: [description.trim() || 'Xem chi tiết trong tệp tài liệu đính kèm bên dưới.'],
          },
        ],
        clinicalAdvice: ['Áp dụng kiến thức bài học vào thực tiễn chăm sóc sức khỏe chủ động.'],
      },
    };

    // Nếu người dùng sửa phần tổng quan
    if (overview.trim() && saved.content) {
      saved.content.overview = overview.trim();
    }

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
            <div className="w-8 h-8 rounded-[10px] bg-blue-100 text-blue-900 dark:bg-[#F8DF7B] dark:text-[#160C2C] flex items-center justify-center shrink-0 shadow-2xs">
              <FileCheck size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[16px] font-black leading-tight">
                {isNew ? 'Thêm tài liệu mới vào bài học' : 'Chỉnh sửa tài liệu y khoa'}
              </h3>
              <span className="text-[11.5px] text-muted block">
                {isNew ? 'Hỗ trợ file PDF, Word DOCX, Ebook EPUB, Ảnh HD, Văn bản' : 'Sửa tiêu đề, link tải file thật và thông số'}
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
          {/* 1. Chọn Định Dạng File Thật */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
              Định dạng tệp tài liệu:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleFileTypeChange('pdf')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer ${
                  fileType === 'pdf'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-slate-50 dark:bg-purple-950/40 text-slate-700 dark:text-purple-200 border-slate-200 dark:border-purple-800/40 hover:bg-slate-100'
                }`}
              >
                <FileText size={13} />
                <span>File PDF</span>
              </button>

              <button
                type="button"
                onClick={() => handleFileTypeChange('docx')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer ${
                  fileType === 'docx'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-slate-50 dark:bg-purple-950/40 text-slate-700 dark:text-purple-200 border-slate-200 dark:border-purple-800/40 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet size={13} />
                <span>Word (.docx)</span>
              </button>

              <button
                type="button"
                onClick={() => handleFileTypeChange('epub')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer ${
                  fileType === 'epub'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-slate-50 dark:bg-purple-950/40 text-slate-700 dark:text-purple-200 border-slate-200 dark:border-purple-800/40 hover:bg-slate-100'
                }`}
              >
                <BookOpen size={13} />
                <span>Ebook (.epub)</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5 mt-1">
              <button
                type="button"
                onClick={() => handleFileTypeChange('image')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer ${
                  fileType === 'image'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-slate-50 dark:bg-purple-950/40 text-slate-700 dark:text-purple-200 border-slate-200 dark:border-purple-800/40 hover:bg-slate-100'
                }`}
              >
                <ImageIcon size={13} />
                <span>Ảnh HD / Sơ đồ</span>
              </button>

              <button
                type="button"
                onClick={() => handleFileTypeChange('text')}
                className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-[10px] text-[12px] font-bold border transition-all cursor-pointer ${
                  fileType === 'text'
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-xs'
                    : 'bg-slate-50 dark:bg-purple-950/40 text-slate-700 dark:text-purple-200 border-slate-200 dark:border-purple-800/40 hover:bg-slate-100'
                }`}
              >
                <FileText size={13} />
                <span>Bản đọc y khoa</span>
              </button>
            </div>
          </div>

          {/* 2. Tiêu đề tài liệu */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
              <FileText size={13} className="text-blue-700 dark:text-[#F8DF7B]" />
              <span>Tiêu đề tài liệu <strong className="text-red-500">*</strong></span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Sổ Tay Thực Hành Nước & Điện Giải..."
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-bold shadow-2xs focus:border-blue-600 focus:outline-hidden"
              autoFocus
            />
          </div>

          {/* 3. Đường dẫn file thật (PDF, DOCX, EPUB...) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
              <LinkIcon size={13} className="text-blue-700 dark:text-[#F8DF7B]" />
              <span>Đường dẫn tệp file thật ({fileType.toUpperCase()})</span>
            </label>
            <input
              type="text"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="/documents/ten_file.pdf hoặc .docx hoặc https://..."
              className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-mono shadow-2xs focus:border-blue-600 focus:outline-hidden"
            />
            <span className="text-[11px] text-muted">
              Đường dẫn nội bộ trong /documents/... hoặc liên kết Google Drive, Supabase Storage
            </span>
          </div>

          {/* 4. Huy hiệu phân loại & Dung lượng */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
                <Bookmark size={13} className="text-blue-700 dark:text-[#F8DF7B]" />
                <span>Huy hiệu</span>
              </label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="h-9 px-2 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-bold shadow-2xs focus:border-blue-600 focus:outline-hidden"
              >
                <option value="TÀI LIỆU Y KHOA">TÀI LIỆU Y KHOA</option>
                <option value="FILE WORD DOCX">FILE WORD DOCX</option>
                <option value="EBOOK EPUB">EBOOK EPUB</option>
                <option value="BẢNG TRA CỨU">BẢNG TRA CỨU</option>
                <option value="HƯỚNG DẪN THỰC HÀNH">HƯỚNG DẪN THỰC HÀNH</option>
                <option value="CẨM NANG Y HỌC">CẨM NANG Y HỌC</option>
                <option value="BẢN ĐỌC CHUẨN">BẢN ĐỌC CHUẨN</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200 flex items-center gap-1.5">
                <Layers size={13} className="text-blue-700 dark:text-[#F8DF7B]" />
                <span>Dung lượng / Số trang</span>
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="531 KB hoặc 12 trang"
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[13px] font-bold shadow-2xs focus:border-blue-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* 5. Nguồn tài liệu & Ảnh HD */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
                Nguồn tài liệu
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="Qbiz Books / Bộ Y Tế..."
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-medium shadow-2xs focus:border-blue-600 focus:outline-hidden"
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
                className="h-9 px-3 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-mono shadow-2xs focus:border-blue-600 focus:outline-hidden"
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
              className="p-2.5 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-normal shadow-2xs focus:border-blue-600 focus:outline-hidden resize-none"
            />
          </div>

          {/* 7. Nội dung đọc trực tiếp (Tổng quan) */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-purple-200">
              Nội dung đọc trực tiếp (Tổng quan & cốt lõi)
            </label>
            <textarea
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              placeholder="Nội dung sẽ hiển thị ngay khi học viên ấn 'Đọc tài liệu'..."
              rows={3}
              className="p-2.5 rounded-[10px] border border-slate-300 dark:border-purple-800/80 bg-white dark:bg-[#1E1342] text-[12.5px] font-normal shadow-2xs focus:border-blue-600 focus:outline-hidden resize-none"
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
              className="flex items-center gap-1.5 h-9 px-4 rounded-[10px] bg-[#1E3A8A] text-white hover:bg-[#172554] text-[12.5px] font-black cursor-pointer shadow-xs transition-colors"
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
