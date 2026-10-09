const http = require('http');

http.get('http://localhost:3270/chuyen-de', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const gridStart = data.indexOf('grid grid-cols-3');
    if (gridStart !== -1) {
      const snippet = data.slice(gridStart, gridStart + 8000);
      const hrefs = [...snippet.matchAll(/href="(\/[^"]+)"/g)].map(m => m[1]);
      console.log('All hrefs starting from grid:', hrefs);
    }
  });
});
