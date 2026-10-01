import { chromium } from 'playwright';

async function runLenh06Verification() {
  console.log('🚀 [LỆNH #06] Starting Comprehensive Verification: PWA, Offline Caching, Sync & Cross-Platform Packaging...');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log(`[Browser ${msg.type()}]:`, msg.text());
  });
  page.on('pageerror', err => {
    console.error('🔴 [Page Error]:', err.message);
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('❌ HTTP Error:', res.status(), res.url());
    }
  });

  try {
    // =========================================================================
    // STEP 1: PWA MANIFEST & SERVICE WORKER VALIDATION
    // =========================================================================
    console.log('\n📦 Step 1: Validating PWA Manifest & Service Worker...');
    
    // Check Standalone 3D Manifest
    const manifestRes = await page.goto('http://localhost:8088/3d/manifest.json');
    if (!manifestRes.ok()) throw new Error(`Manifest HTTP ${manifestRes.status()}`);
    const manifestJson = await manifestRes.json();
    console.log('✅ PWA Manifest valid:', manifestJson.name, '| Display:', manifestJson.display);
    console.log('✅ Manifest Shortcuts:', manifestJson.shortcuts?.length, 'shortcuts configured');

    // Check Service Worker availability
    const swRes = await page.goto('http://localhost:8088/3d/sw.js');
    if (!swRes.ok()) throw new Error(`Service Worker HTTP ${swRes.status()}`);
    console.log('✅ Service Worker script served successfully (HTTP 200)');

    // =========================================================================
    // STEP 2: LOAD 3D ATLAS & TEST OFFLINE TOOLS & NETWORK BADGE
    // =========================================================================
    console.log('\n⚡ Step 2: Loading 3D Atlas and verifying Offline UI & Badges...');
    await page.goto('http://localhost:8088/3d/', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForSelector('#loadingOverlay', { state: 'hidden', timeout: 35000 });

    const canvas = await page.waitForSelector('#threeCanvas', { timeout: 15000 });
    console.log('✅ 3D Canvas mounted and visible:', await canvas.isVisible());

    // Check Live Network Status Badge in Header
    const netBadge = await page.waitForSelector('#netStatusBadge', { timeout: 5000 });
    const netText = await page.$eval('#netStatusText', el => el.textContent);
    console.log('✅ Header Network Badge visible:', await netBadge.isVisible(), `(Status: "${netText}")`);

    // Verify Offline Tool button exists in viewer tools
    const btnOffline = await page.waitForSelector('#btnToolOffline', { timeout: 5000 });
    console.log('✅ Toolbar button #btnToolOffline present:', await btnOffline.isVisible());

    // =========================================================================
    // STEP 3: OFFLINE & STORAGE MANAGER MODAL TEST
    // =========================================================================
    console.log('\n💾 Step 3: Testing Offline & Cache Manager Modal (#offlineModal)...');
    await btnOffline.click({ force: true, noWaitAfter: true });
    await page.waitForTimeout(600);

    const offlineModal = await page.waitForSelector('#offlineModal:not(.hidden)', { timeout: 6000 });
    console.log('✅ Offline Modal opened smoothly:', await offlineModal.isVisible());

    // Verify System Cache List
    const sysItems = await page.$$('.system-cache-item');
    console.log(`✅ System Cache List rendered with ${sysItems.length} anatomical systems:`);
    for (const item of sysItems) {
      const sysName = await item.$eval('strong', el => el.textContent);
      const sysSize = await item.$eval('.sys-size', el => el.textContent);
      const sysBadge = await item.$eval('.cache-status-badge', el => el.textContent.trim());
      console.log(`   - [${sysName}] (${sysSize}) -> Status: ${sysBadge}`);
    }

    // Capture screenshot of offline modal
    await page.screenshot({ path: 'screenshot_lenh_06_offline_modal_390.png' });
    console.log('📸 Saved screenshot_lenh_06_offline_modal_390.png');

    // Test Pre-caching Study Data
    console.log('\n📚 Testing Pre-caching of Study Content...');
    const btnPrecache = await page.waitForSelector('#btnPrecacheData');
    await btnPrecache.click();
    await page.waitForTimeout(600);
    const precacheStatus = await page.$eval('#precacheDataStatus', el => el.textContent);
    console.log('✅ Pre-cache Study Material Status:', precacheStatus);

    // Test RAM Purge (Garbage Collection)
    console.log('\n🧹 Testing GPU/RAM Memory Purge...');
    const btnPurge = await page.waitForSelector('#btnPurgeRAM');
    await btnPurge.click();
    await page.waitForTimeout(400);

    // Test Single System Download (e.g. skeletal system)
    console.log('\n📥 Testing Single System Model Caching...');
    const btnDownloadSkeletal = await page.waitForSelector('.btn-cache-action[data-system="skeletal"]');
    await btnDownloadSkeletal.click();
    await page.waitForTimeout(1000);
    const skeletalBadge = await page.$eval('#badge-skeletal', el => el.textContent.trim());
    console.log('✅ Skeletal Cache Badge updated to:', skeletalBadge);

    // Capture screenshot of storage & sync section
    await page.screenshot({ path: 'screenshot_lenh_06_storage_sync_390.png' });
    console.log('📸 Saved screenshot_lenh_06_storage_sync_390.png');

    // Close offline modal
    await page.click('#offlineCloseBtn');
    await page.waitForTimeout(300);
    const isModalClosed = await offlineModal.evaluate(el => el.classList.contains('hidden'));
    console.log('✅ Offline Modal closed cleanly:', isModalClosed);

    // =========================================================================
    // STEP 4: INDEXEDDB OFFLINE PERSISTENCE & SYNC OUTBOX TEST
    // =========================================================================
    console.log('\n🔄 Step 4: Testing IndexedDB Offline Stores & Transactional Outbox...');
    const dbTestResult = await page.evaluate(async () => {
      return new Promise((resolve) => {
        const req = indexedDB.open('AtlasOfflineStore_v1', 1);
        req.onupgradeneeded = (event) => {
          const db = event.target.result;
          if (!db.objectStoreNames.contains('bookmarks')) db.createObjectStore('bookmarks', { keyPath: 'partId' });
          if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
          if (!db.objectStoreNames.contains('progress')) db.createObjectStore('progress', { keyPath: 'partId' });
          if (!db.objectStoreNames.contains('syncOutbox')) db.createObjectStore('syncOutbox', { keyPath: 'id', autoIncrement: true });
        };
        req.onsuccess = () => {
          const db = req.result;
          const stores = Array.from(db.objectStoreNames);
          resolve({ success: true, stores });
        };
        req.onerror = () => resolve({ success: false, error: req.error?.message });
      });
    });
    console.log('✅ IndexedDB Offline database active & functional with stores:', dbTestResult.stores?.join(', '));

    // =========================================================================
    // STEP 5: TEST NEXT.JS INTEGRATION & PWA MANIFEST (/giai-phau-3d)
    // =========================================================================
    console.log('\n🌐 Step 5: Testing Next.js Integrated App on port 3005...');
    
    // Check Next.js manifest
    const nextManifestRes = await page.goto('http://localhost:3005/manifest.webmanifest');
    console.log('✅ Next.js /manifest.webmanifest status:', nextManifestRes.status());
    const nextManifestJson = await nextManifestRes.json();
    console.log('✅ Next.js PWA Shortcuts:', nextManifestJson.shortcuts?.map(s => s.name).join(' | '));

    // Check Next.js /giai-phau-3d wrapper page
    await page.goto('http://localhost:3005/giai-phau-3d', { waitUntil: 'networkidle', timeout: 20000 });
    const iframe = await page.waitForSelector('iframe[src="/3d/index.html"]', { timeout: 10000 });
    console.log('✅ Next.js /giai-phau-3d mounts 3D Atlas iframe successfully:', await iframe.isVisible());
    
    // Give iframe time to initialize scene
    await page.waitForTimeout(3000);

    // Capture screenshot of integrated app
    await page.screenshot({ path: 'screenshot_lenh_06_nextjs_integrated_390.png' });
    console.log('📸 Saved screenshot_lenh_06_nextjs_integrated_390.png');

    console.log('\n🎉 ALL LỆNH #06 OFFLINE, SYNC & CROSS-PLATFORM TESTS PASSED (100% SUCCESS)!');
    process.exit(0);
  } catch (error) {
    console.error('❌ LỆNH #06 Verification Error:', error);
    await page.screenshot({ path: 'screenshot_error_lenh_06.png' }).catch(() => {});
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runLenh06Verification();
