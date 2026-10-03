import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k.trim()] = v.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSettings() {
  const { data, error } = await supabase.from('settings').select('*').eq('workspace_id', 'default').single();
  if (error) {
    console.error('Error fetching settings:', error);
    return;
  }
  console.log('--- SUPABASE SETTINGS ---');
  console.log('app_name:', data.app_name);
  console.log('app_subtitle column:', data.app_subtitle);
  console.log('block_styles.app_subtitle:', data.block_styles?.app_subtitle);
  console.log('block_styles.brand_tagline:', data.block_styles?.brand_tagline);
  console.log('block_styles.app_tagline:', data.block_styles?.app_tagline);
  console.log('Full data:', JSON.stringify(data, null, 2));
}

checkSettings();
