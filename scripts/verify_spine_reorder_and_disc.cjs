const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3080';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('1. Navigating to /cot-song/tong-quan-ve-cot-song...');
  await page.goto(`${BASE_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Cuộn tới mô hình 3D
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(5000); // Chờ 3D load lần đầu

  // ẢNH 1: C1 - C7 mặc định, KHUNG 3D SẠCH 100% KHÔNG CHỮ CHE, HÀNG NÚT C -> T -> L -> Đĩa đệm -> 33-34 đốt
  console.log('Capturing shot 368: C1-C7 clean canvas...');
  const shot1 = path.join(ARTIFACTS_DIR, '368_spine_order_clean_c1c7.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 368:', shot1);

  // ẢNH 2: Bấm L1 - L5 (Đoạn thắt lưng)
  console.log('Clicking L1 - L5...');
  const l1l5Btn = page.locator('button:has-text("L1 - L5")').first();
  await l1l5Btn.click();
  await page.waitForTimeout(2000);

  const shot2 = path.join(ARTIFACTS_DIR, '369_spine_lumbar_l1l5.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 369:', shot2);

  // ẢNH 3: Bấm Đĩa đệm -> Tự động quay trước & đĩa đệm xanh ngọc neon sáng bừng rõ mồn một 100%
  console.log('Clicking Đĩa đệm...');
  const discBtn = page.locator('button:has-text("Đĩa đệm")').first();
  await discBtn.click();
  await page.waitForTimeout(2500);

  const shot3 = path.join(ARTIFACTS_DIR, '370_spine_disc_front_glowing.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot 370:', shot3);

  // Cuộn nhẹ xem chi tiết thẻ đĩa đệm bên dưới
  await page.evaluate(() => window.scrollBy(0, 300));
  await page.waitForTimeout(800);
  const shot4 = path.join(ARTIFACTS_DIR, '371_spine_disc_cards_details.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved shot 371:', shot4);

  // ẢNH 5: Bấm Trục 33-34 đốt
  console.log('Clicking Trục 33-34 đốt...');
  await page.evaluate(() => window.scrollBy(0, -300));
  await page.waitForTimeout(400);
  const fullBtn = page.locator('button:has-text("Trục 33-34 đốt")').first();
  await fullBtn.click();
  await page.waitForTimeout(2000);

  const shot5 = path.join(ARTIFACTS_DIR, '372_spine_full_3334_curve.png');
  await page.screenshot({ path: shot5 });
  console.log('Saved shot 372:', shot5);

  await browser.close();
  console.log('All verification shots captured successfully!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
