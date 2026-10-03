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

  // Test light mode home
  await page.goto('http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500); // Wait for splash to auto-dismiss or click button
  try {
    const btn = page.locator('text=Khám phá ngay');
    if (await btn.isVisible({ timeout: 500 })) {
      await btn.click({ force: true });
    }
  } catch {}
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_home_light_body.png' });

  // Switch to dark mode
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'dark');
    document.documentElement.classList.add('dark');
    window.dispatchEvent(new Event('giao_dien_changed'));
  });
  await page.waitForTimeout(1000);

  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_home_dark_body.png' });

  // Open book edit modal
  const editBtn = page.locator('button:has-text("Sửa")').first();
  if (await editBtn.isVisible()) {
    await editBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/qa_edit_modal_dark.png' });
  }

  await browser.close();
  console.log('Screenshots saved!');
})();
