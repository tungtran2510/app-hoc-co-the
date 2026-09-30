import React from 'react';
import Link from 'next/link';
import { ChevronRight, ExternalLink } from 'lucide-react';
import SpineIllustration from '../SpineIllustration';

interface LinkItem {
  page_id?: string;
  url?: string;
  label?: string;
  slug?: string;
}

interface LinksBlockProps {
  displayStyle: 'related' | 'external';
  items: LinkItem[];
  pageSlugMap?: Record<string, { slug: string; topicSlug: string; title: string }>;
  blockId?: string;
}

const DEFAULT_PAGE_MAP: Record<string, { slug: string; topicSlug: string; title: string }> = {
  'page-cot-song-1': { slug: 'tong-quan-ve-cot-song', topicSlug: 'cot-song', title: 'Cột sống · 01 Tổng quan về cột sống' },
  'page-cot-song-2': { slug: 'dia-dem', topicSlug: 'cot-song', title: 'Cột sống · 02 Đĩa đệm' },
  'page-cot-song-3': { slug: 'co-gan-day-chang', topicSlug: 'cot-song', title: 'Cột sống · 03 Cơ – gân – dây chằng' },
  'page-cot-song-4': { slug: 'than-kinh', topicSlug: 'cot-song', title: 'Cột sống · 04 Thần kinh' },
  'page-cot-song-5': { slug: 'tu-the-va-van-dong', topicSlug: 'cot-song', title: 'Cột sống · 05 Tư thế và vận động' },
  'page-cot-song-6': { slug: 'cac-van-de-thuong-gap', topicSlug: 'cot-song', title: 'Cột sống · 06 Các vấn đề thường gặp' },
};

export default function LinksBlock({
  displayStyle,
  items,
  pageSlugMap = DEFAULT_PAGE_MAP,
  blockId,
}: LinksBlockProps) {
  if (!items || items.length === 0) return null;

  if (displayStyle === 'related') {
    return (
      <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20">
        <h4 className="text-[15px] sm:text-[16px] font-extrabold tracking-[0.5px] text-ink uppercase px-1">
          BÀI LIÊN QUAN
        </h4>

        <div className="flex flex-col gap-2">
          {items.map((item, idx) => {
            const mapped = item.page_id ? pageSlugMap[item.page_id] : null;
            const href = mapped
              ? `/${mapped.topicSlug}/${mapped.slug}`
              : item.url || '#';
            const label = item.label || (mapped ? mapped.title : 'Bài viết liên quan');

            return (
              <Link
                key={idx}
                href={href}
                className="flex items-center justify-between gap-3 min-h-[64px] px-4 py-3 bg-white rounded-[18px] border-[1.5px] border-line transition-transform active:scale-[0.99] shadow-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail nhỏ mô phỏng như ảnh tham khảo */}
                  <div className="w-12 h-9 rounded-lg bg-[#E3ECF7] overflow-hidden shrink-0 flex items-center justify-center">
                    <SpineIllustration className="w-8 h-8 opacity-70" />
                  </div>
                  <span className="text-[17px] sm:text-[18px] font-bold text-ink leading-snug truncate">
                    {label}
                  </span>
                </div>
                <ChevronRight size={22} className="text-muted shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // External links
  return (
    <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20">
      <h4 className="text-[15px] sm:text-[16px] font-extrabold tracking-[0.5px] text-ink uppercase px-1">
        LIÊN KẾT NGOÀI
      </h4>

      <div className="flex flex-col gap-2">
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 min-h-[64px] px-4 py-3 bg-white rounded-[18px] border-[1.5px] border-line transition-transform active:scale-[0.99] shadow-xs"
          >
            <span className="text-[17px] sm:text-[18px] font-bold text-primary leading-snug truncate">
              {item.label || item.url}
            </span>
            <ExternalLink size={20} className="text-muted shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}
