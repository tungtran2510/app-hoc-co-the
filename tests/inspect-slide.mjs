import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  const info = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('*')).find(e => e.textContent && e.textContent.includes('Nổi bật trong tuần') && e.tagName === 'H3');
    const parentSection = el?.closest('section');
    const scrollDiv = parentSection?.querySelector('div.overflow-x-auto');
    const articles = Array.from(parentSection?.querySelectorAll('article') || []).map(a => {
      const rect = a.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, className: a.className };
    });
    const sRect = scrollDiv?.getBoundingClientRect();
    return {
      scrollRect: sRect ? { x: sRect.x, width: sRect.width } : null,
      articles
    };
  });
  console.log(JSON.stringify(info, null, 2));
  await browser.close();
}

run();
