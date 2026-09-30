'use client';

import React, { useState } from 'react';
import { X, Save, Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { saveSettingsApi } from '../../lib/apiAdmin';

interface EditGreetingModalProps {
  isOpen: boolean;
  initialGreeting: string;
  initialTitle: string;
  initialSearchPlaceholder: string;
  initialTopicsTitle: string;
  onClose: () => void;
  onSaved: (data: {
    greeting: string;
    title: string;
    searchPlaceholder: string;
    topicsTitle: string;
  }) => void;
}

export default function EditGreetingModal({
  isOpen,
  initialGreeting,
  initialTitle,
  initialSearchPlaceholder,
  initialTopicsTitle,
  onClose,
  onSaved,
}: EditGreetingModalProps) {
  const [greeting, setGreeting] = useState(initialGreeting || 'Xin chào!');
  const [title, setTitle] = useState(initialTitle || 'Hôm nay mình học gì?');
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    initialSearchPlaceholder || 'Tìm bài, ví dụ: đĩa đệm'
  );
  const [topicsTitle, setTopicsTitle] = useState(initialTopicsTitle || 'Chọn chủ đề');

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Vui lòng không để trống tiêu đề trang chủ.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');

      const res = await saveSettingsApi({
        home_greeting: greeting.trim(),
        home_title: title.trim(),
        search_placeholder: searchPlaceholder.trim(),
        topics_title: topicsTitle.trim(),
      });

      if (res.success) {
        onSaved({
          greeting: greeting.trim(),
          title: title.trim(),
          searchPlaceholder: searchPlaceholder.trim(),
          topicsTitle: topicsTitle.trim(),
        });
        onClose();
      } else {
        setErrorMsg(res.error || 'Chưa lưu được – chưa kết nối dữ liệu');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi lưu cài đặt.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[460px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface">
          <div className="flex items-center gap-2 text-ink">
            <Sparkles size={20} className="text-primary" />
            <h3 className="text-[17px] font-extrabold">Sửa câu chào & Tiêu đề trang</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* Lời chào */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-ink flex items-center justify-between">
              <span>Lời chào nhỏ</span>
              <span className="text-[11px] text-muted font-normal">Dòng chữ nhỏ trên cùng</span>
            </label>
            <input
              type="text"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="Ví dụ: Xin chào!"
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] font-medium text-ink focus:border-primary"
            />
          </div>

          {/* Tiêu đề chính */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-ink flex items-center justify-between">
              <span>Tiêu đề chính lớn</span>
              <span className="text-[11px] text-muted font-normal">Câu hỏi trọng tâm trang chủ</span>
            </label>
            <textarea
              rows={2}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Hôm nay mình học gì?"
              className="w-full p-3 rounded-[12px] border border-line text-[16px] font-extrabold text-ink focus:border-primary leading-snug"
            />
          </div>

          {/* Gợi ý ô Trợ lý AI & Tìm kiếm */}
          <div className="flex flex-col gap-1.5 pt-2 border-t border-line/60">
            <label className="text-[13px] font-bold text-ink flex items-center justify-between">
              <span>Gợi ý trong ô Trợ lý AI (Placeholder)</span>
            </label>
            <input
              type="text"
              value={searchPlaceholder}
              onChange={(e) => setSearchPlaceholder(e.target.value)}
              placeholder="Ví dụ: Hỏi Trợ lý AI về cơ thể, bài học..."
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] font-medium text-ink focus:border-primary"
            />
          </div>

          {/* Tiêu đề mục chủ đề */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-bold text-ink flex items-center justify-between">
              <span>Tiêu đề danh sách bài học</span>
            </label>
            <input
              type="text"
              value={topicsTitle}
              onChange={(e) => setTopicsTitle(e.target.value)}
              placeholder="Ví dụ: Chọn chủ đề hoặc Các chủ đề học"
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[14px] font-medium text-ink focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 p-3 rounded-[12px] bg-primary-soft/50 border border-primary/20 text-primary text-[12px] font-medium">
            <HelpCircle size={16} className="shrink-0" />
            <span>Mọi thay đổi sẽ được lưu ngay lập tức vào máy chủ và hiển thị cho toàn bộ người học.</span>
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-line">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-[12px] bg-surface-2 text-ink text-[14px] font-bold hover:bg-line/40 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 h-10 px-5 rounded-[12px] bg-primary text-white text-[14px] font-extrabold hover:bg-primary-dark shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
