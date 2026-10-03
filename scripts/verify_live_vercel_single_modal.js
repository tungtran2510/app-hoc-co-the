const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  console.log('--- KIỂM TRA TRỰC TIẾP LIVE VERCEL: MODAL SỬA TỪNG SÁCH ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_name_prompted', 'true');
    localStorage.setItem('app_user_display_name', 'Dr. Tùng');
    sessionStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  });

  console.log('1. Vào https://app-hoc-co-the.vercel.app/dang-nhap...');
  await page.goto('https://app-hoc-co-the.vercel.app/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const passInput = page.locator('input[type="password"]');
  await passInput.fill('Admin@2026!');
  const submitBtn = page.locator('button:has-text("Vào chế độ chỉnh sửa")');
  await submitBtn.click();
  await page.waitForTimeout(4000);

  console.log('2. Đã ở URL:', page.url());

  // Đóng dialog nhập tên nếu còn hiện
  const dismissNameBtn = page.locator('button:has-text("Để sau")').first();
  if (await dismissNameBtn.isVisible()) {
    await dismissNameBtn.click();
    await page.waitForTimeout(500);
  }

  // Cuộn xuống mục Tài Liệu Chuyên Sâu
  const booksHeading = page.locator('text=Tài Liệu Chuyên Sâu').first();
  await booksHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Chụp ảnh thẻ sách có nút Quản trị [Sửa]
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '425_qa_live_vercel_book_card.png') });
  console.log('✓ Đã chụp 425_qa_live_vercel_book_card.png');

  // Tìm nút [Sửa] của cuốn sách tác giả đầu tiên
  const editBtn = page.locator('button[title="Sửa cuốn sách này"]').first();
  const isBtnVisible = await editBtn.isVisible();
  console.log('Nút "Sửa cuốn sách này" có hiển thị?:', isBtnVisible);

  if (isBtnVisible) {
    console.log('3. Bấm vào nút Sửa cuốn sách...');
    await editBtn.click();
    await page.waitForTimeout(1500);

    // Chụp modal mở ra
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '426_qa_live_vercel_single_book_modal_exact.png') });
    console.log('✓ Đã chụp 426_qa_live_vercel_single_book_modal_exact.png');

    // Lấy tiêu đề modal
    const modalInfo = await page.evaluate(() => {
      const heading = document.querySelector('h3, h2');
      return heading ? heading.innerText : 'Unknown';
    });
    console.log('Tiêu đề modal mở ra là:', modalInfo);
  }

  await browser.close();
  console.log('--- HOÀN TẤT KIỂM THỬ ---');
})();
