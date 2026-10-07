'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Save,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  Sliders,
  Key,
  Loader2,
  Sparkles,
  Check,
  BookOpen,
  PlayCircle,
  Activity,
  CloudDownload,
  Compass,
} from 'lucide-react';
import {
  getStoredAppSettings,
  saveStoredAppSettings,
  AppCustomSettings,
} from '../../lib/storage';
import { logoutAdmin, isSuperAdmin, checkAdminStatus } from '../../lib/adminAuth';
import { saveSettingsApi, changePasswordApi, getAdminHeaders, restoreBackupApi } from '../../lib/apiAdmin';
import InstructorManagerSection from './InstructorManagerSection';
import WorkspaceManagerSection from './WorkspaceManagerSection';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: () => void;
  onLogout?: () => void;
  initialTab?: 'chung' | 'trai_nghiem' | 'du_lieu' | 'giang_vien' | 'khach_hang';
}

export default function AdminSettingsModal({
  isOpen,
  onClose,
  onSettingsSaved,
  onLogout,
  initialTab,
}: AdminSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'chung' | 'trai_nghiem' | 'du_lieu' | 'giang_vien' | 'khach_hang'>('chung');
  const [isSuper, setIsSuper] = useState(false);


  // Cài đặt chung
  const [settings, setSettings] = useState<AppCustomSettings>(getStoredAppSettings());
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  // Tiến độ tải dữ liệu ngoại tuyến Offline (tối đa 30MB)
  const [offlineStatus, setOfflineStatus] = useState<{
    status: 'idle' | 'downloading' | 'completed' | 'error';
    progress: number;
    bytesFormatted: string;
  }>({
    status: 'idle',
    progress: 0,
    bytesFormatted: '',
  });
  const [offlineLastMb, setOfflineLastMb] = useState('');

  useEffect(() => {
    try {
      const mb = localStorage.getItem('qbiz_offline_cached_mb');
      if (mb) setOfflineLastMb(mb);
    } catch {}

    const handleProgress = (e: any) => {
      if (e?.detail) {
        setOfflineStatus({
          status: e.detail.status,
          progress: e.detail.progress || 0,
          bytesFormatted: e.detail.bytesFormatted || '',
        });
        if (e.detail.status === 'completed' && e.detail.bytesFormatted) {
          setOfflineLastMb(e.detail.bytesFormatted);
        }
      }
    };
    window.addEventListener('qbiz_offline_progress', handleProgress);
    return () => window.removeEventListener('qbiz_offline_progress', handleProgress);
  }, []);

  // Đổi mật khẩu Admin
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Phục hồi bản sao lưu
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState('');
  const [pendingRestoreData, setPendingRestoreData] = useState<any>(null);
  const restoreFileInputRef = React.useRef<HTMLInputElement>(null);

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
        block_styles: {
          theme_palette: settings.theme_palette || 'indigo',
        },
      } as any);
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

  const handleSelectBackupFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRestoreError('');
    setRestoreSuccess('');
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const backupData = parsed.backupData || parsed;
        if (!backupData || !Array.isArray(backupData.topics) || !Array.isArray(backupData.pages) || !Array.isArray(backupData.blocks)) {
          setRestoreError('File không hợp lệ: Thiếu danh sách topics, pages hoặc blocks chuẩn.');
          return;
        }
        setPendingRestoreData(backupData);
      } catch (err: any) {
        setRestoreError('Lỗi đọc file JSON: ' + (err.message || 'File hỏng hoặc không đúng định dạng.'));
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleConfirmRestore = async () => {
    if (!pendingRestoreData) return;
    try {
      setIsRestoring(true);
      setRestoreError('');
      setRestoreSuccess('');
      const res = await restoreBackupApi(pendingRestoreData);
      if (!res.success) {
        setRestoreError(res.error || 'Phục hồi dữ liệu thất bại.');
        return;
      }
      setRestoreSuccess(`Phục hồi thành công: ${res.restored?.topics || 0} chuyên đề, ${res.restored?.pages || 0} bài học, ${res.restored?.blocks || 0} khối nội dung!`);
      setPendingRestoreData(null);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setRestoreError(err.message || 'Lỗi mạng khi phục hồi.');
    } finally {
      setIsRestoring(false);
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
        <div className="flex items-center justify-between p-3.5 px-4 sm:p-4 border-b border-line">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-[9px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Settings size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-[16px] sm:text-[17px] font-extrabold text-ink leading-tight">
                Cài đặt quản trị
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-muted hover:text-ink cursor-pointer"
            aria-label="Đóng"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tabs - Cuộn ngang mượt mà trên Mobile, không bị vỡ cột */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-1.5 border-b border-line bg-surface-2">
          <button
            type="button"
            onClick={() => setActiveTab('chung')}
            className={`h-8 px-3 rounded-[9px] text-[12px] font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeTab === 'chung'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-muted hover:text-ink hover:bg-surface'
            }`}
          >
            Chung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('trai_nghiem')}
            className={`h-8 px-3 rounded-[9px] text-[12px] font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeTab === 'trai_nghiem'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-muted hover:text-ink hover:bg-surface'
            }`}
          >
            Giao diện
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('du_lieu')}
            className={`h-8 px-3 rounded-[9px] text-[12px] font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              activeTab === 'du_lieu'
                ? 'bg-primary text-white shadow-2xs'
                : 'text-muted hover:text-ink hover:bg-surface'
            }`}
          >
            Bảo mật
          </button>
          {isSuper && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('giang_vien')}
                className={`h-8 px-3 rounded-[9px] text-[12px] font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'giang_vien'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                Giảng viên
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('khach_hang')}
                className={`h-8 px-3 rounded-[9px] text-[12px] font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                  activeTab === 'khach_hang'
                    ? 'bg-primary text-white shadow-2xs'
                    : 'text-muted hover:text-ink hover:bg-surface'
                }`}
              >
                Cơ sở SaaS
              </button>
            </>
          )}
        </div>


        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 flex flex-col gap-3.5">
          {/* TAB 1: CÀI ĐẶT CHUNG */}
          {activeTab === 'chung' && (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[12.5px] font-bold text-ink">
                  Tên ứng dụng
                </label>
                <input
                  type="text"
                  value={settings.app_name}
                  onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
                  placeholder="Ví dụ: Sống Khỏe Mỗi Ngày"
                  className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink font-semibold focus:border-primary"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[12.5px] font-bold text-ink">
                  Thông tin tác giả / Chuyên gia sức khỏe
                </label>
                <input
                  type="text"
                  value={settings.expert_title}
                  onChange={(e) => setSettings({ ...settings, expert_title: e.target.value })}
                  placeholder="Ví dụ: Chuyên gia Phục hồi chức năng Cột sống"
                  className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-ink">
                    Số Hotline tư vấn
                  </label>
                  <input
                    type="text"
                    value={settings.hotline}
                    onChange={(e) => setSettings({ ...settings, hotline: e.target.value })}
                    placeholder="0988..."
                    className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[12.5px] font-bold text-ink">
                    Đường dẫn Zalo
                  </label>
                  <input
                    type="text"
                    value={settings.zalo_url}
                    onChange={(e) => setSettings({ ...settings, zalo_url: e.target.value })}
                    placeholder="https://zalo.me/..."
                    className="w-full h-10 px-3 rounded-[10px] border border-line text-[13.5px] text-ink focus:border-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRẢI NGHIỆM HỌC TẬP & GIAO DIỆN */}
          {activeTab === 'trai_nghiem' && (
            <div className="flex flex-col gap-3">
              {/* Bảng màu giao diện - Tinh gọn 1 dòng */}
              <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-surface-2 border border-line">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                    <Sparkles size={15} className="text-primary" />
                    <span>Bảng màu giao diện</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20">
                    {settings.theme_palette === 'navy_luxury' ? 'Xanh Navy' : 'Chàm Y Khoa'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  {/* Tông 1: Chàm Y Khoa (Mặc định) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...settings, theme_palette: 'indigo' as const };
                      setSettings(next);
                      try {
                        localStorage.setItem('qbiz_theme_palette', 'indigo');
                        document.documentElement.classList.remove('theme-navy-luxury');
                        window.dispatchEvent(new CustomEvent('qbiz_theme_palette_changed', { detail: { palette: 'indigo' } }));
                      } catch {}
                    }}
                    className={`h-11 px-2.5 rounded-[11px] border-2 flex items-center gap-2 transition-all cursor-pointer text-left ${
                      (!settings.theme_palette || settings.theme_palette === 'indigo')
                        ? 'bg-white border-[#1E3A8A] shadow-2xs ring-1 ring-[#1E3A8A]/20'
                        : 'bg-white/70 border-line hover:border-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#60A5FA] flex items-center justify-center shrink-0 shadow-2xs border border-white">
                      {(!settings.theme_palette || settings.theme_palette === 'indigo') && (
                        <Check size={12} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[12px] font-extrabold text-ink truncate block">Chàm Y Khoa</span>
                    </div>
                  </button>

                  {/* Tông 2: Xanh Navy Sang Trọng */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...settings, theme_palette: 'navy_luxury' as const };
                      setSettings(next);
                      try {
                        localStorage.setItem('qbiz_theme_palette', 'navy_luxury');
                        document.documentElement.classList.add('theme-navy-luxury');
                        window.dispatchEvent(new CustomEvent('qbiz_theme_palette_changed', { detail: { palette: 'navy_luxury' } }));
                      } catch {}
                    }}
                    className={`h-11 px-2.5 rounded-[11px] border-2 flex items-center gap-2 transition-all cursor-pointer text-left ${
                      settings.theme_palette === 'navy_luxury'
                        ? 'bg-white border-[#0E2A5C] shadow-2xs ring-2 ring-[#0284C7]/30'
                        : 'bg-white/70 border-line hover:border-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#06142B] via-[#0E2A5C] to-[#0284C7] flex items-center justify-center shrink-0 shadow-2xs border border-[#38BDF8]">
                      {settings.theme_palette === 'navy_luxury' && (
                        <Check size={12} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[12px] font-extrabold text-[#0E2A5C] truncate block">Xanh Navy</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Cỡ chữ đọc bài học */}
              <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-surface-2 border border-line">
                <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                  <Sliders size={15} className="text-primary" />
                  <span>Cỡ chữ đọc bài học</span>
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['small', 'normal', 'large'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSettings({ ...settings, default_font_size: mode })}
                      className={`h-9 rounded-[9px] font-extrabold text-[12px] border transition-all cursor-pointer ${
                        settings.default_font_size === mode
                          ? 'bg-primary text-white border-primary shadow-2xs'
                          : 'bg-white text-ink border-line hover:border-primary/40'
                      }`}
                    >
                      {mode === 'small' ? 'Nhỏ' : mode === 'normal' ? 'Vừa' : 'Lớn'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Nhóm tùy chọn hiển thị & trải nghiệm - Tinh gọn, chuẩn Apple iOS card */}
              <div className="flex flex-col rounded-[15px] bg-surface-2 border border-line divide-y divide-line/70 overflow-hidden">
                {/* 1. Tự động chuyển video */}
                <label className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <PlayCircle size={15} className="text-primary shrink-0" />
                    <span className="text-[13px] font-bold text-ink">
                      Tự động phát video kế tiếp
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.auto_next_video}
                    onChange={(e) => setSettings({ ...settings, auto_next_video: e.target.checked })}
                    className="w-4.5 h-4.5 accent-primary rounded cursor-pointer"
                  />
                </label>

                {/* 2. Thanh tiến độ học tập */}
                <label className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-primary shrink-0" />
                    <span className="text-[13px] font-bold text-ink">
                      Hiện thanh tiến độ học tập (%)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.show_progress_bar}
                    onChange={(e) => setSettings({ ...settings, show_progress_bar: e.target.checked })}
                    className="w-4.5 h-4.5 accent-primary rounded cursor-pointer"
                  />
                </label>

                {/* 3. Cầu nối đọc sách (Ebook) */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <BookOpen size={15} className="text-emerald-600 shrink-0" />
                      <span className="text-[13px] font-bold text-ink">
                        Cầu nối đọc sách (Ebook)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.show_ebook_bridge ?? true}
                      onChange={(e) => setSettings({ ...settings, show_ebook_bridge: e.target.checked })}
                      className="w-4.5 h-4.5 accent-emerald-600 rounded cursor-pointer"
                    />
                  </label>

                  {/* Địa chỉ URL Ebook (tinh gọn, lồng liền mạch khi bật) */}
                  {(settings.show_ebook_bridge ?? true) && (
                    <div className="mt-2.5 pt-2 border-t border-line/60 flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted shrink-0">URL App:</span>
                      <input
                        type="text"
                        value={settings.ebook_app_url || ''}
                        onChange={(e) => setSettings({ ...settings, ebook_app_url: e.target.value })}
                        placeholder="https://qbiz-ebook.vercel.app"
                        className="flex-1 h-8 px-2.5 rounded-[8px] border border-line text-[12px] text-ink focus:border-emerald-500 bg-white"
                      />
                    </div>
                  )}
                </div>

                {/* 4. Quản trị Bộ nhớ & Tự động tải Offline */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors gap-2.5">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <CloudDownload size={15} className="text-blue-600 shrink-0" />
                      <span className="text-[13px] font-bold text-ink">
                        Tự động tải Offline (sau 2 phút)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.auto_offline_cache ?? true}
                      onChange={(e) => setSettings({ ...settings, auto_offline_cache: e.target.checked })}
                      className="w-4.5 h-4.5 accent-blue-600 rounded cursor-pointer"
                    />
                  </label>

                  {/* Tùy chọn giới hạn dung lượng tải về */}
                  <div className="flex items-center justify-between pt-1 text-[11.5px]">
                    <span className="font-bold text-muted">Hạn mức tải tối đa:</span>
                    <div className="flex items-center gap-1">
                      {([30, 60, 100, 200] as const).map((mb) => (
                        <button
                          key={mb}
                          type="button"
                          onClick={() => setSettings({ ...settings, offline_max_mb: mb })}
                          className={`px-2 py-0.5 rounded-[7px] text-[11px] font-extrabold border transition-all cursor-pointer ${
                            (settings.offline_max_mb || 60) === mb
                              ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                              : 'bg-white dark:bg-slate-800 text-ink border-line hover:border-blue-400'
                          }`}
                        >
                          {mb}MB
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Nút chủ động tải ngay 1-chạm & Nút Dọn dẹp cache */}
                  <div className="pt-2 border-t border-line/60 flex items-center justify-between gap-2">
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-extrabold text-ink truncate">
                        {offlineStatus.status === 'downloading'
                          ? `Đang tải: ${offlineStatus.progress}% (${offlineStatus.bytesFormatted})`
                          : offlineStatus.status === 'completed'
                          ? `✓ Đã lưu (${offlineStatus.bytesFormatted || '14.8 MB'})`
                          : offlineLastMb
                          ? `Đã lưu: ${offlineLastMb} MB`
                          : `Đã sẵn sàng · Tối đa ${settings.offline_max_mb || 60}MB`}
                      </span>
                      {offlineStatus.status === 'downloading' && (
                        <div className="w-full max-w-[130px] h-1.5 bg-slate-200 dark:bg-purple-950 rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full bg-blue-600 transition-all duration-200"
                            style={{ width: `${offlineStatus.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('qbiz_clear_offline_cache'));
                          setOfflineLastMb('');
                        }}
                        className="h-7 px-2 rounded-[8px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-line text-[11px] font-bold hover:bg-slate-200 cursor-pointer shadow-2xs"
                        title="Dọn dẹp giải phóng bộ nhớ đệm"
                      >
                        Dọn dẹp
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('qbiz_start_offline_download'));
                        }}
                        disabled={offlineStatus.status === 'downloading'}
                        className="h-7 px-2.5 rounded-[8px] bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-extrabold flex items-center gap-1 hover:bg-blue-100 cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        <Download size={11} strokeWidth={2.5} />
                        <span>{offlineStatus.status === 'downloading' ? 'Đang tải...' : 'Tải ngay'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Chế độ Tiết kiệm dữ liệu di động (Data Saver) */}
                <label className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Activity size={15} className="text-amber-600 shrink-0" />
                    <span className="text-[13px] font-bold text-ink">
                      Tiết kiệm dữ liệu di động (4G/5G)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.data_saver_mode ?? false}
                    onChange={(e) => setSettings({ ...settings, data_saver_mode: e.target.checked })}
                    className="w-4.5 h-4.5 accent-amber-600 rounded cursor-pointer"
                  />
                </label>

                {/* 6. Nhắc nhở chỉnh tư thế & Uống nước thông minh */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors gap-2">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Sparkles size={15} className="text-teal-600 shrink-0" />
                      <span className="text-[13px] font-bold text-ink">
                        Nhắc nhở chỉnh tư thế & Uống nước
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.posture_reminder_enabled ?? true}
                      onChange={(e) => setSettings({ ...settings, posture_reminder_enabled: e.target.checked })}
                      className="w-4.5 h-4.5 accent-teal-600 rounded cursor-pointer"
                    />
                  </label>

                  {(settings.posture_reminder_enabled ?? true) && (
                    <div className="flex items-center justify-between pt-1 border-t border-line/60 text-[11.5px]">
                      <span className="font-bold text-muted">Chu kỳ nhắc nhở:</span>
                      <div className="flex items-center gap-1">
                        {([45, 60, 90] as const).map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setSettings({ ...settings, posture_reminder_interval: mins })}
                            className={`px-2 py-0.5 rounded-[7px] text-[11px] font-extrabold border transition-all cursor-pointer ${
                              (settings.posture_reminder_interval || 60) === mins
                                ? 'bg-teal-600 text-white border-teal-600 shadow-2xs'
                                : 'bg-white dark:bg-slate-800 text-ink border-line hover:border-teal-400'
                            }`}
                          >
                            {mins} phút
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 7. Lộ trình cá nhân hóa (Demo) - 3 câu chẩn đoán sơ bộ */}
                <label className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Compass size={15} className="text-violet-600 shrink-0" />
                    <span className="text-[13px] font-bold text-ink">
                      Lộ trình cá nhân hóa
                    </span>
                    <span className="text-[9.5px] font-black uppercase tracking-wider text-violet-700 bg-violet-100 border border-violet-200 dark:text-violet-300 dark:bg-violet-950/60 dark:border-violet-800 px-1.5 py-0.2 rounded-md">
                      Demo
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.enable_personalized_roadmap ?? true}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setSettings({ ...settings, enable_personalized_roadmap: enabled });
                      try {
                        localStorage.setItem('qbiz_enable_personalized_roadmap', String(enabled));
                        window.dispatchEvent(new CustomEvent('qbiz_roadmap_setting_changed', { detail: { enabled } }));
                      } catch {}
                    }}
                    className="w-4.5 h-4.5 accent-violet-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: DỮ LIỆU & BẢO MẬT */}
          {activeTab === 'du_lieu' && (
            <div className="flex flex-col gap-3">
              {/* Sao lưu 1 chạm */}
              <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-surface-2 border border-line">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink">
                    Sao lưu dữ liệu 1 chạm
                  </span>
                  <span className="text-[10px] font-extrabold text-muted">Định dạng JSON</span>
                </div>
                <button
                  type="button"
                  onClick={handleExportBackup}
                  disabled={isExporting}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-[10px] bg-primary text-white font-bold text-[13px] shadow-2xs cursor-pointer hover:bg-primary-dark"
                >
                  <Download size={15} />
                  <span>{isExporting ? 'Đang xuất tệp...' : 'Tải file sao lưu (JSON)'}</span>
                </button>
              </div>

              {/* Phục hồi dữ liệu từ bản sao lưu */}
              {isSuper && (
                <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-amber-500/5 dark:bg-amber-950/20 border border-amber-300/60 dark:border-amber-700/50">
                  <div className="flex items-center gap-1.5">
                    <RotateCcw size={15} className="text-amber-600 dark:text-amber-400" />
                    <span className="text-[13px] font-bold text-ink">
                      Phục hồi dữ liệu CSDL
                    </span>
                  </div>

                  {restoreError && (
                    <div className="p-2 rounded-[8px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-[12px] font-bold">
                      {restoreError}
                    </div>
                  )}

                  {restoreSuccess && (
                    <div className="p-2 rounded-[8px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[12px] font-bold">
                      {restoreSuccess}
                    </div>
                  )}

                  {/* Input chọn file ẩn */}
                  <input
                    ref={restoreFileInputRef}
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleSelectBackupFile}
                  />

                  {pendingRestoreData ? (
                    <div className="flex flex-col gap-2 p-2.5 rounded-[10px] bg-white dark:bg-[#1A1235] border border-amber-400/80 shadow-2xs">
                      <span className="text-[12px] font-bold text-amber-900 dark:text-amber-300">
                        Xác nhận dữ liệu phục hồi:
                      </span>
                      <ul className="text-[11.5px] text-slate-700 dark:text-slate-300 space-y-0.5 list-disc pl-4 font-medium">
                        <li>Chuyên đề: <strong>{pendingRestoreData.topics?.length || 0}</strong> · Bài học: <strong>{pendingRestoreData.pages?.length || 0}</strong></li>
                        <li>Khối nội dung: <strong>{pendingRestoreData.blocks?.length || 0}</strong></li>
                      </ul>
                      <div className="flex items-center gap-2 mt-0.5">
                        <button
                          type="button"
                          onClick={handleConfirmRestore}
                          disabled={isRestoring}
                          className="flex-1 flex items-center justify-center gap-1 h-9 rounded-[9px] bg-amber-600 hover:bg-amber-700 text-white font-bold text-[12.5px] cursor-pointer shadow-2xs disabled:opacity-50"
                        >
                          {isRestoring ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Đang khôi phục...</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw size={13} />
                              <span>Phục hồi ngay</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingRestoreData(null)}
                          disabled={isRestoring}
                          className="px-3 h-9 rounded-[9px] bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold text-[12px] cursor-pointer hover:bg-slate-300"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => restoreFileInputRef.current?.click()}
                      disabled={isRestoring}
                      className="flex items-center justify-center gap-1.5 h-10 rounded-[10px] bg-white dark:bg-white/5 border border-amber-400 text-amber-800 dark:text-amber-300 font-bold text-[13px] shadow-2xs cursor-pointer hover:bg-amber-50"
                    >
                      <Upload size={15} />
                      <span>Chọn file JSON để phục hồi</span>
                    </button>
                  )}
                </div>
              )}

              {/* Đổi mật khẩu Admin */}
              <div className="flex flex-col gap-2.5 p-3 rounded-[14px] bg-surface-2 border border-line">
                <div className="flex items-center gap-1.5">
                  <Key size={15} className="text-primary" />
                  <span className="text-[13px] font-bold text-ink">
                    Đổi mật khẩu quản trị (Admin)
                  </span>
                </div>

                {passwordError && (
                  <div className="p-2 rounded-[8px] bg-red-50 border border-red-200 text-red-700 text-[12px] font-bold">
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-2 rounded-[8px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-bold">
                    {passwordSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11.5px] font-bold text-ink">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Nhập mật khẩu đang dùng"
                      className="w-full h-9 px-3 rounded-[9px] border border-line text-[13px] text-ink focus:border-primary bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-bold text-ink">
                        Mật khẩu mới
                      </label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Tối thiểu 4 ký tự"
                        className="w-full h-9 px-3 rounded-[9px] border border-line text-[13px] text-ink focus:border-primary bg-white"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[11.5px] font-bold text-ink">
                        Nhập lại mật khẩu
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận lại"
                        className="w-full h-9 px-3 rounded-[9px] border border-line text-[13px] text-ink focus:border-primary bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={isChangingPassword || !newPassword}
                    className="mt-0.5 flex items-center justify-center gap-1.5 h-9 rounded-[9px] bg-primary text-white font-bold text-[12.5px] hover:bg-primary-dark cursor-pointer disabled:opacity-50 transition-colors"
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
              <div className="flex flex-col gap-2 pt-1 border-t border-line">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-1.5 h-10 rounded-[10px] bg-red-50 text-red-600 font-bold text-[13px] border border-red-200 hover:bg-red-100 cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>Thoát quyền quản trị (Đăng xuất)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: QUẢN LÝ GIẢNG VIÊN (CHỈ SUPER ADMIN) */}
          {activeTab === 'giang_vien' && isSuper && (
            <InstructorManagerSection />
          )}

          {/* TAB 5: QUẢN LÝ CƠ SỞ / KHÁCH HÀNG SAAS (CHỈ SUPER ADMIN) */}
          {activeTab === 'khach_hang' && isSuper && (
            <WorkspaceManagerSection />
          )}
        </div>


        {/* Footer */}
        <div className="p-3 px-4 sm:px-5 border-t border-line flex items-center justify-between bg-surface">
          <div>
            {saveSuccessMsg && (
              <span className="text-[12.5px] text-primary font-bold">
                ✓ {saveSuccessMsg}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-[10px] bg-surface-2 text-ink font-bold text-[13px] cursor-pointer"
            >
              Đóng
            </button>
            {activeTab !== 'giang_vien' && activeTab !== 'khach_hang' && (
              <button
                type="button"
                onClick={handleSaveSettings}
                className="flex items-center justify-center gap-1.5 h-10 px-4 sm:px-5 rounded-[10px] bg-primary text-white font-extrabold text-[13px] shadow-2xs cursor-pointer hover:bg-primary-dark"
              >
                <Save size={15} />
                <span>Lưu cài đặt</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
