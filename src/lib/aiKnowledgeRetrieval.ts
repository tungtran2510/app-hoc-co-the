import { AiKnowledgeDoc } from './types';

/**
 * Truy xuất đoạn tài liệu liên quan cho Trợ lý AI (RAG nhẹ, không cần cơ sở dữ liệu vector).
 * - Cắt mỗi tài liệu (có thể dài hàng trăm trang) thành các đoạn ~900 ký tự theo ranh giới đoạn văn/câu.
 * - Chấm điểm theo từ khóa (có trọng số hiếm/phổ biến), cụm 2 từ và tiêu đề tài liệu.
 * - Trả về vài đoạn tốt nhất trong giới hạn ký tự để đưa vào prompt.
 */

export function normalizeVi(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const STOPWORDS = new Set(
  (
    'la va co khong duoc cua cho nhung the nao gi nen bi khi nhu nay de voi trong mot cac toi minh ban hay o da se rat dang ' +
    'thi ma nhu vay sao nhieu it hon cung con neu thang lam vi tai nao dau di ve len xuong ra vao tu den bang theo nhe'
  ).split(' ')
);

interface Chunk {
  doc: string;
  text: string;
  norm: string;
}

const CHUNK_TARGET = 1100;
const chunkCache = new Map<string, Chunk[]>();

function splitIntoChunks(doc: AiKnowledgeDoc): Chunk[] {
  const key = `${doc.id}|${doc.updated_at || ''}|${doc.content.length}`;
  const cached = chunkCache.get(key);
  if (cached) return cached;

  const title = doc.title || 'Tài liệu';
  const lines = doc.content
    .split(/\r?\n+/)
    .map((p) => p.trim())
    .filter((p) => p && !/^[-*_]{3,}$/.test(p));

  const chunks: Chunk[] = [];
  let heading = '';
  let buf = '';
  const flush = () => {
    const body = buf.trim();
    buf = '';
    if (body.length <= 40) return;
    // Giữ tiêu đề mục trong mỗi đoạn để không mất ngữ cảnh và truy xuất đúng mục
    const text = heading && !body.startsWith(heading) ? `${heading}\n${body}` : body;
    chunks.push({ doc: title, text, norm: normalizeVi(text) });
  };

  for (const line of lines) {
    // Dòng tiêu đề markdown: đóng đoạn hiện tại, mở mục mới
    if (/^#{1,4}\s/.test(line)) {
      flush();
      heading = line.replace(/^#{1,4}\s*/, '').replace(/\*\*/g, '').trim();
      continue;
    }
    // Dòng quá dài: tách tiếp theo câu
    const pieces = line.length > CHUNK_TARGET * 1.5 ? line.split(/(?<=[.!?;])\s+/) : [line];
    for (const piece of pieces) {
      if (buf.length + piece.length + 1 > CHUNK_TARGET && buf.length > 0) flush();
      buf += (buf ? '\n' : '') + piece;
    }
  }
  flush();

  chunkCache.set(key, chunks);
  if (chunkCache.size > 40) {
    const first = chunkCache.keys().next().value;
    if (first) chunkCache.delete(first);
  }
  return chunks;
}

export interface KnowledgeExcerpt {
  doc: string;
  text: string;
  score: number;
}

export function retrieveKnowledge(
  question: string,
  docs: AiKnowledgeDoc[] | undefined,
  opts: { maxChunks?: number; maxChars?: number } = {}
): KnowledgeExcerpt[] {
  const maxChunks = opts.maxChunks ?? 6;
  const maxChars = opts.maxChars ?? 6500;
  if (!Array.isArray(docs) || docs.length === 0) return [];

  const qTokens = normalizeVi(question)
    .split(' ')
    .filter((t) => t.length >= 2 && !STOPWORDS.has(t));
  if (qTokens.length === 0) return [];
  const bigrams: string[] = [];
  for (let i = 0; i < qTokens.length - 1; i++) bigrams.push(`${qTokens[i]} ${qTokens[i + 1]}`);

  const all: Chunk[] = [];
  for (const d of docs) {
    if (d && typeof d.content === 'string' && d.content.trim()) all.push(...splitIntoChunks(d));
  }
  if (all.length === 0) return [];

  // Độ hiếm của từ khóa trên toàn kho
  const df = new Map<string, number>();
  for (const t of qTokens) {
    const re = ` ${t} `;
    let n = 0;
    for (const c of all) if ((` ${c.norm} `).includes(re)) n++;
    df.set(t, n);
  }

  const scored: KnowledgeExcerpt[] = [];
  for (const c of all) {
    const padded = ` ${c.norm} `;
    let score = 0;
    for (const t of qTokens) {
      if (padded.includes(` ${t} `)) {
        const n = df.get(t) || 1;
        score += 1 + Math.log(1 + all.length / n);
      }
    }
    for (const b of bigrams) if (padded.includes(` ${b} `)) score += 3;
    if (normalizeVi(c.doc).split(' ').some((w) => qTokens.includes(w))) score += 1.5;
    if (score > 0) scored.push({ doc: c.doc, text: c.text, score });
  }

  scored.sort((a, b) => b.score - a.score);

  const picked: KnowledgeExcerpt[] = [];
  let used = 0;
  for (const s of scored) {
    if (picked.length >= maxChunks) break;
    if (used + s.text.length > maxChars) continue;
    // Tránh lấy hai đoạn gần như trùng nhau
    if (picked.some((p) => p.text.slice(0, 80) === s.text.slice(0, 80))) continue;
    picked.push(s);
    used += s.text.length;
  }
  return picked;
}

export function formatKnowledgeForPrompt(excerpts: KnowledgeExcerpt[]): string {
  if (excerpts.length === 0) return '';
  return excerpts.map((e, i) => `[Trích đoạn ${i + 1} - ${e.doc}]\n${e.text}`).join('\n\n');
}
