const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('app_user_display_name', 'Admin');
    sessionStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Tìm nút Xem thử 3D trên sách trang chủ
  const flipbookBtns = page.locator('button:has-text("Xem thử 3D")');
  const count = await flipbookBtns.count();
  console.log('Flipbook buttons found on homepage:', count);

  if (count > 0) {
    await flipbookBtns.first().click({ force: true });
    await page.waitForTimeout(2000);

    // Chụp ảnh trình đọc 3D toàn màn hình
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '453_qa_mobile_flipbook_viewer_open.png'),
    });
    console.log('Saved: 453_qa_mobile_flipbook_viewer_open.png');
  }

  await browser.close();
})();
