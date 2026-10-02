const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 375, height: 812 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
  });

  const loginRes = await fetch('https://app-hoc-co-the.vercel.app/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Admin@2026!' })
  });
  const data = await loginRes.json();

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
    localStorage.setItem('app_user_display_name', 'Dr. Tùng');
    sessionStorage.setItem('app_user_name_prompted', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  }, data.token);

  await page.goto('https://app-hoc-co-the.vercel.app?nocache=' + Date.now(), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2500);

  // Close any modal if visible
  const skipBtn = page.locator('button:has-text("Để sau")').first();
  if (await skipBtn.isVisible()) {
    await skipBtn.click();
    await page.waitForTimeout(500);
  }

  // Cuộn xuống tìm "Tài Liệu Chuyên Sâu"
  const authorBooksSection = page.locator('text=Tài Liệu Chuyên Sâu').first();
  if (await authorBooksSection.isVisible()) {
    await authorBooksSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
    console.log('✓ Đã thấy section Tài Liệu Chuyên Sâu');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '423_qa_author_books_on_vercel.png') });
  } else {
    console.log('Không thấy text Tài Liệu Chuyên Sâu');
  }

  // Tìm các nút Sửa trong section đó
  const allBtns = await page.$$eval('section button', btns => btns.map(b => ({
    text: b.innerText.trim(),
    title: b.getAttribute('title'),
    className: b.className
  })));
  console.log('Buttons inside sections:', allBtns.filter(b => b.text.includes('Sửa') || (b.title && b.title.includes('Sửa'))));

  // Thử bấm nút sửa sách đầu tiên
  const editBtn = page.locator('button[title="Sửa cuốn sách này"]').first();
  if (await editBtn.isVisible()) {
    console.log('Bấm nút Sửa cuốn sách này...');
    await editBtn.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '424_qa_modal_after_click_on_vercel.png') });
    console.log('✓ Đã chụp 424_qa_modal_after_click_on_vercel.png');
  } else {
    console.log('Nút Sửa cuốn sách này không visible');
  }

  await browser.close();
})();
