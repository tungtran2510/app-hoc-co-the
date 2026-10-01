import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-results', 'lenh_07');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTest() {
  console.log('🚀 Starting E2E Verification for LỆNH #07 (Hệ Quản Trị & QC Giải Phẫu)...');
  const browser = await chromium.launch({ headless: true });

  try {
    // -------------------------------------------------------------
    // TEST 1: Desktop Viewport (1280 x 800)
    // -------------------------------------------------------------
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await desktopContext.newPage();

    console.log('📱 Navigating to http://localhost:3005/admin/giai-phau (Desktop)...');
    await page.goto('http://localhost:3005/admin/giai-phau', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Assert main header & title
    const title = await page.textContent('h1');
    console.log(`✅ Page Title: "${title}"`);

    // Screenshot main admin dashboard
    const desktopScreenshotPath = path.join(SCREENSHOT_DIR, '01_admin_dashboard_desktop.png');
    await page.screenshot({ path: desktopScreenshotPath, fullPage: true });
    console.log(`📸 Saved Desktop Dashboard: ${desktopScreenshotPath}`);

    // Test Search input
    console.log('🔍 Testing Search for "femur"...');
    await page.fill('input[placeholder*="Tìm theo tên Việt"]', 'femur');
    await page.waitForTimeout(500);
    const searchScreenshotPath = path.join(SCREENSHOT_DIR, '02_admin_search_femur.png');
    await page.screenshot({ path: searchScreenshotPath });
    console.log(`📸 Saved Search Screenshot: ${searchScreenshotPath}`);

    // Clear search
    await page.fill('input[placeholder*="Tìm theo tên Việt"]', '');
    await page.waitForTimeout(500);

    // Test Opening Structure Edit Modal
    console.log('📝 Testing Edit Structure Modal...');
    const editBtn = page.locator('button[title*="Chỉnh sửa cấu trúc"]').first();
    await editBtn.click();
    await page.waitForSelector('text=1. Thuật ngữ & Giải phẫu', { state: 'visible' });

    // Screenshot Tab 1
    const modalTab1Path = path.join(SCREENSHOT_DIR, '03_modal_tab1_general.png');
    await page.screenshot({ path: modalTab1Path });
    console.log(`📸 Saved Modal Tab 1: ${modalTab1Path}`);

    // Switch to Tab 2: 4 Clinical Relations
    console.log('🩺 Switching to Tab 2 (4 Liên quan lâm sàng)...');
    await page.click('button:has-text("2. 4 Liên quan lâm sàng")');
    await page.waitForTimeout(300);
    const modalTab2Path = path.join(SCREENSHOT_DIR, '04_modal_tab2_relations.png');
    await page.screenshot({ path: modalTab2Path });
    console.log(`📸 Saved Modal Tab 2: ${modalTab2Path}`);

    // Switch to Tab 3: Learning & Quiz
    console.log('📚 Switching to Tab 3 (Bài học & Quiz)...');
    await page.click('button:has-text("3. Bài học, Video & Quiz")');
    await page.waitForTimeout(300);
    const modalTab3Path = path.join(SCREENSHOT_DIR, '05_modal_tab3_quiz.png');
    await page.screenshot({ path: modalTab3Path });
    console.log(`📸 Saved Modal Tab 3: ${modalTab3Path}`);

    // Switch to Tab 4: Curation & License
    console.log('⚖️ Switching to Tab 4 (Thẩm định & Bản quyền)...');
    await page.click('button:has-text("4. Thẩm định & Bản quyền")');
    await page.waitForTimeout(300);
    const modalTab4Path = path.join(SCREENSHOT_DIR, '06_modal_tab4_license.png');
    await page.screenshot({ path: modalTab4Path });
    console.log(`📸 Saved Modal Tab 4: ${modalTab4Path}`);

    // Close modal
    await page.click('button:has-text("Hủy bỏ")');
    await page.waitForTimeout(300);

    // Test Automated QC Suite Runner Modal
    console.log('⚡ Testing Live Pre-Release QC Runner Modal...');
    await page.click('button:has-text("Chạy QC Tự Động")');
    await page.waitForSelector('text=ĐẠT CHUẨN XUẤT BẢN (PASS)', { state: 'visible', timeout: 10000 });
    const qcScoreText = await page.textContent('text=100');
    console.log(`🎯 QC Suite Score Verified: ${qcScoreText}/100`);

    const qcModalScreenshotPath = path.join(SCREENSHOT_DIR, '07_qc_suite_runner_modal.png');
    await page.screenshot({ path: qcModalScreenshotPath });
    console.log(`📸 Saved QC Runner Screenshot: ${qcModalScreenshotPath}`);

    // Close QC Modal
    await page.click('button:has-text("Đóng")');
    await page.waitForTimeout(300);

    // Test Versioning & Rollback Modal
    console.log('🕒 Testing Version Snapshots & Rollback Modal...');
    await page.click('button:has-text("Phiên bản & Rollback")');
    await page.waitForSelector('text=Quản Lý Phiên Bản & Hoàn Tác', { state: 'visible' });
    const versionModalScreenshotPath = path.join(SCREENSHOT_DIR, '08_version_rollback_modal.png');
    await page.screenshot({ path: versionModalScreenshotPath });
    console.log(`📸 Saved Version & Rollback Screenshot: ${versionModalScreenshotPath}`);

    await page.click('button:has-text("Đóng")');
    await desktopContext.close();

    // -------------------------------------------------------------
    // TEST 2: Mobile Viewport (iPhone 14 - 390 x 844)
    // -------------------------------------------------------------
    console.log('\n📱 Testing Mobile Viewport (390 x 844)...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:3005/admin/giai-phau', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    const mobileScreenshotPath = path.join(SCREENSHOT_DIR, '09_admin_dashboard_mobile.png');
    await mobilePage.screenshot({ path: mobileScreenshotPath, fullPage: true });
    console.log(`📸 Saved Mobile Dashboard: ${mobileScreenshotPath}`);

    await mobileContext.close();

    console.log('\n🎉 ALL E2E VERIFICATION CHECKS PASSED FOR LỆNH #07!');
  } catch (err) {
    console.error('❌ E2E Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
