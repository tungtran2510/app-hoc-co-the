const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const lines = env.split('\n');
const parsed = {};
for (const line of lines) {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) parsed[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
}
const { createClient } = require('@supabase/supabase-js');
const s = createClient(parsed.NEXT_PUBLIC_SUPABASE_URL, parsed.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const { data: page } = await s.from('pages').select('id, title, slug').eq('slug', 'tong-quan-ve-cot-song').single();
  const { data: blocks } = await s.from('blocks').select('*').eq('page_id', page.id).order('sort_order');
  console.log(`Page: ${page.title} (${page.id}) has ${blocks.length} blocks:`);
  for (const b of blocks) {
    console.log(`- [${b.sort_order}] id: ${b.id.slice(0, 8)}... | type: ${b.type} | style: ${b.display_style} | visible: ${b.is_visible}`);
  }
}
run();
