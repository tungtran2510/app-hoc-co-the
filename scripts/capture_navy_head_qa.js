const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const artifactDir = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('1. Navigating to Home in Navy Luxury Light Mode (http://localhost:3270/)...');
  await page.goto('http://localhost:3270/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'light');
    localStorage.setItem('qbiz_theme_palette', 'navy_luxury');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('theme-navy-luxury');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // 1. Chụp phần đầu trang: Header + Brand Card + Hoạt động gần đây + Chuyên đề
  const shot1 = path.join(artifactDir, 'navy_head_mobile_qa.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // 2. Chụp với theme default (indigo / chàm y khoa) để kiểm tra tính đồng bộ
  console.log('2. Testing default theme...');
  await page.evaluate(() => {
    localStorage.setItem('qbiz_theme_palette', 'indigo');
    document.documentElement.classList.remove('theme-navy-luxury');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const shot2 = path.join(artifactDir, 'navy_head_default_theme_qa.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 2:', shot2);

  await browser.close();
  console.log('Finished capturing Navy QA screenshots!');
})();
