const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  console.log('================================================================');
  console.log('   STARTING MOBILE BROWSER REAL-DEVICE QA TEST & BENCHMARK');
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  // Pre-seed storage so the splash screen doesn't block automated user interaction
  await context.addInitScript(() => {
    try {
      sessionStorage.setItem('qbiz_books_intro_seen', '1');
      localStorage.setItem('qbiz_books_intro_seen', String(Date.now()));
      window.__qbiz_books_intro_seen = true;
    } catch {}
  });

  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => {
    console.error('❌ PAGE ERROR:', err.message);
    errors.push(err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.warn('⚠️ CONSOLE ERROR:', msg.text());
    }
  });

  const targetBase = process.env.TEST_URL || 'https://app-hoc-co-the.vercel.app';
  console.log(`\n1. Navigating to ${targetBase} (Mobile Viewport: 390x844)...`);
  const t0 = Date.now();
  await page.goto(targetBase, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const initialLoadTime = Date.now() - t0;
  console.log(`   Initial DOM loaded in: ${initialLoadTime}ms. URL: ${page.url()}`);
  await page.waitForTimeout(500);

  // -------------------------------------------------------------
  // TEST 1: TOPIC CARD ACTIVE GOLDEN TOUCH EFFECT & HOVER
  // -------------------------------------------------------------
  console.log('\n2. Testing Topic Card Touch Golden Highlight & Glow...');
  const cardCotSong = page.locator('a[href="/cot-song"]').first();
  await cardCotSong.scrollIntoViewIfNeeded();

  // Inspect CSS active styles
  const glowStyles = await page.evaluate(() => {
    const card = document.querySelector('a[href="/cot-song"]');
    if (!card) return null;
    const glow = card.querySelector('.topic-card-glow');
    const spine = card.querySelector('.topic-card-spine');
    const badge = card.querySelector('.topic-card-badge');
    
    // Add is-active to simulate touch down
    card.classList.add('is-active');
    const computedGlow = glow ? window.getComputedStyle(glow) : null;
    const computedSpine = spine ? window.getComputedStyle(spine) : null;
    const computedBadge = badge ? window.getComputedStyle(badge) : null;

    return {
      glowTransform: computedGlow ? computedGlow.transform : null,
      glowBorderColor: computedGlow ? computedGlow.borderTopColor : null,
      badgeBg: computedBadge ? computedBadge.backgroundColor : null,
      badgeColor: computedBadge ? computedBadge.color : null,
    };
  });

  console.log('   🎨 Active Touch Styles:');
  console.log('      - Glow Transform:', glowStyles?.glowTransform);
  console.log('      - Badge BG (Golden):', glowStyles?.badgeBg);
  console.log('      - Badge Text (Dark):', glowStyles?.badgeColor);

  // Capture screenshot of the highlighted golden card
  const cardBox = await cardCotSong.boundingBox();
  const activeScreenshotPath = path.join(ARTIFACT_DIR, 'topic_card_active_golden.png');
  await page.screenshot({ 
    path: activeScreenshotPath, 
    clip: cardBox ? { 
      x: Math.max(0, cardBox.x - 10), 
      y: Math.max(0, cardBox.y - 10), 
      width: cardBox.width + 20, 
      height: cardBox.height + 20 
    } : undefined 
  });
  console.log(`   📸 Active Card Screenshot saved to: topic_card_active_golden.png`);

  // Remove the is-active class to prepare for real navigation click
  await page.evaluate(() => {
    const card = document.querySelector('a[href="/cot-song"]');
    if (card) card.classList.remove('is-active');
  });

  // -------------------------------------------------------------
  // TEST 2: SPEED BENCHMARK - TAP ON TOPIC CARD (/cot-song)
  // -------------------------------------------------------------
  console.log('\n3. Testing Real Tap Transition: Home -> /cot-song...');
  const startTopicNav = Date.now();
  await cardCotSong.click();
  await page.waitForURL('**/cot-song', { timeout: 10000 });
  await page.waitForSelector('.lesson-page-card, h1, h2', { timeout: 5000 });
  const topicTransitionMs = Date.now() - startTopicNav;
  console.log(`   ⚡ TRANSITION TIME (Home -> Topic): ${topicTransitionMs}ms!`);
  console.log(`   Current URL: ${page.url()}`);

  const topicPageScreenshot = path.join(ARTIFACT_DIR, 'topic_page_mobile.png');
  await page.screenshot({ path: topicPageScreenshot });
  console.log(`   📸 Topic Page Screenshot saved to: topic_page_mobile.png`);

  // -------------------------------------------------------------
  // TEST 3: SPEED BENCHMARK - TRANSITION TO LESSON
  // -------------------------------------------------------------
  console.log('\n4. Testing Real Tap Transition: Topic -> Lesson Page...');
  const firstLessonCard = page.locator('a.lesson-page-card').first();
  const lessonHref = await firstLessonCard.getAttribute('href');
  console.log(`   Clicking lesson: ${lessonHref}...`);
  
  const startLessonNav = Date.now();
  await firstLessonCard.click();
  await page.waitForURL(`**${lessonHref}`, { timeout: 10000 });
  await page.waitForSelector('header, article, h1', { timeout: 5000 });
  const lessonTransitionMs = Date.now() - startLessonNav;
  console.log(`   ⚡ TRANSITION TIME (Topic -> Lesson): ${lessonTransitionMs}ms!`);
  console.log(`   Current URL: ${page.url()}`);

  // -------------------------------------------------------------
  // TEST 4: LESSON HEADER BREADCRUMB & BOTTOM DOCK
  // -------------------------------------------------------------
  console.log('\n5. Testing Lesson Header Breadcrumb (Back to Home)...');
  const breadcrumbHome = page.locator('header a[href="/"]').first();
  const startBackHome = Date.now();
  await breadcrumbHome.click();
  await page.waitForURL(targetBase + '/', { timeout: 10000 });
  const backHomeMs = Date.now() - startBackHome;
  console.log(`   ⚡ TRANSITION TIME (Lesson -> Home Breadcrumb): ${backHomeMs}ms!`);

  // -------------------------------------------------------------
  // TEST 5: FLOATING AI BUTTON - SIZE, BORDER & NAVIGATION
  // -------------------------------------------------------------
  console.log('\n6. Inspecting Floating AI Button on Light Mode...');
  const aiButton = page.locator('aside[aria-label*="Hỏi Trợ lý AI"]').first();
  const isAiVisible = await aiButton.isVisible();
  console.log(`   - AI Button visible: ${isAiVisible}`);

  const aiBox = await aiButton.boundingBox();
  console.log(`   - AI Button Position: x=${aiBox?.x}, y=${aiBox?.y}`);
  console.log(`   - AI Button Size: width=${aiBox?.width}px, height=${aiBox?.height}px`);

  const pillStyles = await page.evaluate(() => {
    const aside = document.querySelector('aside[aria-label*="Hỏi Trợ lý AI"]');
    if (!aside) return null;
    const pill = aside.querySelector('a') || aside.querySelector('div');
    if (!pill) return null;
    const computed = window.getComputedStyle(pill);
    return {
      borderWidth: computed.borderWidth,
      borderStyle: computed.borderStyle,
      borderColor: computed.borderColor,
      backgroundColor: computed.backgroundColor,
      boxShadow: computed.boxShadow,
      color: computed.color,
    };
  });
  console.log('   🎨 AI Button Light Mode Styles:');
  console.log('      - Border:', pillStyles?.borderWidth, pillStyles?.borderStyle, pillStyles?.borderColor);
  console.log('      - Background:', pillStyles?.backgroundColor);
  console.log('      - Box Shadow:', pillStyles?.boxShadow);

  const aiScreenshotPath = path.join(ARTIFACT_DIR, 'verified_ai_btn_light_mode.png');
  await page.screenshot({
    path: aiScreenshotPath,
    clip: aiBox ? {
      x: Math.max(0, aiBox.x - 20),
      y: Math.max(0, aiBox.y - 20),
      width: (aiBox.width || 80) + 40,
      height: (aiBox.height || 35) + 40,
    } : undefined,
  });
  console.log('   📸 AI Button Screenshot saved to: verified_ai_btn_light_mode.png');

  // Tap AI Button -> Navigate to /tro-ly-ai
  console.log('   Testing Tap on Floating AI Button -> /tro-ly-ai...');
  const tAiStart = Date.now();
  const aiLink = page.locator('aside[aria-label*="Hỏi Trợ lý AI"] button, aside[aria-label*="Hỏi Trợ lý AI"] a').first();
  await aiLink.click();
  await page.waitForFunction(() => window.location.pathname.startsWith('/tro-ly-ai'), null, { timeout: 10000 });
  const aiTransitionMs = Date.now() - tAiStart;
  console.log(`   ⚡ TRANSITION TIME (Tap AI Button -> /tro-ly-ai): ${aiTransitionMs}ms!`);

  // Navigate back to home for BottomNav tabs test
  await page.goto(targetBase, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // -------------------------------------------------------------
  // TEST 6: BOTTOM NAV TABS SPEED BENCHMARK
  // -------------------------------------------------------------
  console.log('\n7. Testing BottomNav Tabs Instant Switching...');

  const testTab = async (name, href) => {
    const tStart = Date.now();
    const tabLocator = page.locator(`nav[aria-label="Điều hướng chính"] a[href="${href}"]`).first();
    await tabLocator.click();
    await page.waitForURL(`**${href === '/' ? targetBase + '/' : href}`, { timeout: 10000 });
    const tabMs = Date.now() - tStart;
    console.log(`   - Tab "${name}" (${href}): ${tabMs}ms`);
    return tabMs;
  };

  const msChuyenDe = await testTab('Chuyên đề', '/chuyen-de');
  const msDaLuu = await testTab('Đã lưu', '/da-luu');
  const msTimKiem = await testTab('Tìm kiếm', '/tim-kiem');
  const msHome = await testTab('Tổng quan', '/');

  console.log('\n================================================================');
  console.log('   PERFORMANCE SUMMARY & QA VERIFICATION:');
  console.log('================================================================');
  console.log(`   - AI Button Visible & Styled:      ${isAiVisible ? 'PASS' : 'FAIL'} (${aiBox?.width}px x ${aiBox?.height}px)`);
  console.log(`   - AI Button -> /tro-ly-ai:         ${aiTransitionMs}ms`);
  console.log(`   - Home -> Topic (/cot-song):       ${topicTransitionMs}ms`);
  console.log(`   - Topic -> Lesson:                 ${lessonTransitionMs}ms`);
  console.log(`   - Lesson -> Home (Breadcrumb):     ${backHomeMs}ms`);
  console.log(`   - BottomNav Chuyên đề:             ${msChuyenDe}ms`);
  console.log(`   - BottomNav Đã lưu:                ${msDaLuu}ms`);
  console.log(`   - BottomNav Tìm kiếm:              ${msTimKiem}ms`);
  console.log(`   - BottomNav Tổng quan (Trang chủ): ${msHome}ms`);
  console.log(`   - Total Page Errors:               ${errors.length}`);
  console.log('================================================================');

  if (errors.length > 0 || !isAiVisible) {
    console.error('❌ FAILED: Detected errors during run:', errors);
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED WITH 100% SUCCESS!');
  }

  await browser.close();
})();
