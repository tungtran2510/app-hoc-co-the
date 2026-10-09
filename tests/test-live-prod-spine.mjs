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

  console.log('Navigating to Live Production: https://app-hoc-co-the.vercel.app/cot-song/tong-quan-ve-cot-song ...');
  await page.goto('https://app-hoc-co-the.vercel.app/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(6000); // Allow 3D GLTF to load

  const widgetHeader = page.locator('text=Mô hình 3D Cột sống').first();
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const shot = path.join(ARTIFACTS_DIR, '297_live_prod_spine_c5_ready.png');
  await page.screenshot({ path: shot, fullPage: false });
  console.log(`Saved: ${shot}`);

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
