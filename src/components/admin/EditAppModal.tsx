'use client';

import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Save, Loader2, BookOpen } from 'lucide-react';
import { uploadImageFile } from '../../lib/storageUpload';
import { saveSettingsApi } from '../../lib/apiAdmin';

interface EditAppModalProps {
  isOpen: boolean;
  initialName: string;
  initialLogoUrl?: string | null;
  onClose: () => void;
  onSaved: (newName: string, newLogoUrl: string | null) => void;
}

export default function EditAppModal({
  isOpen,
  initialName,
  initialLogoUrl = null,
  onClose,
  onSaved,
}: EditAppModalProps) {
  const [appName, setAppName] = useState(initialName);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMsg('');
      const res = await uploadImageFile(file);
      if (res && res.url) {
        setLogoUrl(res.url);
      } else {
        setErrorMsg('Chưa tải được logo lên kho lưu trữ.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi tải ảnh logo.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) {
      setErrorMsg('Vui lòng nhập tên ứng dụng.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg('');
      const res = await saveSettingsApi({
        app_name: appName.trim(),
        logo_url: logoUrl,
      });

      if (res.success) {
        onSaved(appName.trim(), logoUrl);
        onClose();
      } else {
        setErrorMsg(res.error || 'Chưa lưu được cài đặt, thử lại');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi kết nối máy chủ.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[440px] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div>
            <h3 className="text-[19px] font-extrabold text-ink leading-tight">
              Cài đặt tên & Logo ứng dụng
            </h3>
            <p className="text-[13px] text-muted">
              Lưu trực tiếp vào cấu hình hệ thống
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[14px] font-bold">
              {errorMsg}
            </div>
          )}

          {/* Tên ứng dụng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Tên ứng dụng
            </label>
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="Ví dụ: Học Cơ Thể"
              className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[16px] text-ink font-bold focus:border-primary"
              required
            />
          </div>

          {/* Logo ứng dụng */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-bold text-ink">
              Logo ứng dụng
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-[14px] bg-primary-soft flex items-center justify-center overflow-hidden border border-line shrink-0">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <BookOpen size={24} className="text-primary" />
                )}
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center justify-center gap-1.5 h-10 px-3 rounded-[10px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary cursor-pointer shadow-2xs"
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-primary" />
                      <span>Đang nén & tải ảnh...</span>
                    </>
                  ) : (
                    <>
                      <ImageIcon size={14} className="text-primary" />
                      <span>Chọn ảnh logo mới</span>
                    </>
                  )}
                </button>
                {logoUrl && (
                  <button
                    type="button"
                    onClick={() => setLogoUrl(null)}
                    className="text-[12px] text-red-600 font-bold hover:underline text-left cursor-pointer"
                  >
                    Xóa logo (dùng icon mặc định)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-line mt-2">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px] cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploading}
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
