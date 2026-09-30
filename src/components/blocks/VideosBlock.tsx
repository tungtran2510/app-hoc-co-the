'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, Check, BarChart2, MoreVertical, ArrowRight, Sparkles } from 'lucide-react';
import { Video } from '../../lib/types';
import SpineIllustration from '../SpineIllustration';
import {
  saveStoredXemTiep,
  saveVideoWatched,
  getStoredTienDo,
  updateScrollPosition,
  getStoredXemTiep,
} from '../../lib/learningProgress';

// Khai báo kiểu YT toàn cục cho YouTube IFrame Player API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface VideosBlockProps {
  videos: Video[];
  displayStyle?: 'single' | 'playlist';
  defaultActiveIndex?: number;
  blockId?: string;
  isAdmin?: boolean;
  onOpenVideoManager?: () => void;
  pageId?: string;
  topicSlug?: string;
  topicTitle?: string;
  pageSlug?: string;
  pageTitle?: string;
  pageNumber?: number;
  pageCoverUrl?: string | null;
  nextPage?: { slug: string; title: string; orderNumber: number } | null;
  summaryContent?: React.ReactNode;
  resourcesContent?: React.ReactNode;
  activeTab?: 'syllabus' | 'summary' | 'resources';
  onTabChange?: (tab: 'syllabus' | 'summary' | 'resources') => void;
}

