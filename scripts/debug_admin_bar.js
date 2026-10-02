const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  });
  await page.goto('http://localhost:3100/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="password"]', 'Admin@2026!');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('button[type="submit"]'),
  ]);
  await page.waitForTimeout(2000);

  const adminBar = await page.$('text=Sẵn sàng');
  console.log('Admin Bar "Sẵn sàng" found?:', !!adminBar);
  if (adminBar) {
    const box = await adminBar.boundingBox();
    console.log('Admin Bar boundingBox:', box);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '420_qa_admin_top_bar_exact.png'), clip: { x: 0, y: 0, width: 375, height: 260 } });
  console.log('Screenshot saved to 420_qa_admin_top_bar_exact.png');
  await browser.close();
})();
