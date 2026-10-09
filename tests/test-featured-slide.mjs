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

  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });

  // Cuộn tới khối Nổi bật trong tuần
  const featured = await page.$('text=Nổi bật trong tuần');
  if (featured) {
    await featured.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.waitForTimeout(400);

    const shot = path.join(ARTIFACTS_DIR, '255_current_featured_slide.png');
    await page.screenshot({ path: shot, fullPage: false });
    console.log(`Saved: ${shot}`);
  }

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
