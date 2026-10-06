'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import { playTapSound } from '../lib/audioFeedback';

export default function FloatingAiButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Không hiển thị trên trang Trợ lý AI và trang Đăng nhập
  const isHiddenPage = pathname === '/tro-ly-ai' || pathname?.startsWith('/dang-nhap');

  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const isUnlockedRef = useRef(false);
  const isDraggingRef = useRef(false);
  const cancelledByScrollRef = useRef(false);

  const holdTimerRef = useRef<any>(null);
  const holdProgressTimerRef = useRef<any>(null);
  const [holdProgress, setHoldProgress] = useState(0);

  const dragInfoRef = useRef<{
    startX: number;
    startY: number;
    elemX: number;
    elemY: number;
    moved: boolean;
  }>({ startX: 0, startY: 0, elemX: 0, elemY: 0, moved: false });

  const justMovedRef = useRef(false);

  // Pre-warm trang trợ lý AI để khi bấm chuyển trang tức thì <50ms
  useEffect(() => {
    try {
      router.prefetch('/tro-ly-ai');
    } catch {}
  }, [router]);

  // Ngữ cảnh bài học đang theo dõi (để nút nổi bám đuổi theo bài học)
  const [activeLesson, setActiveLesson] = useState<{
    topic_slug: string;
    topic_title: string;
    page_slug?: string;
    page_title?: string;
  } | null>(null);

  const hasLessonContext = !!(activeLesson && (activeLesson.page_title || activeLesson.topic_title));

  useEffect(() => {
    const updateContext = () => {
      try {
        const raw = sessionStorage.getItem('qbiz_current_lesson');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && parsed.topic_slug) {
            setActiveLesson(parsed);
            return;
          }
        }
      } catch {}

      if (pathname) {
        const parts = pathname.split('/').filter(Boolean);
        const nonTopicPaths = ['da-luu', 'tim-kiem', 'tro-ly-ai', 'chuyen-de', 'dang-nhap', 'admin'];
        if (parts.length >= 1 && !nonTopicPaths.includes(parts[0])) {
          setActiveLesson({
            topic_slug: parts[0],
            topic_title: parts[0] === 'cot-song' ? 'Cột Sống' : parts[0] === 'nuoc' ? 'Nước & Điện Giải' : parts[0],
            page_slug: parts[1] || undefined,
          });
          return;
        }
      }
      setActiveLesson(null);
    };

    updateContext();

    const handleLessonChanged = (e: any) => {
      if (e.detail) {
        setActiveLesson(e.detail);
      }
    };
    window.addEventListener('qbiz_current_lesson_changed', handleLessonChanged);
    return () => window.removeEventListener('qbiz_current_lesson_changed', handleLessonChanged);
  }, [pathname]);

  // Đọc tọa độ từ localStorage hoặc đặt mặc định ở góc dưới bên phải (ngay trên Tab Tìm kiếm ở BottomNav)
  useEffect(() => {
    const btnWidth = hasLessonContext ? 128 : 88;
    try {
      const saved = localStorage.getItem('qbiz_floating_ai_pos');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === 'number' && typeof parsed.y === 'number') {
          const clampedX = Math.max(12, Math.min(parsed.x, window.innerWidth - btnWidth - 12));
          const clampedY = Math.max(50, Math.min(parsed.y, window.innerHeight - 125));
          setPos({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch {}

    // Vị trí mặc định: Góc dưới bên phải (nổi ngay sát trên Tab Tìm kiếm của BottomNav, không che pagination)
    const defaultX = Math.max(12, window.innerWidth - btnWidth - 14);
    const defaultY = Math.max(50, window.innerHeight - 130);
    setPos({ x: defaultX, y: defaultY });
  }, [hasLessonContext]);

  // Đảm bảo không bị lọt khỏi màn hình khi xoay điện thoại hoặc thay đổi kích thước
  useEffect(() => {
    const handleResize = () => {
      const btnWidth = hasLessonContext ? 128 : 88;
      setPos((prev) => {
        if (!prev) return prev;
        const clampedX = Math.max(12, Math.min(prev.x, window.innerWidth - btnWidth - 12));
        const clampedY = Math.max(50, Math.min(prev.y, window.innerHeight - 125));
        return { x: clampedX, y: clampedY };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasLessonContext]);

  // Xử lý sự kiện nhấn chạm
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    const btnWidth = hasLessonContext ? 128 : 88;
    const currentX = pos ? pos.x : Math.max(12, window.innerWidth - btnWidth - 14);
    const currentY = pos ? pos.y : Math.max(50, window.innerHeight - 130);

    dragInfoRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      elemX: currentX,
      elemY: currentY,
      moved: false,
    };

    cancelledByScrollRef.current = false;
    isUnlockedRef.current = false;
    isDraggingRef.current = false;

    setIsHolding(true);
    setHoldProgress(0);

    const startTime = Date.now();
    const HOLD_DURATION = 2500; // Đúng 2.5 giây theo yêu cầu

    // Cập nhật thanh tiến trình nhấn giữ mượt mà
    holdProgressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / HOLD_DURATION) * 100));
      setHoldProgress(pct);
    }, 50);

    // Kích hoạt mở khóa di chuyển sau 2.5 giây
    holdTimerRef.current = setTimeout(() => {
      clearInterval(holdProgressTimerRef.current);
      setHoldProgress(100);
      setIsHolding(false);
      isUnlockedRef.current = true;
      isDraggingRef.current = true;
      setIsUnlocked(true);
      setIsDragging(true);

      // Phản hồi rung vi mô nếu thiết bị hỗ trợ
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        try {
          navigator.vibrate(60);
        } catch {}
      }
      playTapSound();
    }, HOLD_DURATION);

    let latestX = currentX;
    let latestY = currentY;

    const handlePointerMove = (moveEvt: PointerEvent) => {
      const dx = moveEvt.clientX - dragInfoRef.current.startX;
      const dy = moveEvt.clientY - dragInfoRef.current.startY;

      // Nếu chưa đủ 2.5s (chưa mở khóa) mà người dùng di chuyển > 10px => Hủy đếm giữ (cho phép cuộn trang)
      if (!isUnlockedRef.current) {
        if (Math.hypot(dx, dy) > 10) {
          cancelledByScrollRef.current = true;
          clearTimeout(holdTimerRef.current);
          clearInterval(holdProgressTimerRef.current);
          setIsHolding(false);
          setHoldProgress(0);
        }
        return;
      }

      // Khi ĐÃ mở khóa (sau 2.5s) => Cho phép kéo nút tự do
      dragInfoRef.current.moved = true;
      const btnWidth = hasLessonContext ? 128 : 88;
      const minX = 12;
      const maxX = window.innerWidth - btnWidth - 12;
      const minY = 50;
      const maxY = window.innerHeight - 120; // Không che BottomNav và thanh phân trang

      latestX = Math.max(minX, Math.min(dragInfoRef.current.elemX + dx, maxX));
      latestY = Math.max(minY, Math.min(dragInfoRef.current.elemY + dy, maxY));

      setPos({ x: latestX, y: latestY });
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);

      clearTimeout(holdTimerRef.current);
      clearInterval(holdProgressTimerRef.current);
      setIsHolding(false);
      setHoldProgress(0);

      const wasUnlocked = isUnlockedRef.current;
      const hasMoved = dragInfoRef.current.moved;

      isUnlockedRef.current = false;
      isDraggingRef.current = false;
      setIsUnlocked(false);
      setIsDragging(false);

      // Nếu đã ở trạng thái mở khóa kéo thả: lưu vị trí và không mở link
      if (wasUnlocked) {
        justMovedRef.current = true;
        setTimeout(() => {
          justMovedRef.current = false;
        }, 300);

        if (hasMoved) {
          const finalPos = { x: latestX, y: latestY };
          setPos(finalPos);
          try {
            localStorage.setItem('qbiz_floating_ai_pos', JSON.stringify(finalPos));
          } catch {}
        }
        return;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (justMovedRef.current || isUnlockedRef.current || isDraggingRef.current) {
      return;
    }
    playTapSound();

    // Nếu đang ở trong bài học hoặc chuyên đề, bám đuổi ngữ cảnh sang Trợ lý AI
    if (activeLesson && activeLesson.topic_slug) {
      const params = new URLSearchParams();
      params.set('topic', activeLesson.topic_slug);
      if (activeLesson.topic_title) params.set('topicTitle', activeLesson.topic_title);
      if (activeLesson.page_slug) params.set('page', activeLesson.page_slug);
      if (activeLesson.page_title) params.set('pageTitle', activeLesson.page_title);
      router.push(`/tro-ly-ai?${params.toString()}`);
    } else {
      router.push('/tro-ly-ai');
    }
  };

  if (isHiddenPage) return null;

  return (
    <aside
      onPointerDown={handlePointerDown}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
      style={{
        transform: 'translateZ(0)',
        left: pos ? `${pos.x}px` : 'auto',
        right: pos ? 'auto' : '16px',
        top: pos ? `${pos.y}px` : 'auto',
        bottom: pos ? 'auto' : '74px',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
        touchAction: 'none',
        transition: isDragging
          ? 'none'
          : 'box-shadow 0.2s ease, transform 0.2s ease',
      }}
      className={`fixed z-50 select-none touch-none cursor-pointer active:scale-95 transition-all ${
        isUnlocked || isDragging
          ? 'scale-105 ring-2 ring-[#FDE047] shadow-[0_0_22px_rgba(250,204,21,0.65)]'
          : 'hover:scale-105'
      }`}
      aria-label="Hỏi Trợ lý AI (Giữ 2.5 giây để di chuyển vị trí)"
      title={
        activeLesson?.page_title
          ? `Hỏi Trợ lý AI về bài "${activeLesson.page_title}" (Bấm để mở, giữ 2.5s để kéo thả)`
          : 'Hỏi AI (Bấm để mở, giữ 2.5s để kéo thả di chuyển)'
      }
    >
      {/* Vòng / Thanh tiến trình khi người dùng đang giữ nút (đếm 2.5s) */}
      {isHolding && holdProgress > 0 && (
        <div
          className="absolute -inset-1 rounded-full border-2 border-dashed border-[#FDE047] animate-spin"
          style={{ animationDuration: '3s' }}
        />
      )}

      {/* Nút bấm button không dùng thẻ a để trình duyệt di động tuyệt đối không bật menu sao chép link khi nhấn giữ */}
      <button
        type="button"
        onClick={handleButtonClick}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
        className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all shadow-sm select-none ${
          isUnlocked || isDragging
            ? 'bg-black/90 dark:bg-[#160D30]/95 border-2 border-[#FDE047] text-[#FDE047] shadow-[0_0_18px_rgba(250,204,21,0.65)] ring-2 ring-[#FDE047]/50'
            : hasLessonContext
            ? 'bg-white/95 dark:bg-[#160D30]/95 hover:bg-white dark:hover:bg-[#1D1140] border-[1.5px] border-blue-600/60 dark:border-purple-400/60 text-[#1E3A8A] dark:text-[#F8DF7B] shadow-[0_2px_12px_rgba(30,58,138,0.2)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.45)]'
            : 'bg-white/95 dark:bg-[#160D30]/95 hover:bg-white dark:hover:bg-[#1D1140] border-[1.5px] border-[#1E3A8A]/40 dark:border-blue-400/40 text-[#1E3A8A] dark:text-[#F8DF7B] shadow-[0_2px_10px_rgba(30,58,138,0.12)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.35)]'
        }`}
      >
        <Sparkles
          size={14}
          strokeWidth={2.2}
          className={`${
            isUnlocked || isDragging
              ? 'text-[#FDE047] animate-spin'
              : hasLessonContext
              ? 'text-blue-600 dark:text-[#F8DF7B] fill-blue-600/30 dark:fill-amber-300/40 animate-pulse'
              : 'text-[#1E3A8A] dark:text-[#F8DF7B] fill-[#1E3A8A]/20 dark:fill-amber-300/30 animate-pulse'
          }`}
        />
        <span className="text-[12px] font-extrabold tracking-tight whitespace-nowrap">
          {isUnlocked ? 'Thả đặt' : hasLessonContext && activeLesson?.page_title ? 'Hỏi bài này' : 'Hỏi AI'}
        </span>
        {hasLessonContext && !isUnlocked && (
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
        )}
      </button>

      {/* Gợi ý nhỏ khi đang giữ gần đủ 2.5 giây */}
      {isHolding && (
        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md bg-black/80 text-white text-[9.5px] font-bold shadow-md">
          Giữ {Math.max(1, Math.ceil((2500 - (holdProgress * 25)) / 1000))}s để kéo thả
        </div>
      )}
    </aside>
  );
}
