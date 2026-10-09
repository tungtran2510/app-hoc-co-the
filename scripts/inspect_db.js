const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const envVars = Object.fromEntries(
  env.split('\n')
    .filter(l => l.includes('='))
    .map(l => {
      const idx = l.indexOf('=');
      const k = l.slice(0, idx).trim();
      const v = l.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
      return [k, v];
    })
);

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function check() {
  const { data: topics } = await supabase.from('topics').select('*').order('sort_order', { ascending: true });
  for (const t of topics) {
    const { data: pages } = await supabase.from('pages').select('id, title, is_visible, status, slug').eq('topic_id', t.id);
    console.log(t.title, '(' + t.slug + '):', pages?.length, 'pages, is_visible:', t.is_visible);
    if (pages && pages.length > 0) {
      console.log('  pages:', pages.map(p => p.title + ' [' + p.is_visible + '/' + p.status + ']'));
    }
  }
}

check();
