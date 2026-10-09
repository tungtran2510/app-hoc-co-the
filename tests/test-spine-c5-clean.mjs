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
  await page.waitForTimeout(3000);

  // 1. Scroll to the 3D widget so the frame and top of card are visible
  const widgetHeader = page.locator('text=Mô hình 3D Cột sống').first();
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const shotC5 = path.join(ARTIFACTS_DIR, '284_spine_c5_pointer.png');
  await page.screenshot({ path: shotC5, fullPage: false });
  console.log(`Saved C5 shot: ${shotC5}`);

  // 2. Scroll down 150px to show the full clinical card underneath without navigation overlap
  await page.evaluate(() => window.scrollBy(0, 160));
  await page.waitForTimeout(800);
  const shotDetail = path.join(ARTIFACTS_DIR, '286_spine_clinical_pearls_detail.png');
  await page.screenshot({ path: shotDetail, fullPage: false });
  console.log(`Saved Clinical card shot: ${shotDetail}`);

  // 3. Click L4 - L5 pill to see pointer and lumbar section
  const l4l5Btn = page.locator('button:has-text("L4 - L5")').first();
  if (await l4l5Btn.isVisible()) {
    // Scroll widget back into view
    await widgetHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await l4l5Btn.click();
    await page.waitForTimeout(2500);
    const shotL4L5 = path.join(ARTIFACTS_DIR, '285_spine_l4l5_pointer.png');
    await page.screenshot({ path: shotL4L5, fullPage: false });
    console.log(`Saved L4-L5 shot: ${shotL4L5}`);
  }

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
