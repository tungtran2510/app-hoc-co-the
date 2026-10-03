const fs = require('fs');

function getPngSize(filePath) {
  const buf = fs.readFileSync(filePath);
  const w = buf.readUInt32BE(16);
  const h = buf.readUInt32BE(20);
  return { w, h };
}

['public/app_logo.png', 'public/icon-192.png', 'public/icon-512.png', 'public/apple-icon.png'].forEach(p => {
  try {
    const s = getPngSize(p);
    console.log(p, s, 'file size:', fs.statSync(p).size);
  } catch (e) {
    console.log(p, e.message);
  }
});
