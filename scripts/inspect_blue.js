const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const base64 = fs.readFileSync('C:/Users/Admin/.gemini/antigravity/brain/dd6e1346-6c48-4052-81d1-b14ecf51288f/.user_uploaded/media_1791012142508.jpg').toString('base64');
  await page.setContent(`<img id="img" src="data:image/jpeg;base64,${base64}" /><canvas id="cv"></canvas>`);
  
  const res = await page.evaluate(() => {
    const img = document.getElementById('img');
    const cv = document.getElementById('cv');
    cv.width = img.naturalWidth;
    cv.height = img.naturalHeight;
    const ctx = cv.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const id = ctx.getImageData(0, 0, cv.width, cv.height);
    const d = id.data;
    const w = cv.width;
    const h = cv.height;

    const points = [];
    for (let y = 200; y < 850; y += 5) {
      for (let x = 0; x < w; x += 1) {
        const idx = (y * w + x) * 4;
        const r = d[idx], g = d[idx+1], b = d[idx+2];
        if (b > 120 && b > r + 35 && b > g + 20) {
          points.push({ x, y, r, g, b });
        }
      }
    }
    return points;
  });
  console.log('Sample points in middle Y (200-850):', res.slice(0, 30));
  // Group by X
  const xDist = {};
  res.forEach(p => { xDist[p.x] = (xDist[p.x] || 0) + 1; });
  console.log('X distribution in middle Y:', xDist);
  await browser.close();
})();
