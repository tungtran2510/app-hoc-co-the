import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 480 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  const url = 'http://localhost:3270/3d/index.html?widget=1#sys=skeletal&cam=0,1.15,-0.75,0,1.15,-0.04';
  console.log(`Navigating to ${url} ...`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3500);

  const shot = path.join(ARTIFACTS_DIR, '277_spine_posterior_view.png');
  await page.screenshot({ path: shot, fullPage: false });
  console.log(`Saved: ${shot}`);

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
