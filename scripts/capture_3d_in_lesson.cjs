const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('Navigating to lesson...');
  await page.goto('http://localhost:3080/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  const widget = page.locator('section[aria-label="Khối Mô Hình 3D Cột Sống Tinh Gọn"]');
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000); // Wait for 3D load

  // Helper to capture focused view of 3D frame and title
  async function captureSpineView(btnName, filename) {
    console.log(`Selecting ${btnName}...`);
    const btn = page.getByRole('button', { name: btnName }).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForTimeout(2500);

    // Scroll so 3D frame top is near top of viewport
    const widgetBox = await widget.boundingBox();
    if (widgetBox) {
      await page.mouse.wheel(0, widgetBox.y - 60);
      await page.waitForTimeout(500);
    }

    await page.screenshot({ path: path.join(ARTIFACT_DIR, filename) });
    console.log(`Saved ${filename}`);
  }

  await captureSpineView('C5 (Cổ)', '338_lesson_spine_c5_glowing.png');
  await captureSpineView('C1 - C7', '339_lesson_spine_c1c7_glowing.png');
  await captureSpineView('Đĩa đệm', '340_lesson_spine_disc_glowing.png');
  await captureSpineView('T1 - T12', '341_lesson_spine_thoracic_glowing.png');

  // Test Dark Mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  });
  await page.waitForTimeout(1000);
  await captureSpineView('C1 - C7', '342_lesson_spine_dark_c1c7_glowing.png');

  await browser.close();
})();
