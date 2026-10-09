import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3270';

async function testFullCard() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Cuộn chính xác sao cho khối Mô hình 3D Cột sống nằm sát đỉnh màn hình
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate((el) => {
    const parentCard = el.closest('.rounded-2xl') || el;
    parentCard.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -10);
  });
  await page.waitForTimeout(2000);

  // Chụp C5
  const shotC5 = path.join(ARTIFACTS_DIR, '307_spine_c5_framed.png');
  await page.screenshot({ path: shotC5 });
  console.log(`Saved: ${shotC5}`);

  // Bấm chọn Đĩa đệm và cuộn nhẹ để thấy trọn nút bấm và box mô tả
  await page.locator('button:has-text("Đĩa đệm")').click();
  await page.waitForTimeout(3000);
  const shotDisc = path.join(ARTIFACTS_DIR, '308_spine_disc_framed.png');
  await page.screenshot({ path: shotDisc });
  console.log(`Saved: ${shotDisc}`);

  await browser.close();
}

testFullCard().catch((err) => {
  console.error(err);
  process.exit(1);
});
