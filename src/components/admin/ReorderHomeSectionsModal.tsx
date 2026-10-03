'use client';

import React, { useState } from 'react';
import {
  X,
  ArrowUp,
  ArrowDown,
  Layers,
  Save,
  CheckCircle2,
  BookOpen,
  UserCheck,
  FolderTree,
  Loader2,
  Sparkles,
  PhoneCall,
  Eye,
  EyeOff,
} from 'lucide-react';
import { saveSettingsApi } from '../../lib/apiAdmin';
import { normalizeHomeSectionsOrder } from '../../lib/data';

interface SectionMeta {
  key: string;
  name: string;
  desc: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
}

const SECTION_DEFS: Record<string, SectionMeta> = {
  brand_card: {
    key: 'brand_card',
    name: 'Thẻ thương hiệu App (Brand Card)',
    desc: 'Logo, Tên ứng dụng, định vị và huy hiệu chứng nhận',
    icon: Sparkles,
  },
  topics: {
    key: 'topics',
    name: 'Danh sách chuyên đề học',
    desc: 'Lưới các chủ đề chính (Cột sống, Dinh dưỡng, Nước...)',
    icon: FolderTree,
  },
  recent_activity: {
    key: 'recent_activity',
    name: 'Hoạt động gần đây (Đang học dở)',
    desc: 'Thẻ bài học đang theo dõi dở dang của người dùng',
    icon: Sparkles,
  },
  author_profile: {
    key: 'author_profile',
    name: 'Hồ sơ Tác giả & Chuyên gia',
    desc: 'Ảnh đại diện/logo, tên, định vị, lời giới thiệu và video',
    icon: UserCheck,
  },
  author_books: {
    key: 'author_books',
    name: 'Tài Liệu & Cẩm Nang Chuyên Sâu',
    desc: 'Các ấn phẩm, tài liệu chuyên sâu của tác giả và video',
    icon: BookOpen,
  },
  author_philosophy: {
    key: 'author_philosophy',
    name: 'Triết lý phụng sự',
    desc: 'Thông điệp sứ mệnh, tâm huyết và triết lý vì sức khỏe',
    icon: Sparkles,
  },
  author_contact: {
    key: 'author_contact',
    name: 'Thông tin liên hệ & Kết nối',
    desc: 'Hotline, nút chat Zalo, địa chỉ, email và kênh cá nhân',
    icon: PhoneCall,
  },
  recommended_books: {
    key: 'recommended_books',
    name: 'Tài Liệu Nên Đọc (Chuyên Khảo)',
    desc: 'Bộ sưu tập các tài liệu y khoa khuyên đọc chuyên sâu về cơ thể',
    icon: BookOpen,
  },
  flat_books: {
    key: 'flat_books',
    name: 'Tủ Sách Tối Giản (Phong cách phẳng)',
    desc: 'Hiển thị sách phong cách phẳng tối giản (hàng ngang & lưới 2 cột)',
    icon: BookOpen,
  },
};

interface ReorderHomeSectionsModalProps {
  isOpen: boolean;
  currentOrder: string[];
  currentHidden?: string[];
  onClose: () => void;
  onSaved: (newOrder: string[], newHidden: string[]) => void;
}

