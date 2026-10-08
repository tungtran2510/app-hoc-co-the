const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

async function checkAll() {
  const { data: topics } = await supabase.from('topics').select('id, slug, title, is_visible').order('sort_order');
  for (const t of topics) {
    const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', t.id).order('sort_order');
    console.log('\n--- TOPIC: ' + t.slug + ' (' + pages.length + ' pages, visible: ' + t.is_visible + ')');
    for (const p of pages) {
      const { data: blocks } = await supabase.from('blocks').select('id, type, display_style, data').eq('page_id', p.id).order('sort_order');
      const types = (blocks || []).map(b => b.type + (b.display_style ? ':' + b.display_style : ''));
      const vBlock = (blocks || []).find(b => b.type === 'videos');
      let totalVids = 0;
      let takeaways = 0;
      if (vBlock && vBlock.data && vBlock.data.videos) {
        totalVids = vBlock.data.videos.length;
        takeaways = vBlock.data.videos.filter(v => v.description && v.description.trim().length > 10).length;
      }
      const isClean = blocks.length <= 2 && !blocks.some(b => !['videos', 'text'].includes(b.type));
      console.log('  ' + p.slug + ': ' + blocks.length + ' blocks [' + types.join(', ') + '] | Takeaways: ' + takeaways + '/' + totalVids + ' | ' + (isClean ? '✅ SẠCH' : '⚠️ THỪA'));
    }
  }
}
checkAll();
