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

  console.log('Navigating to lesson: http://localhost:3270/cot-song/tong-quan-ve-cot-song ...');
  await page.goto('http://localhost:3270/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Scroll to the Clinical Pearls Card under 3D frame
  const widgetHeader = page.locator('h3:has-text("Mô Hình Cột Sống 3D Xoay Tại Chỗ")');
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 260));
  await page.waitForTimeout(1000);

  const shot = path.join(ARTIFACTS_DIR, '281_lesson_spine_3d_widget_clinical_card.png');
  await page.screenshot({ path: shot, fullPage: false });
  console.log(`Saved: ${shot}`);

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
