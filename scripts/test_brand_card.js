const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });

  const page = await context.newPage();

  console.log('1. Navigating to login page...');
  await page.goto('http://localhost:3100/dang-nhap', { waitUntil: 'networkidle' });

  console.log('2. Logging in as admin...');
  await page.fill('input[type="password"]', 'Admin@2026!');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(1500);

  console.log('3. Navigating to homepage...');
  await page.goto('http://localhost:3100/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  // Take screenshot of initial state
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '440_qa_brand_card_before.png') });
  console.log('Initial screenshot saved.');

  // Click on "Sửa thương hiệu" button
  console.log('4. Opening EditAppModal via "Sửa thương hiệu"...');
  const editBrandBtn = page.locator('button:has-text("Sửa thương hiệu")').first();
  if (await editBrandBtn.isVisible()) {
    await editBrandBtn.click();
  } else {
    // Or via top header button "Đổi tên"
    await page.locator('button:has-text("Đổi tên")').first().click();
  }

  await page.waitForTimeout(800);

  // Take screenshot of modal with new inputs
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '441_qa_edit_app_modal_open.png') });
  console.log('Modal opened screenshot saved.');

  // Verify inputs
  const nameInput = page.locator('input[placeholder*="Ví dụ: Học Cơ Thể"]');
  const taglineInput = page.locator('input[placeholder*="VD: EMPOWERING MEDICAL KNOWLEDGE"]');
  const subtitleInput = page.locator('input[placeholder*="VD: Kiến thức đúng"]');

  console.log('Tagline input visible:', await taglineInput.isVisible());
  console.log('Subtitle input visible:', await subtitleInput.isVisible());

  // TEST SCENARIO 1: Clear subtitle and tagline completely!
  console.log('5. Testing deletion (clearing subtitle and tagline)...');
  await subtitleInput.fill('');
  await taglineInput.fill('');
  
  // Submit form
  await page.locator('button[type="submit"]:has-text("Lưu cài đặt")').click();
  await page.waitForTimeout(2000);

  // Verify on homepage that old texts are GONE
  const cardText = await page.locator('section').filter({ hasText: 'THƯƠNG HIỆU & GIỚI THIỆU' }).innerText();
  console.log('Brand card text after clearing:', cardText);

  const hasOldSubtitle = cardText.includes('Kiến thức đúng · Sức khỏe bền vững');
  const hasFallbackSubtitle = cardText.includes('Advanced Anatomy & Health');
  const hasOldTagline = cardText.includes('EMPOWERING MEDICAL KNOWLEDGE');

  console.log('Has old subtitle:', hasOldSubtitle);
  console.log('Has fallback subtitle:', hasFallbackSubtitle);
  console.log('Has old tagline:', hasOldTagline);

  if (hasOldSubtitle || hasFallbackSubtitle || hasOldTagline) {
    throw new Error('FAIL: Cleared texts still appear on homepage!');
  }

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '442_qa_brand_card_cleared.png') });
  console.log('Cleared screenshot saved: SUCCESS!');

  // TEST SCENARIO 2: Reload page to verify persistence from Supabase
  console.log('6. Reloading page to test persistence...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const reloadedCardText = await page.locator('section').filter({ hasText: 'THƯƠNG HIỆU & GIỚI THIỆU' }).innerText();
  if (reloadedCardText.includes('Kiến thức đúng · Sức khỏe bền vững') || reloadedCardText.includes('Advanced Anatomy & Health')) {
    throw new Error('FAIL: Persistence failed, old text returned after reload!');
  }
  console.log('Persistence verified: SUCCESS!');

  // TEST SCENARIO 3: Custom texts
  console.log('7. Testing custom subtitle and tagline...');
  const editBtn2 = page.locator('button:has-text("Sửa thương hiệu")').first();
  await editBtn2.click();
  await page.waitForTimeout(800);

  const taglineInput2 = page.locator('input[placeholder*="VD: EMPOWERING MEDICAL KNOWLEDGE"]');
  const subtitleInput2 = page.locator('input[placeholder*="VD: Kiến thức đúng"]');

  await taglineInput2.fill('THƯ VIỆN Y KHOA ĐẠI CƯƠNG');
  await subtitleInput2.fill('Chăm sóc cột sống & Nuôi dưỡng cơ thể');

  await page.locator('button[type="submit"]:has-text("Lưu cài đặt")').click();
  await page.waitForTimeout(2000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, '443_qa_brand_card_custom_texts.png') });
  
  const customCardText = await page.locator('section').filter({ hasText: 'THƯƠNG HIỆU & GIỚI THIỆU' }).innerText();
  console.log('Brand card with custom texts:', customCardText);

  if (!customCardText.includes('THƯ VIỆN Y KHOA ĐẠI CƯƠNG') || !customCardText.includes('Chăm sóc cột sống & Nuôi dưỡng cơ thể')) {
    throw new Error('FAIL: Custom texts not displayed!');
  }

  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
}

run().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
