import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
const envFile = fs.readFileSync('.env.local', 'utf-8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const k = trimmed.slice(0, idx).trim();
    const v = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
    env[k] = v;
  }
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const { data, error } = await supabase.from('settings').select('*').eq('workspace_id', 'default').single();
if (error) {
  console.error('Supabase error:', error);
} else {
  console.log('COLUMNS:', Object.keys(data));
  console.log('APP_NAME:', data.app_name);
  console.log('PRIMARY_COLOR:', data.primary_color);
  console.log('HOTLINE:', data.hotline);
  console.log('ZALO_URL:', data.zalo_url);
  console.log('AUTHOR_PROFILE:', JSON.stringify(data.author_profile, null, 2));
  console.log('BLOCK_STYLES.recommended_books_title:', data.block_styles?.recommended_books_title);
  console.log('BLOCK_STYLES.recommended_books:', JSON.stringify(data.block_styles?.recommended_books, null, 2));
}
