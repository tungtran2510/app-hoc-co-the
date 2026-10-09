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

  // 1. Cuộn tới khối Hồ sơ tác giả
  const authorCard = await page.$('text=TÙNG DINH DƯỠNG');
  if (authorCard) {
    await authorCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    // Cuộn nhẹ lên trên một chút để thấy trọn vẹn cả card tác giả
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.waitForTimeout(400);

    const shot1 = path.join(ARTIFACTS_DIR, '249_author_profile_redesigned.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`Saved: ${shot1}`);
  }

  // 2. Cuộn tới khối Sách & Tác phẩm đã làm (Thư viện tác phẩm + Cuốn nổi bật đầu tiên)
  const bookHeader = await page.$('text=Sách & Tác phẩm đã làm');
  if (bookHeader) {
    await bookHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollBy(0, -20));
    await page.waitForTimeout(400);

    const shot2 = path.join(ARTIFACTS_DIR, '250_featured_book_redesigned.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`Saved: ${shot2}`);
  }

  // 3. Cuộn tiếp xuống phần Các tác phẩm khác (Lưới 2 cột sách)
  const otherBooks = await page.$('text=Các tác phẩm khác');
  if (otherBooks) {
    await otherBooks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.evaluate(() => window.scrollBy(0, -10));
    await page.waitForTimeout(400);

    const shot3 = path.join(ARTIFACTS_DIR, '251_other_books_grid_redesigned.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`Saved: ${shot3}`);
  }

  await context.close();
  await browser.close();
  console.log('Capture finished!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
