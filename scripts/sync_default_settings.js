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

async function syncDefaultSettings() {
  const hiddenIds = [
    'a0000000-0000-0000-0000-000000000006', // noi-tiet-chuyen-hoa
    'a0000000-0000-0000-0000-000000000009', // tung-dinh-duong
    'a0000000-0000-0000-0000-000000000007'  // gan-mat-tuy
  ];

  const { data: defaultRow } = await supabase
    .from('settings')
    .select('*')
    .eq('workspace_id', 'default')
    .single();

  if (defaultRow) {
    const nextStyles = {
      ...(defaultRow.block_styles || {}),
      hidden_home_topic_ids: hiddenIds
    };
    const { error } = await supabase
      .from('settings')
      .update({ block_styles: nextStyles })
      .eq('workspace_id', 'default');
    if (error) console.error('Error updating default settings:', error);
    else console.log('Successfully updated default workspace hidden_home_topic_ids!');
  }
}

syncDefaultSettings();
