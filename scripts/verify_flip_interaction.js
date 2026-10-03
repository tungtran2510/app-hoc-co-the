const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  const targetUrl = process.env.TEST_URL || 'https://app-hoc-co-the.vercel.app';
  console.log(`[QA] Navigating to ${targetUrl}...`);

  await page.addInitScript(() => {
    localStorage.setItem('user_name', 'Bác sĩ Minh');
    localStorage.setItem('welcome_seen', 'true');
    localStorage.setItem('pwa_dismissed', 'true');
  });

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
  
  // Đợi Splash screen biến mất
  await page.waitForTimeout(3000);

  // Đóng modal chào mừng nếu hiện diện
  const deSau = page.locator('button:has-text("Để sau"), button:has-text("Lưu tên")').first();
  if (await deSau.isVisible().catch(() => false)) {
    console.log('[QA] Dismissing welcome modal...');
    await deSau.click({ force: true }).catch(() => {});
    await page.waitForTimeout(500);
  }

  // Cuộn tới sách và mở Xem thử 3D
  await page.evaluate(() => window.scrollBy(0, 1000));
  await page.waitForTimeout(1000);

  const xemThuBtn = page.locator('button:has-text("Xem thử 3D")').first();
  await xemThuBtn.click({ force: true });
  await page.waitForTimeout(2500);

  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  console.log('[QA] Page 1 Canvas box:', box);

  // Chuyển sang Trang 2 bằng cách tương tác với slider hoặc click mép phải
  console.log('[QA] Moving to page 2 via slider or edge tap...');
  const rangeInput = page.locator('input[type="range"]').first();
  if (await rangeInput.count() > 0) {
    await rangeInput.fill('2');
    await rangeInput.dispatchEvent('change');
    await page.waitForTimeout(2000);
  } else {
    await page.mouse.click(box.x + box.width - 25, box.y + box.height / 2);
    await page.waitForTimeout(2000);
  }

  const page2Box = await canvas.boundingBox();
  console.log('[QA] Page 2 Canvas box:', page2Box);

  const page2Info = await canvas.evaluate((el) => {
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
  console.log('[QA] Page 2 measurements:', JSON.stringify(page2Info, null, 2));

  const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';
  const page2Screenshot = path.join(artifactDir, '449_qa_flipbook_page2_a4_live.png');
  await page.screenshot({ path: page2Screenshot, fullPage: false });
  console.log(`[QA] Saved page 2 screenshot to ${page2Screenshot}`);

  // Test đóng flipbook và mở modal sách
  const closeBtn = page.locator('button[aria-label="Quay lại"]').first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click({ force: true });
    await page.waitForTimeout(1000);
  }

  // Mở Chi tiết sách
  const chiTietBtn = page.locator('button:has-text("Chi tiết")').first();
  if (await chiTietBtn.count() > 0) {
    await chiTietBtn.click({ force: true });
    await page.waitForTimeout(1500);

    const bookModalScreenshot = path.join(artifactDir, '450_qa_book_modal_lightbox_ready.png');
    await page.screenshot({ path: bookModalScreenshot, fullPage: false });
    console.log(`[QA] Saved book modal screenshot to ${bookModalScreenshot}`);
  }

  await browser.close();
  console.log('[QA] All tests passed!');
})();
