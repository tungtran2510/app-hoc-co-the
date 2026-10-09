import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const section = document.querySelector('section.animate-fadeIn');
    const scrollDiv = section.querySelector('div[class*="overflow-x-auto"]');
    const arts = section.querySelectorAll('article');
    return {
      main: {
        x: document.querySelector('main').getBoundingClientRect().x,
        width: document.querySelector('main').getBoundingClientRect().width,
        paddingLeft: window.getComputedStyle(document.querySelector('main')).paddingLeft,
        paddingRight: window.getComputedStyle(document.querySelector('main')).paddingRight,
      },
      scrollDiv: {
        x: scrollDiv.getBoundingClientRect().x,
        width: scrollDiv.getBoundingClientRect().width,
      },
      art1: {
        x: arts[0].getBoundingClientRect().x,
        width: arts[0].getBoundingClientRect().width,
      },
      art2: {
        x: arts[1].getBoundingClientRect().x,
        width: arts[1].getBoundingClientRect().width,
      },
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

run();
