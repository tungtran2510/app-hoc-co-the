'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  BookOpen,
  Smartphone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PlayCircle,
  ListVideo,
  LayoutGrid,
  List,
  Rows3,
} from 'lucide-react';
import { getSavedPages, SavedPageInfo, toggleSavePage, getStoredXemTiep, XemTiepInfo } from '../../lib/learningProgress';
import { getUserPhone, syncUserProgress, LEARNING_PROGRESS_EVENT } from '../../lib/userSync';
import UserSyncModal from '../../components/UserSyncModal';
import BottomNav from '../../components/BottomNav';

export default function SavedPages() {
  const [savedList, setSavedList] = useState<SavedPageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPhoneSync, setShowPhoneSync] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [resume, setResume] = useState<XemTiepInfo | null>(null);
  const [savedView, setSavedView] = useState<'list' | 'compact' | 'grid'>('list');

  useEffect(() => {
    const stored = window.localStorage.getItem('qbiz_saved_view');
    if (stored === 'list' || stored === 'compact' || stored === 'grid') setSavedView(stored);
  }, []);

  const changeSavedView = (view: 'list' | 'compact' | 'grid') => {
    setSavedView(view);
    window.localStorage.setItem('qbiz_saved_view', view);
  };

  const formatPhone = (p: string) => {
    const clean = p.replace(/[^0-9]/g, '');
    if (clean.length === 10) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
    }
    return clean;
  };

  const refreshList = () => {
    try {
      const list = getSavedPages();
      setSavedList(list);
    } catch {
      setSavedList([]);
    }
    try {
      setResume(getStoredXemTiep());
    } catch {
      setResume(null);
    }
  };

  useEffect(() => {
    refreshList();
    setIsLoading(false);

    // Nếu đã có số điện thoại lưu từ trước, tự động tải mới từ máy chủ
    const phone = getUserPhone();
    setUserPhone(phone);
    if (phone) {
      syncUserProgress(phone, 'sync').then((res) => {
        if (res.success) {
          refreshList();
        }
      });
    }

    const handleUpdate = () => {
      refreshList();
      setUserPhone(getUserPhone());
    };

    window.addEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
    window.addEventListener('learning_progress_changed', handleUpdate);
    return () => {
      window.removeEventListener(LEARNING_PROGRESS_EVENT, handleUpdate);
      window.removeEventListener('learning_progress_changed', handleUpdate);
    };
  }, []);

  const handleRemove = (e: React.MouseEvent, page: SavedPageInfo) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePage(page);
    refreshList();
  };

  return (
    <main className="flex-1 flex flex-col bg-[linear-gradient(180deg,#F8FAFD_0%,#F5F7FB_48%,#FBFCFE_100%)] dark:bg-none dark:bg-[#0C0817] px-4 sm:px-5 pt-1.5 pb-28 gap-3 max-w-2xl mx-auto w-full">
      {/* 1. Header chuẩn iOS */}
      <header className="flex items-center justify-between h-[42px]">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-primary dark:text-purple-300 text-[16px] font-extrabold pr-2 transition-opacity active:opacity-75"
          aria-label="Quay lại trang chủ"
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
          <span>Trang chủ</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Nút đồng bộ SĐT */}
          <button
            type="button"
            onClick={() => setShowPhoneSync(true)}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-[10px] bg-white dark:bg-[#1E1342] border border-slate-200 dark:border-purple-800/40 text-slate-700 dark:text-purple-200 hover:text-purple-700 dark:hover:text-[#F8DF7B] text-[12px] font-bold shadow-2xs cursor-pointer active:scale-95 transition-all"
            title="Lưu & Đồng bộ qua Số điện thoại"
          >
            <Smartphone size={13} />
            <span>{userPhone ? formatPhone(userPhone) : 'Đồng bộ SĐT'}</span>
            {userPhone && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>

          <div className="flex items-center gap-1.5 ml-0.5 px-2.5 py-1 rounded-[10px] bg-amber-50 dark:bg-purple-950/60 border border-amber-300 dark:border-purple-800/40">
            <Bookmark size={15} className="text-amber-700 dark:text-[#F8DF7B] fill-current" />
            <span className="text-[13px] font-black text-amber-700 dark:text-[#F8DF7B]">Đã lưu</span>
          </div>
        </div>
      </header>

      {/* 2. Tiêu đề trang trọng */}
      <section className="flex flex-col gap-1 pt-0">
        <h1 className="text-[22px] sm:text-[27px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Đã lưu
        </h1>
        <p className="text-[13px] sm:text-[14px] text-slate-500 dark:text-purple-200/80 leading-relaxed font-normal">
          {savedList.length > 0
            ? 'Lưu bài học, video, sách và danh sách phát để xem lại.'
            : 'Giữ lâu vào bài học, video, sách hoặc danh sách phát để lưu lại xem sau'}
        </p>
      </section>

      {/* 3. Đang xem dở (chuyển từ tab "Đang xem" cũ) */}
      {resume && resume.topic_slug && resume.page_slug && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-purple-100 text-[13px] font-black uppercase tracking-wide">
              <PlayCircle size={17} className="text-blue-600 dark:text-[#F8DF7B]" />
              <span>Đang học dở</span>
            </div>
          </div>
          <div className="rounded-[20px] border border-blue-100 bg-white p-3 shadow-[0_12px_28px_-22px_rgba(37,99,235,.55)] dark:border-purple-700/50 dark:bg-[#160D30]">
            <Link href={`/${resume.topic_slug.replace('cot-song-that-lung', 'cot-song')}/${resume.page_slug}?v=${resume.video_index || 1}`} className="grid grid-cols-[38%_1fr] items-center gap-3 active:opacity-90">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[13px] bg-[#102D5C]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={resume.cover_url || '/images/lessons/tong-quan-ve-cot-song.png'} alt={resume.page_title} className="h-full w-full object-cover" />
                <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/95 p-1 text-blue-700 shadow"><PlayCircle size={17} /></span>
              </div>
              <div className="min-w-0">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-blue-800 dark:bg-blue-950/60 dark:text-blue-200"><PlayCircle size={11} /> Đang xem dở</span>
                <p className="mt-1 text-[13px] font-black leading-snug text-slate-900 dark:text-white line-clamp-2">{resume.page_title}</p>
                <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-slate-300 line-clamp-1">{resume.topic_title}{resume.video_title ? ` · ${resume.video_title}` : ''}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10"><div className="h-full rounded-full bg-blue-700" style={{ width: `${resume.video_total ? Math.min(100, Math.round((resume.video_index / resume.video_total) * 100)) : 0}%` }} /></div>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">{resume.video_total ? Math.min(100, Math.round((resume.video_index / resume.video_total) * 100)) : 0}%</span>
                </div>
              </div>
            </Link>
            <Link href={`/${resume.topic_slug.replace('cot-song-that-lung', 'cot-song')}/${resume.page_slug}?v=${resume.video_index || 1}`} className="mt-2.5 flex h-10 items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-[#12366F] to-[#0B2A59] text-[12px] font-black text-white shadow-sm active:scale-[.99]">
              <PlayCircle size={17} fill="currentColor" /> Tiếp tục học <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      )}

      {/* 4. Danh sách bài học đã lưu (Giao diện thẻ Chuyên nghiệp) */}
      {isLoading ? (
        <div className="p-8 text-center bg-white dark:bg-[#160D30] rounded-[22px] border border-slate-200 dark:border-purple-800/40">
          <p className="text-[14px] text-slate-500 dark:text-purple-300 font-medium">Đang tải dữ liệu bài học...</p>
        </div>
      ) : savedList.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-7 bg-white dark:bg-[#160D30] rounded-[24px] border border-slate-200/80 dark:border-purple-800/40 text-center gap-3.5 my-1 shadow-xs">
          <div className="w-14 h-14 rounded-[18px] bg-amber-50 dark:bg-purple-950/80 text-amber-700 dark:text-[#F8DF7B] flex items-center justify-center shadow-inner-xs">
            <Bookmark size={26} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col gap-1 max-w-[280px]">
            <h2 className="text-[18px] font-black text-slate-900 dark:text-white">
              Chưa có mục nào được lưu
            </h2>
            <p className="text-[13px] text-slate-500 dark:text-purple-300 leading-relaxed font-normal">
              Hãy giữ lâu vào một bài học, video, sách hoặc danh sách phát, rồi chọn Lưu. Bạn cũng có thể bấm biểu tượng Lưu ở góc phải bài học.
            </p>
          </div>
          <Link
            href="/cot-song"
            className="flex items-center justify-center gap-2 h-11 px-5 rounded-[12px] bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-600 dark:to-indigo-600 text-white font-black text-[13.5px] shadow-sm active:scale-95 transition-transform"
          >
            <BookOpen size={16} />
            <span>Khám phá Cột sống ngay</span>
          </Link>
        </div>
      ) : (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-extrabold uppercase tracking-wide text-slate-800 dark:text-purple-100">
              <Bookmark size={15} className="fill-blue-600 text-blue-600" />
              Đã lưu gần đây
            </h2>
            <div role="group" aria-label="Chế độ hiển thị mục đã lưu" className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white/80 p-1 shadow-sm dark:border-purple-800/50 dark:bg-[#160D30]">
              {([
                { value: 'list', label: 'Danh sách', Icon: List },
                { value: 'compact', label: 'Gọn', Icon: Rows3 },
                { value: 'grid', label: 'Lưới', Icon: LayoutGrid },
              ] as const).map(({ value, label, Icon }) => (
                <button key={value} type="button" onClick={() => changeSavedView(value)} aria-label={label} aria-pressed={savedView === value} title={label}
                  className={`flex h-8 w-8 items-center justify-center rounded-[9px] transition-colors ${savedView === value ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300' : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                  <Icon size={16} strokeWidth={2.2} />
                </button>
              ))}
            </div>
          </div>
          <div className={savedView === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:grid-cols-3' : 'flex flex-col gap-2.5'}>
          {savedList.map((item) => {
            const topicIcon = `/images/topics/${item.topic_slug}.png`;
            const itemHref = item.href || `/${item.topic_slug}/${item.page_slug}`;
            const isLesson = !item.kind || item.kind === 'page';
            const kindLabel = isLesson ? item.topic_title : item.kind === 'video' ? 'Video' : item.kind === 'book' ? 'Sách' : 'Danh sách phát';
            const KindIcon = isLesson ? BookOpen : item.kind === 'video' ? PlayCircle : item.kind === 'book' ? BookOpen : ListVideo;

            if (savedView === 'grid') {
              return (
                <article key={item.page_id} className="flex min-w-0 flex-col gap-2 rounded-[15px] border border-slate-200/80 bg-white p-2.5 shadow-[0_5px_16px_-16px_rgba(15,23,42,.5)] dark:border-purple-800/40 dark:bg-[#160D30]">
                  <div className="flex h-7 min-w-0 items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-1 truncate text-[9px] font-black uppercase tracking-wide text-primary dark:text-blue-300">
                      <KindIcon size={12} className="shrink-0" />
                      <span className="truncate">{kindLabel}</span>
                    </span>
                    <button type="button" onClick={(e) => handleRemove(e, item)} className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-red-950/40" aria-label="Bỏ lưu mục này" title="Bỏ lưu"><BookmarkCheck size={15} /></button>
                  </div>
                  <Link href={itemHref} className="relative block aspect-video w-full overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 dark:border-purple-800/50 dark:bg-purple-950/70">
                    {item.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.thumb} alt={item.page_title} className="h-full w-full object-cover" loading="lazy" />
                    ) : isLesson ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={topicIcon} alt={item.topic_title} className="h-full w-full object-contain p-3" loading="lazy" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                        <span className="absolute inset-0 -z-0 flex items-center justify-center text-primary dark:text-[#F8DF7B]"><BookOpen size={22} /></span>
                      </>
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-primary dark:text-[#F8DF7B]"><KindIcon size={24} /></span>
                    )}
                    {isLesson && <span className="absolute bottom-1 right-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-black text-white">#{item.page_number}</span>}
                  </Link>
                  <Link href={itemHref} className="min-w-0 active:opacity-80">
                    <h3 className="line-clamp-2 min-h-[2.5em] break-words text-[12px] font-extrabold leading-snug text-slate-900 dark:text-white">{item.page_title}</h3>
                    <p className="line-clamp-2 min-h-[2.4em] break-words text-[10px] leading-snug text-slate-500 dark:text-purple-300/80">{item.subtitle || item.topic_title}</p>
                  </Link>
                </article>
              );
            }

            if (item.kind && item.kind !== 'page') {
              return (
                <div
                  key={item.page_id}
                  className={`relative flex min-w-0 items-center gap-2 rounded-[15px] border border-slate-200/80 bg-white p-2.5 shadow-[0_5px_16px_-16px_rgba(15,23,42,.5)] dark:border-purple-800/40 dark:bg-[#160D30] ${savedView === 'compact' ? 'p-2' : ''}`}
                >
                  <Link
                    href={itemHref}
                    className="flex min-w-0 flex-1 items-center gap-2.5 transition-opacity active:opacity-80"
                  >
                    <div className="flex shrink-0 flex-col items-center gap-1">
                      <div className={`relative aspect-video overflow-hidden bg-primary-soft border border-slate-200 dark:border-purple-800/50 flex items-center justify-center text-primary ${savedView === 'compact' ? 'w-[54px] rounded-[9px]' : 'w-[62px] rounded-[10px]'}`}>
                        {item.thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.thumb} alt={item.page_title} className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <KindIcon size={20} />
                        )}
                      </div>
                      {item.kind === 'video' && <span className="inline-flex items-center gap-0.5 text-[8px] font-black uppercase tracking-wide text-blue-700 dark:text-blue-300"><KindIcon size={10} />Video</span>}
                    </div>
                    <div className="min-w-0 flex-1">
                      {item.kind !== 'video' && <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary dark:text-[#F8DF7B]">
                        <KindIcon size={11} /> {kindLabel}
                      </span>}
                      <h3 className="line-clamp-2 break-words text-[12px] font-bold leading-snug text-slate-900 dark:text-white">
                        {item.page_title}
                      </h3>
                      {(item.subtitle || item.topic_title) && (
                        <p className="text-[10px] text-slate-500 dark:text-purple-300/80 line-clamp-1">
                          {item.subtitle || item.topic_title}
                        </p>
                      )}
                    </div>
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => handleRemove(e, item)}
                    className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[9px] bg-blue-50 text-blue-700 transition-colors hover:bg-red-50 hover:text-red-600 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-red-950/40"
                    aria-label="Bỏ lưu mục này"
                    title="Bỏ lưu"
                  >
                    <BookmarkCheck size={17} />
                  </button>
                </div>
              );
            }

            return (
                <div key={item.page_id} className={`flex min-w-0 items-center gap-2.5 rounded-[15px] border border-slate-200/90 bg-white px-2.5 py-2 shadow-[0_5px_16px_-16px_rgba(15,23,42,.5)] dark:border-purple-800/40 dark:bg-[#160D30] ${savedView === 'compact' ? 'gap-2 px-2 py-1.5' : ''}`}>
                  <Link href={`/${item.topic_slug}/${item.page_slug}`} className="flex min-w-0 flex-1 items-center gap-2.5 active:opacity-80">
                    <div className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 p-0.5 dark:border-purple-800/50 dark:bg-purple-950/70 ${savedView === 'compact' ? 'h-10 w-10' : 'h-12 w-12'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={topicIcon} alt={item.topic_title} className="h-full w-full object-contain" onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
                      <span className="absolute bottom-0 right-0 rounded-tl bg-primary px-1 text-[8px] font-black text-white">#{item.page_number}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-[9px] font-extrabold uppercase tracking-wide text-primary dark:text-[#F8DF7B]">{item.topic_title}</span>
                      <h3 className="mt-0.5 line-clamp-2 text-[12.5px] font-bold leading-snug text-slate-900 dark:text-white">{item.page_title}</h3>
                    </div>
                    <ArrowRight size={16} className="shrink-0 text-slate-400" />
                  </Link>
                  <button type="button" onClick={(e) => handleRemove(e, item)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-red-950/40" aria-label="Bỏ lưu bài học" title="Bỏ lưu"><BookmarkCheck size={16} /></button>
                </div>
              );
          })}
          </div>
        </section>
      )}

      {/* 6. Thanh điều hướng dưới cùng */}
      <BottomNav />

      {/* 7. Modal Lưu tiến độ & Đồng bộ qua SĐT */}
      <UserSyncModal
        isOpen={showPhoneSync}
        onClose={() => setShowPhoneSync(false)}
        reason="manual"
        onSuccess={refreshList}
      />
    </main>
  );
}
