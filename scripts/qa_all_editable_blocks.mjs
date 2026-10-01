import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 12/13/14 viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();

  // 1. Đăng nhập Admin
  console.log('Navigating to login...');
  await page.goto('http://localhost:3100/dang-nhap', { waitUntil: 'networkidle' });
  await page.fill('input[type="password"]', 'Admin@2026!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  // 2. Vào trang chủ
  console.log('Visiting homepage as admin in Light Mode...');
  await page.goto('http://localhost:3100/?t=' + Date.now(), { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Chụp ảnh phần đỉnh (Brand card + Controls + Chuyên đề học)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '24_home_brand_card_and_topics_admin_controls.png'),
    fullPage: false,
  });
  console.log('Screenshot 24 captured.');

  // Cuộn xuống phần Sách đã làm & Sách nên đọc
  await page.evaluate(() => window.scrollBy(0, 700));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '25_home_books_individual_move_controls.png'),
    fullPage: false,
  });
  console.log('Screenshot 25 captured.');

  // Cuộn xuống tiếp phần Sách nên đọc (Grid mode)
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '26_home_recommended_books_controls.png'),
    fullPage: false,
  });
  console.log('Screenshot 26 captured.');

  // Bấm mở Modal Sắp xếp thứ tự các khối trang chủ
  console.log('Opening Reorder Home Sections Modal...');
  const reorderBtn = page.locator('button[title*="thứ tự"], button[title*="Sắp xếp"]').first();
  if (await reorderBtn.isVisible()) {
    await reorderBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '27_reorder_home_sections_modal.png'),
      fullPage: false,
    });
    console.log('Screenshot 27 captured.');
  }

  // Chuyển sang Dark Mode
  console.log('Switching to Dark Mode...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  });
  // Đóng modal
  const closeBtn = page.locator('button:has-text("Đóng"), button[aria-label="Đóng"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click();
    await page.waitForTimeout(400);
  } else {
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '28_home_dark_mode_all_sections_movable.png'),
    fullPage: false,
  });
  console.log('Screenshot 28 captured.');

  await browser.close();
  console.log('Done!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
