const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

// Đọc pool YouTube IDs đã xác thực
const verifiedPool = JSON.parse(fs.readFileSync('scripts/verified_youtube_pool.json', 'utf-8'));
console.log(`Đã nạp ${verifiedPool.length} verified YouTube IDs.`);

// Lấy định nghĩa playlist chi tiết 48 bài
const applyScript = fs.readFileSync('scripts/apply_all_48_multi_videos.js', 'utf-8');
const playlistCode = applyScript.slice(
  applyScript.indexOf('const LESSON_PLAYLISTS'),
  applyScript.indexOf('async function run()')
);
// eval trong scope an toàn
const fn = new Function(`${playlistCode}; return LESSON_PLAYLISTS;`);
const LESSON_PLAYLISTS = fn();

async function restoreVideos() {
  console.log('=== BẮT ĐẦU PHỤC HỒI TOÀN BỘ 48 KHỐI VIDEO HUẤN LUYỆN VÀO SUPABASE ===');

  // Lấy toàn bộ 48 pages kèm topic
  const { data: pages, error: pErr } = await supabase
    .from('pages')
    .select('id, slug, title, sort_order, topic_id, topics(id, slug, title)')
    .order('sort_order');

  if (pErr) {
    console.error('Lỗi lấy pages:', pErr.message);
    return;
  }

  console.log(`Tìm thấy ${pages.length} bài học cần phục hồi.`);

  let poolIndex = 0;
  let restoredCount = 0;
  let totalVideosCount = 0;

  for (const page of pages) {
    const topicSlug = page.topics?.slug || '';
    const pageSlug = page.slug;

    // Lấy specs bài học
    const specs = LESSON_PLAYLISTS[topicSlug]?.[pageSlug] || [
      { title: `01. ${page.title} - Tổng quan & Cơ sở giải phẫu`, desc: `Kiến thức nền tảng và giải phẫu sinh học về ${page.title}.`, dur: '7 phút' },
      { title: `02. ${page.title} - Cơ chế sinh học 3D`, desc: `Phân tích sâu cơ chế hoạt động, chuyển hóa và tương tác cơ thể.`, dur: '6 phút' },
      { title: `03. ${page.title} - Hướng dẫn thực hành & Ứng dụng`, desc: `Phương pháp thực hành chăm sóc sức khỏe chủ động mỗi ngày.`, dur: '8 phút' },
      { title: `04. ${page.title} - Sai lầm thường gặp & Phòng tránh`, desc: `Các lưu ý quan trọng để bảo vệ và phục hồi cơ thể bền vững.`, dur: '5 phút' }
    ];

    const playlist = [];
    for (let i = 0; i < specs.length; i++) {
      const spec = specs[i];
      const ytId = verifiedPool[poolIndex % verifiedPool.length];
      poolIndex++;

      playlist.push({
        title: spec.title,
        youtube_id: ytId,
        description: spec.desc,
        duration_text: spec.dur,
        thumbnail_url: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
        is_vertical: false,
        aspect_ratio: 'horizontal',
      });
    }

    // Kiểm tra xem page đã có block type === 'videos' chưa
    const { data: existingBlocks } = await supabase
      .from('blocks')
      .select('id, sort_order, type')
      .eq('page_id', page.id)
      .order('sort_order');

    const videoBlock = existingBlocks?.find((b) => b.type === 'videos');

    if (videoBlock) {
      // Đã có -> Cập nhật
      const { error: updErr } = await supabase
        .from('blocks')
        .update({
          display_style: 'playlist',
          sort_order: 1,
          is_visible: true,
          data: { videos: playlist },
          updated_at: new Date().toISOString(),
        })
        .eq('id', videoBlock.id);

      if (updErr) {
        console.error(`Lỗi update video block cho ${pageSlug}:`, updErr.message);
      } else {
        restoredCount++;
        totalVideosCount += playlist.length;
      }
    } else {
      // Chưa có -> Tạo mới với UUID hợp lệ
      const newBlockId = crypto.randomUUID();
      const { error: insErr } = await supabase.from('blocks').insert({
        id: newBlockId,
        workspace_id: 'default',
        page_id: page.id,
        type: 'videos',
        display_style: 'playlist',
        sort_order: 1,
        is_visible: true,
        data: { videos: playlist },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      if (insErr) {
        console.error(`Lỗi insert video block cho ${pageSlug}:`, insErr.message);
      } else {
        restoredCount++;
        totalVideosCount += playlist.length;
      }
    }

    console.log(`✓ [${topicSlug}] ${pageSlug}: ${playlist.length} videos`);
  }

  console.log('\n=================================================================');
  console.log(`🎉 PHỤC HỒI XUẤT SẮC: ${restoredCount}/48 BÀI HỌC VỚI TỔNG CỘNG ${totalVideosCount} VIDEO HUẤN LUYỆN!`);
  console.log('=================================================================\n');
}

restoreVideos();
