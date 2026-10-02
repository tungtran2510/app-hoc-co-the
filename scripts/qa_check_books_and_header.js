const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Đăng nhập admin
  await page.request.post(`${BASE_URL}/api/admin/login`, {
    data: { password: 'Admin@2026!' },
  });

  // 1. Kiểm tra Card Sách có hàng nút Admin tách riêng không bị đè
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Cuộn xuống dưới trang chủ nơi có phần Tài liệu / Sách
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight * 0.7);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '280_qa_book_card_clean_admin_buttons.png') });
  console.log('✓ Chụp ảnh 280_qa_book_card_clean_admin_buttons.png');

  // 2. Kiểm tra Bài học & Mở Drawer Mục Lục từ nút tròn nổi
  await page.goto(`${BASE_URL}/cot-song/dia-dem`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Nút tròn nổi mục lục bên trái có class fixed hoặc chứa icon List
  const floatingTocBtn = page.locator('button.fixed, button:has(.lucide-list), button[title*="mục lục"], button[title*="Mục lục"]').first();
  if (await floatingTocBtn.isVisible()) {
    await floatingTocBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '281_qa_lesson_full_toc_items.png') });
    console.log('✓ Chụp ảnh 281_qa_lesson_full_toc_items.png');
  } else {
    // Thử click vào badge số mục lục
    const anyToc = page.locator('button:has-text("8"), div:has-text("8")').first();
    if (await anyToc.isVisible()) {
      await anyToc.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '281_qa_lesson_full_toc_items.png') });
      console.log('✓ Chụp ảnh 281_qa_lesson_full_toc_items.png');
    }
  }

  // 3. Cuộn xem khối so sánh 2 cột và các khối khác trong bài
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  await page.evaluate(() => window.scrollTo(0, 1200));
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '282_qa_lesson_comparison_table.png') });
  console.log('✓ Chụp ảnh 282_qa_lesson_comparison_table.png');

  await browser.close();
}

main().catch(console.error);
