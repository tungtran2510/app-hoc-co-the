const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const deployUrl = 'https://app-hoc-co-aq6c6efcc-tungtran2510-3020s-projects.vercel.app';

async function run() {
  console.log('Khởi động Playwright Mobile Viewport 390x844...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. ĐĂNG NHẬP ADMIN ĐỂ MỞ CÀI ĐẶT
  console.log('1. Đăng nhập admin...');
  await page.goto(deployUrl + '/dang-nhap', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  await page.fill('input[type="tel"]', '0974248716');
  await page.fill('input[type="password"]', 'Tung@2510');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForTimeout(2000);

  // 2. MỞ CÀI ĐẶT QUẢN TRỊ - TAB GIAO DIỆN
  console.log('2. Mở Cài đặt quản trị - Tab Giao diện (2 Bảng màu)...');
  const settingsBtn = page.locator('button[title="Cài đặt quản trị"]').first();
  if (await settingsBtn.isVisible()) {
    await settingsBtn.click({ force: true });
  } else {
    const fallbackSettings = page.locator('button:has-text("Cài đặt")').first();
    await fallbackSettings.click({ force: true });
  }
  await page.waitForTimeout(1000);

  // Click tab Giao diện
  const uiTab = page.locator('button:has-text("Giao diện")');
  if (await uiTab.isVisible()) {
    await uiTab.click({ force: true });
    await page.waitForTimeout(800);
  }

  const p1 = path.join(artifactDir, '01_cai_dat_bang_mau_navy.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_cai_dat_bang_mau_navy.png');
  console.log('Đã chụp: 01_cai_dat_bang_mau_navy.png');

  // Chọn "Xanh Navy Sang Trọng"
  console.log('Chọn tông Xanh Navy Sang Trọng trong cài đặt...');
  const navyBtn = page.locator('button:has-text("Xanh Navy Sang Trọng")');
  if (await navyBtn.isVisible()) {
    await navyBtn.click({ force: true });
    await page.waitForTimeout(800);
  }

  // Đóng modal cài đặt
  const closeBtn = page.locator('button[aria-label="Đóng"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click({ force: true });
    await page.waitForTimeout(500);
  }

  // 3. CHỤP TRANG CHUYÊN ĐỀ CỘT SỐNG TRONG TÔNG XANH NAVY
  console.log('3. Chụp Trang Chuyên đề Cột Sống trong Tông Xanh Navy...');
  await page.goto(deployUrl + '/cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const p2 = path.join(artifactDir, '02_chuyen_de_cot_song_navy.png');
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, '02_chuyen_de_cot_song_navy.png');
  console.log('Đã chụp: 02_chuyen_de_cot_song_navy.png');

  // 4. CHỤP TRANG BÀI HỌC TRONG TÔNG XANH NAVY
  console.log('4. Chụp Trang Bài học Cột Sống...');
  await page.goto(deployUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const p3 = path.join(artifactDir, '03_bai_hoc_navy_luxury.png');
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, '03_bai_hoc_navy_luxury.png');
  console.log('Đã chụp: 03_bai_hoc_navy_luxury.png');

  // 5. CHỤP MENU TÙY CHỌN ⋮ VỚI BỘ CHỌN TÔNG MÀU SẮC
  console.log('5. Chụp Menu Tùy chọn ⋮...');
  const moreBtn = page.locator('button[aria-label="Tùy chọn"]');
  if (await moreBtn.isVisible()) {
    await moreBtn.click({ force: true });
    await page.waitForTimeout(800);
  }
  const p4 = path.join(artifactDir, '04_menu_tuy_chon_tong_mau.png');
  await page.screenshot({ path: p4 });
  fs.copyFileSync(p4, '04_menu_tuy_chon_tong_mau.png');
  console.log('Đã chụp: 04_menu_tuy_chon_tong_mau.png');

  // 6. CHỤP CHẾ ĐỘ TỐI TÔNG XANH NAVY (NIGHT NAVY LUXURY)
  console.log('6. Chụp Chế độ tối Tông Xanh Navy...');
  const darkBtn = page.locator('button:has-text("Nền Tối")');
  if (await darkBtn.isVisible()) {
    await darkBtn.click({ force: true });
    await page.waitForTimeout(500);
  }
  // Đóng options menu
  await page.locator('button[aria-label="Đóng bảng tùy chọn"]').click({ force: true }).catch(() => {});
  await page.waitForTimeout(1000);
  const p5 = path.join(artifactDir, '05_che_do_toi_navy_luxury.png');
  await page.screenshot({ path: p5 });
  fs.copyFileSync(p5, '05_che_do_toi_navy_luxury.png');
  console.log('Đã chụp: 05_che_do_toi_navy_luxury.png');

  await browser.close();
  console.log('HOÀN TẤT TOÀN BỘ 5 ẢNH CHỤP MOBILE THỰC TẾ!');
}

run().catch((err) => {
  console.error('Lỗi khi chụp ảnh:', err);
  process.exit(1);
});
