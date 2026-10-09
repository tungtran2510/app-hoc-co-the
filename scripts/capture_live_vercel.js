const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function captureLive() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });

  // 1. Visit Live production
  console.log('Navigating to Live production: https://app-hoc-co-the.vercel.app/nuoc/vai-tro-cua-nuoc');
  await page.goto('https://app-hoc-co-the.vercel.app/nuoc/vai-tro-cua-nuoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Screenshot 131: Live top bar
  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '131_live_vercel_nuoc_top_chia_se_luu_bai.png'),
    clip: { x: 0, y: 0, width: 390, height: 420 }
  });
  console.log('Saved 131_live_vercel_nuoc_top_chia_se_luu_bai.png');

  // Click Rút ra on video 1
  const btnNuoc = page.locator('button[title="Xem bài học rút ra"]').first();
  if (await btnNuoc.count() > 0) {
    await btnNuoc.click();
    await page.waitForTimeout(600);
    // Screenshot 132: Live takeaway expanded
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '132_live_vercel_nuoc_takeaway_expanded.png'),
      clip: { x: 0, y: 340, width: 390, height: 490 }
    });
    console.log('Saved 132_live_vercel_nuoc_takeaway_expanded.png');
  }

  // Click Tóm tắt cốt lõi
  const tomTatNuoc = page.locator('button', { hasText: 'Tóm tắt cốt lõi' }).first();
  if (await tomTatNuoc.count() > 0) {
    await tomTatNuoc.click();
    await page.waitForTimeout(600);
    // Screenshot 133: Live knowledge card
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '133_live_vercel_nuoc_tom_tat_the_kien_thuc.png'),
      clip: { x: 0, y: 340, width: 390, height: 490 }
    });
    console.log('Saved 133_live_vercel_nuoc_tom_tat_the_kien_thuc.png');
  }

  // Visit cot-song to test companion box
  console.log('Navigating to Live production: https://app-hoc-co-the.vercel.app/cot-song/tong-quan-ve-cot-song');
  await page.goto('https://app-hoc-co-the.vercel.app/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const dongHanh = page.locator('text=Đồng hành cùng bạn').first();
  if (await dongHanh.count() > 0) {
    await dongHanh.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    // Screenshot 134: Live companion box
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '134_live_vercel_cot_song_dong_hanh_cung_ban_sang_ebook_to.png')
    });
    console.log('Saved 134_live_vercel_cot_song_dong_hanh_cung_ban_sang_ebook_to.png');
  }

  await browser.close();
  console.log('DONE ALL LIVE PRODUCTION SCREENSHOTS!');
}
captureLive().catch(err => {
  console.error(err);
  process.exit(1);
});
