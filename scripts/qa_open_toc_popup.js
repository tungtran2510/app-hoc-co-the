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

  // Mở bài học
  await page.goto(`${BASE_URL}/cot-song/dia-dem`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click vào nút mục lục nổi: role="button", aria-label="Mở mục lục bài học"
  const tocBtn = page.locator('[aria-label="Mở mục lục bài học"]').first();
  console.log('TOC button visible:', await tocBtn.isVisible());
  if (await tocBtn.isVisible()) {
    await tocBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '283_qa_lesson_open_toc_popup.png') });
    console.log('✓ Chụp ảnh 283_qa_lesson_open_toc_popup.png');
  }

  await browser.close();
}

main().catch(console.error);
