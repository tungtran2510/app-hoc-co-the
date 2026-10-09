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

  // Cuộn xuống hẳn lưới các tác phẩm khác
  const otherBooks = await page.$('text=CÁC TÁC PHẨM KHÁC');
  if (otherBooks) {
    await otherBooks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    // Cuộn thêm 120px xuống dưới để thấy 4 cuốn sách và các nút Xem thử 3D
    await page.evaluate(() => window.scrollBy(0, 150));
    await page.waitForTimeout(600);

    const shot3 = path.join(ARTIFACTS_DIR, '252_other_books_grid_full_view.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`Saved: ${shot3}`);
  }

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
