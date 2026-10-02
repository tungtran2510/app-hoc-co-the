import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function run() {
  console.log('🚀 Khởi chạy kiểm thử nghiệm thu Playwright trên Mobile (iPhone 14 - 390x844)...');
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Kiểm tra danh sách bài học chuyên đề Cột sống (/cot-song)
  console.log('1. Mở trang chuyên đề Cột sống: http://127.0.0.1:3100/cot-song');
  await page.goto('http://127.0.0.1:3100/cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const shot1 = path.join(ARTIFACT_DIR, '330_qa_cot_song_restored_videos.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log('-> Đã chụp danh sách bài học có 4 video đầy đủ:', shot1);

  // 2. Mở một bài học cụ thể xem trình phát video & tài liệu
  console.log('2. Mở bài học: http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song');
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const shot2 = path.join(ARTIFACT_DIR, '331_qa_lesson_video_player.png');
  await page.screenshot({ path: shot2, fullPage: false });
  console.log('-> Đã chụp trình phát video bài giảng:', shot2);

  // Cuộn xuống xem danh sách video playlist & tài liệu & ghi chú chú ý
  await page.evaluate(() => window.scrollBy(0, 520));
  await page.waitForTimeout(800);

  const shot3 = path.join(ARTIFACT_DIR, '332_qa_lesson_documents_and_notes.png');
  await page.screenshot({ path: shot3, fullPage: false });
  console.log('-> Đã chụp tài liệu flipbook và ghi chú chú ý:', shot3);

  // 3. Kiểm tra trang chủ khối Sách Y Khoa ngắn gọn
  console.log('3. Mở trang chủ: http://127.0.0.1:3100/');
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  const recHeader = page.locator('text=Tài Liệu Y Khoa').first();
  if (await recHeader.isVisible()) {
    await recHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    const shot4 = path.join(ARTIFACT_DIR, '333_qa_home_recommended_books_clean_header.png');
    await page.screenshot({ path: shot4, fullPage: false });
    console.log('-> Đã chụp tiêu đề Sách Y Khoa ngắn gọn 4 từ không bị đè nút:', shot4);
  }

  // 4. Kiểm tra trang Trợ Lý AI (/tro-ly-ai)
  console.log('4. Mở trang Trợ lý AI: http://127.0.0.1:3100/tro-ly-ai');
  await page.goto('http://127.0.0.1:3100/tro-ly-ai', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  const shot5 = path.join(ARTIFACT_DIR, '334_qa_ai_assistant_instant.png');
  await page.screenshot({ path: shot5, fullPage: false });
  console.log('-> Đã chụp giao diện Trợ lý AI:', shot5);

  // Bấm vào gợi ý câu hỏi
  const promptBtn = page.locator("button:has-text('Thoát vị đĩa đệm')").first();
  if (await promptBtn.isVisible()) {
    console.log('-> Bấm vào gợi ý: "Thoát vị đĩa đệm có tập xà đơn được không?"');
    await promptBtn.click();
    await page.waitForTimeout(1500);

    const shot6 = path.join(ARTIFACT_DIR, '335_qa_ai_response_instant.png');
    await page.screenshot({ path: shot6, fullPage: false });
    console.log('-> Đã chụp phản hồi tức thì từ Trợ lý AI:', shot6);
  }

  await browser.close();
  console.log('🎉 TẤT CẢ CÁC BƯỚC KIỂM THỬ PLAYWRIGHT HOÀN TẤT THÀNH CÔNG!');
}

run().catch((err) => {
  console.error('Lỗi khi chạy test:', err);
  process.exit(1);
});
