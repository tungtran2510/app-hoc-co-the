import { NextResponse } from 'next/server';
import { getTopics, getPagesByTopic } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topics = await getTopics(false);
    const urls: string[] = [
      '/',
      '/chuyen-de',
      '/da-luu',
      '/tim-kiem',
      '/tro-ly-ai',
      '/giai-phau-3d',
    ];
    const imageUrls: string[] = [
      '/app_logo.png',
      '/icon-192.png',
      '/icon-512.png',
      '/spine_hero_clean.png',
      '/favicon.ico',
    ];

    for (const t of topics) {
      urls.push(`/${t.slug}`);
      if (t.cover_url) imageUrls.push(t.cover_url);
      const pages = await getPagesByTopic(t.id, false);
      for (const p of pages) {
        urls.push(`/${t.slug}/${p.slug}`);
        if (p.cover_url) imageUrls.push(p.cover_url);
      }
    }

    const uniqueUrls = Array.from(new Set(urls));
    const uniqueImages = Array.from(new Set(imageUrls.filter(Boolean)));

    return NextResponse.json({
      success: true,
      totalUrls: uniqueUrls.length,
      urls: uniqueUrls,
      totalImages: uniqueImages.length,
      images: uniqueImages,
      maxSafeBytes: 30 * 1024 * 1024, // 30 MB
      estimatedSizeMb: 15.2,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Lỗi tạo danh sách gói ngoại tuyến' },
      { status: 500 }
    );
  }
}
