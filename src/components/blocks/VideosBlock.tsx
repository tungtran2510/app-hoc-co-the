'use client';

import React, { useState } from 'react';
import { Play, Check, BarChart2, MoreVertical } from 'lucide-react';
import { Video } from '../../lib/types';
import SpineIllustration from '../SpineIllustration';

interface VideosBlockProps {
  videos: Video[];
  displayStyle?: 'single' | 'playlist';
  defaultActiveIndex?: number;
  blockId?: string;
}

export default function VideosBlock({
  videos,
  displayStyle = 'playlist',
  defaultActiveIndex = 0,
  blockId,
}: VideosBlockProps) {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);

  if (!videos || videos.length === 0) {
    return null;
  }

  const currentVideo = videos[activeIndex] || videos[0];
  const isPlaylist = displayStyle === 'playlist' && videos.length > 1;

  return (
    <div id={blockId} className="w-full flex flex-col gap-3.5 scroll-mt-20">
      {/* Trình phát 16:9 */}
      <div className="relative w-full aspect-video rounded-[22px] bg-ink overflow-hidden shadow-sm flex items-center justify-center">
        {currentVideo.youtube_id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${currentVideo.youtube_id}?rel=0&playsinline=1`}
            title={currentVideo.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          /* Khung mô phỏng video khi chưa có youtube_id */
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#111A24] to-[#1C2735]">
            {/* Hình minh họa nền */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
              <SpineIllustration className="h-[80%] max-w-[200px]" />
            </div>

            {/* Nút Play tròn trắng 76px ở giữa */}
            <button
              type="button"
              className="relative z-10 w-[76px] h-[76px] rounded-full bg-white flex items-center justify-center text-primary shadow-lg transition-transform active:scale-95"
              aria-label={`Phát video: ${currentVideo.title}`}
            >
              <Play size={34} fill="#0E6B5A" className="ml-1 text-primary" />
            </button>

            {/* Dòng chữ dưới cùng */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10 text-white text-[15px] font-semibold bg-black/40 px-3 py-1.5 rounded-lg backdrop-blur-xs">
              <span className="truncate pr-2">{currentVideo.title}</span>
              <span className="shrink-0 text-white/80 font-normal">
                {currentVideo.duration_text || 'Chưa có video'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Dòng phụ dưới trình phát nếu là playlist */}
      {isPlaylist && (
        <p className="text-[15px] font-semibold text-muted leading-tight px-1">
          Đang phát {activeIndex + 1}/{videos.length} · Xem hết tự chuyển video tiếp
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
              const isActive = idx === activeIndex;
              const isWatched = idx < activeIndex;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-[18px] text-left transition-all min-h-[48px] ${
                    isActive
                      ? 'bg-primary-soft border-2 border-primary shadow-xs'
                      : 'bg-white border-2 border-line hover:border-line-strong'
                  }`}
                  aria-pressed={isActive}
                >
                  {/* Thumbnail 96x64 bo 12px */}
                  <div className="relative w-[96px] h-[64px] rounded-[12px] bg-[#1C2735] shrink-0 overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center justify-center opacity-40">
                      <SpineIllustration className="w-12 h-12" />
                    </div>
                    <div className="relative z-10 w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-primary shadow-xs">
                      <Play size={14} fill="#0E6B5A" className="ml-0.5 text-primary" />
                    </div>
                  </div>

                  {/* Thông tin video */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                    <h4 className="text-[18px] font-extrabold text-ink leading-snug truncate">
                      {vid.title}
                    </h4>
                    {vid.description && (
                      <p className="text-[15px] text-muted font-normal leading-tight truncate">
                        {vid.description}
                      </p>
                    )}

                    {/* Trạng thái */}
                    <div className="flex items-center gap-1.5 mt-0.5 text-[14px] font-bold">
                      {isActive ? (
                        <span className="flex items-center gap-1 text-primary">
                          <BarChart2 size={14} className="animate-pulse" />
                          Đang phát · {vid.duration_text || '0 phút'}
                        </span>
                      ) : isWatched ? (
                        <span className="flex items-center gap-1 text-primary">
                          <Check size={14} strokeWidth={3} />
                          Đã xem · {vid.duration_text || '0 phút'}
                        </span>
                      ) : (
                        <span className="text-muted font-semibold">
                          {vid.duration_text || 'Chưa xem'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Menu ⋮ */}
                  <div
                    className="shrink-0 text-muted p-1 rounded-lg hover:bg-black/5"
                    aria-hidden="true"
                  >
                    <MoreVertical size={18} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
