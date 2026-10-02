const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  // 1. Direct login via API
  console.log('Logging in via API...');
  const res = await page.request.post('http://127.0.0.1:3100/api/admin/login', {
    data: { password: 'Admin@2026!' },
  });
  console.log('Login status:', res.status());

  // 2. Go to Lesson Page
  console.log('Navigating to lesson page...');
  await page.goto('http://127.0.0.1:3100/cot-song/tong-quan-ve-cot-song', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Look for Edit button of first text block
  const editBtns = page.locator('button[title="Sửa nội dung khối"]');
  const count = await editBtns.count();
  console.log('Found edit buttons:', count);

  if (count > 0) {
    await editBtns.first().click();
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '385_qa_admin_edit_text_modal.png') });
    console.log('Took 385_qa_admin_edit_text_modal.png');

    // Click HTML mode button
    const htmlTab = page.locator('button:has-text("Mã HTML tùy biến")').first();
    if (await htmlTab.isVisible()) {
      await htmlTab.click();
      await page.waitForTimeout(600);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, '386_qa_admin_edit_html_mode.png') });
      console.log('Took 386_qa_admin_edit_html_mode.png');
    }
  }

  // Also check "Thêm khối"
  const addBtn = page.locator('button:has-text("Thêm khối")').first();
  if (await addBtn.isVisible()) {
    await addBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '384_qa_admin_add_block_drawer.png') });
    console.log('Took 384_qa_admin_add_block_drawer.png');
  }

  await browser.close();
  console.log('QA Admin Modal finished.');
})();
