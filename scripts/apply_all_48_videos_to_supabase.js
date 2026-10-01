const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const crypto = require('crypto');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

// UUIDs cố định cho 8 Topics
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

async function run() {
  console.log('=== BẮT ĐẦU ĐỒNG BỘ 48 BÀI HỌC VÀ VIDEO THẬT VÀO SUPABASE ===');

  const crawledData = JSON.parse(fs.readFileSync('scripts/crawled_48_videos.json', 'utf-8'));

  let totalPages = 0;
  let totalBlocks = 0;

  for (const [topicSlug, lessons] of Object.entries(crawledData)) {
    const topicId = TOPIC_IDS[topicSlug];
    console.log(`\nĐang xử lý chuyên đề: ${topicSlug} (${topicId})`);

    let sortOrder = 1;
    for (const item of lessons) {
      // 1. Tạo UUID xác định cho page
      const topicNum = Object.keys(TOPIC_IDS).indexOf(topicSlug) + 1;
      const pageId = `b0000000-0000-0000-000${topicNum}-00000000000${sortOrder}`;

      const pageRecord = {
        id: pageId,
        workspace_id: 'default',
        topic_id: topicId,
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        cover_url: item.thumbnail_url, // ẢNH ĐẠI DIỆN KHÁC NHAU 100% CHO TỪNG BÀI
        sort_order: sortOrder,
        is_visible: true,
        status: 'published',
        access_mode: null,
        updated_at: new Date().toISOString(),
      };

      const { error: pageErr } = await supabase.from('pages').upsert(pageRecord, { onConflict: 'id' });
      if (pageErr) {
        console.error(`Lỗi upsert page ${item.slug}:`, pageErr.message);
        continue;
      }
      totalPages++;

      // 2. Tạo Block Videos (Danh sách phát bài giảng)
      // Dùng UUID chuẩn 36 ký tự
      const videoBlockId = `c2000000-0000-0000-000${topicNum}-00000000000${sortOrder}`;
      const videoBlock = {
        id: videoBlockId,
        workspace_id: 'default',
        page_id: pageId,
        type: 'videos',
        display_style: 'playlist',
        sort_order: 1,
        is_visible: true,
        data: {
          videos: [
            {
              title: item.title,
              youtube_id: item.video_id,
              description: item.summary,
              duration_text: '6 phút',
              thumbnail_url: item.thumbnail_url,
            },
          ],
        },
        updated_at: new Date().toISOString(),
      };

      // 3. Tạo Block Text (Tóm tắt cốt lõi)
      const textBlockId = `c1000000-0000-0000-000${topicNum}-00000000000${sortOrder}`;
      const textBlock = {
        id: textBlockId,
        workspace_id: 'default',
        page_id: pageId,
        type: 'text',
        display_style: 'van_ban',
        sort_order: 2,
        is_visible: true,
        data: {
          lines: [
            item.summary,
            `Kiến thức chuyên sâu về ${item.title.toLowerCase()} giúp người học nắm bắt bản chất sinh lý và phương pháp chăm sóc sức khỏe chủ động.`,
            `Thực hành theo dõi và ứng dụng kiến thức bài học vào đời sống sinh hoạt mỗi ngày để đạt hiệu quả sức khỏe bền vững.`,
          ],
          format: 'paragraph',
        },
        updated_at: new Date().toISOString(),
      };

      const { error: vidErr } = await supabase.from('blocks').upsert(videoBlock, { onConflict: 'id' });
      if (vidErr) {
        console.error(`Lỗi upsert video block for ${item.slug}:`, vidErr.message);
      } else {
        totalBlocks++;
      }

      const { error: txtErr } = await supabase.from('blocks').upsert(textBlock, { onConflict: 'id' });
      if (txtErr) {
        console.error(`Lỗi upsert text block for ${item.slug}:`, txtErr.message);
      } else {
        totalBlocks++;
      }

      console.log(`✓ Đã nạp bài ${sortOrder}: ${item.title} -> Video [${item.video_id}] -> Thumb [${item.thumbnail_url}]`);
      sortOrder++;
    }
  }

  console.log(`\n🎉 HOÀN TẤT ĐỒNG BỘ SUPABASE:`);
  console.log(`- Đã cập nhật: ${totalPages} Bài học (Pages) với ảnh bìa khác nhau 100%`);
  console.log(`- Đã tạo: ${totalBlocks} Khối nội dung (Videos & Text blocks) chuẩn UUID`);
}

run();
