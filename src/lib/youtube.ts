/**
 * Trích xuất YouTube ID từ mọi dạng link YouTube
 * Hỗ trợ: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  let clean = url.trim();

  // 1. Nếu dán cả thẻ <iframe ... src="...">
  const iframeSrcMatch = clean.match(/src=["']([^"']+)["']/i);
  if (iframeSrcMatch) {
    clean = iframeSrcMatch[1].trim();
  }

  // 2. Nếu người dùng chỉ gõ đúng 11 ký tự YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) {
    return clean;
  }

  // 3. Các mẫu URL YouTube thông dụng
  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube(?:-nocookie)?\.com\/(?:shorts|live|embed|v)\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/user\/[^\/]+\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/[^\/]+\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const p of patterns) {
    const match = clean.match(p);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 4. Fallback tìm chuỗi 11 ký tự nếu có từ khóa youtube hoặc youtu.be
  if (/youtube|youtu\.be/i.test(clean)) {
    const fallbackMatch = clean.match(/([a-zA-Z0-9_-]{11})/);
    if (fallbackMatch) {
      return fallbackMatch[1];
    }
  }

  return null;
}

export interface YouTubeMeta {
  title: string;
  thumbnail_url: string;
  author_name?: string;
  is_vertical?: boolean;
}

/**
 * Kiểm tra xem một link hoặc ID có phải là Shorts (video dọc) hay không
 */
export function checkIsShorts(urlOrId: string): boolean {
  if (!urlOrId) return false;
  return urlOrId.includes('/shorts/') || urlOrId.includes('shorts=true');
}

/**
 * Gọi YouTube oEmbed API công khai để lấy tiêu đề và ảnh bìa tự động (không cần API key)
 */
export async function fetchYouTubeMeta(youtubeId: string): Promise<YouTubeMeta> {
  const defaultMeta: YouTubeMeta = {
    title: `Video YouTube (${youtubeId})`,
    thumbnail_url: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
  };

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${youtubeId}`;
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(videoUrl)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.title) {
        return {
          title: data.title,
          thumbnail_url: data.thumbnail_url || defaultMeta.thumbnail_url,
          author_name: data.author_name,
        };
      }
    }
  } catch {
    // Bỏ qua lỗi mạng, dùng fallback
  }

  return defaultMeta;
}
