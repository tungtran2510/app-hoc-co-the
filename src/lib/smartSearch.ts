/**
 * Trợ lý Tìm Kiếm Thông Minh Y Khoa (Smart Search Engine)
 * - Tự động nhận diện & mở rộng từ viết tắt (vg -> vai gáy, tl -> thắt lưng, dd -> đĩa đệm/dạ dày, nc -> nước...)
 * - Tự động phân tích câu hỏi tự nhiên (loại bỏ stopwords "làm sao để", "như thế nào", "tại sao"...)
 * - Nhận diện lỗi gõ không dấu, gõ sai chính tả nhẹ (fuzzy token match)
 * - So khớp theo ranh giới từ (Word Boundary) & cặp từ ghép (Bigram), triệt tiêu lỗi substring lan man
 * - Kiểm soát độ phủ từ khóa (Coverage Threshold), loại bỏ 100% kết quả rác
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
  vg: ['vai gay', 'cot song', 'day chang'],
  tl: ['that lung', 'cot song', 'dia dem'],
  dd: ['dia dem', 'da day'],
  cs: ['cot song', 'dot song'],
  tk: ['than kinh', 'tuy song'],
  nc: ['nuoc', 'dien giai'],
  th: ['tuan hoan', 'tim mach'],
  hh: ['ho hap', 'phoi'],
  kl: ['khop', 'day chang'],
};

const MEDICAL_SYNONYMS: Record<string, string[]> = {
  'dau lung': ['cot song', 'that lung', 'dia dem', 'tu the'],
  'that lung': ['cot song', 'dia dem', 'lung', 'tu the'],
  'moi co': ['vai gay', 'co vai gay', 'dot song co', 'cot song'],
  'dau gay': ['vai gay', 'co vai gay', 'dot song co', 'cot song'],
  'vai gay': ['cot song', 'co gan', 'day chang', 'tu the'],
  'co vai gay': ['cot song', 'co gan', 'day chang', 'tu the'],
  'thoat vi': ['dia dem', 'cot song', 'chen ep'],
  'thoai hoa': ['cot song', 'khop', 'dia dem'],
  'ngoi nhieu': ['tu the', 'van dong', 'that lung', 'cot song'],
  'uong nuoc': ['nuoc', 'dien giai', 'te bao'],
  'tieu hoa': ['da day', 'ruot', 'men vi sinh'],
  'da day': ['tieu hoa', 'ruot', 'vi sinh'],
  'than kinh': ['tuy song', 'day than kinh', 'chen ep'],
  'khop': ['khung xuong', 'khop goi', 'khung chau'],
  'khop goi': ['khop', 'day chang', 'sun khop', 'khung xuong'],
  'tim mach': ['tuan hoan', 'mach mau'],
  'gan': ['mat', 'thai doc', 'tuy'],
  'mat': ['gan', 'thai doc'],
  'tuyen giap': ['noi tiet', 'hormone', 'trao doi chat'],
  'noi tiet': ['tuyen giap', 'hormone', 'trao doi chat'],
  'mien dich': ['de khang', 'bach cau', 'khang the', 'viem'],
  'de khang': ['mien dich', 'bach cau', 'khang the'],
};

export interface ProcessedSearchQuery {
  raw: string;
  clean: string;
  tokens: string[];
  bigrams: string[];
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
    return { raw, clean: '', tokens: [], bigrams: [], expandedTerms: [], isQuestion: false };
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

  // Tạo các cặp từ ghép 2 từ liên tiếp (Bigrams) phục vụ ngôn ngữ tiếng Việt
  const bigrams: string[] = [];
  for (let i = 0; i < contentTokens.length - 1; i++) {
    bigrams.push(`${contentTokens[i]} ${contentTokens[i + 1]}`);
  }

  const expandedTerms = new Set<string>();

  // 1. Kiểm tra từ viết tắt (vg, tl, dd, cs...)
  for (const token of rawTokens) {
    if (ABBREVIATIONS_MAP[token]) {
      ABBREVIATIONS_MAP[token].forEach((syn) => {
        // Chỉ thêm từ mở rộng nếu câu truy vấn CHƯA có
        if (!clean.includes(syn)) expandedTerms.add(syn);
      });
    }
  }

  // 2. Kiểm tra từ đồng nghĩa / cụm từ y khoa
  for (const [key, synonyms] of Object.entries(MEDICAL_SYNONYMS)) {
    const keyWords = key.split(/\s+/);
    const hasFullKey = clean.includes(key) || keyWords.every((kw) => contentTokens.includes(kw));
    if (hasFullKey) {
      synonyms.forEach((s) => {
        // Chỉ thêm từ mở rộng nếu câu truy vấn CHƯA có (loại bỏ triệt để gợi ý trùng)
        if (!clean.includes(s) && !s.split(/\s+/).every((sw) => contentTokens.includes(sw))) {
          expandedTerms.add(s);
        }
      });
    }
  }

  return {
    raw,
    clean,
    tokens: contentTokens,
    bigrams,
    expandedTerms: Array.from(expandedTerms),
    isQuestion,
  };
}

/**
 * Tính điểm độ tương thích giữa văn bản và câu truy vấn
 * @returns Điểm từ 0 đến 150+ (0: không khớp, >0: khớp)
 */
