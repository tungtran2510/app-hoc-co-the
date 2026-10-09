import { chromium } from 'playwright';
import path from 'path';

const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  const adminContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const adminPage = await adminContext.newPage();
  
  const loginRes = await adminPage.request.post('http://localhost:3270/api/admin/login', {
    data: {
      phone: '0974248716',
      password: 'Tung@2510',
    },
  });
  const loginData = await loginRes.json();

  await adminPage.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  if (loginData.token) {
    await adminPage.evaluate((t) => localStorage.setItem('app_admin_token', t), loginData.token);
    await adminPage.reload({ waitUntil: 'networkidle' });
  }

  // Cuộn thẳng tới section key="personalized_roadmap"
  const roadmapSection = await adminPage.$('section[key="personalized_roadmap"], section:has-text("ĐỊNH HƯỚNG LỘ TRÌNH")');
  if (roadmapSection) {
    await roadmapSection.scrollIntoViewIfNeeded();
    await adminPage.waitForTimeout(600);
    const shot = path.join(ARTIFACTS_DIR, '245_admin_roadmap_controls_bar.png');
    await adminPage.screenshot({ path: shot, fullPage: false });
    console.log(`Saved: ${shot}`);
  }

  // Cuộn thẳng tới section key="featured_lessons"
  const featuredSection = await adminPage.$('section[key="featured_lessons"], section:has-text("BÀI GIẢNG NỔI BẬT & ÔN TẬP")');
  if (featuredSection) {
    await featuredSection.scrollIntoViewIfNeeded();
    await adminPage.waitForTimeout(600);
    const shot = path.join(ARTIFACTS_DIR, '246_admin_featured_controls_bar.png');
    await adminPage.screenshot({ path: shot, fullPage: false });
    console.log(`Saved: ${shot}`);
  }

  await adminContext.close();
  await browser.close();
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
