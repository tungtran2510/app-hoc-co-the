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

async function run() {
  console.log('--- 1. Set is_visible = true for all 9 topics ---');
  const { error: tErr } = await supabase
    .from('topics')
    .update({ is_visible: true })
    .in('slug', ['gan-mat-tuy', 'noi-tiet-chuyen-hoa', 'tung-dinh-duong']);
  
  if (tErr) console.error('Error updating topics:', tErr);
  else console.log('Successfully restored is_visible: true on topics!');

  console.log('--- 2. Update settings hidden_home_topic_ids ---');
  const { data: topics } = await supabase.from('topics').select('id, slug');
  const hiddenSlugs = ['gan-mat-tuy', 'noi-tiet-chuyen-hoa', 'tung-dinh-duong'];
  const hiddenIds = topics.filter(t => hiddenSlugs.includes(t.slug)).map(t => t.id);
  console.log('Hidden on Home Topic IDs:', hiddenIds);

  const { data: settingsList, error: getErr } = await supabase.from('settings').select('*');
  if (getErr || !settingsList || !settingsList.length) {
    console.error('Error fetching settings:', getErr);
    return;
  }
  const settings = settingsList[0];
  const currentBlockStyles = settings.block_styles || {};
  const updatedBlockStyles = {
    ...currentBlockStyles,
    hidden_home_topic_ids: hiddenIds
  };

  const { error: sErr } = await supabase
    .from('settings')
    .update({ block_styles: updatedBlockStyles })
    .eq('workspace_id', settings.workspace_id);

  if (sErr) console.error('Error updating settings:', sErr);
  else console.log('Successfully updated settings with hidden_home_topic_ids!');
}

run();
