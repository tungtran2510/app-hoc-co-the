const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('app_user_display_name', 'Admin');
    sessionStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const btn = page.locator('button[title="Xem thử 3D"], button:has-text("Xem thử 3D")').first();
  await btn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await btn.click();
  await page.waitForTimeout(2000);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '454_qa_flipbook_opened_success.png'),
  });
  console.log('Saved: 454_qa_flipbook_opened_success.png');

  await browser.close();
})();
