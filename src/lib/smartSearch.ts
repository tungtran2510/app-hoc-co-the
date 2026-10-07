/**
 * Trợ lý Tìm Kiếm Thông Minh Y Khoa (Smart Search Engine)
 * - Tự động nhận diện & mở rộng từ viết tắt (vg -> vai gáy, tl -> thắt lưng, dd -> đĩa đệm/dạ dày, nc -> nước...)
 * - Tự động phân tích câu hỏi tự nhiên (loại bỏ stopwords "làm sao để", "như thế nào", "tại sao"...)
 * - Nhận diện lỗi gõ không dấu, gõ sai chính tả nhẹ (fuzzy token match)
 * - Xếp hạng kết quả theo độ tương đồng và ngữ cảnh y khoa
 */

export function removeVietnameseTones(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

// Danh sách từ đệm / từ hỏi tự nhiên (Stopwords tiếng Việt)
const STOPWORDS = new Set([
  'lam', 'sao', 'de', 'the', 'nao', 'nhu', 'tai', 'la', 'gi', 'bi', 'chua',
  'dieu', 'tri', 'co', 'nen', 'phai', 'cho', 'toi', 'hoi', 'huong', 'dan',
  'bai', 'hoc', 'video', 've', 'va', 'cua', 'trong', 'nhung', 'cac', 'mot',
  'ngay', 'khi', 'ma', 'duoc', 'khong', 'rat', 'hay', 'cach', 'tim', 'giup',
]);

// Bản đồ từ viết tắt & từ đồng nghĩa phổ biến trong ứng dụng học cơ thể
const ABBREVIATIONS_MAP: Record<string, string[]> = {
  vg: ['vai gay', 'co', 'co vai gay'],
  tl: ['that lung', 'cot song', 'that lung'],
  dd: ['dia dem', 'da day'],
  cs: ['cot song', 'dot song'],
  tk: ['than kinh', 'tuy song'],
  nc: ['nuoc', 'uong nuoc', 'dien giai'],
  th: ['tuan hoan', 'tim mach'],
  hh: ['ho hap', 'phoi'],
  kl: ['khop', 'day chang'],
};

const MEDICAL_SYNONYMS: Record<string, string[]> = {
  'dau lung': ['cot song', 'that lung', 'dia dem', 'tu the', 'ngoi'],
  'moi co': ['vai gay', 'co vai gay', 'dot song co', 'tu the'],
  'dau gay': ['vai gay', 'co vai gay', 'dot song co'],
  'thoat vi': ['dia dem', 'cot song', 'chen ep'],
  'thoai hoa': ['cot song', 'khop', 'dia dem'],
  'ngoi nhieu': ['tu the', 'van dong', 'that lung', 'cot song'],
  'uong nuoc': ['nuoc', 'dien giai', 'te bao', 'loc than'],
  'tieu hoa': ['da day', 'ruot', 'men vi sinh', 'dinh duong'],
  'than kinh': ['tuy song', 'day than kinh', 'chen ep', 'toa'],
  'khop goi': ['khop', 'day chang', 'sun khop'],
  'tim mach': ['tuan hoan', 'mach mau', 'huyet ap'],
};

export interface ProcessedSearchQuery {
  raw: string;
  clean: string;
  tokens: string[];
  expandedTerms: string[];
  isQuestion: boolean;
}

/**
 * Phân tích và tiền xử lý câu truy vấn của người dùng
 */
export function processSearchQuery(query: string): ProcessedSearchQuery {
  const raw = query.trim();
  const clean = removeVietnameseTones(raw);

  if (!clean) {
    return { raw, clean: '', tokens: [], expandedTerms: [], isQuestion: false };
  }

  // Tách từ theo khoảng trắng
  const rawTokens = clean.split(/\s+/).filter(Boolean);

  // Nhận diện xem người dùng có đang hỏi một câu tự nhiên không
  const isQuestion = rawTokens.some((t) => STOPWORDS.has(t)) || raw.includes('?');

  // Lọc bỏ stopwords để giữ lại các từ khóa mang ý nghĩa thực sự
  let contentTokens = rawTokens.filter((t) => !STOPWORDS.has(t));
  if (contentTokens.length === 0) {
    // Nếu toàn là stopwords (ví dụ người dùng gõ chỉ 1 chữ "học"), giữ lại nguyên bản
    contentTokens = rawTokens;
  }

  const expandedTerms = new Set<string>();

  // 1. Kiểm tra từ viết tắt (vg, tl, dd, cs...)
  for (const token of rawTokens) {
    if (ABBREVIATIONS_MAP[token]) {
      ABBREVIATIONS_MAP[token].forEach((syn) => expandedTerms.add(syn));
    }
  }

  // 2. Kiểm tra từ đồng nghĩa / cụm từ y khoa
  for (const [key, synonyms] of Object.entries(MEDICAL_SYNONYMS)) {
    if (clean.includes(key) || contentTokens.some((t) => key.includes(t))) {
      synonyms.forEach((s) => expandedTerms.add(s));
    }
  }

  return {
    raw,
    clean,
    tokens: contentTokens,
    expandedTerms: Array.from(expandedTerms),
    isQuestion,
  };
}

/**
 * Tính điểm độ tương thích giữa văn bản và câu truy vấn
 * @returns Điểm từ 0 đến 100+ (0: không khớp, >0: khớp)
 */
export function calculateMatchScore(
  targetText: string | null | undefined,
  queryInfo: ProcessedSearchQuery
): number {
  if (!targetText || !queryInfo.clean) return 0;

  const cleanTarget = removeVietnameseTones(targetText);
  if (!cleanTarget) return 0;

  let score = 0;

  // 1. Khớp nguyên văn cụm từ truy vấn
  if (cleanTarget.includes(queryInfo.clean)) {
    score += 100;
    if (cleanTarget.startsWith(queryInfo.clean)) {
      score += 20; // Thưởng nếu nằm ngay đầu đề
    }
  }

  // 2. Khớp từng từ khóa nội dung (Content tokens)
  let matchedTokenCount = 0;
  for (const token of queryInfo.tokens) {
    if (cleanTarget.includes(token)) {
      matchedTokenCount++;
      score += 25;
    } else {
      // Fuzzy so khớp nhẹ: kiểm tra nếu từ target có từ bắt đầu bằng token (ví dụ: "gay" khớp "gay", "cột" khớp "cot")
      const words = cleanTarget.split(/\s+/);
      const partialMatch = words.some((w) => w.startsWith(token) || (token.length >= 4 && w.includes(token)));
      if (partialMatch) {
        matchedTokenCount += 0.5;
        score += 12;
      }
    }
  }

  // Nếu người dùng gõ nhiều từ và khớp hầu hết các từ quan trọng -> thưởng thêm
  if (queryInfo.tokens.length > 1 && matchedTokenCount >= queryInfo.tokens.length) {
    score += 40;
  }

  // 3. Khớp các từ khóa mở rộng (Từ viết tắt & Từ đồng nghĩa y khoa)
  for (const expanded of queryInfo.expandedTerms) {
    if (cleanTarget.includes(expanded)) {
      score += 35;
    }
  }

  return score;
}
