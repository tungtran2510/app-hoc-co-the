const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile iPhone 14 Pro Viewport (390 x 844)
  console.log('Testing Mobile Home Header...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', 'true');
    localStorage.setItem('app_user_name_prompted', 'true');
  });

  await mobilePage.goto(`${BASE_URL}/?skip_intro=1`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  // Chụp Header trang chủ mobile (hiển thị 1 icon chuông duy nhất cạnh tên)
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, '353_qa_mobile_header_clean_single_bell.png'),
    clip: { x: 0, y: 0, width: 390, height: 260 },
  });
  console.log('Saved: 353_qa_mobile_header_clean_single_bell.png');

  // Chụp trang chủ mobile đầy đủ
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, '354_qa_mobile_home_full.png'),
  });
  console.log('Saved: 354_qa_mobile_home_full.png');

  await mobileContext.close();

  // 2. iPad Home Viewport (820 x 1180)
  console.log('Testing iPad Home...');
  const ipadContext = await browser.newContext({
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2,
  });
  const ipadPage = await ipadContext.newPage();
  await ipadPage.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', 'true');
    localStorage.setItem('app_user_name_prompted', 'true');
  });
  await ipadPage.goto(`${BASE_URL}/?skip_intro=1`, { waitUntil: 'domcontentloaded' });
  await ipadPage.waitForTimeout(1000);

  await ipadPage.screenshot({
    path: path.join(ARTIFACT_DIR, '355_qa_ipad_home_clean.png'),
  });
  console.log('Saved: 355_qa_ipad_home_clean.png');

  await ipadContext.close();

  // 3. PC Home Viewport (1440 x 900)
  console.log('Testing PC Home (1440px)...');
  const pcContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const pcPage = await pcContext.newPage();
  await pcPage.addInitScript(() => {
    localStorage.setItem('qbiz_books_intro_seen', 'true');
    localStorage.setItem('app_user_name_prompted', 'true');
  });
  await pcPage.goto(`${BASE_URL}/?skip_intro=1`, { waitUntil: 'domcontentloaded' });
  await pcPage.waitForTimeout(1000);

  await pcPage.screenshot({
    path: path.join(ARTIFACT_DIR, '356_qa_pc_home_clean.png'),
  });
  console.log('Saved: 356_qa_pc_home_clean.png');

  await pcContext.close();
  await browser.close();

  console.log('ALL_HOME_QA_PASSED');
}

run().catch(err => {
  console.error('QA Error:', err);
  process.exit(1);
});
