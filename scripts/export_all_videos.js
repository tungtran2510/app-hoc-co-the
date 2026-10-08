const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

async function exportVideos() {
  const { data: topics } = await supabase.from('topics').select('id, slug, title').order('sort_order');
  const catalog = {};

  for (const t of topics) {
    if (t.slug === 'tung-dinh-duong') continue; // already clean and hidden
    const { data: pages } = await supabase.from('pages').select('id, slug, title').eq('topic_id', t.id).order('sort_order');
    catalog[t.slug] = {
      title: t.title,
      pages: []
    };

    for (const p of pages) {
      const { data: blocks } = await supabase.from('blocks').select('id, type, display_style, data').eq('page_id', p.id).order('sort_order');
      const vBlock = (blocks || []).find(b => b.type === 'videos');
      const videos = (vBlock && vBlock.data && vBlock.data.videos) ? vBlock.data.videos.map(v => ({ id: v.id, title: v.title, url: v.url })) : [];
      catalog[t.slug].pages.push({
        id: p.id,
        slug: p.slug,
        title: p.title,
        videos: videos
      });
    }
  }

  fs.writeFileSync('scripts/catalog_videos.json', JSON.stringify(catalog, null, 2), 'utf8');
  console.log('Exported catalog_videos.json with', Object.keys(catalog).length, 'topics.');
}

exportVideos();
