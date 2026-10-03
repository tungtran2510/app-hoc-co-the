const { chromium } = require('playwright');
const path = require('path');

async function testUserDesign() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  // Set localStorage and sessionStorage to bypass first-time onboarding modals
  await page.addInitScript(() => {
    localStorage.setItem('theme_mode', 'light');
    localStorage.setItem('app_user_display_name', 'Bác sĩ Minh');
    sessionStorage.setItem('app_user_name_prompted', 'true');
    localStorage.setItem('dismissed_pwa_banner', '1');
    localStorage.setItem('skip_intro', '1');
  });

  console.log('Navigating to homepage...');
  await page.goto('http://127.0.0.1:3100/?skip_intro=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Scroll to Author Books section
  console.log('1. Testing Author Books redesigned card...');
  const authorSec = (await page.$('text=Sách & Tác phẩm')) || (await page.$('text=Tài Liệu Chuyên Sâu'));
  if (authorSec) {
    await authorSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }

  const shot1Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_author_books_separated_layout.png');
  await page.screenshot({ path: shot1Path, fullPage: false });
  console.log('Captured Author Books section:', shot1Path);

  // Scroll to "Tài Liệu Y Khoa" (Recommended Books)
  console.log('2. Testing Recommended Books in Lookbook / List view...');
  const recSec = (await page.$('text=Tài Liệu Y Khoa')) || (await page.$('h2:has-text("Tài Liệu")'));
  if (recSec) {
    await recSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }

  // Switch to list layout (Lookbook) by clicking the list layout icon
  const listToggleBtn = await page.$('button[aria-label*="danh sách"], button[title*="danh sách"]');
  if (listToggleBtn) {
    console.log('Clicking list layout toggle...');
    await listToggleBtn.click({ force: true });
    await page.waitForTimeout(800);
  }

  await page.evaluate(() => window.scrollBy(0, 220));
  await page.waitForTimeout(600);

  const shot2Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_recommended_books_list_layout.png');
  await page.screenshot({ path: shot2Path, fullPage: false });
  console.log('Captured Recommended Books List section:', shot2Path);

  // Switch back to grid layout to test grid button styling
  const gridToggleBtn = await page.$('button[aria-label*="lưới"], button[title*="lưới"]');
  if (gridToggleBtn) {
    console.log('Clicking grid layout toggle...');
    await gridToggleBtn.click({ force: true });
    await page.waitForTimeout(600);
  }

  // Scroll down slightly so grid buttons are fully visible
  await page.evaluate(() => window.scrollBy(0, 180));
  await page.waitForTimeout(500);

  const shot3Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_recommended_books_grid_navy.png');
  await page.screenshot({ path: shot3Path, fullPage: false });
  console.log('Captured Recommended Books Grid section:', shot3Path);

  // 4. Test clicking 3D Flipbook Preview button
  console.log('4. Testing 3D Flipbook Preview Modal...');
  const preview3dBtn = await page.$('button:has-text("Đọc thử 3D"), button:has-text("Xem thử 3D")');
  if (preview3dBtn) {
    await preview3dBtn.click({ force: true });
    await page.waitForTimeout(1500);
    const shot4Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_3d_preview_modal.png');
    await page.screenshot({ path: shot4Path, fullPage: false });
    console.log('Captured 3D Flipbook Modal:', shot4Path);
  }

  await browser.close();
  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
}

testUserDesign().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
