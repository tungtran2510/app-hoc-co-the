'use client';

import React, { useState } from 'react';
import { Image as ImageType } from '../../lib/types';
import Lightbox from '../Lightbox';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const handleOpenLightbox = (index: number) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  if (displayStyle === 'single') {
    const img = images[0];
    return (
      <div id={blockId} className="w-full flex flex-col gap-2 scroll-mt-20">
        <div
          onClick={() => handleOpenLightbox(0)}
          className="w-full overflow-hidden rounded-[22px] bg-line/50 border border-line cursor-zoom-in group transition-transform active:scale-[0.99]"
          role="button"
          tabIndex={0}
          aria-label="Chạm để phóng to ảnh"
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleOpenLightbox(0);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.url}
            alt={img.alt || img.caption || 'Hình ảnh'}
            className="w-full h-auto object-cover max-h-[400px] group-hover:opacity-95 transition-opacity"
            loading="lazy"
          />
        </div>
        {img.caption && (
          <p className="text-[15px] text-muted text-center italic px-2">
            {img.caption}
          </p>
        )}

        <Lightbox
          isOpen={lightboxOpen}
          images={images}
          initialIndex={selectedIndex}
          onClose={() => setLightboxOpen(false)}
        />
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
            <div
              onClick={() => handleOpenLightbox(idx)}
              className="aspect-square w-full rounded-[18px] overflow-hidden bg-line/50 border border-line cursor-zoom-in group transition-transform active:scale-95"
              role="button"
              tabIndex={0}
              aria-label={`Chạm để phóng to ảnh ${idx + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleOpenLightbox(idx);
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.thumb_url || img.url}
                alt={img.alt || img.caption || `Hình ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
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

      <Lightbox
        isOpen={lightboxOpen}
        images={images}
        initialIndex={selectedIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
