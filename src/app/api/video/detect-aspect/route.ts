import { NextRequest, NextResponse } from 'next/server';

// Bộ nhớ đệm nhớ tỷ lệ khung hình video đã nhận diện
const aspectCache = new Map<string, { is_vertical: boolean; aspect: 'vertical' | 'horizontal' }>();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim();
    const rawUrl = searchParams.get('url')?.trim();

    if (!id && !rawUrl) {
      return NextResponse.json({ error: 'Thiếu id hoặc url' }, { status: 400 });
    }

    // 1. Kiểm tra trực tiếp URL xem có chứa /shorts/ không
    if (rawUrl && (rawUrl.includes('/shorts/') || rawUrl.includes('tiktok.com') || rawUrl.includes('/reels/'))) {
      if (id) aspectCache.set(id, { is_vertical: true, aspect: 'vertical' });
      return NextResponse.json({ is_vertical: true, aspect: 'vertical', source: 'url_pattern' });
    }

    const videoId = id || (rawUrl?.match(/([a-zA-Z0-9_-]{11})/)?.[1]);
    if (!videoId) {
      return NextResponse.json({ is_vertical: false, aspect: 'horizontal' });
    }

    // 2. Tra cứu bộ nhớ đệm
    if (aspectCache.has(videoId)) {
      return NextResponse.json({ ...aspectCache.get(videoId), cached: true });
    }

    // 3. Tự động kiểm tra chuyển hướng của YouTube Shorts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const testUrl = `https://www.youtube.com/shorts/${videoId}`;
    const res = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'follow',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const finalUrl = res.url || '';
    const isVertical = finalUrl.includes('/shorts/');
    const result = {
      is_vertical: isVertical,
      aspect: isVertical ? ('vertical' as const) : ('horizontal' as const),
      final_url: finalUrl,
    };

    aspectCache.set(videoId, result);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({
      is_vertical: false,
      aspect: 'horizontal',
      fallback: true,
      error: error?.message,
    });
  }
}
