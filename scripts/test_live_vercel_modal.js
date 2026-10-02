const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  // Login via API to get real session token
  const loginRes = await fetch('https://app-hoc-co-the.vercel.app/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Admin@2026!' })
  });
  const data = await loginRes.json();
  console.log('Login result:', data);

  // Set cookies and localStorage
  await context.addCookies([
    {
      name: 'app_admin_session',
      value: data.token,
      domain: 'app-hoc-co-the.vercel.app',
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    }
  ]);

  const page = await context.newPage();
  await page.addInitScript((token) => {
    localStorage.setItem('app_admin_token', token);
    localStorage.setItem('qbiz_books_intro_seen', '1');
    localStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  }, data.token);

  console.log('Truy cập trang chủ Vercel...');
  await page.goto('https://app-hoc-co-the.vercel.app?nocache=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Tìm nút sửa của sách tác giả
  const editBtns = await page.$$('button[title="Sửa cuốn sách này"]');
  console.log('Tìm thấy nút "Sửa cuốn sách này":', editBtns.length);

  if (editBtns.length > 0) {
    console.log('Bấm nút sửa cuốn sách tác giả đầu tiên...');
    await editBtns[0].click();
    await page.waitForTimeout(1500);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, '422_qa_live_vercel_single_book_modal.png') });
    console.log('✓ ĐÃ CHỤP 422_qa_live_vercel_single_book_modal.png');

    const modalTitle = await page.evaluate(() => {
      const heading = document.querySelector('h2, h3, h4');
      return heading ? heading.innerText : null;
    });
    console.log('Modal heading text:', modalTitle);
  } else {
    console.log('KHÔNG TÌM THẤY NÚT SỬA CUỐN SÁCH NÀY TRÊN VERCEL!');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '422_qa_live_vercel_failed.png') });
  }

  await browser.close();
})();
