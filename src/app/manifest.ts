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
    background_color: '#F8FAFC',
    theme_color: '#1D58D8',
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
    shortcuts: [
      {
        name: 'Atlas Giải Phẫu 3D',
        short_name: 'Atlas 3D',
        description: 'Mô hình 3D tương tác, bóc tách & chuyển động sinh lý',
        url: '/giai-phau-3d',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Trợ lý AI Y Khoa',
        short_name: 'Trợ lý AI',
        description: 'Hỏi đáp giải phẫu & chăm sóc sức khỏe chủ động',
        url: '/tro-ly-ai',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
      {
        name: 'Chẩn Đoán Hình Ảnh & Lâm Sàng',
        short_name: 'Chẩn Đoán',
        description: 'Đối chiếu X-quang, CT, MRI, Siêu âm với mô hình 3D',
        url: '/chan-doan-hinh-anh',
        icons: [{ src: '/icon-192.png', sizes: '192x192' }],
      },
    ],
  };
}
