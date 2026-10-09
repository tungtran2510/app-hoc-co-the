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

  console.log('Navigating to http://localhost:3270/chuyen-de ...');
  await page.goto('http://localhost:3270/chuyen-de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  // 1. Overview of FAQ section
  const faqHeading = page.locator('#all-topics-faq-heading');
  await faqHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '147_mobile_chuyen_de_all_faqs.png'),
  });
  console.log('Saved 147_mobile_chuyen_de_all_faqs.png');

  // 2. Click "⭐ Chung & Tổng quát" tab
  const chungTab = page.locator('button[role="tab"]:has-text("Chung & Tổng quát")');
  await chungTab.click();
  await page.waitForTimeout(400);

  // Click Q1 in Chung
  const q1Chung = page.locator('button:has-text("Cơ thể người có khả năng tự chữa lành")');
  await q1Chung.click();
  await page.waitForTimeout(500);

  // Scroll so the takeaway and content are centered
  await page.locator('text=Điểm cốt lõi:').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '148_mobile_chuyen_de_faq_chung_expanded.png'),
  });
  console.log('Saved 148_mobile_chuyen_de_faq_chung_expanded.png');

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
    path: path.join(ARTIFACT_DIR, '149_mobile_chuyen_de_faq_cot_song_filter.png'),
  });
  console.log('Saved 149_mobile_chuyen_de_faq_cot_song_filter.png');

  // 4. Click "💧 Nước & Điện giải" tab
  const nuocTab = page.locator('button[role="tab"]:has-text("Nước & Điện giải")');
  await nuocTab.click();
  await page.waitForTimeout(400);

  // Click Q1 in Nuoc
  const q1Nuoc = page.locator('button:has-text("Công thức tính lượng nước uống chuẩn")');
  await q1Nuoc.click();
  await page.waitForTimeout(500);

  await page.locator('text=Điểm cốt lõi:').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '150_mobile_chuyen_de_faq_nuoc_filter.png'),
  });
  console.log('Saved 150_mobile_chuyen_de_faq_nuoc_filter.png');

  await browser.close();
  console.log('Done capturing all screenshots!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
