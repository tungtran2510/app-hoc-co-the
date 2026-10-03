const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Log in
  await page.goto('http://127.0.0.1:3100/dang-nhap', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);
  const pwdInput = await page.$('input#admin-password');
  if (pwdInput) {
    await pwdInput.fill('Admin@2026!');
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn?.click();
    await page.waitForTimeout(2000);
  }

  await page.evaluate(() => {
    localStorage.setItem('has_visited_app', 'true');
    localStorage.setItem('welcome_modal_dismissed', 'true');
    localStorage.setItem('pwa_welcome_seen', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  });

  // 2. Open Homepage
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Click button with title containing "TÀI LIỆU NÊN ĐỌC"
  const editBtn = await page.$('button[title*="TÀI LIỆU NÊN ĐỌC"]');
  console.log('Found edit button for TÀI LIỆU NÊN ĐỌC:', !!editBtn);
  if (editBtn) {
    await editBtn.scrollIntoViewIfNeeded();
    await editBtn.click();
    await page.waitForTimeout(1000);

    const mobileScreen = path.join(ARTIFACTS_DIR, 'admin_redesigned_recommended_books_real_mobile.png');
    await page.screenshot({ path: mobileScreen });
    console.log('Captured mobile screenshot of redesigned EditRecommendedBooksModal:', mobileScreen);

    // Desktop view
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(600);
    const desktopScreen = path.join(ARTIFACTS_DIR, 'admin_redesigned_recommended_books_real_desktop.png');
    await page.screenshot({ path: desktopScreen });
    console.log('Captured desktop screenshot of redesigned EditRecommendedBooksModal:', desktopScreen);
  }

  await browser.close();
  console.log('Done!');
})();
