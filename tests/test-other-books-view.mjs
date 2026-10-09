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

  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });

  // Cuộn tới khối Các tác phẩm khác
  const otherBooks = await page.$('text=Các tác phẩm khác');
  if (otherBooks) {
    await otherBooks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // Cuộn xuống thêm 100px để thấy trọn vẹn cả hàng sách bên dưới
    await page.evaluate(() => window.scrollBy(0, 140));
    await page.waitForTimeout(400);

    const shot = path.join(ARTIFACTS_DIR, '260_other_books_grid_view.png');
    await page.screenshot({ path: shot, fullPage: false });
    console.log(`Saved: ${shot}`);
  }

  await context.close();
  await browser.close();
}

run();
