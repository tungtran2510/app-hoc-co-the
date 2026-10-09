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

  console.log('1. Navigating to lesson: http://localhost:3270/cot-song/tong-quan-ve-cot-song (LIGHT MODE) ...');
  await page.goto('http://localhost:3270/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Scroll to 3D Spine widget
  const widgetHeader = page.locator('text=Mô hình 3D Cột sống').first();
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);

  // Capture Light Mode shot showing 3x5 frame & C5 pointer
  const shotLightC5 = path.join(ARTIFACTS_DIR, '287_spine_3x5_light_c5.png');
  await page.screenshot({ path: shotLightC5, fullPage: false });
  console.log(`Saved Light C5 shot: ${shotLightC5}`);

  // Scroll down slightly to view the light theme clinical card completely
  await page.evaluate(() => window.scrollBy(0, 240));
  await page.waitForTimeout(800);
  const shotLightCard = path.join(ARTIFACTS_DIR, '288_spine_light_clinical_card.png');
  await page.screenshot({ path: shotLightCard, fullPage: false });
  console.log(`Saved Light Clinical Card shot: ${shotLightCard}`);

  // 2. Test L4 - L5 in Light Mode
  await widgetHeader.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const l4l5Btn = page.locator('button:has-text("L4 - L5")').first();
  if (await l4l5Btn.isVisible()) {
    await l4l5Btn.click();
    await page.waitForTimeout(2500);
    const shotLightL4L5 = path.join(ARTIFACTS_DIR, '289_spine_3x5_light_l4l5.png');
    await page.screenshot({ path: shotLightL4L5, fullPage: false });
    console.log(`Saved Light L4-L5 shot: ${shotLightL4L5}`);
  }

  // 3. Test DARK MODE
  console.log('2. Switching to DARK MODE ...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    try { localStorage.setItem('theme', 'dark'); } catch(e){}
  });
  await page.waitForTimeout(1500);

  const shotDarkC5 = path.join(ARTIFACTS_DIR, '290_spine_3x5_dark_mode.png');
  await page.screenshot({ path: shotDarkC5, fullPage: false });
  console.log(`Saved Dark mode shot: ${shotDarkC5}`);

  await context.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
