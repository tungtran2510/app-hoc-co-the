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
  try {
    // 1. Thử nén ảnh client-side sang định dạng WebP siêu nhẹ, sắc nét
    let mainBlob: Blob | null = null;
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
  formData.append('file', file);

  const serverRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: getAdminAuthHeadersOnly(),
    body: formData,
  });

  if (!serverRes.ok) {
    const errData = await serverRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Chưa thể tải ảnh lên kho lưu trữ. Vui lòng kiểm tra kết nối mạng.');
  }

  const serverData = await serverRes.json();
  return {
    url: serverData.url,
    thumb_url: serverData.thumb_url || serverData.url,
  };
}

export async function uploadPdfFile(file: File): Promise<{ url: string; fileName: string; sizeText: string }> {
  const maxBytes = 25 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('File quá lớn, tối đa 25MB');
  }

  try {
    const uuid = generateUuid();
    const filePath = `files/${uuid}.pdf`;

    const res = await fetch('/api/admin/upload-url', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify({ filePath }),
    });

    if (res.ok) {
      const data = await res.json();
      const putRes = await fetch(data.signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/pdf' },
        body: file,
      });

      if (putRes.ok) {
        const mb = (file.size / (1024 * 1024)).toFixed(1);
        return {
          url: data.publicUrl,
          fileName: file.name,
          sizeText: `${mb} MB`,
        };
      }
    }
  } catch (err) {
    console.warn('PDF signed upload error, falling back to server route:', err);
  }

  // Server fallback for PDF
  const formData = new FormData();
  formData.append('file', file);

  const serverRes = await fetch('/api/admin/upload', {
    method: 'POST',
    headers: getAdminAuthHeadersOnly(),
    body: formData,
  });

  if (!serverRes.ok) {
    const errData = await serverRes.json().catch(() => ({}));
    throw new Error(errData.error || 'Tải file PDF lên kho lưu trữ thất bại.');
  }

  const serverData = await serverRes.json();
  const mb = (file.size / (1024 * 1024)).toFixed(1);
  return {
    url: serverData.url,
    fileName: file.name,
    sizeText: `${mb} MB`,
  };
}
