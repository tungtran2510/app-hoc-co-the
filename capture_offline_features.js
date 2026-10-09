const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const baseUrl = 'http://localhost:3080';

async function run() {
  console.log('--- BẮT ĐẦU KIỂM THỬ PLAYWRIGHT TÍNH NĂNG TỰ ĐỘNG TẢI OFFLINE & THANH MẠNG ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Đăng nhập Quản trị viên
  console.log('1. Đăng nhập tài khoản quản trị...');
  await page.goto(baseUrl + '/dang-nhap', { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', process.env.ADMIN_PHONE || '');
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || '');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForTimeout(1500);

  // 2. Mở bài học để vào Cài đặt Quản trị
  console.log('2. Mở bài học và Modal Cài đặt Quản trị...');
  await page.goto(baseUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Mở menu tùy chọn
  await page.locator('button[aria-label="Tùy chọn"]').click({ force: true });
  await page.waitForTimeout(600);

  // Bấm "Cài đặt quản trị"
  await page.locator('button:has-text("Cài đặt quản trị")').click({ force: true });
  await page.waitForTimeout(1000);

  // Bấm tab "Giao diện"
  await page.locator('button:has-text("Giao diện")').click({ force: true });
  await page.waitForTimeout(800);

  // Cuộn xuống mục Cài đặt Offline
  const offlineSection = page.locator('text=DỮ LIỆU OFFLINE & BỘ NHỚ ĐỆM');
  if (await offlineSection.count() > 0) {
    await offlineSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }

  const p1 = path.join(artifactDir, '01_modal_cai_dat_tuy_chon_offline_30mb.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_modal_cai_dat_tuy_chon_offline_30mb.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 01_modal_cai_dat_tuy_chon_offline_30mb.png');

  // Đóng modal
  const closeBtn = page.locator('button:has-text("✕"), button[aria-label="Đóng"], button:has-text("Đóng")');
  if (await closeBtn.count() > 0) {
    await closeBtn.first().click({ force: true });
    await page.waitForTimeout(600);
  } else {
    await page.keyboard.press('Escape');
    await page.waitForTimeout(600);
  }

  // 3. Giả lập MẤT MẠNG (Offline simulation)
  console.log('3. Giả lập mất mạng Internet để kiểm tra thanh trạng thái...');
  await context.setOffline(true);
  // Dispatch offline event directly in page context to trigger browser event listener immediately
  await page.evaluate(() => {
    window.dispatchEvent(new Event('offline'));
  });
  await page.waitForTimeout(1200);

  const p2 = path.join(artifactDir, '02_thanh_trang_thai_offline_khi_mat_mang.png');
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, '02_thanh_trang_thai_offline_khi_mat_mang.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 02_thanh_trang_thai_offline_khi_mat_mang.png');

  // 4. Giả lập CÓ MẠNG LẠI (Online reconnection)
  console.log('4. Giả lập có mạng trở lại...');
  await context.setOffline(false);
  await page.evaluate(() => {
    window.dispatchEvent(new Event('online'));
  });
  await page.waitForTimeout(800);

  const p3 = path.join(artifactDir, '03_thanh_trang_thai_online_khoi_phuc.png');
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, '03_thanh_trang_thai_online_khoi_phuc.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 03_thanh_trang_thai_online_khoi_phuc.png');

  await browser.close();
  console.log('--- HOÀN TẤT KIỂM THỬ PLAYWRIGHT 100% THÀNH CÔNG ---');
}

run().catch((err) => {
  console.error('Lỗi chạy kịch bản Playwright:', err);
  process.exit(1);
});
