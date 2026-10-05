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
      app_subtitle: settings.app_subtitle !== undefined ? settings.app_subtitle : (existingBlockStyles.app_subtitle !== undefined ? existingBlockStyles.app_subtitle : null),
      brand_tagline: settings.brand_tagline !== undefined ? settings.brand_tagline : (existingBlockStyles.brand_tagline !== undefined ? existingBlockStyles.brand_tagline : null),
      home_greeting: settings.home_greeting !== undefined ? settings.home_greeting : (existingBlockStyles.home_greeting ?? 'Xin chào!'),
      home_title: settings.home_title !== undefined ? settings.home_title : (existingBlockStyles.home_title ?? 'Hôm nay mình học gì?'),
      search_placeholder: settings.search_placeholder !== undefined ? settings.search_placeholder : (existingBlockStyles.search_placeholder ?? 'Tìm bài, ví dụ: đĩa đệm'),
      topics_title: settings.topics_title !== undefined ? settings.topics_title : (existingBlockStyles.topics_title ?? 'Chọn chủ đề'),
      recommended_books_title: settings.recommended_books_title !== undefined ? settings.recommended_books_title : (existingBlockStyles.recommended_books_title ?? 'Sách nên đọc'),
      recommended_books_subtitle: settings.recommended_books_subtitle !== undefined ? settings.recommended_books_subtitle : (existingBlockStyles.recommended_books_subtitle ?? 'Tài liệu tham khảo chuyên sâu giúp bạn hiểu và chăm sóc cơ thể mỗi ngày'),
      recommended_books: settings.recommended_books !== undefined ? settings.recommended_books : (existingBlockStyles.recommended_books ?? []),
      recommended_books_layout: settings.recommended_books_layout !== undefined ? settings.recommended_books_layout : (existingBlockStyles.recommended_books_layout ?? 'grid'),
      flat_books_title: settings.flat_books_title !== undefined ? settings.flat_books_title : (existingBlockStyles.flat_books_title ?? 'Tủ Sách Tối Giản'),
      flat_books: settings.flat_books !== undefined ? settings.flat_books : (existingBlockStyles.flat_books ?? []),
      home_sections_order: settings.home_sections_order !== undefined ? settings.home_sections_order : (existingBlockStyles.home_sections_order ?? ['brand_card', 'topics', 'recent_activity', 'author_profile', 'author_books', 'author_philosophy', 'recommended_books', 'flat_books', 'author_contact']),
      hidden_home_sections: settings.hidden_home_sections !== undefined ? settings.hidden_home_sections : (existingBlockStyles.hidden_home_sections ?? []),
      ai_training: (settings.ai_training && typeof settings.ai_training === 'object' && ('guidelines' in settings.ai_training || 'documents' in settings.ai_training || 'faqs' in settings.ai_training))
        ? settings.ai_training
        : (existingBlockStyles.ai_training ?? null),
      welcome_title: settings.welcome_title !== undefined ? settings.welcome_title : (existingBlockStyles.welcome_title ?? 'Chào mừng bạn đến với Qbiz Books'),
      welcome_message: settings.welcome_message !== undefined ? settings.welcome_message : (existingBlockStyles.welcome_message ?? 'Hi vọng nền tảng học hiểu cơ thể và chăm sóc sức khỏe chủ động này sẽ giúp bạn hiểu sâu hơn về cơ thể mình, nuôi dưỡng hệ cơ xương khớp và sống khỏe mỗi ngày.'),
      welcome_video_url: settings.welcome_video_url !== undefined ? settings.welcome_video_url : (existingBlockStyles.welcome_video_url ?? null),
      home_custom_blocks: settings.home_custom_blocks !== undefined ? settings.home_custom_blocks : (existingBlockStyles.home_custom_blocks ?? {}),
      topics_display: settings.topics_display !== undefined ? settings.topics_display : (existingBlockStyles.topics_display ?? 'card'),
      home_topics_display: settings.home_topics_display !== undefined ? settings.home_topics_display : (existingBlockStyles.home_topics_display ?? existingBlockStyles.topics_display ?? 'card'),
      topics_page_display: settings.topics_page_display !== undefined ? settings.topics_page_display : (existingBlockStyles.topics_page_display ?? existingBlockStyles.topics_display ?? 'card'),
      featured_topic_ids: settings.featured_topic_ids !== undefined ? settings.featured_topic_ids : (existingBlockStyles.featured_topic_ids ?? []),
      topics_description: settings.topics_description !== undefined ? settings.topics_description : (existingBlockStyles.topics_description ?? null),
      topics_guide: settings.topics_guide !== undefined ? settings.topics_guide : (existingBlockStyles.topics_guide ?? null),
    };

    const existingAuthorProfile = existing?.author_profile || {};
    
    // Đồng bộ 2 chiều hoàn hảo giữa settings.hotline/zalo_url và author_profile.phone/zalo_url
    const finalHotline = settings.hotline !== undefined 
      ? settings.hotline 
      : (settings.author_profile?.phone !== undefined ? settings.author_profile.phone : (existing?.hotline ?? existingAuthorProfile.phone ?? '0974.248.716'));

    const finalZaloUrl = settings.zalo_url !== undefined 
      ? settings.zalo_url 
      : (settings.author_profile?.zalo_url !== undefined ? settings.author_profile.zalo_url : (existing?.zalo_url ?? existingAuthorProfile.zalo_url ?? 'https://zalo.me/0987792400'));

    const updatedAuthorProfile = {
      ...existingAuthorProfile,
      ...(settings.author_profile || {}),
      phone: finalHotline,
      zalo_url: finalZaloUrl,
    };

    const merged = {
      workspace_id: settings.workspace_id || existing?.workspace_id || 'default',
      app_name: settings.app_name ?? existing?.app_name ?? 'Qbiz Books',
      logo_url: settings.logo_url !== undefined ? settings.logo_url : (existing?.logo_url ?? null),
      primary_color: settings.primary_color ?? existing?.primary_color ?? '#0C0817',
      access_mode: settings.access_mode ?? existing?.access_mode ?? 'OPEN',
      block_styles: updatedBlockStyles,
      expert_title: settings.expert_title !== undefined ? settings.expert_title : (existing?.expert_title ?? null),
      hotline: finalHotline,
      zalo_url: finalZaloUrl,
      author_profile: updatedAuthorProfile,
      admin_password: existing?.admin_password ?? null,
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
      revalidatePath('/chuyen-de');
      revalidatePath('/tro-ly-ai');
    } catch {
      // Bỏ qua
    }

    return NextResponse.json({
      success: true,
      settings: {
        ...merged,
        app_subtitle: updatedBlockStyles.app_subtitle,
        brand_tagline: updatedBlockStyles.brand_tagline,
        recommended_books_title: updatedBlockStyles.recommended_books_title,
        recommended_books_subtitle: updatedBlockStyles.recommended_books_subtitle,
        recommended_books: updatedBlockStyles.recommended_books,
        recommended_books_layout: updatedBlockStyles.recommended_books_layout,
        flat_books_title: updatedBlockStyles.flat_books_title,
        flat_books: updatedBlockStyles.flat_books,
        topics_title: updatedBlockStyles.topics_title,
        home_topics_display: updatedBlockStyles.home_topics_display,
        topics_page_display: updatedBlockStyles.topics_page_display,
        featured_topic_ids: updatedBlockStyles.featured_topic_ids,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Chưa lưu được – chưa kết nối dữ liệu' }, { status: 500 });
  }
}
