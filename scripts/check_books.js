const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });

  // Scroll down to books section
  const booksHeader = page.locator('text=Sách & Tác phẩm đã làm');
  await booksHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const screenshotPath = path.join(ARTIFACT_DIR, '161_books_scrolled_view.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved books screenshot:', screenshotPath);

  await browser.close();
})();
