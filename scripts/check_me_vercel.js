const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 375, height: 812 } });
  const page = await context.newPage();
  await page.goto('https://app-hoc-co-the.vercel.app/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.fill('input[type="password"]', 'Admin@2026!');
  await page.click('button:has-text("Vào chế độ chỉnh sửa")');
  await page.waitForTimeout(4000);
  const cookies = await context.cookies();
  console.log('Cookies on Vercel:', cookies.map(c => ({ name: c.name, value: c.value.substring(0, 10), domain: c.domain, secure: c.secure, sameSite: c.sameSite })));
  const me = await page.evaluate(() => fetch('/api/admin/me').then(r => r.json()));
  console.log('ME RESULT on Vercel:', me);
  const tokenLs = await page.evaluate(() => localStorage.getItem('app_admin_token'));
  console.log('Token in LS:', tokenLs);

  const authorSec = page.locator('text=Tài Liệu Chuyên Sâu').first();
  await authorSec.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  const dismissNameBtn = page.locator('button:has-text("Để sau")').first();
  if (await dismissNameBtn.isVisible()) {
    await dismissNameBtn.click();
    await page.waitForTimeout(500);
  }

  const editBtns = page.locator('button[title="Sửa cuốn sách này"]');
  const count = await editBtns.count();
  console.log('Count of "Sửa cuốn sách này":', count);
  if (count > 0) {
    console.log('Bấm nút Sửa cuốn sách tác giả đầu tiên...');
    await editBtns.first().click({ force: true });
    await page.waitForTimeout(2000);

    const modalTitle = await page.evaluate(() => {
      const h = document.querySelector('h2, h3, h4');
      return h ? h.innerText : 'None';
    });
    console.log('MODAL TITLE OPENED:', modalTitle);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '427_qa_live_vercel_single_modal_confirmed.png')
    });
    console.log('✓ Đã chụp 427_qa_live_vercel_single_modal_confirmed.png');
  }

  await browser.close();
})();
