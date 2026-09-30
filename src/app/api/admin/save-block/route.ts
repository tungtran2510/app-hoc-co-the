import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  try {
    const { block } = await req.json();
    if (!block || !block.page_id) {
      return NextResponse.json({ error: 'Dữ liệu khối không hợp lệ' }, { status: 400 });
    }

    if (supabase) {
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
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, block });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi lưu khối' }, { status: 500 });
  }
}
