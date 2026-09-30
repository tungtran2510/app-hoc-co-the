'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  User,
  Settings,
  MoreVertical,
  Download,
  Smartphone,
  LogOut,
  Edit2,
  X,
  Sparkles,
} from 'lucide-react';
import { checkAdminStatus, logoutAdmin } from '../lib/adminAuth';
import { getStoredAppSettings } from '../lib/storage';
import AdminSettingsModal from './admin/AdminSettingsModal';
import EditAppModal from './admin/EditAppModal';
import PwaInstallModal from './PwaInstallModal';
import UserSyncModal from './UserSyncModal';
import { getUserPhone, LEARNING_PROGRESS_EVENT } from '../lib/userSync';

interface HomeHeaderProps {
  initialAppName: string;
}

export default function HomeHeader({ initialAppName }: HomeHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [appName, setAppName] = useState(initialAppName);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditApp, setShowEditApp] = useState(false);
  const [showPwaInstall, setShowPwaInstall] = useState(false);
  const [showPhoneSync, setShowPhoneSync] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    checkAdminStatus().then(({ isAdmin, supabaseOk }) => {
      setIsAdmin(isAdmin);
      setSupabaseOk(supabaseOk);
    });
    const stored = getStoredAppSettings();
    if (stored.app_name) {
      setAppName(stored.app_name);
    }
    const p = getUserPhone();
    setUserPhone(p);

    const handleUpdate = () => {
      setUserPhone(getUserPhone());
    };
    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

  const handleBackup = async () => {
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
    setIsAdmin(false);
    setShowMenu(false);
    window.location.reload();
  };

  return (
    <>
      {/* Thanh đen Admin ở Trang chủ (hiện khi là Admin) */}
      {isAdmin && (
        <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-[14px] bg-black/90 text-white text-[13px] font-bold shadow-md -mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                supabaseOk ? 'bg-emerald-400' : 'bg-red-400 animate-pulse'
              }`}
            />
            <span className={supabaseOk ? 'text-white/90' : 'text-red-300 font-extrabold'}>
              {supabaseOk
                ? 'Dữ liệu: Đã kết nối ✓'
                : 'Dữ liệu: CHƯA kết nối – nội dung sửa sẽ không được lưu'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleBackup}
              disabled={isExporting}
              className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer disabled:opacity-50"
              title="Tải file sao lưu dữ liệu"
            >
              <Download size={13} />
              <span>{isExporting ? 'Đang tải...' : 'Sao lưu'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowEditApp(true)}
              className="flex items-center gap-1 h-7 px-2.5 rounded-[8px] bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
              title="Đổi tên app và logo"
            >
              <Edit2 size={13} />
              <span>Đổi tên</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="h-7 px-2 rounded-[8px] bg-red-500/30 hover:bg-red-500/50 text-red-200 transition-colors cursor-pointer"
              title="Đăng xuất"
            >
              <LogOut size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Header chính */}
      <header className="relative flex items-center justify-between h-[52px]">
        {/* Tên App & Logo: khi là Admin bấm vào để sửa */}
        <div
          onClick={() => {
            if (isAdmin) setShowEditApp(true);
          }}
          className={`flex items-center gap-2.5 ${
            isAdmin ? 'cursor-pointer group' : ''
          }`}
          title={isAdmin ? 'Bấm để đổi tên app & logo' : undefined}
        >
          <div className="w-10 h-10 rounded-[12px] bg-primary flex items-center justify-center text-white shadow-xs overflow-hidden shrink-0">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <BookOpen size={22} strokeWidth={2.5} />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[20px] font-extrabold text-ink leading-tight">
              {appName}
            </span>
            {isAdmin && (
              <Edit2
                size={13}
                className="text-primary opacity-60 group-hover:opacity-100 transition-opacity"
              />
            )}
          </div>
        </div>

        {/* Các nút tùy chọn ở trên đầu */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Nút icon đồng bộ SĐT bé ở trên đầu */}
          <button
            type="button"
            onClick={() => setShowPhoneSync(true)}
            className="w-10 h-10 min-w-[40px] rounded-full bg-white border border-line flex items-center justify-center text-muted hover:text-primary transition-colors shadow-2xs cursor-pointer relative"
            title={userPhone ? `Đang đồng bộ SĐT: ${userPhone}` : 'Lưu tiến độ qua Số điện thoại'}
            aria-label="Lưu tiến độ qua Số điện thoại"
          >
            <Smartphone size={18} />
            {userPhone && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            )}
          </button>

          {/* Nút ⋮ Tùy chọn trang chủ */}
          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 min-w-[40px] rounded-full bg-white border border-line flex items-center justify-center text-ink hover:text-primary transition-colors shadow-2xs cursor-pointer"
            aria-label="Tùy chọn trang chủ"
          >
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Dropdown Menu ⋮ Trang chủ */}
        {showMenu && (
          <div className="absolute top-[58px] right-0 w-[240px] bg-white rounded-[20px] border border-line shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in duration-150">
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                setShowPhoneSync(true);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
            >
              <Smartphone size={16} className="text-primary" />
              <span>{userPhone ? 'Quản lý số điện thoại' : 'Lưu tiến độ qua SĐT'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                setShowPwaInstall(true);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
            >
              <Smartphone size={16} className="text-primary" />
              <span>Cài app ra màn hình</span>
            </button>

            {isAdmin ? (
              <>
                {/* Trạng thái kết nối Supabase */}
                <div
                  className={`px-3 py-2 rounded-[12px] text-[12px] font-extrabold flex items-center gap-2 ${
                    supabaseOk
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      supabaseOk ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
                    }`}
                  />
                  <span className="leading-tight">
                    {supabaseOk
                      ? 'Dữ liệu: Đã kết nối ✓'
                      : 'Dữ liệu: CHƯA kết nối – nội dung sửa sẽ không được lưu'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    handleBackup();
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
                >
                  <Download size={16} className="text-primary" />
                  <span>Sao lưu dữ liệu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowEditApp(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
                >
                  <Edit2 size={16} className="text-primary" />
                  <span>Sửa tên & logo app</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
                >
                  <Settings size={16} className="text-primary" />
                  <span>Cài đặt quản trị</span>
                </button>

                <Link
                  href="/tro-ly-ai"
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
                >
                  <Sparkles size={16} className="text-primary" />
                  <span>Huấn luyện Trợ lý AI</span>
                </Link>

                <div className="border-t border-line my-1" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <Link
                href="/dang-nhap"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-ink hover:bg-surface-2 cursor-pointer"
              >
                <User size={16} className="text-primary" />
                <span>Đăng nhập quản trị</span>
              </Link>
            )}
          </div>
        )}

        {/* Overlay đóng menu khi bấm ra ngoài */}
        {showMenu && (
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setShowMenu(false)}
          />
        )}
      </header>

      {/* Modal Sửa tên app & Logo */}
      {showEditApp && (
        <EditAppModal
          isOpen={true}
          initialName={appName}
          initialLogoUrl={logoUrl}
          onClose={() => setShowEditApp(false)}
          onSaved={(newName, newLogo) => {
            setAppName(newName);
            setLogoUrl(newLogo);
          }}
        />
      )}

      {/* Modal Cài đặt quản trị */}
      {showSettings && (
        <AdminSettingsModal
          isOpen={true}
          onClose={() => setShowSettings(false)}
          onSettingsSaved={() => {
            const stored = getStoredAppSettings();
            if (stored.app_name) setAppName(stored.app_name);
          }}
          onLogout={() => setIsAdmin(false)}
        />
      )}

      {/* Modal Cài app ra màn hình (PWA) */}
      {showPwaInstall && (
        <PwaInstallModal
          isOpen={true}
          onClose={() => setShowPwaInstall(false)}
        />
      )}

      {/* Modal Lưu tiến độ & Đồng bộ qua SĐT */}
      <UserSyncModal
        isOpen={showPhoneSync}
        onClose={() => setShowPhoneSync(false)}
        reason="manual"
        onSuccess={() => setUserPhone(getUserPhone())}
      />
    </>
  );
}
