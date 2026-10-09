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

  const shot1 = path.join(artifactDir, '191_mobile_home_unified_porcelain_topics.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // Scroll slightly down to capture the full grid of 6 topics
  await page.mouse.wheel(0, 220);
  await page.waitForTimeout(600);
  const shot2 = path.join(artifactDir, '192_mobile_home_unified_porcelain_scrolled.png');
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
      const shot3 = path.join(artifactDir, '193_mobile_home_unified_card_active.png');
      await page.screenshot({ path: shot3 });
      console.log('Saved shot 3:', shot3);
      await page.mouse.up();
    }
  }

  await browser.close();
  console.log('Finished capturing unified commercial screenshots!');
})();
