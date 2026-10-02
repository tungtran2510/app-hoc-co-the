const { createClient } = require('@supabase/supabase-js');
const http = require('http');

const url = 'https://evuhamqlzprrbuabxyyn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV2dWhhbXFsenBycmJ1YWJ4eXluIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDc3ODIxNywiZXhwIjoyMTA2MzU0MjE3fQ.AZ8T_oEHoUxobvOLJ_wFpSx8SH6oEJ-D-ype1zSHqks';
const supabase = createClient(url, key);

function checkUrl(path) {
  return new Promise((resolve) => {
    http.get(`http://127.0.0.1:3100${path}`, (res) => {
      resolve({ path, statusCode: res.statusCode });
    }).on('error', (err) => {
      resolve({ path, statusCode: 0, error: err.message });
    });
  });
}

async function audit() {
  console.log('====================================================');
  console.log('           BẮT ĐẦU AUDIT DỮ LIỆU & LIÊN KẾT        ');
  console.log('====================================================\n');

  // 1. Audit Topics
  const { data: topics, error: tErr } = await supabase
    .from('topics')
    .select('*')
    .order('sort_order', { ascending: true });

  if (tErr) {
    console.error('Lỗi lấy topics:', tErr.message);
    return;
  }
  console.log(`[TOPICS] Tổng số chuyên mục: ${topics.length}`);
  for (const t of topics) {
    console.log(`  - [${t.slug}] ${t.title} (sort: ${t.sort_order}, published: ${t.is_published}, icon: ${t.icon})`);
  }

  // 2. Audit Pages & Blocks
  const { data: pages, error: pErr } = await supabase
    .from('pages')
    .select('*, topic:topics(slug, title)')
    .order('sort_order', { ascending: true });

  if (pErr) {
    console.error('Lỗi lấy pages:', pErr.message);
    return;
  }
  console.log(`\n[PAGES] Tổng số bài học: ${pages.length}`);

  const { data: blocks, error: bErr } = await supabase
    .from('blocks')
    .select('*');

  if (bErr) {
    console.error('Lỗi lấy blocks:', bErr.message);
    return;
  }

  const blocksByPage = {};
  for (const b of blocks) {
    if (!blocksByPage[b.page_id]) blocksByPage[b.page_id] = [];
    blocksByPage[b.page_id].push(b);
  }

  let totalVideos = 0;
  let missingVideosCount = 0;
  let missingThumbCount = 0;
  const topicBreakdown = {};

  for (const page of pages) {
    const topicSlug = page.topic?.slug || 'unknown';
    if (!topicBreakdown[topicSlug]) {
      topicBreakdown[topicSlug] = { name: page.topic?.title, pages: 0, videos: 0 };
    }
    topicBreakdown[topicSlug].pages += 1;

    if (!page.cover_url && !page.thumbnail) missingThumbCount++;

    const pageBlocks = blocksByPage[page.id] || [];
    const videoBlock = pageBlocks.find(b => b.type === 'videos');
    const docBlock = pageBlocks.find(b => b.type === 'medical_documents');

    const vItems = videoBlock?.data?.videos || [];
    topicBreakdown[topicSlug].videos += vItems.length;
    totalVideos += vItems.length;
    if (vItems.length === 0) missingVideosCount++;
  }

  console.log('\n--- Thống kê chi tiết từng chuyên đề ---');
  for (const [slug, stat] of Object.entries(topicBreakdown)) {
    console.log(`  * ${slug} (${stat.name}): ${stat.pages} bài học | ${stat.videos} videos`);
  }
  console.log(`\nTổng video trong hệ thống: ${totalVideos}`);
  console.log(`Bài học thiếu video: ${missingVideosCount}`);
  console.log(`Bài học thiếu thumbnail: ${missingThumbCount}`);

  // 3. Test HTTP Status of all Routes on port 3100
  console.log('\n--- Kiểm tra phản hồi HTTP (Port 3100) ---');
  const staticRoutes = ['/', '/cot-song/tu-the-va-van-dong?v=1', '/da-luu', '/tro-ly-ai', '/tim-kiem'];
  for (const r of staticRoutes) {
    const res = await checkUrl(r);
    console.log(`  ${r.padEnd(35)} => HTTP ${res.statusCode} ${res.statusCode === 200 ? '✓ PASS' : '✗ FAIL'}`);
  }

  console.log('\n--- Kiểm tra 8 URL Chuyên mục ---');
  for (const t of topics) {
    const r = `/${t.slug}`;
    const res = await checkUrl(r);
    console.log(`  ${r.padEnd(35)} => HTTP ${res.statusCode} ${res.statusCode === 200 ? '✓ PASS' : '✗ FAIL'}`);
  }

  console.log('\n--- Kiểm tra ngẫu nhiên các URL bài học (sample 10 bài) ---');
  const samplePages = pages.slice(0, 10);
  for (const p of samplePages) {
    const r = `/${p.topic.slug}/${p.slug}`;
    const res = await checkUrl(r);
    console.log(`  ${r.padEnd(45)} => HTTP ${res.statusCode} ${res.statusCode === 200 ? '✓ PASS' : '✗ FAIL'}`);
  }

  // 4. Test Medical Documents existence
  console.log('\n--- Kiểm tra tài liệu y khoa PDF ---');
  const docPaths = [
    '/documents/atlas_giai_phau_cot_song_toan_dien.pdf',
    '/documents/bang_tra_cuu_re_than_kinh_cot_song.pdf',
    '/documents/cam_nang_tu_the_vang_bai_tap_lung.pdf',
    '/documents/giao_trinh_y_khoa_tong_quan.pdf',
    '/documents/tieu_chuan_chan_doan_dau_hieu_co_do.pdf'
  ];
  for (const doc of docPaths) {
    const res = await checkUrl(doc);
    console.log(`  ${doc.padEnd(50)} => HTTP ${res.statusCode} ${res.statusCode === 200 ? '✓ PASS' : '✗ FAIL'}`);
  }

  console.log('\n====================================================');
  console.log('              AUDIT DỮ LIỆU HOÀN TẤT               ');
  console.log('====================================================');
}

audit();
