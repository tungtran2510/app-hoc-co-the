import { compressImageClient } from './imageCompressor';

function generateUuid(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getYearMonth(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export async function uploadImageFile(file: File): Promise<{ url: string; thumb_url: string }> {
  // 1. Nén ảnh client-side
  const { mainBlob, thumbBlob } = await compressImageClient(file);
  const ym = getYearMonth();
  const uuid = generateUuid();

  const mainPath = `images/${ym}/${uuid}.webp`;
  const thumbPath = `images/${ym}/${uuid}-thumb.webp`;

  // 2. Lấy signed upload URL cho ảnh chính
  const mainRes = await fetch('/api/admin/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath: mainPath }),
  });

  if (!mainRes.ok) {
    const err = await mainRes.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi xin quyền tải ảnh chính.');
  }
  const mainData = await mainRes.json();

  // Tải trực tiếp mainBlob lên Supabase Storage qua signedUrl
  const putMainRes = await fetch(mainData.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'image/webp' },
    body: mainBlob,
  });
  if (!putMainRes.ok) {
    throw new Error('Tải ảnh chính lên Storage thất bại.');
  }

  // 3. Lấy signed upload URL cho thumbnail
  const thumbRes = await fetch('/api/admin/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath: thumbPath }),
  });

  if (!thumbRes.ok) {
    // Nếu thumb lỗi thì dùng luôn mainUrl
    return {
      url: mainData.publicUrl,
      thumb_url: mainData.publicUrl,
    };
  }
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

export async function uploadPdfFile(file: File): Promise<{ url: string; fileName: string; sizeText: string }> {
  const maxBytes = 20 * 1024 * 1024;
  if (file.size > maxBytes) {
    throw new Error('File quá lớn, tối đa 20MB');
  }

  const uuid = generateUuid();
  const filePath = `files/${uuid}.pdf`;

  const res = await fetch('/api/admin/upload-url', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filePath }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Lỗi khi xin quyền tải file PDF.');
  }

  const data = await res.json();

  const putRes = await fetch(data.signedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/pdf' },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error('Tải file PDF lên kho lưu trữ thất bại.');
  }

  const mb = (file.size / (1024 * 1024)).toFixed(1);
  return {
    url: data.publicUrl,
    fileName: file.name,
    sizeText: `${mb} MB`,
  };
}
