const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function snap(page, name) {
  const filePath = path.join(ARTIFACT_DIR, name);
  await page.screenshot({ path: filePath, fullPage: false, animations: 'disabled' });
  console.log(`[QA Artifact]: ${name}`);
  return filePath;
}

async function run() {
  console.log('=== BẮT ĐẦU KIỂM THỬ XÁC MINH SÁCH THẬT & TÀI LIỆU TRÊN MOBILE FIRST ===');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile iPhone 14
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`[Browser Console Error]: ${msg.text()}`);
    }
  });

  // 1. Mở trang chủ
  console.log('1. Mở trang chủ http://127.0.0.1:3100/ ...');
  await page.addInitScript(() => {
    localStorage.setItem('qbiz_user_name', 'Học viên');
    localStorage.setItem('user_name', 'Học viên');
    localStorage.setItem('user_profile', JSON.stringify({ name: 'Học viên' }));
  });
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Đóng modal chào mừng nếu còn hiển thị
  const dismissWelcome = page.locator('button:has-text("Để sau"), button:has-text("Lưu tên")').first();
  if (await dismissWelcome.isVisible({ timeout: 2000 }).catch(() => false)) {
    await dismissWelcome.click();
    await page.waitForTimeout(500);
  }

  // 2. Cuộn đến khối "Tài Liệu & Cẩm Nang Chuyên Sâu" (Author Books)
  console.log('2. Kiểm tra khối Tài Liệu & Cẩm Nang Chuyên Sâu (Sách tác giả)...');
  const authorBooksSection = page.locator('text=Tài Liệu & Cẩm Nang Chuyên Sâu').first();
  await authorBooksSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await snap(page, '260_qa_home_author_books.png');

  // 3. Bấm "Đọc thử tài liệu 3D" của cuốn "Hiểu Đúng Về Cột Sống"
  console.log('3. Mở đọc thử 3D sách "Hiểu Đúng Về Cột Sống"...');
  const readBtn1 = page.locator('button:has-text("Đọc thử tài liệu 3D")').first();
  await readBtn1.click({ force: true });
  await page.waitForTimeout(1500);
  await snap(page, '261_qa_flipbook_hieu_dung_ve_cot_song_cover.png');

  // Lật sang trang 2 & 3
  console.log('4. Lật sang trang tiếp theo...');
  const nextBtn = page.locator('button[title="Trang sau"], button:has-text("Trang sau")').first();
  if (await nextBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await nextBtn.click({ force: true });
  } else {
    // Click vào mép phải trang sách để lật
    await page.mouse.click(340, 450);
  }
  await page.waitForTimeout(1200);
  await snap(page, '262_qa_flipbook_hieu_dung_ve_cot_song_page2.png');

  // Đóng modal đọc thử
  console.log('5. Đóng modal đọc thử...');
  const closeBtn = page.locator('button[aria-label="Đóng toàn màn hình"], button[title="Đóng"], button:has-text("Đóng")').first();
  if (await closeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
    await closeBtn.click({ force: true });
  } else {
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(800);

  // 6. Cuộn đến khối "Tài Liệu Y Khoa Chuyên Sâu" (Recommended Books)
  console.log('6. Kiểm tra khối Tài Liệu Y Khoa Chuyên Sâu...');
  const recDocSection = page.locator('text=Tài Liệu Y Khoa Chuyên Sâu').first();
  await recDocSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await snap(page, '263_qa_home_recommended_documents.png');

  // 7. Bấm "Đọc thử tài liệu 3D" cuốn "Lắng Nghe Cơ Thể Để Tự Chữa Lành"
  console.log('7. Bấm đọc thử "Lắng Nghe Cơ Thể Để Tự Chữa Lành"...');
  const readRecBtn1 = page.locator('div:has-text("Lắng Nghe Cơ Thể") button:has-text("Đọc thử tài liệu 3D")').first();
  if (await readRecBtn1.isVisible({ timeout: 1000 }).catch(() => false)) {
    await readRecBtn1.click({ force: true });
  } else {
    // Fallback: tìm theo nút chứa văn bản
    await page.locator('button:has-text("Đọc thử tài liệu 3D")').nth(2).click({ force: true });
  }
  await page.waitForTimeout(1500);
  await snap(page, '264_qa_flipbook_lang_nghe_co_the_cover.png');

  // Lật trang
  console.log('8. Lật trang trong sách Lắng Nghe Cơ Thể...');
  await page.mouse.click(340, 450);
  await page.waitForTimeout(1200);
  await snap(page, '265_qa_flipbook_lang_nghe_co_the_page2.png');

  // Đóng modal
  const closeBtn2 = page.locator('button[aria-label="Đóng toàn màn hình"], button[title="Đóng"], button:has-text("Đóng")').first();
  if (await closeBtn2.isVisible({ timeout: 1000 }).catch(() => false)) {
    await closeBtn2.click({ force: true });
  } else {
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(800);

  // 9. Mở Modal chi tiết tài liệu bằng cách bấm vào card "Giải Mã Cột Sống & Vận Động Đúng"
  console.log('9. Mở chi tiết tài liệu "Giải Mã Cột Sống & Vận Động Đúng"...');
  const cardGiaiMa = page.locator('h3:has-text("Giải Mã Cột Sống")').first();
  await cardGiaiMa.click({ force: true });
  await page.waitForTimeout(1000);
  await snap(page, '267_qa_book_detail_modal_document.png');

  // Bấm nút "Đọc thử tài liệu 3D" trong modal chi tiết
  console.log('10. Bấm Đọc thử tài liệu 3D trong modal chi tiết...');
  const detailReadBtn = page.locator('button:has-text("Đọc thử tài liệu 3D")').last();
  await detailReadBtn.click({ force: true });
  await page.waitForTimeout(1500);
  await snap(page, '268_qa_flipbook_from_detail_modal.png');

  // Đóng
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const detailClose = page.locator('button[aria-label="Đóng"]').first();
  if (await detailClose.isVisible({ timeout: 1000 }).catch(() => false)) {
    await detailClose.click({ force: true });
  }
  await page.waitForTimeout(600);

  // 10. Chuyển sang bài học để kiểm tra Giáo trình Atlas Y Khoa 3D
  console.log('11. Mở bài học /cot-song/tong-quan-ve-cot-song...');
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Cuộn xuống khối Atlas Flipbook
  const atlasFlipbook = page.locator('text=Atlas').first();
  if (await atlasFlipbook.isVisible()) {
    await atlasFlipbook.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await snap(page, '269_qa_lesson_atlas_cover.png');
  }

  console.log('=== HOÀN TẤT TẤT CẢ CÁC BƯỚC KIỂM THỬ XÁC MINH SÁCH THẬT & TÀI LIỆU ===');
  await browser.close();
}

run().catch((err) => {
  console.error('Lỗi khi chạy QA test:', err);
  process.exit(1);
});
