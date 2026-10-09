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

  console.log('Navigating to live production: https://app-hoc-co-the.vercel.app/chuyen-de ...');
  await page.goto('https://app-hoc-co-the.vercel.app/chuyen-de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Overview of FAQ section
  const faqHeading = page.locator('#all-topics-faq-heading');
  await faqHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '151_live_vercel_chuyen_de_all_faqs.png'),
  });
  console.log('Saved 151_live_vercel_chuyen_de_all_faqs.png');

  // 2. Click "⭐ Chung & Tổng quát" tab
  const chungTab = page.locator('button[role="tab"]:has-text("Chung & Tổng quát")');
  await chungTab.click();
  await page.waitForTimeout(400);

  // Click Q1 in Chung
  const q1Chung = page.locator('button:has-text("Cơ thể người có khả năng tự chữa lành")');
  await q1Chung.click();
  await page.waitForTimeout(500);

  await page.locator('text=Điểm cốt lõi:').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '152_live_vercel_chuyen_de_faq_chung_expanded.png'),
  });
  console.log('Saved 152_live_vercel_chuyen_de_faq_chung_expanded.png');

  // 3. Click "🦴 Cột sống" tab
  const cotSongTab = page.locator('button[role="tab"]:has-text("Cột sống")');
  await cotSongTab.click();
  await page.waitForTimeout(400);

  // Click Q1 in Cot song
  const q1CotSong = page.locator('button:has-text("Tại sao nằm ngửa thẳng chân lại đau")');
  await q1CotSong.click();
  await page.waitForTimeout(500);

  await page.locator('text=Bài 02: Đĩa đệm').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '153_live_vercel_chuyen_de_faq_cot_song_expanded.png'),
  });
  console.log('Saved 153_live_vercel_chuyen_de_faq_cot_song_expanded.png');

  await browser.close();
  console.log('Done capturing live production screenshots!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
