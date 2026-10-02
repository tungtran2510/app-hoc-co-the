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
  title?: string;
  titleColor?: string;
  mode?: 'text' | 'html';
  html?: string;
  fontSize?: string;
  textColor?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
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

function sanitizeHtml(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '');
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
  title,
  titleColor,
  mode = 'text',
  html,
  fontSize,
  textColor,
  textAlign,
}: TextBlockProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);

  const style = getBlockStyle(displayStyle);

  // Xác định cỡ chữ: ưu tiên cấu hình riêng của khối (fontSize), nếu không có thì theo fontSizeMode chung của trang
  const resolvedTextSizeClass = (() => {
    if (fontSize) {
      if (fontSize === 'small' || fontSize === '14px') return 'text-[14px] sm:text-[15px] leading-[1.55]';
      if (fontSize === 'normal' || fontSize === '16px') return 'text-[16px] sm:text-[17px] leading-[1.6]';
      if (fontSize === 'large' || fontSize === '18px') return 'text-[18px] sm:text-[19px] leading-[1.65]';
      if (fontSize === 'xlarge' || fontSize === '21px') return 'text-[21px] sm:text-[22px] leading-[1.7]';
    }
    return fontSizeMode === 'small'
      ? 'text-[16px] leading-[1.5]'
      : fontSizeMode === 'large'
      ? 'text-[22px] leading-[1.65]'
      : 'text-[19px] leading-[1.6]';
  })();

  const textSizeClass = resolvedTextSizeClass;

  const contentCustomStyle: React.CSSProperties = {
    ...(textColor ? { color: textColor } : {}),
    ...(textAlign ? { textAlign } : {}),
    ...(fontSize && !['small', 'normal', 'large', 'xlarge', '14px', '16px', '18px', '21px'].includes(fontSize)
      ? { fontSize }
      : {}),
  };

  // Khối HTML tùy biến
  if (mode === 'html' || displayStyle === 'html') {
    const rawHtml = html || lines.join('\n');
    return (
      <div id={blockId} className="w-full scroll-mt-20 flex flex-col gap-2.5">
        {title && (
          <h3
            className="text-[19px] sm:text-[21px] font-extrabold tracking-tight m-0"
            style={{ color: titleColor || '#1E3A8A' }}
          >
            {title}
          </h3>
        )}

        <div
          className={`w-full overflow-hidden text-ink leading-relaxed ${resolvedTextSizeClass} qbiz-custom-html-block`}
          style={contentCustomStyle}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(rawHtml) }}
        />

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

  // Kiểu van_ban: không có thẻ, không nhãn, chỉ đoạn văn màu ink-2
  if (displayStyle === 'van_ban' || !style.label) {
    return (
      <div id={blockId} className="w-full scroll-mt-20 flex flex-col gap-2.5">
        {title && (
          <h3
            className="text-[19px] sm:text-[21px] font-extrabold tracking-tight m-0"
            style={{ color: titleColor || '#1E3A8A' }}
          >
            {title}
          </h3>
        )}
        {lines.map((line, idx) => (
          <p key={idx} className={`font-normal text-ink-2 ${textSizeClass} m-0`} style={contentCustomStyle}>
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
      className="w-full rounded-[22px] p-[18px] flex flex-col gap-2.5 transition-colors scroll-mt-20 block-styled-card"
      style={{
        backgroundColor: style.bg || '#F1F5F9',
      }}
    >
      {/* Đầu thẻ: icon + nhãn IN HOA hoặc tiêu đề tùy biến */}
      <div
        className="flex items-center gap-2 font-extrabold text-[15px] sm:text-[16px] tracking-[0.5px]"
        style={{ color: titleColor || style.fg }}
      >
        <IconComponent size={24} strokeWidth={2.5} />
        <span>{title ? title : style.label}</span>
      </div>

      {/* Nội dung chữ */}
      <div className={`flex flex-col gap-2 font-normal ${textSizeClass}`} style={{ color: textColor || undefined, ...contentCustomStyle }}>
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
