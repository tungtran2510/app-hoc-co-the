'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Play, Check, BarChart2, MoreVertical, ArrowRight, Sparkles, Gauge, Edit2, Plus } from 'lucide-react';
import { Video } from '../../lib/types';
import SpineIllustration from '../SpineIllustration';
import EditSingleVideoModal from '../admin/EditSingleVideoModal';
import {
  saveStoredXemTiep,
  saveVideoWatched,
  getStoredTienDo,
  updateScrollPosition,
  getStoredXemTiep,
} from '../../lib/learningProgress';
import { playTapSound } from '../../lib/audioFeedback';
import LongPressSave from '../LongPressSave';

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
  onSaveVideos?: (newVideos: Video[]) => void;
  pageId?: string;
  topicSlug?: string;
  topicTitle?: string;
  pageSlug?: string;
  pageTitle?: string;
  pageNumber?: number;
  pageCoverUrl?: string | null;
  nextPage?: { slug: string; title: string; orderNumber: number } | null;
  summaryContent?: React.ReactNode;
  progressAction?: React.ReactNode;
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
  onSaveVideos,
  pageId = '',
  topicSlug = '',
  topicTitle = '',
  pageSlug = '',
  pageTitle = '',
  pageNumber = 1,
  pageCoverUrl,
  nextPage,
  summaryContent,
  progressAction,
  resourcesContent,
  activeTab,
  onTabChange,
}: VideosBlockProps) {
  const [videoList, setVideoList] = useState<Video[]>(videos);
  useEffect(() => {
    setVideoList(videos);
  }, [videos]);

  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);
  const [isAddingVideo, setIsAddingVideo] = useState(false);

  const handleSaveSingleVideo = (updated: Video, index: number) => {
    let nextList: Video[];
    if (index < 0 || index >= videoList.length) {
      nextList = [...videoList, updated];
    } else {
      nextList = [...videoList];
      nextList[index] = updated;
    }
    setVideoList(nextList);
    if (onSaveVideos) {
      onSaveVideos(nextList);
    }
  };

  const handleDeleteSingleVideo = (index: number) => {
    const nextList = videoList.filter((_, i) => i !== index);
    setVideoList(nextList);
    if (activeIndex >= nextList.length) {
      setActiveIndex(Math.max(0, nextList.length - 1));
    }
    if (onSaveVideos) {
      onSaveVideos(nextList);
    }
  };

  const handleMoveSingleVideo = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= videoList.length) return;
    const nextList = [...videoList];
    const temp = nextList[index];
    nextList[index] = nextList[targetIndex];
    nextList[targetIndex] = temp;
    setVideoList(nextList);
    if (onSaveVideos) {
      onSaveVideos(nextList);
    }
  };

  const searchParams = useSearchParams();
  const vParam = searchParams.get('v');

  // Xác định video bắt đầu: ưu tiên param ?v=n
  const initialIndex = (() => {
    if (vParam) {
      const parsed = parseInt(vParam, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= videoList.length) {
        return parsed - 1;
      }
    }
    return defaultActiveIndex < videoList.length ? defaultActiveIndex : 0;
  })();

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEndedPlaylist, setIsEndedPlaylist] = useState(false);
  const [watchedList, setWatchedList] = useState<number[]>([]);
  const [localTab, setLocalTab] = useState<'syllabus' | 'summary' | 'resources'>('syllabus');

  // Tỷ lệ khung hình đã tự động nhận diện: 'vertical' (9:16) hoặc 'horizontal' (16:9)
  const [aspectMap, setAspectMap] = useState<Record<string, 'vertical' | 'horizontal'>>({});
  // Cho phép người dùng chuyển đổi chế độ hiển thị thủ công ('auto' | 'vertical' | 'horizontal')
  const [manualOverrideAspect, setManualOverrideAspect] = useState<'auto' | 'vertical' | 'horizontal'>('auto');

  const currentTab = activeTab || localTab;
  const handleTabChange = (tab: 'syllabus' | 'summary' | 'resources') => {
    playTapSound();
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setLocalTab(tab);
    }
  };

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<any>(null);

  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const playbackRateRef = useRef<number>(1);

  const handleSetSpeed = (speed: number) => {
    playTapSound();
    setPlaybackRate(speed);
    playbackRateRef.current = speed;
    try {
      if (playerRef.current && typeof playerRef.current.setPlaybackRate === 'function') {
        playerRef.current.setPlaybackRate(speed);
      }
    } catch {
      // Bỏ qua
    }
  };

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

  // Tự động nhận diện video dạng dọc (Shorts/Reels 9:16) hay dạng ngang (16:9)
  useEffect(() => {
    const curVid = videoList[activeIndex < videoList.length ? activeIndex : 0];
    if (!curVid) return;
    const yid = curVid.youtube_id;
    if (!yid) return;

    // 1. Kiểm tra thuộc tính có sẵn
    if (
      curVid.is_vertical ||
      curVid.aspect_ratio === 'vertical' ||
      curVid.aspect_ratio === '9:16'
    ) {
      setAspectMap((prev) => (prev[yid] === 'vertical' ? prev : { ...prev, [yid]: 'vertical' }));
      return;
    }

    if (aspectMap[yid]) return;

    // 2. Tự động nhận diện qua API endpoint
    let isCancelled = false;
    fetch(`/api/video/detect-aspect?id=${encodeURIComponent(yid)}`)
      .then((res) => res.json())
      .then((data) => {
        if (isCancelled) return;
        if (data?.is_vertical) {
          setAspectMap((prev) => ({ ...prev, [yid]: 'vertical' }));
        } else {
          setAspectMap((prev) => ({ ...prev, [yid]: 'horizontal' }));
        }
      })
      .catch(() => {
        if (isCancelled) return;
        const thumb = curVid.thumbnail_url || `https://i.ytimg.com/vi/${yid}/hqdefault.jpg`;
        const img = new Image();
        img.src = thumb;
        img.onload = () => {
          if (isCancelled) return;
          if (img.naturalHeight > img.naturalWidth) {
            setAspectMap((prev) => ({ ...prev, [yid]: 'vertical' }));
          } else {
            setAspectMap((prev) => ({ ...prev, [yid]: 'horizontal' }));
          }
        };
      });

    return () => {
      isCancelled = true;
    };
  }, [activeIndex, videoList]);

  // Cuộn tới khối video nếu có param ?v= hoặc khôi phục scroll_y, đồng thời kích hoạt Auto-play
  useEffect(() => {
    if (vParam) {
      setIsPlaying(true);
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
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

  if (!videoList || videoList.length === 0) {
    return null;
  }

  const safeIndex = activeIndex < videoList.length ? activeIndex : 0;
  const currentVideo = videoList[safeIndex];
  const isPlaylist = displayStyle === 'playlist' && videoList.length > 1;

  // Cập nhật xem_tiep vào localStorage khi chọn video hoặc bắt đầu phát
  const recordXemTiep = (vidIndex: number) => {
    if (!topicSlug || !pageSlug) return;
    const vid = videoList[vidIndex] || videoList[0];
    saveStoredXemTiep({
      topic_slug: topicSlug,
      topic_title: topicTitle,
      page_slug: pageSlug,
      page_title: pageTitle,
      page_number: pageNumber,
      video_index: vidIndex + 1,
      video_total: videoList.length,
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

  // Khởi tạo YouTube IFrame Player API - CHỈ KHI NGƯỜI DÙNG BẤM PHÁT (Facade Pattern siêu mượt)
  useEffect(() => {
    if (!isPlaying || !currentVideo.youtube_id) return;

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
          autoplay: 1,
          rel: 0,
          playsinline: 1,
          modestbranding: 1,
        },
        events: {
          onReady: (event: any) => {
            try {
              if (playbackRateRef.current && typeof event.target.setPlaybackRate === 'function') {
                event.target.setPlaybackRate(playbackRateRef.current);
              }
              event.target.playVideo();
            } catch {
              // Bỏ qua
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
              if (safeIndex + 1 < videoList.length) {
                const nextIdx = safeIndex + 1;
                setActiveIndex(nextIdx);
                setIsPlaying(true);
                recordXemTiep(nextIdx);
                const nextVideo = videoList[nextIdx];
                if (nextVideo?.youtube_id && playerRef.current?.loadVideoById) {
                  playerRef.current.loadVideoById(nextVideo.youtube_id);
                  if (typeof playerRef.current.setPlaybackRate === 'function') {
                    playerRef.current.setPlaybackRate(playbackRateRef.current);
                  }
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
  }, [isPlaying, currentVideo.youtube_id, safeIndex]);

  // Đổi video khi bấm vào dòng trong danh sách + tự động Auto-play
  const handleSelectVideo = (idx: number) => {
    playTapSound();
    setActiveIndex(idx);
    setIsPlaying(true);
    setManualOverrideAspect('auto');
    setIsEndedPlaylist(false);
    recordXemTiep(idx);

    const targetVid = videoList[idx];
    if (targetVid?.youtube_id && playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(targetVid.youtube_id);
      if (typeof playerRef.current.setPlaybackRate === 'function') {
        playerRef.current.setPlaybackRate(playbackRateRef.current);
      }
    }
  };

  const isDetectedVertical =
    currentVideo?.is_vertical === true ||
    currentVideo?.aspect_ratio === 'vertical' ||
    currentVideo?.aspect_ratio === '9:16' ||
    (currentVideo?.youtube_id ? aspectMap[currentVideo.youtube_id] === 'vertical' : false);

  const isVertical =
    manualOverrideAspect === 'vertical'
      ? true
      : manualOverrideAspect === 'horizontal'
      ? false
      : isDetectedVertical;

  return (
    <div
      ref={containerRef}
      id={blockId}
      className="w-full flex flex-col gap-2 sm:gap-2.5 scroll-mt-20"
    >
      {/* KHUNG TRÌNH PHÁT VIDEO ĐẲNG CẤP (TỰ ĐỘNG THÍCH ỨNG DẠNG DỌC 9:16 HOẶC DẠNG NGANG 16:9 + TỰ ĐỘNG PHÁT) */}
      <div
        className={`relative w-full p-0 overflow-hidden rounded-[18px] sm:rounded-[22px] bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border-[2px] border-slate-700/80 shadow-[0_12px_28px_rgba(15,23,42,0.22)] dark:border-purple-800/50 transition-all duration-300 ${
          isVertical ? 'max-w-[340px] sm:max-w-[360px] mx-auto' : 'max-w-full'
        }`}
      >
        {/* Khung màn hình hiển thị: Tự động co giãn theo dạng dọc (9:16) hoặc dạng ngang (16:9) */}
        <div
          className={`relative w-full rounded-none bg-black overflow-hidden flex items-center justify-center transition-all duration-300 ${
            isVertical ? 'aspect-[9/16] max-h-[68vh]' : 'aspect-video'
          }`}
        >
          {currentVideo.youtube_id ? (
            <>
              {isPlaying ? (
                <iframe
                  key={currentVideo.youtube_id}
                  id={`yt-player-${blockId || 'default'}`}
                  src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtube_id}?autoplay=1&rel=0&playsinline=1&modestbranding=1&enablejsapi=1`}
                  title={currentVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                /* Lớp phủ ảnh bên ngoài khi video chưa bắt đầu phát - 0 iframe, siêu nhẹ */
                <div
                  onClick={() => {
                    setIsPlaying(true);
                  }}
                  className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 cursor-pointer group"
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
                      loading="eager"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

                  <div className="relative z-10 w-[64px] h-[64px] sm:w-[70px] sm:h-[70px] rounded-full bg-white/95 flex items-center justify-center text-[#1E3A8A] shadow-2xl transition-transform group-hover:scale-105 active:scale-95 ring-4 ring-blue-400/40">
                    <Play size={28} fill="currentColor" className="ml-1 text-[#1E3A8A]" />
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10 text-white text-[12.5px] sm:text-[13.5px] font-semibold bg-black/75 px-3 py-1.5 rounded-[10px] border border-white/15">
                    <span className="truncate pr-2">{currentVideo.title}</span>
                    <span className="shrink-0 text-white/80 text-[11px] sm:text-[12px] font-mono">
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
                className="relative z-10 w-[72px] h-[72px] rounded-full bg-white flex items-center justify-center text-[#1E3A8A] shadow-lg transition-transform active:scale-95 ring-4 ring-blue-400/40"
                aria-label={`Phát video: ${currentVideo.title}`}
              >
                <Play size={32} fill="currentColor" className="ml-1 text-[#1E3A8A]" />
              </button>

              <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between z-10 text-white text-[14px] font-semibold bg-black/60 px-3 py-1.5 rounded-lg backdrop-blur-xs border border-white/15">
                <span className="truncate pr-2">{currentVideo.title}</span>
                <span className="shrink-0 text-white/80 font-normal">
                  {currentVideo.duration_text || 'Chưa có video'}
                </span>
              </div>
            </div>
          )}
        </div>
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

      {/* 1. THANH TÙY CHỈNH TỐC ĐỘ PHÁT VIDEO CHUYÊN NGHIỆP (ĐẶT Ở TRÊN, SÁT DƯỚI KHUNG VIDEO THEO YÊU CẦU) */}
      <div className="flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-[11px] bg-slate-50 dark:bg-[#160D30]/80 border border-slate-200/80 dark:border-purple-900/40 text-[11px] font-bold">
        <button
          type="button"
          onClick={() => {
            playTapSound();
            setManualOverrideAspect((prev) => {
              if (prev === 'vertical') return 'horizontal';
              if (prev === 'horizontal') return 'vertical';
              return isDetectedVertical ? 'horizontal' : 'vertical';
            });
          }}
          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-900 dark:bg-purple-950/60 dark:border-purple-800/50 dark:text-blue-200 cursor-pointer whitespace-nowrap shrink-0"
          title="Bấm để chuyển đổi giữa khung dọc và khung ngang"
        >
          <span>{isVertical ? '↕ Dạng dọc' : '↔ Dạng ngang'}</span>
        </button>
        <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
          <Gauge size={13} className="text-blue-700 dark:text-[#93C5FD] shrink-0" />
          {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
            <button
              key={spd}
              type="button"
              onClick={() => handleSetSpeed(spd)}
              className={`px-2 py-0.5 rounded-[6px] text-[10.5px] font-extrabold transition-all cursor-pointer ${
                playbackRate === spd
                  ? 'bg-[#1E3A8A] text-white dark:bg-[#93C5FD] dark:text-[#160C2C] shadow-2xs font-black'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 dark:bg-purple-950/60 dark:text-purple-200 dark:border-purple-800/40'
              }`}
              title={`Phát video ở tốc độ ${spd}x`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* 2. THANH TIẾN ĐỘ HỌC TẬP (GỌN GÀNG, SÁT DƯỚI TỐC ĐỘ PHÁT, BỎ KHOẢNG HỞ THỪA) */}
      <div className="flex flex-col gap-1 px-0.5">
        <div className="flex items-center justify-between text-[12.5px] font-bold text-ink">
          <span className="flex items-center gap-1.5 text-muted">
            <span>Tiến độ:</span>
            <strong className="text-blue-700 dark:text-[#93C5FD] font-black">
              {Math.min(100, Math.round(((videoList.filter((_, idx) => watchedList.includes(idx + 1)).length) / (videoList.length || 1)) * 100))}%
            </strong>
            <span>
              ({videoList.filter((_, idx) => watchedList.includes(idx + 1)).length}/{videoList.length} video)
            </span>
          </span>
          {progressAction ? (
            <div className="shrink-0">{progressAction}</div>
          ) : null}
          {!progressAction && videoList.filter((_, idx) => watchedList.includes(idx + 1)).length === videoList.length && videoList.length > 0 && (
            <span className="text-emerald-700 dark:text-emerald-300 text-[10.5px] font-black bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 px-2 py-0.5 rounded-full">
              ĐÃ HOÀN THÀNH
            </span>
          )}
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-purple-950/80 border border-slate-300/60 dark:border-purple-900/30 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-blue-600 dark:bg-gradient-to-r dark:from-purple-500 dark:to-[#93C5FD] transition-all duration-500"
            style={{
              width: `${Math.max(
                Math.min(100, Math.round(((videoList.filter((_, idx) => watchedList.includes(idx + 1)).length) / (videoList.length || 1)) * 100)),
                4
              )}%`,
            }}
          />
        </div>
      </div>

      {/* 3. HỆ THỐNG 3 KHUNG TAB PHÂN TÁCH VỚI ĐƯỜNG KẺ NGĂN CÁCH (SẮP XẾP SÁT HỢP LÝ) */}
      <div className="grid grid-cols-3 items-stretch rounded-[14px] bg-slate-100 dark:bg-[#160D30] border border-slate-200 dark:border-purple-900/50 shadow-2xs divide-x divide-slate-200 dark:divide-purple-900/50 overflow-hidden mt-0.5">
        <LongPressSave
          className="contents"
          item={{
            page_id: `playlist:${pageId}`,
            kind: 'playlist',
            topic_slug: topicSlug,
            topic_title: topicTitle,
            page_slug: pageSlug,
            page_title: pageTitle,
            page_number: pageNumber,
            href: `/${topicSlug}/${pageSlug}`,
            thumb: pageCoverUrl || null,
            subtitle: `${videoList.length} video`,
          }}
        >
        <button
          type="button"
          onClick={() => handleTabChange('syllabus')}
          className={`flex items-center justify-center py-2 px-1 text-[13px] sm:text-[14px] font-extrabold transition-all cursor-pointer text-center leading-tight min-h-[42px] ${
            currentTab === 'syllabus'
              ? 'bg-[#1E3A8A] text-white font-black shadow-xs'
              : 'text-slate-700 dark:text-purple-300/80 bg-white/80 dark:bg-[#160D30] hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-purple-950/40'
          }`}
        >
          <span>Giáo trình ({videoList.length})</span>
        </button>
        </LongPressSave>

        <button
          type="button"
          onClick={() => handleTabChange('summary')}
          className={`flex items-center justify-center py-2 px-1 text-[13px] sm:text-[14px] font-extrabold transition-all cursor-pointer text-center leading-tight min-h-[42px] ${
            currentTab === 'summary'
              ? 'bg-[#1E3A8A] text-white font-black shadow-xs'
              : 'text-slate-700 dark:text-purple-300/80 bg-white/80 dark:bg-[#160D30] hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-purple-950/40'
          }`}
        >
          <span>Tóm tắt cốt lõi</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('resources')}
          className={`flex items-center justify-center py-2 px-1 text-[13px] sm:text-[14px] font-extrabold transition-all cursor-pointer text-center leading-tight min-h-[42px] ${
            currentTab === 'resources'
              ? 'bg-[#1E3A8A] text-white font-black shadow-xs'
              : 'text-slate-700 dark:text-purple-300/80 bg-white/80 dark:bg-[#160D30] hover:text-slate-950 dark:hover:text-white hover:bg-white dark:hover:bg-purple-950/40'
          }`}
        >
          <span>Tài liệu</span>
        </button>
      </div>

      {/* 3. NỘI DUNG THEO TAB (GỌN GÀNG, TIÊU ĐỀ RỘNG RÃI, KHÔNG THƯA) */}
      {/* 3. NỘI DUNG THEO TAB (CHUYỂN TAB TỨC THÌ 0MS, GIỮ NGUYÊN DOM KHÔNG BỊ GIẬT LAG) */}
      <div className={currentTab === 'syllabus' ? 'flex flex-col gap-1.5 mt-1.5 animate-in fade-in duration-100' : 'hidden'}>
        {videoList.map((vid, idx) => {
          const isActive = idx === safeIndex;
          const isWatched = watchedList.includes(idx + 1);
          const thumbUrl =
            vid.thumbnail_url ||
            (vid.youtube_id ? `https://i.ytimg.com/vi/${vid.youtube_id}/hqdefault.jpg` : null);

          return (
            <LongPressSave
              key={`lp-${idx}`}
              className="contents"
              item={{
                page_id: `video:${pageId}:${idx + 1}`,
                kind: 'video',
                topic_slug: topicSlug,
                topic_title: topicTitle,
                page_slug: pageSlug,
                page_title: vid.title,
                page_number: idx + 1,
                href: `/${topicSlug}/${pageSlug}?v=${idx + 1}`,
                thumb: thumbUrl,
                subtitle: pageTitle,
              }}
            >
            <div
              key={idx}
              onClick={() => handleSelectVideo(idx)}
              className={`w-full flex items-center gap-2.5 p-2 sm:p-2.5 rounded-[12px] text-left transition-all duration-150 cursor-pointer group active:scale-[0.99] ${
                isActive
                  ? 'bg-blue-50/60 dark:bg-gradient-to-br dark:from-[#24154B] dark:via-[#1B0F3B] dark:to-[#120829] border-[1.5px] border-blue-400 dark:border-blue-400/60 shadow-xs ring-1 ring-blue-400/20'
                  : 'bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-900/40 hover:border-slate-300 dark:hover:border-purple-600/50 shadow-2xs'
              }`}
              role="button"
              tabIndex={0}
            >
              {/* 1. KHUNG ẢNH THUMBNAIL THU GỌN: HUY HIỆU SỐ BÀI GÓC TRÊN-TRÁI + THỜI LƯỢNG GÓC DƯỚI-PHẢI */}
              <div className="relative w-[80px] sm:w-[92px] aspect-video rounded-[8px] overflow-hidden bg-slate-100 dark:bg-[#0A0515] shrink-0 border border-slate-200/90 dark:border-purple-500/20 shadow-2xs">
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-purple-950/40 text-slate-600 dark:text-purple-300">
                    <Play size={15} className="text-slate-600 dark:text-purple-400/60" />
                  </div>
                )}

                {/* Huy hiệu BÀI 01 / ĐANG PHÁT gắn trực tiếp lên góc trên-trái viền ảnh */}
                <div
                  className={`absolute top-0.5 left-0.5 px-1.5 py-0.2 rounded-[3.5px] text-[8.5px] sm:text-[9px] font-black tracking-wide uppercase shadow-xs backdrop-blur-xs flex items-center gap-0.5 ${
                    isActive
                      ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-slate-950'
                      : 'bg-black/75 text-white'
                  }`}
                >
                  {isActive ? '● ĐANG PHÁT' : `BÀI ${String(idx + 1).padStart(2, '0')}`}
                </div>

                {/* Thời lượng gắn góc dưới-phải viền ảnh (chuẩn YouTube/Coursera) */}
                <div className="absolute bottom-0.5 right-0.5 px-1 py-0.2 rounded-[3px] bg-black/80 text-white text-[8.5px] sm:text-[9px] font-bold font-mono tracking-tight shadow-xs">
                  {vid.duration_text || '05:00'}
                </div>

                {/* Lớp phủ & Nút Play khi Active hoặc Hover */}
                {isActive ? (
                  <div className="absolute inset-0 bg-blue-600/15 dark:bg-blue-600/25 flex items-center justify-center pointer-events-none">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white dark:bg-blue-400 dark:text-slate-950 flex items-center justify-center shadow-md ring-1.5 ring-white/80 dark:ring-blue-300/80">
                      <Play size={8.5} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                    <div className="w-4.5 h-4.5 rounded-full bg-white text-[#1E3A8A] flex items-center justify-center shadow-xs">
                      <Play size={8} fill="currentColor" className="ml-0.5 text-[#1E3A8A]" />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. TIÊU ĐỀ RỘNG RÃI TRẢI DÀI TRỌN VẸN CHIỀU NGANG */}
              <div className="flex flex-col gap-0.5 min-w-0 flex-1 justify-center">
                <h4
                  className={`text-[13px] sm:text-[14px] font-extrabold leading-snug line-clamp-2 transition-colors ${
                    isActive
                      ? 'text-slate-950 dark:text-blue-100 group-hover:text-blue-800'
                      : 'text-slate-900 dark:text-white group-hover:text-blue-700'
                  }`}
                  title={vid.title}
                >
                  {vid.title}
                </h4>

                {vid.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 font-normal">
                    {vid.description}
                  </p>
                )}

                {isWatched && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-700 dark:text-emerald-300 w-fit">
                    <Check size={9} strokeWidth={3} /> Đã học xong
                  </span>
                )}
              </div>

              {/* 3. NÚT SỬA CHO ADMIN (NẾU CÓ) */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    playTapSound();
                    setEditingVideoIndex(idx);
                  }}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-black tracking-wide uppercase transition-transform active:scale-95 shadow-2xs cursor-pointer"
                  title="Sửa trực tiếp video này: tiêu đề, link YouTube, thời lượng"
                  aria-label={`Sửa video ${vid.title}`}
                >
                  <Edit2 size={10} strokeWidth={3} />
                  <span className="hidden sm:inline">Sửa</span>
                </button>
              )}
            </div>
            </LongPressSave>
          );
        })}

        {/* NÚT THÊM VIDEO MỚI VÀ QUẢN LÝ DÀNH CHO ADMIN */}
        {isAdmin && (
          <div className="flex flex-col sm:flex-row gap-2 mt-1.5">
            <button
              type="button"
              onClick={() => {
                playTapSound();
                setIsAddingVideo(true);
                setEditingVideoIndex(null);
              }}
              className="flex-1 flex items-center justify-center gap-2 h-[44px] rounded-[13px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[13.5px] transition-transform active:scale-[0.98] shadow-xs cursor-pointer"
            >
              <Plus size={16} strokeWidth={3} />
              <span>+ Thêm video vào bài</span>
            </button>
            {onOpenVideoManager && (
              <button
                type="button"
                onClick={() => {
                  playTapSound();
                  onOpenVideoManager();
                }}
                className="flex items-center justify-center gap-1.5 h-[44px] px-3.5 rounded-[13px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[12.5px] transition-all cursor-pointer border border-slate-200 dark:border-slate-700"
              >
                <span>Sắp xếp / Toàn bộ ({videoList.length})</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className={currentTab === 'summary' ? 'flex flex-col gap-3 py-1 animate-in fade-in duration-100' : 'hidden'}>
        {summaryContent || (
          <p className="text-muted text-[14px] p-4 text-center">Chưa có tóm tắt bổ sung cho bài học này.</p>
        )}
      </div>

      <div className={currentTab === 'resources' ? 'flex flex-col gap-3 py-1 animate-in fade-in duration-100' : 'hidden'}>
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

      {/* MODAL SỬA TỪNG VIDEO TRỰC QUAN (ẤN VÀO ĐÂU SỬA ĐẤY) */}
      <EditSingleVideoModal
        isOpen={editingVideoIndex !== null || isAddingVideo}
        onClose={() => {
          setEditingVideoIndex(null);
          setIsAddingVideo(false);
        }}
        video={
          editingVideoIndex !== null && editingVideoIndex >= 0 && editingVideoIndex < videoList.length
            ? videoList[editingVideoIndex]
            : null
        }
        videoIndex={editingVideoIndex !== null ? editingVideoIndex : -1}
        totalVideos={videoList.length}
        onSave={(updated, idx) => {
          handleSaveSingleVideo(updated, idx);
        }}
        onDelete={(idx) => {
          handleDeleteSingleVideo(idx);
        }}
        onMoveUp={(idx) => {
          handleMoveSingleVideo(idx, 'up');
        }}
        onMoveDown={(idx) => {
          handleMoveSingleVideo(idx, 'down');
        }}
      />
    </div>
  );
}
