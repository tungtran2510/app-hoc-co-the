const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const artifactDir = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  console.log('1. Testing Live Production Home (https://app-hoc-co-the.vercel.app/)...');
  const t0 = Date.now();
  await page.goto('https://app-hoc-co-the.vercel.app/', { waitUntil: 'networkidle' });
  console.log(`Live Home loaded in: ${Date.now() - t0}ms`);
  await page.waitForTimeout(1000);

  // Scroll to topic section
  const topicHeader = page.locator('text=Chuyên Đề Học').first();
  if (await topicHeader.isVisible()) {
    await topicHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }
  const shot1 = path.join(artifactDir, '180_live_production_home.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 180:', shot1);

  console.log('2. Testing Live Production Chuyen De (https://app-hoc-co-the.vercel.app/chuyen-de)...');
  const t1 = Date.now();
  await page.goto('https://app-hoc-co-the.vercel.app/chuyen-de', { waitUntil: 'networkidle' });
  console.log(`Live Chuyen De loaded in: ${Date.now() - t1}ms`);
  await page.waitForTimeout(1000);

  const shot2 = path.join(artifactDir, '181_live_production_chuyen_de.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 181:', shot2);

  console.log('3. Testing Live Production Gan Mat Tuy (https://app-hoc-co-the.vercel.app/gan-mat-tuy)...');
  const t2 = Date.now();
  await page.goto('https://app-hoc-co-the.vercel.app/gan-mat-tuy', { waitUntil: 'networkidle' });
  console.log(`Live Gan Mat Tuy loaded in: ${Date.now() - t2}ms`);
  await page.waitForTimeout(1000);

  const shot3 = path.join(artifactDir, '182_live_production_gan_mat_tuy.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot 182:', shot3);

  console.log('4. Testing click from Gan Mat Tuy to lesson 01 on live production...');
  const lesson1 = page.locator('text=Gan – Nhà máy sinh hóa 500 chức năng').first();
  if (await lesson1.isVisible()) {
    const t3 = Date.now();
    await lesson1.click({ force: true });
    await page.waitForLoadState('networkidle');
    console.log(`Live Lesson 01 opened in: ${Date.now() - t3}ms, URL: ${page.url()}`);
    await page.waitForTimeout(1000);
    const shot4 = path.join(artifactDir, '183_live_production_lesson.png');
    await page.screenshot({ path: shot4 });
    console.log('Saved shot 183:', shot4);
  }

  await browser.close();
  console.log('Done live production verification!');
})();
