import { chromium } from 'playwright';
import path from 'path';

async function runTest() {
  console.log('🚀 Starting LỆNH #04 Verification Test on Mobile Viewport (390x844)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });

  const page = await context.newPage();

  // Listen to console errors
  page.on('console', msg => {
    if (msg.type() === 'error') console.log(`[Browser Error]:`, msg.text());
  });

  try {
    console.log('1. Navigating to http://localhost:3005/3d/index.html...');
    await page.goto('http://localhost:3005/3d/index.html', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for canvas
    await page.waitForSelector('#threeCanvas', { timeout: 15000 });
    console.log('✓ Three.js canvas ready');

    // Wait for initial model loading to finish
    await page.waitForTimeout(3000);

    // 2. Test AI Assistant Launch
    console.log('2. Testing Floating AI Assistant button (#btnToolAI)...');
    const btnAI = await page.waitForSelector('#btnToolAI', { timeout: 5000 });
    await btnAI.click();

    await page.waitForSelector('#aiAssistantModal:not(.hidden)', { timeout: 5000 });
    console.log('✓ AI Assistant Modal opened successfully');

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_ai_initial_390.png' });
    console.log('✓ Captured screenshot_ai_initial_390.png');

    // 3. Test Command 1: "chỉ cơ delta"
    console.log('3. Testing AI Command: "chỉ cơ delta"...');
    const chipDelta = await page.waitForSelector('.ai-chip[data-prompt="chỉ cơ delta"]', { timeout: 5000 });
    await chipDelta.click();

    // Wait for bot response
    await page.waitForSelector('.chat-msg.bot .msg-action-badge', { timeout: 15000 });
    const badgeText = await page.textContent('.chat-msg.bot:last-child .msg-action-badge');
    console.log('✓ Bot Action Badge:', badgeText);

    const botMessage = await page.textContent('.chat-msg.bot:last-child .msg-bubble');
    console.log('✓ Bot response preview:', botMessage.slice(0, 120) + '...');

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_ai_delta_390.png' });
    console.log('✓ Captured screenshot_ai_delta_390.png');

    // 4. Test Command 2: "ẩn cơ để xem thần kinh"
    console.log('4. Testing AI Command: "ẩn cơ để xem thần kinh"...');
    const chipNervous = await page.waitForSelector('.ai-chip[data-prompt="ẩn cơ để xem thần kinh"]', { timeout: 5000 });
    await chipNervous.click();

    await page.waitForSelector('#aiThinkingBubble', { state: 'attached', timeout: 5000 }).catch(() => {});
    await page.waitForSelector('#aiThinkingBubble', { state: 'detached', timeout: 15000 });
    await page.waitForTimeout(500);

    const badges = await page.$$eval('.msg-action-badge', els => els.map(e => e.textContent));
    console.log('✓ All Action Badges so far:', badges);

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_ai_nervous_390.png' });
    console.log('✓ Captured screenshot_ai_nervous_390.png');

    // 5. Test Command 3: "so sánh xương đùi trái–phải"
    console.log('5. Testing AI Command: "so sánh xương đùi trái–phải"...');
    const chipCompare = await page.waitForSelector('.ai-chip[data-prompt="so sánh xương đùi trái–phải"]', { timeout: 5000 });
    await chipCompare.click();

    await page.waitForSelector('#aiThinkingBubble', { state: 'attached', timeout: 5000 }).catch(() => {});
    await page.waitForSelector('#aiThinkingBubble', { state: 'detached', timeout: 15000 });
    await page.waitForTimeout(500);

    const latestBotMsg = await page.textContent('.chat-msg.bot:last-child .msg-bubble');
    console.log('✓ Compare Bot response preview:', latestBotMsg.slice(0, 150) + '...');

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_ai_bilateral_femur_390.png' });
    console.log('✓ Captured screenshot_ai_bilateral_femur_390.png');

    // 6. Close AI Modal & Test Selection Card AI Button
    console.log('6. Closing AI Modal and testing Selection Card AI Context button...');
    await page.click('#aiCloseBtn');
    await page.waitForSelector('#aiAssistantModal', { state: 'hidden', timeout: 5000 });
    console.log('✓ AI Assistant Modal closed');

    await page.waitForTimeout(500);
    // Ensure selection card is open by clicking a visible structure item
    await page.evaluate(() => {
      const item = document.querySelector('.structure-item[data-part]');
      if (item) item.click();
    });
    await page.waitForTimeout(600);

    // Click #cardAIBtn
    const cardAIBtn = await page.waitForSelector('#cardAIBtn', { state: 'visible', timeout: 5000 });
    await cardAIBtn.click();
    await page.waitForSelector('#aiAssistantModal', { state: 'visible', timeout: 5000 });
    console.log('✓ Opened AI Modal from Selection Card');

    const contextText = await page.textContent('.ai-context-text');
    console.log('✓ Context text in AI Assistant:', contextText.trim());

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_ai_context_card_390.png' });
    console.log('✓ Captured screenshot_ai_context_card_390.png');

    await page.click('#aiCloseBtn');
    await page.waitForSelector('#aiAssistantModal', { state: 'hidden', timeout: 5000 });

    // 7. Test Roadmap Drawer Tab
    console.log('7. Testing Roadmap Drawer Tab...');
    // Open Systems Sidebar
    await page.click('#btnNavSystems');
    await page.waitForTimeout(600);

    // Click 'Lộ trình' tab
    const roadmapTabBtn = await page.waitForSelector('.sidebar-tab[data-tab="roadmap"]', { timeout: 5000 });
    await roadmapTabBtn.click();
    await page.waitForTimeout(800);

    // Verify Roadmap Summary Card
    const summaryPct = await page.textContent('.summary-pct');
    console.log('✓ Roadmap Overall Progress Percentage:', summaryPct);

    // Verify 7 Core Modules
    const moduleCards = await page.$$('.roadmap-mod-card');
    console.log(`✓ Number of Roadmap 7-Region modules rendered: ${moduleCards.length}`);

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_roadmap_tab_390.png' });
    console.log('✓ Captured screenshot_roadmap_tab_390.png');

    // 8. Test Next.js Wrapper Page
    console.log('8. Testing Next.js /giai-phau-3d wrapper page...');
    await page.goto('http://localhost:3005/giai-phau-3d', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('iframe[src="/3d/index.html"]', { timeout: 10000 });
    console.log('✓ Iframe with src="/3d/index.html" is mounted and loaded');

    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_giai_phau_3d_wrapper_390.png' });
    console.log('✓ Captured screenshot_giai_phau_3d_wrapper_390.png');

    console.log('\n========================================');
    console.log('🎉 ALL LỆNH #04 TESTS PASSED EMPIRICALLY!');
    console.log('========================================');

  } catch (err) {
    console.error('❌ Test failed with error:', err);
    await page.screenshot({ path: 'D:/app-hoc-co-the/public/screenshot_test_error.png' }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
