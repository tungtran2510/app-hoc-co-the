const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const PROD_URL = 'https://app-hoc-co-the.vercel.app';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('Tải trang bài học cột sống...');
  await page.goto(`${PROD_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2500);

  const shotLesson = path.join(ARTIFACTS_DIR, 'prod_lesson_videos.png');
  await page.screenshot({ path: shotLesson });
  console.log('Saved shotLesson:', shotLesson);

  await browser.close();
}

main().catch(console.error);
