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
  Sparkles,
  Bell,
  Search,
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
  initialAppSubtitle?: string | null;
  initialLogoUrl?: string | null;
  initialHotline?: string | null;
  initialZaloUrl?: string | null;
}

export default function HomeHeader({
  initialAppName,
  initialAppSubtitle = 'Kiến thức đúng · Sức khỏe bền vững',
  initialLogoUrl,
  initialHotline,
  initialZaloUrl,
}: HomeHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [appName, setAppName] = useState(initialAppName);
  const [appSubtitle, setAppSubtitle] = useState(initialAppSubtitle || 'Kiến thức đúng · Sức khỏe bền vững');
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [hotline, setHotline] = useState<string | null>(initialHotline || null);
  const [zaloUrl, setZaloUrl] = useState<string | null>(initialZaloUrl || null);
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
    setAppName(initialAppName);
    if (initialAppSubtitle) setAppSubtitle(initialAppSubtitle);
    if (initialLogoUrl) setLogoUrl(initialLogoUrl);
    if (initialHotline) setHotline(initialHotline);
    if (initialZaloUrl) setZaloUrl(initialZaloUrl);
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
        <div className="w-full flex items-center justify-between px-3.5 py-2 rounded-[14px] bg-black/90 text-white text-[13px] font-bold shadow-md -mb-1">
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

      {/* HEADER PHONG CÁCH IPHONE CHUẨN (HELLO + BRAND CARD) */}
      <header className="relative flex flex-col gap-2.5 pt-1">
        {/* DÒNG 1: "Hello, Dr. Anya!" + CHUÔNG XANH + KÍNH LÚP TÌM KIẾM + AVATAR VIỀN VÀNG KIM */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[17px] sm:text-[18px] font-black text-slate-900 tracking-tight">
                Hello, Dr. Tùng!
              </span>
              <button
                type="button"
                onClick={() => setShowPhoneSync(true)}
                className="w-5 h-5 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors relative"
                title="Thông báo & Đồng bộ tiến độ"
                aria-label="Thông báo"
              >
                <Bell size={15} fill="currentColor" />
                <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-blue-600" />
              </button>
            </div>
            <span className="text-[11px] sm:text-[11.5px] text-slate-500 font-medium">
              Kiến thức giải phẫu & Sức khỏe
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Kính lúp tìm kiếm */}
            <Link
              href="/tim-kiem"
              prefetch={true}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-2xs"
              title="Tìm kiếm bài học"
              aria-label="Tìm kiếm"
            >
              <Search size={18} strokeWidth={2.2} />
            </Link>

            {/* Avatar Bác sĩ / Quản trị viền vàng kim */}
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-b from-amber-300 via-amber-400 to-amber-600 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              title="Tài khoản & Quản trị"
              aria-label="Quản trị"
            >
              <img
                src={logoUrl || "/images/author_tung.png"}
                alt="Tác giả"
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* DÒNG 2: BRAND CARD NỔI BẬT ("MEDICA LEARN" STYLE) */}
        <div
          onClick={() => {
            if (isAdmin) setShowEditApp(true);
          }}
          className={`w-full rounded-[22px] bg-white border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.05)] p-3 sm:p-3.5 flex items-center justify-between gap-3 ${
            isAdmin ? 'cursor-pointer group' : ''
          }`}
          title={isAdmin ? 'Bấm để sửa tên & thương hiệu app' : undefined}
        >
          {/* Avatar Bác sĩ / Tác giả bên trái */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-sky-100 shadow-2xs shrink-0">
            <img
              src="/images/author_tung.png"
              alt="Tùng Dinh Dưỡng"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Khối chữ thương hiệu ở giữa */}
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[16px] sm:text-[17px] font-black tracking-tight text-slate-900 uppercase">
                {appName && appName !== 'QBIZ BOOK' && appName !== 'Sống Khỏe Mỗi Ngày' ? appName.split(' ')[0] : 'HỌC'}
              </span>
              <span className="text-[16px] sm:text-[17px] font-black tracking-tight text-blue-600 uppercase">
                {appName && appName !== 'QBIZ BOOK' && appName !== 'Sống Khỏe Mỗi Ngày' ? appName.split(' ').slice(1).join(' ') : 'CƠ THỂ'}
              </span>
              {isAdmin && <Edit2 size={12} className="text-primary opacity-60" />}
            </div>
            <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 mt-0.5">
              EMPOWERING MEDICAL KNOWLEDGE
            </span>
            <span className="text-[10.5px] sm:text-[11px] text-slate-600 font-medium line-clamp-1">
              {appSubtitle || 'Advanced Anatomy & Health'}
            </span>
          </div>

          {/* Huy hiệu Xanh Sapphire dát vàng kim bên phải (Royal Crest 1:1 theo ảnh mẫu) */}
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[15px] bg-gradient-to-br from-[#1E40AF] via-[#1D4ED8] to-[#0A1A4A] p-[2px] shadow-md border border-amber-300/60 shrink-0 flex items-center justify-center relative overflow-hidden">
            <div className="flex flex-col items-center justify-center text-amber-300">
              <svg className="w-5 h-5 text-amber-300 drop-shadow-[0_1px_3px_rgba(245,158,11,0.8)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" fillOpacity="0.25" />
                <path d="M3.5 12h3l2-3 3 6 2-3h7" stroke="white" strokeWidth="1.8" />
              </svg>
              <span className="text-[7px] font-black tracking-widest text-amber-200 uppercase mt-0.5">MEDICA</span>
            </div>
          </div>
        </div>

        {/* Dropdown Menu ⋮ Trang chủ */}
        {showMenu && (
          <div className="absolute top-[48px] right-0 w-[240px] bg-white rounded-[20px] border border-line shadow-xl p-2 flex flex-col gap-1 z-50 animate-in fade-in duration-150">
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
          initialSubtitle={appSubtitle}
          initialLogoUrl={logoUrl}
          initialHotline={hotline || ''}
          initialZaloUrl={zaloUrl || ''}
          onClose={() => setShowEditApp(false)}
          onSaved={(newName, newSubtitle, newLogo, newHotline, newZalo) => {
            setAppName(newName);
            setAppSubtitle(newSubtitle);
            setLogoUrl(newLogo);
            setHotline(newHotline);
            setZaloUrl(newZalo);
            window.location.reload();
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
