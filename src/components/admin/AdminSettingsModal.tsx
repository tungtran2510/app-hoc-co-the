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
  Plus,
  Minus,
  LayoutGrid,
} from 'lucide-react';

function ToggleSwitch({
  checked,
  onChange,
  activeColor = 'bg-[#0E2A5C]',
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeColor?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? activeColor : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
import {
  getStoredAppSettings,
  saveStoredAppSettings,
  AppCustomSettings,
} from '../../lib/storage';
import { logoutAdmin, isSuperAdmin, checkAdminStatus } from '../../lib/adminAuth';
import { saveSettingsApi, getSettingsApi, changePasswordApi, getAdminHeaders, restoreBackupApi } from '../../lib/apiAdmin';
import InstructorManagerSection from './InstructorManagerSection';
import WorkspaceManagerSection from './WorkspaceManagerSection';

const DEFAULT_ROADMAP_CONFIG = {
  neck: [
    {
      title: 'Đốt sống cổ và góc áp lực đầu cúi',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'cau-tao-co-ban-dot-song',
      tag: 'Bài 01',
      reason: 'Bảo vệ cổ gáy',
    },
    {
      title: 'Cơ gân & dây chằng vùng cổ gáy',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'co-gan-va-day-chang',
      tag: 'Bài 02',
      reason: 'Giải tỏa co thắt',
    },
    {
      title: 'Tư thế làm việc văn phòng chuẩn',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'tu-the-va-van-dong',
      tag: 'Bài 03',
      reason: 'Chỉnh dáng làm việc',
    },
  ],
  lumbar: [
    {
      title: 'Cấu tạo cơ bản đốt sống thắt lưng',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'cau-tao-co-ban-dot-song',
      tag: 'Bài 01',
      reason: 'Trục chịu lực',
    },
    {
      title: 'Đĩa đệm và cơ chế giảm xóc cột sống',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'dia-dem-va-chuc-nang-giam-xoc',
      tag: 'Bài 02',
      reason: 'Bảo vệ đĩa đệm',
    },
    {
      title: 'Tư thế ngồi và giảm tải cột sống',
      topicSlug: 'chuyen-de-cot-song',
      pageSlug: 'tu-the-va-van-dong',
      tag: 'Bài 03',
      reason: 'Ứng dụng thực tế',
    },
  ],
  water: [
    {
      title: 'Vai trò tối thượng của nước với tế bào',
      topicSlug: 'chuyen-de-nuoc',
      pageSlug: 'vai-tro-cua-nuoc-voi-co-the',
      tag: 'Bài 01',
      reason: 'Trao đổi chất',
    },
    {
      title: 'Nước và sức khỏe đĩa đệm cột sống',
      topicSlug: 'chuyen-de-nuoc',
      pageSlug: 'nuoc-va-dia-dem-cot-song',
      tag: 'Bài 02',
      reason: 'Nuôi đĩa đệm',
    },
    {
      title: 'Quy tắc bổ sung nước & điện giải',
      topicSlug: 'chuyen-de-nuoc',
      pageSlug: 'uong-nuoc-dung-cach',
      tag: 'Bài 03',
      reason: 'Thực hành hằng ngày',
    },
  ],
};

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
  const [selectedRoadmapArea, setSelectedRoadmapArea] = useState<'neck' | 'lumbar' | 'water'>('neck');

  // Trạng thái mở rộng tấm chi tiết (Accordion)
  const [expandedSections, setExpandedSections] = useState<{
    roadmap?: boolean;
    ebook?: boolean;
    offline?: boolean;
    reminder?: boolean;
  }>({});

  const toggleExpand = (key: 'roadmap' | 'ebook' | 'offline' | 'reminder') => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      getSettingsApi().then((res) => {
        if (res.success && res.settings) {
          setSettings((prev) => ({
            ...prev,
            home_topics_display: res.settings.home_topics_display || prev.home_topics_display || 'card',
          }));
        }
      }).catch(() => {});
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
        home_topics_display: settings.home_topics_display || 'card',
        author_profile: {
          phone: settings.hotline?.trim() || null,
          zalo_url: settings.zalo_url?.trim() || null,
        },
        block_styles: {
          theme_palette: settings.theme_palette || 'indigo',
          home_topics_display: settings.home_topics_display || 'card',
          enable_personalized_roadmap: settings.enable_personalized_roadmap,
          custom_roadmap: settings.custom_roadmap,
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
              {/* Bảng màu giao diện - Tinh gọn 1 dòng 3 lựa chọn */}
              <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-surface-2 border border-line">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                    <Sparkles size={15} className="text-primary" />
                    <span>Bảng màu giao diện</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20">
                    {settings.theme_palette === 'navy_luxury' ? 'Xanh Navy' : settings.theme_palette === 'minimal' ? 'Tối Giản' : 'Chàm Y Khoa'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                  {/* Tông 1: Chàm Y Khoa (Mặc định) */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...settings, theme_palette: 'indigo' as const };
                      setSettings(next);
                      try {
                        localStorage.setItem('qbiz_theme_palette', 'indigo');
                        document.documentElement.classList.remove('theme-navy-luxury', 'theme-minimal');
                        window.dispatchEvent(new CustomEvent('qbiz_theme_palette_changed', { detail: { palette: 'indigo' } }));
                      } catch {}
                    }}
                    className={`h-11 px-2 rounded-[11px] border-2 flex items-center gap-1.5 transition-all cursor-pointer text-left ${
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
                      <span className="text-[11.5px] font-extrabold text-ink truncate block">Chàm</span>
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
                        document.documentElement.classList.remove('theme-minimal');
                        window.dispatchEvent(new CustomEvent('qbiz_theme_palette_changed', { detail: { palette: 'navy_luxury' } }));
                      } catch {}
                    }}
                    className={`h-11 px-2 rounded-[11px] border-2 flex items-center gap-1.5 transition-all cursor-pointer text-left ${
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
                      <span className="text-[11.5px] font-extrabold text-[#0E2A5C] truncate block">Navy</span>
                    </div>
                  </button>

                  {/* Tông 3: Tối Giản / Cơ Bản */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...settings, theme_palette: 'minimal' as const };
                      setSettings(next);
                      try {
                        localStorage.setItem('qbiz_theme_palette', 'minimal');
                        document.documentElement.classList.add('theme-minimal');
                        document.documentElement.classList.remove('theme-navy-luxury');
                        window.dispatchEvent(new CustomEvent('qbiz_theme_palette_changed', { detail: { palette: 'minimal' } }));
                      } catch {}
                    }}
                    className={`h-11 px-2 rounded-[11px] border-2 flex items-center gap-1.5 transition-all cursor-pointer text-left ${
                      settings.theme_palette === 'minimal'
                        ? 'bg-white border-[#1E293B] shadow-2xs ring-2 ring-[#64748B]/30'
                        : 'bg-white/70 border-line hover:border-slate-300'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#1E293B] via-[#475569] to-[#94A3B8] flex items-center justify-center shrink-0 shadow-2xs border border-white">
                      {settings.theme_palette === 'minimal' && (
                        <Check size={12} className="text-white stroke-[3]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11.5px] font-extrabold text-[#1E293B] truncate block">Tối giản</span>
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

              {/* Bố cục chuyên đề mặc định (cho khách) */}
              <div className="flex flex-col gap-2 p-3 rounded-[14px] bg-surface-2 border border-line">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-ink flex items-center gap-1.5">
                    <LayoutGrid size={15} className="text-primary shrink-0" />
                    <span className="truncate">Bố cục chuyên đề mặc định (cho khách)</span>
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary-soft text-primary border border-primary/20 shrink-0">
                    {settings.home_topics_display === 'catalog' ? '3 cột' : settings.home_topics_display === 'logo' ? 'Danh sách' : settings.home_topics_display === 'large' ? 'Khung to' : 'Lưới bìa'}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { value: 'card' as const, label: 'Lưới bìa' },
                    { value: 'catalog' as const, label: '3 cột' },
                    { value: 'logo' as const, label: 'Danh sách' },
                    { value: 'large' as const, label: 'Khung to' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSettings({ ...settings, home_topics_display: opt.value })}
                      className={`h-9 px-1 rounded-[9px] font-extrabold text-[11.5px] border transition-all cursor-pointer truncate ${
                        (settings.home_topics_display || 'card') === opt.value
                          ? 'bg-primary text-white border-primary shadow-2xs'
                          : 'bg-white text-ink border-line hover:border-primary/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10.5px] text-muted leading-tight">
                  Áp dụng làm kiểu xem chuyên đề ban đầu khi khách & học viên mới truy cập trang chủ.
                </p>
              </div>

              {/* Nhóm tùy chọn hiển thị & trải nghiệm - Tinh gọn, chuẩn Apple iOS card dạng tấm mở rộng */}
              <div className="flex flex-col rounded-[15px] bg-surface-2 border border-line divide-y divide-line/70 overflow-hidden">
                {/* 1. Tự động chuyển video */}
                <div className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <PlayCircle size={15} className="text-primary shrink-0" />
                    <span className="text-[13px] font-bold text-ink truncate">
                      Tự động phát video kế tiếp
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.auto_next_video}
                    onChange={(val) => setSettings({ ...settings, auto_next_video: val })}
                    activeColor="bg-primary"
                  />
                </div>

                {/* 2. Thanh tiến độ học tập */}
                <div className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <Activity size={15} className="text-primary shrink-0" />
                    <span className="text-[13px] font-bold text-ink truncate">
                      Hiện thanh tiến độ học tập (%)
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.show_progress_bar}
                    onChange={(val) => setSettings({ ...settings, show_progress_bar: val })}
                    activeColor="bg-primary"
                  />
                </div>

                {/* 3. Cầu nối đọc sách (Ebook) - Dạng tấm Accordion */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <BookOpen size={15} className="text-emerald-600 shrink-0" />
                      <span className="text-[13px] font-bold text-ink truncate">
                        Cầu nối đọc sách (Ebook)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ToggleSwitch
                        checked={settings.show_ebook_bridge ?? true}
                        onChange={(val) => setSettings({ ...settings, show_ebook_bridge: val })}
                        activeColor="bg-emerald-600"
                      />
                      <button
                        type="button"
                        onClick={() => toggleExpand('ebook')}
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 ${
                          expandedSections.ebook
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        title={expandedSections.ebook ? 'Thu gọn' : 'Mở rộng cài đặt'}
                        aria-label="Mở rộng cài đặt Ebook"
                      >
                        {expandedSections.ebook ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>

                  {/* Tấm con mở rộng: Địa chỉ URL Ebook (chỉ hiện khi ấn dấu +) */}
                  {expandedSections.ebook && (
                    <div className="mt-2.5 pt-2.5 border-t border-line/60 flex items-center gap-2 animate-in fade-in duration-150">
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

                {/* 4. Quản trị Bộ nhớ & Tự động tải Offline - Dạng tấm Accordion */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <CloudDownload size={15} className="text-blue-600 shrink-0" />
                      <span className="text-[13px] font-bold text-ink truncate">
                        Tự động tải Offline (sau 2p)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ToggleSwitch
                        checked={settings.auto_offline_cache ?? true}
                        onChange={(val) => setSettings({ ...settings, auto_offline_cache: val })}
                        activeColor="bg-blue-600"
                      />
                      <button
                        type="button"
                        onClick={() => toggleExpand('offline')}
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 ${
                          expandedSections.offline
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        title={expandedSections.offline ? 'Thu gọn' : 'Mở rộng cài đặt'}
                        aria-label="Mở rộng cài đặt bộ nhớ Offline"
                      >
                        {expandedSections.offline ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>

                  {/* Tấm con mở rộng: Hạn mức MB & Nút tải ngay/dọn dẹp (chỉ hiện khi ấn dấu +) */}
                  {expandedSections.offline && (
                    <div className="mt-2.5 pt-2.5 border-t border-line/60 flex flex-col gap-2.5 animate-in fade-in duration-150">
                      {/* Tùy chọn giới hạn dung lượng tải về */}
                      <div className="flex items-center justify-between text-[11.5px]">
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
                            <div className="w-full max-w-[130px] h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mt-1">
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
                  )}
                </div>

                {/* 5. Chế độ Tiết kiệm dữ liệu di động (Data Saver) */}
                <div className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <Activity size={15} className="text-amber-600 shrink-0" />
                    <span className="text-[13px] font-bold text-ink truncate">
                      Tiết kiệm dữ liệu di động (4G/5G)
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.data_saver_mode ?? false}
                    onChange={(val) => setSettings({ ...settings, data_saver_mode: val })}
                    activeColor="bg-amber-600"
                  />
                </div>

                {/* 6. Nhắc nhở chỉnh tư thế & Uống nước thông minh - Dạng tấm Accordion */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                      <Sparkles size={15} className="text-teal-600 shrink-0" />
                      <span className="text-[13px] font-bold text-ink truncate">
                        Nhắc nhở tư thế & Nước
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ToggleSwitch
                        checked={settings.posture_reminder_enabled ?? true}
                        onChange={(val) => setSettings({ ...settings, posture_reminder_enabled: val })}
                        activeColor="bg-teal-600"
                      />
                      <button
                        type="button"
                        onClick={() => toggleExpand('reminder')}
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 ${
                          expandedSections.reminder
                            ? 'bg-teal-600 text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        title={expandedSections.reminder ? 'Thu gọn' : 'Mở rộng cài đặt'}
                        aria-label="Mở rộng cài đặt nhắc nhở"
                      >
                        {expandedSections.reminder ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>

                  {/* Tấm con mở rộng: Chọn chu kỳ 45/60/90 phút (chỉ hiện khi ấn dấu +) */}
                  {expandedSections.reminder && (
                    <div className="mt-2.5 pt-2.5 border-t border-line/60 flex items-center justify-between text-[11.5px] animate-in fade-in duration-150">
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

                {/* 7. Lộ trình cá nhân hóa (Tùy chỉnh 3 bài định hướng) - Dạng tấm Accordion */}
                <div className="flex flex-col p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-2">
                      <Compass size={15} className="text-[#0E2A5C] dark:text-blue-400 shrink-0" />
                      <span className="text-[13px] font-bold text-ink truncate">
                        Lộ trình cá nhân hóa
                      </span>
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#0E2A5C] bg-[#0E2A5C]/10 border border-[#0E2A5C]/20 dark:text-blue-300 dark:bg-blue-950/60 dark:border-blue-800 px-1 py-0.2 rounded shrink-0">
                        Demo
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <ToggleSwitch
                        checked={settings.enable_personalized_roadmap ?? true}
                        onChange={(enabled) => {
                          setSettings({ ...settings, enable_personalized_roadmap: enabled });
                          try {
                            localStorage.setItem('qbiz_enable_personalized_roadmap', String(enabled));
                            window.dispatchEvent(new CustomEvent('qbiz_roadmap_setting_changed', { detail: { enabled } }));
                          } catch {}
                        }}
                        activeColor="bg-[#0E2A5C]"
                      />
                      <button
                        type="button"
                        onClick={() => toggleExpand('roadmap')}
                        className={`w-7 h-7 rounded-[8px] flex items-center justify-center font-bold transition-all cursor-pointer shrink-0 ${
                          expandedSections.roadmap
                            ? 'bg-[#0E2A5C] text-white shadow-2xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                        title={expandedSections.roadmap ? 'Thu gọn' : 'Mở rộng cài đặt'}
                        aria-label="Mở rộng cài đặt lộ trình cá nhân hóa"
                      >
                        {expandedSections.roadmap ? <Minus size={14} strokeWidth={2.5} /> : <Plus size={14} strokeWidth={2.5} />}
                      </button>
                    </div>
                  </div>

                  {/* Tấm con mở rộng: Bảng tùy chỉnh 3 bài học cho từng vùng khi ấn dấu + */}
                  {expandedSections.roadmap && (
                    <div className="mt-2.5 pt-2.5 border-t border-line/60 flex flex-col gap-2.5 animate-in fade-in duration-150">
                      {/* Bộ chọn 3 vùng cơ thể */}
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-muted shrink-0">Chọn vùng:</span>
                        <div className="grid grid-cols-3 gap-1 flex-1">
                          {[
                            { key: 'neck' as const, label: 'Cổ gáy' },
                            { key: 'lumbar' as const, label: 'Thắt lưng' },
                            { key: 'water' as const, label: 'Nước' },
                          ].map((tab) => (
                            <button
                              key={tab.key}
                              type="button"
                              onClick={() => setSelectedRoadmapArea(tab.key)}
                              className={`py-1 px-1.5 rounded-[7px] text-[11px] font-bold border transition-all cursor-pointer text-center truncate ${
                                selectedRoadmapArea === tab.key
                                  ? 'bg-[#0E2A5C] text-white border-[#0E2A5C] shadow-2xs'
                                  : 'bg-white dark:bg-slate-800 text-ink border-line hover:border-slate-400'
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Header danh sách bài & Nút khôi phục chuẩn */}
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="font-extrabold text-[#0E2A5C] dark:text-blue-400">
                          3 bài học định hướng ({selectedRoadmapArea === 'neck' ? 'Cổ gáy' : selectedRoadmapArea === 'lumbar' ? 'Thắt lưng' : 'Nước & tế bào'}):
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const currentMap = { ...(settings.custom_roadmap || DEFAULT_ROADMAP_CONFIG) };
                            currentMap[selectedRoadmapArea] = DEFAULT_ROADMAP_CONFIG[selectedRoadmapArea];
                            setSettings({ ...settings, custom_roadmap: currentMap });
                          }}
                          className="flex items-center gap-1 text-[10.5px] font-bold text-muted hover:text-[#0E2A5C] cursor-pointer"
                          title="Khôi phục 3 bài gợi ý chuẩn y khoa"
                        >
                          <RotateCcw size={11} />
                          <span>Đặt lại chuẩn</span>
                        </button>
                      </div>

                      {/* 3 Form bài học tương ứng */}
                      <div className="flex flex-col gap-2">
                        {(settings.custom_roadmap?.[selectedRoadmapArea] || DEFAULT_ROADMAP_CONFIG[selectedRoadmapArea]).map((lesson, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-[9px] bg-white dark:bg-slate-800/80 border border-line flex flex-col gap-1.5 shadow-2xs"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-[#0E2A5C] bg-[#0E2A5C]/10 dark:text-blue-300 dark:bg-blue-950 px-1.5 py-0.5 rounded">
                                Bài {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                              </span>
                              <input
                                type="text"
                                value={lesson.reason}
                                onChange={(e) => {
                                  const currentMap = { ...(settings.custom_roadmap || DEFAULT_ROADMAP_CONFIG) };
                                  const list = [...(currentMap[selectedRoadmapArea] || DEFAULT_ROADMAP_CONFIG[selectedRoadmapArea])];
                                  list[idx] = { ...list[idx], reason: e.target.value };
                                  currentMap[selectedRoadmapArea] = list;
                                  setSettings({ ...settings, custom_roadmap: currentMap });
                                }}
                                placeholder="Lý do gợi ý (ngắn)"
                                className="h-6 px-1.5 rounded-[5px] border border-line text-[11px] text-right font-medium text-muted focus:text-ink focus:border-[#0E2A5C] bg-surface-2"
                              />
                            </div>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => {
                                const currentMap = { ...(settings.custom_roadmap || DEFAULT_ROADMAP_CONFIG) };
                                const list = [...(currentMap[selectedRoadmapArea] || DEFAULT_ROADMAP_CONFIG[selectedRoadmapArea])];
                                list[idx] = { ...list[idx], title: e.target.value };
                                currentMap[selectedRoadmapArea] = list;
                                setSettings({ ...settings, custom_roadmap: currentMap });
                              }}
                              placeholder="Tiêu đề bài học..."
                              className="h-7 px-2 rounded-[6px] border border-line text-[12px] font-bold text-ink focus:border-[#0E2A5C] bg-white dark:bg-slate-900"
                            />
                            <div className="grid grid-cols-2 gap-1 text-[10.5px]">
                              <input
                                type="text"
                                value={lesson.topicSlug}
                                onChange={(e) => {
                                  const currentMap = { ...(settings.custom_roadmap || DEFAULT_ROADMAP_CONFIG) };
                                  const list = [...(currentMap[selectedRoadmapArea] || DEFAULT_ROADMAP_CONFIG[selectedRoadmapArea])];
                                  list[idx] = { ...list[idx], topicSlug: e.target.value };
                                  currentMap[selectedRoadmapArea] = list;
                                  setSettings({ ...settings, custom_roadmap: currentMap });
                                }}
                                placeholder="Slug chuyên đề"
                                className="h-6 px-1.5 rounded-[5px] border border-line text-[10.5px] font-mono text-muted focus:text-ink focus:border-[#0E2A5C] bg-surface-2"
                              />
                              <input
                                type="text"
                                value={lesson.pageSlug}
                                onChange={(e) => {
                                  const currentMap = { ...(settings.custom_roadmap || DEFAULT_ROADMAP_CONFIG) };
                                  const list = [...(currentMap[selectedRoadmapArea] || DEFAULT_ROADMAP_CONFIG[selectedRoadmapArea])];
                                  list[idx] = { ...list[idx], pageSlug: e.target.value };
                                  currentMap[selectedRoadmapArea] = list;
                                  setSettings({ ...settings, custom_roadmap: currentMap });
                                }}
                                placeholder="Slug bài học"
                                className="h-6 px-1.5 rounded-[5px] border border-line text-[10.5px] font-mono text-muted focus:text-ink focus:border-[#0E2A5C] bg-surface-2"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 8. Nút Hỏi Tùng Dinh Dưỡng qua Zalo (ở cuối bài học) */}
                <div className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <div className="w-4 h-4 rounded bg-[#0068FF] text-white flex items-center justify-center font-black text-[9px] shrink-0">
                      Z
                    </div>
                    <span className="text-[13px] font-bold text-ink truncate">
                      Nút "Hỏi Tùng Dinh Dưỡng qua Zalo" (cuối bài)
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.show_zalo_ask_card ?? true}
                    onChange={(enabled) => {
                      setSettings({ ...settings, show_zalo_ask_card: enabled });
                      try {
                        localStorage.setItem('qbiz_show_zalo_ask_card', String(enabled));
                        window.dispatchEvent(new CustomEvent('qbiz_show_zalo_changed', { detail: { enabled } }));
                      } catch {}
                    }}
                    activeColor="bg-[#0068FF]"
                  />
                </div>

                {/* 9. Thẻ Ôn tập 1 chạm Flashcards (ở cuối bài học) */}
                <div className="flex items-center justify-between p-3 hover:bg-surface/50 transition-colors">
                  <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
                    <Sparkles size={15} className="text-amber-500 shrink-0" />
                    <span className="text-[13px] font-bold text-ink truncate">
                      Thẻ "Ôn tập 1 chạm Flashcards" (cuối bài)
                    </span>
                  </div>
                  <ToggleSwitch
                    checked={settings.show_lesson_flashcards ?? true}
                    onChange={(enabled) => {
                      setSettings({ ...settings, show_lesson_flashcards: enabled });
                      try {
                        localStorage.setItem('qbiz_show_lesson_flashcards', String(enabled));
                        window.dispatchEvent(new CustomEvent('qbiz_show_flashcards_changed', { detail: { enabled } }));
                      } catch {}
                    }}
                    activeColor="bg-amber-500"
                  />
                </div>
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
