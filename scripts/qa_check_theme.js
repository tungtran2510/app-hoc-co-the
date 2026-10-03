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

  // Test light mode on home page
  await page.goto('http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' });
  // Skip splash screen
  try {
    const btn = page.locator('text=Khám phá ngay');
    if (await btn.isVisible({ timeout: 2000 })) {
      await btn.click();
    }
  } catch {}
  await page.waitForTimeout(2000);

  let metas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Metas Light Home:', JSON.stringify(metas));
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_home_light.png' });

  // Toggle theme to dark via UI or localStorage
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'dark');
    document.documentElement.classList.add('dark');
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    metas.forEach(m => {
      m.setAttribute('content', '#0C0817');
      m.removeAttribute('media');
    });
    window.dispatchEvent(new Event('giao_dien_changed'));
  });
  await page.waitForTimeout(1000);

  metas = await page.$$eval('meta[name="theme-color"]', els =>
    els.map(e => ({ content: e.getAttribute('content'), media: e.getAttribute('media') }))
  );
  console.log('Metas Dark Home:', JSON.stringify(metas));
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_home_dark.png' });

  await browser.close();
  console.log('Done qa_home!');
})();
