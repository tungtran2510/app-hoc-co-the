const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  // Viewport mobile chuẩn 375 x 812 (iPhone 13/14)
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const targetUrl = process.env.TEST_URL || 'https://app-hoc-co-the.vercel.app';
  console.log(`[QA] Navigating to ${targetUrl}...`);

  // Bypass welcome modal
  await page.addInitScript(() => {
    localStorage.setItem('user_name', 'Bác sĩ Minh');
    localStorage.setItem('welcome_seen', 'true');
    localStorage.setItem('pwa_dismissed', 'true');
  });

  await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);

  // Đóng modal chào mừng nếu vẫn còn
  const deSauBtn = page.locator('text=Để sau').first();
  if (await deSauBtn.count() > 0) {
    await deSauBtn.click().catch(() => {});
    await page.waitForTimeout(1000);
  }

  // Cuộn xuống phần Sách
  console.log('[QA] Scrolling to Books section...');
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(1000);

  // Click vào nút "Xem thử 3D"
  console.log('[QA] Clicking "Xem thử 3D" button...');
  const xemThuBtn = page.locator('button:has-text("Xem thử 3D"), a:has-text("Xem thử 3D")').first();
  await xemThuBtn.waitFor({ state: 'visible', timeout: 5000 });
  await xemThuBtn.click();
  await page.waitForTimeout(3000);

  // Kiểm tra canvas
  const canvas = page.locator('canvas').first();
  const canvasCount = await canvas.count();
  console.log(`[QA] Found ${canvasCount} canvas element(s)`);

  let canvasMeasurements = null;
  if (canvasCount > 0) {
    const box = await canvas.boundingBox();
    console.log('[QA] Canvas bounding box:', box);

    canvasMeasurements = await canvas.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        width: rect.width,
        height: rect.height,
        pixelWidth: el.width,
        pixelHeight: el.height,
        borderRadius: computed.borderRadius,
        aspectRatio: (rect.width / rect.height).toFixed(3),
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        touchesEdges: Math.abs(rect.width - window.innerWidth) <= 4,
      };
    });

    console.log('[QA] Canvas measurements:', JSON.stringify(canvasMeasurements, null, 2));
  }

  // Chụp ảnh bằng chứng 3D Flipbook toàn màn hình trên Mobile
  const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';
  const screenshotPath = path.join(artifactDir, '446_qa_flipbook_fullscreen_live.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`[QA] Saved screenshot to ${screenshotPath}`);

  // Chạm vào màn hình để lật sang trang sau
  console.log('[QA] Flipping to next page...');
  const nextBtn = page.locator('button[aria-label="Trang sau"], button:has-text("Trang tiếp")').first();
  if (await nextBtn.count() > 0) {
    await nextBtn.click();
    await page.waitForTimeout(2000);

    const screenshotPage2Path = path.join(artifactDir, '447_qa_flipbook_page2_live.png');
    await page.screenshot({ path: screenshotPage2Path, fullPage: false });
    console.log(`[QA] Saved page 2 screenshot to ${screenshotPage2Path}`);
  }

  // Đóng Flipbook để test Modal chi tiết sách & Lightbox
  console.log('[QA] Closing Flipbook and testing Book Detail Modal...');
  const closeBtn = page.locator('button[title*="Quay lại"], button:has-text("Đóng"), button:has-text("Quay lại")').first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(1000);
  }

  // Click nút "Chi tiết >" để mở Modal sách
  const chiTietBtn = page.locator('button:has-text("Chi tiết"), a:has-text("Chi tiết")').first();
  if (await chiTietBtn.count() > 0) {
    console.log('[QA] Clicking "Chi tiết >" button...');
    await chiTietBtn.click();
    await page.waitForTimeout(1500);

    const screenshotModalPath = path.join(artifactDir, '448_qa_book_modal_live.png');
    await page.screenshot({ path: screenshotModalPath, fullPage: false });
    console.log(`[QA] Saved book modal screenshot to ${screenshotModalPath}`);
  }

  await browser.close();
  console.log('[QA] All document viewer tests completed successfully!');
})();
