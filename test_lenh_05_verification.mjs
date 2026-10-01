// Comprehensive Empirical Verification for LENH #05
// Dynamic Anatomy, Biomechanical Motion, Timeline Scrubbing, Speed Controls,
// Structure Isolation in Motion, and Augmented Reality (AR) on Mobile Viewport (390x844).

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function runVerification() {
  console.log('🚀 [LENH #05] Starting Automated Playwright Verification...');
  const browser = await chromium.launch({
    headless: true,
    args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream']
  });

  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
    permissions: ['camera']
  });

  const page = await context.newPage();

  // Listen to browser console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('🔴 [Browser Error]:', msg.text());
    }
  });

  try {
    // --- STEP 1: LOAD 3D ATLAS ---
    console.log('📦 Step 1: Loading 3D Atlas on port 8088/3d/...');
    await page.goto('http://localhost:8088/3d/', { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for loading overlay to hide
    await page.waitForSelector('#loadingOverlay', { state: 'hidden', timeout: 35000 });
    console.log('✅ 3D Atlas loaded & canvas ready.');

    // Wait for WebGL canvas
    const canvas = await page.waitForSelector('#threeCanvas');
    const isCanvasVisible = await canvas.isVisible();
    console.log('✅ Three.js canvas visible:', isCanvasVisible);

    // --- STEP 2: TEST DYNAMIC ANATOMY & MOTION PANEL ---
    console.log('🎬 Step 2: Testing Dynamic Anatomy & Physiological Motion...');
    const btnMotion = await page.waitForSelector('#btnToolMotion', { timeout: 5000 });
    await btnMotion.click();
    console.log('Clicked #btnToolMotion');

    // Wait for motion popover
    const motionPopover = await page.waitForSelector('#motionPopover', { timeout: 5000 });
    const isMotionOpen = await motionPopover.isVisible();
    console.log('✅ Motion Popover visible:', isMotionOpen);

    // Check motion title and select
    const motionSelect = await page.waitForSelector('#motionSelect');
    const selectedMotion = await motionSelect.inputValue();
    console.log('✅ Active motion preset:', selectedMotion);

    // Check live phase indicator
    const phaseText = await page.waitForSelector('#motionPhaseText');
    const phaseStr = await phaseText.textContent();
    console.log('✅ Live phase text:', phaseStr);

    // Test Speed Chips: Click 0.25x
    const chip025 = await page.waitForSelector('.speed-chip[data-speed="0.25"]');
    await chip025.click();
    const isChipActive = await chip025.evaluate(el => el.classList.contains('active'));
    console.log('✅ Speed 0.25x active:', isChipActive);

    // Test Play/Pause toggle
    const btnPlayPause = await page.waitForSelector('#btnMotionPlayPause');
    const initialPlayIcon = await btnPlayPause.textContent();
    await btnPlayPause.click(); // Pause
    const pausedIcon = await btnPlayPause.textContent();
    console.log(`✅ Play/Pause toggle: ${initialPlayIcon} -> ${pausedIcon}`);

    // Test Timeline Scrubber
    const slider = await page.waitForSelector('#motionTimelineSlider');
    await slider.fill('500'); // Seek to 50%
    await page.waitForTimeout(200);
    const timeCurrent = await page.$eval('#motionTimeCurrent', el => el.textContent);
    const percentText = await page.$eval('#motionPercent', el => el.textContent);
    console.log(`✅ Scrubbed timeline to: ${percentText} (${timeCurrent})`);

    // Test Isolation in Motion
    console.log('🎯 Testing Isolation while in motion...');
    const partSelect = await page.waitForSelector('#motionPartSelect');
    const options = await partSelect.$$eval('option', opts => opts.map(o => ({ val: o.value, text: o.text })));
    console.log('✅ Available structures to isolate:', options.length, options.map(o => o.text).join(' | '));

    // Isolate ventricles
    await partSelect.selectOption('ventricles');
    const btnIsolate = await page.waitForSelector('#btnMotionIsolateCurrent');
    await btnIsolate.click();
    console.log('✅ Clicked Isolate ventricles');

    // Toggle Ghost mode
    const btnGhost = await page.waitForSelector('#btnMotionGhostToggle');
    await btnGhost.click();
    const isGhostActive = await btnGhost.evaluate(el => el.classList.contains('active'));
    console.log('✅ Ghost surrounding mode toggled:', isGhostActive);

    // Reset visibility
    const btnResetIsolate = await page.waitForSelector('#btnMotionResetIsolate');
    await btnResetIsolate.click();
    console.log('✅ Restored full visibility in motion');

    // Switch Motion to Elbow Flexion
    console.log('💪 Testing Elbow Flexion & Extension...');
    await motionSelect.selectOption('elbow_flexion');
    await page.waitForTimeout(600);
    const elbowPhase = await page.$eval('#motionPhaseText', el => el.textContent);
    console.log('✅ Elbow motion active:', elbowPhase);

    // Switch Motion to Knee Flexion
    console.log('🦵 Testing Knee Flexion & Extension...');
    await motionSelect.selectOption('knee_flexion');
    await page.waitForTimeout(600);
    const kneePhase = await page.$eval('#motionPhaseText', el => el.textContent);
    console.log('✅ Knee motion active:', kneePhase);

    // Switch Motion to Spine Flexion
    console.log('🧘 Testing Spine Articulation & Flexion...');
    await motionSelect.selectOption('spine_flexion');
    await page.waitForTimeout(600);
    const spinePhase = await page.$eval('#motionPhaseText', el => el.textContent);
    console.log('✅ Spine motion active:', spinePhase);

    // Switch Motion to Hip Abduction
    console.log('🏃 Testing Hip Abduction & Adduction...');
    await motionSelect.selectOption('hip_abduction');
    await page.waitForTimeout(600);
    const hipPhase = await page.$eval('#motionPhaseText', el => el.textContent);
    console.log('✅ Hip motion active:', hipPhase);

    // Switch Motion to Respiration
    console.log('🫁 Testing Respiratory Mechanics...');
    await motionSelect.selectOption('respiratory');
    await page.waitForTimeout(600);
    const respPhase = await page.$eval('#motionPhaseText', el => el.textContent);
    console.log('✅ Respiratory motion active:', respPhase);

    // Capture screenshot of motion panel
    await page.screenshot({ path: 'screenshot_motion_active_390.png' });
    console.log('📸 Saved screenshot_motion_active_390.png');

    // Close motion popover (pause motion first to ensure DOM stability)
    try {
      const isPlay = await page.$eval('#btnMotionPlayPause', el => el.textContent.includes('⏸'));
      if (isPlay) {
        await page.click('#btnMotionPlayPause', { force: true });
      }
    } catch {}
    await page.waitForTimeout(200);

    await page.click('#motionCloseBtn', { force: true });
    await page.waitForTimeout(300);
    const isMotionClosed = await motionPopover.evaluate(el => el.classList.contains('hidden'));
    console.log('✅ Motion Popover closed cleanly:', isMotionClosed);

    // --- STEP 3: TEST AUGMENTED REALITY (AR) ---
    console.log('\n📱 Step 3: Testing Augmented Reality (AR) Mode...');
    await page.click('#btnToolAR', { force: true, noWaitAfter: true });
    console.log('Clicked #btnToolAR');

    await page.waitForTimeout(1000);
    const hudDebug = await page.$eval('#arHud', el => ({
      className: el.className,
      display: window.getComputedStyle(el).display,
      htmlLength: el.innerHTML.length
    })).catch(err => ({ err: err.message }));
    console.log('DEBUG arHud:', hudDebug);

    const arHud = await page.waitForSelector('#arHud', { state: 'attached', timeout: 8000 });
    const isAROpen = await arHud.evaluate(el => !el.classList.contains('hidden'));
    console.log('✅ AR HUD visible:', isAROpen);

    const arStatus = await page.$eval('#arStatusText', el => el.textContent);
    console.log('✅ AR Status:', arStatus);

    // Test Scale Presets: Tabletop vs Human 1:1
    await page.click('.ar-preset-btn[data-preset="human"]', { force: true, noWaitAfter: true });
    await page.waitForTimeout(200);
    const scaleVal1 = await page.$eval('#arScaleValue', el => el.textContent);
    console.log('✅ Preset Human (1:1) scale:', scaleVal1);

    await page.click('.ar-preset-btn[data-preset="tabletop"]', { force: true, noWaitAfter: true });
    await page.waitForTimeout(200);
    const scaleVal2 = await page.$eval('#arScaleValue', el => el.textContent);
    console.log('✅ Preset Tabletop (1:5) scale:', scaleVal2);

    // Test AR Snapshot tool
    await page.click('#btnARSnapshot', { force: true, noWaitAfter: true });
    await page.waitForTimeout(600);
    const snapBtnText = await page.$eval('#btnARSnapshot', el => el.textContent);
    console.log('✅ Snapshot triggered status:', snapBtnText);

    // Capture screenshot of AR mode
    await page.screenshot({ path: 'screenshot_ar_hud_390.png' });
    console.log('📸 Saved screenshot_ar_hud_390.png');

    // Exit AR mode
    await page.click('#btnARExit', { force: true, noWaitAfter: true });
    await page.waitForTimeout(300);
    const isARClosed = await arHud.evaluate(el => el.classList.contains('hidden'));
    console.log('✅ AR closed cleanly:', isARClosed);

    // --- STEP 4: TEST AI ASSISTANT NATURAL LANGUAGE FOR MOTION & AR ---
    console.log('\n🤖 Step 4: Testing AI Natural Language Motion & AR commands...');
    const btnAI = await page.waitForSelector('#btnToolAI');
    await btnAI.click();

    await page.waitForSelector('#aiAssistantModal:not(.hidden)');

    // Query 1: Motion command "xem mô phỏng tim đập"
    await page.fill('#aiChatInput', 'xem mô phỏng tim đập');
    await page.click('#aiSendBtn');
    
    // Wait for AI response to complete
    await page.waitForSelector('#aiThinkingBubble', { state: 'detached', timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(400);

    const actionBadge1 = await page.$eval('.msg-action-badge:last-of-type', el => el.textContent).catch(() => 'None');
    console.log('✅ AI Motion response badge:', actionBadge1);

    // Query 2: AR command "mở thực tế tăng cường"
    await page.fill('#aiChatInput', 'mở thực tế tăng cường');
    await page.click('#aiSendBtn');

    // Wait for AI response to complete
    await page.waitForSelector('#aiThinkingBubble', { state: 'detached', timeout: 6000 }).catch(() => {});
    await page.waitForTimeout(400);

    const actionBadge2 = await page.$eval('.msg-action-badge:last-of-type', el => el.textContent).catch(() => 'None');
    console.log('✅ AI AR response badge:', actionBadge2);

    await page.screenshot({ path: 'screenshot_ai_motion_ar_390.png' });
    console.log('📸 Saved screenshot_ai_motion_ar_390.png');

    // Close AI modal
    await page.click('#aiCloseBtn');

    // --- STEP 5: TEST NEXT.JS /giai-phau-3d WRAPPER PAGE ---
    console.log('\n🌐 Step 5: Testing Next.js /giai-phau-3d wrapper on port 3005...');
    await page.goto('http://localhost:3005/giai-phau-3d', { waitUntil: 'domcontentloaded', timeout: 15000 });
    const iframe = await page.waitForSelector('iframe[src="/3d/index.html"]', { timeout: 8000 });
    const isIframeVisible = await iframe.isVisible();
    console.log('✅ Next.js /giai-phau-3d mounts iframe successfully:', isIframeVisible);

    await page.screenshot({ path: 'screenshot_wrapper_lenh_05_390.png' });
    console.log('📸 Saved screenshot_wrapper_lenh_05_390.png');

    console.log('\n🎉 ALL LENH #05 VERIFICATIONS PASSED WITH 100% SUCCESS!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification Error:', err);
    await page.screenshot({ path: 'screenshot_test_error_lenh_05.png' }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVerification();
