'use client';

import React, { useState, useRef } from 'react';
import {
  FileText,
  FileEdit,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Eye,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';
import {
  extractPdfToFlipbookImages,
  uploadWordDocument,
  uploadBatchBookPages,
} from '../../lib/documentExtractor';
import FlipbookViewer from '../FlipbookViewer';

export interface BookFlipbookAdminSectionProps {
  bookTitle: string;
  coverUrl: string | null;
  flipbookPages?: string[];
  onChangeFlipbookPages?: (pages: string[]) => void;
  galleryImages?: string[];
  onChangeGalleryImages?: (images: string[]) => void;
  fileUrl?: string | null;
  fileName?: string | null;
  onChangeFile?: (fileUrl: string | null, fileName: string | null) => void;
  onSetCoverUrlIfNotSet?: (url: string) => void;
}

export default function BookFlipbookAdminSection({
  bookTitle,
  coverUrl,
  flipbookPages,
  onChangeFlipbookPages,
  galleryImages,
  onChangeGalleryImages,
  fileUrl,
  fileName,
  onChangeFile,
  onSetCoverUrlIfNotSet,
}: BookFlipbookAdminSectionProps) {
  const effectivePages = Array.isArray(flipbookPages)
    ? flipbookPages
    : Array.isArray(galleryImages)
    ? galleryImages
    : [];

  const handleUpdatePages = (newPages: string[]) => {
    if (onChangeFlipbookPages) {
      onChangeFlipbookPages(newPages);
    } else if (onChangeGalleryImages) {
      onChangeGalleryImages(newPages);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [progressPercent, setProgressPercent] = useState<number | null>(null);
  const [errorNotice, setErrorNotice] = useState('');
  const [successNotice, setSuccessNotice] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [directUrl, setDirectUrl] = useState('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const pdfInputRef = useRef<HTMLInputElement>(null);
  const wordInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  // 1. Xử lý nạp từ file PDF
  const handlePdfSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorNotice('');
      setSuccessNotice('');
      setProgressText('Đang nạp file PDF...');
      setProgressPercent(5);

      const result = await extractPdfToFlipbookImages(file, {
        maxPages: 40,
        onProgress: (msg, current, total) => {
          setProgressText(msg);
          if (current !== undefined && total !== undefined && total > 0) {
            setProgressPercent(Math.round((current / total) * 100));
          }
        },
      });

      if (result.pageUrls.length > 0) {
        handleUpdatePages([...effectivePages, ...result.pageUrls]);

        // Cập nhật file tài liệu gốc đính kèm
        if (onChangeFile && result.docFile) {
          onChangeFile(result.docFile.url, result.docFile.fileName);
        }

        // Tự động gán trang đầu tiên làm ảnh bìa nếu sách chưa có bìa
        if (!coverUrl && onSetCoverUrlIfNotSet && result.pageUrls[0]) {
          onSetCoverUrlIfNotSet(result.pageUrls[0]);
        }

        setSuccessNotice(
          `✓ Đã trích xuất thành công ${result.pageUrls.length} trang từ PDF "${file.name}" cho trình lật trang 3D!`
        );
      } else {
        setErrorNotice('Chưa trích xuất được trang ảnh nào từ tệp PDF.');
      }
    } catch (err: any) {
      console.error('[PDF Intake Error]', err);
      setErrorNotice(err.message || 'Lỗi khi giải mã và tải trang PDF.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
      setProgressPercent(null);
      if (pdfInputRef.current) pdfInputRef.current.value = '';
    }
  };

  // 2. Xử lý nạp từ file Word (.doc, .docx)
  const handleWordSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setErrorNotice('');
      setSuccessNotice('');
      setProgressText('Đang tải tài liệu Word lên...');
      setProgressPercent(30);

      const result = await uploadWordDocument(file, {
        onProgress: (msg) => setProgressText(msg),
      });

      if (onChangeFile) {
        onChangeFile(result.url, result.fileName);
      }

      setSuccessNotice(
        `✓ Đã lưu file Word "${file.name}" (${result.sizeText}). Bạn có thể chọn thêm các ảnh chụp trang sách bên dưới để lật trang 3D!`
      );
    } catch (err: any) {
      console.error('[Word Intake Error]', err);
      setErrorNotice(err.message || 'Lỗi khi tải file Word lên.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
      setProgressPercent(null);
      if (wordInputRef.current) wordInputRef.current.value = '';
    }
  };

  // 3. Xử lý nạp bộ ảnh nhiều trang
  const handleImagesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsProcessing(true);
      setErrorNotice('');
      setSuccessNotice('');
      setProgressText('Đang tải các ảnh trang sách lên...');
      setProgressPercent(10);

      const urls = await uploadBatchBookPages(files, {
        onProgress: (msg, current, total) => {
          setProgressText(msg);
          if (current !== undefined && total !== undefined && total > 0) {
            setProgressPercent(Math.round((current / total) * 100));
          }
        },
      });

      if (urls.length > 0) {
        handleUpdatePages([...effectivePages, ...urls]);

        // Nếu chưa có bìa, lấy ảnh đầu tiên làm bìa
        if (!coverUrl && onSetCoverUrlIfNotSet && urls[0]) {
          onSetCoverUrlIfNotSet(urls[0]);
        }

        setSuccessNotice(`✓ Đã nạp thêm ${urls.length} ảnh trang sách vào bộ lật trang 3D!`);
      }
    } catch (err: any) {
      console.error('[Images Intake Error]', err);
      setErrorNotice(err.message || 'Lỗi khi tải các ảnh trang lên.');
    } finally {
      setIsProcessing(false);
      setProgressText('');
      setProgressPercent(null);
      if (imagesInputRef.current) imagesInputRef.current.value = '';
    }
  };

  // 4. Thêm URL trực tiếp
  const handleAddDirectUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = directUrl.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      setErrorNotice('URL không hợp lệ. Vui lòng nhập link bắt đầu bằng https:// hoặc /');
      return;
    }

    handleUpdatePages([...effectivePages, trimmed]);
    setDirectUrl('');
    setShowUrlInput(false);
    setSuccessNotice('✓ Đã thêm 1 trang từ link trực tiếp.');
  };

  const handleRemovePage = (indexToRemove: number) => {
    handleUpdatePages(effectivePages.filter((_, idx) => idx !== indexToRemove));
  };

  const handleClearAllPages = () => {
    if (confirm('Bạn có chắc muốn xóa tất cả các trang đọc thử 3D của cuốn sách này không?')) {
      handleUpdatePages([]);
      setSuccessNotice('Đã xóa toàn bộ trang đọc thử.');
    }
  };

  const handleRemoveAttachedFile = () => {
    if (onChangeFile) {
      onChangeFile(null, null);
      setSuccessNotice('Đã gỡ file tài liệu đính kèm.');
    }
  };

  return (
    <div className="space-y-3 p-3.5 sm:p-4 rounded-[18px] bg-gradient-to-b from-slate-50 to-purple-50/30 dark:from-[#1E113B] dark:to-[#170B2E] border-2 border-slate-200/90 dark:border-purple-500/35 shadow-xs">
      {/* ẨN CÁC INPUT FILE CHUYÊN DỤNG */}
      <input
        type="file"
        ref={pdfInputRef}
        onChange={handlePdfSelected}
        accept=".pdf,application/pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={wordInputRef}
        onChange={handleWordSelected}
        accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
      />
      <input
        type="file"
        ref={imagesInputRef}
        onChange={handleImagesSelected}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* HEADER SECTION: TIÊU ĐỀ + BADGE SỐ TRANG */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-purple-500/20 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-purple-900 text-amber-300 flex items-center justify-center shadow-xs">
            <BookOpen size={16} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-[13.5px] font-black text-slate-900 dark:text-white uppercase tracking-wide">
                Tài Liệu Xem Thử 3D (Flipbook)
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-purple-900 text-amber-300 text-[11px] font-black shadow-xs">
                {effectivePages.length} trang
              </span>
            </div>
            <p className="text-[11.5px] text-slate-600 dark:text-purple-200/70">
              Nạp từ file PDF, tài liệu Word hoặc ảnh trang sách để độc giả lật trang 3D chân thực
            </p>
          </div>
        </div>

        {/* NÚT XEM TRƯỚC 3D NGAY NẾU ĐÃ CÓ TRANG */}
        {effectivePages.length > 0 && (
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="h-8 px-3 rounded-[9px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-[11.5px] font-black flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
            title="Mở trình đọc 3D để kiểm tra trực tiếp các trang vừa nạp"
          >
            <Eye size={13} strokeWidth={2.5} />
            <span>Xem thử 3D ngay</span>
          </button>
        )}
      </div>

      {/* THÔNG BÁO TIẾN TRÌNH / LỖI / THÀNH CÔNG */}
      {isProcessing && (
        <div className="p-3 rounded-[12px] bg-purple-100/80 dark:bg-purple-900/60 border border-purple-300 dark:border-purple-400 text-purple-950 dark:text-white text-[12.5px] font-bold space-y-1.5 animate-pulse">
          <div className="flex items-center gap-2">
            <Loader2 size={16} className="animate-spin text-purple-600 dark:text-purple-300" />
            <span>{progressText || 'Đang xử lý tài liệu...'}</span>
          </div>
          {progressPercent !== null && (
            <div className="w-full h-2 rounded-full bg-purple-200 dark:bg-purple-950 overflow-hidden">
              <div
                className="h-full bg-purple-600 dark:bg-purple-400 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      )}

      {errorNotice && (
        <div className="p-2.5 rounded-[10px] bg-red-50 border border-red-200 text-red-700 text-[12px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertCircle size={15} />
            <span>{errorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorNotice('')}
            className="text-red-500 hover:text-red-800 font-black cursor-pointer px-1"
          >
            ×
          </button>
        </div>
      )}

      {successNotice && (
        <div className="p-2.5 rounded-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-bold flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={15} className="text-emerald-600" />
            <span>{successNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessNotice('')}
            className="text-emerald-600 hover:text-emerald-900 font-black cursor-pointer px-1"
          >
            ×
          </button>
        </div>
      )}

      {/* 4 NÚT HÀNH ĐỘNG NẠP TÀI LIỆU RÕ RÀNG, TINH GỌN */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
        {/* Nút 1: Nạp từ File PDF */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => pdfInputRef.current?.click()}
          className="h-10 px-2.5 rounded-[12px] bg-white dark:bg-[#130826] border-2 border-red-200 dark:border-red-900/50 hover:border-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/40 text-slate-800 dark:text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs group cursor-pointer disabled:opacity-50"
        >
          <div className="w-6 h-6 rounded-[6px] bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center shrink-0">
            <FileText size={13} strokeWidth={2.5} />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[12px] font-black leading-tight text-red-700 dark:text-red-300 truncate">
              File PDF
            </div>
            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
              Tách trang 3D
            </div>
          </div>
        </button>

        {/* Nút 2: Nạp từ File Word */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => wordInputRef.current?.click()}
          className="h-10 px-2.5 rounded-[12px] bg-white dark:bg-[#130826] border-2 border-purple-200 dark:border-purple-900/50 hover:border-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs group cursor-pointer disabled:opacity-50"
        >
          <div className="w-6 h-6 rounded-[6px] bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
            <FileEdit size={13} strokeWidth={2.5} />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[12px] font-black leading-tight text-purple-700 dark:text-purple-300 truncate">
              File Word
            </div>
            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
              .doc, .docx
            </div>
          </div>
        </button>

        {/* Nút 3: Nạp từ Bộ ảnh các trang */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => imagesInputRef.current?.click()}
          className="h-10 px-2.5 rounded-[12px] bg-white dark:bg-[#130826] border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs group cursor-pointer disabled:opacity-50"
        >
          <div className="w-6 h-6 rounded-[6px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center shrink-0">
            <ImageIcon size={13} strokeWidth={2.5} />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[12px] font-black leading-tight text-emerald-700 dark:text-emerald-300 truncate">
              Bộ Ảnh Trang
            </div>
            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
              Chọn nhiều ảnh
            </div>
          </div>
        </button>

        {/* Nút 4: Dán link trực tiếp */}
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => setShowUrlInput(!showUrlInput)}
          className={`h-10 px-2.5 rounded-[12px] bg-white dark:bg-[#130826] border-2 transition-all shadow-2xs group cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5 ${
            showUrlInput
              ? 'border-purple-500 bg-purple-50/60 dark:bg-purple-950/60'
              : 'border-slate-200 dark:border-purple-900/40 hover:border-purple-400'
          }`}
        >
          <div className="w-6 h-6 rounded-[6px] bg-purple-100 dark:bg-purple-950 text-purple-700 flex items-center justify-center shrink-0">
            <LinkIcon size={13} strokeWidth={2.5} />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[12px] font-black leading-tight text-purple-700 dark:text-purple-300 truncate">
              Dán Link URL
            </div>
            <div className="text-[9.5px] text-slate-500 dark:text-slate-400 leading-tight">
              Ảnh / PDF
            </div>
          </div>
        </button>
      </div>

      {/* FORM NHẬP LINK URL TRỰC TIẾP (KHI BẤM NÚT 4) */}
      {showUrlInput && (
        <form onSubmit={handleAddDirectUrl} className="flex gap-2 p-2.5 rounded-[12px] bg-white dark:bg-[#130826] border border-purple-300 dark:border-purple-500/40">
          <input
            type="url"
            value={directUrl}
            onChange={(e) => setDirectUrl(e.target.value)}
            placeholder="Dán link ảnh trang sách hoặc link file: https://..."
            className="flex-1 h-8.5 px-3 rounded-[8px] bg-slate-50 dark:bg-[#1E113B] border border-slate-200 dark:border-purple-500/30 text-[12px] font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-purple-600 dark:focus:ring-amber-400"
            autoFocus
          />
          <button
            type="submit"
            className="h-8.5 px-3.5 rounded-[8px] bg-purple-900 text-white text-[12px] font-black flex items-center gap-1 shrink-0 cursor-pointer hover:bg-purple-950"
          >
            <Plus size={13} strokeWidth={2.5} />
            <span>Thêm</span>
          </button>
        </form>
      )}

      {/* TỆP TÀI LIỆU ĐÍNH KÈM GỐC (NẾU CÓ) */}
      {fileUrl && (
        <div className="flex items-center justify-between p-2.5 rounded-[12px] bg-white dark:bg-[#130826] border border-slate-200 dark:border-purple-500/30 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-[8px] bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <FileText size={15} />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-slate-900 dark:text-white truncate">
                {fileName || 'Tài liệu sách đính kèm'}
              </div>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-purple-700 dark:text-[#F8DF7B] hover:underline flex items-center gap-1"
              >
                <span>Xem tệp gốc đã tải lên</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveAttachedFile}
            className="text-[11.5px] text-red-500 hover:text-red-700 font-bold px-2 py-1 cursor-pointer"
            title="Gỡ file đính kèm này"
          >
            Gỡ tệp
          </button>
        </div>
      )}

      {/* DANH SÁCH THUMBNAIL CÁC TRANG SÁCH 3D HIỆN CÓ */}
      {effectivePages.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11.5px] font-bold text-slate-700 dark:text-purple-200">
              Danh sách các trang sách đọc thử (Bấm vào nút đỏ để xóa trang):
            </span>
            <button
              type="button"
              onClick={handleClearAllPages}
              className="text-[11px] text-red-500 hover:text-red-700 font-bold cursor-pointer"
            >
              Xóa tất cả trang
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-[220px] overflow-y-auto p-1 rounded-[12px] bg-white/70 dark:bg-[#120824]/60 border border-slate-200/80 dark:border-purple-500/20">
            {effectivePages.map((imgUrl, gIdx) => (
              <div
                key={gIdx}
                className="relative aspect-[3/4] rounded-[8px] overflow-hidden border border-slate-300 dark:border-purple-400/40 group bg-slate-100 shadow-2xs"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={`Trang ${gIdx + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePage(gIdx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 hover:scale-110 transition-all cursor-pointer shadow-md"
                  title={`Xóa trang ${gIdx + 1}`}
                >
                  <Trash2 size={10} />
                </button>
                <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded bg-black/75 text-white text-[9px] font-black">
                  #{gIdx + 1}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-[12px] border-2 border-dashed border-slate-200 dark:border-purple-500/20 text-center bg-white/50 dark:bg-white/5 space-y-1">
          <BookOpen size={22} className="mx-auto text-slate-400 dark:text-purple-300/50" />
          <p className="text-[12px] font-bold text-slate-600 dark:text-purple-200">
            Chưa có trang đọc thử 3D nào
          </p>
          <p className="text-[11px] text-slate-400 dark:text-purple-400/60 max-w-sm mx-auto">
            Hãy chọn nút &quot;File PDF&quot; để tự động bóc tách trang, hoặc &quot;Bộ Ảnh Trang&quot; để tạo trải nghiệm lật trang chân thực cho độc giả.
          </p>
        </div>
      )}

      {/* POPUP XEM TRƯỚC 3D TEST TRỰC TIẾP */}
      {isPreviewOpen && (
        <FlipbookViewer
          mode="modal-only"
          isOpen={isPreviewOpen}
          book={{
            title: bookTitle,
            cover_url: coverUrl,
            flipbook_pages: effectivePages,
            gallery_images: effectivePages,
          }}
          title={`Xem trước 3D: ${bookTitle || 'Tài liệu'}`}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </div>
  );
}
