const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto('http://localhost:3080/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Cuộn tới widget 3D
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(3500);

  // Bấm Đĩa đệm
  const discBtn = page.locator('button:has-text("Đĩa đệm")').first();
  await discBtn.click();
  await page.waitForTimeout(2000);

  // Bấm nút "Nhìn trước"
  const lookFrontBtn = page.locator('button:has-text("Nhìn trước")').first();
  if (await lookFrontBtn.count() > 0) {
    console.log('Clicking Nhìn trước...');
    await lookFrontBtn.click();
    await page.waitForTimeout(4000);
  }

  const shot = path.join(ARTIFACTS_DIR, '367_test_disc_front_view.png');
  await page.screenshot({ path: shot });
  console.log('Saved shot 367:', shot);

  await browser.close();
})();
