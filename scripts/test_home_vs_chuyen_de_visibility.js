const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

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

  console.log('1. Navigating to Home (http://localhost:3270/)...');
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to topic section
  const topicHeader = page.locator('text=Chuyên Đề Học').first();
  if (await topicHeader.isVisible()) {
    await topicHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }

  const shot1 = path.join(artifactDir, '171_mobile_home_only_featured_topics.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  console.log('2. Navigating to Chuyen De (http://localhost:3270/chuyen-de)...');
  await page.goto('http://localhost:3270/chuyen-de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const shot2 = path.join(artifactDir, '172_mobile_chuyen_de_all_topics.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 2:', shot2);

  console.log('3. Navigating to Topic Gan Mat Tuy (http://localhost:3270/gan-mat-tuy)...');
  await page.goto('http://localhost:3270/gan-mat-tuy', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);

  const shot3 = path.join(artifactDir, '173_mobile_gan_mat_tuy_lessons.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot 3:', shot3);

  await browser.close();
  console.log('Done capturing screenshots!');
})();
