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
  await page.goto('https://app-hoc-co-the.vercel.app/', { waitUntil: 'networkidle' });
  const liveLoadDuration = Date.now() - startTime;
  console.log(`[LIVE PROD SPEED] Homepage loaded in: ${liveLoadDuration}ms`);

  // Cuộn xuống phần Chuyên đề & Lộ trình
  await page.evaluate(() => window.scrollBy(0, 360));
  await page.waitForTimeout(600);

  const shot1 = path.join(ARTIFACTS_DIR, '247_live_production_roadmap_independent.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log(`Saved: ${shot1}`);

  // Cuộn tiếp xuống phần Bài nổi bật
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForTimeout(600);

  const shot2 = path.join(ARTIFACTS_DIR, '248_live_production_featured_independent.png');
  await page.screenshot({ path: shot2, fullPage: false });
  console.log(`Saved: ${shot2}`);

  await context.close();
  await browser.close();
  console.log('Live verification complete!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
