'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Sparkles,
  Check,
  Loader2,
  RefreshCw,
  Maximize2,
  Sliders,
} from 'lucide-react';
import { classifyImageRatio, ImageDimensions, detectImageDimensions } from '../../lib/imageAspectRatio';
import { uploadImageFile } from '../../lib/storageUpload';

export type AspectRatioOption = 'auto' | '1:1' | '3:4' | '16:9' | '4:3' | 'free';

interface ImageCropModalProps {
  isOpen: boolean;
  imageUrl: string | null;
  title?: string;
  defaultAspect?: AspectRatioOption;
  onClose: () => void;
  onCropSaved: (newUrl: string) => Promise<void> | void;
}

export default function ImageCropModal({
  isOpen,
  imageUrl,
  title = 'Cắt & Căn Khung Ảnh',
  defaultAspect = 'auto',
  onClose,
  onCropSaved,
}: ImageCropModalProps) {
  const [scale, setScale] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [selectedAspect, setSelectedAspect] = useState<AspectRatioOption>(defaultAspect);
  const [detectedRatio, setDetectedRatio] = useState<ImageDimensions | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef<number>(1.0);

  // Reset state when opening or when image changes
  useEffect(() => {
    if (isOpen && imageUrl) {
      setScale(1.0);
      setPan({ x: 0, y: 0 });
      setRotation(0);
      setSelectedAspect(defaultAspect);
      setImageLoaded(false);
      setErrorMsg('');

      detectImageDimensions(imageUrl).then((dim) => {
        setDetectedRatio(dim);
      });
    }
  }, [isOpen, imageUrl, defaultAspect]);

  // Keyboard navigation (Esc to close)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  // Tính tỷ lệ số cho khung cắt (Width / Height)
  const getAspectRatioNumeric = (): number => {
    switch (selectedAspect) {
      case '1:1':
        return 1.0;
      case '3:4':
        return 3 / 4;
      case '16:9':
        return 16 / 9;
      case '4:3':
        return 4 / 3;
      case 'auto':
        return detectedRatio ? detectedRatio.ratio : 1.0;
      case 'free':
      default:
        return detectedRatio ? detectedRatio.ratio : 1.0;
    }
  };

  // Kích thước của khung cắt trong viewport (Crop Viewport Box)
  const computeCropBoxStyle = () => {
    const ratio = getAspectRatioNumeric();
    // Max container dimensions inside modal: width ~ 360-440px, height ~ 360px
    const maxW = 340;
    const maxH = 340;

    let boxW = maxW;
    let boxH = maxW / ratio;

    if (boxH > maxH) {
      boxH = maxH;
      boxW = maxH * ratio;
    }

    return {
      width: `${Math.round(boxW)}px`,
      height: `${Math.round(boxH)}px`,
    };
  };

  // Zoom handlers
  const handleZoomChange = (newScale: number) => {
    const clamped = Math.min(Math.max(newScale, 0.8), 3.5);
    setScale(Number(clamped.toFixed(2)));
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1.0);
    setPan({ x: 0, y: 0 });
    setRotation(0);
  };

  // Pointer drag events for Pan
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag with primary mouse button or touch
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    initialPanRef.current = { ...pan };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: initialPanRef.current.x + dx,
      y: initialPanRef.current.y + dy,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Touch Pinch to Zoom on mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchStartDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = dist / pinchStartDistRef.current;
      handleZoomChange(pinchStartScaleRef.current * factor);
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
  };

  // THỰC HIỆN CẮT ẢNH QUA CANVAS VÀ TẢI LÊN STORAGE
  const handleCropAndSave = async () => {
    const img = imgRef.current;
    if (!img) return;

    try {
      setIsProcessing(true);
      setErrorMsg('');

      // Lấy kích thước thật của ảnh
      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      const cropBoxElem = document.getElementById('qbiz-crop-box');
      if (!cropBoxElem) throw new Error('Không tìm thấy khung cắt.');

      const cropRect = cropBoxElem.getBoundingClientRect();
      const imgRect = img.getBoundingClientRect();

      // Tính tỷ lệ hiển thị giữa kích thước thật của ảnh và kích thước trên màn hình
      const scaleX = naturalW / (imgRect.width / scale);
      const scaleY = naturalH / (imgRect.height / scale);

      // Điểm gốc của khung cắt so với ảnh
      const originX = (cropRect.left - imgRect.left) * (naturalW / imgRect.width);
      const originY = (cropRect.top - imgRect.top) * (naturalH / imgRect.height);

      const targetCropW = cropRect.width * (naturalW / imgRect.width);
      const targetCropH = cropRect.height * (naturalH / imgRect.height);

      // Tạo Canvas để render vùng cắt
      const canvas = document.createElement('canvas');
      const maxOutputDim = 1600;
      let outW = Math.round(targetCropW);
      let outH = Math.round(targetCropH);

      if (outW > maxOutputDim || outH > maxOutputDim) {
        if (outW > outH) {
          outH = Math.round((outH * maxOutputDim) / outW);
          outW = maxOutputDim;
        } else {
          outW = Math.round((outW * maxOutputDim) / outH);
          outH = maxOutputDim;
        }
      }

      // Đảm bảo kích thước tối thiểu
      outW = Math.max(100, outW);
      outH = Math.max(100, outH);

      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Không thể khởi tạo Canvas 2D.');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Xử lý xoay ảnh nếu có
      if (rotation !== 0) {
        ctx.save();
        ctx.translate(outW / 2, outH / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-outW / 2, -outH / 2);
      }

      // Vẽ phần ảnh nằm trong khung cắt
      ctx.drawImage(
        img,
        Math.max(0, originX),
        Math.max(0, originY),
        Math.min(naturalW, targetCropW),
        Math.min(naturalH, targetCropH),
        0,
        0,
        outW,
        outH
      );

      if (rotation !== 0) {
        ctx.restore();
      }

      // Xuất Blob WebP
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Xuất file ảnh từ canvas thất bại.'));
          },
          'image/webp',
          0.88
        );
      });

      // Tạo file và upload qua storageUpload
      const file = new File([blob], `cropped-${Date.now()}.webp`, { type: 'image/webp' });
      const uploadRes = await uploadImageFile(file);

      if (!uploadRes || !uploadRes.url) {
        throw new Error('Chưa nhận được URL ảnh sau khi tải lên.');
      }

      await onCropSaved(uploadRes.url);
      onClose();
    } catch (err: any) {
      console.error('Lỗi khi cắt và tải ảnh:', err);
      setErrorMsg(err.message || 'Lỗi khi cắt và xử lý ảnh. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  const cropBoxDim = computeCropBoxStyle();

  return (
    <div className="fixed inset-0 z-[150] bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-[#0B132B] rounded-[24px] border border-slate-700/60 shadow-2xl overflow-hidden flex flex-col max-h-[96vh] my-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER MODAL */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-800 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0B132B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-[10px] bg-slate-800 text-amber-300 flex items-center justify-center shadow-xs shrink-0 border border-slate-700">
              <Crop size={17} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15.5px] font-bold text-white leading-tight truncate">
                {title}
              </h3>
              <p className="text-[11.5px] text-slate-400 truncate flex items-center gap-1.5">
                <span>Kéo trượt phóng to, di chuyển tâm ảnh & chọn tỷ lệ</span>
                {detectedRatio && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold border border-amber-400/30">
                    Gốc: {detectedRatio.label} ({detectedRatio.width}×{detectedRatio.height}px)
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X size={18} />
          </button>
        </div>

        {/* THÔNG BÁO LỖI NẾU CÓ */}
        {errorMsg && (
          <div className="px-4 py-2 bg-red-950/80 border-b border-red-500/40 text-red-200 text-[12px] font-bold flex items-center justify-between">
            <span>{errorMsg}</span>
            <button type="button" onClick={() => setErrorMsg('')} className="text-red-300 font-bold ml-2">×</button>
          </div>
        )}

        {/* VÙNG KHÔNG GIAN CẮT ẢNH TƯƠNG TÁC (CROP VIEWPORT) */}
        <div
          ref={containerRef}
          className="relative w-full h-[320px] sm:h-[360px] bg-[#030712] overflow-hidden flex items-center justify-center select-none cursor-grab active:cursor-grabbing touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Lớp nền lưới caro chìm */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 1px, transparent 1px)',
              backgroundSize: '16px 16px',
            }}
          />

          {/* ẢNH ĐƯỢC PHÓNG TO / KÉO / XOAY BÊN TRONG */}
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              transition: isDraggingRef.current ? 'none' : 'transform 0.12s ease-out',
            }}
            className="relative flex items-center justify-center pointer-events-none"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Cắt ảnh"
              crossOrigin="anonymous"
              onLoad={() => setImageLoaded(true)}
              className="max-w-[420px] max-h-[380px] object-contain shadow-2xl select-none"
              draggable={false}
            />
          </div>

          {/* LỚP PHỦ TỐI XUNG QUANH KHUNG CẮT */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* KHUNG CẮT ĐƯỢC LỌC SÁNG CHÍNH GIỮA */}
            <div
              id="qbiz-crop-box"
              style={{
                width: cropBoxDim.width,
                height: cropBoxDim.height,
              }}
              className="relative rounded-[8px] border-2 border-amber-400 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] pointer-events-none transition-all duration-200"
            >
              {/* ĐƯỜNG LƯỚI NGUYÊN TẮC 1/3 (RULE OF THIRDS) */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                <div className="border-r border-b border-white/50" />
                <div className="border-r border-b border-white/50" />
                <div className="border-b border-white/50" />
                <div className="border-r border-b border-white/50" />
                <div className="border-r border-b border-white/50" />
                <div className="border-b border-white/50" />
                <div className="border-r border-white/50" />
                <div className="border-r border-white/50" />
                <div />
              </div>

              {/* 4 GÓC CĂN KHUNG VÀNG SẮC NÉT */}
              <div className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 border-t-3 border-l-3 border-amber-300" />
              <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 border-t-3 border-r-3 border-amber-300" />
              <div className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 border-b-3 border-l-3 border-amber-300" />
              <div className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 border-b-3 border-r-3 border-amber-300" />

              {/* BADGE TỶ LỆ TRÊN KHUNG */}
              <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-[4px] bg-black/75 text-amber-300 font-black text-[10px] uppercase tracking-wide">
                {selectedAspect === 'auto'
                  ? `Tự nhận diện: ${detectedRatio?.label || 'Chuẩn'}`
                  : `Tỷ lệ: ${selectedAspect}`}
              </div>
            </div>
          </div>
        </div>

        {/* BẢNG ĐIỀU KHIỂN: NÚT KÉO TRƯỢT PHÓNG TO, XOAY, VÀ CHỌN TỶ LỆ */}
        <div className="p-3.5 sm:p-4 bg-[#0F172A] border-t border-slate-800 space-y-3 shrink-0">
          {/* HÀNG 1: THANH KÉO TRƯỢT (SLIDER) PHÓNG TO / THU NHỎ */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleZoomChange(scale - 0.15)}
              className="w-8 h-8 rounded-[8px] bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-slate-700"
              title="Thu nhỏ"
            >
              <ZoomOut size={15} />
            </button>

            <div className="flex-1 flex items-center gap-2">
              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.02"
                value={scale}
                onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-hidden"
              />
              <span className="w-12 text-right text-[12px] font-bold text-amber-300 font-mono shrink-0">
                {Math.round(scale * 100)}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleZoomChange(scale + 0.15)}
              className="w-8 h-8 rounded-[8px] bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0 border border-slate-700"
              title="Phóng to"
            >
              <ZoomIn size={15} />
            </button>

            {/* Nút Xoay ảnh 90 độ */}
            <button
              type="button"
              onClick={handleRotate}
              className="h-8 px-2.5 rounded-[8px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 ml-1 border border-slate-700"
              title="Xoay 90 độ"
            >
              <RotateCw size={13} />
              <span className="hidden sm:inline">Xoay 90°</span>
            </button>

            {/* Nút Đặt lại vị trí */}
            <button
              type="button"
              onClick={handleReset}
              className="h-8 px-2.5 rounded-[8px] bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0 border border-slate-700"
              title="Đặt lại vị trí ban đầu"
            >
              <RefreshCw size={12} />
              <span className="hidden sm:inline">Đặt lại</span>
            </button>
          </div>

          {/* HÀNG 2: BỘ CHỌN NHANH TỶ LỆ KHUNG HÌNH (ASPECT RATIO PRESETS) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>Chọn tỷ lệ khung hình căn chỉnh:</span>
              <span className="text-[10px] text-amber-300/80 italic">Chạm vào ảnh để kéo di chuyển</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[
                { key: 'auto', label: 'Tự động', desc: detectedRatio?.label || 'Gốc' },
                { key: '3:4', label: '3:4 Dọc', desc: 'Bìa sách / Đứng' },
                { key: '1:1', label: '1:1 Vuông', desc: 'Avatar / Vuông' },
                { key: '16:9', label: '16:9 Ngang', desc: 'Banner / Nền' },
                { key: '4:3', label: '4:3 Ngang', desc: 'Tư liệu' },
              ].map((opt) => {
                const isSelected = selectedAspect === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => {
                      setSelectedAspect(opt.key as AspectRatioOption);
                      setPan({ x: 0, y: 0 });
                    }}
                    className={`py-1.5 px-1 rounded-[10px] border flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-md shadow-amber-400/20'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <span className="text-[11.5px] leading-tight">{opt.label}</span>
                    <span className={`text-[9px] leading-tight truncate w-full text-center ${isSelected ? 'text-slate-900' : 'text-slate-400'}`}>
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-t border-slate-800 bg-[#0B132B] flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="h-9 px-4 rounded-[10px] bg-slate-800 hover:bg-slate-700 text-slate-200 text-[12.5px] font-semibold transition-colors cursor-pointer disabled:opacity-50 border border-slate-700"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleCropAndSave}
            disabled={isProcessing || !imageLoaded}
            className="h-9.5 px-5 rounded-[10px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-[13px] flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={16} className="animate-spin text-slate-950" />
                <span>Đang cắt & tải ảnh lên...</span>
              </>
            ) : (
              <>
                <Check size={16} strokeWidth={2.5} />
                <span>Cắt & Áp Dụng Khung Này</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
