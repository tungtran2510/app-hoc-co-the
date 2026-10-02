import { MetadataRoute } from 'next';
import { getSettings } from '../lib/data';

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  const name = settings?.app_name || 'Qbiz Books';
  const short_name = name.length > 12 ? name.slice(0, 12) : name;

  return {
    name,
    short_name,
    description: 'Ứng dụng học cấu trúc cơ thể và chăm sóc sức khỏe chủ động',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8FAFC',
    theme_color: '#1D58D8',
    lang: 'vi',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcuts: [
      {
        name: 'Trợ lý AI Y Khoa',
        short_name: 'Trợ lý AI',
        description: 'Hỏi đáp & chăm sóc sức khỏe chủ động',
        url: '/tro-ly-ai',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Bài học đã lưu',
        short_name: 'Đã lưu',
        description: 'Xem lại các bài học đã đánh dấu',
        url: '/da-luu',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
