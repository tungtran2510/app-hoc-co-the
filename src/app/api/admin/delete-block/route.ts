import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { isValidUuid } from '../../../../lib/uuid';

export async function POST(req: NextRequest) {
  if (!checkIsAdminRequest(req)) {
    return NextResponse.json({ error: 'Chưa đăng nhập quyền quản trị' }, { status: 401 });
  }

  const supabase = getSupabaseServer();
  if (!supabase) {
    return NextResponse.json({ error: 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 503 });
  }

  try {
    const { blockId } = await req.json();
    if (!blockId) {
      return NextResponse.json({ error: 'Thiếu blockId' }, { status: 400 });
    }

    const targetId = String(blockId).trim();
    if (!isValidUuid(targetId)) {
      return NextResponse.json({ success: true, message: 'Khối không tồn tại hoặc đã được xóa' });
    }

    const { error } = await supabase.from('blocks').delete().eq('id', targetId);
    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    try {
      const { clearDataCache } = await import('../../../../lib/data');
      clearDataCache();
      revalidatePath('/', 'layout');
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({ success: true, blockId: targetId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
