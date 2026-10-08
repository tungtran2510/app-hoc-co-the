'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Smartphone,
  PlayCircle,
  ListVideo,
  LayoutGrid,
  List,
  Rows3,
  Zap,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import {
  getSavedPages,
  SavedPageInfo,
  toggleSavePage,
  getStoredXemTiep,
  XemTiepInfo,
  getReviewVideos,
  removeReviewVideo,
  ReviewVideoItem,
  saveVideoWatched,
} from '../../lib/learningProgress';
import { getUserPhone, syncUserProgress, LEARNING_PROGRESS_EVENT } from '../../lib/userSync';
import { playTapSound } from '../../lib/audioFeedback';
import UserSyncModal from '../../components/UserSyncModal';
import BottomNav from '../../components/BottomNav';

export default function SavedPages() {
  const [activeTab, setActiveTab] = useState<'saved' | 'review'>('saved');
  const [savedList, setSavedList] = useState<SavedPageInfo[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return getSavedPages();
    } catch {
      return [];
    }
  });
  const [reviewList, setReviewList] = useState<ReviewVideoItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return getReviewVideos();
    } catch {
      return [];
    }
  });
  const [expandedTakeaways, setExpandedTakeaways] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPhoneSync, setShowPhoneSync] = useState(false);
  const [userPhone, setUserPhone] = useState<string | null>(null);
  const [resume, setResume] = useState<XemTiepInfo | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      return getStoredXemTiep();
    } catch {
      return null;
    }
  });
  const [savedView, setSavedView] = useState<'list' | 'compact' | 'grid'>('list');

  useEffect(() => {
    const stored = window.localStorage.getItem('qbiz_saved_view');
    if (stored === 'list' || stored === 'compact' || stored === 'grid') setSavedView(stored);

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('tab') === 'review') {
        setActiveTab('review');
      }
    }
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
      setSavedList(getSavedPages());
    } catch {
      setSavedList([]);
    }
    try {
      setResume(getStoredXemTiep());
    } catch {
      setResume(null);
    }
    try {
      setReviewList(getReviewVideos());
    } catch {
      setReviewList([]);
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

  const handleMarkUnderstood = (item: ReviewVideoItem) => {
    removeReviewVideo(item.page_id, item.video_index);
    saveVideoWatched(item.page_id, item.video_index);
    refreshList();
  };

  const toggleTakeaway = (id: string) => {
    setExpandedTakeaways((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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
        </div>
      </header>

      {/* 2. Tiêu đề trang tinh gọn 1 dòng - Tối ưu triệt để không gian mobile */}
      <section className="pt-0 pb-0.5">
        <h1 className="text-[20px] sm:text-[22px] font-black tracking-tight text-slate-900 dark:text-white leading-tight">
          Học tập cá nhân
        </h1>
      </section>

      {/* 3. Segmented Control: [ ⭐ Đã lưu (N) ] và [ ⚡ Cần ôn tập (X) ] */}
      <section className="grid grid-cols-2 p-1 rounded-[14px] bg-slate-200/70 dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 gap-1 select-none">
        <button
          type="button"
          onClick={() => {
            playTapSound();
            setActiveTab('saved');
          }}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[11px] text-[13px] font-extrabold transition-all cursor-pointer ${
            activeTab === 'saved'
              ? 'bg-white dark:bg-[#1E1342] text-[#1E3A8A] dark:text-[#F8DF7B] shadow-xs'
              : 'text-slate-600 dark:text-purple-300 hover:text-slate-900'
          }`}
        >
          <Bookmark size={14} className={activeTab === 'saved' ? 'fill-current' : ''} />
          <span className="whitespace-nowrap">Đã lưu</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              activeTab === 'saved'
                ? 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200'
                : 'bg-slate-300/80 dark:bg-purple-900/60 text-slate-700 dark:text-purple-200'
            }`}
          >
            {savedList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            playTapSound();
            setActiveTab('review');
          }}
          className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-[11px] text-[13px] font-extrabold transition-all cursor-pointer ${
            activeTab === 'review'
              ? 'bg-white dark:bg-[#1E1342] text-amber-800 dark:text-amber-300 shadow-xs'
              : 'text-slate-600 dark:text-purple-300 hover:text-slate-900'
          }`}
        >
          <Zap size={14} className="fill-amber-500 text-amber-500" />
          <span className="whitespace-nowrap">Cần ôn tập</span>
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              reviewList.length > 0
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                : 'bg-slate-300/80 dark:bg-purple-900/60 text-slate-700 dark:text-purple-200'
            }`}
          >
            {reviewList.length}
          </span>
        </button>
      </section>

      {/* ========================================================================= */}
      {/* TAB 1: DANH SÁCH BÀI ĐÃ LƯU (CHUYỂN TAB TỨC THÌ 0MS)                       */}
      {/* ========================================================================= */}
      <div className={activeTab === 'saved' ? 'flex flex-col gap-3' : 'hidden'}>
          {/* Đang học dở */}
          {resume && resume.topic_slug && resume.page_slug && (
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-slate-800 dark:text-purple-100 text-[12.5px] font-black uppercase tracking-wide">
                  <PlayCircle size={16} className="text-blue-600 dark:text-[#F8DF7B]" />
                  <span>Đang học dở</span>
                </div>
              </div>
              <div className="rounded-[18px] border border-blue-100 bg-white p-3 shadow-xs dark:border-purple-700/50 dark:bg-[#160D30]">
                <Link
                  href={`/${resume.topic_slug.replace('cot-song-that-lung', 'cot-song')}/${resume.page_slug}?v=${resume.video_index || 1}`}
                  className="grid grid-cols-[38%_1fr] items-center gap-3 active:opacity-90"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#102D5C]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resume.cover_url || '/images/lessons/tong-quan-ve-cot-song.png'}
                      alt={resume.page_title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded-full bg-white/95 p-1 text-blue-700 shadow">
                      <PlayCircle size={15} />
                    </span>
                  </div>
                  <div className="min-w-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wide text-blue-800 dark:bg-blue-950/60 dark:text-blue-200">
                      <PlayCircle size={11} /> Đang xem dở
                    </span>
                    <p className="mt-1 text-[13px] font-black leading-snug text-slate-900 dark:text-white line-clamp-2">
                      {resume.page_title}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-slate-500 dark:text-slate-300 line-clamp-1">
                      {resume.topic_title}
                      {resume.video_title ? ` · ${resume.video_title}` : ''}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-blue-700"
                          style={{
                            width: `${
                              resume.video_total
                                ? Math.min(100, Math.round((resume.video_index / resume.video_total) * 100))
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-300">
                        {resume.video_total
                          ? Math.min(100, Math.round((resume.video_index / resume.video_total) * 100))
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </Link>
                <Link
                  href={`/${resume.topic_slug.replace('cot-song-that-lung', 'cot-song')}/${resume.page_slug}?v=${resume.video_index || 1}`}
                  className="mt-2.5 flex h-9 items-center justify-center gap-1.5 rounded-[11px] bg-gradient-to-r from-[#12366F] to-[#0B2A59] text-[12px] font-black text-white shadow-xs active:scale-[.99]"
                >
                  <PlayCircle size={15} fill="currentColor" /> Tiếp tục học <ArrowRight size={14} />
                </Link>
              </div>
            </section>
          )}

          {/* Danh sách mục đã lưu */}
          {isLoading ? (
            <div className="p-8 text-center bg-white dark:bg-[#160D30] rounded-[20px] border border-slate-200 dark:border-purple-800/40">
              <p className="text-[13px] text-slate-500 dark:text-purple-300 font-medium">Đang tải dữ liệu bài học...</p>
            </div>
          ) : savedList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-7 bg-white dark:bg-[#160D30] rounded-[22px] border border-slate-200/80 dark:border-purple-800/40 text-center gap-3 my-1 shadow-xs">
              <div className="w-12 h-12 rounded-[16px] bg-blue-50 dark:bg-purple-950/80 text-blue-700 dark:text-[#F8DF7B] flex items-center justify-center">
                <Bookmark size={24} strokeWidth={2.2} />
              </div>
              <div className="flex flex-col gap-1 max-w-[280px]">
                <h2 className="text-[17px] font-black text-slate-900 dark:text-white">Chưa có mục nào được lưu</h2>
                <p className="text-[12.5px] text-slate-500 dark:text-purple-300 leading-relaxed font-normal">
                  Bấm biểu tượng Lưu ở đỉnh video hoặc giữ lâu vào bài học để lưu lại xem sau.
                </p>
              </div>
              <Link
                href="/cot-song"
                className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-[11px] bg-gradient-to-r from-blue-700 to-indigo-800 text-white font-black text-[13px] shadow-xs active:scale-95 transition-transform"
              >
                <BookOpen size={15} />
                <span>Khám phá Cột sống ngay</span>
              </Link>
            </div>
          ) : (
            <section className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wide text-slate-800 dark:text-purple-100">
                  <Bookmark size={14} className="fill-blue-600 text-blue-600" />
                  Đã lưu gần đây
                </h2>
                <div
                  role="group"
                  aria-label="Chế độ hiển thị mục đã lưu"
                  className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-white/80 p-0.5 shadow-2xs dark:border-purple-800/50 dark:bg-[#160D30]"
                >
                  {([
                    { value: 'list', label: 'Danh sách', Icon: List },
                    { value: 'compact', label: 'Gọn', Icon: Rows3 },
                    { value: 'grid', label: 'Lưới', Icon: LayoutGrid },
                  ] as const).map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => changeSavedView(value)}
                      aria-label={label}
                      aria-pressed={savedView === value}
                      title={label}
                      className={`flex h-7 w-7 items-center justify-center rounded-[8px] transition-colors ${
                        savedView === value
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon size={15} strokeWidth={2.2} />
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={
                  savedView === 'grid' ? 'grid grid-cols-2 gap-2.5 sm:grid-cols-3' : 'flex flex-col gap-2.5'
                }
              >
                {savedList.map((item) => {
                  const topicIcon = `/images/topics/${item.topic_slug}.png`;
                  const itemHref = item.href || `/${item.topic_slug}/${item.page_slug}`;
                  const isLesson = !item.kind || item.kind === 'page';
                  const kindLabel = isLesson
                    ? item.topic_title
                    : item.kind === 'video'
                    ? 'Video'
                    : item.kind === 'book'
                    ? 'Sách'
                    : 'Danh sách phát';
                  const KindIcon = isLesson
                    ? BookOpen
                    : item.kind === 'video'
                    ? PlayCircle
                    : item.kind === 'book'
                    ? BookOpen
                    : ListVideo;

                  if (savedView === 'grid') {
                    return (
                      <article
                        key={item.page_id}
                        className="flex min-w-0 flex-col gap-1.5 rounded-[15px] border border-slate-200/80 bg-white p-2.5 shadow-2xs dark:border-purple-800/40 dark:bg-[#160D30]"
                      >
                        <div className="flex h-7 min-w-0 items-center justify-between gap-2">
                          <span className="inline-flex min-w-0 items-center gap-1 truncate text-[9px] font-black uppercase tracking-wide text-primary dark:text-blue-300">
                            <KindIcon size={12} className="shrink-0" />
                            <span className="truncate">{kindLabel}</span>
                          </span>
                          <button
                            type="button"
                            onClick={(e) => handleRemove(e, item)}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-red-950/40"
                            aria-label="Bỏ lưu mục này"
                            title="Bỏ lưu"
                          >
                            <BookmarkCheck size={14} />
                          </button>
                        </div>
                        <Link
                          href={itemHref}
                          className="relative block aspect-video w-full overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 dark:border-purple-800/50 dark:bg-purple-950/70"
                        >
                          {item.thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumb}
                              alt={item.page_title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : isLesson ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={topicIcon}
                                alt={item.topic_title}
                                className="h-full w-full object-contain p-1"
                                loading="lazy"
                                onError={(e) => {
                                  const image = e.target as HTMLElement;
                                  image.style.display = 'none';
                                  const fallback = image.nextElementSibling as HTMLElement | null;
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                              <span className="absolute inset-0 hidden items-center justify-center text-primary dark:text-[#F8DF7B]">
                                <BookOpen size={20} />
                              </span>
                            </>
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-primary dark:text-[#F8DF7B]">
                              <KindIcon size={22} />
                            </span>
                          )}
                          {isLesson && (
                            <span className="absolute bottom-1 right-1 rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-black text-white">
                              #{item.page_number}
                            </span>
                          )}
                        </Link>
                        <Link href={itemHref} className="min-w-0 active:opacity-80">
                          <h3 className="line-clamp-2 min-h-[2.5em] break-words text-[12px] font-extrabold leading-snug text-slate-900 dark:text-white">
                            {item.page_title}
                          </h3>
                          <p className="line-clamp-1 break-words text-[10px] leading-snug text-slate-500 dark:text-purple-300/80">
                            {item.subtitle || item.topic_title}
                          </p>
                        </Link>
                      </article>
                    );
                  }

                  return (
                    <div
                      key={item.page_id}
                      className={`flex min-w-0 items-center gap-2.5 rounded-[15px] border border-slate-200/90 bg-white px-3 py-2.5 shadow-2xs dark:border-purple-800/40 dark:bg-[#160D30] ${
                        savedView === 'compact' ? 'gap-2 px-2.5 py-1.5' : ''
                      }`}
                    >
                      <Link href={itemHref} className="flex min-w-0 flex-1 items-center gap-2.5 active:opacity-80">
                        <div
                          className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-[10px] border border-slate-200 bg-slate-50 p-0.5 dark:border-purple-800/50 dark:bg-purple-950/70 ${
                            savedView === 'compact' ? 'h-10 w-10' : 'h-12 w-12'
                          }`}
                        >
                          {item.thumb ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.thumb}
                              alt={item.page_title}
                              className="h-full w-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={topicIcon}
                              alt={item.topic_title}
                              className="h-full w-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          )}
                          {isLesson && (
                            <span className="absolute bottom-0 right-0 rounded-tl bg-primary px-1 text-[8px] font-black text-white">
                              #{item.page_number}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="block truncate text-[9px] font-extrabold uppercase tracking-wide text-primary dark:text-[#F8DF7B]">
                            {item.topic_title}
                          </span>
                          <h3 className="mt-0.5 line-clamp-2 text-[12.5px] font-bold leading-snug text-slate-900 dark:text-white">
                            {item.page_title}
                          </h3>
                        </div>
                        <ArrowRight size={15} className="shrink-0 text-slate-400" />
                      </Link>
                      <button
                        type="button"
                        onClick={(e) => handleRemove(e, item)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-blue-50 text-blue-700 hover:bg-red-50 hover:text-red-600 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-red-950/40 cursor-pointer"
                        aria-label="Bỏ lưu bài học"
                        title="Bỏ lưu"
                      >
                        <BookmarkCheck size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
      </div>

      {/* ========================================================================= */}
      {/* TAB 2: DANH SÁCH VIDEO CẦN ÔN TẬP (CHUYỂN TAB TỨC THÌ 0MS)                */}
      {/* ========================================================================= */}
      <div className={activeTab === 'review' ? 'flex flex-col gap-3' : 'hidden'}>
        <section className="flex flex-col gap-3">
          {reviewList.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-7 bg-white dark:bg-[#160D30] rounded-[22px] border border-slate-200/80 dark:border-purple-800/40 text-center gap-3 my-1 shadow-xs">
              <div className="w-13 h-13 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner-xs">
                <CheckCircle2 size={26} strokeWidth={2.3} />
              </div>
              <div className="flex flex-col gap-1 max-w-[300px]">
                <h2 className="text-[17px] font-black text-slate-900 dark:text-white">
                  Không có video cần ôn tập
                </h2>
                <p className="text-[12.5px] text-slate-500 dark:text-purple-300 leading-relaxed font-normal">
                  Tuyệt vời! Tất cả các bài bạn đã học đều đang ở trạng thái nắm vững. Khi gặp video khó hiểu, chỉ cần gạt sang &ldquo;Chưa hiểu&rdquo; để lưu vào đây.
                </p>
              </div>
              <Link
                href="/cot-song"
                className="flex items-center justify-center gap-1.5 h-10 px-4 rounded-[11px] bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-black text-[13px] shadow-xs active:scale-95 transition-transform"
              >
                <BookOpen size={15} />
                <span>Tiếp tục học bài mới</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between px-0.5">
                <h2 className="flex items-center gap-1.5 text-[12px] font-extrabold uppercase tracking-wide text-slate-800 dark:text-purple-100">
                  <Zap size={14} className="fill-amber-500 text-amber-500" />
                  Danh sách ôn tập ({reviewList.length})
                </h2>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  Bấm Đã hiểu khi nắm vững
                </span>
              </div>

              {reviewList.map((item) => {
                const isExpanded = !!expandedTakeaways[item.id];
                const lessonUrl = `/${item.topic_slug}/${item.page_slug}?v=${item.video_index}`;

                return (
                  <article
                    key={item.id}
                    className="flex flex-col gap-2.5 p-3 rounded-[18px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 shadow-2xs"
                  >
                    {/* Hàng 1: Thumbnail + Tiêu đề + Vị trí bài */}
                    <div className="flex items-start gap-2.5">
                      <Link
                        href={lessonUrl}
                        className="relative aspect-video w-[92px] sm:w-[104px] shrink-0 rounded-[10px] overflow-hidden bg-slate-900 border border-slate-200/80 dark:border-purple-800/50 group"
                        title="Bấm để xem video này"
                      >
                        {item.cover_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.cover_url}
                            alt={item.video_title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-400">
                            <PlayCircle size={20} />
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[8.5px] font-black text-white">
                          #{item.video_index}
                        </span>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                          <PlayCircle size={20} className="text-white drop-shadow" />
                        </div>
                      </Link>

                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <span className="text-[9.5px] font-black uppercase tracking-wide text-blue-700 dark:text-blue-300 truncate">
                          {item.topic_title} · {item.page_title}
                        </span>
                        <Link href={lessonUrl} className="active:opacity-80">
                          <h3 className="text-[12.5px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 hover:text-blue-700 transition-colors">
                            {item.video_title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    {/* Hàng 2: Nút hành động chuẩn 1 dòng (Xem lại · Đã hiểu · Rút ra) */}
                    <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-slate-100 dark:border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={lessonUrl}
                          className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-[#1E3A8A] text-white text-[11px] font-extrabold shadow-2xs active:scale-95 transition-transform whitespace-nowrap"
                        >
                          <PlayCircle size={12} fill="currentColor" />
                          <span>Xem lại</span>
                        </Link>

                        {item.takeaway && (
                          <button
                            type="button"
                            onClick={() => toggleTakeaway(item.id)}
                            className={`inline-flex items-center gap-1 h-7 px-2 rounded-lg text-[10.5px] font-extrabold border transition-all cursor-pointer whitespace-nowrap ${
                              isExpanded
                                ? 'bg-blue-50 border-blue-200 text-[#1E3A8A] dark:bg-blue-950 dark:border-blue-800'
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300 dark:bg-purple-950/40 dark:border-purple-800/60 dark:text-purple-200'
                            }`}
                          >
                            <Lightbulb size={11} className="text-amber-500" />
                            <span>Rút ra</span>
                            {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                          </button>
                        )}
                      </div>

                      {/* Nút 1 chạm: Đã hiểu rồi (gỡ khỏi danh sách ôn tập) */}
                      <button
                        type="button"
                        onClick={() => handleMarkUnderstood(item)}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200 text-[11px] font-black cursor-pointer active:scale-95 transition-all shadow-2xs whitespace-nowrap ml-auto"
                        title="Bấm để đánh dấu đã hiểu và hoàn thành ôn tập"
                      >
                        <Check size={12} strokeWidth={3} />
                        <span>Đã hiểu</span>
                      </button>
                    </div>

                    {/* Bung khung Bài học rút ra (nếu bấm Rút ra) */}
                    {isExpanded && item.takeaway && (
                      <div className="mt-1 p-2.5 rounded-[12px] bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex flex-col gap-1 animate-fadeIn">
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-[#1E3A8A] dark:text-blue-300">
                          <Lightbulb size={11} className="text-amber-500 fill-amber-500" />
                          <span>Bài học rút ra</span>
                        </div>
                        <p className="text-[11.5px] text-slate-700 dark:text-slate-300 leading-relaxed pl-1.5 border-l-2 border-blue-400">
                          {item.takeaway}
                        </p>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* 4. Thanh điều hướng dưới cùng */}
      <BottomNav />

      {/* 5. Modal Lưu tiến độ & Đồng bộ qua SĐT */}
      <UserSyncModal
        isOpen={showPhoneSync}
        onClose={() => setShowPhoneSync(false)}
        reason="manual"
        onSuccess={refreshList}
      />
    </main>
  );
}
