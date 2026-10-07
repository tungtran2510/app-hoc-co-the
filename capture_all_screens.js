const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  const baseUrl = 'https://app-hoc-co-the.vercel.app';

  // 1. Chuyên đề Cột sống (có nút Cẩm Nang & Atlas 3D)
  console.log('1. Chụp trang chuyên đề Cột Sống...');
  await page.goto(baseUrl + '/cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const p1 = path.join(artifactDir, '01_chuyen_de_cot_song.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_chuyen_de_cot_song.png');

  // 2. Mở Modal Cẩm Nang Y Khoa & QR
  console.log('2. Chụp Modal Cẩm Nang Y Khoa & QR...');
  const handbookBtn = page.locator('button:has-text("Cẩm Nang Y Khoa")');
  await handbookBtn.click();
  await page.waitForTimeout(1200);
  const p2 = path.join(artifactDir, '02_modal_cam_nang_qr.png');
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, '02_modal_cam_nang_qr.png');

  // Cuộn xuống để xem chi tiết mã QR của các bài học trong cẩm nang
  console.log('2b. Chụp chi tiết mã QR từng bài học trong Cẩm Nang...');
  await page.evaluate(() => {
    const el = document.querySelector('#handbook-printable-area');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(800);
  const p2b = path.join(artifactDir, '02b_chi_tiet_qr_bai_hoc.png');
  await page.screenshot({ path: p2b });
  fs.copyFileSync(p2b, '02b_chi_tiet_qr_bai_hoc.png');

  // Đóng modal
  await page.locator('button:has-text("Đóng")').first().click();
  await page.waitForTimeout(500);

  // 3. Trang bài học (có nút Mô hình 3D)
  console.log('3. Chụp trang bài học...');
  await page.goto(baseUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const p3 = path.join(artifactDir, '03_bai_hoc_nut_3d.png');
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, '03_bai_hoc_nut_3d.png');

  // 4. Mở Modal Mô hình 3D
  console.log('4. Chụp Modal Mô hình 3D...');
  const model3dBtn = page.locator('button:has-text("Mô hình 3D")');
  await model3dBtn.click();
  await page.waitForTimeout(2000);
  const p4 = path.join(artifactDir, '04_modal_mo_hinh_3d.png');
  await page.screenshot({ path: p4 });
  fs.copyFileSync(p4, '04_modal_mo_hinh_3d.png');

  // Đóng modal 3d
  await page.locator('button[aria-label="Đóng mô hình 3D"]').click();
  await page.waitForTimeout(500);

  // 5. Trang riêng /giai-phau-3d
  console.log('5. Chụp trang riêng /giai-phau-3d...');
  await page.goto(baseUrl + '/giai-phau-3d', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  const p5 = path.join(artifactDir, '05_trang_giai_phau_3d.png');
  await page.screenshot({ path: p5 });
  fs.copyFileSync(p5, '05_trang_giai_phau_3d.png');

  await browser.close();
  console.log('DONE ALL SCREENSHOTS!');
}

capture().catch(console.error);
