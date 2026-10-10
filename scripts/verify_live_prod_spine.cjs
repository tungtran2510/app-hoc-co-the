const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const PROD_URL = 'https://app-hoc-co-the.vercel.app';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto(`${PROD_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Cuộn tới mô hình 3D
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate((el) => {
    const parent = el.closest('.rounded-2xl') || el;
    parent.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -10);
  });
  await page.waitForTimeout(3000);

  // Chụp C5 ban đầu
  const shot1 = path.join(ARTIFACTS_DIR, '362_live_prod_spine_c5_clean.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot1:', shot1);

  // Bấm C1-C7 để xem 7 đốt sống cổ sáng xanh ngọc
  const c1c7Btn = page.locator('button:has-text("C1 - C7")').first();
  await c1c7Btn.click();
  await page.waitForTimeout(3500);

  const shot2 = path.join(ARTIFACTS_DIR, '363_live_prod_spine_c1c7_glowing.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot2:', shot2);

  // Cuộn nhẹ xuống xem thẻ bài học C1, C2, C3, C7
  await page.evaluate(() => window.scrollBy(0, 320));
  await page.waitForTimeout(1000);

  const shot3 = path.join(ARTIFACTS_DIR, '364_live_prod_spine_c1c7_cards.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot3:', shot3);

  await browser.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