export default function VideosBlock({
  videos,
  displayStyle = 'playlist',
  defaultActiveIndex = 0,
  blockId,
  isAdmin = false,
  onOpenVideoManager,
  pageId = '',
  topicSlug = '',
  topicTitle = '',
  pageSlug = '',
  pageTitle = '',
  pageNumber = 1,
  pageCoverUrl,
  nextPage,
  summaryContent,
  resourcesContent,
  activeTab,
  onTabChange,
}: VideosBlockProps) {
  const searchParams = useSearchParams();
  const vParam = searchParams.get('v');

  // Xác định video bắt đầu: ưu tiên param ?v=n
  const initialIndex = (() => {
    if (vParam) {
      const parsed = parseInt(vParam, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= videos.length) {
        return parsed - 1;
      }
    }
    return defaultActiveIndex < videos.length ? defaultActiveIndex : 0;
  })();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEndedPlaylist, setIsEndedPlaylist] = useState(false);
  const [watchedList, setWatchedList] = useState<number[]>([]);
  const [localTab, setLocalTab] = useState<'syllabus' | 'summary' | 'resources'>('syllabus');

  const currentTab = activeTab || localTab;
  const handleTabChange = (tab: 'syllabus' | 'summary' | 'resources') => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalTab(tab);
    }
  };

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);

  // Đọc danh sách video đã xem từ localStorage
  useEffect(() => {
    if (!pageId) return;
    try {
      const tienDo = getStoredTienDo();
      if (tienDo[pageId]?.watched) {
        setWatchedList(tienDo[pageId].watched);
      }
    } catch {
      // Bỏ qua
    }
  }, [pageId]);

  // Cuộn tới khối video nếu có param ?v= hoặc khôi phục scroll_y
  useEffect(() => {
    if (vParam && containerRef.current) {
      setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    } else {
      // Nếu vào từ Xem tiếp có lưu vị trí cuộn
      try {
        const stored = getStoredXemTiep();
        if (
          stored &&
          stored.page_slug === pageSlug &&
          typeof stored.scroll_y === 'number' &&
          stored.scroll_y > 100
        ) {
          setTimeout(() => {
            window.scrollTo({ top: stored.scroll_y, behavior: 'smooth' });
          }, 350);
        }
      } catch {
        // Bỏ qua
      }
    }
  }, [vParam, pageSlug]);

  // Lưu vị trí cuộn khi người dùng rời trang
  useEffect(() => {
    const handleSaveScroll = () => {
      updateScrollPosition(window.scrollY);
    };

    window.addEventListener('beforeunload', handleSaveScroll);
    return () => {
      handleSaveScroll();
      window.removeEventListener('beforeunload', handleSaveScroll);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!videos || videos.length === 0) {
    return null;
  }

  const safeIndex = activeIndex < videos.length ? activeIndex : 0;
  const currentVideo = videos[safeIndex];
  const isPlaylist = displayStyle === 'playlist' && videos.length > 1;

  // Cập nhật xem_tiep vào localStorage khi chọn video hoặc bắt đầu phát
  const recordXemTiep = (vidIndex: number) => {
    if (!topicSlug || !pageSlug) return;
    const vid = videos[vidIndex] || videos[0];
    saveStoredXemTiep({
      topic_slug: topicSlug,
      topic_title: topicTitle,
      page_slug: pageSlug,
      page_title: pageTitle,
      page_number: pageNumber,
      video_index: vidIndex + 1,
      video_total: videos.length,
      video_title: vid.title,
      cover_url: pageCoverUrl || vid.thumbnail_url || null,
    });
  };

  // Đánh dấu video đã xem
  const markWatched = (vidIndex: number) => {
    const videoNum = vidIndex + 1;
    if (pageId) {
      saveVideoWatched(pageId, videoNum);
      setWatchedList((prev) => (prev.includes(videoNum) ? prev : [...prev, videoNum]));
    }
  };

  // Khởi tạo YouTube IFrame Player API
  useEffect(() => {
    if (!currentVideo.youtube_id) return;

    let destroyed = false;

    const initPlayer = () => {
      if (destroyed) return;
      const iframeId = `yt-player-${blockId || 'default'}`;
      const elem = document.getElementById(iframeId);
      if (!elem || !window.YT || !window.YT.Player) return;

      // Xóa player cũ nếu đã tồn tại
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Bỏ qua
        }
      }

      playerRef.current = new window.YT.Player(iframeId, {
        videoId: currentVideo.youtube_id,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
        },
        events: {
          onReady: () => {
            if (isPlaying && playerRef.current?.playVideo) {
              playerRef.current.playVideo();
            }
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1
            if (event.data === 1) {
              setIsPlaying(true);
              recordXemTiep(safeIndex);

              // Theo dõi thời lượng phát >= 80%
              if (intervalRef.current) clearInterval(intervalRef.current);
              intervalRef.current = setInterval(() => {
                try {
                  if (playerRef.current && playerRef.current.getDuration) {
                    const dur = playerRef.current.getDuration();
                    const cur = playerRef.current.getCurrentTime();
                    if (dur > 0 && cur / dur >= 0.8) {
                      markWatched(safeIndex);
                    }
                  }
                } catch {
                  // Bỏ qua
                }
              }, 1000);
            }

            // YT.PlayerState.ENDED = 0
            if (event.data === 0) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              markWatched(safeIndex);

              // Tự chuyển video kế tiếp trong cùng khối
              if (safeIndex + 1 < videos.length) {
                const nextIdx = safeIndex + 1;
                setActiveIndex(nextIdx);
                setIsPlaying(true);
                recordXemTiep(nextIdx);
                const nextVideo = videos[nextIdx];
                if (nextVideo?.youtube_id && playerRef.current?.loadVideoById) {
                  playerRef.current.loadVideoById(nextVideo.youtube_id);
                }
              } else {
                // Video cuối cùng trong danh sách
                setIsEndedPlaylist(true);
              }
            }
          },
        },
      });
    };

    // Nạp script YouTube API nếu chưa có
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      const oldCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (oldCallback) oldCallback();
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      destroyed = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentVideo.youtube_id, safeIndex]);

  // Đổi video khi bấm vào dòng trong danh sách
  const handleSelectVideo = (idx: number) => {
    setActiveIndex(idx);
    setIsPlaying(true);
    setIsEndedPlaylist(false);
    recordXemTiep(idx);

    const targetVid = videos[idx];
    if (targetVid?.youtube_id && playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(targetVid.youtube_id);
    }
  };

  return (
    <div
      ref={containerRef}
      id={blockId}
      className="w-full flex flex-col gap-3.5 scroll-mt-20"
    >
      {/* Trình phát 16:9 */}
      <div className="relative w-full aspect-video rounded-[22px] bg-ink overflow-hidden shadow-sm flex items-center justify-center">
        {currentVideo.youtube_id ? (
          <>
            <div
              id={`yt-player-${blockId || 'default'}`}
              className="w-full h-full border-0"
            />
            {/* Lớp phủ ảnh bên ngoài khi video chưa bắt đầu phát */}
            {!isPlaying && (
              <div
                onClick={() => {
                  setIsPlaying(true);
                  if (playerRef.current?.playVideo) {
                    playerRef.current.playVideo();
                  }
                }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 cursor-pointer group transition-all"
                title="Bấm để phát video"
              >
                {(currentVideo.thumbnail_url || currentVideo.youtube_id) && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      currentVideo.thumbnail_url ||
                      `https://i.ytimg.com/vi/${currentVideo.youtube_id}/hqdefault.jpg`
                    }
                    alt={currentVideo.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                <div className="relative z-10 w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-full bg-white/95 flex items-center justify-center text-primary shadow-2xl transition-transform group-hover:scale-105 active:scale-95">
                  <Play size={30} fill="currentColor" className="ml-1 text-primary" />
                </div>

                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 text-white text-[13px] sm:text-[14px] font-semibold bg-black/60 px-3 py-1.5 rounded-[10px] backdrop-blur-xs">
                  <span className="truncate pr-2">{currentVideo.title}</span>
                  <span className="shrink-0 text-white/80 text-[11px] sm:text-[12px] font-normal">
                    {currentVideo.duration_text || '5 phút'}
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Khung mô phỏng video khi chưa có youtube_id */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#111A24] to-[#1C2735]">
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <SpineIllustration className="h-[80%] max-w-[200px]" />
            </div>

            <button
              type="button"
              onClick={() => {
                if (isAdmin && onOpenVideoManager) {
                  onOpenVideoManager();
                } else {
                  alert('Video đang được cập nhật.');
                }
              }}
              className="relative z-10 w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center text-primary shadow-lg transition-transform active:scale-95"
              aria-label={`Phát video: ${currentVideo.title}`}
            >
              <Play size={34} fill="currentColor" className="ml-1 text-primary" />
            </button>

            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 text-white text-[15px] font-semibold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              <span className="truncate pr-2">{currentVideo.title}</span>
              <span className="shrink-0 text-white/80 font-normal">
                {currentVideo.duration_text || 'Chưa có video'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Thông báo khi đã xem hết danh sách */}
      {isEndedPlaylist && (
        <div className="p-3.5 rounded-[16px] bg-primary-soft border border-primary/30 text-ink flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-[15px] font-bold text-primary-dark">
              Đã xem hết danh sách
            </span>
          </div>

          {nextPage && topicSlug ? (
            <Link
              href={`/${topicSlug}/${nextPage.slug}`}
              className="flex items-center gap-1 text-[14px] font-extrabold text-primary hover:underline"
            >
              <span>
                Tiếp theo: {String(nextPage.orderNumber).padStart(2, '0')} {nextPage.title}
              </span>
              <ArrowRight size={15} strokeWidth={2.5} />
            </Link>
          ) : (
            <span className="text-[14px] font-semibold text-muted">
              Đã hoàn thành nội dung bài học
            </span>
          )}
        </div>
      )}

      {/* 1. THANH TIẾN ĐỘ HỌC TẬP (MOCKUP 1) */}
      <div className="flex flex-col gap-1.5 px-0.5 mt-2.5 mb-1">
        <div className="flex items-center justify-between text-[13px] font-bold text-ink">
          <span className="flex items-center gap-1.5 text-muted">
            <span>Tiến độ bài học:</span>
            <strong className="text-primary font-black">
              {Math.min(100, Math.round(((videos.filter((_, idx) => watchedList.includes(idx + 1)).length) / (videos.length || 1)) * 100))}%
            </strong>
            <span>
              ({videos.filter((_, idx) => watchedList.includes(idx + 1)).length}/{videos.length} video)
            </span>
          </span>
          {videos.filter((_, idx) => watchedList.includes(idx + 1)).length === videos.length && videos.length > 0 && (
            <span className="text-emerald-700 text-[10.5px] font-black bg-emerald-100 px-2 py-0.5 rounded-full">
              ĐÃ HOÀN THÀNH
            </span>
          )}
        </div>
        <div className="w-full h-2 rounded-full bg-line overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500"
            style={{
              width: `${Math.max(
                Math.min(100, Math.round(((videos.filter((_, idx) => watchedList.includes(idx + 1)).length) / (videos.length || 1)) * 100)),
                4
              )}%`,
            }}
          />
        </div>
      </div>

      {/* 2. HỆ THỐNG 3 KHUNG TAB PHÂN TÁCH VỚI ĐƯỜNG KẺ NGĂN CÁCH (THEO GÓP Ý CỦA ANH) */}
      <div className="grid grid-cols-3 items-stretch rounded-[14px] bg-white border border-line mt-3 mb-2 shadow-2xs divide-x divide-line overflow-hidden">
        <button
          type="button"
          onClick={() => handleTabChange('syllabus')}
          className={`flex items-center justify-center py-2.5 px-1.5 text-[13px] sm:text-[14px] font-extrabold transition-all cursor-pointer text-center leading-tight min-h-[44px] ${
            currentTab === 'syllabus'
              ? 'bg-primary text-white font-black shadow-xs'
              : 'text-muted bg-white hover:text-ink hover:bg-surface-2'
          }`}
        >
          <span>Giáo trình ({videos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('summary')}
          className={`flex items-center justify-center py-2.5 px-1.5 text-[13px] sm:text-[14px] font-extrabold transition-all cursor-pointer text-center leading-tight min-h-[44px] ${
            currentTab === 'summary'
              ? 'bg-primary text-white font-black shadow-xs'
              : 'text-muted bg-white hover:text-ink hover:bg-surface-2'
          }`}
        >
          <span>Tóm tắt cốt lõi</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('resources')}
          className={`flex items-center justify-center py-2.5 px-1.5 text-[13px] sm:text-[14px] font-extrabold transition-all cursor-pointer text-center leading-tight min-h-[44px] ${
            currentTab === 'resources'
              ? 'bg-primary text-white font-black shadow-xs'
              : 'text-muted bg-white hover:text-ink hover:bg-surface-2'
          }`}
        >
          <span>Tài liệu</span>
        </button>
      </div>

      {/* 3. NỘI DUNG THEO TAB */}
      {currentTab === 'syllabus' && (
        <div className="flex flex-col gap-2.5 mt-2 animate-in fade-in duration-150">
          {videos.map((vid, idx) => {
            const isActive = idx === safeIndex;
            const isWatched = watchedList.includes(idx + 1);
            const thumbUrl =
              vid.thumbnail_url ||
              (vid.youtube_id ? `https://i.ytimg.com/vi/${vid.youtube_id}/hqdefault.jpg` : null);

            return (
              <div
                key={idx}
                onClick={() => handleSelectVideo(idx)}
                className={`w-full flex items-center gap-3 p-2.5 sm:p-3 rounded-[16px] text-left transition-all cursor-pointer group active:scale-[0.99] ${
                  isActive
                    ? 'bg-primary-soft/90 border-[1.5px] border-primary shadow-xs ring-1 ring-primary/20'
                    : 'bg-white border border-line hover:border-line-strong hover:shadow-2xs'
                }`}
                role="button"
                tabIndex={0}
              >
                {/* 1. KHUNG ẢNH THUMBNAIL VIDEO (16:9) */}
                <div className="relative w-[114px] sm:w-[126px] aspect-video rounded-[10px] overflow-hidden bg-ink shrink-0 border border-black/10 shadow-2xs">
                  {thumbUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbUrl}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-3 text-muted">
                      <Play size={20} className="text-muted/60" />
                    </div>
                  )}

                  {/* Lớp phủ & Nút Play khi Active hoặc Hover */}
                  {isActive ? (
                    <div className="absolute inset-0 bg-primary/40 flex items-center justify-center backdrop-blur-[0.5px]">
                      <div className="w-7 h-7 rounded-full bg-white text-primary flex items-center justify-center shadow-md ring-2 ring-white/80">
                        <Play size={13} fill="currentColor" className="ml-0.5 text-primary" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <div className="w-6 h-6 rounded-full bg-white/90 text-primary flex items-center justify-center shadow-xs">
                        <Play size={11} fill="currentColor" className="ml-0.5 text-primary" />
                      </div>
                    </div>
                  )}

                  {/* Thời lượng video ở góc dưới bên phải thumbnail */}
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-[4px] bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold tracking-tight">
                    {vid.duration_text || '05:00'}
                  </div>

                  {/* Huy hiệu Đã xem góc trên bên trái */}
                  {isWatched && (
                    <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs" title="Đã học">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* 2. NỘI DUNG CHI TIẾT: SỐ THỨ TỰ, TIÊU ĐỀ, TRẠNG THÁI */}
                <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center py-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-muted">
                      VIDEO {String(idx + 1).padStart(2, '0')}
                    </span>
                    {isActive ? (
                      <span className="text-[9.5px] font-black uppercase tracking-wider text-primary bg-primary-soft border border-primary/25 px-1.5 py-0.2 rounded-sm">
                        ● ĐANG PHÁT
                      </span>
                    ) : isWatched ? (
                      <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-sm">
                        ĐÃ XEM
                      </span>
                    ) : null}
                  </div>

                  <h4
                    className={`text-[13.5px] sm:text-[14.5px] font-bold leading-snug line-clamp-2 transition-colors ${
                      isActive ? 'text-primary' : 'text-ink group-hover:text-primary'
                    }`}
                    title={vid.title}
                  >
                    {vid.title}
                  </h4>

                  {vid.description && (
                    <p className="text-[11.5px] text-muted line-clamp-1 font-normal">
                      {vid.description}
                    </p>
                  )}
                </div>

                {/* 3. NÚT ADMIN SỬA VIDEO (NẾU CÓ) */}
                {isAdmin && onOpenVideoManager && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenVideoManager();
                    }}
                    className="text-muted hover:text-primary p-2 rounded-lg hover:bg-surface-2 cursor-pointer shrink-0 self-center"
                    aria-label="Sửa video"
                    title="Sửa video"
                  >
                    <MoreVertical size={16} />
                  </button>
                )}
              </div>
            );
          })}

          {/* Nút Quản lý danh sách video (Hiện khi ở chế độ Admin) */}
          {isAdmin && onOpenVideoManager && (
            <button
              type="button"
              onClick={onOpenVideoManager}
              className="flex items-center justify-center gap-2 h-[48px] w-full rounded-[14px] bg-primary text-white font-extrabold text-[15px] transition-transform active:scale-[0.98] mt-1 shadow-xs cursor-pointer"
            >
              <span>Quản lý danh sách video ({videos.length})</span>
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}

      {currentTab === 'summary' && (
        <div className="flex flex-col gap-3 py-1 animate-in fade-in duration-150">
          {summaryContent || (
            <p className="text-muted text-[14px] p-4 text-center">Chưa có tóm tắt bổ sung cho bài học này.</p>
          )}
        </div>
      )}

      {currentTab === 'resources' && (
        <div className="flex flex-col gap-3 py-1 animate-in fade-in duration-150">
          {resourcesContent}
          {/* Nút Hỏi trợ lý AI */}
          <Link
            href={`/tro-ly-ai?q=Giải thích chi tiết hơn về bài học: ${encodeURIComponent(pageTitle || '')}`}
            className="flex items-center justify-between p-3.5 rounded-[16px] bg-gradient-to-r from-primary-soft to-surface-2 border border-primary/25 text-ink hover:border-primary transition-all shadow-2xs group mt-1"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-extrabold text-primary">
                  Hỏi Trợ lý sức khỏe về bài này
                </span>
                <span className="text-[12px] text-muted font-normal">
                  Giải đáp thắc mắc chuyên sâu 24/7
                </span>
              </div>
            </div>
            <ArrowRight size={18} className="text-primary group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
