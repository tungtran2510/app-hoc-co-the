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
    const { topic } = await req.json();
    if (!topic || !topic.title || !topic.slug) {
      return NextResponse.json({ error: 'Dữ liệu chủ đề không hợp lệ' }, { status: 400 });
    }

    const { error } = await supabase.from('topics').upsert(
      {
        id: topic.id,
        workspace_id: topic.workspace_id || 'default',
        slug: topic.slug,
        title: topic.title,
        description: topic.description || null,
        meta_note: topic.meta_note || null,
        cover_url: topic.cover_url || null,
        icon: topic.icon || 'body',
        color_bg: topic.color_bg || '#E3ECF7',
        color_fg: topic.color_fg || '#2D5B94',
        sort_order: topic.sort_order ?? 0,
        is_visible: topic.is_visible ?? true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, topic });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
