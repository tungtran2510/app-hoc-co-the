const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Test Case 1: Trang "Đã lưu" (/da-luu)
  await page.goto('http://localhost:3270/da-luu', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('xem_tiep', JSON.stringify({
      topic_slug: 'cot-song',
      topic_title: 'Cột Sống & Tư Thế',
      page_slug: 'dia-dem',
      page_title: 'Đĩa đệm và cơ chế giảm xóc',
      page_number: 2,
      video_index: 2,
      video_total: 5,
      video_title: '02. Rách vòng sợi và thoát vị đĩa đệm chèn ép',
      cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
      updated_at: Date.now()
    }));
  });

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '165_mobile_da_luu_unified_continue.png'),
  });
  console.log('Saved 165_mobile_da_luu_unified_continue.png');

  // Test Case 2: Trang Chi tiết Chuyên Đề (/cot-song)
  await page.goto('http://localhost:3270/cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Capture Header & Lesson List
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '166_mobile_cot_song_active_learning_progress.png'),
  });
  console.log('Saved 166_mobile_cot_song_active_learning_progress.png');

  // Scroll down to see Bottom Achievement Badge
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '167_mobile_cot_song_bottom_badge.png'),
  });
  console.log('Saved 167_mobile_cot_song_bottom_badge.png');

  await browser.close();
  console.log('Verification finished successfully!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
