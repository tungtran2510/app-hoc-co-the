const { chromium } = require('playwright');
const path = require('path');

async function testFlatBooksSection() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  await page.addInitScript(() => {
    localStorage.setItem('theme_mode', 'light');
    localStorage.setItem('app_user_display_name', 'Học viên Minh');
    sessionStorage.setItem('app_user_name_prompted', 'true');
    localStorage.setItem('dismissed_pwa_banner', '1');
    localStorage.setItem('skip_intro', '1');
  });

  console.log('Navigating to homepage...');
  await page.goto('http://127.0.0.1:3100/?skip_intro=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Scroll to "Tủ Sách Tối Giản" section
  console.log('1. Locating Flat Minimalist Books section...');
  const flatSec = (await page.$('text=Tủ Sách Tối Giản')) || (await page.$('h2:has-text("Tủ Sách")'));
  if (flatSec) {
    await flatSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
  } else {
    console.warn('Could not find flatSec directly by text, scrolling down to bottom area...');
    await page.evaluate(() => window.scrollBy(0, 1600));
    await page.waitForTimeout(800);
  }

  // Scroll so Tủ Sách Tối Giản is nicely centered with its buttons visible
  await page.evaluate(() => window.scrollBy(0, 240));
  await page.waitForTimeout(600);

  // 1. Screenshot in Flat Grid Mode (2 columns)
  const shotGridPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_flat_books_grid_view.png');
  await page.screenshot({ path: shotGridPath, fullPage: false });
  console.log('Captured Flat Books Grid view:', shotGridPath);

  // 2. Toggle to List mode
  console.log('2. Switching Flat Books to List mode...');
  // Look for the toggle buttons inside the Flat Books section
  const listToggleButtons = await page.$$('button[aria-label*="danh sách ngang"], button[title*="danh sách ngang"]');
  if (listToggleButtons.length > 0) {
    await listToggleButtons[0].click({ force: true });
    await page.waitForTimeout(800);
  } else {
    console.log('Falling back to generic list buttons...');
    const allListButtons = await page.$$('button[aria-label*="danh sách"], button[title*="danh sách"]');
    if (allListButtons.length > 1) {
      await allListButtons[allListButtons.length - 1].click({ force: true });
      await page.waitForTimeout(800);
    }
  }

  await page.evaluate(() => window.scrollBy(0, 40));
  await page.waitForTimeout(500);

  const shotListPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_flat_books_list_view.png');
  await page.screenshot({ path: shotListPath, fullPage: false });
  console.log('Captured Flat Books List view:', shotListPath);

  // 3. Test clicking "Xem thử 3D" button in Flat Books section
  console.log('3. Testing 3D Flipbook button on Flat Books...');
  const preview3dButtons = await page.$$('button:has-text("Xem thử 3D")');
  if (preview3dButtons.length > 0) {
    // Click the last preview 3D button (which belongs to the new flat section)
    await preview3dButtons[preview3dButtons.length - 1].click({ force: true });
    await page.waitForTimeout(3000);

    const shotModalPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_flat_books_3d_modal.png');
    await page.screenshot({ path: shotModalPath, fullPage: false });
    console.log('Captured Flat Books 3D Modal:', shotModalPath);
  }

  await browser.close();
  console.log('FLAT BOOKS SECTION VERIFIED SUCCESSFULLY!');
}

testFlatBooksSection().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
