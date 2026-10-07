const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  console.log('Bắt đầu kiểm thử & chụp ảnh Mobile thật (390x844)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  const baseUrl = 'https://app-hoc-co-29proejsz-tungtran2510-3020s-projects.vercel.app';
  console.log('Sử dụng baseUrl:', baseUrl);
  await page.goto(baseUrl + '/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="tel"]', '0974248716');
  await page.fill('input[type="password"]', 'Tung@2510');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForTimeout(2000);

  // 1. Chụp trang chuyên đề - khối Cẩm nang y khoa & Mã QR tinh gọn 1 dòng ở dưới cùng lộ trình
  console.log('2. Chụp trang chuyên đề Cột sống & khối Cẩm nang 1 dòng...');
  await page.goto(baseUrl + '/cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);

  // Cuộn thẳng đến nút Cẩm nang y khoa ở cuối cùng lộ trình
  const handbookBtn = page.locator('button:has-text("Cẩm nang y khoa")');
  await handbookBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  const p1 = path.join(artifactDir, '01_chuyen_de_cam_nang_tinh_gon_cuoi_trang.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_chuyen_de_cam_nang_tinh_gon_cuoi_trang.png');
  console.log('Đã chụp: 01_chuyen_de_cam_nang_tinh_gon_cuoi_trang.png');

  // Mở bài học để mở menu Tùy chọn -> Cài đặt quản trị
  console.log('3. Mở bài học và mở Modal Cài đặt...');
  await page.goto(baseUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Bấm menu "Tùy chọn"
  await page.locator('button[aria-label="Tùy chọn"]').click({ force: true });
  await page.waitForTimeout(600);

  // Bấm "Cài đặt quản trị"
  await page.locator('button:has-text("Cài đặt quản trị")').click({ force: true });
  await page.waitForTimeout(1000);

  // 2. Chụp Tab Giao diện
  console.log('4. Chụp Tab Giao diện...');
  await page.locator('button:has-text("Giao diện")').click({ force: true });
  await page.waitForTimeout(800);

  const p2 = path.join(artifactDir, '02_modal_cai_dat_tab_giao_dien.png');
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, '02_modal_cai_dat_tab_giao_dien.png');
  console.log('Đã chụp: 02_modal_cai_dat_tab_giao_dien.png');

  // 3. Chụp Tab Chung
  console.log('5. Chụp Tab Chung...');
  await page.locator('button:has-text("Chung")').click({ force: true });
  await page.waitForTimeout(800);

  const p3 = path.join(artifactDir, '03_modal_cai_dat_tab_chung.png');
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, '03_modal_cai_dat_tab_chung.png');
  console.log('Đã chụp: 03_modal_cai_dat_tab_chung.png');

  // 4. Chụp Tab Bảo mật
  console.log('6. Chụp Tab Bảo mật...');
  await page.locator('button:has-text("Bảo mật")').click({ force: true });
  await page.waitForTimeout(800);

  const p4 = path.join(artifactDir, '04_modal_cai_dat_tab_bao_mat.png');
  await page.screenshot({ path: p4 });
  fs.copyFileSync(p4, '04_modal_cai_dat_tab_bao_mat.png');
  console.log('Đã chụp: 04_modal_cai_dat_tab_bao_mat.png');

  await browser.close();
  console.log('HOÀN TẤT CHỤP 4 ẢNH MOBILE THỰC TẾ!');
}

run().catch((err) => {
  console.error('Lỗi khi chạy Playwright:', err);
  process.exit(1);
});
