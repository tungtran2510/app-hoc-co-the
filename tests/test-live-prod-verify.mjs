import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const startTime = Date.now();
  console.log('Navigating to canonical domain: https://app-hoc-co-the.vercel.app/ ...');
  await page.goto('https://app-hoc-co-the.vercel.app/', { waitUntil: 'networkidle', timeout: 30000 });
  const duration = Date.now() - startTime;
  console.log(`[PROD SPEED] Loaded homepage in: ${duration}ms`);

  // 1. Featured Slide (Nổi bật trong tuần)
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1000);
  const shot1 = path.join(ARTIFACTS_DIR, '265_live_prod_featured_slide.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log(`Saved: ${shot1}`);

  // 2. Featured Book (Sách nổi bật & Action buttons)
  await page.evaluate(() => window.scrollBy(0, 1150));
  await page.waitForTimeout(800);
  const shot2 = path.join(ARTIFACTS_DIR, '270_live_prod_featured_book_card.png');
  await page.screenshot({ path: shot2, fullPage: false });
  console.log(`Saved: ${shot2}`);

  // 3. Other books grid / list
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForTimeout(800);
  const shot3 = path.join(ARTIFACTS_DIR, '272_live_prod_all_books.png');
  await page.screenshot({ path: shot3, fullPage: false });
  console.log(`Saved: ${shot3}`);

  await context.close();
  await browser.close();
  console.log('Live verification complete!');
}

run().catch((err) => {
  console.error('Error during test:', err);
  process.exit(1);
});
