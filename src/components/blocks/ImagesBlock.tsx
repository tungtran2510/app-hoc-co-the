import React from 'react';
import { Image as ImageType } from '../../lib/types';

interface ImagesBlockProps {
  displayStyle: 'single' | 'gallery';
  images: ImageType[];
  blockId?: string;
}

export default function ImagesBlock({
  displayStyle,
  images,
  blockId,
}: ImagesBlockProps) {
  if (!images || images.length === 0) return null;

  if (displayStyle === 'single') {
    const img = images[0];
    return (
      <div id={blockId} className="w-full flex flex-col gap-2 scroll-mt-20">
        <div className="w-full overflow-hidden rounded-[22px] bg-line/50 border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt || img.caption || 'Hình ảnh'}
            className="w-full h-auto object-cover max-h-[400px]"
            loading="lazy"
          />
        </div>
        {img.caption && (
          <p className="text-[15px] text-muted text-center italic px-2">
            {img.caption}
          </p>
        )}
      </div>
    );
  }

  // Gallery (2-column grid)
  return (
    <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20">
      <div className="grid grid-cols-2 gap-3">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="flex flex-col gap-1.5"
          >
            <div className="aspect-square w-full rounded-[18px] overflow-hidden bg-line/50 border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumb_url || img.url}
                alt={img.alt || img.caption || `Hình ${idx + 1}`}
                className="w-full h-full object-cover transition-transform active:scale-95"
                loading="lazy"
              />
            </div>
            {img.caption && (
              <p className="text-[14px] text-muted text-center truncate px-1">
                {img.caption}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
