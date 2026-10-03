'use client';

import React from 'react';
import { useImageAspectRatio } from '../lib/imageAspectRatio';

interface AdaptiveImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  onClick?: () => void;
}

export default function AdaptiveImage({
  src,
  alt = 'Hình ảnh',
  className = '',
  containerClassName = '',
  onClick,
}: AdaptiveImageProps) {
  const { dimensions } = useImageAspectRatio(src);

  // Mặc định class container dựa trên tỷ lệ tự động nhận diện
  const aspectClass = dimensions?.aspectClass || 'aspect-auto';

  return (
    <div
      onClick={onClick}
      className={`relative w-full overflow-hidden rounded-[16px] bg-slate-100 dark:bg-slate-800/40 border border-line ${aspectClass} ${containerClassName}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`w-full h-full object-cover transition-opacity duration-300 ${className}`}
      />
    </div>
  );
}
