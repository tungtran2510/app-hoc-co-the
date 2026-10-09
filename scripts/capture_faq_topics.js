const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2
  });

  // 1. Test /cot-song FAQ tab
  console.log('Navigating to /cot-song...');
  await page.goto('http://localhost:3260/cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on "Vấn đề thường gặp" tab
  const faqTab = page.locator('button[role="tab"]').filter({ hasText: 'Vấn đề thường gặp' });
  await faqTab.click();
  await page.waitForTimeout(600);

  // Scroll a bit so the categories are nicely centered
  await page.evaluate(() => window.scrollBy(0, 220));
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '143_mobile_cot_song_faqs_tab.png')
  });
  console.log('Saved 143_mobile_cot_song_faqs_tab.png');

  // Open the first question in Mục 1
  const firstQuestion = page.locator('button[aria-expanded]').first();
  await firstQuestion.click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '144_mobile_cot_song_faq_expanded.png')
  });
  console.log('Saved 144_mobile_cot_song_faq_expanded.png');

  // 2. Test /nuoc FAQ tab
  console.log('Navigating to /nuoc...');
  await page.goto('http://localhost:3260/nuoc', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const faqTabNuoc = page.locator('button[role="tab"]').filter({ hasText: 'Vấn đề thường gặp' });
  await faqTabNuoc.click();
  await page.waitForTimeout(600);

  await page.evaluate(() => window.scrollBy(0, 220));
  await page.waitForTimeout(500);

  // Open the first question
  const firstQuestionNuoc = page.locator('button[aria-expanded]').first();
  await firstQuestionNuoc.click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '145_mobile_nuoc_faq_expanded.png')
  });
  console.log('Saved 145_mobile_nuoc_faq_expanded.png');

  // 3. Test /dinh-duong FAQ tab
  console.log('Navigating to /dinh-duong...');
  await page.goto('http://localhost:3260/dinh-duong', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const faqTabDD = page.locator('button[role="tab"]').filter({ hasText: 'Vấn đề thường gặp' });
  await faqTabDD.click();
  await page.waitForTimeout(600);

  await page.evaluate(() => window.scrollBy(0, 220));
  await page.waitForTimeout(500);

  const firstQuestionDD = page.locator('button[aria-expanded]').first();
  await firstQuestionDD.click();
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(ARTIFACT_DIR, '146_mobile_dinh_duong_faq_expanded.png')
  });
  console.log('Saved 146_mobile_dinh_duong_faq_expanded.png');

  await browser.close();
  console.log('ALL FAQ CAPTURES COMPLETED SUCCESSFULLY!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
