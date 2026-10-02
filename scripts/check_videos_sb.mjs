import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = {};
const envFile = fs.readFileSync('.env.local', 'utf-8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
  }
}

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const { data: blocks } = await supabase.from('blocks').select('id, page_id, type, data').eq('type', 'videos');
console.log('Total videos blocks:', blocks?.length);
if (blocks && blocks.length > 0) {
  for (const b of blocks.slice(0, 5)) {
    console.log('Block ID:', b.id, 'Page:', b.page_id, 'Videos count:', b.data?.videos?.length);
    for (const v of (b.data?.videos || []).slice(0, 3)) {
      console.log('  - Video:', v.title, 'ID:', v.youtube_id, 'Aspect:', v.aspect_ratio || (v.is_vertical ? 'vertical' : '16:9'));
    }
  }
}
