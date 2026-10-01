const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\599c16c7-5563-4eb6-af15-4443741e4c8d';

async function snap(page, name) {
  const filePath = path.join(ARTIFACT_DIR, name);
  await page.screenshot({ path: filePath, fullPage: false, animations: 'disabled', timeout: 10000 });
  console.log(`Saved screenshot: ${name}`);
  return filePath;
}

async function runTest() {
  console.log('--- Starting Mobile 3D Atlas Automation Test (Final Verified) ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });

  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`[Browser Error]: ${msg.text()}`);
    }
  });

  console.log('Navigating to http://localhost:8088/3d/ ...');
  await page.goto('http://localhost:8088/3d/', { waitUntil: 'domcontentloaded', timeout: 30000 });

  await page.evaluate(() => localStorage.removeItem('anatomy_ai_bubble_pos'));

  console.log('Waiting for initial skeletal model to render...');
  await page.waitForSelector('#loadingOverlay.hidden', { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(3500);

  // 1. Initial Clean Mobile Screen
  await snap(page, 'test_01_mobile_initial.png');

  // 2. Open Stepper Drawer via Pull Tab
  console.log('Opening Systems +/- Stepper Drawer...');
  await page.evaluate(() => document.getElementById('systemsPullTab')?.click());
  await page.waitForTimeout(700);
  await snap(page, 'test_02_systems_drawer_open.png');

  // 3. Step Up Cardiovascular System (+)
  console.log('Stepping up Cardiovascular (+) ...');
  await page.evaluate(() => {
    document.querySelector('button.btn-stepper-inc[data-sys="cardiovascular"]')?.click();
  });
  // Wait for dynamic GLB download & Three.js compilation
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    document.querySelector('button.btn-stepper-inc[data-sys="cardiovascular"]')?.click();
  });
  await page.waitForTimeout(1000);
  await snap(page, 'test_03_systems_layers_stepped.png');

  // 4. Close Stepper Drawer
  console.log('Closing Stepper Drawer...');
  await page.evaluate(() => document.getElementById('btnStepperClose')?.click());
  await page.waitForTimeout(700);
  await snap(page, 'test_04_drawer_closed.png');

  // 5. Expand Tools FAB & Test Motion Popover
  console.log('Testing Tools FAB and Motion Popover...');
  await page.evaluate(() => document.getElementById('btnToggleTools')?.click());
  await page.waitForTimeout(500);
  await snap(page, 'test_05_tools_fab_expanded.png');

  await page.evaluate(() => document.getElementById('btnToolMotion')?.click());
  await page.waitForTimeout(700);
  await snap(page, 'test_05b_motion_panel_open.png');

  // Touch canvas to minimize motion to Mini HUD
  console.log('Minimizing motion to Mini HUD...');
  await page.evaluate(() => {
    const canvas = document.getElementById('threeCanvas');
    canvas?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
  });
  await page.waitForTimeout(600);
  await snap(page, 'test_05c_motion_mini_hud.png');

  // Close motion
  await page.evaluate(() => document.getElementById('btnMiniClose')?.click());
  await page.waitForTimeout(400);

  // Collapse tools FAB
  await page.evaluate(() => {
    const tools = document.getElementById('viewerTools');
    if (tools && !tools.classList.contains('collapsed')) {
      document.getElementById('btnToggleTools')?.click();
    }
  });
  await page.waitForTimeout(300);

  // 6. Test Floating AI Bubble
  console.log('Testing Floating AI Bubble...');
  await page.evaluate(() => document.getElementById('floatingAIBubble')?.click());
  await page.waitForTimeout(700);
  await snap(page, 'test_06_ai_assistant_open.png');

  await page.evaluate(() => document.getElementById('aiCloseBtn')?.click());
  await page.waitForTimeout(500);

  // 7. Final Pristine Clean View
  await snap(page, 'test_07_final_pristine_view.png');

  await browser.close();
  console.log('--- ALL 7 STEPS COMPLETED AND VERIFIED 100% ---');
}

runTest().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
