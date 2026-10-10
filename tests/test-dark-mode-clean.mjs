import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const BASE_URL = 'http://localhost:3270';

async function testDark() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    colorScheme: 'dark',
  });

  const page = await context.newPage();
  await page.goto(`${BASE_URL}/cot-song/tong-quan-ve-cot-song`, { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(2000);

  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate((el) => {
    const parentCard = el.closest('.rounded-2xl') || el;
    parentCard.scrollIntoView({ behavior: 'instant', block: 'start' });
    window.scrollBy(0, -10);
  });
  await page.waitForTimeout(3000);

  const shotDarkC5 = path.join(ARTIFACTS_DIR, '318_spine_dark_c5_clean.png');
  await page.screenshot({ path: shotDarkC5 });
  console.log('Saved:', shotDarkC5);

  await page.locator('button:has-text("Đĩa đệm")').click();
  await page.waitForTimeout(3000);
  const shotDarkDisc = path.join(ARTIFACTS_DIR, '319_spine_dark_disc_clean.png');
  await page.screenshot({ path: shotDarkDisc });
  console.log('Saved:', shotDarkDisc);

  await browser.close();
}

testDark().catch((e) => {
  console.error(e);
  process.exit(1);
});
