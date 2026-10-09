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

  // ẢNH 1: Menu "Chọn cách hiển thị" mở ra cạnh tiêu đề Chuyên Đề Học
  console.log('3. Capturing display options menu...');
  // Cuộn nhẹ để thấy trọn vẹn cụm Chuyên Đề Học
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(400);

  const displayMenuBtn = page.locator('button[aria-label="Chọn cách hiển thị chuyên đề"]').first();
  if (await displayMenuBtn.count() > 0) {
    await displayMenuBtn.click();
    await page.waitForTimeout(500);
  }
  const shot1 = path.join(ARTIFACT_DIR, '211_menu_chon_cach_hien_thi_mobile.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // Đóng menu nếu còn mở
  await page.mouse.click(10, 10);
  await page.waitForTimeout(300);

  // ẢNH 2: Bố cục 1: Lưới bìa 2 cột (card) - Cuộn để thấy rõ các thẻ
  console.log('4. Capturing current Card layout...');
  await page.mouse.wheel(0, 220);
  await page.waitForTimeout(500);
  const shot2 = path.join(ARTIFACT_DIR, '212_layout_luoi_bia_card_mobile.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 2:', shot2);

  // ẢNH 3: Bố cục 2: Chuyển sang Danh mục 3 cột (catalog)
  console.log('5. Switching to Catalog 3 cols...');
  // Cuộn lên lại nút menu
  await page.mouse.wheel(0, -220);
  await page.waitForTimeout(300);
  const catalogBtn = page.locator('button:has-text("Danh mục 3 cột")').first();
  if (await catalogBtn.count() > 0) {
    await catalogBtn.click();
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(500);
  }
  const shot3 = path.join(ARTIFACT_DIR, '213_layout_danh_muc_3_cot_catalog_mobile.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot 3:', shot3);

  // ẢNH 4: Bố cục 3: Chuyển sang Danh sách ảnh (logo)
  console.log('6. Switching to Logo list...');
  await page.mouse.wheel(0, -220);
  await page.waitForTimeout(300);
  const logoBtn = page.locator('button:has-text("Danh sách ảnh")').first();
  if (await logoBtn.count() > 0) {
    await logoBtn.click();
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(500);
  }
  const shot4 = path.join(ARTIFACT_DIR, '214_layout_danh_sach_anh_logo_mobile.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved shot 4:', shot4);

  // Chuyển lại về Lưới bìa (card)
  await page.mouse.wheel(0, -220);
  await page.waitForTimeout(300);
  const cardBtn = page.locator('button:has-text("Lưới bìa")').first();
  if (await cardBtn.count() > 0) {
    await cardBtn.click();
    await page.waitForTimeout(600);
  }

  // ẢNH 5: Cài đặt Quản trị -> Tab "Giao diện"
  console.log('7. Opening Admin Settings Modal Tab Giao Dien...');
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const adminSettingsBtn = page.locator('button[title="Cài đặt quản trị"]').first();
  if (await adminSettingsBtn.count() > 0) {
    await adminSettingsBtn.click();
    await page.waitForTimeout(600);
  }

  const giaoDienTabBtn = page.locator('button:has-text("Giao diện")').first();
  if (await giaoDienTabBtn.count() > 0) {
    await giaoDienTabBtn.click();
    await page.waitForTimeout(600);
  }

  const shot5 = path.join(ARTIFACT_DIR, '215_admin_tab_giao_dien_mobile.png');
  await page.screenshot({ path: shot5 });
  console.log('Saved shot 5:', shot5);

  await browser.close();
  console.log('Done capturing all 5 verified images!');
})();
