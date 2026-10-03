import { compressImageClient } from './imageCompressor';
import { generateUuid } from './uuid';
import { getAdminHeaders } from './apiAdmin';

function getAdminAuthHeadersOnly(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('app_admin_token');
    if (token) {
      headers['x-admin-token'] = token;
    }
  }
  return headers;
}

function getYearMonth(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Tải ảnh lên với cơ chế dự phòng 2 tầng:
 * 1. Tầng 1: Nén WebP nhẹ & tải qua Signed URL
 * 2. Tầng 2: Nếu có bất kỳ lỗi nào (CORS, thiết bị di động, bộ nhớ Canvas), tự động chuyển sang tải trực tiếp qua Server Route /api/admin/upload
 */
export async function uploadImageFile(file: File): Promise<{ url: string; thumb_url: string }> {
  let mainBlob: Blob | null = null;
  try {
    // 1. Thử nén ảnh client-side sang định dạng WebP siêu nhẹ, sắc nét
    let thumbBlob: Blob | null = null;

    try {
      const comp = await compressImageClient(file);
      mainBlob = comp.mainBlob;
      thumbBlob = comp.thumbBlob;
    } catch (compressErr) {
      console.warn('Client compression failed, using original file:', compressErr);
      mainBlob = file;
    }

    const ym = getYearMonth();
    const uuid = generateUuid();
    const mainPath = `images/${ym}/${uuid}.webp`;
    const thumbPath = `images/${ym}/${uuid}-thumb.webp`;

    // 2. Xin signed upload URL từ Supabase Storage (bucket 'media')
    const mainRes = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ filePath: mainPath }),
    });

    if (mainRes.ok) {
      const mainData = await mainRes.json();

      // Tải trực tiếp mainBlob lên Supabase Storage qua signedUrl
      const putMainRes = await fetch(mainData.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mainBlob.type || 'image/webp' },
        body: mainBlob,
      });

      if (putMainRes.ok) {
        // Tải ảnh thumbnail phụ (nếu có)
        if (thumbBlob) {
          const thumbRes = await fetch('/api/admin/upload-url', {
            method: 'POST',
            headers: getAdminHeaders(),
            body: JSON.stringify({ filePath: thumbPath }),
          });

          if (thumbRes.ok) {
            const thumbData = await thumbRes.json();
            const putThumbRes = await fetch(thumbData.signedUrl, {
              method: 'PUT',
              headers: { 'Content-Type': 'image/webp' },
              body: thumbBlob,
            });

            return {
              url: mainData.publicUrl,
              thumb_url: putThumbRes.ok ? thumbData.publicUrl : mainData.publicUrl,
            };
          }
        }

        return {
          url: mainData.publicUrl,
          thumb_url: mainData.publicUrl,
        };
      }
    }
  } catch (directErr) {
    console.warn('Direct signed upload encountered error, falling back to server route:', directErr);
  }

  // 3. DỰ PHÒNG TỐI CAO: Gửi file trực tiếp qua Server Route /api/admin/upload
  const formData = new FormData();
  if (mainBlob && mainBlob !== file) {
    formData.append('file', mainBlob, 'image.webp');
  } else {
    formData.append('file', file);
  }

  const serverRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: getAdminAuthHeadersOnly(),
    body: formData,
  });

  if (!serverRes.ok) {
    const errData = await serverRes.json().catch(() => ({}));
    if (serverRes.status === 413) {
      throw new Error('Ảnh quá lớn (trên 4.5MB). Vui lòng chọn ảnh nhỏ hơn hoặc chụp lại ở chất lượng thấp hơn.');
    }
    if (serverRes.status === 401) {
      throw new Error('Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại.');
    }
    throw new Error(errData.error || 'Chưa thể tải ảnh lên kho lưu trữ. Vui lòng kiểm tra kết nối mạng.');
  }

  const serverData = await serverRes.json();
  return {
    url: serverData.url,
    thumb_url: serverData.thumb_url || serverData.url,
  };
}

export async function uploadPdfFile(file: File): Promise<{ url: string; fileName: string; sizeText: string }> {
  return uploadDocumentFile(file);
}

export async function uploadDocumentFile(file: File): Promise<{ url: string; fileName: string; sizeText: string; ext: string }> {
  const maxBytes = 50 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('Tệp quá lớn, vui lòng chọn file dưới 50MB');
  }

  const origExt = file.name.split('.').pop()?.toLowerCase() || 'pdf';
  const ym = getYearMonth();
  const uuid = generateUuid();
  const filePath = `documents/${ym}/${uuid}.${origExt}`;

  let mimeType = file.type;
  if (!mimeType) {
    if (origExt === 'pdf') mimeType = 'application/pdf';
    else if (origExt === 'doc') mimeType = 'application/msword';
    else if (origExt === 'docx') mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    else mimeType = 'application/octet-stream';
  }

  try {
    const res = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ filePath }),
    });

    if (res.ok) {
      const data = await res.json();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

      const putRes = await fetch(data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: file,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (putRes.ok) {
        const mb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          url: data.publicUrl,
          fileName: file.name,
          sizeText: Number(mb) < 0.1 ? `${Math.round(file.size / 1024)} KB` : `${mb} MB`,
          ext: origExt,
        };
      }
    }
  } catch (err) {
    console.warn('Document signed upload error, attempting fallback if size permits:', err);
  }

  // Server fallback for Document (Vercel max payload limit is 4.5MB)
  if (file.size > 4.5 * 1024 * 1024) {
    throw new Error('Tệp PDF vượt quá 4.5MB nên không thể tải tệp gốc qua máy chủ Vercel. Các trang xem thử 3D vẫn được trích xuất bình thường.');
  }

  const formData = new FormData();
  formData.append('file', file);

  const serverRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: getAdminAuthHeadersOnly(),
    body: formData,
  });

  if (!serverRes.ok) {
    const errData = await serverRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Tải tài liệu lên kho lưu trữ thất bại.');
  }

  const serverData = await serverRes.json();
  const mb = (file.size / (1024 * 1024)).toFixed(1);
  return {
    url: serverData.url,
    fileName: file.name,
    sizeText: Number(mb) < 0.1 ? `${Math.round(file.size / 1024)} KB` : `${mb} MB`,
    ext: origExt,
  };
}
