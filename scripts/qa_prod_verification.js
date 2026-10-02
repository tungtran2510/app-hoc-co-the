const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f';
const BASE_URL = 'http://127.0.0.1:3100';

async function run() {
  const browser = await chromium.launch({ headless: true });

  // 1. Mobile iPhone 14 Pro Viewport (390 x 844)
  console.log('Testing Mobile...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  // Chụp Header trang chủ mobile (hiển thị 1 icon chuông duy nhất cạnh tên)
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, '346_qa_prod_mobile_header_clean_bell.png'),
    clip: { x: 0, y: 0, width: 390, height: 260 },
  });
  console.log('Saved: 346_qa_prod_mobile_header_clean_bell.png');

  // Vào bài học xem khối sách da sang trọng
  await mobilePage.goto(`${BASE_URL}/cot-song/tu-the-va-van-dong?v=1`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1500);

  // Cuộn tới khối sách lật
  const bookSection = await mobilePage.$('section.group\\/book');
  if (bookSection) {
    await bookSection.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(1000);
    await bookSection.screenshot({
      path: path.join(ARTIFACT_DIR, '347_qa_prod_mobile_luxury_book_casing.png'),
    });
    console.log('Saved: 347_qa_prod_mobile_luxury_book_casing.png');
  }

  // Chụp toàn màn hình bài học mobile
  await mobilePage.screenshot({
    path: path.join(ARTIFACT_DIR, '348_qa_prod_mobile_lesson_full.png'),
  });
  console.log('Saved: 348_qa_prod_mobile_lesson_full.png');

  await mobileContext.close();

  // 2. iPad Viewport (820 x 1180)
  console.log('Testing iPad (820px)...');
  const ipadContext = await browser.newContext({
    viewport: { width: 820, height: 1180 },
    deviceScaleFactor: 2,
  });
  const ipadPage = await ipadContext.newPage();
  await ipadPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await ipadPage.waitForTimeout(1000);

  await ipadPage.screenshot({
    path: path.join(ARTIFACT_DIR, '349_qa_prod_ipad_home_820px.png'),
  });
  console.log('Saved: 349_qa_prod_ipad_home_820px.png');

  await ipadPage.goto(`${BASE_URL}/cot-song/tu-the-va-van-dong?v=1`, { waitUntil: 'domcontentloaded' });
  await ipadPage.waitForTimeout(1500);

  const ipadBookSection = await ipadPage.$('section.group\\/book');
  if (ipadBookSection) {
    await ipadBookSection.scrollIntoViewIfNeeded();
    await ipadPage.waitForTimeout(1000);
  }

  await ipadPage.screenshot({
    path: path.join(ARTIFACT_DIR, '350_qa_prod_ipad_lesson_820px.png'),
  });
  console.log('Saved: 350_qa_prod_ipad_lesson_820px.png');

  await ipadContext.close();

  // 3. PC Desktop Viewport (1440 x 900)
  console.log('Testing PC (1440px)...');
  const pcContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const pcPage = await pcContext.newPage();
  await pcPage.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  await pcPage.waitForTimeout(1000);

  await pcPage.screenshot({
    path: path.join(ARTIFACT_DIR, '351_qa_prod_pc_home_matching_ipad.png'),
  });
  console.log('Saved: 351_qa_prod_pc_home_matching_ipad.png');

  await pcPage.goto(`${BASE_URL}/cot-song/tu-the-va-van-dong?v=1`, { waitUntil: 'domcontentloaded' });
  await pcPage.waitForTimeout(1500);

  const pcBookSection = await pcPage.$('section.group\\/book');
  if (pcBookSection) {
    await pcBookSection.scrollIntoViewIfNeeded();
    await pcPage.waitForTimeout(1000);
  }

  await pcPage.screenshot({
    path: path.join(ARTIFACT_DIR, '352_qa_prod_pc_lesson_matching_ipad.png'),
  });
  console.log('Saved: 352_qa_prod_pc_lesson_matching_ipad.png');

  await pcContext.close();
  await browser.close();

  console.log('ALL_QA_PASSED');
}

run().catch(err => {
  console.error('QA Error:', err);
  process.exit(1);
});
