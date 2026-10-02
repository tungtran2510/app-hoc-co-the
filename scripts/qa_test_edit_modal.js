const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  // 1. Đăng nhập Admin
  await page.request.post('http://127.0.0.1:3100/api/admin/login', {
    data: { password: 'Admin@2026!' },
  });

  // 2. Vào bài học và chuyển sang tab Tóm tắt cốt lõi
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  const summaryTab = page.locator('button:has-text("Tóm tắt cốt lõi")').first();
  if (await summaryTab.isVisible()) {
    await summaryTab.click();
    await page.waitForTimeout(800);
  }

  // 3. Tìm nút Sửa của khối văn bản (khối đầu tiên trong tab tóm tắt cốt lõi)
  // Khối tóm tắt có chữ ĐOẠN VĂN hoặc ĐIỂM CẦN NHỚ
  const textCardEditBtn = page.locator('div:has(> span:has-text("ĐOẠN VĂN")), div:has(> span:has-text("ĐIỂM CẦN NHỚ"))').locator('button:has-text("Sửa")').first();
  
  if (await textCardEditBtn.isVisible()) {
    console.log('Bấm nút Sửa của khối tóm tắt văn bản...');
    await textCardEditBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '393_qa_edit_text_block_modal.png') });
    console.log('✓ Đã chụp 393_qa_edit_text_block_modal.png');

    // Cuộn modal xuống để thấy rõ phần Cài đặt chữ & Màu sắc
    await page.locator('h3:has-text("Chỉnh sửa khối nội dung")').scrollIntoViewIfNeeded();
    await page.mouse.wheel(0, 300);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '394_qa_edit_text_font_and_color_settings.png') });
    console.log('✓ Đã chụp 394_qa_edit_text_font_and_color_settings.png');

    // Thử chọn cỡ chữ "Lớn (18px)"
    const largeBtn = page.locator('button:has-text("Lớn")').first();
    if (await largeBtn.isVisible()) {
      await largeBtn.click();
      console.log('✓ Đã chọn cỡ chữ: Lớn (18px)');
    }

    // Chọn màu "Xanh lá" (#16A34A)
    const greenBtn = page.locator('button[title="Xanh lá"]').first();
    if (await greenBtn.isVisible()) {
      await greenBtn.click();
      console.log('✓ Đã chọn màu chữ: Xanh lá');
    }

    // Chọn căn lề "Căn đều"
    const justifyBtn = page.locator('button:has-text("Căn đều")').first();
    if (await justifyBtn.isVisible()) {
      await justifyBtn.click();
      console.log('✓ Đã chọn căn lề: Căn đều');
    }

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '395_qa_edit_text_live_preview.png') });
    console.log('✓ Đã chụp 395_qa_edit_text_live_preview.png');

    // Bấm Lưu
    const saveBtn = page.locator('button:has-text("Lưu thay đổi")').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '396_qa_summary_card_after_styled_save.png') });
      console.log('✓ Đã chụp 396_qa_summary_card_after_styled_save.png');
    }
  } else {
    console.log('Không tìm thấy nút Sửa cho text block theo bộ lọc, thử selector khác...');
    const allEditBtns = page.locator('button:has-text("Sửa")');
    const total = await allEditBtns.count();
    console.log('Tổng số nút Sửa trên trang:', total);
    for (let i = 1; i < total; i++) {
      const btn = allEditBtns.nth(i);
      if (await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(600);
        await page.screenshot({ path: path.join(ARTIFACT_DIR, '393_qa_edit_text_block_modal.png') });
        console.log(`✓ Đã bấm nút Sửa thứ ${i} và chụp 393_qa_edit_text_block_modal.png`);
        break;
      }
    }
  }

  await browser.close();
  console.log('Hoàn tất kịch bản kiểm thử modal chỉnh sửa văn bản.');
})();
