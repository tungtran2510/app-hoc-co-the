const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  console.log('Navigating to http://localhost:3080/cot-song/tong-quan-ve-cot-song...');
  await page.goto('http://localhost:3080/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Cuộn tới widget 3D
  const widget = page.locator('text=Mô hình 3D Cột sống').first();
  await widget.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
  await page.waitForTimeout(4000); // Đợi 3D load

  const shot1 = path.join(ARTIFACTS_DIR, '365_test_initial_spine.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot1:', shot1);

  // Click vào nút "Đĩa đệm"
  const discBtn = page.locator('button:has-text("Đĩa đệm")').first();
  console.log('Clicking Đĩa đệm...');
  await discBtn.click();
  await page.waitForTimeout(4000);

  const shot2 = path.join(ARTIFACTS_DIR, '366_test_disc_clicked.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot2:', shot2);

  await browser.close();
})();
