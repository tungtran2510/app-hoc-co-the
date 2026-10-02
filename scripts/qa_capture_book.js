const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Scroll down to the FlipbookViewer
  const bookEl = page.locator('div[role="button"]:has-text("Chạm để mở đọc")').first();
  if (await bookEl.isVisible()) {
    await bookEl.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '382_qa_book_cover_full_view.png') });
    console.log('Took 382_qa_book_cover_full_view.png');
  } else {
    console.log('Book element not found by role button, trying text Tài liệu học tập');
    const taiLieuHocTap = page.locator('text=Tài liệu học tập').first();
    if (await taiLieuHocTap.isVisible()) {
      await taiLieuHocTap.scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '382_qa_book_cover_full_view.png') });
      console.log('Took 382_qa_book_cover_full_view.png via header');
    }
  }

  // Also test clicking 'Tài liệu' tab
  const taiLieuTab = page.locator('button:has-text("Tài liệu")').first();
  if (await taiLieuTab.isVisible()) {
    await taiLieuTab.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '383_qa_tai_lieu_tab.png') });
    console.log('Took 383_qa_tai_lieu_tab.png');
  }

  await browser.close();
})();
