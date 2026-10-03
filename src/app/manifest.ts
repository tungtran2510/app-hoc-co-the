import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Qbiz Books',
    short_name: 'Qbiz Books',
    description: 'Ứng dụng học cấu trúc cơ thể và chăm sóc sức khỏe chủ động',
    start_url: '/',
    id: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFFFF',
    theme_color: '#FFFFFF',
    lang: 'vi',
    icons: [
      {
        src: '/icon-192.png?v=22',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-192.png?v=22',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png?v=22',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-maskable-512.png?v=22',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/app_logo.png?v=22',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Trợ lý AI Y Khoa',
        short_name: 'Trợ lý AI',
        description: 'Hỏi đáp & chăm sóc sức khỏe chủ động',
        url: '/tro-ly-ai',
        icons: [{ src: '/icon-192.png?v=22', sizes: '192x192' }],
      },
      {
        name: 'Bài học đã lưu',
        short_name: 'Đã lưu',
        description: 'Xem lại các bài học đã đánh dấu',
        url: '/da-luu',
        icons: [{ src: '/icon-192.png?v=22', sizes: '192x192' }],
      },
    ],
  };
}
