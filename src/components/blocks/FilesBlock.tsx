import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { FileItem } from '../../lib/types';

interface FilesBlockProps {
  files: FileItem[];
  blockId?: string;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FilesBlock({ files, blockId }: FilesBlockProps) {
  if (!files || files.length === 0) return null;

  return (
    <div id={blockId} className="w-full flex flex-col gap-2.5 scroll-mt-20">
      <h4 className="text-[15px] sm:text-[16px] font-extrabold tracking-[0.5px] text-ink uppercase px-1">
        TÀI LIỆU ĐÍNH KÈM
      </h4>

      <div className="flex flex-col gap-2.5">
        {files.map((file, idx) => (
          <div
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-[18px] border-[1.5px] border-line shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-[14px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
                <FileText size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col truncate">
                <span className="text-[17px] font-bold text-ink truncate">
                  {file.name}
                </span>
                {file.size_bytes && (
                  <span className="text-[14px] text-muted">
                    {formatBytes(file.size_bytes)}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 h-10 px-3.5 rounded-[12px] bg-surface-2 text-ink text-[15px] font-bold border border-line-strong transition-opacity active:opacity-80"
              >
                <ExternalLink size={16} />
                <span>Đọc</span>
              </a>
              <a
                href={file.url}
                download
                className="flex items-center gap-1.5 h-10 px-3.5 rounded-[12px] bg-primary text-white text-[15px] font-bold transition-opacity active:opacity-80"
              >
                <Download size={16} />
                <span>Tải về</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
