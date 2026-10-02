const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch({ headless: true });

  const mLessonCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mLessonPage = await mLessonCtx.newPage();
  await mLessonPage.addInitScript(() => { localStorage.setItem('qbiz_books_intro_seen', '1'); });
  await mLessonPage.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mLessonPage.waitForTimeout(3000);

  // Focus on the video syllabus list using Playwright locator
  const tabBtn = mLessonPage.locator('text=Giáo trình').first();
  if (await tabBtn.count() > 0) {
    await tabBtn.scrollIntoViewIfNeeded();
  }
  await mLessonPage.waitForTimeout(600);
  await mLessonPage.screenshot({ path: path.join(ARTIFACT_DIR, '363_qa_compact_video_list.png') });
  console.log('OK 363 compact video list');

  await browser.close();
})();
