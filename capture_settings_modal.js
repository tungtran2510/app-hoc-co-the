const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';
const deployUrl = 'https://app-hoc-co-aq6c6efcc-tungtran2510-3020s-projects.vercel.app';

async function run() {
  console.log('Chụp Modal Cài Đặt Quản Trị - Tab Giao Diện...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Đăng nhập
  await page.goto(deployUrl + '/dang-nhap', { waitUntil: 'networkidle' });
  await page.fill('input[type="tel"]', '0974248716');
  await page.fill('input[type="password"]', 'Tung@2510');
  await page.click('button[type="submit"]', { force: true });
  await page.waitForTimeout(2000);

  // Mở bài học
  await page.goto(deployUrl + '/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Mở menu tùy chọn
  await page.locator('button[aria-label="Tùy chọn"]').click({ force: true });
  await page.waitForTimeout(600);

  // Bấm "Cài đặt quản trị"
  await page.locator('button:has-text("Cài đặt quản trị")').click({ force: true });
  await page.waitForTimeout(1000);

  // Bấm tab "Giao diện"
  await page.locator('button:has-text("Giao diện")').click({ force: true });
  await page.waitForTimeout(800);

  const p1 = path.join(artifactDir, '01_cai_dat_bang_mau_navy.png');
  await page.screenshot({ path: p1 });
  fs.copyFileSync(p1, '01_cai_dat_bang_mau_navy.png');
  console.log('ĐÃ CHỤP THÀNH CÔNG: 01_cai_dat_bang_mau_navy.png');

  await browser.close();
}

run().catch((err) => {
  console.error('Lỗi chụp settings modal:', err);
  process.exit(1);
});
