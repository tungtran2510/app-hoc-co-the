'use client';

import React, { useState } from 'react';
import { X, Save, Edit, FileText } from 'lucide-react';
import { Page } from '../../lib/types';

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Page;
  onSavePage: (updatedPage: Partial<Page>) => void;
}

export default function EditPageModal({
  isOpen,
  onClose,
  page,
  onSavePage,
}: EditPageModalProps) {
  const [title, setTitle] = useState(page.title);
  const [summary, setSummary] = useState(page.summary || '');
  const [status, setStatus] = useState<'published' | 'draft'>(page.status || 'published');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài học');
      return;
    }

    onSavePage({
      title: title.trim(),
      summary: summary.trim() || null,
      status,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2 text-ink">
            <Edit size={20} className="text-primary" />
            <h3 className="text-[19px] font-extrabold">Sửa thông tin bài học</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink"
            aria-label="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Tiêu đề bài học
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài học..."
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[16px] text-ink font-bold focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Tóm tắt ngắn (1–2 câu)
            </label>
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt ngắn nội dung bài học..."
              className="w-full p-3 rounded-[12px] border border-line text-[15px] text-ink leading-relaxed focus:outline-hidden focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Trạng thái xuất bản
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`h-11 rounded-[12px] font-bold text-[14px] border transition-all ${
                  status === 'published'
                    ? 'bg-[#E6F2EF] text-[#0A4F43] border-primary'
                    : 'bg-white border-line text-muted'
                }`}
              >
                ● Đang hiện (Công khai)
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`h-11 rounded-[12px] font-bold text-[14px] border transition-all ${
                  status === 'draft'
                    ? 'bg-[#FFF1E6] text-[#8A3A14] border-[#F2B38A]'
                    : 'bg-white border-line text-muted'
                }`}
              >
                ○ Bản nháp (Ẩn)
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-line flex items-center justify-end gap-2.5 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="h-[46px] min-h-[44px] px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[15px]"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center justify-center gap-1.5 h-[46px] min-h-[44px] px-6 rounded-[12px] bg-primary text-white font-extrabold text-[15px] shadow-sm"
          >
            <Save size={16} />
            <span>Lưu thông tin</span>
          </button>
        </div>
      </div>
    </div>
  );
}
