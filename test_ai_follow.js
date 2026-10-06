const { chromium } = require('playwright');
const path = require('path');

async function testAiFollow() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  console.log('--- BẮT ĐẦU KIỂM THỬ TÍNH NĂNG AI BÁM ĐUỔI BÀI HỌC ---');

  // BƯỚC 1: Truy cập bài học Đĩa đệm thuộc chuyên đề Cột Sống
  console.log('1. Đang mở trang bài học Đĩa đệm...');
  await page.goto('https://app-hoc-co-the.vercel.app/cot-song/dia-dem', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(3000);

  // Kiểm tra nút AI nổi bám đuổi
  const floatingBtn = await page.locator('aside button:has-text("Hỏi bài này")').first();
  const floatingBtnExists = await floatingBtn.count();
  console.log(`- Nút nổi hiển thị "Hỏi bài này": ${floatingBtnExists > 0 ? 'PASS' : 'FAIL'}`);

  // Chụp ảnh trang bài học có nút nổi
  await page.screenshot({ path: path.join(__dirname, 'verified_lesson_with_floating_ai.png') });

  // BƯỚC 2: Bấm vào nút AI nổi "Hỏi bài này"
  console.log('2. Bấm vào nút AI nổi để mở Trợ lý AI...');
  await floatingBtn.click();
  await page.waitForTimeout(3000);

  const currentUrl = page.url();
  console.log(`- URL chuyển hướng: ${currentUrl}`);

  // Kiểm tra Thanh bám sát bài học (Context Bar)
  const contextBar = await page.locator('text=Đang bám sát bài học').first();
  const contextBarVisible = await contextBar.isVisible().catch(() => false);
  console.log(`- Thanh bám sát bài học hiển thị: ${contextBarVisible ? 'PASS' : 'FAIL'}`);

  // Kiểm tra câu hỏi chào mừng bám sát bài học
  const greetingCard = await page.locator('text=Bạn có câu hỏi gì về phần đĩa đệm này không?').first();
  const greetingVisible = await greetingCard.isVisible().catch(() => false);
  console.log(`- Lời chào hỏi trọng tâm bài học hiển thị: ${greetingVisible ? 'PASS' : 'FAIL'}`);

  // Kiểm tra gợi ý câu hỏi trọng tâm
  const promptHeading = await page.locator('text=Câu hỏi trọng tâm về "Đĩa đệm":').first();
  const promptHeadingVisible = await promptHeading.isVisible().catch(() => false);
  console.log(`- Tiêu đề câu hỏi trọng tâm hiển thị: ${promptHeadingVisible ? 'PASS' : 'FAIL'}`);

  // Chụp màn hình chào mừng bám đuổi
  await page.screenshot({ path: path.join(__dirname, 'verified_ai_welcome_card_followed.png') });

  // BƯỚC 3: Bấm vào câu hỏi gợi ý đầu tiên
  console.log('3. Bấm vào câu hỏi gợi ý để kiểm tra câu trả lời của AI...');
  const firstPrompt = page.locator('button:has-text("Giải thích chi tiết hơn về bài học: Đĩa đệm")').first();
  if (await firstPrompt.isVisible()) {
    await firstPrompt.click();
    console.log('- Đã bấm câu hỏi gợi ý, đang chờ AI phản hồi...');
    // Đợi phản hồi AI (tối đa 25 giây)
    try {
      await page.waitForSelector('text=Tài liệu tác giả', { timeout: 25000 });
      console.log('- AI đã trả lời thành công!');
    } catch (e) {
      console.log('- Đợi thêm phản hồi...');
      await page.waitForTimeout(5000);
    }
  }
  await page.waitForTimeout(4000);

  // Chụp ảnh phản hồi AI
  await page.screenshot({ path: path.join(__dirname, 'verified_ai_chat_response_followed.png') });

  // BƯỚC 4: Kiểm tra nút "Hỏi Trợ lý sức khỏe về bài này" dưới bài học video
  console.log('4. Kiểm tra nút hỏi AI dưới danh sách video...');
  await page.goto('https://app-hoc-co-the.vercel.app/cot-song/dia-dem', { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2500);

  // Cuộn xuống tìm thẻ "Hỏi Trợ lý sức khỏe về bài này"
  const askUnderVideo = page.locator('text=Hỏi Trợ lý sức khỏe về bài này').first();
  if (await askUnderVideo.isVisible()) {
    console.log('- Thẻ "Hỏi Trợ lý sức khỏe về bài này" hiển thị dưới danh sách video: PASS');
    await askUnderVideo.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    await askUnderVideo.click();
    console.log('- Đã bấm vào thẻ, đợi chuyển trang và tự động gửi câu hỏi...');
    await page.waitForTimeout(5000);
    console.log(`- URL sau khi bấm: ${page.url()}`);
    await page.screenshot({ path: path.join(__dirname, 'verified_ai_auto_query_from_video.png') });
  }

  await browser.close();
  console.log('--- HOÀN TẤT TOÀN BỘ KIỂM THỬ PLAYWRIGHT ---');
}

testAiFollow().catch(err => {
  console.error('Lỗi khi chạy Playwright test:', err);
  process.exit(1);
});
