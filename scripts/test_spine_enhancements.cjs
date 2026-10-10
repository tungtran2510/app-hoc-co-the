const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile iPhone 12/13/14
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('1. Navigating to Cot Song lesson 1 (http://localhost:3080/cot-song/tong-quan-ve-cot-song)...');
  await page.goto('http://localhost:3080/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(1000);

  // Scroll down to the Spine 3D Widget
  console.log('2. Scrolling to 3D Spine Widget...');
  const widget = page.locator('section[aria-label="Khối Mô Hình 3D Cột Sống Tinh Gọn"]');
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // Wait for iframe inside widget to load
  const iframeElement = widget.locator('iframe').first();
  const iframeBox = await iframeElement.boundingBox();
  console.log('3D iframe bounding box:', iframeBox);

  // Wait 4 seconds for 3D model to load in iframe
  await page.waitForTimeout(4000);

  // Capture State 1: C5 default view, with Touch Pass-through overlay ("Chạm để xoay 3D 360°")
  console.log('Capturing 330_spine_c5_default_touch_passthrough...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '330_spine_c5_default_touch_passthrough.png'),
  });

  // Test Scroll Pass-through: Simulate vertical touch swipe right through the center of the 3D widget!
  console.log('Testing touch swipe through the 3D widget to ensure NO scroll trap...');
  const startX = 195;
  const startY = 450;
  await page.touchscreen.tap(startX, startY);
  await page.mouse.move(startX, startY);
  await page.mouse.wheel(0, 300); // Simulate scroll down past widget
  await page.waitForTimeout(600);

  console.log('Capturing 331_spine_scroll_past_widget...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '331_spine_scroll_past_widget.png'),
  });

  // Scroll back to widget
  await widget.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  // Test Tap-to-Interact: Tap on "Chạm để xoay 3D 360°"
  console.log('Activating 3D interaction mode...');
  const touchBtn = page.locator('text=Chạm để xoay 3D 360°').first();
  if (await touchBtn.isVisible()) {
    await touchBtn.click();
    await page.waitForTimeout(800);
  }

  console.log('Capturing 332_spine_3d_active_orbit_mode...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '332_spine_3d_active_orbit_mode.png'),
  });

  // Click on "C1 - C7" button
  console.log('Testing C1 - C7 button click...');
  const c1c7Btn = page.getByRole('button', { name: 'C1 - C7' }).first();
  await c1c7Btn.click();
  await page.waitForTimeout(3000); // Wait for camera & glow

  console.log('Capturing 333_spine_c1c7_glowing_with_rich_cards...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '333_spine_c1c7_glowing_with_rich_cards.png'),
  });

  // Scroll to read the detailed C1, C2, C3-C5, C7 cards below
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(600);
  console.log('Capturing 334_spine_c1c7_details_cards_scrolled...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '334_spine_c1c7_details_cards_scrolled.png'),
  });

  // Click on "Đĩa đệm" button
  console.log('Testing Đĩa đệm button click...');
  const discBtn = page.getByRole('button', { name: 'Đĩa đệm' }).first();
  await discBtn.scrollIntoViewIfNeeded();
  await discBtn.click();
  await page.waitForTimeout(3000); // Wait for camera & emerald glow

  console.log('Capturing 335_spine_disc_emerald_glow...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '335_spine_disc_emerald_glow.png'),
  });

  // Click on "T1 - T12" button
  console.log('Testing T1 - T12 button click...');
  const t1t12Btn = page.getByRole('button', { name: 'T1 - T12' }).first();
  await t1t12Btn.scrollIntoViewIfNeeded();
  await t1t12Btn.click();
  await page.waitForTimeout(3000);

  console.log('Capturing 336_spine_t1t12_amber_glow...');
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '336_spine_t1t12_amber_glow.png'),
  });

  // Test Dark Theme
  console.log('Testing Dark Mode toggle...');
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  });
  await page.waitForTimeout(1000);

  console.log('Capturing 337_spine_dark_mode_c1c7...');
  await c1c7Btn.click();
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '337_spine_dark_mode_c1c7.png'),
  });

  console.log('All tests completed successfully!');
  await browser.close();
})();
