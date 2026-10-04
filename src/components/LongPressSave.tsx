'use client';

import React, { useRef, useState } from 'react';
import { Bookmark, BookmarkCheck, X } from 'lucide-react';
import { isPageSaved, toggleSavePage, SavedPageInfo } from '../lib/learningProgress';

const KIND_LABEL: Record<string, string> = {
  page: 'bài học',
  video: 'video',
  book: 'cuốn sách',
  playlist: 'danh sách phát',
};

interface LongPressSaveProps {
  /** Thông tin mục sẽ lưu (saved_at sẽ được gán khi lưu) */
  item: Omit<SavedPageInfo, 'saved_at'>;
  children: React.ReactNode;
  className?: string;
  /** Thời gian giữ (ms) */
  delay?: number;
}

/**
 * Giữ lâu (khoảng 0,6 giây) vào phần tử bên trong để hỏi "Bạn có muốn lưu không?".
 * Chạm nhanh vẫn hoạt động bình thường như cũ.
 */
export default function LongPressSave({ item, children, className = '', delay = 600 }: LongPressSaveProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const firedRef = useRef(false);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    firedRef.current = false;
    startRef.current = { x: e.clientX, y: e.clientY };
    clear();
    timerRef.current = setTimeout(() => {
      firedRef.current = true;
      try {
        if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(18);
      } catch {
        // Bỏ qua
      }
      setSaved(isPageSaved(item.page_id));
      setOpen(true);
    }, delay);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const s = startRef.current;
    if (!s || !timerRef.current) return;
    if (Math.abs(e.clientX - s.x) > 10 || Math.abs(e.clientY - s.y) > 10) clear();
  };

  // Nếu vừa giữ lâu thì bỏ qua cú "click" sinh ra khi thả tay
  const onClickCapture = (e: React.MouseEvent) => {
    if (firedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      firedRef.current = false;
    }
  };

  const confirm = () => {
    if (isPageSaved(item.page_id) === saved) {
      toggleSavePage({ ...item, saved_at: Date.now() });
    }
    setOpen(false);
  };

  const label = KIND_LABEL[item.kind || 'page'] || 'mục này';

  return (
    <>
      <div
        className={className}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={clear}
        onPointerCancel={clear}
        onPointerLeave={clear}
        onClickCapture={onClickCapture}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' } as React.CSSProperties}
      >
        {children}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center bg-black/45 backdrop-blur-[2px] p-3"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-[420px] rounded-[24px] bg-white dark:bg-[#160D30] shadow-2xl p-5 flex flex-col gap-4 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
                {saved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] font-black text-ink dark:text-white leading-snug">
                  {saved ? `Bỏ lưu ${label} này?` : `Lưu ${label} này?`}
                </p>
                <p className="text-[13px] text-muted mt-0.5 line-clamp-2">{item.page_title}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-muted cursor-pointer shrink-0"
                aria-label="Đóng"
              >
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-11 rounded-[12px] bg-slate-100 dark:bg-white/10 text-ink dark:text-white font-bold text-[14px] cursor-pointer"
              >
                Không
              </button>
              <button
                type="button"
                onClick={confirm}
                className={`h-11 rounded-[12px] font-extrabold text-[14px] text-white cursor-pointer active:scale-[0.98] ${
                  saved ? 'bg-red-500' : 'bg-primary'
                }`}
              >
                {saved ? 'Bỏ lưu' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
