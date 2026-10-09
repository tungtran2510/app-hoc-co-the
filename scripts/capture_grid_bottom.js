const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });

  // Test on /cot-song/tong-quan-ve-cot-song
  await page.goto('http://localhost:3260/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '139_mobile_cot_song_pill_buttons.png')
  });
  console.log('Saved 139_mobile_cot_song_pill_buttons.png');

  // Test on /nuoc/vai-tro-cua-nuoc
  await page.goto('http://localhost:3260/nuoc/vai-tro-cua-nuoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '140_mobile_nuoc_pill_buttons.png')
  });
  console.log('Saved 140_mobile_nuoc_pill_buttons.png');

  await browser.close();
  console.log('CAPTURED SUCCESSFULLY!');
}
run().catch(err => {
  console.error(err);
  process.exit(1);
});
