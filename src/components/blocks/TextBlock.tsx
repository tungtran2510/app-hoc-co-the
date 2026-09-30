import React from 'react';
import {
  Lightbulb,
  SquareCheck,
  TriangleAlert,
  CircleX,
  Wrench,
  FileText,
  LucideIcon,
} from 'lucide-react';
import { getBlockStyle } from '../../lib/blockStyles';

interface TextBlockProps {
  displayStyle: string;
  lines: string[];
  format?: 'paragraph' | 'numbered' | 'bullet';
  fontSizeMode?: 'normal' | 'large';
  blockId?: string;
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
}: TextBlockProps) {
  const style = getBlockStyle(displayStyle);
  const isLarge = fontSizeMode === 'large';

  // Kiểu van_ban: không có thẻ, không nhãn, chỉ đoạn văn màu ink-2
  if (displayStyle === 'van_ban' || !style.label) {
    return (
      <div id={blockId} className="w-full scroll-mt-20">
        {lines.map((line, idx) => (
          <p
            key={idx}
            className={`font-normal text-ink-2 leading-[1.6] ${
              isLarge ? 'text-[22px]' : 'text-[19px]'
            } ${idx > 0 ? 'mt-3' : ''}`}
          >
            {renderFormattedLine(line)}
          </p>
        ))}
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

      {/* Nội dung */}
      <div
        className={`flex flex-col gap-2 leading-[1.55] text-ink font-normal ${
          isLarge ? 'text-[22px]' : 'text-[19px]'
        }`}
      >
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
    </div>
  );
}
