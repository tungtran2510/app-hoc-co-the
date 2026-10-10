const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  page.on('requestfailed', req => console.log('REQ FAILED:', req.url(), req.failure()?.errorText));

  console.log('Navigating to 3d widget on port 3080...');
  await page.goto('http://localhost:3080/3d/index.html?widget=1&theme=light&pt=c5#sys=skeletal,joints&cam=0,1.47,-0.30,0,1.47,-0.02', { waitUntil: 'load', timeout: 30000 });

  // Wait for viewer
  await page.waitForFunction(() => window.viewer && window.viewer.scene, { timeout: 20000 });
  console.log('window.viewer is ready!');

  // Wait 4 seconds for skeletal and joints models to finish loading
  await page.waitForTimeout(4000);

  // Helper to highlight by type with material cloning
  async function testHighlight(type, name, filename) {
    console.log(`Testing highlight for ${type} (${name})...`);
    const res = await page.evaluate((hlType) => {
      const scene = window.viewer.scene;
      const highlighted = [];

      // 1. Reset all meshes
      scene.traverse(obj => {
        if (obj.isMesh && obj.userData._origEmissive !== undefined) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach(m => {
            if (m.emissive) {
              m.emissive.setHex(obj.userData._origEmissive);
              m.emissiveIntensity = obj.userData._origIntensity;
              m.needsUpdate = true;
            }
          });
        }
      });

      // 2. Identify target IDs and color
      let targets = [];
      let color = 0x00d2ff;
      let intensity = 1.0;

      if (hlType === 'c5') {
        targets = ['Vertebra C5'];
        color = 0x00f5ff; // Super bright cyan
      } else if (hlType === 'disc') {
        targets = ['Intervertebral disc L4-L5', 'Intervertebral disc L3-L4', 'Intervertebral disc L5-S1'];
        color = 0x10b981; // Emerald green
      } else if (hlType === 'cervical') {
        targets = ['Atlas (C1)', 'Axis (C2)', 'Vertebra C3', 'Vertebra C4', 'Vertebra C5', 'Vertebra C6', 'Vertebra C7'];
        color = 0x00d2ff; // Cyan
      } else if (hlType === 'thoracic') {
        targets = [
          'Vertebra T1', 'Vertebra T2', 'Vertebra T3', 'Vertebra T4', 'Vertebra T5', 'Vertebra T6',
          'Vertebra T7', 'Vertebra T8', 'Vertebra T9', 'Vertebra T10', 'Vertebra T11', 'Vertebra T12'
        ];
        color = 0xf59e0b; // Gold
      }

      scene.traverse(obj => {
        if (obj.isMesh && obj.visible) {
          const id = obj.userData?.partId || obj.name;
          const match = targets.some(t => id === t || id.includes(t) || obj.name.includes(t.replace(/[\s()]/g, '_')));
          if (match) {
            // Must clone material so it doesn't taint shared skeleton material!
            if (!obj.userData.ownsMaterial) {
              obj.material = Array.isArray(obj.material) ? obj.material.map(m => m.clone()) : obj.material.clone();
              obj.userData.ownsMaterial = true;
            }
            const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
            mats.forEach(m => {
              if (obj.userData._origEmissive === undefined) {
                obj.userData._origEmissive = m.emissive ? m.emissive.getHex() : 0x000000;
                obj.userData._origIntensity = m.emissiveIntensity ?? 1;
              }
              if (m.emissive) {
                m.emissive.setHex(color);
                m.emissiveIntensity = intensity;
                m.needsUpdate = true;
              }
            });
            highlighted.push(id);
          }
        }
      });

      window.viewer.render();
      return { count: highlighted.length, highlighted: highlighted.slice(0, 10) };
    }, type);

    console.log(`Result for ${type}:`, res);
    const artifactDir = 'C:/Users/Admin/.gemini/antigravity/brain/23366f77-380f-4e19-b36c-a5afcfb63db3';
    await page.screenshot({ path: `${artifactDir}/${filename}` });
    console.log(`Saved ${filename}`);
  }

  await testHighlight('c5', 'Đốt C5', 'test_c5_isolated_glow.png');
  await testHighlight('cervical', 'C1-C7', 'test_cervical_group_glow.png');
  await testHighlight('disc', 'Đĩa đệm', 'test_disc_isolated_glow.png');

  await browser.close();
})();
