const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function run() {
  console.log('--- BẮT ĐẦU KIỂM THỬ QA TOÀN DIỆN VỚI ĐĂNG NHẬP ADMIN ---');
  const browser = await chromium.launch({ headless: true });

  // 1. MOBILE 375px
  const contextMobile = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const page = await contextMobile.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_display_name', 'Dr. Tùng');
  });

  // Đăng nhập Admin
  console.log('Truy cập trang đăng nhập...');
  await page.goto('http://localhost:3100/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const pwdInput = page.locator('input[type="password"]');
  if (await pwdInput.isVisible()) {
    await pwdInput.fill('Admin@2026!');
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    console.log('Đã gửi form đăng nhập admin, chờ điều hướng...');
    await page.waitForTimeout(2000);
  }

  // Vào trang chủ với quyền Admin
  await page.goto('http://localhost:3100/?skip_intro=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // 1. Chụp ảnh đỉnh đầu: Top Bar Admin (to rõ, 1 dòng)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '407_qa_mobile_admin_top_bar_verified.png'),
    clip: { x: 0, y: 0, width: 375, height: 260 }
  });
  console.log('Đã chụp: 407_qa_mobile_admin_top_bar_verified.png');

  // 2. Chụp phần Hồ sơ Tác giả Tùng Dinh Dưỡng
  const authorSec = page.locator('text=Tùng Dinh Dưỡng').first();
  await authorSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '408_qa_mobile_author_profile_verified.png'),
  });
  console.log('Đã chụp: 408_qa_mobile_author_profile_verified.png');

  // 3. Cuộn xuống mục Tài liệu chuyên sâu của tác giả
  const authorBooksSection = page.locator('text=Tài Liệu Chuyên Sâu').first();
  await authorBooksSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '409_qa_mobile_author_books_with_covers.png'),
  });
  console.log('Đã chụp: 409_qa_mobile_author_books_with_covers.png');

  // Bấm vào nút [Sửa] của cuốn sách tác giả đầu tiên
  const authorBookEditBtn = page.locator('button[title="Sửa cuốn sách này"]').first();
  if (await authorBookEditBtn.isVisible()) {
    console.log('Bấm nút Sửa cuốn sách tác giả đầu tiên...');
    await authorBookEditBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '410_qa_modal_edit_single_author_book_verified.png'),
    });
    console.log('Đã chụp: 410_qa_modal_edit_single_author_book_verified.png');

    const closeBtn = page.locator('button:has-text("Hủy bỏ")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 4. Cuộn xuống mục Sách nên đọc (Recommended Books)
  const recBooksHeading = page.locator('h2:has-text("Tài Liệu")').first();
  await recBooksHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '411_qa_mobile_recommended_books_with_covers.png'),
  });
  console.log('Đã chụp: 411_qa_mobile_recommended_books_with_covers.png');

  // Bấm vào nút [Sửa] của cuốn sách nên đọc đầu tiên
  const recBookEditBtn = page.locator('section:has-text("Tài Liệu") button[title="Sửa cuốn sách này"]').first();
  if (await recBookEditBtn.isVisible()) {
    console.log('Bấm nút Sửa cuốn sách nên đọc đầu tiên...');
    await recBookEditBtn.click();
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '412_qa_modal_edit_single_recommended_book_verified.png'),
    });
    console.log('Đã chụp: 412_qa_modal_edit_single_recommended_book_verified.png');

    const closeBtn2 = page.locator('button:has-text("Hủy bỏ")').first();
    if (await closeBtn2.isVisible()) {
      await closeBtn2.click();
      await page.waitForTimeout(500);
    }
  }

  // 5. Cuộn xuống Triết lý phụng sự & Liên hệ
  const contactHeading = page.locator('text=Triết lý phụng sự').first();
  if (await contactHeading.isVisible()) {
    await contactHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '413_qa_mobile_philosophy_and_contact_verified.png'),
    });
    console.log('Đã chụp: 413_qa_mobile_philosophy_and_contact_verified.png');
  }

  // 6. DESKTOP 1280px
  const contextDesktop = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const pageDesktop = await contextDesktop.newPage();
  await pageDesktop.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', '1');
  });
  await pageDesktop.goto('http://localhost:3100/dang-nhap', { waitUntil: 'domcontentloaded' });
  await pageDesktop.waitForTimeout(800);
  const pwdInputD = pageDesktop.locator('input[type="password"]');
  if (await pwdInputD.isVisible()) {
    await pwdInputD.fill('Admin@2026!');
    const submitBtnD = pageDesktop.locator('button[type="submit"]');
    await submitBtnD.click();
    await pageDesktop.waitForTimeout(1500);
  }

  await pageDesktop.goto('http://localhost:3100/?skip_intro=1', { waitUntil: 'domcontentloaded' });
  await pageDesktop.waitForTimeout(1500);

  await pageDesktop.screenshot({
    path: path.join(ARTIFACT_DIR, '414_qa_desktop_home_view_admin.png'),
    clip: { x: 0, y: 0, width: 1280, height: 800 }
  });
  console.log('Đã chụp: 414_qa_desktop_home_view_admin.png');

  await browser.close();
  console.log('--- HOÀN THÀNH TẤT CẢ KIỂM THỬ QA ---');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
