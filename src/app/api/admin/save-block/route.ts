import { revalidatePath } from 'next/cache';
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
    const { block } = await req.json();
    if (!block || typeof block !== 'object' || !block.page_id) {
      return NextResponse.json({ error: 'Dữ liệu khối không hợp lệ (thiếu page_id)' }, { status: 400 });
    }

    // 1. Chuẩn hóa page_id (bắt buộc phải là UUID hợp lệ trỏ tới bảng pages)
    let resolvedPageId = String(block.page_id).trim();
    if (!isValidUuid(resolvedPageId)) {
      const { data: pageData } = await supabase.from('pages').select('id').or(`id.eq.${resolvedPageId},slug.eq.${resolvedPageId}`).maybeSingle();
      if (!pageData) {
        return NextResponse.json({ error: `Không tìm thấy trang tương ứng (${resolvedPageId})` }, { status: 400 });
      }
      resolvedPageId = pageData.id;
    }

    // 2. Chuẩn hóa block.id: nếu không phải UUID hợp lệ thì tạo mới
    const inputBlockId = block.id ? String(block.id).trim() : '';
    const finalBlockId = isValidUuid(inputBlockId) ? inputBlockId : generateUuid();

    const isFaq = block.type === 'faq';
    const payload = {
      id: finalBlockId,
      workspace_id: block.workspace_id || 'default',
      page_id: resolvedPageId,
      type: isFaq ? 'text' : block.type,
      display_style: isFaq ? 'faq' : block.display_style,
      data: isFaq ? { ...(block.data || {}), __kind: 'faq', __style: block.display_style || 'accordion' } : block.data || {},
      sort_order: block.sort_order ?? 0,
      is_visible: block.is_visible ?? true,
      updated_at: new Date().toISOString(),
    };

    const { data: savedData, error } = await supabase
      .from('blocks')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error) {
      console.error('[Save Block Error]', error);
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua
    }

    const decoded = savedData && isFaq ? { ...savedData, type: 'faq', display_style: block.display_style || 'accordion', data: block.data || {} } : savedData;
    return NextResponse.json({ success: true, block: decoded || { ...payload, ...(isFaq ? { type: 'faq', display_style: block.display_style, data: block.data } : {}) } });
  } catch (err: any) {
    console.error('[Save Block Exception]', err);
    return NextResponse.json({ error: err.message || 'Lỗi hệ thống khi lưu khối' }, { status: 500 });
  }
}
