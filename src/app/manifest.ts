import { MetadataRoute } from 'next';
import { getSettings } from '../lib/data';

export const dynamic = 'force-dynamic';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();
  const name = settings?.app_name || 'Học Cơ Thể';
  const short_name = name.length > 12 ? name.slice(0, 12) : name;

  return {
    name,
    short_name,
    description: 'Ứng dụng học cấu trúc cơ thể và chăm sóc sức khỏe chủ động',
    start_url: '/',
    display: 'standalone',
    background_color: '#F6F4EF',
    theme_color: '#0E6B5A',
    lang: 'vi',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
