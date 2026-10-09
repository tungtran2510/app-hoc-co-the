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

  // 1. Chụp phần đầu trang: Header + Hero Brand Card (Royal Navy) + Đang học dở + Chuyên đề đầu
  const shot1 = path.join(artifactDir, '205_mobile_home_hero_banner_top.png');
  await page.screenshot({ path: shot1 });
  console.log('Saved shot 1:', shot1);

  // 2. Cuộn nhẹ xuống để chụp trọn vẹn cụm 6 Chuyên đề học với nhãn y khoa riêng biệt
  await page.mouse.wheel(0, 320);
  await page.waitForTimeout(600);
  const shot2 = path.join(artifactDir, '206_mobile_home_medical_taxonomy_topics.png');
  await page.screenshot({ path: shot2 });
  console.log('Saved shot 2:', shot2);

  // 3. Test Dark Mode
  console.log('3. Switching to Dark Mode on Home...');
  await page.evaluate(() => {
    localStorage.setItem('giao_dien', 'dark');
    document.documentElement.classList.add('dark');
  });
  await page.mouse.wheel(0, -320);
  await page.waitForTimeout(600);
  const shot3 = path.join(artifactDir, '207_mobile_home_hero_dark.png');
  await page.screenshot({ path: shot3 });
  console.log('Saved shot 3:', shot3);

  await browser.close();
  console.log('Finished capturing all Hero & Medical Taxonomy screenshots!');
})();
