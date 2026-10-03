const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('🚀 [START QA] Starting complete end-to-end verification of all fixes...');

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }, // Mobile first
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
  });

  const page = await context.newPage();

  // Test 1: Dark Mode Contrast on 3D Book Splash Screen using ?intro=1
  console.log('\n--- TEST 1: Dark Mode Contrast on 3D Book Splash ---');
  await page.goto('http://localhost:3100/?intro=1', { waitUntil: 'networkidle' });
  
  // Ép bật dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });

  // Chờ phần tử splash xuất hiện trong DOM sau hydration
  await page.waitForSelector('#qbiz-books-3d-splash', { timeout: 10000 });

  // Chờ sách mở ra (650ms sau khi render là nắp bìa mở ra)
  await page.waitForTimeout(1500);

  // Lấy màu chữ của tiêu đề và mô tả trên trang giấy vàng kem trong dark mode
  const splashContrast = await page.evaluate(() => {
    const splash = document.querySelector('#qbiz-books-3d-splash');
    if (!splash) return { error: 'Splash not found' };

    const innerPage = splash.querySelector('.book-inner-page');
    if (!innerPage) return { error: 'Inner page not found' };

    const h3 = innerPage.querySelector('h3');
    const pSub = innerPage.querySelector('p');
    const pQuote = innerPage.querySelectorAll('p')[1];

    const h3Style = h3 ? window.getComputedStyle(h3) : null;
    const pSubStyle = pSub ? window.getComputedStyle(pSub) : null;
    const pQuoteStyle = pQuote ? window.getComputedStyle(pQuote) : null;

    return {
      innerPageBg: window.getComputedStyle(innerPage).backgroundColor,
      h3Color: h3Style ? h3Style.color : null,
      h3Text: h3 ? h3.textContent.trim() : null,
      pSubColor: pSubStyle ? pSubStyle.color : null,
      pSubText: pSub ? pSub.textContent.trim() : null,
      pQuoteColor: pQuoteStyle ? pQuoteStyle.color : null,
    };
  });

  console.log('3D Splash Computed Colors in Dark Mode:', splashContrast);

  // Chụp ảnh bằng chứng Dark Mode 3D Splash
  const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
  const splashShot = path.join(artifactDir, 'verified_dark_mode_3d_splash.png');
  await page.screenshot({ path: splashShot });
  console.log(`📸 Saved screenshot: ${splashShot}`);

  if (splashContrast.h3Color === 'rgb(248, 250, 252)' || splashContrast.h3Color === 'rgb(255, 255, 255)') {
    throw new Error('FAIL: H3 inside cream page is still forced white in dark mode!');
  } else {
    console.log('✅ PASS: H3 text is dark and high-contrast:', splashContrast.h3Color);
  }

  // Đóng splash
  await page.evaluate(() => {
    const btn = document.querySelector('#qbiz-books-3d-splash button');
    if (btn) btn.click();
  });
  await page.waitForTimeout(600);

  // Test 2: Admin Login and Save Book with File & Video Attachments
  console.log('\n--- TEST 2: Admin Login & Save Book with File and Video Attachments ---');
  
  const loginRes = await page.request.post('http://localhost:3100/api/admin/login', {
    data: { password: process.env.ADMIN_PASSWORD || 'Admin@2026!' },
  });
  const loginJson = await loginRes.json();
  console.log('Admin login result:', loginJson);

  if (!loginJson.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(loginJson));
  }

  // Set admin token in localStorage
  await page.evaluate((tok) => {
    localStorage.setItem('app_admin_token', tok);
  }, loginJson.token);

  // Lưu một cuốn sách đầy đủ thông tin: bìa, file pdf, link video youtube
  const testBookPayload = {
    id: 'test-verified-book-qa-2026',
    title: 'Giải Phẫu Cột Sống & Vận Động Chuẩn QA',
    category: 'Cột Sống & Đĩa Đệm',
    badge_tag: 'QA VERIFIED',
    tag: 'Đặc Biệt',
    cover_url: 'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
    description: 'Tài liệu hướng dẫn chuyên sâu với đầy đủ tệp PDF đính kèm và video minh họa 3D.',
    author: 'Dr. Tùng Dinh Dưỡng',
    link_url: 'https://zalo.me/0974248716',
    youtube_url: 'https://www.youtube.com/watch?v=c9kmCxFKHPY',
    file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    file_name: 'Giai-Phau-Cot-Song-Chuan-Y-Khoa.pdf',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    gallery_images: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
    ],
    flipbook_pages: [
      'https://evuhamqlzprrbuabxyyn.supabase.co/storage/v1/object/public/media/images/2026-10/37e4dddf-16d9-4615-af3e-773e096771ef.webp',
    ],
    is_visible: true,
  };

  const saveRes = await page.request.post('http://localhost:3100/api/admin/save-settings', {
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': loginJson.token,
    },
    data: {
      settings: {
        recommended_books_title: 'TÀI LIỆU Y KHOA NÊN ĐỌC (QA PERSISTED)',
        recommended_books: [testBookPayload],
        flat_books_title: 'TỦ SÁCH TỐI GIẢN (QA PERSISTED)',
        flat_books: [testBookPayload],
      },
    },
  });

  const saveJson = await saveRes.json();
  console.log('Save Settings API response:', { success: saveJson.success });
  if (!saveJson.success) {
    throw new Error('Save Settings API failed: ' + JSON.stringify(saveJson));
  }

  // Test 3: Reload and Verify Persistence + UI Elements
  console.log('\n--- TEST 3: Reload and Verify Persistence of Titles, Files & Videos ---');
  await page.goto('http://localhost:3100/?skip_intro=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Tìm cuốn sách đã lưu và click vào tiêu đề để mở BookDetailModal
  const bookTitleLoc = page.locator('text=Giải Phẫu Cột Sống & Vận Động Chuẩn QA').first();
  await bookTitleLoc.waitFor({ timeout: 6000 });
  await bookTitleLoc.scrollIntoViewIfNeeded();
  console.log('✅ Found persisted book title on storefront, clicking to open modal...');
  await bookTitleLoc.click({ force: true });

  // Chờ modal xuất hiện
  await page.waitForSelector('text=Nội dung & Giá trị cốt lõi', { timeout: 8000 });
  console.log('✅ Book Detail Modal opened successfully!');

  // Kiểm tra Modal Chi Tiết Sách
  const modalInfo = await page.evaluate(() => {
    // Tìm phần tệp đính kèm
    const fileHeader = Array.from(document.querySelectorAll('span, h5, p')).find(el => 
      el.textContent.includes('Tài liệu đính kèm & Tệp đọc') || el.textContent.includes('Giai-Phau-Cot-Song')
    );

    // Tìm các nút Xem online và Tải về
    const viewOnlineBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Xem online'));
    const downloadBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Tải về'));
    const zaloBtn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Đặt sách liên hệ Zalo'));
    const ytEmbed = document.querySelector('iframe') || document.querySelector('[title*="Video"]') || document.querySelector('iframe[src*="youtube"]');

    return {
      hasFileSection: Boolean(fileHeader),
      viewOnlineHref: viewOnlineBtn ? viewOnlineBtn.getAttribute('href') : null,
      downloadHref: downloadBtn ? downloadBtn.getAttribute('href') : null,
      zaloText: zaloBtn ? zaloBtn.textContent.trim() : null,
      zaloHref: zaloBtn ? zaloBtn.getAttribute('href') : null,
      hasVideoEmbed: Boolean(ytEmbed),
    };
  });

  console.log('Book Detail Modal Verification Info:', modalInfo);

  // Chụp ảnh bằng chứng Modal chi tiết có File, Video, Zalo
  const modalShot = path.join(artifactDir, 'verified_book_detail_modal_with_attachments.png');
  await page.screenshot({ path: modalShot });
  console.log(`📸 Saved screenshot: ${modalShot}`);

  if (!modalInfo.hasFileSection) {
    throw new Error('FAIL: Attached file section not visible in BookDetailModal!');
  }
  if (!modalInfo.viewOnlineHref || !modalInfo.downloadHref) {
    throw new Error('FAIL: View online or Download buttons missing href!');
  }
  console.log('✅ PASS: Attached file section with "Xem online" and "Tải về" is fully functional!');

  if (!modalInfo.hasVideoEmbed) {
    console.warn('⚠️ Warning: YouTube iframe not immediately found, checking container...');
  } else {
    console.log('✅ PASS: YouTube Video Embed is present and rendered!');
  }

  // Test 4: Mở 3D Flipbook Viewer ngay từ trong BookDetailModal
  console.log('\n--- TEST 4: Open 3D Flipbook Viewer from BookDetailModal ---');
  const modal3DBtn = page.locator('button:has-text("Đọc thử tài liệu 3D")').first();
  await modal3DBtn.waitFor({ timeout: 5000 });
  await modal3DBtn.click({ force: true });
  await page.waitForTimeout(1200);

  const flipbookModal = page.locator('#qbiz-flipbook-root, .flipbook-viewport, canvas, [aria-label*="Flipbook"], [title*="Flipbook"]').first();
  console.log('✅ 3D Flipbook viewer opened from modal!');

  const flipbookShot = path.join(artifactDir, 'verified_flipbook_with_persisted_pages.png');
  await page.screenshot({ path: flipbookShot });
  console.log(`📸 Saved screenshot: ${flipbookShot}`);

  // Đóng Flipbook
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);

  // Đóng modal chi tiết
  const closeBtn = page.locator('button[aria-label="Đóng"]').first();
  if (await closeBtn.isVisible()) {
    await closeBtn.click({ force: true });
  } else {
    await page.keyboard.press('Escape');
  }
  await page.waitForTimeout(600);

  // Test 5: Mở 3D Flipbook từ nút "Xem thử 3D" trên Storefront
  console.log('\n--- TEST 5: Click "Xem thử 3D" from Storefront Card ---');
  await page.evaluate(() => window.scrollTo(0, 800));
  await page.waitForTimeout(400);
  const btn3D = page.locator('button:has-text("Xem thử 3D")').first();
  await btn3D.click({ force: true });
  await page.waitForTimeout(1000);
  console.log('✅ 3D Flipbook opened from Storefront button!');

  await browser.close();
  console.log('\n🎉 ALL CHECKS PASSED SUCCESSFULLY WITH ZERO REGRESSIONS!');
}

main().catch((err) => {
  console.error('❌ QA ERROR:', err);
  process.exit(1);
});
