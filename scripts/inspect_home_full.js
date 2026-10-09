const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });

  // List sections on homepage
  const sectionList = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('main > div, main > section')).map((el, i) => {
      const heading = el.querySelector('h1, h2, h3, h4')?.innerText || '';
      return `${i}: [${el.tagName}] ${heading} - ${el.innerText.slice(0, 60).replace(/\n/g, ' ')}`;
    });
  });

  console.log('Sections on Home:\n', sectionList.join('\n'));

  const fullScreenshot = path.join(ARTIFACT_DIR, '160_mobile_full_home.png');
  await page.screenshot({ path: fullScreenshot, fullPage: true });
  console.log('Full screenshot saved:', fullScreenshot);

  await browser.close();
})();
