import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink, Play } from 'lucide-react';
import { playTapSound } from '../../lib/audioFeedback';

interface LinkItem {
  page_id?: string;
  url?: string;
  label?: string;
  slug?: string;
  cover_url?: string;
  thumbnail_url?: string;
}

interface PageMeta {
  slug: string;
  topicSlug: string;
  title: string;
  cover_url?: string;
}

interface LinksBlockProps {
  displayStyle: 'related' | 'external';
  items: LinkItem[];
  pageSlugMap?: Record<string, PageMeta>;
  blockId?: string;
  topicSlug?: string;
}

const DEFAULT_PAGE_MAP: Record<string, PageMeta> = {
  'page-cot-song-1': {
    slug: 'tong-quan-ve-cot-song',
    topicSlug: 'cot-song',
    title: 'Cột sống · 01 Tổng quan về cột sống',
    cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
  },
  'page-cot-song-2': {
    slug: 'dia-dem',
    topicSlug: 'cot-song',
    title: 'Cột sống · 02 Đĩa đệm',
    cover_url: '/images/lessons/dia-dem.jpg',
  },
  'page-cot-song-3': {
    slug: 'co-gan-day-chang',
    topicSlug: 'cot-song',
    title: 'Cột sống · 03 Cơ – gân – dây chằng',
    cover_url: '/images/lessons/co-gan-day-chang.jpg',
  },
  'page-cot-song-4': {
    slug: 'than-kinh',
    topicSlug: 'cot-song',
    title: 'Cột sống · 04 Thần kinh',
    cover_url: '/images/lessons/than-kinh.jpg',
  },
  'page-cot-song-5': {
    slug: 'tu-the-va-van-dong',
    topicSlug: 'cot-song',
    title: 'Cột sống · 05 Tư thế và vận động',
    cover_url: '/images/lessons/tu-the-va-van-dong.jpg',
  },
  'page-cot-song-6': {
    slug: 'cac-van-de-thuong-gap',
    topicSlug: 'cot-song',
    title: 'Cột sống · 06 Các vấn đề thường gặp',
    cover_url: '/images/lessons/cac-van-de-thuong-gap.jpg',
  },
  // Supabase UUIDs
  'b0000000-0000-0000-0000-000000000001': {
    slug: 'tong-quan-ve-cot-song',
    topicSlug: 'cot-song',
    title: 'Cột sống · 01 Tổng quan về cột sống',
    cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
  },
  'b0000000-0000-0000-0000-000000000002': {
    slug: 'dia-dem',
    topicSlug: 'cot-song',
    title: 'Cột sống · 02 Đĩa đệm',
    cover_url: '/images/lessons/dia-dem.jpg',
  },
  'b0000000-0000-0000-0000-000000000003': {
    slug: 'co-gan-day-chang',
    topicSlug: 'cot-song',
    title: 'Cột sống · 03 Cơ – gân – dây chằng',
    cover_url: '/images/lessons/co-gan-day-chang.jpg',
  },
  'b0000000-0000-0000-0000-000000000004': {
    slug: 'than-kinh',
    topicSlug: 'cot-song',
    title: 'Cột sống · 04 Thần kinh',
    cover_url: '/images/lessons/than-kinh.jpg',
  },
  'b0000000-0000-0000-0000-000000000005': {
    slug: 'tu-the-va-van-dong',
    topicSlug: 'cot-song',
    title: 'Cột sống · 05 Tư thế và vận động',
    cover_url: '/images/lessons/tu-the-va-van-dong.jpg',
  },
  'b0000000-0000-0000-0000-000000000006': {
    slug: 'cac-van-de-thuong-gap',
    topicSlug: 'cot-song',
    title: 'Cột sống · 06 Các vấn đề thường gặp',
    cover_url: '/images/lessons/cac-van-de-thuong-gap.jpg',
  },
  // Slug mappings for direct lookup
  'tong-quan-ve-cot-song': {
    slug: 'tong-quan-ve-cot-song',
    topicSlug: 'cot-song',
    title: 'Cột sống · 01 Tổng quan về cột sống',
    cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
  },
  'dia-dem': {
    slug: 'dia-dem',
    topicSlug: 'cot-song',
    title: 'Cột sống · 02 Đĩa đệm',
    cover_url: '/images/lessons/dia-dem.jpg',
  },
  'co-gan-day-chang': {
    slug: 'co-gan-day-chang',
    topicSlug: 'cot-song',
    title: 'Cột sống · 03 Cơ – gân – dây chằng',
    cover_url: '/images/lessons/co-gan-day-chang.jpg',
  },
  'than-kinh': {
    slug: 'than-kinh',
    topicSlug: 'cot-song',
    title: 'Cột sống · 04 Thần kinh',
    cover_url: '/images/lessons/than-kinh.jpg',
  },
  'tu-the-va-van-dong': {
    slug: 'tu-the-va-van-dong',
    topicSlug: 'cot-song',
    title: 'Cột sống · 05 Tư thế và vận động',
    cover_url: '/images/lessons/tu-the-va-van-dong.jpg',
  },
  'cac-van-de-thuong-gap': {
    slug: 'cac-van-de-thuong-gap',
    topicSlug: 'cot-song',
    title: 'Cột sống · 06 Các vấn đề thường gặp',
    cover_url: '/images/lessons/cac-van-de-thuong-gap.jpg',
  },
};

