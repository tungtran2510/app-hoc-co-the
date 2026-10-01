const fs = require('fs');
const envStr = fs.readFileSync('.env.local', 'utf-8');
const env = {};
envStr.split(/\r?\n/).forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let val = match[2] || '';
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[match[1]] = val;
  }
});

const { createClient } = require('@supabase/supabase-js');
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function main() {
  const { data, error } = await sb.from('settings').select('*').eq('workspace_id', 'default').single();
  if (error) {
    console.error('Fetch error:', error);
    return;
  }

  const books = data?.block_styles?.recommended_books || [];
  console.log('Current books count:', books.length);
  if (books.length > 0) {
    console.log('Book 0:', books[0].title);
    books[0].gallery_images = [
      '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
      '/spine_hero_clean.png'
    ];
    if (books.length > 1) {
      books[1].gallery_images = [
        '/spine_hero_clean.png',
        '/documents/bang_tra_cuu_re_than_kinh_cot_song.png'
      ];
    }
    data.block_styles.recommended_books = books;
    const res = await sb.from('settings').update({ block_styles: data.block_styles }).eq('workspace_id', 'default');
    console.log('Update result error:', res.error);
    console.log('SUCCESS UPDATE GALLERY IMAGES!');
  }
}

main();
