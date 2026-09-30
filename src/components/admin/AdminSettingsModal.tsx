'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Save,
  Shield,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  Check,
  Smartphone,
  Eye,
  Bell,
  Sliders,
} from 'lucide-react';
import {
  getStoredAppSettings,
  saveStoredAppSettings,
  getAdminPin,
  setAdminPin,
  exportAllData,
  importAllData,
  resetAllToDefault,
  AppCustomSettings,
} from '../../lib/storage';
import { setAdminClient } from '../../lib/adminAuth';

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
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredAppSettings());
      setAdminPinInput(getAdminPin());
      setPinChangeMsg('');
      setSaveSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    saveStoredAppSettings(settings);
    setSaveSuccessMsg('Đã lưu cài đặt thành công!');
    setTimeout(() => {
      setSaveSuccessMsg('');
      if (onSettingsSaved) onSettingsSaved();
    }, 1200);
  };

  const handleSavePin = () => {
    if (!adminPinInput.trim() || adminPinInput.trim().length < 4) {
      alert('Mã PIN cần ít nhất 4 ký tự');
      return;
    }
    setAdminPin(adminPinInput.trim());
    setPinChangeMsg('✓ Đã cập nhật mã PIN mới thành công!');
    setTimeout(() => setPinChangeMsg(''), 2500);
  };

  const handleExportBackup = () => {
    const jsonStr = exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sao-luu-app-hoc-co-the-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importAllData(content);
        if (success) {
          alert('Đã khôi phục dữ liệu sao lưu thành công! Trang sẽ tải lại.');
          window.location.reload();
        } else {
          alert('Tệp sao lưu không hợp lệ.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaults = () => {
    if (
      confirm(
        'Bạn có chắc chắn muốn khôi phục toàn bộ cài đặt và nội dung về dữ liệu chuẩn y khoa gốc ban đầu? Mọi chỉnh sửa tạm thời sẽ được xóa.'
      )
    ) {
      resetAllToDefault();
      alert('Đã khôi phục dữ liệu gốc thành công! Trang sẽ tải lại.');
      window.location.reload();
    }
  };

  const handleLogout = () => {
    setAdminClient(false);
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
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink"
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
            className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all ${
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
            className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all ${
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
            className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all ${
              activeTab === 'du_lieu'
                ? 'bg-white text-primary shadow-xs'
                : 'text-muted hover:text-ink'
            }`}
          >
            Dữ liệu & Bảo mật
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
                  Chuyên gia / Đơn vị phụ trách
                </label>
                <input
                  type="text"
                  value={settings.expert_title}
                  onChange={(e) => setSettings({ ...settings, expert_title: e.target.value })}
                  placeholder="Ví dụ: Bác sĩ Trị liệu Cột sống"
                  className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink font-semibold focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Hotline tư vấn
                  </label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    placeholder="0988.xxx.xxx"
                    className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink font-semibold focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] font-bold text-ink">
                    Link Zalo hỗ trợ
                  </label>
                  <input
                    type="url"
                    value={settings.zalo_url}
                    onChange={(e) => setSettings({ ...settings, zalo_url: e.target.value })}
                    placeholder="https://zalo.me/..."
                    className="w-full h-11 px-3.5 rounded-[12px] border border-line text-[15px] text-ink font-semibold focus:border-primary"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-[16px] bg-[#E6F2EF] border border-[#0E6B5A]/20 flex flex-col gap-1 text-[13px] text-[#0A4F43]">
                <span className="font-extrabold">💡 Mẹo hiển thị</span>
                <span>Thông tin này sẽ xuất hiện trên thanh tiêu đề và chân trang hỗ trợ học viên.</span>
              </div>
            </div>
          )}

          {/* TAB 2: HỌC TẬP & GIAO DIỆN */}
          {activeTab === 'trai_nghiem' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[14px] font-bold text-ink">
                  Cỡ chữ mặc định khi mở app
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'normal', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSettings({ ...settings, default_font_size: size })}
                      className={`h-11 rounded-[12px] font-bold text-[14px] border transition-all ${
                        settings.default_font_size === size
                          ? 'bg-primary-soft border-primary text-primary shadow-xs'
                          : 'bg-white border-line text-ink'
                      }`}
                    >
                      {size === 'small' ? 'Nhỏ' : size === 'normal' ? 'Vừa' : 'Lớn'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tự chuyển bài */}
              <div className="flex items-center justify-between p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <div className="flex flex-col gap-0.5 max-w-[80%]">
                  <span className="text-[15px] font-bold text-ink">
                    Tự động chuyển bài tiếp theo
                  </span>
                  <span className="text-[13px] text-muted">
                    Sau khi xem hết danh sách video của bài hiện tại
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
              {/* Đổi mã PIN */}
              <div className="flex flex-col gap-2 p-3.5 rounded-[16px] bg-surface-2 border border-line">
                <span className="text-[14px] font-bold text-ink flex items-center gap-1.5">
                  <Shield size={16} className="text-primary" />
                  <span>Đổi mã PIN quản trị</span>
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="Nhập mã PIN mới (vd: 1234)..."
                    className="flex-1 h-10 px-3 rounded-[10px] border border-line text-[15px] font-mono focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleSavePin}
                    className="h-10 px-4 rounded-[10px] bg-primary text-white font-bold text-[13px] shrink-0"
                  >
                    Lưu mã
                  </button>
                </div>
                {pinChangeMsg && (
                  <span className="text-[12px] text-primary font-semibold">
                    {pinChangeMsg}
                  </span>
                )}
              </div>

              {/* Sao lưu và Khôi phục */}
              <div className="flex flex-col gap-2">
                <span className="text-[14px] font-bold text-ink">
                  Sao lưu & Khôi phục nội dung
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleExportBackup}
                    className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary shadow-xs"
                  >
                    <Download size={16} className="text-primary" />
                    <span>Xuất file JSON</span>
                  </button>

                  <label className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-white border border-line text-ink font-bold text-[13px] hover:border-primary shadow-xs cursor-pointer">
                    <Upload size={16} className="text-primary" />
                    <span>Nhập file JSON</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportBackup}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Khôi phục gốc & Đăng xuất */}
              <div className="flex flex-col gap-2 pt-2 border-t border-line">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-[#FFF1E6] text-[#8A3A14] font-bold text-[14px] border border-[#F2B38A]"
                >
                  <RotateCcw size={16} />
                  <span>Khôi phục dữ liệu gốc ban đầu</span>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 h-11 rounded-[12px] bg-red-50 text-red-600 font-bold text-[14px] border border-red-200 hover:bg-red-100 mt-1"
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
              className="h-[44px] px-4 rounded-[12px] bg-surface-2 text-ink font-bold text-[14px]"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="flex items-center justify-center gap-1.5 h-[44px] px-5 rounded-[12px] bg-primary text-white font-extrabold text-[14px] shadow-sm"
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
