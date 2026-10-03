'use client';

import { uploadImageFile, uploadDocumentFile } from './storageUpload';

export interface ProgressCallback {
  (message: string, current?: number, total?: number): void;
}

/**
 * Đảm bảo thư viện PDF.js được tải đầy đủ trong môi trường trình duyệt
 */
export async function ensurePdfJsLoaded(): Promise<any> {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js chỉ hoạt động trên môi trường trình duyệt');
  }

  const win = window as any;
  if (!win.pdfjsLib) {
    await new Promise<void>((resolve, reject) => {
      // Kiểm tra xem script đã được append trước đó chưa
      const existingScript = document.querySelector('script[src*="pdf.js"]') || document.querySelector('script[src*="pdf.min.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve());
        existingScript.addEventListener('error', () => reject(new Error('Lỗi nạp thư viện PDF.js')));
        // Nếu đã có sẵn đối tượng
        if (win.pdfjsLib) return resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Không thể tải công cụ giải mã PDF.js từ CDN'));
      document.head.appendChild(script);
    });
  }

  const pdfjsLib = win.pdfjsLib;
  if (pdfjsLib && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
  }

  return pdfjsLib;
}

/**
 * Bóc tách các trang từ file PDF thành ảnh HD và tải lên lưu trữ đám mây cho Flipbook 3D
 */
export async function extractPdfToFlipbookImages(
  file: File,
  options?: {
    maxPages?: number;
    onProgress?: ProgressCallback;
  }
): Promise<{
  pageUrls: string[];
  docFile: { url: string; fileName: string; sizeText: string };
  totalPagesInDoc: number;
}> {
  const onProgress = options?.onProgress || (() => {});
  const maxPages = options?.maxPages || 30; // Giới hạn tối đa 30 trang để duyệt 3D mượt mà

  onProgress('Đang tải file PDF gốc lên hệ thống lưu trữ...', 0, 1);
  const docFile = await uploadDocumentFile(file);

  onProgress('Đang nạp công cụ đọc PDF chuẩn y khoa...', 0, 1);
  const pdfjsLib = await ensurePdfJsLoaded();

  onProgress('Đang phân tích cấu trúc các trang sách...', 0, 1);
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPagesInDoc = pdfDoc.numPages;
  const pagesToExtract = Math.min(totalPagesInDoc, maxPages);

  const pageUrls: string[] = [];

  for (let pageNum = 1; pageNum <= pagesToExtract; pageNum++) {
    onProgress(
      `Đang trích xuất & tối ưu trang ${pageNum} / ${pagesToExtract} (Tổng ${totalPagesInDoc} trang)...`,
      pageNum,
      pagesToExtract
    );

    const page = await pdfDoc.getPage(pageNum);
    // Scale 1.8 để text và hình giải phẫu sắc nét trên cả màn hình Retina
    const viewport = page.getViewport({ scale: 1.8 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      continue;
    }

    await page.render({ canvasContext: ctx, viewport }).promise;

    // Chuyển sang WebP / JPEG blob
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.88);
    });

    if (blob) {
      const cleanBaseName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9-]/g, '_');
      const pageFile = new File([blob], `${cleanBaseName}_trang_${pageNum}.jpg`, { type: 'image/jpeg' });
      
      const uploadRes = await uploadImageFile(pageFile);
      if (uploadRes && uploadRes.url) {
        pageUrls.push(uploadRes.url);
      }
    }
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
