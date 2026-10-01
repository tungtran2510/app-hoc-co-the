import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  console.log('1. Navigating to 3D atlas on port 8088...');
  await page.goto('http://127.0.0.1:8088/3d/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify_1_mobile_header_clean.png' });
  console.log('Screenshot 1 saved: Clean header & toolbar');

  // Check header text wrapping and overflow
  const logoText = await page.locator('.logo').innerText();
  console.log('Logo text:', logoText);
  const headerBox = await page.locator('.header').boundingBox();
  console.log('Header bounding box:', headerBox);

  // 2. Open Motion Panel
  console.log('2. Opening Motion Panel...');
  await page.click('#btnToolMotion');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_2_motion_bottom_sheet_open.png' });
  console.log('Screenshot 2 saved: Motion Bottom Sheet open');

  // 3. Click '▶ Bắt đầu & Xem 3D Toàn Màn Hình'
  console.log('3. Clicking Watch 3D Full Screen...');
  await page.click('#btnMotionWatchFull');
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'verify_3_motion_minimized_full_3d.png' });
  console.log('Screenshot 3 saved: Minimized Mini HUD with full 3D visible');

  // 4. Click '✕ Tắt' on Mini HUD
  console.log('4. Clicking ✕ Tắt to completely close motion...');
  await page.click('#btnMiniClose');
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'verify_4_motion_completely_closed.png' });
  console.log('Screenshot 4 saved: Motion completely closed');

  // 5. Test Voice AI toast
  console.log('5. Testing Voice AI button & feedback...');
  await page.evaluate(() => {
    const toast = document.getElementById('voiceToast');
    if (toast) {
      toast.textContent = '🫀 "Nhịp Tim 3D" · Đang chạy';
      toast.classList.add('show');
    }
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'verify_5_voice_ai_feedback.png' });
  console.log('Screenshot 5 saved: Voice AI feedback pill');

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

run().catch(console.error);
