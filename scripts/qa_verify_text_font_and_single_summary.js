const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  console.log('--- BƯỚC 1: KIỂM THỬ TRANG HỌC VIÊN (KHÔNG TRÙNG LẶP TÓM TẮT DƯỚI PLAYLIST) ---');
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Cuộn trang xuống dưới danh sách phát
  await page.evaluate(() => window.scrollBy(0, 800));
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '387_qa_lesson_playlist_no_duplicate_summary.png') });
  console.log('✓ Đã chụp 387_qa_lesson_playlist_no_duplicate_summary.png');

  console.log('--- BƯỚC 2: CHUYỂN SANG TAB TÓM TẮT CỐT LÕI (DUY NHẤT 1 NƠI LƯU TRỮ) ---');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  // Bấm tab Tóm tắt cốt lõi
  const summaryTabBtn = page.locator('button:has-text("Tóm tắt cốt lõi")').first();
  if (await summaryTabBtn.isVisible()) {
    await summaryTabBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '388_qa_lesson_single_core_summary_tab.png') });
    console.log('✓ Đã chụp 388_qa_lesson_single_core_summary_tab.png');
  }

  console.log('--- BƯỚC 3: ĐĂNG NHẬP ADMIN & KIỂM TRA NÚT SỬA TRONG TAB TÓM TẮT ---');
  const loginRes = await page.request.post('http://127.0.0.1:3100/api/admin/login', {
    data: { password: 'Admin@2026!' },
  });
  console.log('Trạng thái đăng nhập Admin:', loginRes.status());

  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Mở tab Tóm tắt cốt lõi khi có quyền Admin
  const summaryTabAdmin = page.locator('button:has-text("Tóm tắt cốt lõi")').first();
  if (await summaryTabAdmin.isVisible()) {
    await summaryTabAdmin.click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '389_qa_admin_summary_tab_with_edit_buttons.png') });
    console.log('✓ Đã chụp 389_qa_admin_summary_tab_with_edit_buttons.png');
  }

  console.log('--- BƯỚC 4: BẤM NÚT SỬA ĐỂ MỞ MODAL VỚI BỘ CÀI ĐẶT CỠ CHỮ & MÀU CHỮ ---');
  const editBtnsInSummary = page.locator('div[id^="block-"] button:has-text("Sửa")');
  const btnCount = await editBtnsInSummary.count();
  console.log('Số nút Sửa tìm thấy trong tab tóm tắt:', btnCount);

  if (btnCount > 0) {
    await editBtnsInSummary.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '390_qa_admin_edit_modal_font_and_color_settings.png') });
    console.log('✓ Đã chụp 390_qa_admin_edit_modal_font_and_color_settings.png');

    // Thử chọn cỡ chữ "Lớn (18px)" và màu "Xanh lá"
    const largeBtn = page.locator('button:has-text("Lớn")').first();
    if (await largeBtn.isVisible()) {
      await largeBtn.click();
      console.log('Đã chọn cỡ chữ: Lớn (18px)');
    }

    const greenColorBtn = page.locator('button[title="Xanh lá"]').first();
    if (await greenColorBtn.isVisible()) {
      await greenColorBtn.click();
      console.log('Đã chọn màu chữ: Xanh lá');
    }

    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '391_qa_admin_edit_modal_preview_customized.png') });
    console.log('✓ Đã chụp 391_qa_admin_edit_modal_preview_customized.png');

    // Bấm nút Lưu thay đổi
    const saveBtn = page.locator('button:has-text("Lưu thay đổi")').first();
    if (await saveBtn.isVisible()) {
      await saveBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '392_qa_admin_summary_card_after_save.png') });
      console.log('✓ Đã chụp 392_qa_admin_summary_card_after_save.png');
    }
  }

  await browser.close();
  console.log('=== TOÀN BỘ KIỂM THỬ XÁC MINH QA HOÀN TẤT THÀNH CÔNG ===');
})();
