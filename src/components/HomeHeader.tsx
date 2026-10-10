'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { playTapSound } from '../lib/audioFeedback';
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
  Sun,
  Moon,
  Users,
  Building2,
} from 'lucide-react';
import { checkAdminStatus, logoutAdmin, isSuperAdmin, getAdminTokenClient } from '../lib/adminAuth';
import { getStoredAppSettings } from '../lib/storage';
import AdminSettingsModal from './admin/AdminSettingsModal';
import EditAppModal from './admin/EditAppModal';
import PwaInstallModal from './PwaInstallModal';
import UserSyncModal from './UserSyncModal';
import { getUserPhone, LEARNING_PROGRESS_EVENT } from '../lib/userSync';

interface HomeHeaderProps {
  initialAppName: string;
  initialAppSubtitle?: string | null;
  initialBrandTagline?: string | null;
  initialLogoUrl?: string | null;
  initialHotline?: string | null;
  initialZaloUrl?: string | null;
}

export default function HomeHeader({
  initialAppName,
  initialAppSubtitle,
  initialBrandTagline,
  initialLogoUrl,
  initialHotline,
  initialZaloUrl,
}: HomeHeaderProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [supabaseOk, setSupabaseOk] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [appName, setAppName] = useState(initialAppName || '');
  const [appSubtitle, setAppSubtitle] = useState(initialAppSubtitle ?? '');
  const [brandTagline, setBrandTagline] = useState(initialBrandTagline ?? '');
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [hotline, setHotline] = useState<string | null>(initialHotline || null);
  const [zaloUrl, setZaloUrl] = useState<string | null>(initialZaloUrl || null);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'chung' | 'trai_nghiem' | 'du_lieu' | 'giang_vien' | 'khach_hang'>('chung');

  const [showEditApp, setShowEditApp] = useState(false);
  const [showPwaInstall, setShowPwaInstall] = useState(false);
  const [showPhoneSync, setShowPhoneSync] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const [userName, setUserName] = useState<string>('bạn');
  const [showNameModal, setShowNameModal] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const router = useRouter();

  // Đảm bảo lời chào luôn tinh gọn trên 1 dòng duy nhất, không rớt dòng
  const getDisplayGreeting = (name: string) => {
    if (!name || name === 'bạn') return 'bạn';
    if (/quản trị viên/i.test(name) || /admin/i.test(name)) return 'Quản trị viên';
    if (name.length > 14) return name.slice(0, 12) + '...';
    return name;
  };

  useEffect(() => {
    router.prefetch('/dang-nhap');
    router.prefetch('/tro-ly-ai');
  }, [router]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('giao_dien');
      const darkActive = stored === 'dark' || (!stored && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(darkActive);
      if (darkActive) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      const targetColor = darkActive ? '#0C0817' : '#FFFFFF';
      let m = document.getElementById('app-theme-color') as HTMLMetaElement | null;
      if (!m) m = document.querySelector('meta[name="theme-color"]');
      if (!m) {
        m = document.createElement('meta');
        m.id = 'app-theme-color';
        m.name = 'theme-color';
        document.head.appendChild(m);
      }
      m.setAttribute('content', targetColor);
      m.removeAttribute('media');
      const allMetas = document.querySelectorAll('meta[name="theme-color"]');
      allMetas.forEach((el) => {
        if (el !== m) el.remove();
      });
    } catch {
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    try {
      if (nextDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('giao_dien', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('giao_dien', 'light');
      }
      const targetColor = nextDark ? '#0C0817' : '#FFFFFF';
      let m = document.getElementById('app-theme-color') as HTMLMetaElement | null;
      if (!m) m = document.querySelector('meta[name="theme-color"]');
      if (!m) {
        m = document.createElement('meta');
        m.id = 'app-theme-color';
        m.name = 'theme-color';
        document.head.appendChild(m);
      }
      m.setAttribute('content', targetColor);
      m.removeAttribute('media');
      const allMetas = document.querySelectorAll('meta[name="theme-color"]');
      allMetas.forEach((el) => {
        if (el !== m) el.remove();
      });
      window.dispatchEvent(new Event('giao_dien_changed'));
    } catch {}
  };

  useEffect(() => {
    checkAdminStatus().then(({ isAdmin, supabaseOk, user }) => {
      setIsAdmin(isAdmin);
      setSupabaseOk(supabaseOk);
      setAdminUser(user);
    });
    setAppName(initialAppName || '');
    setAppSubtitle(initialAppSubtitle ?? '');
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

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('app_user_display_name');
      if (savedName && savedName.trim()) {
        setUserName(savedName.trim());
      }
    } catch {}
  }, []);

  const handleSaveName = () => {
    const trimmed = nameInput.trim();
    if (trimmed) {
      setUserName(trimmed);
      try {
        localStorage.setItem('app_user_display_name', trimmed);
        window.dispatchEvent(new CustomEvent('app_user_name_changed', { detail: { name: trimmed } }));
      } catch {}
    } else {
      setUserName('bạn');
      try {
        localStorage.removeItem('app_user_display_name');
      } catch {}
    }
    setShowNameModal(false);
  };

  const handleBackup = async () => {
    try {
      setIsExporting(true);
      const token = getAdminTokenClient();
      const headers: Record<string, string> = {};
      if (token) headers['x-admin-token'] = token;
      const res = await fetch('/api/admin/sao-luu', { headers });
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
      {/* Thanh đen Admin ở Trang chủ (hiện khi là Admin - to rõ, sang trọng, ổn định trên 1 dòng) */}
      {isAdmin && (
        <div className="w-full flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-[14px] bg-slate-950/95 dark:bg-[#120A24] text-white border border-white/10 shadow-md mb-0.5 overflow-hidden gap-1.5">
          {/* Trạng thái hệ thống */}
          <div className="flex items-center gap-2 shrink-0 min-w-0">
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-xs ${
                supabaseOk ? 'bg-emerald-400 shadow-emerald-400/50' : 'bg-red-400 animate-pulse'
              }`}
            />
            <span className="text-[13px] sm:text-[14px] font-black text-white/95 tracking-tight truncate">
              {isSuperAdmin(adminUser)
                ? (supabaseOk ? 'Quản trị viên' : 'Chưa kết nối')
                : `Giảng viên: ${adminUser?.name || 'Giảng viên'}`}
            </span>
          </div>

          {/* Các nút hành động to rõ, hiển thị chữ đầy đủ trên 1 dòng */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isSuperAdmin(adminUser) && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsTab('giang_vien');
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-1.5 h-7.5 sm:h-8 px-2.5 sm:px-3 rounded-[8px] bg-primary hover:bg-primary-dark text-white transition-all cursor-pointer text-[12px] sm:text-[12.5px] font-bold shrink-0 shadow-2xs"
                  title="Phân quyền & Quản lý Giảng viên"
                >
                  <Users size={13} strokeWidth={2.4} />
                  <span>Giảng viên</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSettingsTab('chung');
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-1.5 h-7.5 sm:h-8 px-2.5 sm:px-3 rounded-[8px] bg-white/15 hover:bg-white/25 active:bg-white/30 text-white transition-all cursor-pointer text-[12px] sm:text-[12.5px] font-bold shrink-0 shadow-2xs"
                  title="Cài đặt quản trị"
                >
                  <Settings size={13} strokeWidth={2.4} />
                  <span>Cài đặt</span>
                </button>
              </>
            )}


            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1 h-7.5 sm:h-8 px-2 sm:px-2.5 rounded-[8px] bg-red-500/25 hover:bg-red-500/40 text-red-200 transition-all cursor-pointer shrink-0 text-[12px] font-bold shadow-2xs"
              title="Đăng xuất khỏi chế độ Quản trị"
              aria-label="Đăng xuất"
            >
              <LogOut size={13} strokeWidth={2.4} />
              <span className="hidden xs:inline">Thoát</span>
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
              <button
                type="button"
                onClick={() => {
                  setNameInput(userName === 'bạn' ? '' : userName);
                  setShowNameModal(true);
                }}
                className="flex items-center gap-1.5 text-left group cursor-pointer hover:opacity-90 transition-opacity"
                title="Bấm để đổi tên của bạn"
              >
                <div className="flex items-center gap-1.5 flex-nowrap animate-greeting-bounce">
                  <span className="text-[20px] min-[390px]:text-[22px] font-black text-ink tracking-tight leading-tight group-hover:text-[#1E3A8A] dark:group-hover:text-purple-300 transition-colors whitespace-nowrap truncate max-w-[185px] min-[390px]:max-w-[215px]">
                    Hi, {getDisplayGreeting(userName)}!
                  </span>
                  {/* 1 biểu tượng duy nhất ngay cạnh tên: Chuông thông báo & Đồng bộ */}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowPhoneSync(true);
                    }}
                    className="w-5.5 h-5.5 rounded-full bg-blue-50 dark:bg-purple-950/60 border border-blue-200/60 dark:border-purple-800/50 flex items-center justify-center text-[#1E3A8A] dark:text-purple-200 relative hover:scale-110 transition-transform cursor-pointer shrink-0"
                    title="Thông báo & Đồng bộ tiến độ học tập"
                    aria-label="Thông báo"
                  >
                    <Bell size={13} fill="currentColor" />
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1 ring-white dark:ring-[#0C0817]" />
                  </span>
                </div>
              </button>
            </div>
            <span className="mt-0.5 text-[11.5px] sm:text-[12px] text-muted font-medium tracking-[0.005em]">
              {appSubtitle?.trim() || 'Hiểu cơ thể, sống khỏe mỗi ngày'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Kính lúp tìm kiếm */}
            <Link
              href="/tim-kiem"
              onClick={() => {
                playTapSound();
                if (typeof window !== 'undefined') {
                  window.location.href = '/tim-kiem';
                }
              }}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1E1342] hover:bg-slate-100 dark:hover:bg-[#281855] border border-slate-200 dark:border-purple-800/40 flex items-center justify-center text-[#1E3A8A] dark:text-purple-200 transition-colors shadow-2xs"
              title="Tìm kiếm bài học"
              aria-label="Tìm kiếm"
            >
              <Search size={18} strokeWidth={2.2} />
            </Link>

            {/* Nút chuyển chế độ Sáng / Tối trực tiếp 1 chạm */}
            <button
              type="button"
              onClick={toggleTheme}
              className="w-9 h-9 rounded-full bg-white dark:bg-[#1E1342] hover:bg-amber-50 dark:hover:bg-[#281855] border border-amber-200/70 dark:border-purple-800/40 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
              title={isDark ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
              aria-label="Chuyển chế độ Sáng / Tối"
            >
              {isDark ? <Sun size={18} strokeWidth={2.2} className="text-amber-400" /> : <Moon size={18} strokeWidth={2.2} className="text-amber-500 fill-amber-500/20" />}
            </button>

            {/* Avatar Bác sĩ / Quản trị viền Navy sang trọng */}
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-b from-blue-300 via-[#1E3A8A] to-blue-950 shadow-sm cursor-pointer hover:scale-105 transition-transform"
              title="Tài khoản & Quản trị"
              aria-label="Quản trị"
            >
              <img
                src={logoUrl || "/app_logo.png"}
                alt="Logo"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src && !target.src.endsWith('/app_logo.png')) {
                    target.src = '/app_logo.png';
                  }
                }}
                className="w-full h-full rounded-full object-cover"
              />
            </button>
          </div>
        </div>

        {/* DÒNG 2: Brand card được chuyển sang HomeSectionsClient quản lý vị trí và di chuyển động */}

        {/* Dropdown Menu ⋮ Trang chủ */}
        {showMenu && (
          <div className="absolute top-[48px] right-0 w-[240px] bg-white text-slate-900 border border-slate-200 rounded-[20px] shadow-2xl p-2 flex flex-col gap-1 z-50 animate-in fade-in duration-150 dark:bg-[#180E32] dark:border-[#3A2268] dark:text-white">
            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                setShowPhoneSync(true);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
            >
              <Smartphone size={16} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
              <span>{userPhone ? 'Quản lý số điện thoại' : 'Lưu tiến độ qua SĐT'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                window.dispatchEvent(new Event('replay_qbiz_books_intro'));
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
            >
              <BookOpen size={16} className="text-amber-500 dark:text-[#F8DF7B]" />
              <span>Xem hiệu ứng mở sách 3D</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setShowMenu(false);
                setShowPwaInstall(true);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
            >
              <Smartphone size={16} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
              <span>Cài app ra màn hình</span>
            </button>

            {isAdmin ? (
              <>
                <div
                  className={`px-3 py-2 rounded-[12px] text-[12px] font-extrabold flex items-center gap-2 ${
                    supabaseOk
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800'
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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
                >
                  <Download size={16} className="text-[#1E3A8A] dark:text-purple-300" />
                  <span>Sao lưu dữ liệu</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowEditApp(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
                >
                  <Edit2 size={16} className="text-[#1E3A8A] dark:text-purple-300" />
                  <span>Sửa tên & logo app</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setSettingsTab('chung');
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
                >
                  <Settings size={16} className="text-[#1E3A8A] dark:text-purple-300" />
                  <span>Cài đặt quản trị</span>
                </button>

                {isSuperAdmin(adminUser) && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setSettingsTab('giang_vien');
                        setShowSettings(true);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
                    >
                      <Users size={16} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                      <span>Phân quyền Giảng viên</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMenu(false);
                        setSettingsTab('khach_hang');
                        setShowSettings(true);
                      }}
                      className="flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
                    >
                      <Building2 size={16} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                      <span>Cơ sở / Khách hàng SaaS</span>
                    </button>
                  </>
                )}


                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    window.location.assign('/tro-ly-ai');
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-white dark:hover:bg-[#25154D] cursor-pointer"
                >
                  <Sparkles size={16} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                  <span>Huấn luyện Trợ lý AI</span>
                </button>

                <div className="border-t border-slate-200 dark:border-line my-1" />

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
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  window.location.assign('/dang-nhap');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-[12px] text-left text-[14px] font-bold text-slate-800 hover:bg-slate-100 dark:text-ink dark:hover:bg-surface-2 cursor-pointer"
              >
                <User size={16} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
                <span>Đăng nhập quản trị</span>
              </button>
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
          initialBrandTagline={brandTagline}
          initialLogoUrl={logoUrl}
          initialHotline={hotline || ''}
          initialZaloUrl={zaloUrl || ''}
          onClose={() => setShowEditApp(false)}
          onSaved={(newName, newSubtitle, newLogo, newHotline, newZalo, newTagline) => {
            setAppName(newName);
            setAppSubtitle(newSubtitle);
            if (newTagline !== undefined) setBrandTagline(newTagline);
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
          initialTab={settingsTab}
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

      {/* Modal Nhập tên khách hàng Chào mừng */}
      {showNameModal && (
        <div className="fixed inset-0 z-20 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-[24px] bg-white dark:bg-[#180E32] border border-slate-200 dark:border-[#3A2268] p-5 shadow-2xl flex flex-col gap-3.5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-purple-900/50 flex items-center justify-center text-xl shrink-0">
                <span className="animate-wave">👋</span>
              </div>
              <div>
                <h3 className="text-[16px] font-black text-slate-900 dark:text-white leading-tight">
                  Chào mừng bạn!
                </h3>
                <p className="text-[12px] text-slate-500 dark:text-purple-300 font-medium">
                  Nhập tên của bạn để bắt đầu học tập nhé
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-slate-700 dark:text-purple-200">
                Tên hoặc danh xưng của bạn:
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Ví dụ: Hoàng, Bác sĩ Minh, Thảo..."
                className="w-full h-11 px-3.5 rounded-[12px] bg-slate-50 dark:bg-[#120924] border border-slate-200 dark:border-[#3A2268] text-slate-900 dark:text-white text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] dark:focus:ring-amber-400"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                }}
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowNameModal(false)}
                className="px-3.5 py-2 rounded-[10px] text-[13px] font-bold text-slate-500 dark:text-purple-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                Để sau
              </button>
              <button
                type="button"
                onClick={handleSaveName}
                className="px-4 py-2 rounded-[10px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-slate-950 font-black text-[13px] shadow-md cursor-pointer transition-all"
              >
                Lưu tên ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
