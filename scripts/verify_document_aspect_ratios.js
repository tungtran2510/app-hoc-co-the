const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Viewport mobile chuẩn 375 x 812 (iPhone 13/14/X)
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const targetUrl = process.env.TEST_URL || 'http://localhost:3100';
  console.log(`[QA] Navigating to ${targetUrl}...`);

  try {
    await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`[QA] Warning networkidle timed out, waiting 3s...`);
    await page.waitForTimeout(3000);
  }

  // 1. Kiểm tra khối sách tác giả và mở xem Flipbook 3D
  console.log('[QA] Looking for Flipbook / Book buttons...');
  
  // Tìm nút Đọc thử tài liệu 3D hoặc bìa sách
  const flipbookTrigger = page.locator('text=Đọc thử tài liệu 3D, text=Chạm để mở đọc sách, text=Mở rộng').first();
  const triggerCount = await flipbookTrigger.count();

  if (triggerCount > 0) {
    console.log('[QA] Clicking trigger to open 3D Flipbook...');
    await flipbookTrigger.click();
    await page.waitForTimeout(2000);
  } else {
    // Thử click vào bìa sách đầu tiên
    const bookCover = page.locator('img[alt*="Xem trước bìa"], div[role="button"][aria-label*="Mở đọc"]').first();
    if (await bookCover.count() > 0) {
      console.log('[QA] Clicking book cover to open Flipbook...');
      await bookCover.click();
      await page.waitForTimeout(2000);
    }
  }

  // Kiểm tra canvas
  const canvas = page.locator('canvas').first();
  if (await canvas.count() > 0) {
    const box = await canvas.boundingBox();
    console.log('[QA] Canvas bounding box:', box);

    const canvasInfo = await canvas.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        pixelWidth: el.width,
        pixelHeight: el.height,
        borderRadius: computed.borderRadius,
        aspectRatio: (rect.width / rect.height).toFixed(3),
      };
    });

    console.log('[QA] Canvas measurements:', canvasInfo);
  }

  // Chụp ảnh bằng chứng
  const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';
  const screenshotPath = path.join(artifactDir, '443_qa_flipbook_aspect_ratio_mobile.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`[QA] Saved screenshot to ${screenshotPath}`);

  await browser.close();
  console.log('[QA] Done!');
})();
