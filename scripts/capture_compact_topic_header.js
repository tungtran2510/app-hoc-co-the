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

  // Seed learning progress for cot-song
  await page.goto('http://localhost:3270/cot-song', { waitUntil: 'domcontentloaded' });
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

  // Capture compact top header on mobile (390x844)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '168_mobile_cot_song_compact_header.png'),
  });
  console.log('Saved 168_mobile_cot_song_compact_header.png');

  await browser.close();
  console.log('Finished capturing!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
