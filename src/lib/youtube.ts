/**
 * Trích xuất YouTube ID từ mọi dạng link YouTube
 * Hỗ trợ: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/shorts/ID, youtube.com/embed/ID
 */
export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  
  // Nếu người dùng chỉ gõ đúng 11 ký tự YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

export interface YouTubeMeta {
  title: string;
  thumbnail_url: string;
  author_name?: string;
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
