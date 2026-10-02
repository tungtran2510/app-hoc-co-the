const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 });
  await context.addInitScript(() => {
    localStorage.setItem('hoc_co_the_user_name', 'Học viên');
    localStorage.setItem('pwa_prompt_dismissed', 'true');
    localStorage.setItem('app_install_dismissed', 'true');
  });
  const page = await context.newPage();

  console.log('Navigating to live production: https://app-hoc-co-the.vercel.app ...');
  await page.goto('https://app-hoc-co-the.vercel.app', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Close any overlay if still open
  const deSauBtn = page.locator('button:has-text("Để sau")').first();
  if (await deSauBtn.isVisible()) {
    await deSauBtn.click();
    await page.waitForTimeout(500);
  }

  // Scroll to author profile section
  const authorHeading = page.locator('text=TÙNG DINH DƯỠNG').first();
  await authorHeading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // 1. Capture author card with new Navy "Xem chi tiết" button
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '441_qa_live_vercel_author_detail_btn.png') });
  console.log('Captured 441_qa_live_vercel_author_detail_btn.png');

  // 2. Click "Xem chi tiết" button
  const detailBtn = page.locator('button:has-text("Xem chi tiết")').first();
  if (await detailBtn.isVisible()) {
    console.log('Clicking "Xem chi tiết" button...');
    await detailBtn.click();
    await page.waitForTimeout(1000);

    // Capture open modal
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '442_qa_live_vercel_author_modal.png') });
    console.log('Captured 442_qa_live_vercel_author_modal.png');

    // Close modal
    const closeBtn = page.locator('button[title="Đóng"], button:has-text("Đóng")').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await page.waitForTimeout(500);
      console.log('Modal closed successfully');
    }
  } else {
    console.error('ERROR: "Xem chi tiết" button not found!');
  }

  await browser.close();
  console.log('Verification finished.');
})();
