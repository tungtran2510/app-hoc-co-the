const { chromium } = require('playwright');
const path = require('path');

const ARTIFACTS_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Đăng nhập
  await page.goto('http://127.0.0.1:3100/dang-nhap', { waitUntil: 'domcontentloaded' });
  const pwdInput = await page.$('input#admin-password');
  if (pwdInput) {
    await pwdInput.fill('Admin@2026!');
    const submitBtn = await page.$('button[type="submit"]');
    await submitBtn?.click();
    await page.waitForTimeout(2000);
  }

  await page.goto('http://127.0.0.1:3100', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // Cuộn tới danh sách chuyên đề
  await page.evaluate(() => {
    const el = document.querySelector('button[title="Sửa chủ đề"]');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await page.waitForTimeout(1000);

  const editTopicBtn = await page.$('button[title="Sửa chủ đề"]');
  if (editTopicBtn) {
    await editTopicBtn.click();
    await page.waitForTimeout(1500);

    const outPath = path.join(ARTIFACTS_DIR, 'admin_audit_03_edit_topic_modal_verified.png');
    await page.screenshot({ path: outPath });
    console.log('Đã chụp EditTopicModal:', outPath);
  } else {
    console.log('Không tìm thấy nút Sửa chủ đề');
  }

  await browser.close();
})();
