const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

// 8 Topics chuẩn
const TOPIC_IDS = {
  'cot-song': 'a0000000-0000-0000-0000-000000000001',
  'dinh-duong': 'a0000000-0000-0000-0000-000000000002',
  'co-the-nguoi': 'a0000000-0000-0000-0000-000000000005',
  'tieu-hoa': 'a0000000-0000-0000-0000-000000000004',
  'nuoc': 'a0000000-0000-0000-0000-000000000003',
  'noi-tiet-chuyen-hoa': 'a0000000-0000-0000-0000-000000000006',
  'gan-mat-tuy': 'a0000000-0000-0000-0000-000000000007',
  'mien-dich': 'a0000000-0000-0000-0000-000000000008',
};

async function sync() {
  console.log('=== BẮT ĐẦU CHUẨN HÓA 48 BÀI HỌC VÀ VIDEO ĐẦY ĐỦ 100% ===');
  const crawledData = JSON.parse(fs.readFileSync('scripts/crawled_48_videos.json', 'utf-8'));

  // 1. Lấy toàn bộ pages hiện tại từ Supabase
  const { data: allPages, error: pagesFetchErr } = await supabase.from('pages').select('*');
  if (pagesFetchErr) {
    console.error('Lỗi lấy pages:', pagesFetchErr.message);
    return;
  }
  console.log(`Tìm thấy ${allPages.length} pages trong Supabase.`);

  // 2. Lấy toàn bộ blocks hiện tại
  const { data: allBlocks, error: blocksFetchErr } = await supabase.from('blocks').select('*');
  if (blocksFetchErr) {
    console.error('Lỗi lấy blocks:', blocksFetchErr.message);
    return;
  }
  console.log(`Tìm thấy ${allBlocks.length} blocks trong Supabase.`);

  let syncedPagesCount = 0;
  let syncedBlocksCount = 0;

  for (const [topicSlug, lessons] of Object.entries(crawledData)) {
    const topicId = TOPIC_IDS[topicSlug];
    console.log(`\n================= XỬ LÝ CHUYÊN ĐỀ: ${topicSlug.toUpperCase()} =================`);

    // Danh sách pages của topic này trong DB
    const existingTopicPages = allPages.filter((p) => p.topic_id === topicId);
    const validSlugs = new Set(lessons.map((l) => l.slug));

    // Dọn dẹp các page rác/trùng slug không hợp lệ của topic này
    for (const ep of existingTopicPages) {
      if (!validSlugs.has(ep.slug)) {
        console.log(`- Xóa bài học thừa/trùng không dùng: ${ep.slug} (${ep.id})`);
        await supabase.from('blocks').delete().eq('page_id', ep.id);
        await supabase.from('pages').delete().eq('id', ep.id);
      }
    }

    let sortOrder = 1;
    for (const item of lessons) {
      // Tìm page theo slug hoặc tạo mới
      let targetPage = existingTopicPages.find((p) => p.slug === item.slug);

      if (targetPage) {
        // Cập nhật page đã có
        const { error: updErr } = await supabase
          .from('pages')
          .update({
            title: item.title,
            summary: item.summary,
            cover_url: item.thumbnail_url, // ẢNH KHÁC BIỆT 100% TỪ YOUTUBE
            sort_order: sortOrder,
            is_visible: true,
            status: 'published',
            updated_at: new Date().toISOString(),
          })
          .eq('id', targetPage.id);

        if (updErr) console.error(`Lỗi cập nhật page ${item.slug}:`, updErr.message);
      } else {
        // Tạo page mới với UUID chuẩn
        const newPageId = crypto.randomUUID();
        const { data: inserted, error: insErr } = await supabase
          .from('pages')
          .insert({
            id: newPageId,
            workspace_id: 'default',
            topic_id: topicId,
            slug: item.slug,
            title: item.title,
            summary: item.summary,
            cover_url: item.thumbnail_url, // ẢNH KHÁC BIỆT 100% TỪ YOUTUBE
            sort_order: sortOrder,
            is_visible: true,
            status: 'published',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (insErr) {
          console.error(`Lỗi chèn page ${item.slug}:`, insErr.message);
          continue;
        }
        targetPage = inserted;
      }

      syncedPagesCount++;

      // Xử lý Blocks cho targetPage
      const pageBlocks = allBlocks.filter((b) => b.page_id === targetPage.id);
      let vidBlock = pageBlocks.find((b) => b.type === 'videos');
      let txtBlock = pageBlocks.find((b) => b.type === 'text');

      // 1. Upsert/Update Block Videos
      const videoData = {
        videos: [
          {
            title: item.title,
            youtube_id: item.video_id,
            description: item.summary,
            duration_text: '6 phút',
            thumbnail_url: item.thumbnail_url,
          },
        ],
      };

      if (vidBlock) {
        await supabase
          .from('blocks')
          .update({
            data: videoData,
            is_visible: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', vidBlock.id);
      } else {
        await supabase.from('blocks').insert({
          id: crypto.randomUUID(),
          workspace_id: 'default',
          page_id: targetPage.id,
          type: 'videos',
          display_style: 'playlist',
          sort_order: 1,
          is_visible: true,
          data: videoData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      syncedBlocksCount++;

      // 2. Upsert/Update Block Text (Tóm tắt cốt lõi)
      const textData = {
        lines: [
          item.summary,
          `Kiến thức chuyên sâu về ${item.title.toLowerCase()} giúp người học thấu hiểu cơ chế sinh lý và chăm sóc cơ thể chủ động.`,
          `Thực hành và vận dụng những nguyên tắc này mỗi ngày để xây dựng nền tảng sức khỏe vững chắc, phòng ngừa bệnh từ sớm.`,
        ],
        format: 'paragraph',
      };

      if (txtBlock) {
        await supabase
          .from('blocks')
          .update({
            data: textData,
            is_visible: true,
            updated_at: new Date().toISOString(),
          })
          .eq('id', txtBlock.id);
      } else {
        await supabase.from('blocks').insert({
          id: crypto.randomUUID(),
          workspace_id: 'default',
          page_id: targetPage.id,
          type: 'text',
          display_style: 'van_ban',
          sort_order: 2,
          is_visible: true,
          data: textData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      syncedBlocksCount++;

      console.log(`✓ Bài 0${sortOrder}: ${item.title} -> Video: [${item.video_id}] -> Ảnh: [${item.thumbnail_url}]`);
      sortOrder++;
    }
  }

  console.log(`\n🎉 HOÀN TẤT CHUẨN HÓA:`);
  console.log(`- Tổng số bài học (Pages) chuẩn hóa: ${syncedPagesCount} / 48`);
  console.log(`- Tổng số khối nội dung (Blocks) cập nhật: ${syncedBlocksCount}`);
}

sync();
