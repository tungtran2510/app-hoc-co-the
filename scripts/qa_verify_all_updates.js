const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile Home Page (390px) showing PWA Install Banner
  const mHomeCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mHomePage = await mHomeCtx.newPage();
  await mHomePage.goto('http://127.0.0.1:3100/?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mHomePage.waitForTimeout(3000);
  await mHomePage.screenshot({ path: path.join(ARTIFACT_DIR, '360_qa_mobile_pwa_banner.png') });
  console.log('OK 360 mobile pwa banner');
  await mHomeCtx.close();

  // 2. Mobile Lesson Page (390px) showing clean book casing
  const mLessonCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mLessonPage = await mLessonCtx.newPage();
  await mLessonPage.addInitScript(() => { localStorage.setItem('qbiz_books_intro_seen', '1'); });
  await mLessonPage.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mLessonPage.waitForTimeout(3500);

  // Scroll to book section
  await mLessonPage.evaluate(() => {
    const el = document.querySelector('[aria-label*="Mở đọc"]') || document.querySelector('img[alt="Bìa sách"]');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await mLessonPage.waitForTimeout(600);
  await mLessonPage.screenshot({ path: path.join(ARTIFACT_DIR, '361_qa_mobile_clean_book_casing.png') });
  console.log('OK 361 mobile clean book casing');
  await mLessonCtx.close();

  // 3. iPad Lesson Page (820px) showing clean book casing
  const iPadCtx = await browser.newContext({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 });
  const iPadPage = await iPadCtx.newPage();
  await iPadPage.addInitScript(() => { localStorage.setItem('qbiz_books_intro_seen', '1'); });
  await iPadPage.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await iPadPage.waitForTimeout(3500);

  await iPadPage.evaluate(() => {
    const el = document.querySelector('[aria-label*="Mở đọc"]') || document.querySelector('img[alt="Bìa sách"]');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await iPadPage.waitForTimeout(600);
  await iPadPage.screenshot({ path: path.join(ARTIFACT_DIR, '362_qa_ipad_clean_book_casing.png') });
  console.log('OK 362 iPad clean book casing');
  await iPadCtx.close();

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED');
})();
