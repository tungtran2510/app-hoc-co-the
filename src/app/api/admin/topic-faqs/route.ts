import { NextRequest, NextResponse } from 'next/server';
import { getAdminUserFromRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { isValidUuid } from '../../../../lib/uuid';

export async function GET(req: NextRequest) {
  const user = getAdminUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });

  const topicId = req.nextUrl.searchParams.get('topicId')?.trim();
  if (!topicId) return NextResponse.json({ error: 'Thiếu chủ đề cần quản lý' }, { status: 400 });

  const supabase = getSupabaseServer();
  if (!supabase) return NextResponse.json({ error: 'Chưa kết nối dữ liệu' }, { status: 503 });

  try {
    let topicQuery = supabase.from('topics').select('id, slug, title').eq('workspace_id', 'default');
    topicQuery = isValidUuid(topicId) ? topicQuery.eq('id', topicId) : topicQuery.eq('slug', topicId);
    const { data: topic } = await topicQuery.maybeSingle();
    if (!topic) return NextResponse.json({ error: 'Không tìm thấy chuyên đề' }, { status: 404 });

    if (user.role === 'instructor') {
      const allowed = user.allowed_topic_ids || [];
      if (!allowed.includes('*') && !allowed.includes(topic.id) && !allowed.includes(topic.slug)) {
        return NextResponse.json({ error: 'Bạn không có quyền chỉnh sửa chuyên đề này' }, { status: 403 });
      }
    }

    const { data: pages, error: pagesError } = await supabase.from('pages').select('id, title, slug, sort_order, is_visible, status').eq('topic_id', topic.id).eq('is_visible', true).eq('status', 'published').order('sort_order', { ascending: true });
    if (pagesError) throw pagesError;
    const pageIds = (pages || []).map((page) => page.id);
    if (pageIds.length === 0) return NextResponse.json({ blocks: [], pages: [] });

    const { data: rows, error: blocksError } = await supabase.from('blocks').select('*').in('page_id', pageIds).order('sort_order', { ascending: true });
    if (blocksError) throw blocksError;

    const pageById = new Map((pages || []).map((page) => [page.id, page]));
    const videosByPage = new Map<string, Array<{ video: Record<string, unknown>; index: number }>>();
    const allVideos: Array<{ key: string; page_id: string; page_title: string; page_slug: string; topic_id: string; topic_slug: string; topic_title: string; video: Record<string, unknown>; index: number }> = [];
    for (const row of rows || []) {
      if (row.type !== 'videos' || !Array.isArray(row.data?.videos)) continue;
      const list = videosByPage.get(row.page_id) || [];
      const page = pageById.get(row.page_id);
      for (const video of row.data.videos) {
        const index = list.length + 1;
        list.push({ video, index });
        allVideos.push({ key: `${row.page_id}:${index}`, page_id: row.page_id, page_title: page?.title || 'Bài học', page_slug: page?.slug || '', topic_id: topic.id, topic_slug: topic.slug, topic_title: topic.title, video, index });
      }
      videosByPage.set(row.page_id, list);
    }

    const blocks = (rows || []).flatMap((row) => {
      if (!(row.type === 'text' && row.data?.__kind === 'faq')) return [];
      const { __kind, __style, ...data } = row.data;
      const page = pageById.get(row.page_id);
      return [{
        ...row,
        type: 'faq' as const,
        display_style: __style || 'accordion',
        data,
        page_title: page?.title || 'Bài học',
        page_slug: page?.slug || '',
        page_sort_order: page?.sort_order || 0,
        videos: videosByPage.get(row.page_id) || [],
      }];
    });

    return NextResponse.json({ blocks, pages: pages || [], videos: allVideos });
  } catch (error: any) {
    console.error('[Topic FAQ Manager Error]', error);
    return NextResponse.json({ error: error.message || 'Không tải được câu hỏi thường gặp' }, { status: 500 });
  }
}
