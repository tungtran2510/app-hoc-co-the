const { chromium } = require('playwright');
const path = require('path');
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';

const testCases = [
  { name: '233_chuyen_de_navy_luxury_light.png', palette: 'navy_luxury', dark: false },
  { name: '234_chuyen_de_navy_luxury_dark.png', palette: 'navy_luxury', dark: true },
  { name: '235_chuyen_de_cham_indigo_light.png', palette: 'indigo', dark: false },
  { name: '236_chuyen_de_cham_indigo_dark.png', palette: 'indigo', dark: true },
  { name: '237_chuyen_de_toi_gian_minimal_light.png', palette: 'minimal', dark: false },
  { name: '238_chuyen_de_toi_gian_minimal_dark.png', palette: 'minimal', dark: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    deviceScaleFactor: 2
  });

  // 1. Kiểm tra truy cập trắng (Clean visit): xác nhận mặc định tự động là Navy
  const cleanPage = await context.newPage();
  await cleanPage.goto('http://localhost:3270/', { waitUntil: 'networkidle' });
  await cleanPage.waitForTimeout(600);
  await cleanPage.mouse.wheel(0, 220);
  await cleanPage.waitForTimeout(400);
  await cleanPage.screenshot({ path: path.join(ARTIFACT_DIR, '239_clean_visit_default_navy.png') });
  console.log('Saved 239 clean visit default navy');
  await cleanPage.close();

  // 2. Chụp từng mẫu giao diện
  for (const tc of testCases) {
    const page = await context.newPage();
    await page.goto('http://localhost:3270/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(({ palette, dark }) => {
      localStorage.setItem('qbiz_theme_palette', palette);
      localStorage.setItem('giao_dien', dark ? 'dark' : 'light');
    }, { palette: tc.palette, dark: tc.dark });

    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    await page.mouse.wheel(0, 220);
    await page.waitForTimeout(400);

    const shotPath = path.join(ARTIFACT_DIR, tc.name);
    await page.screenshot({ path: shotPath });
    console.log('Saved:', tc.name);
    await page.close();
  }

  await browser.close();
  console.log('ALL SCREENSHOTS CAPTURED SUCCESSFULLY');
})();
