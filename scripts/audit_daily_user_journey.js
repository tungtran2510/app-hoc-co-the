const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });

  const page = await context.newPage();

  // 1. Visit Home (with learning state)
  await page.goto('http://localhost:3270/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('xem_tiep', JSON.stringify({
      topic_slug: 'cot-song',
      topic_title: 'Cột Sống & Tư Thế',
      page_slug: 'dia-dem-va-giam-xoc',
      page_title: 'Đĩa đệm và cơ chế giảm xóc',
      page_number: 2,
      video_index: 1,
      video_total: 1,
      video_title: '02 - Đĩa đệm và cơ chế giảm xóc',
      cover_url: '/images/lessons/tong-quan-ve-cot-song.png',
      updated_at: Date.now()
    }));
  });
  await page.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Capture full home page scrolled parts
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_01_home_top.png') });
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_02_home_mid.png') });
  await page.evaluate(() => window.scrollBy(0, 600));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_03_home_bottom.png') });

  // 2. Click "Chuyên đề" tab on bottom nav
  const chuyenDeTab = page.locator('nav a:has-text("Chuyên đề"), nav a[href="/chuyen-de"]');
  if (await chuyenDeTab.count() > 0) {
    await chuyenDeTab.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_04_chuyen_de_tab.png') });
  }

  // 3. Open Topic Detail (/cot-song)
  await page.goto('http://localhost:3270/cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_05_topic_cot_song.png') });

  // Scroll down topic detail to see lesson cards
  await page.evaluate(() => window.scrollBy(0, 400));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_06_topic_cot_song_lessons.png') });

  // 4. Open a Lesson Page (/cot-song/dia-dem)
  await page.goto('http://localhost:3270/cot-song/dia-dem', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_07_lesson_page_top.png') });

  // Scroll down lesson page
  await page.evaluate(() => window.scrollBy(0, 500));
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_08_lesson_page_content.png') });

  // 5. Open "Đã lưu" tab
  await page.goto('http://localhost:3270/da-luu', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_09_da_luu_tab.png') });

  // 6. Open "Tìm kiếm" tab
  await page.goto('http://localhost:3270/tim-kiem', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'audit_10_tim_kiem_tab.png') });

  await browser.close();
  console.log('Auditing screenshots captured successfully!');
}

run().catch(console.error);
