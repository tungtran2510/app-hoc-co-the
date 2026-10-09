import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 500 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3270/test-model-viewer.html ...');
  await page.goto('http://localhost:3270/test-model-viewer.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  const shot = path.join(ARTIFACTS_DIR, '274_model_viewer_spine_test.png');
  await page.screenshot({ path: shot, fullPage: false });
  console.log(`Saved: ${shot}`);

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
