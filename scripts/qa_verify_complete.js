const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('=== TEST 1: LIGHT MODE INITIAL LOAD ===');
  await page.goto('http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' });
  // Skip splash if visible
  try {
    const btn = page.locator('text=Khám phá ngay');
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
    }
  } catch {}
  await page.waitForTimeout(1500);

  let lightMetas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ id: e.id, content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Light Mode Metas (Expected: strictly 1 meta with #FFFFFF, no media):', lightMetas);
  if (lightMetas.length !== 1 || lightMetas[0].content !== '#FFFFFF' || lightMetas[0].media !== null) {
    console.error('FAIL: Light mode theme-color meta is invalid!', lightMetas);
  } else {
    console.log('PASS: Light mode theme-color meta is exactly 1 with #FFFFFF!');
  }

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_verified_light_home.png' });

  console.log('\n=== TEST 2: SWITCH TO DARK MODE ===');
  // Click theme toggle button in header
  const themeBtn = page.locator('button[title*="giao diện"]').first();
  if (await themeBtn.isVisible()) {
    await themeBtn.click();
  } else {
    await page.evaluate(() => {
      localStorage.setItem('giao_dien', 'dark');
      document.documentElement.classList.add('dark');
      window.dispatchEvent(new Event('giao_dien_changed'));
    });
  }
  await page.waitForTimeout(1000);

  let darkMetas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ id: e.id, content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Dark Mode Metas (Expected: strictly 1 meta with #0C0817, no media):', darkMetas);
  if (darkMetas.length !== 1 || darkMetas[0].content !== '#0C0817' || darkMetas[0].media !== null) {
    console.error('FAIL: Dark mode theme-color meta is invalid!', darkMetas);
  } else {
    console.log('PASS: Dark mode theme-color meta is exactly 1 with #0C0817!');
  }

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_verified_dark_home.png' });

  console.log('\n=== TEST 3: RELOAD IN DARK MODE (SSR / Direct visit) ===');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  let reloadedDarkMetas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ id: e.id, content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Reloaded Dark Metas:', reloadedDarkMetas);
  if (reloadedDarkMetas.length !== 1 || reloadedDarkMetas[0].content !== '#0C0817') {
    console.error('FAIL: Reloaded dark mode theme-color is invalid!', reloadedDarkMetas);
  } else {
    console.log('PASS: Reloaded dark mode theme-color is exactly #0C0817!');
  }

  console.log('\n=== TEST 4: CHECK CONTINUE CARD & PWA BANNER STYLES ===');
  const cardBorder = await page.evaluate(() => {
    const card = document.querySelector('a[aria-label*="Xem tiếp"]');
    if (!card) return 'not found';
    return {
      borderLeftColor: window.getComputedStyle(card).borderLeftColor,
      borderLeftWidth: window.getComputedStyle(card).borderLeftWidth,
    };
  });
  console.log('ContinueCard Left Border Style:', cardBorder);

  console.log('\n=== TEST 5: CHECK LESSON VIEWER (CONTENTVIEWER) ===');
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  let lessonMetas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ id: e.id, content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Lesson Viewer Metas:', lessonMetas);
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_verified_lesson_viewer.png' });

  await browser.close();
  console.log('\n=== ALL BROWSER THEME TESTS FINISHED! ===');
})();
