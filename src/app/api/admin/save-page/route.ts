import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }

  try {
    const { page } = await req.json();
    if (!page || !page.title || !page.slug || !page.topic_id) {
      return NextResponse.json({ error: 'Dữ liệu trang không hợp lệ' }, { status: 400 });
    }

    const { error } = await supabase.from('pages').upsert(
      {
        id: page.id,
        workspace_id: page.workspace_id || 'default',
        topic_id: page.topic_id,
        slug: page.slug,
        title: page.title,
        summary: page.summary || null,
        cover_url: page.cover_url || null,
        sort_order: page.sort_order ?? 0,
        is_visible: page.is_visible ?? true,
        status: page.status || 'published',
        access_mode: page.access_mode || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, page });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
