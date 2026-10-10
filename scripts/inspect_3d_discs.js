const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });

  await page.goto('http://localhost:3080/cot-song/tong-quan-ve-cot-song', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Tìm iframe 3D
  const iframeElement = await page.$('iframe[title*="Mô hình 3D"]');
  if (!iframeElement) {
    console.log('No 3D iframe found on /cot-song!');
    await browser.close();
    return;
  }

  const frame = await iframeElement.contentFrame();
  if (!frame) {
    console.log('Could not get content frame!');
    await browser.close();
    return;
  }

  // Đợi Three.js viewer sẵn sàng trong iframe
  await frame.waitForFunction(() => window.viewer && window.viewer.scene);
  console.log('Viewer is ready in iframe.');

  // Liệt kê các mesh liên quan đến disc và vertebra
  const meshesInfo = await frame.evaluate(() => {
    const scene = window.viewer.scene;
    const discMeshes = [];
    const lumbarMeshes = [];
    scene.traverse(obj => {
      if (obj.isMesh) {
        const id = obj.userData?.partId || obj.name;
        if (id.toLowerCase().includes('disc')) {
          discMeshes.push({
            name: obj.name,
            partId: obj.userData?.partId,
            visible: obj.visible,
            pos: [obj.position.x, obj.position.y, obj.position.z],
            emissive: obj.material?.emissive?.getHex ? obj.material.emissive.getHex().toString(16) : null,
            color: obj.material?.color?.getHex ? obj.material.color.getHex().toString(16) : null
          });
        }
        if (id.includes('Vertebra L') || id.includes('L1') || id.includes('L2') || id.includes('L3') || id.includes('L4') || id.includes('L5')) {
          lumbarMeshes.push({
            name: obj.name,
            partId: obj.userData?.partId,
            visible: obj.visible
          });
        }
      }
    });
    return { discMeshes, lumbarMeshes };
  });

  console.log('Found Discs count:', meshesInfo.discMeshes.length);
  console.log('Sample Discs:', JSON.stringify(meshesInfo.discMeshes.slice(0, 8), null, 2));
  console.log('Found Lumbar count:', meshesInfo.lumbarMeshes.length);
  console.log('Lumbar meshes:', JSON.stringify(meshesInfo.lumbarMeshes, null, 2));

  // Thử gọi window.applySpineHighlight('disc') và xem điều gì xảy ra
  const testDiscHl = await frame.evaluate(() => {
    window.applySpineHighlight('disc');
    const highlighted = [];
    window.viewer.scene.traverse(obj => {
      if (obj.isMesh && obj.visible) {
        const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
        mats.forEach(m => {
          if (m?.emissive && m.emissive.getHex() !== 0) {
            highlighted.push({
              name: obj.name,
              partId: obj.userData?.partId,
              emissiveHex: m.emissive.getHex().toString(16),
              emissiveIntensity: m.emissiveIntensity
            });
          }
        });
      }
    });
    return highlighted;
  });

  console.log('Highlighted count when hl=disc:', testDiscHl.length);
  console.log('Highlighted items:', JSON.stringify(testDiscHl, null, 2));

  // Kiểm tra camera hiện tại
  const camInfo = await frame.evaluate(() => {
    const { camera, controls } = window.viewer;
    return {
      camPos: [camera.position.x, camera.position.y, camera.position.z],
      target: [controls.target.x, controls.target.y, controls.target.z]
    };
  });
  console.log('Current Camera:', JSON.stringify(camInfo));

  await browser.close();
})();
