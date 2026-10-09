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
  // Bật dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme_mode', 'dark');
  });
  await page.waitForTimeout(300);

  // Cuộn tới tác giả trong dark mode
  const authorCard = await page.$('text=TÙNG DINH DƯỠNG');
  if (authorCard) {
    await authorCard.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -60));
    await page.waitForTimeout(400);

    const shot1 = path.join(ARTIFACTS_DIR, '253_author_profile_dark.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`Saved: ${shot1}`);
  }

  // Cuộn tới sách trong dark mode
  const bookHeader = await page.$('text=Sách & Tác phẩm đã làm');
  if (bookHeader) {
    await bookHeader.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -20));
    await page.waitForTimeout(400);

    const shot2 = path.join(ARTIFACTS_DIR, '254_featured_book_dark.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`Saved: ${shot2}`);
  }

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
