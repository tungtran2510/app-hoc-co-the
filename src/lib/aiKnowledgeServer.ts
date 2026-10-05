import fs from 'fs';
import path from 'path';
import { AiKnowledgeDoc } from './types';
import { DEFAULT_AI_TRAINING } from '../data/sample';

let cachedMasterDocs: AiKnowledgeDoc[] | null = null;

/**
 * Tải 9 Đại Chuyên Đề Tri Thức từ file cục bộ trên máy chủ.
 * Tốc độ: < 1ms (đọc từ bộ nhớ ram sau lần đầu), không tốn 1 byte truyền tải qua Supabase.
 */
export function getMasterKnowledgeDocs(): AiKnowledgeDoc[] {
  if (cachedMasterDocs && cachedMasterDocs.length > 0) {
    return cachedMasterDocs;
  }

  try {
    const jsonPath = path.join(process.cwd(), 'data', 'knowledge', 'ai_training_complete_knowledge.json');
    if (fs.existsSync(jsonPath)) {
      const raw = fs.readFileSync(jsonPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.documents) && parsed.documents.length > 0) {
        cachedMasterDocs = parsed.documents;
        return cachedMasterDocs!;
      }
    }
  } catch (err) {
    console.error('Lỗi khi nạp master knowledge từ disk:', err);
  }

  return DEFAULT_AI_TRAINING.documents || [];
}
