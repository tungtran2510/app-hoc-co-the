const { chromium } = require('playwright');
const crypto = require('crypto');

const fs = require('fs');

async function run() {
  console.log('--- STARTING COMPREHENSIVE TITLE & DESC SAVE VERIFICATION ---');
  let adminPassword = 'Admin@2026!';
  try {
    const env = fs.readFileSync('.env.local', 'utf8');
    const match = env.match(/ADMIN_PASSWORD=([^\r\n]+)/);
    if (match) adminPassword = match[1].trim();
  } catch {}

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Chuẩn màn hình mobile smartphone
  });

  const page = await context.newPage();

  // Đăng nhập Admin chuẩn qua API
  const loginRes = await page.request.post('http://localhost:3100/api/admin/login', {
    data: { password: adminPassword },
  });
  const loginData = await loginRes.json();
  console.log('✓ Login status:', loginData.success ? 'SUCCESS' : 'FAILED');

  await page.goto('http://localhost:3100?skip_intro=1');
  if (loginData.token) {
    await page.evaluate((tok) => {
      localStorage.setItem('app_admin_token', tok);
    }, loginData.token);
  }
  await page.goto('http://localhost:3100?skip_intro=1');

  console.log('✓ Admin mode loaded');
  await page.waitForTimeout(2000);

  // 1. Kiểm tra khối sách tác giả: tìm nút "Cài đặt khối sách"
  console.log('Step 1: Mở modal Cài đặt khối giới thiệu & Sách...');
  const editBooksBtn = page.locator('button:has-text("Cài đặt khối sách")').first();
  await editBooksBtn.scrollIntoViewIfNeeded();
  await editBooksBtn.click();

  await page.waitForSelector('text=Cài đặt khối giới thiệu & Sách');
  console.log('✓ Modal Cài đặt khối giới thiệu & Sách đã mở');

  // 2. Chỉnh sửa Tab Sách (books_title & books_subtitle)
  console.log('Step 2: Chỉnh sửa tiêu đề và mô tả trong Tab Sách...');
  const booksTitleInput = page.locator('input[placeholder="Mặc định: Sách & Tác phẩm đã làm"]');
  await booksTitleInput.fill('Sách & Công Trình Nghiên Cứu');

  const booksSubtitleInput = page.locator('input[placeholder="Ví dụ: Các ấn phẩm và công trình nghiên cứu đã phát hành..."]');
  await booksSubtitleInput.fill('Tuyển tập các tài liệu phục hồi đĩa đệm và cột sống');

  // 3. Chuyển sang Tab Liên hệ
  console.log('Step 3: Chuyển sang Tab Liên hệ & đổi tiêu đề/mô tả...');
  const contactTabBtn = page.locator('button:has-text("Liên hệ")').first();
  await contactTabBtn.click();
  await page.waitForTimeout(500);

  const contactTitleInput = page.locator('input[placeholder="Mặc định: Thông tin liên hệ & Kết nối"]');
  await contactTitleInput.fill('Kênh Kết Nối & Tư Vấn Chuyên Sâu');

  const contactSubtitleInput = page.locator('input[placeholder="Mặc định: Kết nối trực tiếp cùng chuyên gia / tác giả"]');
  await contactSubtitleInput.fill('Đồng hành và hướng dẫn học viên 24/7');

  // 4. Nhấn Lưu thay đổi
  console.log('Step 4: Bấm Lưu thay đổi...');
  const saveBtn = page.locator('button:has-text("Lưu thay đổi")');
  await saveBtn.click();

  // Đợi modal đóng
  await page.waitForSelector('text=Cài đặt khối giới thiệu & Sách', { state: 'hidden', timeout: 8000 });
  console.log('✓ Modal đã đóng thành công sau khi lưu');
  await page.waitForTimeout(1000);

  // 5. Kiểm tra trên giao diện storefront ngay lập tức
  console.log('Step 5: Kiểm tra hiển thị storefront ngay sau khi lưu...');
  const renderedBooksTitle = await page.locator('text=Sách & Công Trình Nghiên Cứu').isVisible();
  const renderedBooksSubtitle = await page.locator('text=Tuyển tập các tài liệu phục hồi đĩa đệm và cột sống').isVisible();
  const renderedContactTitle = await page.locator('text=Kênh Kết Nối & Tư Vấn Chuyên Sâu').isVisible();
  const renderedContactSubtitle = await page.locator('text=Đồng hành và hướng dẫn học viên 24/7').isVisible();

  console.log(`- books_title immediate: ${renderedBooksTitle ? 'PASS' : 'FAIL'}`);
  console.log(`- books_subtitle immediate: ${renderedBooksSubtitle ? 'PASS' : 'FAIL'}`);
  console.log(`- contact_title immediate: ${renderedContactTitle ? 'PASS' : 'FAIL'}`);
  console.log(`- contact_subtitle immediate: ${renderedContactSubtitle ? 'PASS' : 'FAIL'}`);

  if (!renderedBooksTitle || !renderedBooksSubtitle || !renderedContactTitle || !renderedContactSubtitle) {
    throw new Error('Immediate storefront update FAILED!');
  }

  // 6. Tải lại trang (F5 hard reload) để kiểm chứng dữ liệu đã lưu bền vững vào database
  console.log('Step 6: Tải lại trang để kiểm chứng lưu bền vững vào Supabase...');
  await page.reload();
  await page.waitForTimeout(2000);

  const reloadedBooksTitle = await page.locator('text=Sách & Công Trình Nghiên Cứu').isVisible();
  const reloadedBooksSubtitle = await page.locator('text=Tuyển tập các tài liệu phục hồi đĩa đệm và cột sống').isVisible();
  const reloadedContactTitle = await page.locator('text=Kênh Kết Nối & Tư Vấn Chuyên Sâu').isVisible();
  const reloadedContactSubtitle = await page.locator('text=Đồng hành và hướng dẫn học viên 24/7').isVisible();

  console.log(`- books_title after reload: ${reloadedBooksTitle ? 'PASS' : 'FAIL'}`);
  console.log(`- books_subtitle after reload: ${reloadedBooksSubtitle ? 'PASS' : 'FAIL'}`);
  console.log(`- contact_title after reload: ${reloadedContactTitle ? 'PASS' : 'FAIL'}`);
  console.log(`- contact_subtitle after reload: ${reloadedContactSubtitle ? 'PASS' : 'FAIL'}`);

  if (!reloadedBooksTitle || !reloadedBooksSubtitle || !reloadedContactTitle || !reloadedContactSubtitle) {
    throw new Error('Database persistence verification FAILED!');
  }

  // Chụp ảnh bằng chứng
  await page.screenshot({ path: 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/verified_titles_descriptions_saved.png', fullPage: false });
  console.log('✓ Đã chụp ảnh bằng chứng lưu thành công: verified_titles_descriptions_saved.png');

  // Khôi phục lại tiêu đề chuẩn mực hài hòa cho ứng dụng
  console.log('Step 7: Khôi phục lại tiêu đề chuẩn mực cho ứng dụng...');
  await page.locator('button:has-text("Cài đặt khối sách")').first().click();
  await page.waitForSelector('text=Cài đặt khối giới thiệu & Sách');
  await page.locator('input[placeholder="Mặc định: Sách & Tác phẩm đã làm"]').fill('Sách & Tác phẩm đã làm');
  await page.locator('input[placeholder="Ví dụ: Các ấn phẩm và công trình nghiên cứu đã phát hành..."]').fill('Cẩm nang toàn diện giải mã cơ chế cột sống và tự phục hồi');
  
  await page.locator('button:has-text("Liên hệ")').first().click();
  await page.waitForTimeout(300);
  await page.locator('input[placeholder="Mặc định: Thông tin liên hệ & Kết nối"]').fill('Thông tin liên hệ & Kết nối');
  await page.locator('input[placeholder="Mặc định: Kết nối trực tiếp cùng chuyên gia / tác giả"]').fill('Kết nối trực tiếp cùng chuyên gia / tác giả');
  
  await page.locator('button:has-text("Lưu thay đổi")').click();
  await page.waitForSelector('text=Cài đặt khối giới thiệu & Sách', { state: 'hidden', timeout: 8000 });
  await page.reload();
  await page.waitForTimeout(1500);

  const restoredTitle = await page.locator('text=Sách & Tác phẩm đã làm').isVisible();
  console.log(`- restored standard title: ${restoredTitle ? 'PASS' : 'FAIL'}`);

  await browser.close();
  console.log('--- ALL TITLE & DESCRIPTION PERSISTENCE TESTS PASSED! ---');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
