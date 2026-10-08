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
import YouTubeEmbed from '../YouTubeEmbed';
import sanitizeLib from 'sanitize-html';

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

const SAFE_TAGS = [
  'h1','h2','h3','h4','h5','h6','p','br','hr','blockquote','pre','code','ul','ol','li',
  'b','i','u','s','strong','em','mark','small','sub','sup','a','img','span','div',
  'table','thead','tbody','tr','td','th','figure','figcaption','section','video','source',
];

export function sanitizeHtml(raw: string): string {
  if (!raw) return '';
  return sanitizeLib(raw, {
    allowedTags: SAFE_TAGS,
    allowedAttributes: {
      '*': ['style', 'class', 'title'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      video: ['src', 'controls', 'poster', 'width', 'height'],
      source: ['src', 'type'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https', 'data'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName: string, attribs: Record<string, string>) => ({
        tagName,
        attribs: { ...attribs, rel: 'noopener noreferrer nofollow' },
      }),
    },
    allowedStyles: {
      '*': {
        color: [/^[#\w(),.\s%-]+$/],
        'background-color': [/^[#\w(),.\s%-]+$/],
        'text-align': [/^(left|right|center|justify)$/],
        'font-size': [/^[\d.]+(px|em|rem|%)$/],
        'font-weight': [/^[\w]+$/],
        'font-style': [/^[\w]+$/],
        'line-height': [/^[\d.]+(px|em|rem|%)?$/],
        'text-decoration': [/^[\w\s-]+$/],
        margin: [/^[\d.\sa-z%-]+$/],
        padding: [/^[\d.\sa-z%-]+$/],
        border: [/^[#\w(),.\s%-]+$/],
        'border-radius': [/^[\d.\sa-z%-]+$/],
        width: [/^[\d.]+(px|em|rem|%|vw)$/],
        'max-width': [/^[\d.]+(px|em|rem|%|vw)$/],
        height: [/^[\d.]+(px|em|rem|%|vh)$/],
        display: [/^(block|inline|inline-block|flex|grid|none)$/],
      },
    },
  });
}

export default function TextBlock({
  displayStyle,
  lines = [],
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

  const safeLines = Array.isArray(lines) ? lines : typeof lines === 'string' ? [lines] : [];
  const style = getBlockStyle(displayStyle);

  // Xác định cỡ chữ: cỡ riêng của khối (nếu có) là cỡ gốc; cỡ chữ chung của trang (Nhỏ/Vừa/Lớn) luôn được cộng thêm lên trên,
  // để nút chỉnh cỡ chữ của người học hoạt động với MỌI khối (kể cả khối đã được chỉnh cỡ riêng).
  const pageFontDelta = 0; // Cỡ chữ toàn trang được áp bằng zoom ở ContentViewer
  const blockBaseFontPx =
    fontSize === 'small' || fontSize === '14px'
      ? 14
      : fontSize === 'normal' || fontSize === '16px'
      ? 16
      : fontSize === 'large' || fontSize === '18px'
      ? 18
      : fontSize === 'xlarge' || fontSize === '21px'
      ? 21
      : 19;
  const resolvedTextSizeClass =
    blockBaseFontPx >= 21
      ? 'leading-[1.7]'
      : blockBaseFontPx >= 18
      ? 'leading-[1.65]'
      : blockBaseFontPx <= 14
      ? 'leading-[1.55]'
      : 'leading-[1.6]';

  const textSizeClass = resolvedTextSizeClass;

  const contentCustomStyle: React.CSSProperties = {
    fontSize: `${blockBaseFontPx + pageFontDelta}px`,
    ...(textColor ? { color: textColor } : {}),
    ...(textAlign ? { textAlign } : {}),
    ...(fontSize && !['small', 'normal', 'large', 'xlarge', '14px', '16px', '18px', '21px'].includes(fontSize)
      ? { fontSize }
      : {}),
  };

  // Khối HTML tùy biến
  if (mode === 'html' || displayStyle === 'html') {
    const rawHtml = html || safeLines.join('\n');
    return (
      <div id={blockId} className="w-full scroll-mt-20 flex flex-col gap-2.5">
        {title && (
          <h3
            className="text-[19px] sm:text-[21px] font-extrabold tracking-tight m-0 text-slate-900 dark:text-white"
            style={titleColor ? { color: titleColor } : undefined}
          >
            {title}
          </h3>
        )}

        {html && safeLines.filter((l) => l && l !== 'Khối nội dung HTML').length > 0 && (
          <div
            className={`w-full text-ink leading-relaxed ${resolvedTextSizeClass} flex flex-col gap-2`}
            style={contentCustomStyle}
          >
            {safeLines
              .filter((l) => l && l !== 'Khối nội dung HTML')
              .map((l, i) => (
                <p key={i} className="m-0 whitespace-pre-wrap">
                  {l}
                </p>
              ))}
          </div>
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
              <div key={i} className="w-full">
                {vid.youtube_id ? (
                  <YouTubeEmbed
                    youtubeId={vid.youtube_id}
                    title={vid.title}
                    showExternalLink={true}
                  />
                ) : (
                  <div className="text-white text-[14px] font-bold p-3 bg-ink rounded-[14px]">{vid.title}</div>
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
            className="text-[19px] sm:text-[21px] font-extrabold tracking-tight m-0 text-slate-900 dark:text-white"
            style={titleColor ? { color: titleColor } : undefined}
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

      {/* Nội dung chữ - Bố cục thông minh, xuống dòng rõ ràng từng ý, tránh dính liền */}
      <div className={`flex flex-col gap-2.5 font-normal ${textSizeClass}`} style={{ color: textColor || undefined, ...contentCustomStyle }}>
        {format === 'numbered' && (
          <div className="flex flex-col gap-2.5">
            {safeLines.map((rawLine, idx) => {
              const trimmed = rawLine.trim();
              const match = trimmed.match(/^\s*\*\*(.*?)\*\*\s*[:–-]?\s*([\s\S]*)$/);

              if (match) {
                const heading = match[1].trim();
                const body = match[2].trim();
                const subLines = body
                  ? body.split(/\n+/).flatMap((l) => {
                      if (/(\d+\)\s+|•\s+)/.test(l)) {
                        return l.split(/(?=\d+\)\s+|•\s+)/).map((s) => s.trim()).filter(Boolean);
                      }
                      return [l.trim()];
                    }).filter(Boolean)
                  : [];

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[15px] bg-white/95 dark:bg-[#16122C] border border-slate-200/90 dark:border-purple-900/40 shadow-2xs flex flex-col gap-2 transition-all"
                  >
                    {/* Dòng 1: Số thứ tự + Tiêu đề in đậm trên một hàng riêng */}
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <h4 className="text-[14px] sm:text-[15px] font-black text-slate-900 dark:text-white leading-snug m-0">
                        {heading}
                      </h4>
                    </div>

                    {/* Dòng 2+: Nội dung chi tiết xuống dòng hoàn toàn, thụt lề chuẩn */}
                    {subLines.length > 0 && (
                      <div className="pl-4 ml-2.5 flex flex-col gap-1.5 text-[12.5px] sm:text-[13px] text-slate-700 dark:text-slate-300 font-normal leading-relaxed border-l-2 border-blue-200 dark:border-sky-900/60">
                        {subLines.map((sub, sIdx) => (
                          <div key={sIdx} className="m-0">
                            {renderFormattedLine(sub)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-3 rounded-[14px] bg-white/95 dark:bg-[#16122C] border border-slate-200/90 dark:border-purple-900/40 shadow-2xs flex items-start gap-2.5 text-[12.5px] sm:text-[13px] leading-relaxed"
                >
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-sky-300 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <div className="flex-1 font-normal text-slate-700 dark:text-slate-200">
                    {renderFormattedLine(rawLine)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {format === 'bullet' && (
          <div className="flex flex-col gap-2.5">
            {safeLines.map((rawLine, idx) => {
              const trimmed = rawLine.trim();
              const match = trimmed.match(/^\s*\*\*(.*?)\*\*\s*[:–-]?\s*([\s\S]*)$/);

              if (match) {
                const heading = match[1].trim();
                const body = match[2].trim();
                const subLines = body
                  ? body.split(/\n+/).flatMap((l) => {
                      if (/(\d+\)\s+|•\s+)/.test(l)) {
                        return l.split(/(?=\d+\)\s+|•\s+)/).map((s) => s.trim()).filter(Boolean);
                      }
                      return [l.trim()];
                    }).filter(Boolean)
                  : [];

                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-[15px] bg-white/95 dark:bg-[#16122C] border border-slate-200/90 dark:border-purple-900/40 shadow-2xs flex flex-col gap-2 transition-all"
                  >
                    {/* Dòng 1: Điểm nhấn + Tiêu đề in đậm trên một hàng riêng biệt */}
                    <div className="flex items-start gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-sky-400 mt-1.5 shrink-0" />
                      <h4 className="text-[14px] sm:text-[15px] font-black text-slate-900 dark:text-white leading-snug m-0">
                        {heading}
                      </h4>
                    </div>

                    {/* Dòng 2+: Nội dung chi tiết xuống dòng hoàn toàn, thụt lề chuẩn */}
                    {subLines.length > 0 && (
                      <div className="pl-4 ml-1 flex flex-col gap-1.5 text-[12.5px] sm:text-[13px] text-slate-700 dark:text-slate-300 font-normal leading-relaxed border-l-2 border-blue-200 dark:border-sky-900/60">
                        {subLines.map((sub, sIdx) => (
                          <div key={sIdx} className="m-0">
                            {renderFormattedLine(sub)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  className="p-3 rounded-[14px] bg-white/95 dark:bg-[#16122C] border border-slate-200/90 dark:border-purple-900/40 shadow-2xs flex items-start gap-2.5 text-[12.5px] sm:text-[13px] leading-relaxed"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-sky-400 mt-2 shrink-0" />
                  <div className="flex-1 font-normal text-slate-700 dark:text-slate-200">
                    {renderFormattedLine(rawLine)}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {format === 'paragraph' && (
          <div className="flex flex-col gap-2.5">
            {safeLines.map((line, idx) => (
              <p key={idx} className="m-0 leading-relaxed text-[13px] sm:text-[13.5px] text-slate-700 dark:text-slate-300">
                {renderFormattedLine(line)}
              </p>
            ))}
          </div>
        )}
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
            <div key={i} className="w-full">
              {vid.youtube_id ? (
                <YouTubeEmbed
                  youtubeId={vid.youtube_id}
                  title={vid.title}
                  showExternalLink={true}
                />
              ) : (
                <div className="text-white text-[14px] font-bold p-3 bg-ink rounded-[14px]">{vid.title}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
