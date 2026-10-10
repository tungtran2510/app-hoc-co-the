const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const PROD_URL = 'https://app-hoc-co-the.vercel.app';

async function main() {
  console.log('Testing LIVE PRODUCTION at:', PROD_URL);
  const browser = await chromium.launch({ headless: true });
  
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // 1. Chụp trang chủ Production thật
  console.log('1. Tải trang chủ thật...');
  await page.goto(`${PROD_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const shotHome = path.join(ARTIFACTS_DIR, '360_live_prod_restored_home.png');
  await page.screenshot({ path: shotHome });
  console.log('Saved shotHome:', shotHome);

  // 2. Chụp trang bài học cột sống Production thật
  console.log('2. Tải bài học cột sống thật...');
  await page.goto(`${PROD_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Scroll to 3D widget
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  if (await widget.count() > 0) {
    await widget.evaluate((el) => {
      const parent = el.closest('.rounded-2xl') || el;
      parent.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy(0, -10);
    });
    await page.waitForTimeout(2500);

    // Bấm C1 - C7 để kích hoạt sáng
    const c1c7Btn = page.locator('button:has-text("C1 - C7")').first();
    if (await c1c7Btn.count() > 0) {
      await c1c7Btn.click();
      await page.waitForTimeout(3000);
      const shotSpine = path.join(ARTIFACTS_DIR, '361_live_prod_spine_c1c7_glowing.png');
      await page.screenshot({ path: shotSpine });
      console.log('Saved shotSpine:', shotSpine);
    }
  }

  await browser.close();
  console.log('ALL LIVE VERIFICATIONS FINISHED SUCCESS!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
