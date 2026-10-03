'use client';

import React, { useState } from 'react';
import { Crop, ZoomIn } from 'lucide-react';
import { useImageAspectRatio } from '../../lib/imageAspectRatio';
import ImageCropModal, { AspectRatioOption } from './ImageCropModal';

interface CropOverlayTriggerProps {
  imageUrl: string | null | undefined;
  alt?: string;
  className?: string;
  imageClassName?: string;
  defaultAspect?: AspectRatioOption;
  title?: string;
  showBadge?: boolean;
  onCropSaved: (newUrl: string) => Promise<void> | void;
  children?: React.ReactNode;
}

export default function CropOverlayTrigger({
  imageUrl,
  alt = 'Hình ảnh',
  className = '',
  imageClassName = 'w-full h-full object-cover',
  defaultAspect = 'auto',
  title = 'Cắt & Căn Khung Ảnh',
  showBadge = true,
  onCropSaved,
  children,
}: CropOverlayTriggerProps) {
  const [isCropOpen, setIsCropOpen] = useState(false);
  const { dimensions } = useImageAspectRatio(imageUrl);

  if (!imageUrl) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        className={`relative group cursor-pointer overflow-hidden ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          setIsCropOpen(true);
        }}
        title="Nhấn vào ảnh để kéo trượt cắt khung vừa ý"
      >
        {children ? (
          children
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={alt} className={imageClassName} />
        )}

        {/* LỚP PHỦ HOVER/TAP VỚI NÚT CẮT KHUNG */}
        <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <div className="px-2.5 py-1.5 rounded-[8px] bg-amber-400 text-slate-950 font-black text-[11px] shadow-lg flex items-center gap-1.5 transform scale-95 group-hover:scale-100 transition-transform">
            <Crop size={13} strokeWidth={2.5} />
            <span>Cắt khung</span>
          </div>
        </div>

        {/* BADGE TỰ ĐỘNG NHẬN DIỆN TỶ LỆ KHUNG GỐC (DỌC, VUÔNG, NGANG) */}
        {showBadge && dimensions && (
          <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded-[4px] bg-black/75 text-amber-300 font-black text-[8.5px] uppercase tracking-wider pointer-events-none drop-shadow-xs">
            {dimensions.label.split(' ')[0]}
          </div>
        )}
      </div>

      {/* MODAL CẮT ẢNH */}
      {isCropOpen && (
        <ImageCropModal
          isOpen={isCropOpen}
          imageUrl={imageUrl}
          title={title}
          defaultAspect={defaultAspect}
          onClose={() => setIsCropOpen(false)}
          onCropSaved={async (newUrl) => {
            await onCropSaved(newUrl);
            setIsCropOpen(false);
          }}
        />
      )}
    </>
  );
}