export default function ReorderHomeSectionsModal({
  isOpen,
  currentOrder,
  currentHidden = [],
  onClose,
  onSaved,
}: ReorderHomeSectionsModalProps) {
  const [order, setOrder] = useState<string[]>(() => {
    return normalizeHomeSectionsOrder(currentOrder);
  });
  const [hiddenSections, setHiddenSections] = useState<string[]>(() => currentHidden || []);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  React.useEffect(() => {
    if (isOpen) {
      setOrder(normalizeHomeSectionsOrder(currentOrder));
      setHiddenSections(currentHidden || []);
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen, currentOrder, currentHidden]);

  if (!isOpen) return null;

  const toggleVisibility = (key: string) => {
    setHiddenSections((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...order];
    const temp = newOrder[index - 1];
    newOrder[index - 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const moveDown = (index: number) => {
    if (index === order.length - 1) return;
    const newOrder = [...order];
    const temp = newOrder[index + 1];
    newOrder[index + 1] = newOrder[index];
    newOrder[index] = temp;
    setOrder(newOrder);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setErrorMsg('');
      const res = await saveSettingsApi({
        home_sections_order: order,
        hidden_home_sections: hiddenSections,
      });

      if (res.success) {
        setSuccessMsg('Đã lưu thứ tự & trạng thái hiển thị thành công!');
        onSaved(order, hiddenSections);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.error || 'Chưa lưu được – vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi lưu thứ tự.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[480px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header Modal */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Layers size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-ink leading-tight">
                Sắp xếp thứ tự các khối
              </h3>
              <p className="text-[12px] text-muted">
                Điều chỉnh vị trí hiển thị trên Trang chủ
              </p>
            </div>
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

        {/* Nội dung danh sách các khối */}
        <div className="p-5 flex flex-col gap-3">
          <p className="text-[13px] text-muted leading-relaxed">
            Dùng các nút mũi tên để di chuyển vị trí từng khối lên hoặc xuống theo ý muốn:
          </p>

          <div className="flex flex-col gap-2.5">
            {order.map((key, idx) => {
              const def =
                SECTION_DEFS[key] ||
                (key.startsWith('custom_')
                  ? { key, name: 'Khối tùy biến (Ảnh · Văn bản · HTML)', desc: 'Khối do quản trị viên tự thêm', icon: Sparkles }
                  : undefined);
              if (!def) return null;
              const Icon = def.icon;
              const isFirst = idx === 0;
              const isLast = idx === order.length - 1;
              const isHidden = hiddenSections.includes(key);

              return (
                <div
                  key={key}
                  className={`flex items-center justify-between p-3.5 px-4 rounded-[18px] border transition-colors gap-3 ${
                    isHidden
                      ? 'bg-amber-50/60 border-amber-300/70 dark:bg-amber-950/20 dark:border-amber-800/50'
                      : 'bg-surface-2/70 border-line shadow-2xs hover:bg-surface-2'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-white border border-line font-black text-ink text-[13px] flex items-center justify-center shrink-0 shadow-2xs">
                      {idx + 1}
                    </div>

                    <div className="w-9 h-9 rounded-[12px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
                      <Icon size={18} />
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13.5px] font-extrabold text-ink leading-snug line-clamp-1">
                          {def.name}
                        </span>
                        {isHidden && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-black shrink-0">
                            Ẩn
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted leading-tight line-clamp-1">
                        {def.desc}
                      </span>
                    </div>
                  </div>

                  {/* Nút Ẩn/Hiện & Lên/Xuống */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(key)}
                      className={`h-8 px-2 rounded-[10px] border flex items-center gap-1 text-[11.5px] font-extrabold transition-all cursor-pointer ${
                        isHidden
                          ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700/60 shadow-2xs'
                          : 'bg-white border-line text-muted hover:text-primary hover:border-primary'
                      }`}
                      title={isHidden ? 'Khối đang ẨN TẠM với người xem – Bấm để HIỆN' : 'Khối đang HIỆN – Bấm để ẨN TẠM'}
                    >
                      {isHidden ? (
                        <>
                          <EyeOff size={13} className="text-amber-700 dark:text-amber-300" strokeWidth={2.5} />
                          <span className="hidden xs:inline">Ẩn</span>
                        </>
                      ) : (
                        <>
                          <Eye size={13} strokeWidth={2.2} />
                          <span className="hidden xs:inline">Hiện</span>
                        </>
                      )}
                    </button>

                    <div className="w-[1px] h-4 bg-line mx-0.5" />

                    <button
                      type="button"
                      disabled={isFirst}
                      onClick={() => moveUp(idx)}
                      className="w-8 h-8 rounded-[10px] bg-white border border-line flex items-center justify-center text-ink hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer active:scale-95"
                      title="Chuyển lên trên"
                    >
                      <ArrowUp size={15} strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      disabled={isLast}
                      onClick={() => moveDown(idx)}
                      className="w-8 h-8 rounded-[10px] bg-white border border-line flex items-center justify-center text-ink hover:text-primary hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer active:scale-95"
                      title="Chuyển xuống dưới"
                    >
                      <ArrowDown size={15} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {errorMsg && (
            <div className="p-3 rounded-[14px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium leading-snug">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-[14px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-medium flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center gap-2.5 pt-2 border-t border-line mt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 h-12 rounded-[16px] bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold text-[15px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Lưu thứ tự & trạng thái hiển thị</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-12 px-4 rounded-[16px] bg-surface-2 hover:bg-surface-3 text-muted hover:text-ink font-bold text-[14px] transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
