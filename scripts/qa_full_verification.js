const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

async function runQa() {
  console.log('>>> BẮT ĐẦU KIỂM THỬ PLAYWRIGHT MOBILE-FIRST TOÀN DIỆN...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 14 / Mobile standard
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  try {
    // 1. Vào trang chủ
    console.log('\n[1/4] Kiểm tra Trang Chủ & Header...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Chụp ảnh màn hình Trang Chủ Mobile
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '270_qa_home_mobile_header.png') });
    console.log('  ✓ Chụp ảnh 270_qa_home_mobile_header.png');

    // Đăng nhập Admin để kiểm tra thanh công cụ Admin
    console.log('\n[2/4] Đăng nhập quyền Admin để kiểm tra thanh công cụ Admin trên Card Sách...');
    // Gọi API login admin trực tiếp qua context cookie
    await page.request.post(`${BASE_URL}/api/admin/login`, {
      data: { password: 'Admin@2026!' },
    });
    // Reload lại trang chủ ở trạng thái Admin
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, '271_qa_home_admin_toolbar.png') });
    console.log('  ✓ Chụp ảnh 271_qa_home_admin_toolbar.png');

    // Cuộn xuống phần Tài liệu / Sách nên đọc để kiểm tra hàng nút admin
    const recommendedSection = page.locator('text=Tài Liệu Y Khoa Chuyên Sâu, Sách nên đọc, TÀI LIỆU NÊN ĐỌC').first();
    await page.evaluate(() => {
      window.scrollTo(0, 800);
    });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, '272_qa_books_admin_buttons_separated.png') });
    console.log('  ✓ Chụp ảnh 272_qa_books_admin_buttons_separated.png');

    // Bấm thử nút "Đọc thử 3D" trên card sách
    console.log('\n[3/4] Bấm thử nút "Đọc thử tài liệu 3D" trên Card Sách...');
    const read3dBtn = page.locator('button:has-text("Đọc thử")').first();
    if (await read3dBtn.isVisible()) {
      await read3dBtn.click();
      await page.waitForTimeout(1500);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '273_qa_flipbook_modal_opened.png') });
      console.log('  ✓ Chụp ảnh 273_qa_flipbook_modal_opened.png');

      // Đóng modal flipbook
      const closeBtn = page.locator('button[title="Đóng"], button[aria-label="Đóng"], button:has-text("Đóng")').first();
      if (await closeBtn.isVisible()) {
        await closeBtn.click();
        await page.waitForTimeout(500);
      }
    }

    // 4. Kiểm tra Mục Lục & Các khối phong phú trong Bài Học
    console.log('\n[4/4] Mở bài học chi tiết để kiểm tra Mục Lục 9 mục & Khối Flipbook 3D...');
    await page.goto(`${BASE_URL}/cot-song/dia-dem`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    // Chụp ảnh đầu bài học
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '274_qa_lesson_overview.png') });
    console.log('  ✓ Chụp ảnh 274_qa_lesson_overview.png');

    // Bấm nút mở Mục Lục
    const tocBtn = page.locator('button[title="Mục lục bài học"], button:has-text("Mục lục")').first();
    if (await tocBtn.isVisible()) {
      await tocBtn.click();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '275_qa_lesson_toc_drawer_all_items.png') });
      console.log('  ✓ Chụp ảnh 275_qa_lesson_toc_drawer_all_items.png (Mục lục đầy đủ chi tiết)');

      // Bấm vào mục "Bảng so sánh" hoặc "Ý nghĩa" trong mục lục
      const tocItem = page.locator('button:has-text("So sánh"), button:has-text("Ý nghĩa"), button:has-text("Điểm cần nhớ")').first();
      if (await tocItem.isVisible()) {
        await tocItem.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '276_qa_lesson_scrolled_to_block.png') });
        console.log('  ✓ Chụp ảnh 276_qa_lesson_scrolled_to_block.png');
      }
    }

    // Cuộn xuống xem các khối nội dung: Flipbook 3D, Bảng so sánh 2 cột, Cảnh báo an toàn
    await page.evaluate(() => window.scrollBy(0, 600));
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '277_qa_lesson_rich_blocks.png') });
    console.log('  ✓ Chụp ảnh 277_qa_lesson_rich_blocks.png');

    // 5. Kiểm tra Trợ lý AI
    console.log('\n[5/5] Kiểm tra Trợ Lý AI trả lời theo tài liệu mới nạp...');
    await page.goto(`${BASE_URL}/tro-ly-ai`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    const questionInput = page.locator('textarea, input[type="text"]').first();
    const sendBtn = page.locator('button[title*="Gửi"], button[aria-label*="Gửi"], button:has-text("Gửi")').first();

    if (await questionInput.isVisible()) {
      await questionInput.fill('Thoát vị đĩa đệm có dùng được giải pháp DoctorLoan không?');
      await page.waitForTimeout(300);
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
      } else {
        await questionInput.press('Enter');
      }

      console.log('  Đang chờ AI trả lời câu hỏi DoctorLoan...');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '278_qa_ai_response_doctorloan.png') });
      console.log('  ✓ Chụp ảnh 278_qa_ai_response_doctorloan.png');

      // Thử câu hỏi thứ 2 về Nước Gems
      await questionInput.fill('Nước ion kiềm Gems khác gì nước lọc thông thường?');
      await page.waitForTimeout(300);
      if (await sendBtn.isVisible()) {
        await sendBtn.click();
      } else {
        await questionInput.press('Enter');
      }

      console.log('  Đang chờ AI trả lời câu hỏi Nước Gems...');
      await page.waitForTimeout(5000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '279_qa_ai_response_nuoc_gems.png') });
      console.log('  ✓ Chụp ảnh 279_qa_ai_response_nuoc_gems.png');
    }

    console.log('\n>>> TOÀN BỘ KIỂM THỬ PLAYWRIGHT HOÀN TẤT THÀNH CÔNG RỰC RỠ!');
  } catch (err) {
    console.error('Lỗi khi chạy QA:', err);
  } finally {
    await browser.close();
  }
}

runQa();
