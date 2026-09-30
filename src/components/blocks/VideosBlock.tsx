'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, Check, BarChart2, MoreVertical, ArrowRight } from 'lucide-react';
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
  nextPage?: { slug: string; title: string; orderNumber: number } | null;
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
  nextPage,
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
          <div
            id={`yt-player-${blockId || 'default'}`}
            className="w-full h-full border-0"
          />
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
              <Play size={34} fill="#0E6B5A" className="ml-1 text-primary" />
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
        <div className="p-3.5 rounded-[16px] bg-[#E6F2EF] border border-[#0E6B5A]/30 text-ink flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0E6B5A]" />
            <span className="text-[15px] font-bold text-[#0A4F43]">
              Đã xem hết danh sách
            </span>
          </div>

          {nextPage && topicSlug ? (
            <Link
              href={`/${topicSlug}/${nextPage.slug}`}
              className="flex items-center gap-1 text-[14px] font-extrabold text-[#0E6B5A] hover:underline"
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

      {/* Dòng phụ dưới trình phát nếu là playlist */}
      {isPlaylist && !isEndedPlaylist && (
        <p className="text-[15px] font-semibold text-muted leading-tight px-1">
          Đang phát {safeIndex + 1}/{videos.length} · Xem hết tự chuyển video tiếp
        </p>
      )}

      {/* Danh sách video nếu là playlist */}
      {isPlaylist && (
        <div className="flex flex-col gap-2.5 mt-1">
          <div className="text-[15px] sm:text-[16px] font-extrabold tracking-[0.5px] text-ink uppercase px-1">
            DANH SÁCH VIDEO ({videos.length})
          </div>

          <div className="flex flex-col gap-2">
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
                  className={`w-full flex flex-col gap-2 p-3 sm:p-3.5 rounded-[18px] text-left transition-all min-h-[48px] cursor-pointer ${
                    isActive
                      ? 'bg-primary-soft border-2 border-primary shadow-xs'
                      : 'bg-white border-[1.5px] border-line hover:border-line-strong'
                  }`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleSelectVideo(idx);
                    }
                  }}
                  aria-pressed={isActive}
                >
                  {/* HÀNG TRÊN CÙNG: TIÊU ĐỀ VIDEO ĐẦY ĐỦ, TẬN DỤNG 100% CHIỀU RỘNG KHÔNG BỊ CHIẾM DIỆN TÍCH */}
                  <div className="flex items-start justify-between gap-2 w-full">
                    <h4 className="text-[15px] sm:text-[16px] font-extrabold text-ink leading-snug break-words flex-1 flex items-center gap-1.5">
                      {isActive && (
                        <span className="inline-flex items-center text-primary shrink-0" title="Đang phát">
                          <BarChart2 size={14} className="animate-pulse" />
                        </span>
                      )}
                      <span>{vid.title}</span>
                    </h4>

                    {isAdmin && onOpenVideoManager && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenVideoManager();
                        }}
                        className="text-primary p-1 rounded-md hover:bg-primary-soft cursor-pointer shrink-0"
                        aria-label="Sửa video"
                        title="Sửa video"
                      >
                        <MoreVertical size={16} />
                      </button>
                    )}
                  </div>

                  {/* HÀNG DƯỚI: THUMBNAIL + MÔ TẢ & THỜI LƯỢNG */}
                  <div className="flex items-center gap-3 w-full">
                    {/* Thumbnail video tỷ lệ chuẩn, sắc nét */}
                    <div className="relative w-[96px] h-[58px] rounded-[10px] bg-[#1C2735] shrink-0 overflow-hidden flex items-center justify-center">
                      {thumbUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbUrl}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="absolute inset-0 flex items-center justify-center opacity-40">
                            <SpineIllustration className="w-10 h-10" />
                          </div>
                          <div className="relative z-10 w-6 h-6 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-xs">
                            <Play size={12} fill="#0E6B5A" className="ml-0.5 text-primary" />
                          </div>
                        </>
                      )}

                      {/* Huy hiệu Đang phát hoặc Đã xem gọn gàng trên thumbnail */}
                      {isActive ? (
                        <span className="absolute top-1 left-1 bg-primary text-white text-[9.5px] font-black px-1.5 py-0.5 rounded-[4px] flex items-center gap-1 shadow-xs leading-none">
                          <BarChart2 size={9} className="animate-pulse shrink-0" />
                          <span>Đang phát</span>
                        </span>
                      ) : isWatched ? (
                        <span className="absolute top-1 left-1 bg-emerald-700/90 text-white text-[9.5px] font-bold px-1.5 py-0.5 rounded-[4px] flex items-center gap-0.5 shadow-xs leading-none">
                          <Check size={9} strokeWidth={3} />
                          <span>Đã xem</span>
                        </span>
                      ) : null}

                      {vid.duration_text && (
                        <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-xs leading-none">
                          {vid.duration_text}
                        </span>
                      )}
                    </div>

                    {/* Mô tả hoặc tóm tắt video */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                      {vid.description ? (
                        <p className="text-[13px] text-muted font-normal leading-snug line-clamp-2">
                          {vid.description}
                        </p>
                      ) : (
                        <p className="text-[13px] text-muted/70 italic font-normal leading-snug">
                          Video bài giảng thực hành
                        </p>
                      )}
                      <div className="flex items-center gap-1.5 text-[12px] text-muted font-medium mt-0.5">
                        <span>Thời lượng: {vid.duration_text || '5 phút'}</span>
                        {isActive && (
                          <span className="text-primary font-extrabold flex items-center gap-1">
                            · Đang phát
                          </span>
                        )}
                        {isWatched && !isActive && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            · Đã xem
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nút Quản lý danh sách video (Hiện khi ở chế độ Admin) */}
          {isAdmin && onOpenVideoManager && (
            <button
              type="button"
              onClick={onOpenVideoManager}
              className="flex items-center justify-center gap-2 h-[52px] min-h-[48px] w-full rounded-[16px] bg-primary text-white font-extrabold text-[16px] transition-transform active:scale-[0.98] mt-1 shadow-xs cursor-pointer"
            >
              <span>Quản lý danh sách video ({videos.length})</span>
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
