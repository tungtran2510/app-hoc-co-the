'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, Play, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl, getYouTubeThumbnailUrl } from '../lib/youtube';

interface YouTubeEmbedProps {
  youtubeId: string;
  title?: string;
  aspectRatio?: 'video' | 'portrait' | 'square';
  className?: string;
  autoplay?: boolean;
  showExternalLink?: boolean;
  showAdminTip?: boolean;
}

export default function YouTubeEmbed({
  youtubeId,
  title = 'Video YouTube',
  aspectRatio = 'video',
  className = '',
  autoplay = false,
  showExternalLink = true,
  showAdminTip = false,
}: YouTubeEmbedProps) {
  const [embedSrc, setEmbedSrc] = useState<string>('');
  const [useFallbackDomain, setUseFallbackDomain] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  useEffect(() => {
    if (!youtubeId) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // Standard embed URL with proper parameters
    const domain = useFallbackDomain ? 'www.youtube.com' : 'www.youtube-nocookie.com';
    const params = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      enablejsapi: '1',
      playsinline: '1',
    });
    if (autoplay) params.set('autoplay', '1');
    if (origin && origin.startsWith('http')) {
      params.set('origin', origin);
      params.set('widget_referrer', origin);
    }
    setEmbedSrc(`https://${domain}/embed/${youtubeId}?${params.toString()}`);
  }, [youtubeId, autoplay, useFallbackDomain, key]);

  if (!youtubeId) return null;

  const aspectClass =
    aspectRatio === 'portrait'
      ? 'aspect-[9/16] max-h-[70vh]'
      : aspectRatio === 'square'
      ? 'aspect-square'
      : 'aspect-video';

  const watchUrl = getYouTubeWatchUrl(youtubeId);

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {/* KHUNG IFRAME PLAYER */}
      <div
        className={`relative w-full ${aspectClass} rounded-[14px] sm:rounded-[16px] overflow-hidden bg-black border border-slate-200 dark:border-white/10 shadow-xs`}
      >
        {embedSrc ? (
          <iframe
            key={key}
            src={embedSrc}
            title={title}
            className="w-full h-full border-0 absolute inset-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
            <span className="text-[12px] opacity-70">Đang khởi tạo trình phát...</span>
          </div>
        )}
      </div>

      {/* THANH ĐIỀU HƯỚNG DƯỚI VIDEO (NÚT XEM TRỰC TIẾP TRÊN YOUTUBE & CHUYỂN SERVER NẾU CẦN) */}
      <div className="flex items-center justify-between gap-2 px-1 text-[11.5px]">
        {showExternalLink && (
          <a
            href={watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400 hover:underline transition-colors py-0.5"
            title="Mở xem trực tiếp trên ứng dụng YouTube hoặc tab mới"
          >
            <Play size={11} className="fill-current" />
            <span>Xem trên YouTube</span>
            <ExternalLink size={10} strokeWidth={2.5} />
          </a>
        )}

        <button
          type="button"
          onClick={() => {
            setUseFallbackDomain((prev) => !prev);
            setKey((k) => k + 1);
          }}
          className="inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer ml-auto text-[11px]"
          title="Chuyển đổi giữa chế độ chuẩn YouTube và Bảo mật quyền riêng tư NoCookie"
        >
          <RefreshCw size={10} />
          <span>{useFallbackDomain ? 'Đang dùng youtube.com' : 'Đang dùng youtube-nocookie'}</span>
        </button>
      </div>

      {/* HƯỚNG DẪN DÀNH CHO ADMIN NẾU YOUTUBE BỊ CHỦ SỞ HỮU CHẶN NHÚNG */}
      {showAdminTip && (
        <div className="p-3 rounded-[12px] bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-[11.5px] leading-relaxed flex items-start gap-2">
          <Info size={15} className="shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="flex-1 space-y-1">
            <p className="font-bold">
              💡 Lưu ý quan trọng khi nhúng video YouTube:
            </p>
            <p>
              Nếu khung video thông báo: <span className="font-semibold italic">&quot;Chủ sở hữu video đã tắt tính năng phát trên các trang web khác&quot;</span>:
            </p>
            <ol className="list-decimal pl-4 space-y-0.5 font-medium">
              <li>
                Mở <strong>YouTube Studio</strong> (<code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded">studio.youtube.com</code>) trên kênh của bạn.
              </li>
              <li>
                Vào mục <strong>Nội dung</strong> &rarr; Nhấn chọn video &rarr; Cuộn xuống chọn <strong>HIỆN THÊM</strong>.
              </li>
              <li>
                Tại phần <strong>Giấy phép và phân phối</strong> &rarr; Tích chọn ô: <span className="underline font-bold">Cho phép nhúng (Allow embedding)</span> &rarr; Nhấn <strong>LƯU</strong>.
              </li>
              <li>
                Sau khi tích chọn, video sẽ phát ngay lập tức trên mọi trang web và ứng dụng!
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
