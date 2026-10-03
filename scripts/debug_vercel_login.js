const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('response', res => {
    if (res.url().includes('/api/admin/login')) {
      console.log('LOGIN API STATUS:', res.status());
    }
  });
  await page.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  });
  await page.goto('https://app-hoc-co-the.vercel.app/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  const passInput = page.locator('input[type="password"]');
  await passInput.fill('Admin@2026!');
  const submitBtn = page.locator('button:has-text("Vào chế độ chỉnh sửa")');
  console.log('Submit button visible?:', await submitBtn.isVisible());
  await submitBtn.click();
  await page.waitForTimeout(4000);
  console.log('Current URL:', page.url());
  const errorText = await page.evaluate(() => document.body.innerText);
  console.log('Body Text snippet:', errorText.slice(0, 300));
  await browser.close();
})();
