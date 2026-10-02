const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function run() {
  console.log('--- TEST CHỤP CHÍNH XÁC THANH ADMIN ĐEN & MODAL SÁCH NÊN ĐỌC ---');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_display_name', 'Dr. Tùng');
    localStorage.setItem('app_user_name_prompted', 'true');
  });

  // Đăng nhập qua API lấy token
  const loginRes = await page.request.post('http://localhost:3100/api/admin/login', {
    data: { password: 'Admin@2026!' },
  });
  const loginData = await loginRes.json();
  console.log('Login token:', loginData.token);

  await context.addCookies([
    {
      name: 'app_admin_session',
      value: loginData.token,
      domain: 'localhost',
      path: '/',
    }
  ]);

  await page.addInitScript((tok) => {
    localStorage.setItem('app_admin_token', tok);
  }, loginData.token);

  await page.goto('http://localhost:3100/?skip_intro=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Chụp thanh Admin đen (chính xác element con có text Sẵn sàng và nút Sao lưu)
  const adminBar = page.locator('div.bg-slate-950\\/95, div.bg-black\\/90').first();
  if (await adminBar.isVisible()) {
    console.log('Tìm thấy thanh admin đen!');
    await adminBar.screenshot({
      path: path.join(ARTIFACT_DIR, '415_qa_admin_top_bar_exact.png'),
    });
    console.log('Đã chụp: 415_qa_admin_top_bar_exact.png');
  }

  // 2. Chụp đỉnh đầu mobile bao gồm thanh admin đen và greeting
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '417_qa_mobile_header_with_admin_bar.png'),
    clip: { x: 0, y: 0, width: 375, height: 320 }
  });
  console.log('Đã chụp: 417_qa_mobile_header_with_admin_bar.png');

  // 3. Cuộn đến mục Sách nên đọc và bấm nút Sửa cuốn đầu tiên
  const recSection = page.locator('section:has(h2:has-text("Tài Liệu"))').first();
  await recSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Tìm nút [Sửa] của cuốn sách nên đọc đầu tiên
  const recEditBtn = recSection.locator('button[title="Sửa cuốn sách này"]').first();
  if (await recEditBtn.isVisible()) {
    console.log('Bấm nút Sửa cuốn sách nên đọc...');
    await recEditBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '418_qa_modal_edit_single_recommended_book_exact.png'),
    });
    console.log('Đã chụp: 418_qa_modal_edit_single_recommended_book_exact.png');
  }

  await browser.close();
  console.log('--- HOÀN TẤT ---');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
