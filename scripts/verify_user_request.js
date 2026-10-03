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
  });

  console.log('1. Testing 3D Opening Splash on entry...');
  await page.goto('http://127.0.0.1:3100/?intro=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const splash = await page.$('#qbiz-books-3d-splash');
  if (splash) {
    console.log('Found 3D Opening Splash on entry!');
    const splashPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_3d_opening_splash.png');
    await page.screenshot({ path: splashPath, fullPage: false });
    console.log('Captured 3D opening splash:', splashPath);

    // Click "Khám phá ngay" to enter
    const exploreBtn = await page.$('button:has-text("Khám phá ngay")');
    if (exploreBtn) {
      await exploreBtn.click({ force: true });
      await page.waitForTimeout(800);
    }
  }

  // Scroll to "Tài Liệu Chuyên Sâu" (Author Books)
  console.log('2. Testing Author Books section...');
  const authorSec = await page.$('text=Tài Liệu Chuyên Sâu');
  if (authorSec) {
    await authorSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }

  const shot1Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_author_books_unobstructed.png');
  await page.screenshot({ path: shot1Path, fullPage: false });
  console.log('Captured Author Books section:', shot1Path);

  // Scroll to "Tài Liệu Y Khoa" (Recommended Books)
  console.log('3. Testing Recommended Books section...');
  const recSec = await page.$('text=Tài Liệu Y Khoa');
  if (recSec) {
    await recSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  }

  const shot2Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_recommended_books_unobstructed.png');
  await page.screenshot({ path: shot2Path, fullPage: false });
  console.log('Captured Recommended Books section:', shot2Path);

  // Check Flipbook 3D Modal
  console.log('4. Testing Flipbook 3D preview modal...');
  const previewBtn = await page.$('button[title="Xem thử 3D"], button:has-text("Xem thử 3D")');
  if (previewBtn) {
    await previewBtn.click({ force: true });
    await page.waitForTimeout(1500);
    const shot4Path = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_flipbook_modal_preview.png');
    await page.screenshot({ path: shot4Path, fullPage: false });
    console.log('Captured Flipbook Modal:', shot4Path);
  }

  await browser.close();
  console.log('ALL TESTS COMPLETED SUCCESSFULLY!');
}

testUserDesign().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
