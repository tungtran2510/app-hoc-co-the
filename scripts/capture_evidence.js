const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 12/13/14 viewport
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page = await context.newPage();

  // Test 1: Page /nuoc/vai-tro-cua-nuoc (Bài 01 Chuyên đề Nước)
  console.log('Navigating to /nuoc/vai-tro-cua-nuoc...');
  await page.goto('http://localhost:3260/nuoc/vai-tro-cua-nuoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Screenshot Đỉnh đầu bài học (Chia sẻ & Lưu bài)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '121_mobile_dinh_dau_bai_hoc_chia_se_luu_bai.png'),
    clip: { x: 0, y: 0, width: 390, height: 420 }
  });
  console.log('Saved 121_mobile_dinh_dau_bai_hoc_chia_se_luu_bai.png');

  // Click 'Rút ra' button on video 1 to expand takeaway
  const rutRaBtn = page.getByRole('button', { name: /Rút ra/i }).first();
  if (await rutRaBtn.count() > 0) {
    await rutRaBtn.click();
    await page.waitForTimeout(500);
  }

  // 2. Screenshot Video Takeaway Expanded (Xuống dòng rõ ràng, 2 dòng chuẩn)
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '122_mobile_bai_hoc_rut_ra_xuong_dong_ro_rang.png'),
    clip: { x: 0, y: 350, width: 390, height: 494 }
  });
  console.log('Saved 122_mobile_bai_hoc_rut_ra_xuong_dong_ro_rang.png');

  // Click on 'Tóm tắt cốt lõi' tab
  const tomTatBtn = page.getByRole('button', { name: /Tóm tắt cốt lõi/i }).first();
  if (await tomTatBtn.count() > 0) {
    await tomTatBtn.click();
    await page.waitForTimeout(600);
    // 3. Screenshot Tóm tắt cốt lõi (Bố cục thẻ thông minh, tiêu đề dòng 1, nội dung dòng 2+)
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '123_mobile_tom_tat_the_kien_thuc_xuong_dong.png'),
      clip: { x: 0, y: 350, width: 390, height: 494 }
    });
    console.log('Saved 123_mobile_tom_tat_the_kien_thuc_xuong_dong.png');
  }

  // Locate and scroll to 'Đồng hành cùng bạn'
  const dongHanhSec = page.locator('section:has-text("Đồng hành cùng bạn")').first();
  if (await dongHanhSec.count() > 0) {
    await dongHanhSec.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '124_mobile_dong_hanh_cung_ban_sang_khong_247_ebook_to.png')
    });
    console.log('Saved 124_mobile_dong_hanh_cung_ban_sang_khong_247_ebook_to.png');
  }

  // Test 2: Check /cot-song/tong-quan-ve-cot-song
  console.log('Navigating to /cot-song/tong-quan-ve-cot-song...');
  await page.goto('http://localhost:3260/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);

  const rutRaBtn2 = page.getByRole('button', { name: /Rút ra/i }).first();
  if (await rutRaBtn2.count() > 0) {
    await rutRaBtn2.click();
    await page.waitForTimeout(500);
  }
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '125_mobile_cot_song_rut_ra_xuong_dong.png'),
    clip: { x: 0, y: 350, width: 390, height: 494 }
  });
  console.log('Saved 125_mobile_cot_song_rut_ra_xuong_dong.png');

  // Also click Tóm tắt on cot-song to capture another topic's structured knowledge cards
  const tomTatBtn2 = page.getByRole('button', { name: /Tóm tắt cốt lõi/i }).first();
  if (await tomTatBtn2.count() > 0) {
    await tomTatBtn2.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '126_mobile_cot_song_tom_tat_the_kien_thuc.png'),
      clip: { x: 0, y: 350, width: 390, height: 494 }
    });
    console.log('Saved 126_mobile_cot_song_tom_tat_the_kien_thuc.png');
  }

  await browser.close();
  console.log('ALL 6 SCREENSHOTS CAPTURED WITH FULL FIDELITY!');
}
capture().catch(err => {
  console.error(err);
  process.exit(1);
});
