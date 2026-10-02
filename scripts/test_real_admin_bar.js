const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function run() {
  console.log('--- TEST CHỤP CHÍNH XÁC THANH ADMIN ĐEN SAU KHI ĐĂNG NHẬP THẬT TRÊN FORM ---');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();
  
  // Đóng splash
  await page.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_name_prompted', 'true');
  });

  // Vào trang đăng nhập
  await page.goto('http://localhost:3100/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Điền mật khẩu
  await page.fill('input[type="password"]', 'Admin@2026!');
  
  // Bấm nút đăng nhập và chờ chuyển hướng
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    page.click('button[type="submit"]'),
  ]);

  await page.waitForTimeout(2000);

  // Đã ở trang chủ với quyền Admin
  console.log('URL hiện tại:', page.url());

  // Chụp ảnh đỉnh đầu chứa thanh Admin đen mới
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '419_qa_admin_top_bar_new_look.png'),
    clip: { x: 0, y: 0, width: 375, height: 260 }
  });
  console.log('Đã chụp: 419_qa_admin_top_bar_new_look.png');

  await browser.close();
  console.log('--- HOÀN TẤT ---');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
