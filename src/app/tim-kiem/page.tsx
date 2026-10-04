'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search as SearchIcon, X, ArrowLeft, BookOpen, PlaySquare, Layers, ChevronRight } from 'lucide-react';
import BottomNav from '../../components/BottomNav';

export const dynamic = 'force-dynamic';

function removeVietnameseTones(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

interface SearchData {
  topics: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    color_bg: string;
    color_fg: string;
    icon_url?: string;
    cover_url?: string;
  }[];
  pages: {
    id: string;
    title: string;
    slug: string;
    topic_slug: string;
    topic_title: string;
    page_number: number;
    summary: string | null;
    cover_url?: string;
    text_snippets: string[];
  }[];
  videos: {
    youtube_id: string;
    title: string;
    description?: string;
    topic_slug: string;
    topic_title: string;
    page_slug: string;
    page_title: string;
    page_number: number;
    video_index: number;
    thumbnail_url?: string;
  }[];
}

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [allData, setAllData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);

  // Tự động focus vào ô nhập và cập nhật tiêu đề trang
  useEffect(() => {
    inputRef.current?.focus();
    document.title = 'Tìm kiếm bài học · Học Cơ Thể';
  }, []);

  // Tải dữ liệu tìm kiếm
  useEffect(() => {
    fetch('/api/search')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setAllData(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Debounce 300ms sau khi ngừng gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const cleanQuery = removeVietnameseTones(debouncedQuery);

  // Lọc kết quả theo 3 nhóm: Chủ đề, Trang nội dung, Video
  const matchedTopics = (allData?.topics || []).filter((t) => {
    if (!cleanQuery) return false;
    const titleMatch = removeVietnameseTones(t.title).includes(cleanQuery);
    const descMatch = t.description && removeVietnameseTones(t.description).includes(cleanQuery);
    return titleMatch || descMatch;
  });

  const matchedPages = (allData?.pages || []).filter((p) => {
    if (!cleanQuery) return false;
    const titleMatch = removeVietnameseTones(p.title).includes(cleanQuery);
    const summaryMatch = p.summary && removeVietnameseTones(p.summary).includes(cleanQuery);
    const snippetMatch = p.text_snippets.some((snip) =>
      removeVietnameseTones(snip).includes(cleanQuery)
    );
    return titleMatch || summaryMatch || snippetMatch;
  });

  const matchedVideos = (allData?.videos || []).filter((v) => {
    if (!cleanQuery) return false;
    const titleMatch = removeVietnameseTones(v.title).includes(cleanQuery);
    const descMatch = v.description && removeVietnameseTones(v.description).includes(cleanQuery);
    return titleMatch || descMatch;
  });

  const totalResults = matchedTopics.length + matchedPages.length + matchedVideos.length;

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-4 max-w-[640px] w-full mx-auto">
      {/* 1. Thanh đầu trang: Nút quay lại + Ô tìm kiếm */}
      <section className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-11 h-11 min-w-[44px] rounded-[14px] bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-800/40 flex items-center justify-center text-slate-700 dark:text-purple-200 hover:text-purple-700 dark:hover:text-[#F8DF7B] transition-colors cursor-pointer shadow-2xs"
          aria-label="Quay lại"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-slate-400">
            <SearchIcon size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài học, đĩa đệm, cột sống..."
            className="w-full h-[48px] pl-10 pr-10 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-800/40 focus:border-purple-600 dark:focus:border-[#F8DF7B] text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden shadow-2xs transition-colors"
            aria-label="Nhập từ khóa tìm kiếm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-2 my-auto w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              aria-label="Xóa từ khóa"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </section>

      {/* 2. Nội dung kết quả */}
      <section className="flex flex-col gap-5">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-[14px] font-medium animate-pulse">
            Đang tải dữ liệu tìm kiếm...
          </div>
        ) : !cleanQuery ? (
          /* Gợi ý khi chưa gõ */
          <div className="flex flex-col gap-2.5 py-3 px-1">
            <h2 className="text-[12px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-purple-300/70">
              Gợi ý tìm kiếm phổ biến
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Cột sống', 'Đĩa đệm', 'Thần kinh', 'Tư thế', 'Dây chằng', 'Dinh dưỡng'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="h-8.5 px-3.5 rounded-full bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-800/40 text-[13px] font-bold text-slate-800 dark:text-purple-200 hover:border-purple-600 hover:text-purple-700 dark:hover:text-[#F8DF7B] dark:hover:border-[#F8DF7B] cursor-pointer shadow-2xs transition-all active:scale-95"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          /* Không tìm thấy */
          <div className="p-8 text-center bg-white dark:bg-[#160D30] rounded-[20px] border border-slate-200 dark:border-purple-800/40 my-4 flex flex-col gap-1.5 shadow-2xs">
            <p className="text-[16px] text-slate-900 dark:text-white font-extrabold">
              Không tìm thấy kết quả phù hợp
            </p>
            <p className="text-[13px] text-slate-500 dark:text-purple-300/70 font-normal">
              Thử tìm với từ khóa khác như: cột sống, đĩa đệm, dinh dưỡng.
            </p>
          </div>
        ) : (
          /* Danh sách kết quả theo 3 nhóm thiết kế dạng Flycy */
          <div className="flex flex-col gap-5">
            {/* Nhóm 1: Chủ đề */}
            {matchedTopics.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-slate-500 dark:text-purple-300/70 uppercase tracking-wider px-1">
                  <Layers size={14} className="text-primary dark:text-[#F8DF7B]" />
                  <span>CHUYÊN ĐỀ ({matchedTopics.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {matchedTopics.map((t) => {
                    const iconSrc = t.icon_url || `/images/topics/${t.slug}.png`;
                    return (
                      <Link
                        key={t.id}
                        href={`/${t.slug}`}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 hover:border-purple-600/50 dark:hover:border-[#F8DF7B]/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail 3D chuyên đề sắc nét */}
                          <div className="w-12 h-12 rounded-[12px] bg-slate-50 dark:bg-purple-950/70 border border-slate-200 dark:border-purple-800/50 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={iconSrc}
                              alt={t.title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-primary dark:text-[#F8DF7B] uppercase tracking-wider">
                              Chuyên đề y khoa
                            </span>
                            <span className="text-[15px] font-black text-slate-900 dark:text-white leading-snug truncate group-hover:text-purple-700 dark:group-hover:text-[#F8DF7B] transition-colors">
                              {t.title}
                            </span>
                            {t.description && (
                              <p className="text-[12px] text-slate-500 dark:text-purple-300/70 line-clamp-1 mt-0.5">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-purple-900/40 text-slate-400 group-hover:text-purple-700 dark:group-hover:text-[#F8DF7B] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nhóm 2: Trang nội dung */}
            {matchedPages.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-slate-500 dark:text-purple-300/70 uppercase tracking-wider px-1">
                  <BookOpen size={14} className="text-primary dark:text-[#F8DF7B]" />
                  <span>BÀI HỌC NỘI DUNG ({matchedPages.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {matchedPages.map((p) => {
                    const formattedNum = String(p.page_number).padStart(2, '0');
                    const thumbSrc = p.cover_url || `/images/topics/${p.topic_slug}.png`;
                    return (
                      <Link
                        key={p.id}
                        href={`/${p.topic_slug}/${p.slug}`}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 hover:border-purple-600/50 dark:hover:border-[#F8DF7B]/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail bài học */}
                          <div className="w-12 h-12 rounded-[12px] bg-slate-50 dark:bg-purple-950/70 border border-slate-200 dark:border-purple-800/50 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={thumbSrc}
                              alt={p.title}
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-[10.5px] font-black text-slate-500 dark:text-purple-300/70 uppercase tracking-wider">
                              {p.topic_title} · Bài {formattedNum}
                            </span>
                            <span className="text-[14.5px] font-black text-slate-900 dark:text-white leading-snug truncate group-hover:text-purple-700 dark:group-hover:text-[#F8DF7B] transition-colors">
                              {p.title}
                            </span>
                            {p.summary && (
                              <p className="text-[12px] text-slate-500 dark:text-purple-300/70 line-clamp-1 mt-0.5">
                                {p.summary}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-purple-900/40 text-slate-400 group-hover:text-purple-700 dark:group-hover:text-[#F8DF7B] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nhóm 3: Video */}
            {matchedVideos.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-slate-500 dark:text-purple-300/70 uppercase tracking-wider px-1">
                  <PlaySquare size={14} className="text-red-500" />
                  <span>VIDEO HƯỚNG DẪN ({matchedVideos.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {matchedVideos.map((v, i) => {
                    const formattedNum = String(v.page_number).padStart(2, '0');
                    const videoThumb = v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`;
                    return (
                      <Link
                        key={i}
                        href={`/${v.topic_slug}/${v.page_slug}?v=${v.video_index}`}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-800/40 hover:border-red-400/50 dark:hover:border-red-500/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail video tỷ lệ 16:9 kèm nút Play đỏ */}
                          <div className="w-[66px] h-[44px] rounded-[10px] bg-slate-900 border border-slate-200 dark:border-purple-800/50 shrink-0 relative overflow-hidden shadow-2xs group-hover:scale-105 transition-transform flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={videoThumb}
                              alt={v.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                              <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xs">
                                <PlaySquare size={11} fill="white" />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-wider">
                              {v.topic_title} · Bài {formattedNum} · Video {v.video_index}
                            </span>
                            <span className="text-[14.5px] font-black text-slate-900 dark:text-white leading-snug truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                              {v.title}
                            </span>
                            {v.description && (
                              <p className="text-[12px] text-slate-500 dark:text-purple-300/70 line-clamp-1 mt-0.5">
                                {v.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-purple-900/40 text-slate-400 group-hover:text-red-500 flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. Thanh điều hướng dưới cùng */}
      <BottomNav />
    </main>
  );
}
