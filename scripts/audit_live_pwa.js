const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36',
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  const response = await page.goto('https://app-hoc-co-the.vercel.app', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);
  console.log('Status:', response.status());

  // Check manifest link tag in HTML
  const manifestHref = await page.$eval('link[rel="manifest"]', el => el.href).catch(e => e.message);
  console.log('Manifest href in DOM:', manifestHref);

  // Fetch manifest
  const manifestData = await page.evaluate(async (url) => {
    const res = await fetch(url);
    return { status: res.status, json: await res.json() };
  }, manifestHref);
  console.log('Manifest status:', manifestData.status);
  console.log('Manifest icons count:', manifestData.json.icons.length);

  // Check if each icon is fetchable and its content type & actual dimensions
  for (const icon of manifestData.json.icons) {
    const iconRes = await page.evaluate(async (src) => {
      try {
        const res = await fetch(src);
        const blob = await res.blob();
        const bmp = await createImageBitmap(blob);
        return { ok: res.ok, status: res.status, type: blob.type, size: blob.size, actualWidth: bmp.width, actualHeight: bmp.height };
      } catch (e) {
        return { error: e.message };
      }
    }, icon.src);
    console.log('Icon src:', icon.src, 'declared sizes:', icon.sizes, 'purpose:', icon.purpose, '=> actual:', iconRes);
  }

  // Check icon links in <head>
  const iconLinks = await page.$$eval('link[rel*="icon"]', els => els.map(e => ({ rel: e.rel, href: e.href, sizes: e.sizes?.value })));
  console.log('Icon links in <head>:', JSON.stringify(iconLinks, null, 2));

  await browser.close();
})();
