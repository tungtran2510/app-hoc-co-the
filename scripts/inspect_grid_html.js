const http = require('http');

http.get('http://localhost:3270/chuyen-de', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const start = data.indexOf('/co-the-nguoi');
    if (start !== -1) {
      console.log(data.slice(start, start + 3000));
    }
  });
});
