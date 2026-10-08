const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function testClick() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });
  await page.goto('http://localhost:3260/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click Rút ra on video 1
  const btn = page.locator('button[title="Xem bài học rút ra"]').first();
  console.log('Button count:', await btn.count());
  if (await btn.count() > 0) {
    await btn.click();
    await page.waitForTimeout(600);
    // Screenshot takeaway expanded
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '127_mobile_takeaway_expanded_verified.png'),
      clip: { x: 0, y: 340, width: 390, height: 490 }
    });
    console.log('Saved 127_mobile_takeaway_expanded_verified.png');
  }

  // Scroll to 'Đồng hành cùng bạn'
  const dongHanh = page.locator('text=Đồng hành cùng bạn').first();
  console.log('Dong Hanh count:', await dongHanh.count());
  if (await dongHanh.count() > 0) {
    await dongHanh.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    // Capture the bottom section
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '128_mobile_dong_hanh_cung_ban_verified.png')
    });
    console.log('Saved 128_mobile_dong_hanh_cung_ban_verified.png');
  }

  // Also test /nuoc/vai-tro-cua-nuoc
  await page.goto('http://localhost:3260/nuoc/vai-tro-cua-nuoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const btnNuoc = page.locator('button[title="Xem bài học rút ra"]').first();
  if (await btnNuoc.count() > 0) {
    await btnNuoc.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '129_mobile_nuoc_takeaway_expanded.png'),
      clip: { x: 0, y: 340, width: 390, height: 490 }
    });
    console.log('Saved 129_mobile_nuoc_takeaway_expanded.png');
  }

  // Also click Tom tat on nuoc
  const tomTatNuoc = page.locator('button', { hasText: 'Tóm tắt cốt lõi' }).first();
  if (await tomTatNuoc.count() > 0) {
    await tomTatNuoc.click();
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, '130_mobile_nuoc_tom_tat_the_kien_thuc.png'),
      clip: { x: 0, y: 340, width: 390, height: 490 }
    });
    console.log('Saved 130_mobile_nuoc_tom_tat_the_kien_thuc.png');
  }

  await browser.close();
  console.log('DONE ALL VERIFICATIONS!');
}
testClick().catch(err => {
  console.error(err);
  process.exit(1);
});
