'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Save,
  Download,
  LogOut,
  Sliders,
} from 'lucide-react';
import {
  getStoredAppSettings,
  saveStoredAppSettings,
  AppCustomSettings,
} from '../../lib/storage';
import { logoutAdmin } from '../../lib/adminAuth';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
  onLogout?: () => void;
}

export default function AdminSettingsModal({
  isOpen,
  onClose,
  onSettingsSaved,
  onLogout,
}: AdminSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'chung' | 'trai_nghiem' | 'du_lieu'>('chung');

  // Cài đặt chung
  const [settings, setSettings] = useState<AppCustomSettings>(getStoredAppSettings());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredAppSettings());
      setSaveSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = async () => {
    await saveStoredAppSettings(settings);
    setSaveSuccessMsg('Đã lưu cài đặt thành công!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      if (onSettingsSaved) onSettingsSaved();
    }, 1200);
  };

  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/admin/sao-luu');
      if (!res.ok) {
        throw new Error('Chưa lưu được sao lưu hoặc chưa đăng nhập');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sao-luu-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sao lưu dữ liệu.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    if (onLogout) {
      onLogout();
    }
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="w-full max-w-[480px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between p-4 px-5 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-primary-soft text-primary flex items-center justify-center">
              <Settings size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[19px] font-extrabold text-ink leading-tight">
                Cài đặt quản trị
              </h3>
              <p className="text-[13px] text-muted leading-tight">
                Tùy chỉnh thông tin, hiển thị và dữ liệu
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

        {/* 3 Tabs */}
        <div className="grid grid-cols-3 border-b border-line bg-surface p-1.5 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('chung')}
            className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer ${
              activeTab === 'chung'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Chung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trai_nghiem')}
            className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer ${
              activeTab === 'trai_nghiem'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Học tập & Giao diện
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('du_lieu')}
            className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer ${
              activeTab === 'du_lieu'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Dữ liệu & Sao lưu
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* TAB 1: CÀI ĐẶT CHUNG */}
          {activeTab === 'chung' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Tên ứng dụng
                </label>
                <input
                  type="text"
                  value={settings.app_name}
                  onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                  placeholder="Ví dụ: Sống Khỏe Mỗi Ngày"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink font-semibold focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-bold text-ink">
                  Thông tin chuyên gia / Bác sĩ phụ trách
                </label>
                <input
                  type="text"
                  value={settings.expert_title}
                  onChange={(e) => setSettings({ ...settings, expert_title: e.target.value })}
                  placeholder="Ví dụ: Chuyên gia Phục hồi chức năng Cột sống"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Số Hotline tư vấn
                  </label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    placeholder="0988..."
                    className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Đường dẫn Zalo
                  </label>
                  <input
                    type="text"
                    value={settings.zalo_url}
                    onChange={(e) => setSettings({ ...settings, zalo_url: e.target.value })}
                    placeholder="https://zalo.me/..."
                    className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRẢI NGHIỆM HỌC TẬP */}
          {activeTab === 'trai_nghiem' && (
            <div className="flex flex-col gap-4">
              {/* Cỡ chữ mặc định */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <span className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                  <Sliders size={16} className="text-primary" />
                  <span>Cỡ chữ mặc định khi mở bài học</span>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'normal', 'large'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSettings({ ...settings, default_font_size: mode })}
                      className={`h-10 rounded-[10px] font-extrabold text-[13px] border transition-all cursor-pointer ${
                        settings.default_font_size === mode
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-white text-ink border-line hover:border-primary/40'
                      }`}
                    >
                      {mode === 'small' ? 'Nhỏ' : mode === 'normal' ? 'Vừa' : 'Lớn'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tự động chuyển video */}
              <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-[15px] font-bold text-ink">
                    Tự động chuyển video kế tiếp
                  </span>
                  <span className="text-[13px] text-muted">
                    Sau khi phát xong 1 video, trình phát tự chọn video tiếp theo trong danh sách
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.auto_next_video}
                  onChange={(e) => setSettings({ ...settings, auto_next_video: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>

              {/* Thanh tiến độ */}
              <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-[15px] font-bold text-ink">
                    Hiện thanh tiến độ học tập
                  </span>
                  <span className="text-[13px] text-muted">
                    Hiển thị thanh tiến trình % trên thẻ Xem tiếp ở trang chủ
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.show_progress_bar}
                  onChange={(e) => setSettings({ ...settings, show_progress_bar: e.target.checked })}
                  className="w-5 h-5 accent-primary rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: DỮ LIỆU & BẢO MẬT */}
          {activeTab === 'du_lieu' && (
            <div className="flex flex-col gap-4">
              {/* Sao lưu 1 chạm */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <span className="text-[14px] font-bold text-ink">
                  Sao lưu dữ liệu 1 chạm
                </span>
                <p className="text-[13px] text-muted leading-relaxed">
                  Tải toàn bộ 4 bảng dữ liệu (chủ đề, bài học, các khối và cấu hình) về máy tính để lưu trữ dự phòng.
                </p>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-primary text-white font-bold text-[14px] shadow-xs cursor-pointer hover:bg-primary-dark"
                >
                  <Download size={16} />
                  <span>{isExporting ? 'Đang xuất tệp...' : 'Tải file sao lưu (JSON)'}</span>
                </button>
              </div>

              {/* Đăng xuất */}
              <div className="flex flex-col gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-red-50 text-red-600 font-bold text-[14px] border border-red-200 hover:bg-red-100 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Thoát quyền quản trị (Đăng xuất)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-line flex items-center justify-between bg-surface">
          <div>
            {saveSuccessMsg && (
              <span className="text-[13px] text-primary font-bold">
                ✓ {saveSuccessMsg}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[44px] px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px] cursor-pointer"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="flex items-center justify-center gap-1.5 h-[44px] px-5 rounded-[12px] bg-primary text-white font-extrabold text-[14px] shadow-sm cursor-pointer hover:bg-primary-dark"
            >
              <Save size={16} />
              <span>Lưu cài đặt</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
