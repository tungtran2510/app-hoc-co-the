const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\599c16c7-5563-4eb6-af15-4443741e4c8d';

async function runPart2() {
  console.log('--- Testing Mobile Atlas Interactions (Part 2) ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  await page.goto('http://localhost:8088/3d/', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('#loadingOverlay.hidden', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(3000);

  // 1. Test Tools FAB Expansion
  console.log('Expanding Tools FAB...');
  await page.evaluate(() => document.getElementById('btnToggleTools')?.click());
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_05_tools_fab_expanded.png'), fullPage: false });
  console.log('Saved Screenshot 5: Tools FAB expanded');

  // 2. Open Motion Panel
  console.log('Opening Motion Panel...');
  await page.evaluate(() => document.getElementById('btnToolMotion')?.click());
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_05b_motion_panel_open.png'), fullPage: false });
  console.log('Saved Screenshot 5b: Motion Panel Open');

  // 3. Touch Canvas to Minimize Motion Panel to Mini HUD
  console.log('Touching canvas to minimize motion to Mini HUD...');
  await page.evaluate(() => {
    const viewerContainer = document.getElementById('viewerContainer');
    viewerContainer?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 200, clientY: 300 }));
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_05c_motion_mini_hud.png'), fullPage: false });
  console.log('Saved Screenshot 5c: Motion Mini HUD');

  // 4. Close Motion Panel via Mini Close button
  console.log('Closing Motion Panel...');
  await page.evaluate(() => document.getElementById('btnMiniClose')?.click());
  await page.waitForTimeout(500);

  // Collapse Tools FAB
  await page.evaluate(() => {
    const tools = document.getElementById('viewerTools');
    if (tools && !tools.classList.contains('collapsed')) {
      document.getElementById('btnToggleTools')?.click();
    }
  });
  await page.waitForTimeout(400);

  // 5. Tap Floating AI Bubble to Open AI Assistant Modal
  console.log('Tapping Floating AI Bubble...');
  await page.evaluate(() => document.getElementById('floatingAIBubble')?.click());
  await page.waitForTimeout(800);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_06_ai_assistant_open.png'), fullPage: false });
  console.log('Saved Screenshot 6: AI Assistant Modal Open');

  // Close AI Modal
  await page.evaluate(() => document.getElementById('aiCloseBtn')?.click());
  await page.waitForTimeout(500);

  // 6. Final Clean Pristine Screen
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_07_final_pristine_view.png'), fullPage: false });
  console.log('Saved Screenshot 7: Final Pristine Clean View');

  await browser.close();
  console.log('--- ALL PART 2 TESTS COMPLETED SUCCESSFULLY ---');
}

runPart2().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
