const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const baseUrl = 'https://app-hoc-co-the.vercel.app';

async function run() {
  console.log('Bắt đầu chụp ảnh Mobile thật nghiệm thu Cầu nối Ebook TRÊN VERCEL PRODUCTION...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Đăng nhập Admin
  console.log('1. Đăng nhập Admin...');
  await page.goto(baseUrl + '/dang-nhap', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  await page.fill('input[type="tel"]', process.env.ADMIN_PHONE || '');
  await page.fill('input[type="password"]', process.env.ADMIN_PASSWORD || '');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForTimeout(2500);

  // 2. Chụp Bài học với Thẻ Cầu Nối Ebook Thông Minh 1 dòng ở cuối bài trên Production
  console.log('2. Mở bài học và cuộn xuống Thẻ Cầu Nối Ebook trên Production...');
  await page.goto(baseUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Cuộn chính xác thẻ Ebook vào giữa màn hình
  const ebookBridge = page.locator('a:has-text("Đọc Ebook")');
  await ebookBridge.evaluate(el => el.scrollIntoView({ block: 'center', inline: 'center' }));
  await page.waitForTimeout(600);

  // Kiểm tra thuộc tính href của thẻ Ebook trên Production
  const href = await ebookBridge.getAttribute('href');
  console.log('HREF của thẻ Ebook trên Production:', href);

  const p1 = path.join(artifactDir, '01_bai_hoc_the_cau_noi_ebook_1_dong.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_bai_hoc_the_cau_noi_ebook_1_dong.png');
  console.log('Đã chụp: 01_bai_hoc_the_cau_noi_ebook_1_dong.png');

  // 3. Mở Cài đặt quản trị -> Tab Giao diện trên Production
  console.log('3. Mở Cài đặt quản trị - Tab Giao diện trên Production...');
  
  // Cuộn xuống đáy trang để thấy nút "Cài đặt app"
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
  await page.waitForTimeout(600);

  const caiDatBtn = page.locator('button:has-text("Cài đặt app")');
  await caiDatBtn.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await caiDatBtn.click({ force: true });
  await page.waitForTimeout(800);

  // Bấm tab "Giao diện"
  await page.locator('button:has-text("Giao diện")').click({ force: true });
  await page.waitForTimeout(600);

  // Cuộn nhẹ trong modal để thấy rõ cụm cài đặt Giao diện & Ebook
  await page.evaluate(() => {
    const modalBody = document.querySelector('.overflow-y-auto');
    if (modalBody) modalBody.scrollTo({ top: 120, behavior: 'instant' });
  });
  await page.waitForTimeout(500);

  const p2 = path.join(artifactDir, '02_modal_cai_dat_tuy_chon_ebook_bridge.png');
  await page.screenshot({ path: p2 });
  fs.copyFileSync(p2, '02_modal_cai_dat_tuy_chon_ebook_bridge.png');
  console.log('Đã chụp: 02_modal_cai_dat_tuy_chon_ebook_bridge.png');

  await browser.close();
  console.log('HOÀN TẤT CHỤP ẢNH NGHIỆM THU MOBILE THỰC TẾ TRÊN PRODUCTION!');
}

run().catch((err) => {
  console.error('Lỗi chụp Playwright:', err);
  process.exit(1);
});
