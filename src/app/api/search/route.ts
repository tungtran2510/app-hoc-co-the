import { NextResponse } from 'next/server';
import { getTopics, getPagesByTopic, getBlocksByPage } from '../../../lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const topics = await getTopics(false); // Chỉ lấy chủ đề đang hiện
    const searchData: {
      topics: {
        id: string;
        title: string;
        slug: string;
        description: string | null;
        color_bg: string;
        color_fg: string;
        icon_url?: string;
        cover_url?: string;
      }[];
      pages: {
        id: string;
        title: string;
        slug: string;
        topic_slug: string;
        topic_title: string;
        page_number: number;
        summary: string | null;
        cover_url?: string;
        text_snippets: string[];
      }[];
      videos: {
        youtube_id: string;
        title: string;
        description?: string;
        topic_slug: string;
        topic_title: string;
        page_slug: string;
        page_title: string;
        page_number: number;
        video_index: number;
        thumbnail_url?: string;
      }[];
    } = {
      topics: [],
      pages: [],
      videos: [],
    };

    for (const topic of topics) {
      searchData.topics.push({
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        description: topic.description,
        color_bg: topic.color_bg,
        color_fg: topic.color_fg,
        icon_url: `/images/topics/${topic.slug}.png`,
        cover_url: topic.cover_url || `/images/topics/${topic.slug}.png`,
      });

      const pages = await getPagesByTopic(topic.id, false); // Chỉ lấy trang published và visible
      for (let pIdx = 0; pIdx < pages.length; pIdx++) {
        const page = pages[pIdx];
        const blocks = await getBlocksByPage(page.id);

        const textSnippets: string[] = [];
        let videoRunningIndex = 0;

        for (const block of blocks) {
          if (!block.is_visible) continue;

          if (block.type === 'text') {
            if (block.data.title) textSnippets.push(block.data.title);
            if (block.data.lines) textSnippets.push(...block.data.lines);
            if (block.data.html) {
              const stripped = block.data.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
              if (stripped) textSnippets.push(stripped);
            }
          } else if (block.type === 'videos') {
            for (const vid of block.data.videos) {
              videoRunningIndex++;
              searchData.videos.push({
                youtube_id: vid.youtube_id,
                title: vid.title,
                description: vid.description,
                topic_slug: topic.slug,
                topic_title: topic.title,
                page_slug: page.slug,
                page_title: page.title,
                page_number: pIdx + 1,
                video_index: videoRunningIndex,
                thumbnail_url: `https://img.youtube.com/vi/${vid.youtube_id}/hqdefault.jpg`,
              });
            }
          }
        }

        searchData.pages.push({
          id: page.id,
          title: page.title,
          slug: page.slug,
          topic_slug: topic.slug,
          topic_title: topic.title,
          page_number: pIdx + 1,
          summary: page.summary,
          cover_url: page.cover_url || `/images/topics/${topic.slug}.png`,
          text_snippets: textSnippets,
        });
      }
    }

    return NextResponse.json(searchData);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi đọc dữ liệu tìm kiếm' }, { status: 500 });
  }
}
