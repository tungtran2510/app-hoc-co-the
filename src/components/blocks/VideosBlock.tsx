'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Play,
  Pause,
  Check,
  BarChart2,
  MoreVertical,
  ArrowRight,
  Sparkles,
  Gauge,
  Edit2,
  Plus,
  ChevronDown,
  Sun,
  Headphones,
  Radio,
  Volume2,
  RotateCcw,
  RotateCw,
  ShieldCheck,
} from 'lucide-react';
import { Video } from '../../lib/types';
import SpineIllustration from '../SpineIllustration';
import EditSingleVideoModal from '../admin/EditSingleVideoModal';
import {
  saveStoredXemTiep,
  saveVideoWatched,
  getStoredTienDo,
  updateScrollPosition,
  getStoredXemTiep,
  notifyProgressChanged,
  saveReviewVideo,
  removeReviewVideo,
  getReviewVideos,
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

// Helper: parse **bold** text safely for takeaway descriptions
function renderFormattedTakeaway(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold text-slate-900 dark:text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
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
  const autoplayParam = searchParams.get('autoplay') || searchParams.get('play');
  const shouldAutoPlay = Boolean(vParam || autoplayParam === '1' || autoplayParam === 'true');

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
  const [isPlaying, setIsPlaying] = useState(shouldAutoPlay);
  const [isEndedPlaylist, setIsEndedPlaylist] = useState(false);
  const [watchedList, setWatchedList] = useState<string[]>([]);
  const [reviewIndices, setReviewIndices] = useState<number[]>([]);
  const [localTab, setLocalTab] = useState<'syllabus' | 'summary' | 'resources'>('syllabus');
  const [expandedTakeaways, setExpandedTakeaways] = useState<Record<number, boolean>>({});

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

  // Helper định dạng thời lượng (giây -> mm:ss)
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // GIẢI PHÁP 1: Screen Wake Lock API (Giữ màn hình luôn sáng khi xem/học)
  const [wakeLockEnabled, setWakeLockEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem('qbiz_wakelock_enabled') !== 'false';
    } catch {
      return true;
    }
  });
  const [isWakeLockActive, setIsWakeLockActive] = useState<boolean>(false);
  const wakeLockSentinelRef = useRef<any>(null);

  const requestWakeLock = async () => {
    if (typeof window === 'undefined' || !('wakeLock' in navigator)) return;
    try {
      if (!wakeLockSentinelRef.current || wakeLockSentinelRef.current.released) {
        wakeLockSentinelRef.current = await (navigator as any).wakeLock.request('screen');
        setIsWakeLockActive(true);
        wakeLockSentinelRef.current.addEventListener('release', () => {
          setIsWakeLockActive(false);
        });
      }
    } catch {
      // Bỏ qua nếu bị hệ thống hạn chế
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockSentinelRef.current && !wakeLockSentinelRef.current.released) {
      try {
        await wakeLockSentinelRef.current.release();
      } catch {}
    }
    wakeLockSentinelRef.current = null;
    setIsWakeLockActive(false);
  };

  const handleToggleWakeLock = async () => {
    playTapSound();
    const nextVal = !wakeLockEnabled;
    setWakeLockEnabled(nextVal);
    try {
      localStorage.setItem('qbiz_wakelock_enabled', nextVal ? 'true' : 'false');
    } catch {}
    if (!nextVal) {
      await releaseWakeLock();
    } else {
      if (isPlaying) {
        await requestWakeLock();
      }
    }
  };

  // TÍNH NĂNG TỰ ĐỘNG: Nghe khi tắt màn hình (Background Audio & MediaSession API)
  const [backgroundAudioEnabled, setBackgroundAudioEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      return localStorage.getItem('qbiz_background_audio_enabled') !== 'false';
    } catch {
      return true;
    }
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  const handleToggleBackgroundAudio = () => {
    playTapSound();
    const nextVal = !backgroundAudioEnabled;
    setBackgroundAudioEnabled(nextVal);
    try {
      localStorage.setItem('qbiz_background_audio_enabled', nextVal ? 'true' : 'false');
    } catch {}
    if (!nextVal && audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  };

  // Đồng bộ Screen Wake Lock khi video đang phát
  useEffect(() => {
    if (isPlaying && wakeLockEnabled) {
      requestWakeLock();
    } else if (!isPlaying) {
      releaseWakeLock();
    }
  }, [isPlaying, wakeLockEnabled]);

  // Tự động phát âm thanh nền khi màn hình tắt / khóa máy & đồng bộ Wake Lock
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        // TỰ ĐỘNG: Màn hình tắt hoặc khóa máy -> Phát âm thanh nền
        if (isPlaying && backgroundAudioEnabled && audioRef.current) {
          audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
        }
      } else if (document.visibilityState === 'visible') {
        // Màn hình sáng trở lại -> Dừng âm thanh nền
        if (audioRef.current && isAudioPlaying) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        }
        if (wakeLockEnabled && isPlaying) {
          requestWakeLock();
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      releaseWakeLock();
    };
  }, [wakeLockEnabled, isPlaying, isAudioPlaying, backgroundAudioEnabled]);

  // Đồng bộ tốc độ phát với thẻ Audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Đọc danh sách video đã xem và video cần ôn tập từ localStorage
  useEffect(() => {
    if (!pageId) return;
    const loadStatus = () => {
      try {
        const tienDo = getStoredTienDo();
        const pageProgress = tienDo[pageId];
        if (pageProgress?.watched && Array.isArray(pageProgress.watched)) {
          let hasLegacyNumbers = false;
          const normalizedWatched: string[] = [];

          pageProgress.watched.forEach((item) => {
            const strVal = String(item).trim();
            // Nếu là số thứ tự cũ (1, 2, 3...)
            if (/^\d+$/.test(strVal)) {
              const num = parseInt(strVal, 10);
              if (num >= 1 && num <= videoList.length) {
                const vid = videoList[num - 1];
                const key = vid.youtube_id || vid.id || strVal;
                normalizedWatched.push(key);
                hasLegacyNumbers = true;
                return;
              }
            }
            normalizedWatched.push(strVal);
          });

          const uniqueWatched = Array.from(new Set(normalizedWatched));
          setWatchedList(uniqueWatched);

          // Tự chuyển dữ liệu cũ khi đọc: nếu có số thứ tự cũ, lưu lại chuẩn youtube_id vào localStorage
          if (hasLegacyNumbers) {
            tienDo[pageId] = {
              ...pageProgress,
              watched: uniqueWatched,
            };
            localStorage.setItem('tien_do', JSON.stringify(tienDo));
          }
        } else {
          setWatchedList([]);
        }

        const revs = getReviewVideos();
        const pageRevs = revs.filter((r) => r.page_id === pageId).map((r) => r.video_index);
        setReviewIndices(pageRevs);
      } catch {
        // Bỏ qua
      }
    };

    loadStatus();
    window.addEventListener('learning_progress_changed', loadStatus);
    return () => {
      window.removeEventListener('learning_progress_changed', loadStatus);
    };
  }, [pageId, videoList]);

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

  // Cuộn tới khối video nếu có param ?v= hoặc autoplay, đồng thời kích hoạt Auto-play
  useEffect(() => {
    if (vParam || autoplayParam === '1' || autoplayParam === 'true') {
      setIsPlaying(true);
      if (vParam) {
        const parsed = parseInt(vParam, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= videoList.length) {
          setActiveIndex(parsed - 1);
        }
      }
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
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
      page_id: pageId,
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

  // Tự động đồng bộ bài học & video đang chọn vào xem_tiep ngay khi mở trang
  useEffect(() => {
    if (topicSlug && pageSlug && videoList && videoList.length > 0) {
      recordXemTiep(safeIndex);
    }
  }, [topicSlug, pageSlug, safeIndex, videoList?.length]);

  // Đánh dấu video đã xem
  const markWatched = (vidIndex: number) => {
    const vid = videoList[vidIndex];
    if (!vid) return;
    const videoKey = vid.youtube_id || vid.id || String(vidIndex + 1);
    if (pageId) {
      saveVideoWatched(pageId, videoKey, vidIndex + 1);
      setWatchedList((prev) => (prev.includes(videoKey) ? prev : [...prev, videoKey]));
    }
  };

  // Đánh dấu chuyển đổi Đã hiểu <-> Chưa hiểu cho từng video (Hỗ trợ nút gạt hoặc vuốt sang)
  const handleToggleVideoWatched = (vidIndex: number) => {
    playTapSound();
    const vid = videoList[vidIndex];
    if (!vid) return;
    const videoKey = vid.youtube_id || vid.id || String(vidIndex + 1);
    const videoNum = vidIndex + 1;
    const isCurrentlyWatched = watchedList.includes(videoKey);
    let nextWatched: string[];
    if (isCurrentlyWatched) {
      nextWatched = watchedList.filter((n) => n !== videoKey);
      // Chuyển sang Chưa hiểu -> Tự động thêm vào danh sách Cần ôn tập
      if (pageId && topicSlug && pageSlug) {
        const yid = vid?.youtube_id;
        const thumbUrl = vid?.thumbnail_url || (yid ? `https://i.ytimg.com/vi/${yid}/mqdefault.jpg` : pageCoverUrl || null);
        saveReviewVideo({
          id: `${pageId}_${videoKey}`,
          page_id: pageId,
          topic_slug: topicSlug,
          topic_title: topicTitle || '',
          page_slug: pageSlug,
          page_title: pageTitle || '',
          video_index: videoNum,
          video_title: vid?.title || `Video ${videoNum}`,
          cover_url: thumbUrl,
          takeaway: vid?.description,
          marked_at: Date.now(),
        });
        setReviewIndices((prev) => Array.from(new Set([...prev, videoNum])));
      }
    } else {
      nextWatched = Array.from(new Set([...watchedList, videoKey]));
      // Chuyển sang Đã hiểu -> Tự động gỡ khỏi danh sách Cần ôn tập
      if (pageId) {
        removeReviewVideo(pageId, videoNum);
        setReviewIndices((prev) => prev.filter((n) => n !== videoNum));
      }
    }
    setWatchedList(nextWatched);
    if (pageId) {
      try {
        const all = getStoredTienDo();
        all[pageId] = {
          last_video: videoNum,
          watched: nextWatched,
        };
        localStorage.setItem('tien_do', JSON.stringify(all));
        notifyProgressChanged();
      } catch {}
    }
  };

  // State hỗ trợ cử chỉ vuốt sang (swipe gesture) trên mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [swipingIdx, setSwipingIdx] = useState<number | null>(null);
  const [swipeDiff, setSwipeDiff] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent, idx: number) => {
    setTouchStartX(e.touches[0].clientX);
    setSwipingIdx(idx);
    setSwipeDiff(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setSwipeDiff(currentX - touchStartX);
  };

  const handleTouchEnd = (idx: number, isWatched: boolean) => {
    if (swipingIdx === idx) {
      // Vuốt sang phải > 30px: nếu chưa hiểu -> đổi thành hiểu
      if (swipeDiff > 30 && !isWatched) {
        handleToggleVideoWatched(idx);
      }
      // Vuốt sang trái < -30px: nếu đã hiểu -> đổi thành chưa hiểu
      else if (swipeDiff < -30 && isWatched) {
        handleToggleVideoWatched(idx);
      }
    }
    setTouchStartX(null);
    setSwipingIdx(null);
    setSwipeDiff(0);
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
    setManualOverrideAspect('auto');
    setIsEndedPlaylist(false);
    recordXemTiep(idx);

    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    const targetVid = videoList[idx];
    if (targetVid?.youtube_id && playerRef.current?.loadVideoById) {
      playerRef.current.loadVideoById(targetVid.youtube_id);
      if (typeof playerRef.current.setPlaybackRate === 'function') {
        playerRef.current.setPlaybackRate(playbackRateRef.current);
      }
    }
  };

  // Cấu hình MediaSession API (Điều khiển phát trực tiếp trên Màn hình khóa của iOS/Android)
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    const thumb =
      currentVideo.thumbnail_url ||
      (currentVideo.youtube_id ? `https://i.ytimg.com/vi/${currentVideo.youtube_id}/hqdefault.jpg` : pageCoverUrl || '');

    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentVideo.title,
        artist: 'Tùng Dinh Dưỡng · Qbiz Books',
        album: topicTitle || pageTitle || 'Học Cơ Thể Người',
        artwork: [
          { src: thumb, sizes: '512x512', type: 'image/jpeg' },
          { src: thumb, sizes: '256x256', type: 'image/jpeg' },
          { src: thumb, sizes: '96x96', type: 'image/jpeg' },
        ],
      });

      navigator.mediaSession.setActionHandler('play', () => {
        setIsPlaying(true);
        recordXemTiep(safeIndex);
        try {
          playerRef.current?.playVideo?.();
        } catch {}
        if (backgroundAudioEnabled && audioRef.current) {
          audioRef.current.play().then(() => setIsAudioPlaying(true)).catch(() => {});
        }
      });

      navigator.mediaSession.setActionHandler('pause', () => {
        setIsPlaying(false);
        try {
          playerRef.current?.pauseVideo?.();
        } catch {}
        if (audioRef.current) {
          audioRef.current.pause();
          setIsAudioPlaying(false);
        }
      });

      navigator.mediaSession.setActionHandler('seekbackward', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
        }
      });

      navigator.mediaSession.setActionHandler('seekforward', () => {
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(
            audioRef.current.duration || 9999,
            audioRef.current.currentTime + 10
          );
        }
      });

      navigator.mediaSession.setActionHandler('previoustrack', () => {
        if (safeIndex > 0) handleSelectVideo(safeIndex - 1);
      });

      navigator.mediaSession.setActionHandler('nexttrack', () => {
        if (safeIndex + 1 < videoList.length) handleSelectVideo(safeIndex + 1);
      });
    } catch {}
  }, [currentVideo, topicTitle, pageTitle, backgroundAudioEnabled, safeIndex, videoList.length]);

  // Khóa cứng khung ngang 16:9 theo yêu cầu của người dùng, không bao giờ tự động bung dọc to
  const isVertical = false;

  return (
    <div
      ref={containerRef}
      id={blockId}
      className="w-full flex flex-col gap-2 sm:gap-2.5 scroll-mt-20"
    >
      {/* THẺ AUDIO PHÁT NỀN KHI CÓ FILE AUDIO THỰC TẾ (TÀNG HÌNH, KHÔNG CHIẾM DIỆN TÍCH) */}
      {Boolean(currentVideo.audio_url) && (
        <audio
          ref={audioRef}
          src={currentVideo.audio_url || undefined}
          preload="metadata"
          loop={!isPlaylist}
          onPlay={() => {
            setIsAudioPlaying(true);
            recordXemTiep(safeIndex);
          }}
          onPause={() => setIsAudioPlaying(false)}
          onEnded={() => {
            setIsAudioPlaying(false);
            markWatched(safeIndex);
            if (safeIndex + 1 < videoList.length) {
              handleSelectVideo(safeIndex + 1);
            } else {
              setIsEndedPlaylist(true);
            }
          }}
          className="hidden"
        />
      )}

      {/* KHUNG TRÌNH PHÁT VIDEO CHUẨN NGANG 16:9 (KHÔNG PHÌNH DỌC) */}
      <div
        className="relative w-full p-0 overflow-hidden rounded-[18px] sm:rounded-[22px] bg-black border-[2px] border-slate-700/80 shadow-[0_12px_28px_rgba(15,23,42,0.22)] dark:border-blue-900/50 transition-all duration-300 max-w-full"
      >
        {/* TRÌNH PHÁT VIDEO YOUTUBE GỐC */}
        <div
          className="relative w-full rounded-none bg-black overflow-hidden flex items-center justify-center aspect-video"
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
                      recordXemTiep(safeIndex);
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

      {/* 1. KHUNG TIỆN ÍCH VIDEO & TIẾN ĐỘ HỌC TẬP (HỢP NHẤT VÀO 1 KHUNG DUY NHẤT, TINH GỌN, KHÔNG NHIỀU KHUNG) */}
      <div className="flex flex-col w-full min-w-0 rounded-[13px] border border-slate-200/90 bg-slate-50/90 p-2 dark:border-blue-900/40 dark:bg-[#0E1A33] shadow-2xs gap-1.5">
        {/* HÀNG 1: TỐC ĐỘ PHÁT + BIỂU TƯỢNG TAI NGHE + GIỮ SÁNG */}
        <div className="flex w-full items-center justify-between gap-1.5">
          {/* Bên trái: Khung tốc độ phát rõ ràng, dạng khối nổi dễ ấn */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10.5px] font-black text-slate-500 dark:text-sky-300 flex items-center gap-1 shrink-0">
              <Gauge size={12} className="text-[#0284C7] dark:text-sky-400" />
              <span>Tốc độ:</span>
            </span>
            <div className="inline-flex items-center p-0.5 rounded-[8px] bg-slate-200/80 dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700/80 gap-0.5 shadow-2xs">
              {[1, 1.25, 1.5, 2].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => handleSetSpeed(spd)}
                  className={`min-w-[28px] h-6 px-1.5 rounded-[6px] text-[10.5px] font-black transition-all cursor-pointer flex items-center justify-center ${
                    playbackRate === spd
                      ? 'bg-[#0E2A5C] text-white dark:bg-sky-400 dark:text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-black dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
                  }`}
                  title={`Tốc độ ${spd}x`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>

          {/* Bên phải: Biểu tượng tai nghe nghe nền (bên trái nút giữ sáng) + Nút giữ sáng mờ nhạt */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Biểu tượng tai nghe: Chỉ hiển thị khi có file audio thực tế */}
            {Boolean(currentVideo.audio_url) && (
              <button
                type="button"
                onClick={handleToggleBackgroundAudio}
                className={`w-7 h-7 rounded-[7px] flex items-center justify-center border transition-colors cursor-pointer shrink-0 ${
                  backgroundAudioEnabled
                    ? 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950/70 dark:text-sky-300 dark:border-sky-800 shadow-2xs'
                    : 'bg-transparent text-slate-400 border-slate-200/80 dark:text-slate-500 dark:border-slate-800'
                }`}
                title={backgroundAudioEnabled ? 'Đang bật tự động phát âm thanh khi tắt màn hình hoặc khóa máy' : 'Bấm để bật tự động phát khi tắt màn hình'}
                aria-label="Tự động phát khi tắt màn hình"
              >
                <Headphones size={13} className={backgroundAudioEnabled ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'} />
              </button>
            )}

            {/* Nút Giữ sáng màn hình (Thiết kế mờ nhạt, nhẹ nhàng, không phô trương) */}
            <button
              type="button"
              onClick={handleToggleWakeLock}
              className={`inline-flex items-center gap-1 h-7 px-2 rounded-[7px] text-[10.5px] font-medium border transition-colors cursor-pointer shrink-0 ${
                wakeLockEnabled
                  ? 'bg-slate-200/70 text-slate-700 border-slate-300/80 dark:bg-white/5 dark:text-slate-300 dark:border-white/10'
                  : 'bg-transparent text-slate-400 border-slate-200/80 dark:text-slate-500 dark:border-slate-800'
              }`}
              title="Bật/Tắt giữ màn hình điện thoại luôn sáng khi đang học"
            >
              <Sun size={12} className={wakeLockEnabled ? 'text-amber-500/80' : 'text-slate-400'} />
              <span className="whitespace-nowrap">
                Giữ sáng
              </span>
            </button>
          </div>
        </div>

        {/* HÀNG 2: TIẾN ĐỘ CÙNG MỘT DÒNG (BIỂU TƯỢNG + PHẦN TRĂM + THANH TIẾN ĐỘ CÙNG 1 DÒNG DUY NHẤT) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-200/70 dark:border-blue-900/30">
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 dark:text-slate-300 shrink-0">
            <BarChart2 size={12} className="text-blue-600 dark:text-[#93C5FD] shrink-0" />
            <span>Tiến độ:</span>
            <strong className="text-blue-700 dark:text-[#93C5FD] font-black">
              {Math.min(100, Math.round(((videoList.filter((v, i) => watchedList.includes(v.youtube_id || v.id || String(i + 1))).length) / (videoList.length || 1)) * 100))}%
            </strong>
          </div>

          {/* Dải tiến độ ngang trên cùng dòng */}
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 dark:bg-purple-950/80 border border-slate-300/60 dark:border-purple-900/30 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-blue-600 dark:bg-gradient-to-r dark:from-purple-500 dark:to-[#93C5FD] transition-all duration-500"
              style={{
                width: `${Math.max(
                  Math.min(100, Math.round(((videoList.filter((v, i) => watchedList.includes(v.youtube_id || v.id || String(i + 1))).length) / (videoList.length || 1)) * 100)),
                  4
                )}%`,
              }}
            />
          </div>

          {videoList.filter((v, i) => watchedList.includes(v.youtube_id || v.id || String(i + 1))).length === videoList.length && videoList.length > 0 && (
            <span className="text-emerald-700 dark:text-emerald-300 text-[10px] font-black bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/30 px-1.5 py-0.2 rounded-full shrink-0">
              ✓ Hoàn thành
            </span>
          )}
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
      <div className={currentTab === 'syllabus' ? 'flex flex-col gap-1.5 mt-1.5' : 'hidden'}>
        {videoList.map((vid, idx) => {
          const isActive = idx === safeIndex;
          const videoKey = vid.youtube_id || vid.id || String(idx + 1);
          const isWatched = watchedList.includes(videoKey);
          const isReview = reviewIndices.includes(idx + 1);
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
              onTouchStart={(e) => handleTouchStart(e, idx)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(idx, isWatched)}
              className={`w-full flex flex-col rounded-[12px] text-left transition-all duration-150 group overflow-hidden ${
                isActive
                  ? 'bg-blue-50/60 dark:bg-gradient-to-br dark:from-[#24154B] dark:via-[#1B0F3B] dark:to-[#120829] border-[1.5px] border-blue-400 dark:border-blue-400/60 shadow-xs ring-1 ring-blue-400/20'
                  : 'bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-900/40 hover:border-slate-300 dark:hover:border-purple-600/50 shadow-2xs'
              }`}
            >
              {/* Hàng ngang chính bấm để phát video */}
              <div
                onClick={() => handleSelectVideo(idx)}
                className="w-full flex items-center gap-2 p-1.5 sm:gap-2.5 sm:p-2 cursor-pointer active:scale-[0.99]"
                role="button"
                tabIndex={0}
              >
                {/* 1. KHUNG ẢNH THUMBNAIL THU GỌN: HUY HIỆU SỐ BÀI GÓC TRÊN-TRÁI + THỜI LƯỢNG GÓC DƯỚI-PHẢI */}
                <div className="relative w-[72px] sm:w-[88px] aspect-video rounded-[8px] overflow-hidden bg-slate-100 dark:bg-[#0A0515] shrink-0 border border-slate-200/90 dark:border-purple-500/20 shadow-2xs">
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

                  {/* Huy hiệu BÀI 01 / ĐANG PHÁT gắn trực tiếp lên góc trên-trái viền ảnh - CHUẨN 1 DÒNG */}
                  <div
                    className={`absolute top-0.5 left-0.5 px-1 py-0.5 rounded-[3.5px] text-[7.5px] sm:text-[8px] font-black uppercase shadow-xs backdrop-blur-xs flex items-center gap-0.5 whitespace-nowrap leading-none select-none ${
                      isActive
                        ? 'bg-blue-600 text-white dark:bg-blue-400 dark:text-slate-950 ring-1 ring-white/40'
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

                {/* 2. TIÊU ĐỀ RỘNG RÃI TRẢI DÀI + CÔNG TẮC GẠT VUỐT HIỂU/CHƯA HIỂU + BÀI HỌC RÚT RA */}
                <div className="flex flex-col gap-1 min-w-0 flex-1 justify-center">
                  <h4
                    className={`text-[12px] sm:text-[13px] font-extrabold leading-snug line-clamp-2 transition-colors ${
                      isActive
                        ? 'text-slate-950 dark:text-blue-100 group-hover:text-blue-800'
                        : 'text-slate-900 dark:text-white group-hover:text-blue-700'
                    }`}
                    title={vid.title}
                  >
                    {vid.title}
                  </h4>

                  {/* Hàng điều khiển: Nút xem Bài học rút ra (trái) & Công tắc Chưa hiểu/Đã hiểu (góc bên phải) */}
                  <div className="flex items-center justify-between gap-1.5 w-full mt-0.5">
                    {/* Nút mũi tên xem Bài học rút ra (nếu có mô tả) */}
                    {vid.description ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playTapSound();
                          setExpandedTakeaways((prev) => ({
                            ...prev,
                            [idx]: !prev[idx],
                          }));
                        }}
                        className={`inline-flex items-center gap-1 py-0.5 px-2 rounded-[6px] text-[9.5px] sm:text-[10px] font-bold border transition-all active:scale-95 cursor-pointer shrink-0 ${
                          expandedTakeaways[idx]
                            ? 'bg-blue-50/80 border-blue-300/80 text-[#1E3A8A] dark:bg-blue-950/60 dark:border-blue-700/60 dark:text-sky-300'
                            : 'bg-slate-50 hover:bg-blue-50/50 border-slate-200/90 hover:border-blue-200 text-slate-600 hover:text-[#1E3A8A] dark:bg-[#100924] dark:border-purple-900/40 dark:text-purple-300'
                        }`}
                        title={expandedTakeaways[idx] ? 'Thu gọn bài học rút ra' : 'Xem bài học rút ra'}
                      >
                        <span>💡 Rút ra</span>
                        <ChevronDown
                          size={11}
                          strokeWidth={2.5}
                          className={`transition-transform duration-200 ${
                            expandedTakeaways[idx] ? 'rotate-180 text-[#1E3A8A] dark:text-sky-300' : 'text-slate-400'
                          }`}
                        />
                      </button>
                    ) : (
                      <div className="shrink-0" />
                    )}

                    {/* Nút công tắc vuốt/gạt Đã hiểu - Chưa hiểu (ĐẶT Ở GÓC BÊN PHẢI) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVideoWatched(idx);
                      }}
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-extrabold border transition-all active:scale-95 cursor-pointer select-none shadow-2xs ml-auto shrink-0 ${
                        isWatched
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200'
                          : isReview
                          ? 'bg-amber-50 dark:bg-amber-950/70 border-amber-400 dark:border-amber-600 text-amber-800 dark:text-amber-200'
                          : 'bg-slate-100 dark:bg-purple-950/50 border-slate-300 dark:border-purple-800/60 text-slate-600 dark:text-slate-400 hover:border-slate-400'
                      }`}
                      title={
                        isWatched
                          ? 'Đã hiểu (Bấm để chuyển sang Chưa hiểu / Cần ôn tập)'
                          : isReview
                          ? 'Chưa hiểu (Đang trong mục Cần ôn tập, bấm để chuyển sang Đã hiểu)'
                          : 'Bấm để đánh dấu Đã hiểu'
                      }
                    >
                      <span>
                        {isWatched ? 'Đã hiểu' : isReview ? 'Chưa hiểu' : 'Đánh dấu hiểu'}
                      </span>
                      {/* Thanh gạt tròn trượt mượt mà */}
                      <div
                        className={`w-6 h-3 rounded-full p-0.5 flex items-center transition-colors ${
                          isWatched
                            ? 'bg-emerald-600 justify-end'
                            : isReview
                            ? 'bg-amber-500 justify-start'
                            : 'bg-slate-300 dark:bg-purple-900 justify-start'
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full bg-white shadow-xs transition-transform" />
                      </div>
                    </button>
                  </div>
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

              {/* Khối bung "Bài học rút ra" - khung trắng, viền & điểm nhấn xanh nhẹ, xuống dòng rõ ràng */}
              {vid.description && expandedTakeaways[idx] && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="mx-2 mb-2 p-3 rounded-[12px] bg-white dark:bg-[#121B2E] border border-blue-100 dark:border-blue-900/50 shadow-2xs text-[11.5px] sm:text-[12px] leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200 cursor-default"
                >
                  <div className="flex items-center gap-1.5 text-[9.5px] sm:text-[10px] font-black uppercase text-[#1E3A8A] dark:text-sky-300 tracking-wider mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-sky-400 inline-block" />
                    <span>BÀI HỌC RÚT RA</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pl-3 border-l-2 border-blue-400 dark:border-sky-500">
                    {vid.description
                      .split('\n')
                      .map((l) => l.trim())
                      .filter(Boolean)
                      .map((line, lIdx) => {
                        const bulletMatch = line.match(/^(?:•|-|\*|\d+\.)\s*([\s\S]*)$/);
                        const content = bulletMatch ? bulletMatch[1].trim() : line;
                        return (
                          <div key={lIdx} className="flex items-start gap-1.5 font-normal text-slate-700 dark:text-slate-200 leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-sky-400 mt-1.5 shrink-0" />
                            <div className="flex-1">
                              {renderFormattedTakeaway(content)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
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

      <div className={currentTab === 'summary' ? 'flex flex-col gap-3 py-1' : 'hidden'}>
        {summaryContent || (
          <p className="text-muted text-[14px] p-4 text-center">Chưa có tóm tắt bổ sung cho bài học này.</p>
        )}
      </div>

      <div className={currentTab === 'resources' ? 'flex flex-col gap-3 py-1' : 'hidden'}>
        {resourcesContent}
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
