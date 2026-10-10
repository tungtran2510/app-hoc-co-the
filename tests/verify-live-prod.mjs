import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const PROD_URL = 'https://app-hoc-co-the.vercel.app';

async function verifyLive() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();
  console.log('1. Mở trang thật production:', `${PROD_URL}/cot-song/tong-quan-ve-cot-song`);
  await page.goto(`${PROD_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate((el) => {
    const parentCard = el.closest('.rounded-2xl') || el;
    parentCard.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -10);
  });
  await page.waitForTimeout(3000);

  // 1. Chụp C5 sạch trên bản thật
  const shot1 = path.join(ARTIFACTS_DIR, '320_live_prod_c5_clean.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved:', shot1);

  // 2. Chạm vào tâm ngắm để hiện thẻ tên
  const targetDot = page.locator('button[title="Chạm vào để hiện / ẩn tên giải phẫu"]').first();
  if (await targetDot.count() > 0) {
    await targetDot.click();
    await page.waitForTimeout(600);
    const shot2 = path.join(ARTIFACTS_DIR, '321_live_prod_c5_clicked.png');
    await page.screenshot({ path: shot2 });
    console.log('Saved:', shot2);
  }

  // 3. Bấm C1 - C7 kiểm tra góc nhìn sau lưng chuẩn trên bản thật
  await page.locator('button:has-text("C1 - C7")').click();
  await page.waitForTimeout(3500);
  const shot3 = path.join(ARTIFACTS_DIR, '322_live_prod_c1c7_posterior.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved:', shot3);

  await browser.close();
}

verifyLive().catch((e) => {
  console.error(e);
  process.exit(1);
});
