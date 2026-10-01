import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = 'D:/google driver/APP – GIẢI PHẪU 3D/ANATOMY ATLAS/public/images/atlas';

const VIEWS_TO_CAPTURE = [
  // Skeletal
  { id: 'skel_full', systems: ['skeletal'], cam: { x: 0, y: 0.86, z: 2.6, tx: 0, ty: 0.86, tz: 0 } },
  { id: 'skel_skull', systems: ['skeletal'], cam: { x: 0, y: 1.58, z: 0.38, tx: 0, ty: 1.58, tz: 0 } },
  { id: 'skel_cranial_fossae', systems: ['skeletal'], cam: { x: 0, y: 1.82, z: 0.28, tx: 0, ty: 1.58, tz: 0 } },
  { id: 'skel_spine', systems: ['skeletal'], cam: { x: 0, y: 1.15, z: 1.05, tx: 0, ty: 1.1, tz: 0 } },
  { id: 'skel_pelvis', systems: ['skeletal'], cam: { x: 0, y: 0.88, z: 0.82, tx: 0, ty: 0.85, tz: 0 } },

  // Circulatory
  { id: 'circ_full', systems: ['cardiovascular', 'skeletal'], cam: { x: 0, y: 1.0, z: 1.8, tx: 0, ty: 1.0, tz: 0 } },
  { id: 'circ_heart_thorax', systems: ['cardiovascular', 'skeletal'], cam: { x: 0, y: 1.28, z: 0.65, tx: 0, ty: 1.28, tz: 0 } },
  { id: 'circ_simplified', systems: ['cardiovascular'], cam: { x: 0, y: 1.25, z: 0.95, tx: 0, ty: 1.25, tz: 0 } },

  // Nervous
  { id: 'nerv_full', systems: ['nervous', 'skeletal'], cam: { x: 0, y: 1.0, z: 1.9, tx: 0, ty: 1.0, tz: 0 } },
  { id: 'nerv_brain', systems: ['nervous'], cam: { x: 0, y: 1.58, z: 0.45, tx: 0, ty: 1.58, tz: 0 } },
  { id: 'nerv_spinal', systems: ['nervous', 'skeletal'], cam: { x: 0, y: 1.1, z: 0.9, tx: 0, ty: 1.1, tz: 0 } },

  // Respiratory
  { id: 'resp_upper', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 1.45, z: 0.45, tx: 0, ty: 1.45, tz: 0 } },
  { id: 'resp_lungs', systems: ['visceral', 'cardiovascular'], cam: { x: 0, y: 1.25, z: 0.75, tx: 0, ty: 1.25, tz: 0 } },
  { id: 'resp_diaphragm', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 1.12, z: 0.7, tx: 0, ty: 1.12, tz: 0 } },

  // Muscular
  { id: 'musc_head', systems: ['muscular', 'skeletal'], cam: { x: 0, y: 1.58, z: 0.42, tx: 0, ty: 1.58, tz: 0 } },
  { id: 'musc_torso', systems: ['muscular', 'skeletal'], cam: { x: 0, y: 1.15, z: 1.1, tx: 0, ty: 1.15, tz: 0 } },
  { id: 'musc_limbs', systems: ['muscular', 'skeletal'], cam: { x: 0, y: 0.9, z: 1.8, tx: 0, ty: 0.9, tz: 0 } },

  // Digestive
  { id: 'dig_upper', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 1.15, z: 0.75, tx: 0, ty: 1.15, tz: 0 } },
  { id: 'dig_lower', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 0.92, z: 0.75, tx: 0, ty: 0.92, tz: 0 } },
  { id: 'dig_peritoneum', systems: ['visceral', 'skeletal'], cam: { x: -0.15, y: 1.1, z: 0.75, tx: 0, ty: 1.1, tz: 0 } },

  // Urinary
  { id: 'urin_system', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 1.05, z: 0.75, tx: 0, ty: 1.05, tz: 0 } },
  { id: 'urin_pelvic', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 0.88, z: 0.65, tx: 0, ty: 0.88, tz: 0 } },

  // Regions
  { id: 'reg_head_neck', systems: ['skeletal', 'nervous', 'cardiovascular'], cam: { x: 0, y: 1.55, z: 0.55, tx: 0, ty: 1.52, tz: 0 } },
  { id: 'reg_thorax', systems: ['skeletal', 'cardiovascular', 'visceral'], cam: { x: 0, y: 1.25, z: 0.85, tx: 0, ty: 1.22, tz: 0 } },
  { id: 'reg_abdomen_pelvis', systems: ['skeletal', 'visceral'], cam: { x: 0, y: 0.98, z: 0.9, tx: 0, ty: 0.95, tz: 0 } },
  { id: 'reg_spine', systems: ['skeletal'], cam: { x: 0.75, y: 1.15, z: 0.75, tx: 0, ty: 1.1, tz: 0 } },
  { id: 'reg_upper_limb', systems: ['skeletal', 'muscular'], cam: { x: 0.45, y: 1.1, z: 0.95, tx: 0.35, ty: 1.1, tz: 0 } },
  { id: 'reg_lower_limb', systems: ['skeletal'], cam: { x: 0.25, y: 0.5, z: 1.1, tx: 0.2, ty: 0.5, tz: 0 } },

  // Motions
  { id: 'med_paired_muscles', systems: ['muscular', 'skeletal'], cam: { x: 0.45, y: 1.1, z: 0.75, tx: 0.35, ty: 1.1, tz: 0 } },
  { id: 'med_ball_socket', systems: ['skeletal'], cam: { x: 0.25, y: 0.88, z: 0.65, tx: 0.2, ty: 0.85, tz: 0 } },
  { id: 'med_condyloid', systems: ['skeletal'], cam: { x: 0.2, y: 0.5, z: 0.65, tx: 0.18, ty: 0.5, tz: 0 } },
  { id: 'med_cardiac_cycle', systems: ['cardiovascular', 'skeletal'], cam: { x: 0, y: 1.28, z: 0.55, tx: 0, ty: 1.28, tz: 0 } },
  { id: 'med_respiratory_cycle', systems: ['visceral', 'skeletal'], cam: { x: 0, y: 1.22, z: 0.75, tx: 0, ty: 1.22, tz: 0 } }
];

