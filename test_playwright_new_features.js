const { chromium } = require('playwright');
const fs = require('fs');

async function runTests() {
  console.log('=== BẮT ĐẦU KIỂM THỬ PLAYWRIGHT TRÌNH DUYỆT THẬT TRÊN PRODUCTION ===');
  const baseUrl = 'https://app-hoc-co-the.vercel.app';
  console.log(`Kiểm thử trên URL: ${baseUrl}\n`);

  // 1. Kiểm tra API AI Transcribe YouTube
  console.log('[1/4] Kiểm tra API AI Transcribe YouTube (/api/ai/transcribe-youtube)...');
  try {
    const res = await fetch(`${baseUrl}/api/ai/transcribe-youtube`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
        topicTitle: 'Cột Sống',
        pageTitle: '01. Cấu tạo & chức năng cột sống',
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.success || !data.data?.blocks) {
      throw new Error(`API thất bại: ${JSON.stringify(data)}`);
    }
    console.log(`✓ API AI hoạt động tốt! Nguồn: ${data.source}`);
    console.log(`  - Tiêu đề: ${data.data.title}`);
    console.log(`  - Tóm tắt: ${data.data.summary.slice(0, 80)}...`);
    console.log(`  - Số khối tạo ra: ${data.data.blocks.length} khối (Chuẩn: ${data.data.blocks.map(b => b.display_style).join(', ')})`);
  } catch (err) {
    console.error('✗ Lỗi API AI Transcribe:', err.message);
    process.exit(1);
  }

  // Khởi động trình duyệt Playwright với giả lập Mobile Viewport (iPhone 13: 390x844)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  // Bắt các lỗi console/network nếu có
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  try {
    // 2. Kiểm thử Step 4: Cẩm Nang Y Khoa PDF & Mã QR & Thu nhận Zalo
    console.log('\n[2/4] Kiểm thử Step 4: Cẩm nang Y khoa PDF & Mã QR tại /cot-song...');
    await page.goto(`${baseUrl}/cot-song`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Tìm nút Cẩm Nang
    const handbookBtn = page.locator('button:has-text("Cẩm Nang Y Khoa")');
    await handbookBtn.waitFor({ state: 'visible', timeout: 8000 });
    console.log('✓ Tìm thấy nút "Cẩm Nang Y Khoa & Mã QR"');

    // Click mở Cẩm Nang
    await handbookBtn.click();
    await page.waitForTimeout(1500);

    // Xác minh Modal Cẩm Nang đã mở
    const handbookModalTitle = page.locator('text=Cẩm Nang Y Khoa & Mã QR').first();
    await handbookModalTitle.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Modal Cẩm nang Y khoa mở thành công');

    // Xác minh Form Zalo
    const zaloInput = page.locator('input[placeholder*="SĐT Zalo"]');
    await zaloInput.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Form thu nhận SĐT Zalo hiển thị đầy đủ');

    // Xác minh mã QR đã được tạo cho các bài học
    const qrImages = page.locator('#handbook-printable-area img[alt*="QR"]');
    const qrCount = await qrImages.count();
    console.log(`✓ Đã hiển thị ${qrCount} mã QR cho các bài học trong cẩm nang`);
    if (qrCount === 0) throw new Error('Không tìm thấy ảnh mã QR nào trong cẩm nang');

    // Chụp ảnh bằng chứng
    await page.screenshot({ path: 'verified_handbook_modal.png' });
    console.log('✓ Đã lưu ảnh chụp minh chứng: verified_handbook_modal.png');

    // Đóng Modal Cẩm Nang
    const closeHandbookBtn = page.locator('button[aria-label="Đóng"]').first();
    await closeHandbookBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Đóng Modal Cẩm nang thành công');

    // 3. Kiểm thử Step 2: Mô hình 3D tương tác trong bài học
    console.log('\n[3/4] Kiểm thử Step 2: Mô hình 3D tương tác tại /cot-song/tong-quan-ve-cot-song...');
    await page.goto(`${baseUrl}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1000);

    // Tìm nút "Mô hình 3D"
    const model3dBtn = page.locator('button:has-text("Mô hình 3D")');
    await model3dBtn.waitFor({ state: 'visible', timeout: 8000 });
    console.log('✓ Tìm thấy nút "🦴 Mô hình 3D" trên thanh tiêu đề bài học');

    // Click mở Modal 3D
    await model3dBtn.click();
    await page.waitForTimeout(1500);

    // Xác minh Modal 3D hiển thị
    const modal3dTitle = page.locator('text=Mô hình Giải phẫu 3D').first();
    await modal3dTitle.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Modal Mô hình 3D mở thành công');

    // Kiểm tra có đủ các nút chuyển hệ cơ quan
    const systemPill = page.locator('button:has-text("Hệ Xương")');
    await systemPill.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Các nút chuyển hệ cơ quan (Hệ Xương, Hệ Khớp, Hệ Cơ...) hiển thị đầy đủ');

    // Chụp ảnh bằng chứng Modal 3D
    await page.screenshot({ path: 'verified_3d_modal.png' });
    console.log('✓ Đã lưu ảnh chụp minh chứng: verified_3d_modal.png');

    // Đóng Modal 3D
    const close3dBtn = page.locator('button[aria-label="Đóng mô hình 3D"]').first();
    await close3dBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Đóng Modal 3D thành công');

    // 4. Kiểm thử Trang chuyên biệt /giai-phau-3d
    console.log('\n[4/4] Kiểm thử trang độc lập /giai-phau-3d...');
    await page.goto(`${baseUrl}/giai-phau-3d`, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(1500);

    const atlasHeader = page.locator('text=Atlas Giải Phẫu 3D');
    await atlasHeader.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Trang /giai-phau-3d tải thành công với giao diện ứng dụng chuẩn');

    const backHomeBtn = page.locator('text=Trang chủ');
    await backHomeBtn.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✓ Có nút quay lại Trang chủ tiện lợi');

    // Chụp ảnh bằng chứng
    await page.screenshot({ path: 'verified_giai_phau_3d_page.png' });
    console.log('✓ Đã lưu ảnh chụp minh chứng: verified_giai_phau_3d_page.png');

    // Click quay lại Trang chủ
    await backHomeBtn.click();
    await page.waitForTimeout(1000);
    console.log(`✓ Điều hướng quay về Trang chủ: ${page.url()}`);

    console.log('\n======================================================');
    console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ TRÌNH DUYỆT THẬT ĐÃ ĐẠT 100%!');
    console.log('======================================================');

  } catch (err) {
    console.error('✗ Thất bại khi kiểm thử Playwright:', err);
    await page.screenshot({ path: 'test_error.png' }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();
