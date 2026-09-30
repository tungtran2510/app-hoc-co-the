import React, { useState } from 'react';
import {
  Lightbulb,
  SquareCheck,
  TriangleAlert,
  CircleX,
  Wrench,
  FileText,
  LucideIcon,
  Download,
  ExternalLink,
  Play,
} from 'lucide-react';
import { getBlockStyle } from '../../lib/blockStyles';
import { Image as ImageType, FileItem, Video } from '../../lib/types';
import { FontSizeOption } from '../PageHeaderBar';
import Lightbox from '../Lightbox';

interface TextBlockProps {
  displayStyle: string;
  lines: string[];
  format?: 'paragraph' | 'numbered' | 'bullet';
  fontSizeMode?: FontSizeOption;
  blockId?: string;
  images?: ImageType[];
  files?: FileItem[];
  videos?: Video[];
}

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  SquareCheck,
  TriangleAlert,
  CircleX,
  Wrench,
  FileText,
};

// Helper: parse **bold** text safely without HTML injection
function renderFormattedLine(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-extrabold text-ink">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default function TextBlock({
  displayStyle,
  lines,
  format = 'paragraph',
  fontSizeMode = 'normal',
  blockId,
  images,
  files,
  videos,
}: TextBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const style = getBlockStyle(displayStyle);

  // 3 Cỡ chữ: Nhỏ (16px), Vừa (19px), Lớn (22px)
  const textSizeClass =
    fontSizeMode === 'small'
      ? 'text-[16px] leading-[1.5]'
      : fontSizeMode === 'large'
      ? 'text-[22px] leading-[1.65]'
      : 'text-[19px] leading-[1.6]';

  // Kiểu van_ban: không có thẻ, không nhãn, chỉ đoạn văn màu ink-2
  if (displayStyle === 'van_ban' || !style.label) {
    return (
      <div id={blockId} className="w-full scroll-mt-20 flex flex-col gap-3">
        {lines.map((line, idx) => (
          <p key={idx} className={`font-normal text-ink-2 ${textSizeClass} m-0`}>
            {renderFormattedLine(line)}
          </p>
        ))}

        {/* Đính kèm ảnh nếu có */}
        {images && images.length > 0 && (
          <div className="flex flex-col gap-2 mt-2">
            {images.map((img, i) => (
              <div
                key={i}
                onClick={() => {
                  setSelectedImgIndex(i);
                  setLightboxOpen(true);
                }}
                className="rounded-[16px] overflow-hidden border border-line bg-white cursor-zoom-in group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.url}
                  alt={img.caption || ''}
                  className="w-full h-auto object-cover max-h-[300px] group-hover:opacity-95 transition-opacity"
                />
                {img.caption && <p className="text-[13px] text-muted italic p-2 text-center">{img.caption}</p>}
              </div>
            ))}
          </div>
        )}

        {images && images.length > 0 && (
          <Lightbox
            isOpen={lightboxOpen}
            images={images}
            initialIndex={selectedImgIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </div>
    );
  }

  const IconComponent = style.icon ? ICON_MAP[style.icon] || FileText : FileText;

  return (
    <div
      id={blockId}
      className="w-full rounded-[22px] p-[18px] flex flex-col gap-2.5 transition-colors scroll-mt-20"
      style={{
        backgroundColor: style.bg || '#F1EEE6',
      }}
    >
      {/* Đầu thẻ: icon + nhãn IN HOA */}
      <div
        className="flex items-center gap-2 font-extrabold text-[15px] sm:text-[16px] tracking-[0.5px]"
        style={{ color: style.fg }}
      >
        <IconComponent size={24} strokeWidth={2.5} />
        <span>{style.label}</span>
      </div>

      {/* Nội dung chữ */}
      <div className={`flex flex-col gap-2 text-ink font-normal ${textSizeClass}`}>
        {format === 'numbered' && (
          <ol className="flex flex-col gap-1.5 list-none p-0 m-0">
            {lines.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="font-bold text-ink shrink-0">{idx + 1}.</span>
                <span>{renderFormattedLine(line)}</span>
              </li>
            ))}
          </ol>
        )}

        {format === 'bullet' && (
          <ul className="flex flex-col gap-1.5 list-none p-0 m-0">
            {lines.map((line, idx) => (
              <li key={idx} className="flex gap-2.5">
                <span className="shrink-0 text-ink text-[16px] leading-relaxed">•</span>
                <span>{renderFormattedLine(line)}</span>
              </li>
            ))}
          </ul>
        )}

        {format === 'paragraph' &&
          lines.map((line, idx) => (
            <p key={idx} className="m-0">
              {renderFormattedLine(line)}
            </p>
          ))}
      </div>

      {/* Đính kèm ảnh nếu có */}
      {images && images.length > 0 && (
        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-line/40">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedImgIndex(i);
                setLightboxOpen(true);
              }}
              className="rounded-[14px] overflow-hidden border border-line bg-white shadow-xs cursor-zoom-in group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.caption || ''}
                className="w-full h-auto object-cover max-h-[260px] group-hover:opacity-95 transition-opacity"
              />
              {img.caption && <p className="text-[13px] text-muted italic px-2.5 py-1.5">{img.caption}</p>}
            </div>
          ))}
        </div>
      )}

      {images && images.length > 0 && (
        <Lightbox
          isOpen={lightboxOpen}
          images={images}
          initialIndex={selectedImgIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Đính kèm file PDF nếu có */}
      {files && files.length > 0 && (
        <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-line/40">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-[12px] bg-white border border-line">
              <span className="text-[14px] font-bold text-ink truncate pr-2">{file.name}</span>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-3 rounded-[8px] bg-primary text-white text-[13px] font-bold flex items-center gap-1 shrink-0"
              >
                <ExternalLink size={13} />
                <span>Xem</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Đính kèm video nếu có */}
      {videos && videos.length > 0 && (
        <div className="flex flex-col gap-2 mt-1 pt-2 border-t border-line/40">
          {videos.map((vid, i) => (
            <div key={i} className="rounded-[14px] overflow-hidden bg-ink aspect-video relative flex items-center justify-center">
              {vid.youtube_id ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${vid.youtube_id}?rel=0&playsinline=1`}
                  title={vid.title}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              ) : (
                <div className="text-white text-[14px] font-bold">{vid.title}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
