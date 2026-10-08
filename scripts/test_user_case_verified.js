const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  console.log('--- TEST STEP 1: INITIAL STATE (User previously listened to He Tieu Hoa) ---');
  await page.goto('http://localhost:3270', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('xem_tiep', JSON.stringify({
      topic_slug: 'tieu-hoa',
      topic_title: 'Hệ Tiêu Hóa',
      page_slug: 'giai-phau-ong-tieu-hoa',
      page_title: 'Giải phẫu ống tiêu hóa',
      page_number: 1,
      video_index: 1,
      video_total: 4,
      video_title: '01. Đại cương giải phẫu ống tiêu hóa',
      cover_url: '/images/lessons/giai-phau-ong-tieu-hoa.png',
      updated_at: Date.now() - 3600000,
    }));
  });

  // Reload Home to verify initial state shows He Tieu Hoa
  await page.goto('http://localhost:3270', { waitUntil: 'networkidle' });
  const initialCard = page.locator('a[aria-label^="Xem tiếp"]');
  await initialCard.scrollIntoViewIfNeeded();
  const initialCardLabel = await initialCard.getAttribute('aria-label');
  console.log('Initial Home card label:', initialCardLabel);

  console.log('\n--- TEST STEP 2: USER GOES TO LISTEN TO ANOTHER LESSON (Cot Song -> Than Kinh) ---');
  await page.goto('http://localhost:3270/cot-song/than-kinh', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Check that xem_tiep was immediately updated to Than Kinh!
  const lessonLs = await page.evaluate(() => localStorage.getItem('xem_tiep'));
  const parsedLesson = JSON.parse(lessonLs || '{}');
  console.log('Lesson page immediate recorded xem_tiep:', {
    topic: parsedLesson.topic_title,
    page: parsedLesson.page_title,
    video: parsedLesson.video_title,
  });

  console.log('\n--- TEST STEP 3: USER CLICKS HOME BUTTON (🏠) IN HEADER ---');
  const homeBtn = page.locator('a[title="Về Trang chủ"]');
  await homeBtn.click();
  await page.waitForTimeout(1200);

  // Verify we are back on Home
  console.log('Current URL after clicking Home:', page.url());

  // Check what is displayed in the "Đang học dở" section
  const homeLs = await page.evaluate(() => localStorage.getItem('xem_tiep'));
  const parsedHome = JSON.parse(homeLs || '{}');
  console.log('Back on Home, localStorage recorded:', {
    topic: parsedHome.topic_title,
    page: parsedHome.page_title,
    video: parsedHome.video_title,
  });

  const finalCard = page.locator('a[aria-label^="Xem tiếp"]');
  await finalCard.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);

  const finalCardLabel = await finalCard.getAttribute('aria-label');
  console.log('Back on Home, ContinueCard aria-label:', finalCardLabel);

  const cardText = await finalCard.innerText();
  console.log('Back on Home, ContinueCard innerText:\n', cardText);

  // Capture screenshot of Home screen focused on the updated ContinueCard
  const screenshotPath1 = path.join(ARTIFACT_DIR, '156_mobile_test_continue_learning_sync.png');
  await page.screenshot({ path: screenshotPath1, fullPage: false });
  console.log('Saved screenshot 1:', screenshotPath1);

  console.log('\n--- TEST STEP 4: CLICK ON THE CARD TO VERIFY NAVIGATION BACK TO LESSON ---');
  await finalCard.click();
  await page.waitForTimeout(1500);

  console.log('Navigated back to lesson URL:', page.url());
  const screenshotPath2 = path.join(ARTIFACT_DIR, '157_mobile_test_continue_navigated_back.png');
  await page.screenshot({ path: screenshotPath2, fullPage: false });
  console.log('Saved screenshot 2:', screenshotPath2);

  // Assertion
  if (parsedHome.page_slug === 'than-kinh' && finalCardLabel.includes('rễ thần kinh')) {
    console.log('\n>>> SUCCESS: BUG RESOLVED 100%! "Đang học dở" perfectly displays the lesson currently being listened to! <<<');
  } else {
    console.error('\n>>> FAILED: Old lesson still displayed! <<<');
    process.exit(1);
  }

  await browser.close();
})();
