const { chromium } = require('playwright');
const path = require('path');

async function testAiUiClean() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('=== KIỂM THỬ GIAO DIỆN TRỢ LÝ AI TRẮNG THOÁNG ĐÃNG & CÂU HỎI TRÊN ĐẦU ===');

  // 1. Vào bài học Đĩa đệm
  console.log('1. Mở trang bài học Đĩa đệm...');
  await page.goto('https://app-hoc-co-the.vercel.app/cot-song/dia-dem', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2000);

  // 2. Bấm nút AI nổi "Hỏi bài này"
  const floatingBtn = page.locator('aside button:has-text("Hỏi bài này")').first();
  await floatingBtn.click();
  await page.waitForTimeout(2500);

  console.log(`- Đã vào URL: ${page.url()}`);

  // Chụp ảnh màn hình mới mở: Màn hình trắng thoáng đãng, các câu hỏi trên đỉnh
  await page.screenshot({ path: path.join(__dirname, 'verified_ai_clean_white_canvas.png') });
  console.log('- Đã chụp ảnh verified_ai_clean_white_canvas.png');

  // Kiểm tra 4 câu hỏi gợi ý trên đỉnh
  const chip1 = await page.locator('button:has-text("Bài học rút ra từ bài này là gì?")').isVisible();
  const chip2 = await page.locator('button:has-text("Ý nghĩa cốt lõi của Đĩa đệm?")').isVisible();
  const chip3 = await page.locator('button:has-text("Sai lầm thường gặp liên quan đến bài này?")').isVisible();
  const chip4 = await page.locator('button:has-text("Ứng dụng vào thực tế hàng ngày?")').isVisible();

  console.log(`- Chip 1 (Bài học rút ra): ${chip1 ? 'PASS' : 'FAIL'}`);
  console.log(`- Chip 2 (Ý nghĩa cốt lõi): ${chip2 ? 'PASS' : 'FAIL'}`);
  console.log(`- Chip 3 (Sai lầm cần tránh): ${chip3 ? 'PASS' : 'FAIL'}`);
  console.log(`- Chip 4 (Ứng dụng thực tế): ${chip4 ? 'PASS' : 'FAIL'}`);

  // 3. Bấm vào chip câu hỏi đầu tiên "Bài học rút ra từ bài này là gì?"
  console.log('2. Bấm vào chip câu hỏi "Bài học rút ra từ bài này là gì?"...');
  const firstChip = page.locator('button:has-text("Bài học rút ra từ bài này là gì?")').first();
  await firstChip.click();

  // Đợi AI trả lời
  console.log('3. Chờ AI trả lời...');
  try {
    await page.waitForSelector('text=Tài liệu tác giả', { timeout: 30000 });
    console.log('- AI đã trả lời thành công!');
  } catch (e) {
    console.log('- Đợi thêm phản hồi...');
    await page.waitForTimeout(6000);
  }

  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(__dirname, 'verified_ai_clean_response.png') });
  console.log('- Đã chụp ảnh verified_ai_clean_response.png');

  // 4. Kiểm tra nút "Lịch sử cũ"
  const historyToggle = page.locator('button:has-text("Lịch sử cũ")').first();
  const hasHistoryToggle = await historyToggle.isVisible().catch(() => false);
  console.log(`- Nút Lịch sử cũ hiển thị: ${hasHistoryToggle}`);
  if (hasHistoryToggle) {
    await historyToggle.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(__dirname, 'verified_ai_history_expanded.png') });
    console.log('- Đã bấm mở rộng lịch sử và chụp verified_ai_history_expanded.png');
  }

  await browser.close();
  console.log('=== HOÀN TẤT KIỂM THỬ GIAO DIỆN TRỢ LÝ AI ===');
}

testAiUiClean().catch(err => {
  console.error('Lỗi khi chạy Playwright test:', err);
  process.exit(1);
});
