const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });
  const page = await context.newPage();

  console.log('1. Vào Vercel /dang-nhap...');
  await page.goto('https://app-hoc-co-the.vercel.app/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="password"]', 'Admin@2026!');
  await page.click('button[type="submit"]');
  await page.waitForURL('https://app-hoc-co-the.vercel.app/', { timeout: 15000 });
  await page.waitForTimeout(3000);

  console.log('2. Đã ở URL:', page.url());

  // Tìm nút sửa của sách tác giả
  const editBtns = await page.$$('button[title="Sửa cuốn sách này"]');
  console.log('Tìm thấy nút "Sửa cuốn sách này":', editBtns.length);

  if (editBtns.length > 0) {
    console.log('Bấm nút sửa cuốn sách tác giả đầu tiên...');
    await editBtns[0].click();
    await page.waitForTimeout(2000);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, '421_qa_vercel_book_edit_modal.png') });
    console.log('Đã chụp 421_qa_vercel_book_edit_modal.png');

    // Kiểm tra modal nào đang mở
    const modalTitle = await page.evaluate(() => {
      const h3 = document.querySelector('h3');
      const h2 = document.querySelector('h2');
      const modal = document.querySelector('[role="dialog"]');
      return {
        h3: h3 ? h3.innerText : null,
        h2: h2 ? h2.innerText : null,
        modalText: modal ? modal.innerText.substring(0, 100) : null,
        allH2: Array.from(document.querySelectorAll('h2, h3, h4')).map(h => h.innerText),
      };
    });
    console.log('Modal titles detected:', JSON.stringify(modalTitle, null, 2));
  } else {
    console.log('Không tìm thấy nút "Sửa cuốn sách này" trên Vercel!');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '421_qa_vercel_no_btn.png') });
  }

  await browser.close();
})();
