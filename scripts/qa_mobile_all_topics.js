const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function runQA() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // Test 1: Nước & Điện Giải - vai-tro-cua-nuoc -> Click "💡 Rút ra" on first video
  console.log('1. Testing /nuoc/vai-tro-cua-nuoc ...');
  await page.goto('http://localhost:3260/nuoc/vai-tro-cua-nuoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  
  // Click "💡 Rút ra" button on first video
  const rutRaButtons = await page.locator('button:has-text("Rút ra")').all();
  if (rutRaButtons.length > 0) {
    await rutRaButtons[0].click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '116_mobile_nuoc_rut_ra_expanded.png'), fullPage: false });

  // Scroll to bottom of lesson to prove zero redundant blocks
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '117_mobile_nuoc_day_trang_sach_bong.png'), fullPage: false });

  // Test 2: Cột sống - tong-quan-ve-cot-song -> Check "Tóm tắt cốt lõi" tab
  console.log('2. Testing /cot-song/tong-quan-ve-cot-song ...');
  await page.goto('http://localhost:3260/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on "Tóm tắt cốt lõi" tab
  const tomTatTab = page.locator('button:has-text("Tóm tắt cốt lõi")');
  if (await tomTatTab.isVisible()) {
    await tomTatTab.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '118_mobile_cot_song_tom_tat_chuan_tai_lieu.png'), fullPage: false });

  // Test 3: Dinh Dưỡng - tong-quan-dinh-duong-hoc -> Expand takeaway on video
  console.log('3. Testing /dinh-duong/tong-quan-dinh-duong-hoc ...');
  await page.goto('http://localhost:3260/dinh-duong/tong-quan-dinh-duong-hoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const ddRutRa = await page.locator('button:has-text("Rút ra")').all();
  if (ddRutRa.length > 0) {
    await ddRutRa[0].click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '119_mobile_dinh_duong_rut_ra_video.png'), fullPage: false });

  // Test 4: Cơ Thể Người - he-tuan-hoan-tim-mach -> Summary
  console.log('4. Testing /co-the-nguoi/he-tuan-hoan-tim-mach ...');
  await page.goto('http://localhost:3260/co-the-nguoi/he-tuan-hoan-tim-mach', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const ctTab = page.locator('button:has-text("Tóm tắt cốt lõi")');
  if (await ctTab.isVisible()) {
    await ctTab.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '120_mobile_co_the_nguoi_tom_tat_chuyen_sau.png'), fullPage: false });

  await browser.close();
  console.log('✅ QA Playwright Mobile completed successfully with corrected URLs!');
}

runQA();
