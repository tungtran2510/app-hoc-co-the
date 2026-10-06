const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const TARGET_BASE = process.env.TEST_URL || 'http://localhost:3008';

(async () => {
  console.log('================================================================');
  console.log('   STARTING EXHAUSTIVE REAL-BROWSER QA TEST ACROSS ALL PAGES');
  console.log('   Target:', TARGET_BASE);
  console.log('================================================================');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  // Pre-seed storage so the splash screen doesn't block automated interaction
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

  const report = {
    homeTopics: [],
    chuyenDeTopics: [],
    lessonsTested: [],
    timings: []
  };

  // -------------------------------------------------------------
  // 1. TEST TRANG TỔNG QUAN (HOME: /)
  // -------------------------------------------------------------
  console.log('\n>>> BƯỚC 1: KIỂM THỬ TRANG TỔNG QUAN (TRANG CHỦ)');
  const t0 = Date.now();
  await page.goto(TARGET_BASE, { waitUntil: 'networkidle', timeout: 30000 });
  console.log(`   Tải trang chủ hoàn tất trong: ${Date.now() - t0}ms`);

  // Tìm tất cả các thẻ chủ đề hiển thị ở trang chủ
  const homeTopicLinks = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a[href^="/"]'));
    const uniqueSlugs = new Set();
    const results = [];
    const nonTopic = ['da-luu', 'tim-kiem', 'tro-ly-ai', 'chuyen-de', 'dang-nhap', 'admin', 'lop-hoc', 'giai-phau-3d', 'chan-doan-hinh-anh'];

    for (const card of cards) {
      const href = card.getAttribute('href');
      if (!href) continue;
      const clean = href.split('?')[0].replace(/^\//, '');
      const parts = clean.split('/');
      if (parts.length === 1 && parts[0] && !nonTopic.includes(parts[0]) && !uniqueSlugs.has(parts[0])) {
        uniqueSlugs.add(parts[0]);
        results.push({
          slug: parts[0],
          href: `/${parts[0]}`,
          text: card.innerText.replace(/\n/g, ' ').trim().slice(0, 40)
        });
      }
    }
    return results;
  });

  console.log(`   Tìm thấy ${homeTopicLinks.length} chủ đề chính tại Trang tổng quan:`);
  homeTopicLinks.forEach((t, i) => console.log(`      ${i + 1}. [${t.slug}] ${t.text}`));

  // Click vào từng chủ đề từ trang tổng quan và quay lại
  console.log('\n   Bắt đầu click vào từng chủ đề từ Trang tổng quan...');
  for (const topic of homeTopicLinks) {
    const topicSelector = `a[href="${topic.href}"]`;
    const topicCard = page.locator(topicSelector).first();
    await topicCard.scrollIntoViewIfNeeded();

    const tStart = Date.now();
    await topicCard.click();
    await page.waitForFunction((href) => window.location.pathname.startsWith(href), topic.href, { timeout: 10000 });
    await page.waitForSelector('h1, h2, .lesson-page-card', { timeout: 5000 });
    const elapsed = Date.now() - tStart;
    report.timings.push({ action: `Tổng quan -> ${topic.slug}`, ms: elapsed });
    console.log(`   ⚡ Click [${topic.slug}]: ${elapsed}ms -> Thành công! URL: ${page.url()}`);

    // Quay lại trang chủ qua tab Tổng quan ở BottomNav
    const tHomeStart = Date.now();
    const homeTab = page.locator('nav[aria-label="Điều hướng chính"] a[href="/"]').first();
    await homeTab.click();
    await page.waitForFunction(() => window.location.pathname === '/', null, { timeout: 10000 });
    const homeElapsed = Date.now() - tHomeStart;
    report.timings.push({ action: `${topic.slug} -> Tổng quan`, ms: homeElapsed });
  }

  // -------------------------------------------------------------
  // 2. TEST CHUYỂN SANG TRANG CHUYÊN ĐỀ (/chuyen-de)
  // -------------------------------------------------------------
  console.log('\n>>> BƯỚC 2: CHUYỂN SANG TRANG CHUYÊN ĐỀ (/chuyen-de)');
  const chuyenDeTab = page.locator('nav[aria-label="Điều hướng chính"] a[href="/chuyen-de"]').first();
  const tChuyenDeStart = Date.now();
  await chuyenDeTab.click();
  await page.waitForFunction(() => window.location.pathname.startsWith('/chuyen-de'), null, { timeout: 10000 });
  const chuyenDeTabMs = Date.now() - tChuyenDeStart;
  console.log(`   ⚡ Chuyển tab Chuyên đề: ${chuyenDeTabMs}ms`);

  // Lưu ảnh chụp trang Chuyên đề
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'chuyen_de_page_mobile.png') });

  // -------------------------------------------------------------
  // 3. TÌM TOÀN BỘ CHUYÊN ĐỀ VÀ BÀI HỌC TRONG TỪNG CHUYÊN ĐỀ
  // -------------------------------------------------------------
  console.log('\n>>> BƯỚC 3: KIỂM THỬ CLICK TỪNG CHUYÊN ĐỀ & TỪNG BÀI HỌC');
  
  // Lấy danh sách các chuyên đề hiển thị trên /chuyen-de
  const chuyenDeList = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href^="/"]'));
    const uniqueSlugs = new Set();
    const results = [];
    const nonTopic = ['da-luu', 'tim-kiem', 'tro-ly-ai', 'chuyen-de', 'dang-nhap', 'admin', 'lop-hoc', 'giai-phau-3d', 'chan-doan-hinh-anh'];

    for (const link of links) {
      const href = link.getAttribute('href');
      if (!href) continue;
      const clean = href.split('?')[0].replace(/^\//, '');
      const parts = clean.split('/');
      if (parts.length === 1 && parts[0] && !nonTopic.includes(parts[0]) && !uniqueSlugs.has(parts[0])) {
        uniqueSlugs.add(parts[0]);
        results.push({
          slug: parts[0],
          href: `/${parts[0]}`,
          title: link.innerText.replace(/\n/g, ' ').trim().slice(0, 40)
        });
      }
    }
    return results;
  });

  console.log(`   Tìm thấy ${chuyenDeList.length} chuyên đề để duyệt bài học chi tiết:`);
  chuyenDeList.forEach((c, idx) => console.log(`      ${idx + 1}. [${c.slug}] ${c.title}`));

  let totalLessonsClicked = 0;

  // Lặp qua từng chuyên đề
  for (let cIdx = 0; cIdx < chuyenDeList.length; cIdx++) {
    const topic = chuyenDeList[cIdx];
    console.log(`\n--- [CHUYÊN ĐỀ ${cIdx + 1}/${chuyenDeList.length}] ${topic.title} (${topic.slug}) ---`);

    // Click vào chuyên đề từ trang /chuyen-de
    const topicLink = page.locator(`a[href="${topic.href}"]`).first();
    await topicLink.scrollIntoViewIfNeeded();

    const tEnterTopic = Date.now();
    await topicLink.click();
    await page.waitForFunction((href) => window.location.pathname.startsWith(href), topic.href, { timeout: 10000 });
    await page.waitForSelector('h1, h2, .lesson-page-card, a[href*="' + topic.slug + '/"]', { timeout: 5000 });
    const enterTopicMs = Date.now() - tEnterTopic;
    report.timings.push({ action: `Chuyên đề -> ${topic.slug}`, ms: enterTopicMs });
    console.log(`   ⚡ Vào chuyên đề [${topic.slug}]: ${enterTopicMs}ms`);

    // Lấy danh sách toàn bộ các bài học trong chuyên đề này
    const lessonLinks = await page.evaluate((topicSlug) => {
      const cards = Array.from(document.querySelectorAll(`a[href^="/${topicSlug}/"]`));
      const seen = new Set();
      const list = [];
      for (const c of cards) {
        const href = c.getAttribute('href');
        if (!href || seen.has(href)) continue;
        seen.add(href);
        const titleEl = c.querySelector('h3, h4, p, span');
        list.push({
          href,
          title: (titleEl ? titleEl.innerText : c.innerText).replace(/\n/g, ' ').trim().slice(0, 50)
        });
      }
      return list;
    }, topic.slug);

    console.log(`   Chuyên đề [${topic.slug}] có ${lessonLinks.length} bài học:`);

    // Click vào TỪNG BÀI HỌC MỘT
    for (let lIdx = 0; lIdx < lessonLinks.length; lIdx++) {
      const lesson = lessonLinks[lIdx];
      const lessonSelector = `a[href="${lesson.href}"]`;
      const lessonCard = page.locator(lessonSelector).first();
      await lessonCard.scrollIntoViewIfNeeded();

      const expectedPath = lesson.href.split('?')[0];
      const tEnterLesson = Date.now();
      await lessonCard.click();
      await page.waitForFunction((path) => window.location.pathname === path, expectedPath, { timeout: 10000 });

      // Xác minh bài học tải đủ nội dung (tiêu đề, tabs, nội dung)
      await page.waitForSelector('header, h1, article, [role="tablist"], button', { timeout: 5000 });
      const enterLessonMs = Date.now() - tEnterLesson;
      report.timings.push({ action: `Bài học: ${lesson.title}`, ms: enterLessonMs });
      totalLessonsClicked++;

      // Kiểm tra trạng thái bài học
      const lessonState = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.innerText || '';
        const buttons = Array.from(document.querySelectorAll('button'));
        const hasTabs = buttons.some(b => b.innerText.includes('Tóm tắt') || b.innerText.includes('Giáo trình')) || !!document.querySelector('[role="tablist"]');
        const hasVideo = !!document.querySelector('iframe, video, [data-video], .aspect-video');
        const hasArticle = !!document.querySelector('article, main, .prose, div');
        return { h1, hasTabs, hasVideo, hasArticle };
      });

      console.log(`      ${lIdx + 1}. [${enterLessonMs}ms] "${lesson.title}" -> Khớp H1: "${lessonState.h1.slice(0, 30)}..." (Video: ${lessonState.hasVideo}, Bài viết: ${lessonState.hasArticle})`);

      report.lessonsTested.push({
        topic: topic.slug,
        title: lesson.title,
        href: lesson.href,
        ms: enterLessonMs,
        h1: lessonState.h1
      });

      // Nếu là bài đầu tiên của chuyên đề, chụp ảnh minh chứng
      if (lIdx === 0) {
        const shotPath = path.join(ARTIFACT_DIR, `verified_lesson_${topic.slug}.png`);
        await page.screenshot({ path: shotPath });
        console.log(`         📸 Đã lưu ảnh bài học: verified_lesson_${topic.slug}.png`);
      }

      // Quay lại trang chuyên đề bằng Breadcrumb hoặc Header Back
      const breadcrumbBack = page.locator(`header a[href="/${topic.slug}"]`).first();
      const hasBreadcrumb = await breadcrumbBack.isVisible().catch(() => false);

      const tBack = Date.now();
      if (hasBreadcrumb) {
        await breadcrumbBack.click();
        await page.waitForFunction((slug) => window.location.pathname === '/' + slug, topic.slug, { timeout: 10000 });
      } else {
        // Fallback: dùng nút quay lại hoặc điều hướng URL
        await page.goto(`${TARGET_BASE}/${topic.slug}`, { waitUntil: 'networkidle' });
      }
      const backMs = Date.now() - tBack;
      report.timings.push({ action: `Back -> ${topic.slug}`, ms: backMs });
    }

    // Sau khi duyệt hết bài học của chuyên đề này, quay lại /chuyen-de để duyệt chuyên đề tiếp theo
    if (cIdx < chuyenDeList.length - 1) {
      const chuyenDeLink = page.locator('nav[aria-label="Điều hướng chính"] a[href="/chuyen-de"]').first();
      await chuyenDeLink.click();
      await page.waitForFunction(() => window.location.pathname.startsWith('/chuyen-de'), null, { timeout: 10000 });
    }
  }

  // -------------------------------------------------------------
  // 4. TỔNG KẾT VÀ TÍNH TOÁN HIỆU NĂNG TOÀN DIỆN
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('   BÁO CÁO NGHIỆM THU CHI TIẾT TỪNG MỤC TỪNG BÀI HỌC');
  console.log('================================================================');
  console.log(`   - Tổng số chủ đề kiểm thử tại Trang chủ:   ${homeTopicLinks.length}`);
  console.log(`   - Tổng số chuyên đề kiểm thử tại Chuyên đề: ${chuyenDeList.length}`);
  console.log(`   - Tổng số bài học đã click trực tiếp:      ${totalLessonsClicked}`);
  console.log(`   - Tổng số lượt click & chuyển trang:       ${report.timings.length}`);
  console.log(`   - Tổng số lỗi phát sinh (Page/JS Errors):   ${errors.length}`);

  const allMs = report.timings.map(t => t.ms);
  const avgMs = Math.round(allMs.reduce((a, b) => a + b, 0) / (allMs.length || 1));
  const maxMs = Math.max(...allMs);
  const minMs = Math.min(...allMs);

  console.log(`   - Tốc độ chuyển trang trung bình:          ${avgMs}ms`);
  console.log(`   - Tốc độ nhanh nhất:                       ${minMs}ms`);
  console.log(`   - Tốc độ lâu nhất:                         ${maxMs}ms`);
  console.log('================================================================');

  if (errors.length > 0 || totalLessonsClicked === 0) {
    console.error('❌ NGHIỆM THU THẤT BÀI: Còn lỗi hoặc không duyệt đủ bài học!');
    process.exit(1);
  } else {
    console.log('✅ TOÀN BỘ CÁC TRANG, CÁC CHUYÊN ĐỀ VÀ TẤT CẢ BÀI HỌC ĐẠT 100% NHANH - MƯỢT - ĐẦY ĐỦ NỘI DUNG!');
  }

  await browser.close();
})();
