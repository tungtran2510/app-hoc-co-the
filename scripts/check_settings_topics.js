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
  const { data: list } = await supabase.from('settings').select('*');
  console.log('Number of settings rows:', list.length);
  for (const s of list) {
    console.log('workspace_id:', s.workspace_id);
    console.log('block_styles keys:', Object.keys(s.block_styles || {}));
    console.log('hidden_home_topic_ids:', s.block_styles?.hidden_home_topic_ids);
  }
}

check();
