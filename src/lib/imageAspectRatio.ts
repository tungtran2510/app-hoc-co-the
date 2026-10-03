'use client';

import { useState, useEffect } from 'react';

export type ImageOrientation = 'square' | 'portrait' | 'landscape';

export interface ImageDimensions {
  width: number;
  height: number;
  ratio: number;
  orientation: ImageOrientation;
  label: string;
  aspectClass: string;
  recommendedCropRatio: '1:1' | '3:4' | '16:9' | '4:3';
}

/**
 * Tự động phát hiện kích thước và phân loại tỷ lệ ảnh:
 * - Vuông (Square): tỷ lệ W/H trong khoảng 0.88 - 1.15
 * - Dọc (Portrait): tỷ lệ W/H < 0.88 (3:4, 2:3, 9:16)
 * - Ngang (Landscape): tỷ lệ W/H > 1.15 (4:3, 16:9, 21:9)
 */
export function classifyImageRatio(width: number, height: number): ImageDimensions {
  const safeW = Math.max(1, width || 1);
  const safeH = Math.max(1, height || 1);
  const ratio = safeW / safeH;

  if (ratio >= 0.88 && ratio <= 1.15) {
    return {
      width: safeW,
      height: safeH,
      ratio,
      orientation: 'square',
      label: 'Vuông (1:1)',
      aspectClass: 'aspect-square',
      recommendedCropRatio: '1:1',
    };
  }

  if (ratio < 0.88) {
    const isUltraTall = ratio <= 0.65;
    return {
      width: safeW,
      height: safeH,
      ratio,
      orientation: 'portrait',
      label: isUltraTall ? 'Dọc đứng (9:16)' : 'Dọc (3:4)',
      aspectClass: isUltraTall ? 'aspect-[9/16]' : 'aspect-[3/4]',
      recommendedCropRatio: '3:4',
    };
  }

  const isWide = ratio >= 1.55;
  return {
    width: safeW,
    height: safeH,
    ratio,
    orientation: 'landscape',
    label: isWide ? 'Ngang rộng (16:9)' : 'Ngang (4:3)',
    aspectClass: isWide ? 'aspect-video' : 'aspect-[4/3]',
    recommendedCropRatio: isWide ? '16:9' : '4:3',
  };
}

// Bộ nhớ đệm URL để tránh đo nhiều lần một ảnh
const imageDimensionsCache = new Map<string, ImageDimensions>();

/**
 * Tải ảnh và đo kích thước tự nhiên của ảnh
 */
export function detectImageDimensions(src: string): Promise<ImageDimensions> {
  if (!src) {
    return Promise.resolve(classifyImageRatio(1, 1));
  }

  const cached = imageDimensionsCache.get(src);
  if (cached) {
    return Promise.resolve(cached);
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const dim = classifyImageRatio(img.naturalWidth || img.width, img.naturalHeight || img.height);
      imageDimensionsCache.set(src, dim);
      resolve(dim);
    };

    img.onerror = () => {
      // Fallback về tỷ lệ vuông an toàn nếu ảnh lỗi
      const fallback = classifyImageRatio(800, 800);
      resolve(fallback);
    };

    img.src = src;
  });
}

/**
 * React Hook tự động nhận diện tỷ lệ của một ảnh URL
 */
export function useImageAspectRatio(src?: string | null) {
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(() => {
    if (src && imageDimensionsCache.has(src)) {
      return imageDimensionsCache.get(src)!;
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(src && !imageDimensionsCache.has(src)));

  useEffect(() => {
    if (!src) {
      setDimensions(null);
      setIsLoading(false);
      return;
    }

    if (imageDimensionsCache.has(src)) {
      setDimensions(imageDimensionsCache.get(src)!);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    detectImageDimensions(src).then((dim) => {
      if (isMounted) {
        setDimensions(dim);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [src]);

  return { dimensions, isLoading };
}
