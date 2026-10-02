const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile viewport 390x844: Check "BÀI LIÊN QUAN" thumbnails
  const mLessonCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mLessonPage = await mLessonCtx.newPage();
  await mLessonPage.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_display_name', 'Mr. Tung');
  });
  await mLessonPage.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mLessonPage.waitForTimeout(2500);

  // Scroll to "BÀI LIÊN QUAN"
  const relatedHeading = mLessonPage.locator('text=BÀI LIÊN QUAN').first();
  if (await relatedHeading.count() > 0) {
    await relatedHeading.scrollIntoViewIfNeeded();
  }
  await mLessonPage.waitForTimeout(800);
  await mLessonPage.screenshot({ path: path.join(ARTIFACT_DIR, '364_qa_related_links_thumbnails.png') });
  console.log('OK 364 related links thumbnails');

  // 2. Mobile viewport 390x844: Check PWA install reminder banner on Home
  const mHomeCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mHomePage = await mHomeCtx.newPage();
  await mHomePage.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_display_name', 'Mr. Tung');
    sessionStorage.removeItem('pwa_banner_dismissed');
  });
  await mHomePage.goto('http://127.0.0.1:3100/?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mHomePage.waitForTimeout(1600); // wait for banner timer (1000ms)
  await mHomePage.screenshot({ path: path.join(ARTIFACT_DIR, '365_qa_pwa_install_reminder_banner.png') });
  console.log('OK 365 PWA install reminder banner');

  // 3. Click "Cài đặt" on the banner to open the PwaInstallModal
  const installBtn = mHomePage.locator('aside[aria-label="Thông báo cài đặt ứng dụng"] button:has-text("Cài đặt")').first();
  if (await installBtn.count() > 0) {
    await installBtn.click();
    await mHomePage.waitForTimeout(600);
    await mHomePage.screenshot({ path: path.join(ARTIFACT_DIR, '366_qa_pwa_install_modal.png') });
    console.log('OK 366 PWA install modal');
  }

  await browser.close();
})();
