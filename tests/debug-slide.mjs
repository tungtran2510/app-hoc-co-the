import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  const data = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('h3')).find(e => e.textContent.includes('Nổi bật trong tuần'));
    const section = el?.closest('section');
    const scrollDiv = section?.querySelector('div[class*="overflow"]');
    const arts = section ? Array.from(section.querySelectorAll('article')) : [];
    return {
      sectionTag: section?.tagName,
      scrollDivClass: scrollDiv?.className,
      scrollDivRect: scrollDiv?.getBoundingClientRect(),
      artsCount: arts.length,
      arts: arts.map(a => a.getBoundingClientRect())
    };
  });
  console.log(JSON.stringify(data, null, 2));
  await browser.close();
}

run();
