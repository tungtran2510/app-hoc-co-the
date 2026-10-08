const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

async function run() {
  const { data: topics, error: tErr } = await supabase.from('topics').select('id, slug, title, is_visible, sort_order').order('sort_order');
  if (tErr) { console.error('Error fetching topics:', tErr); return; }
  console.log(`Found ${topics.length} topics:`);
  
  for (const t of topics) {
    const { data: pages, error: pErr } = await supabase
      .from('pages')
      .select('id, slug, title, sort_order')
      .eq('topic_id', t.id)
      .order('sort_order');
      
    console.log(`\n=== Topic [${t.slug}] "${t.title}" (${pages ? pages.length : 0} pages, visible: ${t.is_visible}) ===`);
    if (pages && pages.length > 0) {
      for (const p of pages) {
        const { data: blocks } = await supabase
          .from('blocks')
          .select('id, type, display_style, data')
          .eq('page_id', p.id)
          .order('sort_order');
          
        const blist = blocks || [];
        const types = blist.map(b => b.type + (b.display_style ? ':' + b.display_style : ''));
        const hasRedundant = blist.some(b => !['videos', 'text'].includes(b.type) || (b.type === 'text' && b.display_style !== 'y_nghia' && b.display_style !== 'van_ban'));
        
        let videoCount = 0;
        let takeawaysCount = 0;
        const vBlock = blist.find(b => b.type === 'videos');
        if (vBlock && vBlock.data && vBlock.data.videos) {
          videoCount = vBlock.data.videos.length;
          takeawaysCount = vBlock.data.videos.filter(v => v.description && v.description.trim().length > 10).length;
        }

        console.log(`  Page [${p.slug}] "${p.title}": ${blist.length} blocks [${types.join(', ')}] | Videos: ${videoCount} (${takeawaysCount} takeaways) | ${hasRedundant ? '⚠️ CÓ MỤC THỪA' : '✅ SẠCH'}`);
      }
    }
  }
}

run();
