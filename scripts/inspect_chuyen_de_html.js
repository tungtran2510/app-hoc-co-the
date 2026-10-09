const http = require('http');

http.get('http://localhost:3270/chuyen-de', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const idx = data.indexOf('gan-mat-tuy');
    if (idx !== -1) {
      console.log('Context around gan-mat-tuy:');
      console.log(data.slice(Math.max(0, idx - 150), idx + 200));
    }
  });
});
