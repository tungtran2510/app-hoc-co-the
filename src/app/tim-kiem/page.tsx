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
  }[];
  pages: {
    id: string;
    title: string;
    slug: string;
    topic_slug: string;
    topic_title: string;
    page_number: number;
    summary: string | null;
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
    <main className="flex-1 flex flex-col px-5 pt-3 pb-28 gap-5">
      {/* 1. Thanh đầu trang: Nút quay lại + Ô tìm kiếm */}
      <section className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-12 h-12 min-w-[48px] rounded-[16px] bg-white border border-line flex items-center justify-center text-ink hover:text-primary transition-colors cursor-pointer shadow-2xs"
          aria-label="Quay lại"
        >
          <ArrowLeft size={22} />
        </button>

        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted">
            <SearchIcon size={20} />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm bài, ví dụ: cột sống, đĩa đệm"
            className="w-full h-[52px] min-h-[48px] pl-11 pr-11 rounded-[18px] bg-white border-[1.5px] border-line focus:border-primary text-[17px] text-ink placeholder:text-muted focus:outline-hidden shadow-2xs transition-colors"
            aria-label="Nhập từ khóa tìm kiếm"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-2 my-auto w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink cursor-pointer"
              aria-label="Xóa từ khóa"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </section>

      {/* 2. Nội dung kết quả */}
      <section className="flex flex-col gap-6">
        {loading ? (
          <div className="p-8 text-center text-muted text-[15px]">
            Đang tải dữ liệu tìm kiếm...
          </div>
        ) : !cleanQuery ? (
          /* Gợi ý khi chưa gõ */
          <div className="flex flex-col gap-3 py-6 px-1">
            <h2 className="text-[15px] font-extrabold uppercase tracking-wider text-muted">
              Gợi ý tìm kiếm nhanh
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Cột sống', 'Đĩa đệm', 'Thần kinh', 'Tư thế', 'Dây chằng'].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setQuery(tag)}
                  className="h-10 px-4 rounded-full bg-white border border-line text-[15px] font-bold text-ink hover:border-primary cursor-pointer shadow-2xs transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          /* Không tìm thấy */
          <div className="p-8 text-center bg-white rounded-[22px] border border-line my-4 flex flex-col gap-2">
            <p className="text-[17px] text-ink font-extrabold">
              Không tìm thấy
            </p>
            <p className="text-[15px] text-muted font-normal">
              Thử từ khác, ví dụ: cột sống, đĩa đệm.
            </p>
          </div>
        ) : (
          /* Danh sách kết quả theo 3 nhóm */
          <div className="flex flex-col gap-6">
            {/* Nhóm 1: Chủ đề */}
            {matchedTopics.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-muted uppercase tracking-wider px-1">
                  <Layers size={16} className="text-primary" />
                  <span>CHỦ ĐỀ ({matchedTopics.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {matchedTopics.map((t) => (
                    <Link
                      key={t.id}
                      href={`/${t.slug}`}
                      className="p-4 rounded-[18px] bg-white border border-line hover:border-line-strong transition-all flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex flex-col gap-1 min-w-0 pr-3">
                        <span className="text-[17px] font-extrabold text-ink leading-snug truncate">
                          {t.title}
                        </span>
                        {t.description && (
                          <p className="text-[14px] text-muted line-clamp-2">
                            {t.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight size={20} className="text-muted shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Nhóm 2: Trang nội dung */}
            {matchedPages.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-muted uppercase tracking-wider px-1">
                  <BookOpen size={16} className="text-primary" />
                  <span>TRANG NỘI DUNG ({matchedPages.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {matchedPages.map((p) => {
                    const formattedNum = String(p.page_number).padStart(2, '0');
                    return (
                      <Link
                        key={p.id}
                        href={`/${p.topic_slug}/${p.slug}`}
                        className="p-4 rounded-[18px] bg-white border border-line hover:border-line-strong transition-all flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                          <span className="text-[12px] font-extrabold text-muted uppercase tracking-wider">
                            {p.topic_title} · {formattedNum}
                          </span>
                          <span className="text-[17px] font-extrabold text-ink leading-snug truncate">
                            {p.title}
                          </span>
                          {p.summary && (
                            <p className="text-[14px] text-muted line-clamp-2 mt-0.5">
                              {p.summary}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={20} className="text-muted shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nhóm 3: Video */}
            {matchedVideos.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-muted uppercase tracking-wider px-1">
                  <PlaySquare size={16} className="text-primary" />
                  <span>VIDEO ({matchedVideos.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {matchedVideos.map((v, i) => {
                    const formattedNum = String(v.page_number).padStart(2, '0');
                    return (
                      <Link
                        key={i}
                        href={`/${v.topic_slug}/${v.page_slug}?v=${v.video_index}`}
                        className="p-4 rounded-[18px] bg-white border border-line hover:border-line-strong transition-all flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                          <span className="text-[12px] font-extrabold text-primary uppercase tracking-wider">
                            {v.topic_title} · {formattedNum} · Video {String(v.video_index).padStart(2, '0')}
                          </span>
                          <span className="text-[17px] font-extrabold text-ink leading-snug truncate">
                            {v.title}
                          </span>
                          {v.description && (
                            <p className="text-[14px] text-muted line-clamp-2 mt-0.5">
                              {v.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={20} className="text-muted shrink-0" />
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
