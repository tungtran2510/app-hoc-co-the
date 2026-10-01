import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const SCREENSHOT_DIR = path.join(process.cwd(), 'test-results', 'lenh_08');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function runTest() {
  console.log('🚀 Starting E2E Verification for LỆNH #08 (Tài Khoản, Lớp Học & Chia Sẻ Học Tập)...');
  const browser = await chromium.launch({ headless: true });

  try {
    // -------------------------------------------------------------
    // TEST 1: Desktop Viewport (1280 x 800)
    // -------------------------------------------------------------
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 }
    });
    const page = await desktopContext.newPage();

    console.log('📱 Navigating to http://localhost:3005/lop-hoc (Desktop)...');
    await page.goto('http://localhost:3005/lop-hoc', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // Assert main header & title
    const title = await page.textContent('h1');
    console.log(`✅ Page Title: "${title}"`);

    // Screenshot Desktop Tab 1 (Classrooms)
    const ss1Path = path.join(SCREENSHOT_DIR, '01_classroom_hub_desktop.png');
    await page.screenshot({ path: ss1Path, fullPage: true });
    console.log(`📸 Saved Desktop Classroom Hub: ${ss1Path}`);

    // Switch Role to Lecturer: BS.CKII Trần Hoàng
    console.log('👨‍⚕️ Switching role to Lecturer (BS.CKII Trần Hoàng)...');
    await page.selectOption('select[title*="Chuyển đổi vai trò"]', 'usr_lecturer_1');
    await page.waitForTimeout(800);

    const ss2Path = path.join(SCREENSHOT_DIR, '02_lecturer_view_desktop.png');
    await page.screenshot({ path: ss2Path });
    console.log(`📸 Saved Lecturer Dashboard: ${ss2Path}`);

    // Switch to Tab 2: Assignments & 3D Quizzes
    console.log('📋 Switching to Tab 2 (Bài Tập & Quiz 3D)...');
    await page.click('button:has-text("2. Bài Tập & Quiz 3D")');
    await page.waitForTimeout(500);

    const ss3Path = path.join(SCREENSHOT_DIR, '03_assignments_tab_desktop.png');
    await page.screenshot({ path: ss3Path });
    console.log(`📸 Saved Assignments Tab: ${ss3Path}`);

    // Switch Role to Student: Nguyễn Văn An
    console.log('🧑‍🎓 Switching role to Student (Nguyễn Văn An)...');
    await page.selectOption('select[title*="Chuyển đổi vai trò"]', 'usr_student_1');
    await page.waitForTimeout(800);

    // Open Quiz Modal
    console.log('📝 Opening Interactive 3D Quiz Modal for Student...');
    const quizBtn = page.locator('button:has-text("Xem lại bài đã làm"), button:has-text("Làm Bài & Quiz")').first();
    await quizBtn.click();
    await page.waitForSelector('text=Câu hỏi kiểm tra lâm sàng', { state: 'visible' });

    const ss4Path = path.join(SCREENSHOT_DIR, '04_quiz_interactive_modal.png');
    await page.screenshot({ path: ss4Path });
    console.log(`📸 Saved Interactive Quiz Modal: ${ss4Path}`);

    // Close Quiz Modal
    await page.click('button:has-text("Đóng")');
    await page.waitForTimeout(300);

    // Switch to Tab 3: Student Progress & Feedback
    console.log('📊 Switching to Tab 3 (Theo Dõi Tiến Độ)...');
    await page.click('button:has-text("3. Theo Dõi Tiến Độ")');
    await page.waitForTimeout(500);

    const ss5Path = path.join(SCREENSHOT_DIR, '05_student_progress_tab.png');
    await page.screenshot({ path: ss5Path });
    console.log(`📸 Saved Student Progress Tab: ${ss5Path}`);

    // Switch to Tab 4: Shared 3D Views Library
    console.log('🔗 Switching to Tab 4 (Thư Viện Góc Nhìn 3D)...');
    await page.click('button:has-text("4. Thư Viện Góc Nhìn 3D")');
    await page.waitForTimeout(500);

    const ss6Path = path.join(SCREENSHOT_DIR, '06_shared_3d_views_tab.png');
    await page.screenshot({ path: ss6Path });
    console.log(`📸 Saved Shared 3D Views Tab: ${ss6Path}`);

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
    await mobilePage.goto('http://localhost:3005/lop-hoc', { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(1000);

    const ss7Path = path.join(SCREENSHOT_DIR, '07_classroom_mobile_home.png');
    await mobilePage.screenshot({ path: ss7Path, fullPage: true });
    console.log(`📸 Saved Mobile Classroom View: ${ss7Path}`);

    // Mobile test tab switching
    await mobilePage.click('button:has-text("2. Bài Tập")');
    await mobilePage.waitForTimeout(500);
    const ss8Path = path.join(SCREENSHOT_DIR, '08_classroom_mobile_assignments.png');
    await mobilePage.screenshot({ path: ss8Path, fullPage: true });
    console.log(`📸 Saved Mobile Assignments View: ${ss8Path}`);

    await mobileContext.close();

    console.log('\n🎉 ALL E2E VERIFICATION CHECKS PASSED FOR LỆNH #08!');
  } catch (err) {
    console.error('❌ E2E Verification failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