export default function LinksBlock({
  displayStyle,
  items,
  pageSlugMap = DEFAULT_PAGE_MAP,
  blockId,
  topicSlug = 'cot-song',
}: LinksBlockProps) {
  if (!items || items.length === 0) return null;

  if (displayStyle === 'related') {
    return (
      <div id={blockId} className="w-full flex flex-col gap-2 scroll-mt-20 my-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-sky-400 animate-pulse" />
            <h4 className="text-[13.5px] sm:text-[14.5px] font-black tracking-wide text-slate-900 dark:text-white uppercase">
              BÀI GIẢNG LIÊN QUAN
            </h4>
          </div>
          <span className="text-[10.5px] font-bold text-slate-400 dark:text-slate-500">
            Vuốt ngang xem thêm →
          </span>
        </div>

        {/* Khung video lớn dạng slide ngang - khác biệt hoàn toàn danh sách bài đang học */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2.5 pt-0.5 px-0.5 snap-x snap-mandatory">
          {items.map((item, idx) => {
            const key = item.page_id || item.slug || '';
            const mapped = key ? (pageSlugMap as any)[key] || DEFAULT_PAGE_MAP[key] : null;
            const href = mapped
              ? `/${mapped.topicSlug || topicSlug}/${mapped.slug}`
              : item.url || '#';
            const label = item.label || (mapped ? mapped.title : 'Bài viết liên quan');
            const coverUrl =
              item.cover_url ||
              item.thumbnail_url ||
              mapped?.cover_url ||
              (mapped?.slug ? `/images/lessons/${mapped.slug}.jpg` : null) ||
              `/images/topics/${topicSlug || 'cot-song'}.png`;

            return (
              <a
                key={idx}
                href={href}
                onClick={playTapSound}
                className="w-[235px] sm:w-[260px] shrink-0 snap-start flex flex-col bg-white dark:bg-[#150F2E] rounded-[18px] border border-slate-200/90 dark:border-purple-900/50 p-2 shadow-xs hover:shadow-md hover:border-blue-500/50 dark:hover:border-purple-500/50 transition-all active:scale-[0.98] group cursor-pointer"
              >
                {/* 1. Khung video 16:9 to rõ, nổi bật chuẩn player */}
                <div className="relative w-full aspect-video rounded-[12px] overflow-hidden bg-slate-950 shadow-2xs border border-slate-200/60 dark:border-purple-800/40">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverUrl}
                    alt={label}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/topics/cot-song.png';
                    }}
                  />
                  {/* Lớp phủ dốc tương phản */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  {/* Huy hiệu BÀI GIẢNG góc trên */}
                  <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded-[4px] bg-black/75 backdrop-blur-xs text-[8.5px] font-black uppercase text-sky-300 tracking-wider">
                    BÀI GIẢNG
                  </div>

                  {/* Nút Play to nổi bật ở chính giữa khung video */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-white/95 text-blue-600 dark:bg-white dark:text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all ring-2 ring-white/60">
                      <Play size={15} fill="currentColor" className="ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* 2. Tiêu đề và nút khám phá dưới khung video */}
                <div className="flex flex-col flex-1 justify-between mt-2 px-1">
                  <h5 className="text-[12.5px] sm:text-[13px] font-extrabold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-sky-300 transition-colors">
                    {label}
                  </h5>
                  <div className="flex items-center justify-between text-[10.5px] font-bold text-blue-600 dark:text-sky-400 mt-2 pt-1 border-t border-slate-100 dark:border-purple-900/30">
                    <span>Khám phá bài học</span>
                    <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    );
  }

  // External links
  return (
    <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20 my-1">
      <h4 className="text-[14px] sm:text-[15px] font-extrabold tracking-[0.6px] text-slate-800 dark:text-purple-200 uppercase px-1">
        LIÊN KẾT NGOÀI
      </h4>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 min-h-[64px] px-4 py-3 bg-white dark:bg-[#160E2E] rounded-[16px] border-[1.5px] border-line dark:border-purple-900/40 hover:border-primary/50 transition-all active:scale-[0.99] shadow-xs group"
          >
            <span className="text-[15px] sm:text-[16px] font-bold text-primary dark:text-[#F8DF7B] leading-snug truncate">
              {item.label || item.url}
            </span>
            <ExternalLink size={18} className="text-muted dark:text-purple-400 group-hover:text-primary shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
