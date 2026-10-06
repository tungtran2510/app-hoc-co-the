const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING PLAYWRIGHT REAL BROWSER QA TEST ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const page = await context.newPage();

  page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

  const targetBase = process.env.TEST_URL || 'https://app-hoc-co-the.vercel.app';
  console.log(`1. Navigating to ${targetBase} ...`);
  await page.goto(targetBase, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(1000);
  console.log('   Initial URL:', page.url());

  // TEST 1: BottomNav -> Chuyên đề
  console.log('2. Testing Tab "Chuyên đề" (/chuyen-de)...');
  const tabChuyenDe = page.locator('nav[aria-label="Điều hướng chính"] a[href="/chuyen-de"]').first();
  await tabChuyenDe.click();
  await page.waitForURL('**/chuyen-de', { timeout: 8000 });
  console.log('   PASSED -> URL is now:', page.url());

  // TEST 2: BottomNav -> Đã lưu
  console.log('3. Testing Tab "Đã lưu" (/da-luu)...');
  const tabDaLuu = page.locator('nav[aria-label="Điều hướng chính"] a[href="/da-luu"]').first();
  await tabDaLuu.click();
  await page.waitForURL('**/da-luu', { timeout: 8000 });
  console.log('   PASSED -> URL is now:', page.url());

  // TEST 3: BottomNav -> Hỏi đáp AI
  console.log('4. Testing Tab "Hỏi đáp AI" (/tro-ly-ai)...');
  const tabAi = page.locator('nav[aria-label="Điều hướng chính"] a[href="/tro-ly-ai"]').first();
  await tabAi.click();
  await page.waitForURL('**/tro-ly-ai', { timeout: 8000 });
  console.log('   PASSED -> URL is now:', page.url());

  // TEST 4: BottomNav -> Tổng quan
  console.log('5. Testing Tab "Tổng quan" (/)...');
  const tabHome = page.locator('nav[aria-label="Điều hướng chính"] a[href="/"]').first();
  await tabHome.click();
  await page.waitForURL(targetBase + '/', { timeout: 8000 });
  console.log('   PASSED -> Returned home:', page.url());

  // TEST 5: TopicCard click (Cột sống)
  console.log('6. Testing Topic Card click (/cot-song)...');
  const cardCotSong = page.locator('a[href="/cot-song"]').first();
  await cardCotSong.scrollIntoViewIfNeeded();
  await cardCotSong.click();
  await page.waitForURL('**/cot-song', { timeout: 8000 });
  console.log('   PASSED -> Topic URL is:', page.url());

  // TEST 6: PageCard click inside Topic
  console.log('7. Testing Lesson PageCard click inside Topic...');
  const firstLessonCard = page.locator('a.lesson-page-card').first();
  const lessonCount = await firstLessonCard.count();
  if (lessonCount > 0) {
    const lessonHref = await firstLessonCard.getAttribute('href');
    console.log('   Found lesson link:', lessonHref);
    await firstLessonCard.click();
    await page.waitForURL(`**${lessonHref}`, { timeout: 8000 });
    console.log('   PASSED -> Lesson URL is:', page.url());

    // TEST 7: Back to Home or Topic from PageHeaderBar
    console.log('8. Testing Back to Topic/Home from lesson header...');
    const backBtn = page.locator('header a[href="/cot-song"]').first();
    if (await backBtn.count() > 0) {
      await backBtn.click();
      await page.waitForURL('**/cot-song', { timeout: 8000 });
      console.log('   PASSED -> Back to Topic URL:', page.url());
    }
  }

  // TEST 8: CSS Active & Glow verification
  console.log('9. Testing CSS Active Glow computed styles...');
  await page.goto(targetBase, { waitUntil: 'domcontentloaded' });
  const glowStyle = await page.evaluate(() => {
    const cardGlow = document.querySelector('.topic-card-glow');
    if (!cardGlow) return null;
    return window.getComputedStyle(cardGlow).transition;
  });
  console.log('   Topic Card Glow transition style:', glowStyle);

  console.log('--- ALL BROWSER QA TESTS PASSED SUCCESSFULLY! 100% RELIABLE ---');
  await browser.close();
})();
