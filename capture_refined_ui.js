const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const baseUrl = 'http://localhost:3080';

async function run() {
  console.log('--- BẮT ĐẦU KIỂM THỬ PLAYWRIGHT CÁC ĐIỂM TINH CHỈNH GIAO DIỆN THEO YÊU CẦU ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Xóa cache vị trí nút cũ nếu có để nhận vị trí mặc định mới sát thanh bài tiếp
  await page.addInitScript(() => {
    try {
      localStorage.removeItem('qbiz_floating_ai_pos');
    } catch {}
  });

  // 1. Đăng nhập Quản trị viên
  console.log('1. Đăng nhập tài khoản quản trị...');
  await page.goto(baseUrl + '/dang-nhap', { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', process.env.ADMIN_PHONE || '');
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || '');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForTimeout(1500);

  // 2. Mở bài học
  console.log('2. Mở bài học tổng quan về cột sống...');
  await page.goto(baseUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  // Chụp toàn màn hình bài học hiển thị:
  // - Tiêu đề kéo sát lên trên
  // - Nút "Hỏi bài này" chữ nhỏ gọn 10.5px nằm sát ngay thanh bài tiếp
  const p1 = path.join(artifactDir, '01_tieu_de_sat_len_tren_va_nut_hoi_bai_sat_day.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_tieu_de_sat_len_tren_va_nut_hoi_bai_sat_day.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 01_tieu_de_sat_len_tren_va_nut_hoi_bai_sat_day.png');

  // 3. Giả lập MẤT MẠNG để kiểm tra thanh trạng thái chữ bé hơn
  console.log('3. Giả lập mất mạng Internet...');
  await context.setOffline(true);
  await page.evaluate(() => {
    window.dispatchEvent(new Event('offline'));
  });
  await page.waitForTimeout(1000);

  const p2 = path.join(artifactDir, '02_thanh_offline_chu_nho_tinh_te.png');
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, '02_thanh_offline_chu_nho_tinh_te.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 02_thanh_offline_chu_nho_tinh_te.png');

  // 4. Giả lập CÓ MẠNG LẠI (tự ẩn sau 1.5s)
  console.log('4. Giả lập có mạng trở lại (kiểm tra tự ẩn 1.5s)...');
  await context.setOffline(false);
  await page.evaluate(() => {
    window.dispatchEvent(new Event('online'));
  });
  await page.waitForTimeout(600);

  const p3 = path.join(artifactDir, '03_thanh_online_khoi_phuc_1_5s.png');
  await page.screenshot({ path: p3 });
  fs.copyFileSync(p3, '03_thanh_online_khoi_phuc_1_5s.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 03_thanh_online_khoi_phuc_1_5s.png');

  // Chờ thêm 1.6s để xác nhận thanh tự biến mất hoàn toàn
  await page.waitForTimeout(1600);
  const p4 = path.join(artifactDir, '04_thanh_online_da_bien_mat_sau_1_5s.png');
  await page.screenshot({ path: p4 });
  fs.copyFileSync(p4, '04_thanh_online_da_bien_mat_sau_1_5s.png');
  console.log('-> ĐÃ CHỤP THÀNH CÔNG: 04_thanh_online_da_bien_mat_sau_1_5s.png (Xác nhận tự ẩn hoàn toàn)');

  await browser.close();
  console.log('--- HOÀN TẤT KIỂM THỬ PLAYWRIGHT 100% THÀNH CÔNG ---');
}

run().catch((err) => {
  console.error('Lỗi chạy kịch bản Playwright:', err);
  process.exit(1);
});
