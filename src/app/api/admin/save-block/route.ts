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
    const { block } = await req.json();
    if (!block || !block.page_id) {
      return NextResponse.json({ error: 'Dữ liệu khối không hợp lệ' }, { status: 400 });
    }

    const { error } = await supabase.from('blocks').upsert(
      {
        id: block.id,
        workspace_id: block.workspace_id || 'default',
        page_id: block.page_id,
        type: block.type,
        display_style: block.display_style,
        data: block.data || {},
        sort_order: block.sort_order ?? 0,
        is_visible: block.is_visible ?? true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, block });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