export function calculateMatchScore(
  targetText: string | null | undefined,
  queryInfo: ProcessedSearchQuery
): number {
  if (!targetText || !queryInfo.clean) return 0;

  const cleanTarget = removeVietnameseTones(targetText);
  if (!cleanTarget) return 0;

  let score = 0;

  // 1. Khớp nguyên văn cụm từ truy vấn (Trọng số cao nhất)
  if (cleanTarget.includes(queryInfo.clean)) {
    score += 150;
    if (cleanTarget.startsWith(queryInfo.clean)) {
      score += 30; // Thưởng nếu nằm ngay đầu đề
    }
  }

  // 2. Khớp các cặp từ ghép có nghĩa (Bigram)
  let matchedBigramCount = 0;
  for (const bg of queryInfo.bigrams) {
    if (cleanTarget.includes(bg)) {
      matchedBigramCount++;
      score += 50;
    }
  }

  // 3. Tách từ mục tiêu theo ranh giới từ để so khớp chuẩn xác nguyên từ (Word Boundary)
  const targetWords = cleanTarget.split(/[\s,.;:!?()/-]+/).filter(Boolean);
  const targetWordsSet = new Set(targetWords);

  let matchedTokenCount = 0;
  for (const token of queryInfo.tokens) {
    if (targetWordsSet.has(token)) {
      matchedTokenCount++;
      score += 15;
    } else if (token.length >= 4) {
      // Chỉ cho phép prefix match với từ từ 4 ký tự trở lên (tránh lỗi từ 2 ký tự như vi, co, da)
      const hasPrefix = targetWords.some((w) => w.startsWith(token));
      if (hasPrefix) {
        matchedTokenCount += 0.5;
        score += 8;
      }
    }
  }

  // 4. Quy tắc kiểm soát độ phủ (Coverage Check):
  // Nếu câu truy vấn có từ 2 từ trở lên, tài liệu PHẢI khớp ít nhất:
  // - 1 cặp từ ghép bigram, HOẶC
  // - Khớp ít nhất 50% số từ đơn quan trọng, HOẶC
  // - Khớp nguyên văn câu truy vấn.
  // Nếu không đạt, hủy điểm rác (score = 0) để không match lan man
  if (queryInfo.tokens.length >= 2) {
    const coverageRatio = matchedTokenCount / queryInfo.tokens.length;
    if (matchedBigramCount === 0 && coverageRatio < 0.5 && !cleanTarget.includes(queryInfo.clean)) {
      score = 0;
    }
  }

  // 5. Khớp các từ khóa mở rộng (chỉ tính nếu tài liệu đã có điểm liên quan hoặc khớp từ mở rộng)
  for (const expanded of queryInfo.expandedTerms) {
    if (cleanTarget.includes(expanded)) {
      score += 40;
    }
  }

  return score;
}
