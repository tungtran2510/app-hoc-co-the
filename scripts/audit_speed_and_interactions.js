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
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.toString());
  });

  const results = [];

  async function measureRoute(url, label) {
    const start = Date.now();
    const res = await page.goto(url, { waitUntil: 'networkidle' });
    const duration = Date.now() - start;
    const status = res ? res.status() : 'no response';
    console.log(`[ROUTE] ${label} (${url}) -> Status: ${status}, Time: ${duration}ms`);
    results.push({ label, url, status, duration });
    return duration;
  }

  console.log('=== 1. KIỂM TRA TỐC ĐỘ TẢI TRANG CỐT LÕI ===');
  await measureRoute('http://localhost:3270/', 'Trang Tổng Quan (Home)');
  await page.screenshot({ path: path.join(artifactDir, '174_audit_home_speed.png') });

  await measureRoute('http://localhost:3270/chuyen-de', 'Trang Chuyên Đề');
  await page.screenshot({ path: path.join(artifactDir, '175_audit_chuyen_de_speed.png') });

  await measureRoute('http://localhost:3270/cot-song', 'Chuyên đề Cột Sống');
  await page.screenshot({ path: path.join(artifactDir, '176_audit_cot_song_speed.png') });

  await measureRoute('http://localhost:3270/gan-mat-tuy', 'Chuyên đề Gan Mật Tụy');
  await page.screenshot({ path: path.join(artifactDir, '177_audit_gan_mat_tuy_speed.png') });

  await measureRoute('http://localhost:3270/cot-song/tong-quan-ve-cot-song', 'Bài học: Tổng quan cột sống');
  await page.screenshot({ path: path.join(artifactDir, '178_audit_lesson_speed.png') });

  await measureRoute('http://localhost:3270/da-luu', 'Trang Đã Lưu');
  await measureRoute('http://localhost:3270/tim-kiem', 'Trang Tìm Kiếm');

  console.log('\n=== 2. KIỂM TRA TƯƠNG TÁC CLICK & ĐIỀU HƯỚNG BẰNG TRÌNH DUYỆT THẬT ===');

  // Test 2.1: Click trên Home: "Đang học dở" -> click vào thẻ để mở bài học
  console.log('Testing: Click card Đang học dở...');
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  const resumeCard = page.locator('a:has-text("Xem tiếp")').first();
  if (await resumeCard.isVisible()) {
    const t0 = Date.now();
    await resumeCard.click({ force: true });
    await page.waitForLoadState('networkidle');
    const resumeTime = Date.now() - t0;
    console.log(`-> Click card Đang học dở chuyển trang thành công trong: ${resumeTime}ms, URL hiện tại: ${page.url()}`);
  }

  // Test 2.2: Test nút quay về "Trang chủ" từ bài học
  console.log('Testing: Nút quay về từ bài học...');
  const backToHome = page.locator('a:has-text("Trang chủ"), button:has-text("Trang chủ")').first();
  if (await backToHome.isVisible()) {
    const t0 = Date.now();
    await backToHome.click({ force: true });
    await page.waitForLoadState('networkidle');
    console.log(`-> Nút "Trang chủ" quay về thành công trong: ${Date.now() - t0}ms, URL: ${page.url()}`);
  } else {
    await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  }

  // Test 2.3: Test click Bottom Navigation: Chuyển qua lại 4 tab
  console.log('Testing: Bottom Navigation tabs...');
  const bottomNavHrefs = ['/chuyen-de', '/da-luu', '/tim-kiem', '/'];
  for (const href of bottomNavHrefs) {
    const t0 = Date.now();
    const navLink = page.locator(`nav a[href="${href}"]`).first();
    await navLink.click({ force: true });
    await page.waitForLoadState('networkidle');
    console.log(`-> BottomNav click "${href}" chuyển mượt mà trong: ${Date.now() - t0}ms, URL: ${page.url()}`);
  }

  // Test 2.4: Test click vào từng chuyên đề trên trang Chuyên đề
  console.log('Testing: Click vào các chuyên đề trên trang /chuyen-de...');
  await page.goto('http://localhost:3270/chuyen-de', { waitUntil: 'networkidle' });
  const testTopics = ['Hệ Tiêu Hóa', 'Gan – Mật – Tụy', 'Nội Tiết – Chuyển Hóa', 'Tùng Dinh Dưỡng'];
  for (const topicTitle of testTopics) {
    const topicLink = page.locator(`a:has-text("${topicTitle}")`).first();
    if (await topicLink.isVisible()) {
      const t0 = Date.now();
      await topicLink.click({ force: true });
      await page.waitForLoadState('networkidle');
      console.log(`-> Mở chuyên đề "${topicTitle}" thành công trong: ${Date.now() - t0}ms, URL: ${page.url()}`);
      // Quay lại /chuyen-de
      await page.goto('http://localhost:3270/chuyen-de', { waitUntil: 'networkidle' });
    } else {
      console.warn(`-> Không tìm thấy link cho "${topicTitle}"`);
    }
  }

  // Test 2.5: Test click vào bài học bên trong chuyên đề Gan Mật Tụy
  console.log('Testing: Click vào bài học trong Gan Mật Tụy...');
  await page.goto('http://localhost:3270/gan-mat-tuy', { waitUntil: 'networkidle' });
  const firstLesson = page.locator('text=Gan – Nhà máy sinh hóa 500 chức năng').first();
  if (await firstLesson.isVisible()) {
    const t0 = Date.now();
    await firstLesson.click({ force: true });
    await page.waitForLoadState('networkidle');
    console.log(`-> Mở bài học 01 Gan Mật Tụy thành công trong: ${Date.now() - t0}ms, URL: ${page.url()}`);
    await page.screenshot({ path: path.join(artifactDir, '179_audit_gan_mat_tuy_lesson_open.png') });
  }

  console.log('\n=== 3. TỔNG KẾT TỐC ĐỘ TẢI LẠI (CACHED - CLIENT PREFETCH) ===');
  for (const item of results) {
    const start = Date.now();
    await page.goto(item.url, { waitUntil: 'networkidle' });
    const cachedDuration = Date.now() - start;
    console.log(`[CACHED] ${item.label} -> Tải lại chỉ mất: ${cachedDuration}ms (Nhanh hơn ${(item.duration / Math.max(1, cachedDuration)).toFixed(1)}x)`);
  }

  console.log('\n=== TỔNG KẾT LỖI CONSOLE ===');
  console.log('Total console errors caught:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e, i) => console.log(`  [${i+1}] ${e}`));
  }

  await browser.close();
  console.log('\n=== HOÀN TẤT TOÀN DIỆN KIỂM TRA TỐC ĐỘ VÀ TƯƠNG TÁC! ===');
})();