async function runBatch() {
  console.log('🚀 Starting Batch 3D Thumbnail Generation...');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 340, height: 220 } });

  console.log('Opening 3D viewer...');
  await page.goto('http://localhost:8088/3d/', { waitUntil: 'networkidle', timeout: 35000 });
  await page.waitForTimeout(3000);

  // Clean DOM overlays once
  await page.evaluate(() => {
    document.querySelectorAll('#viewerContainer > :not(#threeCanvas)').forEach(el => el.remove());
    document.querySelectorAll('.permanent-mobile-header, #mobileBottomBar').forEach(el => el.remove());
  });

  const canvas = page.locator('#threeCanvas');

  for (const item of VIEWS_TO_CAPTURE) {
    console.log(`Rendering view: ${item.id}...`);

    await page.evaluate(async ({ systems, cam }) => {
      const v = window.viewer;
      if (!v) return;

      // Position camera
      v.camera.position.set(cam.x, cam.y, cam.z);
      v.controls.target.set(cam.tx, cam.ty, cam.tz);
      v.controls.update();

      // Show requested systems, hide others
      const allSys = ['skeletal', 'muscular', 'joints', 'cardiovascular', 'lymphatic', 'nervous', 'visceral'];
      for (const sys of allSys) {
        const isTarget = systems.includes(sys);
        if (isTarget && !window.__loaded_sys?.includes(sys)) {
          // If loadModel function exists
          if (typeof window.loadModel === 'function') {
            try { await window.loadModel(sys, v); } catch (e) {}
          }
        }
        // Toggle mesh visibility in scene directly
        v.scene.traverse(node => {
          if (node.isMesh && node.userData?.system) {
            if (node.userData.system === sys) {
              node.visible = isTarget;
            }
          }
        });
      }

      v.render();
    }, item);

    await page.waitForTimeout(250);

    const outPath = path.join(OUTPUT_DIR, `${item.id}.png`);
    await canvas.screenshot({ path: outPath, type: 'png', omitBackground: true });
    console.log(`✓ Saved ${item.id}.png`);
  }

  await browser.close();
  console.log('🎉 All 3D anatomical view thumbnails captured successfully!');
}

runBatch().catch(err => {
  console.error('❌ Batch generation error:', err);
  process.exit(1);
});
