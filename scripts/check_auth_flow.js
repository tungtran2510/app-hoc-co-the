const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('--- 1. Vào /dang-nhap ---');
  await page.goto('http://localhost:3100/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="password"]', 'Admin@2026!');
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('button[type="submit"]'),
  ]);

  console.log('--- 2. Đã redirect về:', page.url());
  const me = await page.evaluate(() => fetch('/api/admin/me').then(r => r.json()));
  console.log('ME RESULT:', me);

  const tokenInLs = await page.evaluate(() => localStorage.getItem('app_admin_token'));
  console.log('TOKEN IN LS:', tokenInLs);

  const cookies = await context.cookies();
  console.log('COOKIES:', cookies.map(c => ({ name: c.name, value: c.value.substring(0, 10) + '...' })));

  await browser.close();
})();
