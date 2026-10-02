import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';

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
      <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20 my-1">
        <h4 className="text-[14px] sm:text-[15px] font-extrabold tracking-[0.6px] text-slate-800 dark:text-purple-200 uppercase px-1">
          BÀI LIÊN QUAN
        </h4>

        <div className="flex flex-col gap-2">
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
              <Link
                key={idx}
                href={href}
                className="flex items-center justify-between gap-3 min-h-[64px] px-3.5 py-2.5 bg-white dark:bg-[#160E2E] rounded-[16px] border-[1.5px] border-line dark:border-purple-900/40 hover:border-primary/50 dark:hover:border-purple-500/50 transition-all active:scale-[0.99] shadow-xs group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail ảnh đại diện sắc nét của từng bài học */}
                  <div className="w-14 h-10 sm:w-16 sm:h-11 rounded-[10px] overflow-hidden shrink-0 border border-slate-200/90 dark:border-purple-800/40 bg-slate-100 dark:bg-purple-950/40 shadow-2xs relative flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={coverUrl}
                      alt={label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/topics/cot-song.png';
                      }}
                    />
                  </div>
                  <span className="text-[15px] sm:text-[16px] font-bold text-ink dark:text-white leading-snug truncate group-hover:text-primary dark:group-hover:text-[#F8DF7B] transition-colors">
                    {label}
                  </span>
                </div>
                <ChevronRight size={20} className="text-muted dark:text-purple-400 group-hover:text-primary dark:group-hover:text-[#F8DF7B] group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
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
