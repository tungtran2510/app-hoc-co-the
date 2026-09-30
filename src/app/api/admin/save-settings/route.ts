import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { checkIsAdminRequest } from '../../../../lib/authServer';
import { getSupabaseServer } from '../../../../lib/supabaseServer';
import { clearDataCache } from '../../../../lib/data';

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

    // Lấy bản ghi hiện tại để merge an toàn
    const { data: existing } = await supabase
      .from('settings')
      .select('*')
      .eq('workspace_id', settings.workspace_id || 'default')
      .maybeSingle();

    const existingBlockStyles = existing?.block_styles || {};
    const updatedBlockStyles = {
      ...existingBlockStyles,
      ...(settings.block_styles || {}),
      app_subtitle: settings.app_subtitle !== undefined ? settings.app_subtitle : (existingBlockStyles.app_subtitle ?? 'Kiến thức đúng · Sức khỏe bền vững'),
      home_greeting: settings.home_greeting !== undefined ? settings.home_greeting : (existingBlockStyles.home_greeting ?? 'Xin chào!'),
      home_title: settings.home_title !== undefined ? settings.home_title : (existingBlockStyles.home_title ?? 'Hôm nay mình học gì?'),
      search_placeholder: settings.search_placeholder !== undefined ? settings.search_placeholder : (existingBlockStyles.search_placeholder ?? 'Tìm bài, ví dụ: đĩa đệm'),
      topics_title: settings.topics_title !== undefined ? settings.topics_title : (existingBlockStyles.topics_title ?? 'Chọn chủ đề'),
      recommended_books_title: settings.recommended_books_title !== undefined ? settings.recommended_books_title : (existingBlockStyles.recommended_books_title ?? 'Sách nên đọc'),
      recommended_books_subtitle: settings.recommended_books_subtitle !== undefined ? settings.recommended_books_subtitle : (existingBlockStyles.recommended_books_subtitle ?? 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'),
      recommended_books: settings.recommended_books !== undefined ? settings.recommended_books : (existingBlockStyles.recommended_books ?? []),
      recommended_books_layout: settings.recommended_books_layout !== undefined ? settings.recommended_books_layout : (existingBlockStyles.recommended_books_layout ?? 'grid'),
      home_sections_order: settings.home_sections_order !== undefined ? settings.home_sections_order : (existingBlockStyles.home_sections_order ?? ['topics', 'author_profile', 'author_books', 'author_philosophy', 'author_contact', 'recommended_books']),
      ai_training: settings.ai_training !== undefined ? settings.ai_training : (existingBlockStyles.ai_training ?? null),
    };

    const existingAuthorProfile = existing?.author_profile || {};
    const updatedAuthorProfile = {
      ...existingAuthorProfile,
      ...(settings.author_profile || {}),
      phone: settings.hotline !== undefined ? settings.hotline : (settings.author_profile?.phone ?? existingAuthorProfile.phone ?? existing?.hotline ?? null),
      zalo_url: settings.zalo_url !== undefined ? settings.zalo_url : (settings.author_profile?.zalo_url ?? existingAuthorProfile.zalo_url ?? existing?.zalo_url ?? null),
    };

    const merged = {
      workspace_id: settings.workspace_id || existing?.workspace_id || 'default',
      app_name: settings.app_name ?? existing?.app_name ?? 'Sống Khỏe Mỗi Ngày',
      logo_url: settings.logo_url !== undefined ? settings.logo_url : (existing?.logo_url ?? null),
      primary_color: settings.primary_color ?? existing?.primary_color ?? '#0E6B5A',
      access_mode: settings.access_mode ?? existing?.access_mode ?? 'OPEN',
      block_styles: updatedBlockStyles,
      expert_title: settings.expert_title !== undefined ? settings.expert_title : (existing?.expert_title ?? null),
      hotline: settings.hotline !== undefined ? settings.hotline : (existing?.hotline ?? null),
      zalo_url: settings.zalo_url !== undefined ? settings.zalo_url : (existing?.zalo_url ?? null),
      author_profile: updatedAuthorProfile,
      admin_password: settings.admin_password ?? existing?.admin_password ?? null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('settings').upsert(merged, { onConflict: 'workspace_id' });

    if (error) {
      return NextResponse.json({ error: error.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
    }

    // Xóa bộ nhớ đệm và kích hoạt revalidate các trang
    try {
      clearDataCache();
      revalidatePath('/');
      revalidatePath('/', 'layout');
      revalidatePath('/tro-ly-ai');
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...merged,
        app_subtitle: updatedBlockStyles.app_subtitle,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
