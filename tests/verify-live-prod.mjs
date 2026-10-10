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

  // Chụp C5 trên bản thật
  const shot1 = path.join(ARTIFACTS_DIR, '309_live_prod_c5.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved:', shot1);

  // Bấm Đĩa đệm trên bản thật
  await page.locator('button:has-text("Đĩa đệm")').click();
  await page.waitForTimeout(4000);
  const shot2 = path.join(ARTIFACTS_DIR, '310_live_prod_disc.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved:', shot2);

  await browser.close();
}

verifyLive().catch((e) => {
  console.error(e);
  process.exit(1);
});
