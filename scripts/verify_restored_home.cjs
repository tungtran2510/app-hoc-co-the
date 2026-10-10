const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3099';

async function main() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Kiểm tra trạng thái khách mặc định (Guest)
  const contextGuest = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const pageGuest = await contextGuest.newPage();
  await pageGuest.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await pageGuest.waitForTimeout(1000);

  const shotGuest = path.join(ARTIFACTS_DIR, '350_restored_home_guest_purple_theme.png');
  await pageGuest.screenshot({ path: shotGuest });
  console.log('Saved shotGuest:', shotGuest);

  // 2. Kiểm tra trạng thái khi đăng nhập Quản trị viên
  const contextAdmin = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const pageAdmin = await contextAdmin.newPage();
  
  // Set localStorage giả lập admin login
  await pageAdmin.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await pageAdmin.evaluate(() => {
    localStorage.setItem('app_user_display_name', 'Quản trị viên cấp cao');
    localStorage.setItem('admin_token', 'mock_admin_token');
    document.cookie = 'admin_token=mock_admin_token; path=/';
  });
  await pageAdmin.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await pageAdmin.waitForTimeout(1000);

  const shotAdmin = path.join(ARTIFACTS_DIR, '351_restored_home_admin_1line_greeting.png');
  await pageAdmin.screenshot({ path: shotAdmin });
  console.log('Saved shotAdmin:', shotAdmin);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
