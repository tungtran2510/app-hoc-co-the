import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3270';

async function testAll() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Kiểm tra ĐĂNG NHẬP bằng mật khẩu Tung@2510
  console.log('1. Kiểm tra đăng nhập bằng Tung@2510...');
  const loginRes = await page.request.post(`${BASE_URL}/api/admin/login`, {
    data: {
      phone: '0974248716',
      password: 'Tung@2510',
    },
  });
  console.log('   Login status:', loginRes.status());
  const loginData = await loginRes.json();
  console.log('   Login success:', loginData.success, 'user role:', loginData.user?.role);

  // 2. Mở bài học
  console.log('2. Mở bài học tổng quan về cột sống...');
  await page.goto(`${BASE_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Cuộn tới khối 3D Cột sống
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2000);

  // Chụp nút 1: C5 (Cổ)
  console.log('3. Chụp điểm C5 (Cổ)...');
  const shot1 = path.join(ARTIFACTS_DIR, '301_spine_c5_aligned.png');
  await page.screenshot({ path: shot1 });
  console.log(`Saved: ${shot1}`);

  // Chụp nút 2: Đĩa đệm (L4 - L5)
  console.log('4. Bấm chọn "Đĩa đệm"...');
  await page.locator('button:has-text("Đĩa đệm")').click();
  await page.waitForTimeout(3000);
  const shot2 = path.join(ARTIFACTS_DIR, '302_spine_disc_l4l5_aligned.png');
  await page.screenshot({ path: shot2 });
  console.log(`Saved: ${shot2}`);

  // Chụp nút 3: C1 - C7
  console.log('5. Bấm chọn "C1 - C7"...');
  await page.locator('button:has-text("C1 - C7")').click();
  await page.waitForTimeout(2500);
  const shot3 = path.join(ARTIFACTS_DIR, '303_spine_c1c7_aligned.png');
  await page.screenshot({ path: shot3 });
  console.log(`Saved: ${shot3}`);

  // Chụp nút 4: T1 - T12
  console.log('6. Bấm chọn "T1 - T12"...');
  await page.locator('button:has-text("T1 - T12")').click();
  await page.waitForTimeout(2500);
  const shot4 = path.join(ARTIFACTS_DIR, '304_spine_t1t12_aligned.png');
  await page.screenshot({ path: shot4 });
  console.log(`Saved: ${shot4}`);

  // Chụp nút 5: 33 đốt (Toàn bộ cột sống)
  console.log('7. Bấm chọn "33 đốt"...');
  await page.locator('button:has-text("33 đốt")').click();
  await page.waitForTimeout(2500);
  const shot5 = path.join(ARTIFACTS_DIR, '305_spine_full33_aligned.png');
  await page.screenshot({ path: shot5 });
  console.log(`Saved: ${shot5}`);

  // 8. Bấm mở "Atlas đầy đủ" để kiểm tra đã bỏ hàng hệ cơ quan
  console.log('8. Mở Atlas 3D đầy đủ để kiểm tra thanh hệ cơ quan đã biến mất...');
  await page.locator('button:has-text("Atlas đầy đủ")').click();
  await page.waitForTimeout(6000);
  const shot6 = path.join(ARTIFACTS_DIR, '306_atlas_modal_clean_no_systems_bar.png');
  await page.screenshot({ path: shot6 });
  console.log(`Saved: ${shot6}`);

  await browser.close();
}

testAll().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
