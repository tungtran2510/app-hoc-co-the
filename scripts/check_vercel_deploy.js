(async () => {
  try {
    const res = await fetch('https://app-hoc-co-the.vercel.app?t=' + Date.now());
    const html = await res.text();
    console.log('Status:', res.status);
    console.log('HTML size:', html.length);
    console.log('Includes "Cài đặt khối sách"?:', html.includes('Cài đặt khối sách'));
    console.log('Includes "Sửa tài liệu"?:', html.includes('Sửa tài liệu'));
    console.log('Includes "Tài Liệu Chuyên Sâu"?:', html.includes('Tài Liệu Chuyên Sâu'));
    
    // Check chunk scripts
    const chunks = [...html.matchAll(/\/static\/chunks\/([a-zA-Z0-9\-_]+)\.js/g)].map(m => m[1]);
    console.log('Found chunks count:', chunks.length);

    // Let's search inside the chunks for "Chỉnh Sửa Cuốn Sách Này"
    let foundSingleModalInChunks = false;
    for (const chunk of chunks) {
      const chunkRes = await fetch(`https://app-hoc-co-the.vercel.app/_next/static/chunks/${chunk}.js`);
      const chunkText = await chunkRes.text();
      if (chunkText.includes('Chỉnh Sửa Cuốn Sách Này') || chunkText.includes('onEditSingleBook')) {
        console.log(`FOUND in chunk: ${chunk}`);
        foundSingleModalInChunks = true;
        break;
      }
    }
    console.log('Found single modal in deployed JS chunks?:', foundSingleModalInChunks);
  } catch (err) {
    console.error('Error:', err);
  }
})();
