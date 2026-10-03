'use client';

import React, { useState } from 'react';
import { Image as ImageType } from '../../lib/types';
import Lightbox from '../Lightbox';
import { useImageAspectRatio } from '../../lib/imageAspectRatio';

interface ImagesBlockProps {
  displayStyle: 'single' | 'gallery';
  images: ImageType[];
  blockId?: string;
}

function GalleryImageItem({
  img,
  idx,
  onClick,
}: {
  img: ImageType;
  idx: number;
  onClick: () => void;
}) {
  const { dimensions } = useImageAspectRatio(img.thumb_url || img.url);
  const aspectClass = dimensions?.aspectClass || 'aspect-square';

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onClick={onClick}
        className={`${aspectClass} w-full rounded-[18px] overflow-hidden bg-line/50 border border-line cursor-zoom-in group transition-transform active:scale-95 relative`}
        role="button"
        tabIndex={0}
        aria-label={`Chạm để phóng to ảnh ${idx + 1}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onClick();
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.thumb_url || img.url}
          alt={img.alt || img.caption || `Hình ${idx + 1}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        {dimensions && (
          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-[4px] bg-black/60 text-white text-[9px] font-bold pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {dimensions.label.split(' ')[0]}
          </span>
        )}
      </div>
      {img.caption && (
        <p className="text-[14px] text-muted text-center truncate px-1">
          {img.caption}
        </p>
      )}
    </div>
  );
}

function SingleImageItem({
  img,
  onClick,
}: {
  img: ImageType;
  onClick: () => void;
}) {
  const { dimensions } = useImageAspectRatio(img.url);
  const aspectClass = dimensions ? (dimensions.orientation === 'portrait' ? 'max-h-[500px]' : 'max-h-[420px]') : 'max-h-[400px]';

  return (
    <div
      onClick={onClick}
      className="w-full overflow-hidden rounded-[22px] bg-line/50 border border-line cursor-zoom-in group transition-transform active:scale-[0.99] flex items-center justify-center relative"
      role="button"
      tabIndex={0}
      aria-label="Chạm để phóng to ảnh"
      onKeyDown={(e) => {
        if (e.key === 'Enter') onClick();
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={img.url}
        alt={img.alt || img.caption || 'Hình ảnh'}
        className={`w-full h-auto object-contain ${aspectClass} group-hover:opacity-95 transition-opacity`}
        loading="lazy"
      />
    </div>
  );
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
        <SingleImageItem img={img} onClick={() => handleOpenLightbox(0)} />
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

  // Gallery (2-column grid with adaptive image aspect ratio)
  return (
    <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20">
      <div className="grid grid-cols-2 gap-3 items-start">
        {images.map((img, idx) => (
          <GalleryImageItem
            key={idx}
            img={img}
            idx={idx}
            onClick={() => handleOpenLightbox(idx)}
          />
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
