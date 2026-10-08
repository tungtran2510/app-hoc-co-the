const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*(.*)/)[1].trim();
const key = env.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.*)/)[1].trim();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(url, key);

async function convertAll() {
  const { data: blocks, error } = await supabase.from('blocks').select('*').eq('type', 'text');
  if (error) {
    console.error('Error fetching text blocks:', error);
    return;
  }

  console.log(`Found ${blocks.length} text blocks to check/convert.`);

  for (const b of blocks) {
    const d = b.data || {};
    // If lines already exists and is non-empty array, skip
    if (Array.isArray(d.lines) && d.lines.length > 0 && d.format) {
      continue;
    }

    const raw = d.text || d.content || '';
    if (!raw) continue;

    // Extract title from ### heading if present
    let title = d.title || 'Tóm tắt cốt lõi';
    const headingMatch = raw.match(/###\s*(.*)/);
    if (headingMatch) {
      title = headingMatch[1].trim();
    }

    // Extract lines: split by line, trim, filter out heading lines, keep meaningful lines
    const rawLines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    const lines = [];
    for (const line of rawLines) {
      if (line.startsWith('###')) continue;
      // Strip bullet prefix if present
      const cleanLine = line.replace(/^[-*]\s*/, '').replace(/^\d+\.\s*/, '');
      if (cleanLine.length > 5) {
        lines.push(cleanLine);
      }
    }

    const updatedData = {
      ...d,
      title: title,
      format: 'bullet',
      lines: lines,
      content: raw
    };

    const { error: updErr } = await supabase.from('blocks').update({ data: updatedData }).eq('id', b.id);
    if (updErr) {
      console.error(`Error updating block ${b.id}:`, updErr);
    } else {
      console.log(`Updated block ${b.id} (${b.display_style}): "${title}" -> ${lines.length} lines`);
    }
  }

  console.log('✅ ALL TEXT BLOCKS CONVERTED TO LINES SUCCESSFULLY!');
}

convertAll();
