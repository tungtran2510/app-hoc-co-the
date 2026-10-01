import { chromium } from 'playwright';

async function verifyLiveProd() {
  console.log('🌍 Verifying Live Vercel Production for LỆNH #05...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  try {
    // 1. Check direct 3D URL
    console.log('Testing https://app-hoc-co-the.vercel.app/3d/index.html ...');
    await page.goto('https://app-hoc-co-the.vercel.app/3d/index.html', { waitUntil: 'networkidle', timeout: 30000 });
    const canvas = await page.waitForSelector('#viewport canvas', { timeout: 15000 });
    console.log('✅ Live 3D Canvas mounted:', await canvas.isVisible());

    // Check AR tool button and Motion tool button exist
    const btnMotion = await page.waitForSelector('#btnToolMotion', { timeout: 5000 });
    const btnAR = await page.waitForSelector('#btnToolAR', { timeout: 5000 });
    console.log('✅ Live Motion and AR buttons present');

    // Click Motion button
    await btnMotion.click();
    await page.waitForSelector('#motionPopover:not(.hidden)', { timeout: 8000 });
    console.log('✅ Live Motion Popover opened');

    // Check physiological preset
    const motionTitle = await page.$eval('#motionPresetSelect', el => el.value);
    console.log('✅ Live Active Motion preset:', motionTitle);

    // Close motion
    await page.click('#motionCloseBtn');

    // Click AR button
    await btnAR.click();
    await page.waitForSelector('#arHud:not(.hidden)', { timeout: 8000 });
    const arStatus = await page.$eval('#arStatusText', el => el.textContent);
    console.log('✅ Live AR HUD active with status:', arStatus);

    await page.click('#btnARExit');
    console.log('✅ Live AR exited cleanly');

    // 2. Check Next.js wrapper page
    console.log('Testing https://app-hoc-co-the.vercel.app/giai-phau-3d ...');
    await page.goto('https://app-hoc-co-the.vercel.app/giai-phau-3d', { waitUntil: 'networkidle', timeout: 30000 });
    const iframe = await page.waitForSelector('iframe[src="/3d/index.html"]', { timeout: 15000 });
    console.log('✅ Live Next.js /giai-phau-3d wrapper OK:', await iframe.isVisible());

    console.log('🎉 ALL LIVE PRODUCTION CHECKS PASSED!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Live check failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

verifyLiveProd();
