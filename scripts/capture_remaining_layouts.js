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

  // Vào trang chủ với tư cách người dùng bình thường (không admin) để thấy giao diện học viên sạch đẹp
  console.log('1. Navigating as normal user (clean student view)...');
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'light');
    document.documentElement.classList.remove('dark');
    localStorage.removeItem('app_admin_token');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Cuộn nhẹ xuống cụm Chuyên Đề Học
  await page.mouse.wheel(0, 260);
  await page.waitForTimeout(500);

  // ẢNH 6: Bố cục Lưới bìa 2 cột (Giao diện học viên chuẩn)
  const shot6 = path.join(ARTIFACT_DIR, '216_hoc_vien_luoi_bia_card_mobile.png');
  await page.screenshot({ path: shot6 });
  console.log('Saved shot 6:', shot6);

  // ẢNH 7: Bố cục Khung to (large)
  console.log('2. Switching to Large card layout...');
  const displayMenuBtn = page.locator('button[aria-label="Chọn cách hiển thị chuyên đề"]').first();
  if (await displayMenuBtn.count() > 0) {
    await displayMenuBtn.click();
    await page.waitForTimeout(400);
    const largeBtn = page.locator('button:has-text("Khung to")').first();
    if (await largeBtn.count() > 0) {
      await largeBtn.click();
      await page.waitForTimeout(600);
    }
  }
  const shot7 = path.join(ARTIFACT_DIR, '217_layout_khung_to_large_mobile.png');
  await page.screenshot({ path: shot7 });
  console.log('Saved shot 7:', shot7);

  // ẢNH 8: Bố cục Chỉ chữ (text)
  console.log('3. Switching to Text only layout...');
  if (await displayMenuBtn.count() > 0) {
    await displayMenuBtn.click();
    await page.waitForTimeout(400);
    const textBtn = page.locator('button:has-text("Chỉ chữ")').first();
    if (await textBtn.count() > 0) {
      await textBtn.click();
      await page.waitForTimeout(600);
    }
  }
  const shot8 = path.join(ARTIFACT_DIR, '218_layout_chi_chu_text_mobile.png');
  await page.screenshot({ path: shot8 });
  console.log('Saved shot 8:', shot8);

  // Trả về mặc định Lưới bìa
  if (await displayMenuBtn.count() > 0) {
    await displayMenuBtn.click();
    await page.waitForTimeout(400);
    const cardBtn = page.locator('button:has-text("Lưới bìa")').first();
    if (await cardBtn.count() > 0) {
      await cardBtn.click();
      await page.waitForTimeout(600);
    }
  }

  await browser.close();
  console.log('Done capturing remaining layouts!');
})();
