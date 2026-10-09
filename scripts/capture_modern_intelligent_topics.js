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

  console.log('1. Navigating to Home in Light Mode (http://localhost:3270/)...');
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'light');
    document.documentElement.classList.remove('dark');
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to topic section
  const topicHeader = page.locator('text=Chuyên Đề Học').first();
  if (await topicHeader.isVisible()) {
    await topicHeader.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
  }

  const shot1 = path.join(artifactDir, '194_mobile_home_monolithic_topics.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // Scroll slightly down to capture the full grid of 6 topics
  await page.mouse.wheel(0, 220);
  await page.waitForTimeout(600);
  const shot2 = path.join(artifactDir, '195_mobile_home_monolithic_scrolled.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 2:', shot2);

  // 3. Test active state (touch down on topic card without navigating)
  const firstCard = page.locator('.topic-card-container').first();
  if (await firstCard.isVisible()) {
    const box = await firstCard.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.waitForTimeout(120);
      const shot3 = path.join(artifactDir, '196_mobile_home_monolithic_active.png');
      await page.screenshot({ path: shot3 });
      console.log('Saved shot 3:', shot3);
      await page.mouse.up();
    }
  }

  // 4. Test Dark Mode
  console.log('4. Switching to Dark Mode on Home...');
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.waitForTimeout(600);
  const shot4 = path.join(artifactDir, '197_mobile_home_monolithic_dark.png');
  await page.screenshot({ path: shot4 });
  console.log('Saved shot 4:', shot4);

  await browser.close();
  console.log('Finished capturing all modern intelligent screenshots!');
})();
