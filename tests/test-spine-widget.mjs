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

  // Scroll to the Spine 3D Widget section
  const widgetHeader = page.locator('h3:has-text("Mô Hình Cột Sống 3D Xoay Tại Chỗ")');
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, -20));
  await page.waitForTimeout(3000); // Wait for 3D iframe to render

  // 1. Default view: Thắt lưng & Đĩa đệm (L1-L5)
  const shot1 = path.join(ARTIFACTS_DIR, '278_lesson_spine_3d_widget_lumbar.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log(`Saved: ${shot1}`);

  // 2. Click segment: Đốt Sống Cổ (C1 - C7)
  const cervicalBtn = page.locator('button:has-text("Đốt Sống Cổ")');
  if (await cervicalBtn.count() > 0) {
    await cervicalBtn.click();
    await page.waitForTimeout(3000);
    const shot2 = path.join(ARTIFACTS_DIR, '279_lesson_spine_3d_widget_cervical.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`Saved: ${shot2}`);
  }

  // 3. Click switch front/back view: Đổi mặt trước (Đĩa đệm)
  const toggleDirBtn = page.locator('button:has-text("Mặt sau (Gai sống)")');
  if (await toggleDirBtn.count() > 0) {
    await toggleDirBtn.click();
    await page.waitForTimeout(3000);
    const shot3 = path.join(ARTIFACTS_DIR, '280_lesson_spine_3d_widget_front.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`Saved: ${shot3}`);
  }

  await context.close();
  await browser.close();
  console.log('Spine 3D Widget verification complete!');
}

run().catch((err) => {
  console.error('Error during test:', err);
  process.exit(1);
});
