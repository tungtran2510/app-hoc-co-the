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
    const { settings } = await req.json();
    if (!settings) {
      return NextResponse.json({ error: 'Dữ liệu cài đặt không hợp lệ' }, { status: 400 });
    }

    const { error } = await supabase.from('settings').upsert(
      {
        workspace_id: settings.workspace_id || 'default',
        app_name: settings.app_name || 'Sống Khỏe Mỗi Ngày',
        logo_url: settings.logo_url || null,
        primary_color: settings.primary_color || '#0E6B5A',
        access_mode: settings.access_mode || 'OPEN',
        block_styles: settings.block_styles || {},
        expert_title: settings.expert_title || null,
        hotline: settings.hotline || null,
        zalo_url: settings.zalo_url || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'workspace_id' }
    );

    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
