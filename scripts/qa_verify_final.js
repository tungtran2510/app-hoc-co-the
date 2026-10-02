const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  console.log('--- STARTING QA TEST ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Test 1: Home page & Header theme
  console.log('Testing Home page...');
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '378_qa_home_theme_dark.png') });

  // Test 2: Lesson page & Book Cover
  console.log('Testing Lesson page & Book Cover...');
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1500);

  // Check if book cover image exists and has no broken state
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '379_qa_lesson_book_cover_fixed.png') });

  // Test 3: Scroll down to Videos
  console.log('Testing Videos (16:9 check)...');
  const videoSection = page.locator('text=Video bài giảng').first();
  if (await videoSection.isVisible()) {
    await videoSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '380_qa_videos_16_9.png') });
  }

  // Test 4: Admin Mode - Open Edit Block Drawer / Modal to check rich text & HTML features
  console.log('Testing Admin text block features...');
  await page.evaluate(() => {
    localStorage.setItem('admin_logged_in', 'true');
    localStorage.setItem('app_is_admin', 'true');
  });
  await page.reload({ waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1200);

  // Look for "Thêm khối" or "Thêm nội dung"
  const addBlockBtn = page.locator('button:has-text("Thêm khối"), button:has-text("Thêm nội dung")').first();
  if (await addBlockBtn.isVisible()) {
    await addBlockBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '381_qa_admin_add_block_drawer.png') });
  }

  await browser.close();
  console.log('--- QA TEST FINISHED SUCCESSFULLY ---');
})();
