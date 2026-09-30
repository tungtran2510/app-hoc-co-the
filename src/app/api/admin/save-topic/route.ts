import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { generateUuid, isValidUuid } from '../../../../lib/uuid';

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
    if (!topic || typeof topic !== 'object') {
      return NextResponse.json({ error: 'Dữ liệu chủ đề không hợp lệ' }, { status: 400 });
    }

    const inputTopicId = topic.id ? String(topic.id).trim() : '';
    const hasValidTopicId = isValidUuid(inputTopicId);

    let existingTopic: any = null;
    if (hasValidTopicId) {
      const { data } = await supabase.from('topics').select('*').eq('id', inputTopicId).maybeSingle();
      existingTopic = data;
    }

    if (!existingTopic && topic.slug) {
      const { data } = await supabase.from('topics').select('*').eq('slug', String(topic.slug).trim()).maybeSingle();
      existingTopic = data;
    }

    if (!existingTopic) {
      if (!topic.title?.trim() || !topic.slug?.trim()) {
        return NextResponse.json({ error: 'Vui lòng nhập đầy đủ tiêu đề và slug của chủ đề' }, { status: 400 });
      }
    }

    let finalTopicId = existingTopic?.id;
    if (!finalTopicId) {
      finalTopicId = hasValidTopicId ? inputTopicId : generateUuid();
    }

    const finalSlug = (topic.slug ? String(topic.slug).trim() : existingTopic?.slug) || '';
    const finalTitle = (topic.title ? String(topic.title).trim() : existingTopic?.title) || '';

    const payload = {
      id: finalTopicId,
      workspace_id: topic.workspace_id || existingTopic?.workspace_id || 'default',
      slug: finalSlug,
      title: finalTitle,
      description: topic.description !== undefined ? (topic.description ? String(topic.description).trim() : null) : (existingTopic?.description ?? null),
      meta_note: topic.meta_note !== undefined ? (topic.meta_note ? String(topic.meta_note).trim() : null) : (existingTopic?.meta_note ?? null),
      cover_url: topic.cover_url !== undefined ? (topic.cover_url ? String(topic.cover_url).trim() : null) : (existingTopic?.cover_url ?? null),
      icon: topic.icon || existingTopic?.icon || 'body',
      color_bg: topic.color_bg || existingTopic?.color_bg || '#E3ECF7',
      color_fg: topic.color_fg || existingTopic?.color_fg || '#2D5B94',
      sort_order: topic.sort_order ?? existingTopic?.sort_order ?? 0,
      is_visible: topic.is_visible ?? existingTopic?.is_visible ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data: savedData, error } = await supabase
      .from('topics')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.error('[Save Topic Error]', error);
      if (error.code === '23505') {
        return NextResponse.json({ error: `Đường dẫn tĩnh (slug) "${finalSlug}" đã tồn tại. Vui lòng đổi slug khác.` }, { status: 400 });
      }
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, topic: savedData || payload });
  } catch (err: any) {
    console.error('[Save Topic Exception]', err);
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi lưu chủ đề' }, { status: 500 });
  }
}
