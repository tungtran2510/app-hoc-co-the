const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Đăng nhập Admin
  console.log('1. Logging in as admin...');
  const loginRes = await page.request.post('http://localhost:3270/api/admin/login', {
    data: { phone: process.env.ADMIN_PHONE || '', password: process.env.ADMIN_PASSWORD || '' }
  });
  const loginData = await loginRes.json();

  // 2. Vào trang chủ
  console.log('2. Navigating to Home...');
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.evaluate((token) => {
    localStorage.setItem('giao_dien', 'light');
    document.documentElement.classList.remove('dark');
    if (token) localStorage.setItem('app_admin_token', token);
  }, loginData.token);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // ẢNH 1: Cài đặt Quản trị -> Tab "Giao diện" có 3 bảng màu trên 1 dòng
  console.log('3. Opening Admin Settings Modal Tab Giao Dien...');
  const adminSettingsBtn = page.locator('button[title="Cài đặt quản trị"]').first();
  if (await adminSettingsBtn.count() > 0) {
    await adminSettingsBtn.click();
    await page.waitForTimeout(500);
  }
  const giaoDienTabBtn = page.locator('button:has-text("Giao diện")').first();
  if (await giaoDienTabBtn.count() > 0) {
    await giaoDienTabBtn.click();
    await page.waitForTimeout(500);
  }
  const shot1 = path.join(ARTIFACT_DIR, '219_admin_tab_giao_dien_3_palettes.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // Đóng modal cài đặt
  const closeBtn = page.locator('button:has-text("Đóng")').first();
  if (await closeBtn.count() > 0) {
    await closeBtn.click();
    await page.waitForTimeout(400);
  }

  // ẢNH 2: Trang chủ với nút xổ xuống kiểu hiển thị tinh gọn (đóng)
  console.log('4. Capturing compact dropdown pill (closed)...');
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(500);
  const shot2 = path.join(ARTIFACT_DIR, '220_home_compact_dropdown_closed.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 2:', shot2);

  // ẢNH 3: Bấm mở nút xổ xuống kiểu hiển thị (chỉ có 4 lựa chọn, không còn Chỉ chữ)
  console.log('5. Clicking dropdown button to open menu...');
  const dropdownBtn = page.locator('button[aria-label="Chọn kiểu hiển thị chuyên đề"]').first();
  if (await dropdownBtn.count() > 0) {
    await dropdownBtn.click();
    await page.waitForTimeout(500);
  }
  const shot3 = path.join(ARTIFACT_DIR, '221_home_compact_dropdown_open.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot 3:', shot3);

  // Đóng menu dropdown
  await page.mouse.click(10, 10);
  await page.waitForTimeout(300);

  // ẢNH 4: Chuyển sang bảng màu "Tối Giản" (Minimal clean) và chụp ảnh
  console.log('6. Switching to Minimal theme...');
  await page.evaluate(() => {
    localStorage.setItem('qbiz_theme_palette', 'minimal');
    document.documentElement.classList.remove('theme-navy-luxury');
    document.documentElement.classList.add('theme-minimal');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(500);
  const shot4 = path.join(ARTIFACT_DIR, '222_home_minimal_theme.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved shot 4:', shot4);

  // Khôi phục lại theme mặc định (indigo)
  await page.evaluate(() => {
    localStorage.setItem('qbiz_theme_palette', 'indigo');
    document.documentElement.classList.remove('theme-navy-luxury', 'theme-minimal');
  });

  await browser.close();
  console.log('All 4 optimization screenshots captured successfully!');
})();
