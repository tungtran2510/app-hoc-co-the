const { chromium } = require('playwright');
const path = require('path');

async function verifyNavyTheme() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:3100/cot-song in LIGHT mode...');
  await page.goto('http://127.0.0.1:3100/cot-song', { waitUntil: 'networkidle' });

  // Ensure light mode (remove dark / gray classes if any)
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark', 'gray');
    localStorage.setItem('theme_mode', 'light');
  });
  await page.waitForTimeout(1000);

  const lightShotPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_light_navy_mobile.png');
  await page.screenshot({ path: lightShotPath, fullPage: false });
  console.log('Light mode screenshot saved to:', lightShotPath);

  // Inspect key elements color
  const styles = await page.evaluate(() => {
    const mainBtn = document.querySelector('a[href*="/cot-song/"]');
    const badge = document.querySelector('span:has-text("CHUYÊN ĐỀ ĐÀO TẠO")') || document.querySelector('section span');
    const backBtn = document.querySelector('nav a[href="/"]');
    const activeBottomNav = document.querySelector('nav[aria-label="Điều hướng chính"] a:has-text("Đang xem")');

    return {
      mainBtnBg: mainBtn ? window.getComputedStyle(mainBtn).backgroundColor : 'not found',
      badgeBg: badge ? window.getComputedStyle(badge).backgroundColor : 'not found',
      backBtnColor: backBtn ? window.getComputedStyle(backBtn).color : 'not found',
      activeBottomNavColor: activeBottomNav ? window.getComputedStyle(activeBottomNav).color : 'not found',
    };
  });
  console.log('Computed styles in Light Mode:', styles);

  // Test Dark Mode
  console.log('Switching to DARK mode...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('gray');
    localStorage.setItem('theme_mode', 'dark');
  });
  await page.waitForTimeout(1000);

  const darkShotPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_dark_obsidian_mobile.png');
  await page.screenshot({ path: darkShotPath, fullPage: false });
  console.log('Dark mode screenshot saved to:', darkShotPath);

  // Homepage Light Mode
  console.log('Navigating to Homepage in LIGHT mode...');
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.classList.remove('dark', 'gray');
    localStorage.setItem('theme_mode', 'light');
  });
  await page.waitForTimeout(1000);

  const homeShotPath = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_home_light_navy_mobile.png');
  await page.screenshot({ path: homeShotPath, fullPage: false });
  console.log('Home Light screenshot saved to:', homeShotPath);

  await browser.close();
}

verifyNavyTheme().catch(console.error);
