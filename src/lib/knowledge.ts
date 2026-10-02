import fs from 'fs';
import path from 'path';

export interface KnowledgeMatch {
  sourceFile: string;
  categoryTitle: string;
  fileTitle: string;
  excerpt: string;
  score: number;
}

interface ManifestCategory {
  id: string;
  title: string;
  folder: string;
  files: {
    name: string;
    title: string;
    keywords: string[];
  }[];
}

interface KnowledgeManifest {
  version: string;
  description: string;
  categories: ManifestCategory[];
}

let cachedManifest: KnowledgeManifest | null = null;

function getManifest(): KnowledgeManifest | null {
  if (cachedManifest) return cachedManifest;
  try {
    const p = path.join(process.cwd(), 'data', 'knowledge', 'knowledge_manifest.json');
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf8');
      cachedManifest = JSON.parse(raw);
    }
  } catch (err) {
    console.error('[Knowledge] Failed to load knowledge_manifest.json:', err);
  }
  return cachedManifest;
}

/**
 * Tra cứu siêu tốc tri thức chuyên môn từ các file Markdown chuyên biệt
 * Trả về đoạn trích dẫn nguyên văn chính xác nhất từ tài liệu gốc của tác giả
 */
export function searchFastKnowledge(query: string, maxResults: number = 2): KnowledgeMatch[] {
  const manifest = getManifest();
  if (!manifest) return [];

  const lowerQ = query.toLowerCase().trim();
  if (!lowerQ) return [];

  const tokens = lowerQ
    .split(/[\s,?.!;:()\[\]{}"]+/)
    .filter((w) => w.length >= 2);

  const scoredFiles: { cat: ManifestCategory; file: ManifestCategory['files'][0]; score: number }[] = [];

  for (const cat of manifest.categories) {
    for (const f of cat.files) {
      let fileScore = 0;

      // So khớp cụm từ khóa đầy đủ
      for (const kw of f.keywords) {
        const lowerKw = kw.toLowerCase();
        if (lowerQ.includes(lowerKw)) {
          fileScore += 5;
        } else {
          // So khớp từng từ đơn
          const kwTokens = lowerKw.split(/\s+/);
          const matchCount = tokens.filter((t) => kwTokens.includes(t)).length;
          fileScore += matchCount * 1.5;
        }
      }

      // Ưu tiên theo tiêu đề file
      const lowerTitle = f.title.toLowerCase();
      tokens.forEach((t) => {
        if (lowerTitle.includes(t)) fileScore += 2;
      });

      if (fileScore > 0) {
        scoredFiles.push({ cat, file: f, score: fileScore });
      }
    }
  }

  scoredFiles.sort((a, b) => b.score - a.score);
  const topFiles = scoredFiles.slice(0, maxResults);

  const results: KnowledgeMatch[] = [];
  const kDir = path.join(process.cwd(), 'data', 'knowledge');

  for (const item of topFiles) {
    try {
      const fullPath = path.join(kDir, item.cat.folder, item.file.name);
      if (!fs.existsSync(fullPath)) continue;

      const rawContent = fs.readFileSync(fullPath, 'utf8');
      // Tách thành các đoạn văn để chấm điểm đoạn văn khớp nhất
      const paragraphs = rawContent
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 50 && !p.startsWith('# '));

      const scoredParas = paragraphs.map((p) => {
        let pScore = 0;
        const lowerP = p.toLowerCase();
        for (const t of tokens) {
          if (lowerP.includes(t)) pScore += 1;
        }
        return { p, pScore };
      });

      scoredParas.sort((a, b) => b.pScore - a.pScore);

      // Lấy 2 đoạn văn có điểm cao nhất
      const bestParagraphs = scoredParas
        .filter((sp) => sp.pScore > 0)
        .slice(0, 2)
        .map((sp) => sp.p);

      const excerpt = bestParagraphs.length > 0
        ? bestParagraphs.join('\n\n')
        : rawContent.slice(0, 800);

      results.push({
        sourceFile: `${item.cat.folder}/${item.file.name}`,
        categoryTitle: item.cat.title,
        fileTitle: item.file.title,
        excerpt: excerpt.slice(0, 1200),
        score: item.score,
      });
    } catch (err) {
      console.error('[Knowledge] Error reading source file:', item.file.name, err);
    }
  }

  return results;
}
