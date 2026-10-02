const http = require('http');

function check(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () =>
        resolve({ status: res.statusCode, headers: res.headers, body: data })
      );
    }).on('error', (e) => resolve({ error: e.message }));
  });
}

(async () => {
  console.log('=== VERIFYING PWA & MANIFEST ===');
  const m1 = await check('http://localhost:3100/manifest.webmanifest');
  console.log('/manifest.webmanifest status:', m1.status);
  console.log('/manifest.webmanifest body preview:', m1.body.slice(0, 150));

  const m2 = await check('http://localhost:3100/manifest.json');
  console.log('/manifest.json status:', m2.status);
  console.log('/manifest.json body preview:', m2.body.slice(0, 150));

  const page = await check('http://localhost:3100/');
  console.log('HTML status:', page.status);
  console.log('HTML has rel="manifest":', page.body.includes('rel="manifest"'));
  console.log('HTML has icon-192.png:', page.body.includes('icon-192.png'));
  console.log('HTML has icon-512.png:', page.body.includes('icon-512.png'));
  console.log('HTML has apple-icon.png:', page.body.includes('apple-icon.png'));

  console.log('\n=== VERIFYING LESSON PAGE & RELATED LINKS ===');
  const lessonPage = await check('http://localhost:3100/cot-song/tong-quan-ve-cot-song');
  console.log('Lesson page status:', lessonPage.status);
  console.log('Lesson page has "BÀI LIÊN QUAN":', lessonPage.body.includes('BÀI LIÊN QUAN'));
  console.log('Lesson page has dia-dem thumbnail:', lessonPage.body.includes('dia-dem.jpg'));
  console.log('Lesson page has than-kinh thumbnail:', lessonPage.body.includes('than-kinh.jpg'));
  console.log('Lesson page has tu-the-va-van-dong thumbnail:', lessonPage.body.includes('tu-the-va-van-dong.jpg'));
})();
