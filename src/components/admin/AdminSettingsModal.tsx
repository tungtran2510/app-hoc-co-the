'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Save,
  Download,
  LogOut,
  Sliders,
  Key,
  Loader2,
} from 'lucide-react';
import {
  getStoredAppSettings,
  saveStoredAppSettings,
  AppCustomSettings,
} from '../../lib/storage';
import { logoutAdmin, isSuperAdmin, checkAdminStatus } from '../../lib/adminAuth';
import { saveSettingsApi, changePasswordApi, getAdminHeaders } from '../../lib/apiAdmin';
import InstructorManagerSection from './InstructorManagerSection';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
  onLogout?: () => void;
  initialTab?: 'chung' | 'trai_nghiem' | 'du_lieu' | 'giang_vien';
}

export default function AdminSettingsModal({
  isOpen,
  onClose,
  onSettingsSaved,
  onLogout,
  initialTab,
}: AdminSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'chung' | 'trai_nghiem' | 'du_lieu' | 'giang_vien'>('chung');
  const [isSuper, setIsSuper] = useState(false);

  // Cài đặt chung
  const [settings, setSettings] = useState<AppCustomSettings>(getStoredAppSettings());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Đổi mật khẩu Admin
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setSettings(getStoredAppSettings());
      setSaveSuccessMsg('');
      setPasswordError('');
      setPasswordSuccess('');
      checkAdminStatus().then((st) => {
        setIsSuper(isSuperAdmin(st.user));
      });
    }
  }, [isOpen, initialTab]);



  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || newPassword.trim().length < 4) {
      setPasswordError('Mật khẩu mới phải có tối thiểu 4 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await changePasswordApi(currentPassword, newPassword);
      if (!res.success) {
        setPasswordError(res.error || 'Đổi mật khẩu thất bại.');
        return;
      }

      setPasswordSuccess('Đã đổi mật khẩu thành công! Mật khẩu mới có hiệu lực ngay.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Lỗi mạng khi đổi mật khẩu.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!isOpen) return null;

  const handleSaveSettings = async () => {
    try {
      await saveStoredAppSettings(settings);
      const res = await saveSettingsApi({
        app_name: settings.app_name?.trim(),
        expert_title: settings.expert_title?.trim() || null,
        hotline: settings.hotline?.trim() || null,
        zalo_url: settings.zalo_url?.trim() || null,
        author_profile: {
          phone: settings.hotline?.trim() || null,
          zalo_url: settings.zalo_url?.trim() || null,
        },
      });
      if (!res.success) {
        throw new Error(res.error || 'Chưa lưu được cài đặt');
      }
      setSaveSuccessMsg('Đã lưu cài đặt thành công vào hệ thống!');
      setTimeout(() => {
        setSaveSuccessMsg('');
        if (onSettingsSaved) onSettingsSaved();
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu cài đặt vào hệ thống.');
    }
  };

  const handleExportBackup = async () => {
    try {
      setIsExporting(true);
      const res = await fetch('/api/admin/sao-luu', {
        headers: getAdminHeaders(),
      });
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

        {/* Tabs */}
        <div className={`grid ${isSuper ? 'grid-cols-4' : 'grid-cols-3'} border-b border-line bg-surface p-1.5 gap-1`}>
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
            Giao diện
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
            Bảo mật
          </button>
          {isSuper && (
            <button
              type="button"
              onClick={() => setActiveTab('giang_vien')}
              className={`h-10 rounded-[10px] text-[13px] font-extrabold transition-all cursor-pointer ${
                activeTab === 'giang_vien'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              Giảng viên
            </button>
          )}
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
                  Thông tin tác giả / Chuyên gia sức khỏe
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

              {/* Đổi mật khẩu Admin */}
              <div className="flex flex-col gap-3 p-4 rounded-[16px] bg-surface-2 border border-line">
                <div className="flex items-center gap-2">
                  <Key size={16} className="text-primary" />
                  <span className="text-[14px] font-bold text-ink">
                    Đổi mật khẩu quản trị (Admin)
                  </span>
                </div>

                {passwordError && (
                  <div className="p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-bold">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-2.5 rounded-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[13px] font-bold">
                    {passwordSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[12px] font-bold text-ink">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu đang dùng"
                      className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-ink">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Tối thiểu 4 ký tự"
                        className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[12px] font-bold text-ink">
                        Nhập lại mật khẩu
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận lại"
                        className="w-full h-9 px-3 rounded-[10px] border border-line text-[14px] text-ink focus:border-primary bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !newPassword}
                    className="mt-1 flex items-center justify-center gap-1.5 h-9 rounded-[10px] bg-primary text-white font-bold text-[13px] hover:bg-primary-dark cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Đang cập nhật...</span>
                      </>
                    ) : (
                      <span>Cập nhật mật khẩu mới</span>
                    )}
                  </button>
                </div>
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

          {/* TAB 4: QUẢN LÝ GIẢNG VIÊN (CHỈ SUPER ADMIN) */}
          {activeTab === 'giang_vien' && isSuper && (
            <InstructorManagerSection />
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
