const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  console.log('Truy cập Vercel Live Production...');
  await page.goto('https://app-hoc-co-the.vercel.app/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Cuộn xuống kiểm tra danh sách phát không bị lặp tóm tắt
  await page.evaluate(() => window.scrollBy(0, 750));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '397_qa_live_vercel_playlist_clean.png') });
  console.log('✓ Đã chụp 397_qa_live_vercel_playlist_clean.png');

  // Mở tab Tóm tắt cốt lõi trên Vercel
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  const summaryTab = page.locator('button:has-text("Tóm tắt cốt lõi")').first();
  if (await summaryTab.isVisible()) {
    await summaryTab.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '398_qa_live_vercel_summary_tab.png') });
    console.log('✓ Đã chụp 398_qa_live_vercel_summary_tab.png');
  }

  await browser.close();
  console.log('Kiểm thử Vercel hoàn tất.');
})();
