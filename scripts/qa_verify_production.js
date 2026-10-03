const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('Testing LIVE PRODUCTION: https://app-hoc-co-the.vercel.app');
  await page.goto('https://app-hoc-co-the.vercel.app', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Check initial meta tags
  let metas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ id: e.id, content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Production Default Metas:', JSON.stringify(metas));

  // Dismiss splash
  try {
    const btn = page.locator('text=Khám phá ngay');
    if (await btn.isVisible({ timeout: 1500 })) {
      await btn.click({ force: true });
    }
  } catch {}
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_production_live_light.png' });

  // Switch to dark mode
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'dark');
    localStorage.setItem('app_user_display_name', 'Tùng');
    sessionStorage.setItem('app_user_name_prompted', '1');
    document.documentElement.classList.add('dark');
    window.dispatchEvent(new Event('giao_dien_changed'));
  });
  await page.waitForTimeout(1000);

  metas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ id: e.id, content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Production Dark Metas:', JSON.stringify(metas));

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_production_live_dark.png' });

  await browser.close();
  console.log('Production verification complete!');
})();
