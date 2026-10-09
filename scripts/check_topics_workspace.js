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
  const { data: topics } = await supabase.from('topics').select('id, title, slug, workspace_id, is_visible');
  console.log('Topics and their workspace_id:');
  topics.forEach(t => console.log(t.title, '| slug:', t.slug, '| workspace_id:', t.workspace_id, '| is_visible:', t.is_visible));
}

check();
