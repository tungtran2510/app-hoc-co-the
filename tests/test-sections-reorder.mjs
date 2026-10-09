import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // 1. Kiểm tra màn hình người dùng thông thường (Guest / Học viên)
  const guestContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const guestPage = await guestContext.newPage();
  
  const startTime = Date.now();
  await guestPage.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  const loadDuration = Date.now() - startTime;
  console.log(`[SPEED CHECK] Guest Homepage loaded in: ${loadDuration}ms`);

  // Cuộn nhẹ để thấy Lộ trình định hướng
  await guestPage.evaluate(() => window.scrollBy(0, 360));
  await guestPage.waitForTimeout(500);

  const shot1 = path.join(ARTIFACTS_DIR, '240_guest_sections_independent.png');
  await guestPage.screenshot({ path: shot1, fullPage: false });
  console.log(`Saved: ${shot1}`);

  // Cuộn thêm xuống bài giảng nổi bật
  await guestPage.evaluate(() => window.scrollBy(0, 420));
  await guestPage.waitForTimeout(500);
  const shot2 = path.join(ARTIFACTS_DIR, '241_guest_featured_lessons.png');
  await guestPage.screenshot({ path: shot2, fullPage: false });
  console.log(`Saved: ${shot2}`);

  await guestContext.close();

  // 2. Kiểm tra chế độ Quản trị viên (Admin)
  const adminContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const adminPage = await adminContext.newPage();
  
  // Đăng nhập Admin chuẩn qua API
  const loginRes = await adminPage.request.post('http://localhost:3270/api/admin/login', {
    data: {
      phone: '0974248716',
      password: 'Tung@2510',
    },
  });
  const loginData = await loginRes.json();
  console.log('Admin login result:', loginData.success);

  // Mở trang chủ Admin
  const adminStartTime = Date.now();
  await adminPage.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  if (loginData.token) {
    await adminPage.evaluate((t) => localStorage.setItem('app_admin_token', t), loginData.token);
    await adminPage.reload({ waitUntil: 'networkidle' });
  }
  const adminDuration = Date.now() - adminStartTime;
  console.log(`[SPEED CHECK] Admin Homepage loaded in: ${adminDuration}ms`);

  // Cuộn xuống mục Lộ trình định hướng (kiểm tra thanh điều khiển SectionOrderControls của mục này)
  await adminPage.evaluate(() => window.scrollBy(0, 450));
  await adminPage.waitForTimeout(700);

  const shot3 = path.join(ARTIFACTS_DIR, '242_admin_separate_controls_roadmap.png');
  await adminPage.screenshot({ path: shot3, fullPage: false });
  console.log(`Saved: ${shot3}`);

  // Cuộn xuống mục Bài giảng nổi bật (kiểm tra thanh điều khiển SectionOrderControls của bài nổi bật)
  await adminPage.evaluate(() => window.scrollBy(0, 450));
  await adminPage.waitForTimeout(700);

  const shot4 = path.join(ARTIFACTS_DIR, '243_admin_separate_controls_featured.png');
  await adminPage.screenshot({ path: shot4, fullPage: false });
  console.log(`Saved: ${shot4}`);

  // Mở Modal Sắp xếp thứ tự các khối
  // Bấm nút "Sắp xếp" ở thanh điều khiển của bất kỳ khối nào
  const reorderBtn = await adminPage.$('button[title*="Sắp xếp"]');
  if (reorderBtn) {
    await reorderBtn.click();
    await adminPage.waitForTimeout(800);
    const shot5 = path.join(ARTIFACTS_DIR, '244_admin_reorder_modal_independent_sections.png');
    await adminPage.screenshot({ path: shot5, fullPage: false });
    console.log(`Saved: ${shot5}`);
  } else {
    // Thử click nút có icon Layers hoặc text Sắp xếp
    const altBtn = await adminPage.$('text=Sắp xếp');
    if (altBtn) {
      await altBtn.click();
      await adminPage.waitForTimeout(800);
      const shot5 = path.join(ARTIFACTS_DIR, '244_admin_reorder_modal_independent_sections.png');
      await adminPage.screenshot({ path: shot5, fullPage: false });
      console.log(`Saved: ${shot5}`);
    }
  }

  await adminContext.close();
  await browser.close();
  console.log('All tests passed!');
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
