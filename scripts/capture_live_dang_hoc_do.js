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

  // Navigate first to set origin
  await page.goto('https://app-hoc-co-the.vercel.app/', { waitUntil: 'domcontentloaded' });

  // Set xem_tiep with digestive lesson like user's view
  await page.evaluate(() => {
    localStorage.setItem('xem_tiep', JSON.stringify({
      topic_slug: 'tieu-hoa',
      topic_title: 'Hệ Tiêu Hóa',
      page_slug: 'khoang-mieng-va-da-day',
      page_title: 'Khoang miệng & Dạ dày: Khám phá',
      page_number: 1,
      video_index: 1,
      video_total: 4,
      video_title: '01. Giải phẫu và tổng quan chức năng hệ tiêu hóa',
      cover_url: '/images/topics/tieu-hoa.webp',
      updated_at: Date.now()
    }));
  });

  await page.goto('https://app-hoc-co-the.vercel.app/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const dangHocDoHeading = page.locator('h3:has-text("Đang học dở")');
  await dangHocDoHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '155_live_vercel_dang_hoc_do_compact.png'),
  });
  console.log('Saved 155_live_vercel_dang_hoc_do_compact.png');

  await browser.close();
  console.log('Done!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
