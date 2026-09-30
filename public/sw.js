// Service Worker tối thiểu để đáp ứng tiêu chuẩn PWA (cài ra màn hình chính)
// TUÂN THỦ docs/LENH_03.md: KHÔNG cache nội dung, luôn đọc trực tiếp từ mạng.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Không cache - luôn fetch trực tiếp
  event.respondWith(fetch(event.request));
});
