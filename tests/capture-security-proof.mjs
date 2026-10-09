import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3270';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Chụp trang Đăng nhập sạch (đã bỏ mọi gợi ý lộ mật khẩu & số điện thoại)
  await page.goto(`${BASE_URL}/dang-nhap`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  const shot1 = path.join(ARTIFACTS_DIR, '298_security_login_clean.png');
  await page.screenshot({ path: shot1 });
  console.log(`Saved: ${shot1}`);

  // 2. Thử đăng nhập bằng mật khẩu cũ Tung@2510 -> Kiểm tra thông báo từ chối
  await page.fill('input[type="tel"]', '0974248716');
  await page.fill('input[type="password"]', 'Tung@2510');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1000);
  const shot2 = path.join(ARTIFACTS_DIR, '299_security_login_rejected_old_password.png');
  await page.screenshot({ path: shot2 });
  console.log(`Saved: ${shot2}`);

  // 3. Chụp trang chủ hoạt động bình thường
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const shot3 = path.join(ARTIFACTS_DIR, '300_security_homepage_normal.png');
  await page.screenshot({ path: shot3 });
  console.log(`Saved: ${shot3}`);

  await browser.close();
}

capture().catch((err) => {
  console.error('Capture error:', err);
  process.exit(1);
});
