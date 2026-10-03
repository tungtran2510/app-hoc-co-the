'use client';

import { uploadImageFile, uploadDocumentFile } from './storageUpload';

export interface ProgressCallback {
  (message: string, current?: number, total?: number): void;
}

const PDFJS_CDNS = [
  {
    script: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    worker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  },
  {
    script: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js',
    worker: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  },
  {
    script: 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js',
    worker: 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js',
  },
];

/**
 * Đảm bảo thư viện PDF.js được tải đầy đủ với cơ chế đa CDN dự phòng và timeout
 */
export async function ensurePdfJsLoaded(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js chỉ hoạt động trên môi trường trình duyệt');
  }

  const win = window as any;
  if (win.pdfjsLib) {
    if (!win.pdfjsLib.GlobalWorkerOptions.workerSrc) {
      win.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_CDNS[0].worker;
    }
    return win.pdfjsLib;
  }

  let lastError: any = null;

  for (const cdn of PDFJS_CDNS) {
    try {
      await new Promise<void>((resolve, reject) => {
        // Kiểm tra xem script đã có trên trang chưa
        const existingScript = document.querySelector(`script[src="${cdn.script}"]`) as HTMLScriptElement | null;
        if (existingScript && win.pdfjsLib) {
          return resolve();
        }

        const script = document.createElement('script');
        script.src = cdn.script;
        script.async = true;

        const timeoutId = setTimeout(() => {
          script.onerror = null;
          script.onload = null;
          reject(new Error(`Timeout nạp PDF.js từ CDN ${cdn.script}`));
        }, 12000);

        script.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };

        script.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error(`Không thể nạp PDF.js từ ${cdn.script}`));
        };

        document.head.appendChild(script);
      });

      if (win.pdfjsLib) {
        win.pdfjsLib.GlobalWorkerOptions.workerSrc = cdn.worker;
        return win.pdfjsLib;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[PDF.js CDN Fallback] Thử CDN tiếp theo:`, err);
    }
  }

  throw lastError || new Error('Không thể tải công cụ giải mã PDF từ các máy chủ CDN.');
}

/**
 * Bóc tách các trang từ file PDF thành ảnh HD và tải lên lưu trữ đám mây cho Flipbook 3D.
 * ƯU TIÊN SỐ 1: Bóc tách trang cục bộ từ bộ nhớ máy trước (không bị nghẽn mạng),
 * sau đó mới lưu tệp gốc đính kèm.
 */
export async function extractPdfToFlipbookImages(
  file: File,
  options?: {
    maxPages?: number;
    onProgress?: ProgressCallback;
  }
): Promise<{
  pageUrls: string[];
  docFile: { url: string; fileName: string; sizeText: string } | null;
  totalPagesInDoc: number;
}> {
  const onProgress = options?.onProgress || (() => {});
  const maxPages = options?.maxPages || 40; // Tối đa 40 trang đọc thử

  onProgress('Đang nạp công cụ đọc PDF chuẩn y khoa...', 0, 10);
  const pdfjsLib = await ensurePdfJsLoaded();

  onProgress('Đang phân tích cấu trúc các trang sách...', 1, 10);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPagesInDoc = pdfDoc.numPages;
  const pagesToExtract = Math.min(totalPagesInDoc, maxPages);

  const pageUrls: string[] = [];

  for (let pageNum = 1; pageNum <= pagesToExtract; pageNum++) {
    onProgress(
      `Đang trích xuất trang ${pageNum} / ${pagesToExtract} (Tổng ${totalPagesInDoc} trang)...`,
      pageNum,
      pagesToExtract
    );

    const page = await pdfDoc.getPage(pageNum);
    const unscaledViewport = page.getViewport({ scale: 1 });
    // Giới hạn chiều rộng tối đa 1400px để vừa siêu nét Retina vừa nhẹ bộ nhớ di động
    const scale = Math.min(1.8, Math.max(1.0, 1400 / (unscaledViewport.width || 800)));
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      continue;
    }

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Chuyển sang JPEG nén 85% tối ưu
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85);
    });

    if (blob) {
      const cleanBaseName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9-]/g, '_');
      const pageFile = new File([blob], `${cleanBaseName}_trang_${pageNum}.jpg`, {
        type: 'image/jpeg',
      });

      const uploadRes = await uploadImageFile(pageFile);
      if (uploadRes && uploadRes.url) {
        pageUrls.push(uploadRes.url);
      }
    }
  }

  // Tải tệp PDF gốc lên hệ thống lưu trữ (an toàn, không làm nghẽn tiến trình trích xuất)
  let docFile: { url: string; fileName: string; sizeText: string } | null = null;
  try {
    onProgress('Đang hoàn tất lưu tệp tài liệu...', pagesToExtract, pagesToExtract);
    docFile = await uploadDocumentFile(file);
  } catch (err: any) {
    console.warn('[PDF Raw Attachment skipped/warning]:', err?.message || err);
  }

  onProgress(`Đã hoàn tất trích xuất ${pageUrls.length} trang sách 3D!`, pagesToExtract, pagesToExtract);

  return {
    pageUrls,
    docFile,
    totalPagesInDoc,
  };
}

/**
 * Tải file Word (.doc, .docx) lên hệ thống lưu trữ
 */
export async function uploadWordDocument(
  file: File,
  options?: { onProgress?: ProgressCallback }
): Promise<{ url: string; fileName: string; sizeText: string; ext: string }> {
  const onProgress = options?.onProgress || (() => {});
  onProgress('Đang tải tài liệu Word lên hệ thống...', 0, 1);
  const res = await uploadDocumentFile(file);
  onProgress('Tải tài liệu Word thành công!', 1, 1);
  return res;
}

/**
 * Tải lên hàng loạt ảnh trang sách (Batch upload) với sắp xếp tự nhiên theo tên file
 */
export async function uploadBatchBookPages(
  files: FileList | File[],
  options?: { onProgress?: ProgressCallback }
): Promise<string[]> {
  const onProgress = options?.onProgress || (() => {});
  const fileArray = Array.from(files);

  // Sắp xếp tự nhiên theo tên file: trang-1, trang-2, ..., trang-10
  fileArray.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  );

  const total = fileArray.length;
  const urls: string[] = [];

  for (let i = 0; i < total; i++) {
    const currentFile = fileArray[i];
    onProgress(`Đang tải ảnh trang ${i + 1} / ${total} (${currentFile.name})...`, i + 1, total);
    const res = await uploadImageFile(currentFile);
    if (res && res.url) {
      urls.push(res.url);
    }
  }

  onProgress(`Đã tải lên thành công ${urls.length} ảnh trang!`, total, total);
  return urls;
}
