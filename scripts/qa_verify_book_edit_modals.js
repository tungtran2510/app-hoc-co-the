const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

(async () => {
  const browser = await chromium.launch();

  // ==========================================
  // 1. MOBILE TEST (390 x 844)
  // ==========================================
  console.log('--- 1. Testing Mobile Viewport (390 x 844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  const loginOk = await mobilePage.evaluate(async () => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'Admin@2026!' }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('app_admin_token', data.token);
        localStorage.setItem('app_user_display_name', 'Admin');
        sessionStorage.setItem('app_user_name_prompted', 'true');
        sessionStorage.setItem('pwa_banner_dismissed', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });
  console.log('Mobile in-page admin login result:', loginOk);
  await mobilePage.reload({ waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(2000);

  // Tìm nút sửa của sách
  const bookEditBtns = mobilePage.locator('button[title="Sửa cuốn sách này"]');
  const btnCount = await bookEditBtns.count();
  console.log('Book edit buttons found:', btnCount);

  if (btnCount > 0) {
    // 1. Mở sách Tác giả đầu tiên
    console.log('Opening Author Book modal...');
    await bookEditBtns.first().click({ force: true });
    await mobilePage.waitForTimeout(1000);

    // Chụp ảnh modal sửa sách tác giả trên mobile
    await mobilePage.screenshot({
      path: path.join(ARTIFACT_DIR, '447_qa_mobile_author_book_edit_modal.png'),
    });
    console.log('Saved: 447_qa_mobile_author_book_edit_modal.png');

    // Cuộn xuống xem khối 3D Flipbook intake
    const flipbookSection = mobilePage.locator('text=Tài Liệu Xem Thử 3D');
    if (await flipbookSection.count() > 0) {
      await flipbookSection.scrollIntoViewIfNeeded();
      await mobilePage.waitForTimeout(500);
      await mobilePage.screenshot({
        path: path.join(ARTIFACT_DIR, '448_qa_mobile_author_book_flipbook_intake.png'),
      });
      console.log('Saved: 448_qa_mobile_author_book_flipbook_intake.png');
    }

    // Đóng modal
    const closeBtn = mobilePage.locator('button:has-text("Hủy bỏ")');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click({ force: true });
      await mobilePage.waitForTimeout(600);
    }

    // 2. Mở sách Nên đọc (button thứ 3 trở đi)
    if (btnCount >= 3) {
      console.log('Opening Recommended Book modal...');
      await bookEditBtns.nth(2).click({ force: true });
      await mobilePage.waitForTimeout(1000);

      await mobilePage.screenshot({
        path: path.join(ARTIFACT_DIR, '449_qa_mobile_rec_book_edit_modal.png'),
      });
      console.log('Saved: 449_qa_mobile_rec_book_edit_modal.png');

      // Click nút Dán Link URL để kiểm tra tương tác
      const urlBtn = mobilePage.locator('button:has-text("Dán Link URL")');
      if (await urlBtn.count() > 0) {
        await urlBtn.first().click({ force: true });
        await mobilePage.waitForTimeout(500);
        await mobilePage.screenshot({
          path: path.join(ARTIFACT_DIR, '450_qa_mobile_rec_book_url_input.png'),
        });
        console.log('Saved: 450_qa_mobile_rec_book_url_input.png');
      }

      const closeRecBtn = mobilePage.locator('button:has-text("Hủy bỏ")');
      if (await closeRecBtn.count() > 0) {
        await closeRecBtn.first().click({ force: true });
        await mobilePage.waitForTimeout(600);
      }
    }
  }

  // Tìm nút sửa của sách Nên đọc (Recommended books)
  const recBookEditBtns = mobilePage.locator('button[title*="Sửa riêng cuốn sách này"], button[title*="Sửa thông tin cuốn sách"], button:has-text("Sửa tài liệu"), button:has-text("Sửa sách này")');
  const recCount = await recBookEditBtns.count();
  console.log('Recommended book edit buttons found:', recCount);

  if (recCount > 0) {
    // Click nút sửa sách nên đọc (thường là nút thứ 2 hoặc nút trong section recommended books)
    await recBookEditBtns.last().click();
    await mobilePage.waitForTimeout(1000);

    // Chụp modal sách nên đọc trên mobile
    await mobilePage.screenshot({
      path: path.join(ARTIFACT_DIR, '449_qa_mobile_rec_book_edit_modal.png'),
    });
    console.log('Saved: 449_qa_mobile_rec_book_edit_modal.png');

    // Click nút Dán Link URL để kiểm tra tương tác
    const urlBtn = mobilePage.locator('button:has-text("Dán Link URL")');
    if (await urlBtn.count() > 0) {
      await urlBtn.first().click();
      await mobilePage.waitForTimeout(500);
      await mobilePage.screenshot({
        path: path.join(ARTIFACT_DIR, '450_qa_mobile_rec_book_url_input.png'),
      });
      console.log('Saved: 450_qa_mobile_rec_book_url_input.png');
    }

    const closeBtn = mobilePage.locator('button[aria-label="Đóng"], button:has-text("Hủy bỏ")');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click();
      await mobilePage.waitForTimeout(600);
    }
  }

  // ==========================================
  // 2. DESKTOP TEST (1280 x 800)
  // ==========================================
  console.log('--- 2. Testing Desktop Viewport (1280 x 800) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1.5,
  });

  const desktopPage = await desktopContext.newPage();
  await desktopPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  const deskLoginOk = await desktopPage.evaluate(async () => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'Admin@2026!' }),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('app_admin_token', data.token);
        localStorage.setItem('app_user_display_name', 'Admin');
        sessionStorage.setItem('app_user_name_prompted', 'true');
        sessionStorage.setItem('pwa_banner_dismissed', 'true');
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });
  console.log('Desktop in-page admin login result:', deskLoginOk);
  await desktopPage.reload({ waitUntil: 'domcontentloaded' });
  await desktopPage.waitForTimeout(2000);

  const deskBookEditBtns = desktopPage.locator('button[title="Sửa cuốn sách này"]');
  const deskBtnCount = await deskBookEditBtns.count();
  console.log('Desktop book edit buttons found:', deskBtnCount);

  if (deskBtnCount > 0) {
    console.log('Opening Desktop Author Book modal...');
    await deskBookEditBtns.first().click({ force: true });
    await desktopPage.waitForTimeout(1000);
    await desktopPage.screenshot({
      path: path.join(ARTIFACT_DIR, '451_qa_desktop_author_book_edit_modal.png'),
    });
    console.log('Saved: 451_qa_desktop_author_book_edit_modal.png');

    const closeBtn = desktopPage.locator('button:has-text("Hủy bỏ")');
    if (await closeBtn.count() > 0) {
      await closeBtn.first().click({ force: true });
      await desktopPage.waitForTimeout(600);
    }

    if (deskBtnCount >= 3) {
      console.log('Opening Desktop Recommended Book modal...');
      await deskBookEditBtns.nth(2).click({ force: true });
      await desktopPage.waitForTimeout(1000);
      await desktopPage.screenshot({
        path: path.join(ARTIFACT_DIR, '452_qa_desktop_rec_book_edit_modal.png'),
      });
      console.log('Saved: 452_qa_desktop_rec_book_edit_modal.png');
    }
  }

  console.log('QA test completed successfully!');
  await browser.close();
})();
