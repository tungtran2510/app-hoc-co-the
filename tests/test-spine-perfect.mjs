import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('--- 1. Testing LIGHT MODE ---');
  await page.goto('http://localhost:3270/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Scroll so top of 3D frame is aligned
  const widgetHeader = page.locator('text=Mô hình 3D Cột sống').first();
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  const shotLightC5 = path.join(ARTIFACTS_DIR, '291_spine_light_3x5_c5.png');
  await page.screenshot({ path: shotLightC5, fullPage: false });
  console.log(`Saved: ${shotLightC5}`);

  // Scroll down 380px to center the buttons and clinical card
  await page.evaluate(() => window.scrollBy(0, 380));
  await page.waitForTimeout(1000);

  const shotLightCard = path.join(ARTIFACTS_DIR, '292_spine_light_full_card.png');
  await page.screenshot({ path: shotLightCard, fullPage: false });
  console.log(`Saved: ${shotLightCard}`);

  console.log('--- 2. Testing DARK MODE ---');
  // Scroll back to header
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Toggle to dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(3000); // Allow iframe to reload with theme=dark

  const shotDarkC5 = path.join(ARTIFACTS_DIR, '293_spine_dark_3x5_c5.png');
  await page.screenshot({ path: shotDarkC5, fullPage: false });
  console.log(`Saved: ${shotDarkC5}`);

  // Scroll down 380px to center the dark buttons and card
  await page.evaluate(() => window.scrollBy(0, 380));
  await page.waitForTimeout(1000);

  const shotDarkCard = path.join(ARTIFACTS_DIR, '294_spine_dark_full_card.png');
  await page.screenshot({ path: shotDarkCard, fullPage: false });
  console.log(`Saved: ${shotDarkCard}`);

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
