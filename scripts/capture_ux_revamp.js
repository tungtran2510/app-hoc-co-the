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

  // Test case 1: Single video lesson (light mode)
  await page.goto('http://localhost:3270/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    localStorage.setItem('xem_tiep', JSON.stringify({
      topic_slug: 'cot-song',
      topic_title: 'Cột Sống & Tư Thế',
      page_slug: 'dia-dem-va-giam-xoc',
      page_title: 'Đĩa đệm và cơ chế giảm xóc',
      page_number: 2,
      video_index: 1,
      video_total: 1,
      video_title: '02 - Đĩa đệm và cơ chế giảm xóc',
      cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
      updated_at: Date.now()
    }));
  });

  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '162_mobile_home_reordered_continue_card.png'),
  });
  console.log('Saved 162_mobile_home_reordered_continue_card.png');

  // Test case 2: Multiple videos lesson (light mode)
  await page.evaluate(() => {
    localStorage.setItem('xem_tiep', JSON.stringify({
      topic_slug: 'tieu-hoa',
      topic_title: 'Hệ Tiêu Hóa',
      page_slug: 'khoang-mieng-va-da-day',
      page_title: 'Khoang miệng & Dạ dày',
      page_number: 1,
      video_index: 2,
      video_total: 4,
      video_title: 'Cơ chế co bóp của dạ dày',
      cover_url: '/images/topics/tieu-hoa.webp',
      updated_at: Date.now()
    }));
  });

  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '163_mobile_home_multivideo_continue_card.png'),
  });
  console.log('Saved 163_mobile_home_multivideo_continue_card.png');

  // Test case 3: Dark mode check
  await page.evaluate(() => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(300);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '164_mobile_home_darkmode_continue_card.png'),
  });
  console.log('Saved 164_mobile_home_darkmode_continue_card.png');

  await browser.close();
  console.log('Done all tests!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
