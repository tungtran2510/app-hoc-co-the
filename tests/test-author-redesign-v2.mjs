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

  // 1. Khối Nổi bật trong tuần (trên đầu)
  const featured = await page.$('text=Nổi bật trong tuần');
  if (featured) {
    await featured.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.waitForTimeout(400);

    const shot1 = path.join(ARTIFACTS_DIR, '261_featured_slide_balanced_tags.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`Saved: ${shot1}`);
  }

  // 2. Khối Sách nổi bật đầu tiên (Hiểu Đúng Về Cột Sống)
  const bookHeader = await page.$('text=Sách & Tác phẩm đã làm');
  if (bookHeader) {
    await bookHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, -20));
    await page.waitForTimeout(400);

    const shot2 = path.join(ARTIFACTS_DIR, '262_featured_book_proportional_buttons.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`Saved: ${shot2}`);
  }

  // 3. Khối Các tác phẩm khác
  const otherBooks = await page.$('text=Các tác phẩm khác');
  if (otherBooks) {
    await otherBooks.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, 140));
    await page.waitForTimeout(400);

    const shot3 = path.join(ARTIFACTS_DIR, '263_other_books_balanced_tags.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`Saved: ${shot3}`);
  }

  // 4. Dark mode
  await page.evaluate(() => document.documentElement.classList.add('dark'));
  await page.waitForTimeout(400);

  if (bookHeader) {
    await bookHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollBy(0, -20));
    await page.waitForTimeout(400);

    const shot4 = path.join(ARTIFACTS_DIR, '264_featured_book_dark_v3.png');
    await page.screenshot({ path: shot4, fullPage: false });
    console.log(`Saved: ${shot4}`);
  }

  await context.close();
  await browser.close();
  console.log('Capture finished!');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
