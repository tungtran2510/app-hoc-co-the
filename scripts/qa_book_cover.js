const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  // Step 1: Find lesson page URLs from home
  const ctx1 = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const p1 = await ctx1.newPage();
  await p1.addInitScript(() => { localStorage.setItem('qbiz_books_intro_seen', '1'); });
  await p1.goto('http://127.0.0.1:3100/?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await p1.waitForTimeout(3000);
  
  const links = await p1.$$eval('a[href]', els => els.map(e => e.getAttribute('href')).filter(h => h && h.startsWith('/') && h.split('/').length >= 3 && !h.includes('api')));
  console.log('Found links:', links.slice(0, 10));
  
  // Use first lesson page link, or fallback
  let lessonUrl = links.length > 0 ? links[0] : '/cot-song/giai-phau';
  console.log('Using lesson URL:', lessonUrl);
  await ctx1.close();

  // Step 2: Mobile screenshot of lesson page
  const mCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const mPage = await mCtx.newPage();
  await mPage.addInitScript(() => { localStorage.setItem('qbiz_books_intro_seen', '1'); });
  await mPage.goto('http://127.0.0.1:3100' + lessonUrl + '?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await mPage.waitForTimeout(4000);
  await mPage.screenshot({ path: path.join(ARTIFACT_DIR, '357_qa_mobile_book_cover.png'), fullPage: true });
  console.log('OK mobile full page');
  
  // Scroll to book cover section
  await mPage.evaluate(() => {
    const el = document.querySelector('[aria-label*="Mở đọc"]') || document.querySelector('img[alt="Bìa sách"]');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await mPage.waitForTimeout(500);
  await mPage.screenshot({ path: path.join(ARTIFACT_DIR, '358_qa_mobile_book_cover_focused.png') });
  console.log('OK mobile focused');

  // Step 3: iPad screenshot
  const iCtx = await browser.newContext({ viewport: { width: 820, height: 1180 }, deviceScaleFactor: 2 });
  const iPage = await iCtx.newPage();
  await iPage.addInitScript(() => { localStorage.setItem('qbiz_books_intro_seen', '1'); });
  await iPage.goto('http://127.0.0.1:3100' + lessonUrl + '?skip_intro=1', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await iPage.waitForTimeout(4000);
  
  await iPage.evaluate(() => {
    const el = document.querySelector('[aria-label*="Mở đọc"]') || document.querySelector('img[alt="Bìa sách"]');
    if (el) el.scrollIntoView({ block: 'center' });
  });
  await iPage.waitForTimeout(500);
  await iPage.screenshot({ path: path.join(ARTIFACT_DIR, '359_qa_ipad_book_cover.png') });
  console.log('OK iPad');

  await browser.close();
  console.log('DONE');
})();
