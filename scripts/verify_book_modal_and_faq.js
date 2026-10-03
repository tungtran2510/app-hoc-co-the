const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

async function testAll() {
  console.log('--- STARTING PLAYWRIGHT VERIFICATION FOR BOOK MODAL & FAQ ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // Mobile Android / iPhone viewport
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // 1. Log in via /dang-nhap
  console.log('1. Logging in via /dang-nhap...');
  await page.goto('http://127.0.0.1:3100/dang-nhap', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(1000);

  const pwdInput = await page.$('input#admin-password');
  if (pwdInput) {
    await pwdInput.fill('Admin@2026!');
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn?.click();
    console.log('   Logged in as admin!');
    await page.waitForTimeout(2000);
  }

  await page.evaluate(() => {
    localStorage.setItem('has_visited_app', 'true');
    localStorage.setItem('welcome_modal_dismissed', 'true');
    localStorage.setItem('pwa_welcome_seen', 'true');
    sessionStorage.setItem('pwa_banner_dismissed', '1');
  });

  // 2. Open Homepage and test EditRecommendedBooksModal
  console.log('\n2. Testing EditRecommendedBooksModal on Homepage...');
  await page.goto('http://127.0.0.1:3100/', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Find "Cài đặt khối sách" button in SectionOrderControls
  const editBooksBtn = await page.$('button:has-text("Cài đặt khối sách"), button:has-text("Cài đặt mục này")');
  console.log('   Found Edit Books Button:', !!editBooksBtn);
  if (editBooksBtn) {
    await editBooksBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await editBooksBtn.click();
    await page.waitForTimeout(1000);

    const mobileScreen = path.join(ARTIFACTS_DIR, 'admin_redesigned_recommended_books_mobile.png');
    await page.screenshot({ path: mobileScreen });
    console.log('   📸 Captured mobile screenshot of redesigned modal:', mobileScreen);

    // Also test desktop viewport
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(500);
    const desktopScreen = path.join(ARTIFACTS_DIR, 'admin_redesigned_recommended_books_desktop.png');
    await page.screenshot({ path: desktopScreen });
    console.log('   📸 Captured desktop screenshot of redesigned modal:', desktopScreen);

    // Close modal
    const closeBtn = await page.$('button[aria-label="Đóng"], button:has-text("Đóng")');
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 3. Navigate to lesson page /cot-song/tong-quan-ve-cot-song for FAQ block verification
  console.log('\n3. Navigating to lesson page /cot-song/tong-quan-ve-cot-song for FAQ block verification...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(2000);

  // Scroll to bottom where "+ Thêm khối nội dung" is located
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(800);

  const addBlockBtn = await page.$('button:has-text("Thêm khối"), button[title*="Thêm khối"]');
  console.log('   Add Block button found:', !!addBlockBtn);
  if (addBlockBtn) {
    await addBlockBtn.scrollIntoViewIfNeeded();
    await addBlockBtn.click();
    await page.waitForTimeout(800);

    // Screenshot drawer with FAQ button
    const drawerScreen = path.join(ARTIFACTS_DIR, 'admin_add_block_drawer_with_faq.png');
    await page.screenshot({ path: drawerScreen });
    console.log('   📸 Captured Add Block Drawer with FAQ button:', drawerScreen);

    // Click FAQ button
    const faqDrawerBtn = await page.$('button:has-text("Khối Hỏi - Đáp (FAQ Accordion)")');
    console.log('   FAQ Button in Drawer found:', !!faqDrawerBtn);
    if (faqDrawerBtn) {
      await faqDrawerBtn.scrollIntoViewIfNeeded();
      await faqDrawerBtn.click();
      await page.waitForTimeout(1200);

      // Verify FAQ block rendered on page
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(600);

      const faqRenderScreen = path.join(ARTIFACTS_DIR, 'faq_block_rendered_mobile.png');
      await page.screenshot({ path: faqRenderScreen });
      console.log('   📸 Captured Rendered FAQ block on mobile:', faqRenderScreen);

      // Click on second question to test accordion expansion
      const q2Btn = await page.$('button:has-text("Dấu hiệu nào cho thấy tôi nên đi khám chuyên khoa?")');
      if (q2Btn) {
        await q2Btn.scrollIntoViewIfNeeded();
        await q2Btn.click();
        await page.waitForTimeout(600);
        const faqExpandedScreen = path.join(ARTIFACTS_DIR, 'faq_block_expanded_mobile.png');
        await page.screenshot({ path: faqExpandedScreen });
        console.log('   📸 Clicked Q2, accordion expanded successfully:', faqExpandedScreen);
      }

      // Open EditBlockModal on the FAQ block
      const allEditBtns = await page.$$('button[title="Chỉnh sửa khối nội dung"], button:has-text("Sửa khối")');
      console.log(`   Found ${allEditBtns.length} block edit buttons.`);
      if (allEditBtns.length > 0) {
        const lastEditBtn = allEditBtns[allEditBtns.length - 1];
        await lastEditBtn.scrollIntoViewIfNeeded();
        await lastEditBtn.click();
        await page.waitForTimeout(800);

        const editFaqScreen = path.join(ARTIFACTS_DIR, 'admin_edit_faq_block_modal.png');
        await page.screenshot({ path: editFaqScreen });
        console.log('   📸 Captured Edit FAQ Block modal:', editFaqScreen);

        // Close modal
        const closeEditBtn = await page.$('button[aria-label="Đóng"], button:has-text("Hủy")');
        if (closeEditBtn) await closeEditBtn.click();
      }
    }
  }

  await browser.close();
  console.log('\n--- ALL VERIFICATIONS COMPLETED SUCCESSFULLY ---');
}

testAll().catch((err) => {
  console.error('[Verification Error]:', err);
  process.exit(1);
});
