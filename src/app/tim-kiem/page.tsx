'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search as SearchIcon,
  X,
  ArrowLeft,
  BookOpen,
  PlaySquare,
  Layers,
  ChevronRight,
  Mic,
  MicOff,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import BodyMapNavigator from '../../components/BodyMapNavigator';
import {
  processSearchQuery,
  calculateMatchScore,
  removeVietnameseTones,
  ProcessedSearchQuery,
} from '../../lib/smartSearch';

export const dynamic = 'force-dynamic';

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

let cachedSearchData: SearchData | null = null;

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [allData, setAllData] = useState<SearchData | null>(cachedSearchData);
  const [loading, setLoading] = useState(!cachedSearchData);

  // Trạng thái Tìm kiếm bằng giọng nói (Voice Search)
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Tự động focus vào ô nhập và cập nhật tiêu đề trang
  useEffect(() => {
    inputRef.current?.focus();
    document.title = 'Tìm kiếm bài học · Học Cơ Thể';
  }, []);

  // Tải dữ liệu tìm kiếm (sử dụng cache bộ nhớ tức thì 0ms khi quay lại tab)
  useEffect(() => {
    if (cachedSearchData) {
      setLoading(false);
      return;
    }
    fetch('/api/search')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          cachedSearchData = data;
          setAllData(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Debounce 250ms sau khi ngừng gõ
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Khởi tạo và xử lý Tìm kiếm Giọng nói 1 chạm (Web Speech API)
  const toggleVoiceSearch = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setVoiceNotice(null);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceNotice('Trình duyệt chưa hỗ trợ micro hoặc cần cấp quyền micro');
      setTimeout(() => setVoiceNotice(null), 3000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'vi-VN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceNotice('Đang nghe bạn nói... Hãy nói từ khóa hoặc câu hỏi');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          setQuery(transcript.trim());
        }
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceNotice('Vui lòng cấp quyền Microphone trên trình duyệt');
        } else if (event.error !== 'no-speech') {
          setVoiceNotice('Không nhận diện được giọng nói. Vui lòng thử lại');
        } else {
          setVoiceNotice(null);
        }
        setTimeout(() => setVoiceNotice(null), 3500);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setVoiceNotice(null), 1500);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceNotice('Không thể kích hoạt micro. Vui lòng thử lại.');
      setTimeout(() => setVoiceNotice(null), 3000);
    }
  };

  // Phân tích thông minh câu truy vấn (Smart Query Analysis)
  const processedQuery: ProcessedSearchQuery = processSearchQuery(debouncedQuery);

  // Lọc và xếp hạng kết quả thông minh chuẩn y khoa
  const scoredTopics = (allData?.topics || [])
    .map((t) => {
      const scoreTitle = calculateMatchScore(t.title, processedQuery);
      const scoreDesc = calculateMatchScore(t.description, processedQuery);
      return { topic: t, score: Math.max(scoreTitle, scoreDesc) };
    })
    .filter((item) => item.score >= 35) // Chỉ lấy chuyên đề thực sự liên quan, loại bỏ gợi ý lan man
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Tinh gọn tối đa 3 chuyên đề chuẩn xác nhất

  const scoredPages = (allData?.pages || [])
    .map((p) => {
      const scoreTitle = calculateMatchScore(p.title, processedQuery);
      const scoreSummary = calculateMatchScore(p.summary, processedQuery);
      const scoreTopic = calculateMatchScore(p.topic_title, processedQuery);
      const snippetScores = p.text_snippets.map((s) => calculateMatchScore(s, processedQuery));
      const maxSnippet = snippetScores.length ? Math.max(...snippetScores) : 0;
      
      // Bài học BẮT BUỘC phải có độ tương thích từ chính bài học đó (tiêu đề, tóm tắt, nội dung)
      const ownScore = Math.max(scoreTitle * 1.5, scoreSummary, maxSnippet);
      // Điểm chuyên đề chỉ đóng vai trò cộng hưởng nhẹ (20%) khi bài học đã liên quan
      const finalScore = ownScore > 0 ? ownScore + scoreTopic * 0.2 : 0;

      return {
        page: p,
        score: finalScore,
      };
    })
    .filter((item) => item.score >= 25) // Loại bỏ bài học dưới ngưỡng liên quan
    .sort((a, b) => b.score - a.score)
    .slice(0, 20); // Tối đa 20 bài học liên quan nhất

  const scoredVideos = (allData?.videos || [])
    .map((v) => {
      const scoreTitle = calculateMatchScore(v.title, processedQuery);
      const scoreDesc = calculateMatchScore(v.description, processedQuery);
      const scoreTopic = calculateMatchScore(v.topic_title, processedQuery);
      const ownVideo = Math.max(scoreTitle * 1.4, scoreDesc);
      const finalScore = ownVideo > 0 ? ownVideo + scoreTopic * 0.2 : 0;
      return {
        video: v,
        score: finalScore,
      };
    })
    .filter((item) => item.score >= 25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  const totalResults = scoredTopics.length + scoredPages.length + scoredVideos.length;

  return (
    <main className="flex-1 flex flex-col px-4 sm:px-5 pt-3 pb-28 gap-3 max-w-[640px] w-full mx-auto font-[var(--font-be-vietnam-pro)]">
      {/* 1. Thanh đầu trang: Nút quay lại + Ô tìm kiếm + Nút Voice Search 1 chạm */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-11 h-11 min-w-[44px] rounded-[14px] bg-white dark:bg-[#0E1A33] border border-slate-200 dark:border-blue-900/50 flex items-center justify-center text-slate-700 dark:text-sky-200 hover:text-[#0E2A5C] dark:hover:text-white transition-colors cursor-pointer shadow-2xs"
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
              placeholder="Tìm bài học, câu hỏi, hoặc bấm micro..."
              className="w-full h-[48px] pl-10 pr-20 rounded-[16px] bg-white dark:bg-[#0E1A33] border border-slate-200 dark:border-blue-900/50 focus:border-[#0284C7] dark:focus:border-sky-400 text-[15px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden shadow-2xs transition-colors"
              aria-label="Nhập từ khóa tìm kiếm"
            />

            {/* Các nút bên phải: Xóa & Nút Giọng nói Micro */}
            <div className="absolute inset-y-0 right-2 flex items-center gap-1">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    inputRef.current?.focus();
                  }}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  aria-label="Xóa từ khóa"
                >
                  <X size={15} />
                </button>
              )}

              {/* Nút Micro Voice Search 1 chạm */}
              <button
                type="button"
                onClick={toggleVoiceSearch}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse shadow-md ring-2 ring-rose-300'
                    : 'text-slate-500 hover:text-[#0E2A5C] dark:text-sky-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-blue-950/60'
                }`}
                title={isListening ? 'Đang nghe... Bấm để dừng' : 'Tìm kiếm bằng giọng nói tiếng Việt'}
                aria-label="Tìm kiếm bằng giọng nói"
              >
                {isListening ? <Mic size={17} className="animate-bounce" /> : <Mic size={17} />}
              </button>
            </div>
          </div>
        </div>

        {/* Thông báo vi mô khi đang ghi âm giọng nói */}
        {voiceNotice && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-[12px] font-bold shadow-2xs animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
            <span className="truncate">{voiceNotice}</span>
          </div>
        )}

        {/* Dải chỉ báo Tìm kiếm thông minh (Smart Search Indicator) - Tông Xanh Navy Hiện Đại */}
        {processedQuery.clean && (processedQuery.isQuestion || processedQuery.expandedTerms.length > 0) && (
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[12px] bg-sky-50 dark:bg-[#0E1A33] border border-sky-200 dark:border-blue-900/60 text-[11.5px] text-[#0E2A5C] dark:text-sky-200">
            <Sparkles size={13} className="text-[#0284C7] dark:text-sky-400 shrink-0" />
            <span className="font-extrabold shrink-0">Thông minh:</span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 whitespace-nowrap">
              {processedQuery.expandedTerms.slice(0, 3).map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="px-2 py-0.5 rounded-full bg-white dark:bg-blue-950 border border-sky-200 dark:border-blue-800 font-bold hover:border-sky-500 cursor-pointer text-[10.5px] text-[#0E2A5C] dark:text-sky-200"
                >
                  +{term}
                </button>
              ))}
              {processedQuery.isQuestion && (
                <span className="text-[11px] text-blue-700 dark:text-sky-300/80 italic">
                  Đã tự động trích lọc từ khóa chính
                </span>
              )}
            </div>
          </div>
        )}
      </section>

      {/* 2. Nội dung kết quả */}
      <section className="flex flex-col gap-5">
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-[14px] font-medium animate-pulse">
            Đang tải dữ liệu tìm kiếm...
          </div>
        ) : !processedQuery.clean ? (
          /* Gợi ý khi chưa gõ */
          <div className="flex flex-col gap-4 py-1">
            {/* Bản Đồ Cơ Thể 1 Chạm Trực Quan */}
            <BodyMapNavigator onSelectKeyword={(kw) => setQuery(kw)} />

            <div className="flex flex-col gap-2 px-1">
              <h2 className="text-[12px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-purple-300/70">
                Từ khóa tìm kiếm nhanh
              </h2>
              <div className="flex flex-wrap gap-2">
                {[
                  'Cột sống',
                  'Đĩa đệm',
                  'Cổ vai gáy',
                  'Tư thế ngồi',
                  'Dây chằng',
                  'Uống nước',
                ].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setQuery(tag)}
                    className="h-8.5 px-3.5 rounded-full bg-white dark:bg-[#0E1A33] border border-slate-200 dark:border-blue-900/50 text-[13px] font-bold text-slate-800 dark:text-sky-200 hover:border-[#0284C7] hover:text-[#0E2A5C] dark:hover:text-white dark:hover:border-sky-400 cursor-pointer shadow-2xs transition-all active:scale-95"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : totalResults === 0 ? (
          /* Không tìm thấy */
          <div className="p-8 text-center bg-white dark:bg-[#0E1A33] rounded-[20px] border border-slate-200 dark:border-blue-900/50 my-4 flex flex-col gap-1.5 shadow-2xs">
            <p className="text-[16px] text-slate-900 dark:text-white font-extrabold">
              Không tìm thấy kết quả phù hợp
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-normal">
              Thử tìm với từ khóa khác như: cột sống, đĩa đệm, vai gáy, uống nước.
            </p>
          </div>
        ) : (
          /* Danh sách kết quả theo 3 nhóm thiết kế chuẩn MEDICA LEARN */
          <div className="flex flex-col gap-5">
            {/* Nhóm 1: Chủ đề */}
            {scoredTopics.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                  <Layers size={14} className="text-[#0E2A5C] dark:text-sky-400" />
                  <span>CHUYÊN ĐỀ ({scoredTopics.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {scoredTopics.map(({ topic: t }) => {
                    const iconSrc = t.icon_url || `/images/topics/${t.slug}.png`;
                    return (
                      <Link
                        key={t.id}
                        href={`/${t.slug}`}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#0E1A33] border border-slate-200/90 dark:border-blue-900/50 hover:border-[#0284C7] dark:hover:border-sky-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail 3D chuyên đề sắc nét */}
                          <div className="w-12 h-12 rounded-[12px] bg-slate-50 dark:bg-blue-950/70 border border-slate-200 dark:border-blue-900/60 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
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
                            <span className="text-[10px] font-black text-[#0E2A5C] dark:text-sky-400 uppercase tracking-wider">
                              Chuyên đề y khoa
                            </span>
                            <span className="text-[15px] font-black text-slate-900 dark:text-white leading-snug truncate group-hover:text-[#0E2A5C] dark:group-hover:text-sky-300 transition-colors">
                              {t.title}
                            </span>
                            {t.description && (
                              <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {t.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-blue-950/60 text-slate-400 group-hover:text-[#0284C7] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nhóm 2: Trang nội dung */}
            {scoredPages.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                  <BookOpen size={14} className="text-[#0E2A5C] dark:text-sky-400" />
                  <span>BÀI HỌC NỘI DUNG ({scoredPages.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {scoredPages.map(({ page: p }) => {
                    const formattedNum = String(p.page_number).padStart(2, '0');
                    const thumbSrc = p.cover_url || `/images/topics/${p.topic_slug}.png`;
                    return (
                      <Link
                        key={p.id}
                        href={`/${p.topic_slug}/${p.slug}`}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#0E1A33] border border-slate-200/90 dark:border-blue-900/50 hover:border-[#0284C7] dark:hover:border-sky-400 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Thumbnail bài học */}
                          <div className="w-12 h-12 rounded-[12px] bg-slate-50 dark:bg-blue-950/70 border border-slate-200 dark:border-blue-900/60 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
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
                            <span className="text-[10.5px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              {p.topic_title} · Bài {formattedNum}
                            </span>
                            <span className="text-[14.5px] font-black text-slate-900 dark:text-white leading-snug truncate group-hover:text-[#0E2A5C] dark:group-hover:text-sky-300 transition-colors">
                              {p.title}
                            </span>
                            {p.summary && (
                              <p className="text-[12px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                {p.summary}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-blue-950/60 text-slate-400 group-hover:text-[#0284C7] flex items-center justify-center shrink-0 transition-transform group-hover:translate-x-0.5">
                          <ChevronRight size={16} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Nhóm 3: Video */}
            {scoredVideos.length > 0 && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5 text-[12px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                  <PlaySquare size={14} className="text-red-500" />
                  <span>VIDEO HƯỚNG DẪN ({scoredVideos.length})</span>
                </div>

                <div className="flex flex-col gap-2">
                  {scoredVideos.map(({ video: v }, i) => {
                    const formattedNum = String(v.page_number).padStart(2, '0');
                    const videoThumb =
                      v.thumbnail_url || `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg`;
                    return (
                      <Link
                        key={i}
                        href={`/${v.topic_slug}/${v.page_slug}?v=${v.video_index}`}
                        className="p-3 rounded-[16px] bg-white dark:bg-[#0E1A33] border border-slate-200/90 dark:border-blue-900/50 hover:border-red-400/50 dark:hover:border-red-500/60 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-3 group"
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
