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

  // Test dark mode with dismissed welcome modal
  await page.goto('http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'dark');
    localStorage.setItem('app_user_display_name', 'Tùng');
    sessionStorage.setItem('app_user_name_prompted', '1');
    document.documentElement.classList.add('dark');
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  try {
    const btn = page.locator('text=Khám phá ngay');
    if (await btn.isVisible({ timeout: 500 })) {
      await btn.click({ force: true });
    }
  } catch {}
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_home_dark_clean.png' });

  // Switch to light mode
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'light');
    document.documentElement.classList.remove('dark');
    window.dispatchEvent(new Event('giao_dien_changed'));
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_home_light_clean.png' });

  await browser.close();
  console.log('Clean screenshots captured!');
})();
