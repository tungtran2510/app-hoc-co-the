/**
 * Anatomy Admin Data Store & Version Management (LỆNH #07)
 * In-memory / File-backed persistence for Terminology, 3D Mesh mapping,
 * Clinical relations, Learning content, Audit trail, and Version Snapshots.
 */

import fs from 'fs';
import path from 'path';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AnatomyStructure {
  partId: string;
  nameVi: string;
  nameLatin: string;
  nameEn: string;
  aliasesVi: string[];
  system: 'skeletal' | 'muscular' | 'nervous' | 'cardiovascular' | 'visceral' | 'joints' | 'lymphatic';
  region: 'head_neck' | 'thorax' | 'abdomen' | 'upper_limb' | 'lower_limb' | 'spine' | 'pelvis';
  description: string;
  relations: {
    muscles: string;
    bones: string;
    nerves: string;
    vessels: string;
  };
  clinical: string;
  lessonSlug?: string;
  lessonTitle?: string;
  youtubeId?: string;
  quizQuestions?: QuizQuestion[];
  curationStatus: 'da_kiem_duyet' | 'cho_duyet' | 'can_bo_sung';
  reviewedBy?: string;
  referenceSources?: string;
  updatedAt: string;
  warnings?: string[];
}

export interface AuditLogEntry {
  id: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'ROLLBACK';
  partId: string;
  partName: string;
  author: string;
  timestamp: string;
  details: string;
}

export interface VersionSnapshot {
  version: string;
  createdAt: string;
  author: string;
  description: string;
  structuresCount: number;
  data: AnatomyStructure[];
}

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'curated_anatomy_admin.json');

// Initial seed structures with grounded clinical and anatomical accuracy
const SEED_STRUCTURES: AnatomyStructure[] = [
  {
    partId: 'femur',
    nameVi: 'Xương đùi',
    nameLatin: 'Os femoris',
    nameEn: 'Femur (Thigh bone)',
    aliasesVi: ['xương đùi', 'femur', 'xương chi dưới'],
    system: 'skeletal',
    region: 'lower_limb',
    description: 'Xương dài nhất, nặng nhất và chịu lực khỏe nhất trong cơ thể người, nối khung chậu với xương chày cẳng chân.',
    relations: {
      muscles: 'Nguyên ủy cơ rộng trong, rộng ngoài, rộng giữa; nơi bám tận cơ tứ đầu đùi, cơ mông lớn, cơ thắt lưng chậu.',
      bones: 'Đầu trên tiếp khớp ổ cối xương chậu; đầu dưới tiếp khớp lồi cầu xương chày và diện bánh chè.',
      nerves: 'Dây thần kinh đùi chạy phía trước; dây thần kinh ngồi (tọa) lớn nhất cơ thể chạy ngay phía sau.',
      vessels: 'Động mạch đùi và động mạch đùi sâu cung cấp các nhánh xiên và vòng mạch nuôi chỏm đùi.'
    },
    clinical: 'Gãy cổ xương đùi ở người cao tuổi loãng xương có nguy cơ hoại tử vô mạch chỏm đùi; gãy thân xương đùi mất 500-1500ml máu.',
    lessonSlug: '/he-van-dong/xuong-dui',
    lessonTitle: 'Giải phẫu học Hệ Xương & Cơ sinh học Xương đùi',
    youtubeId: 'dGg8fZQ6c_E',
    quizQuestions: [
      {
        question: 'Góc nghiêng sinh lý giữa cổ và thân xương đùi ở người trưởng thành bình thường là bao nhiêu?',
        options: ['Khoảng 90° - 100°', 'Khoảng 125° - 130°', 'Khoảng 145° - 160°', 'Khoảng 170° - 180°'],
        correctIndex: 1,
        explanation: 'Góc cổ - thân xương đùi (angle of inclination) bình thường ở người lớn khoảng 125°-130°. Dưới 120° là biến dạng coxa vara, trên 135° là coxa valga.'
      }
    ],
    curationStatus: 'da_kiem_duyet',
    reviewedBy: 'PGS.TS.BS. Chuyên khoa Giải Phẫu & Chấn thương Chỉnh hình',
    referenceSources: 'Terminologia Anatomica 2 (TA2), Gray’s Anatomy 42nd ed, GS. Nguyễn Quang Quyền',
    updatedAt: new Date().toISOString()
  },
  {
    partId: 'humerus',
    nameVi: 'Xương cánh tay',
    nameLatin: 'Humerus',
    nameEn: 'Humerus (Arm bone)',
    aliasesVi: ['xương cánh tay', 'humerus', 'xương chi trên'],
    system: 'skeletal',
    region: 'upper_limb',
    description: 'Xương dài của chi trên, nối đai vai với cẳng tay tại khớp khuỷu.',
    relations: {
      muscles: 'Nơi bám của cơ delta, cơ ngực lớn, cơ lưng rộng, cơ quạ cánh tay và cơ cánh tay.',
      bones: 'Khớp với ổ chảo xương vai ở đầu trên; khớp với ròng rọc xương trụ và chỏm con xương quay ở đầu dưới.',
      nerves: 'Dây thần kinh quay chạy trong rãnh xoắn; thần kinh nách ôm quanh cổ phẫu thuật; thần kinh trụ chạy sau mỏm trên lồi cầu trong.',
      vessels: 'Động mạch cánh tay chạy dọc mặt trong cùng với hai tĩnh mạch cánh tay.'
    },
    clinical: 'Gãy cổ phẫu thuật dễ tổn thương thần kinh nách; gãy 1/3 giữa thân xương dễ liệt thần kinh quay (bàn tay rũ cổ cò).',
    lessonSlug: '/he-van-dong/xuong-canh-tay',
    lessonTitle: 'Cơ quan vận động: Xương cánh tay và các rãnh thần kinh',
    youtubeId: 'W4kRk_T8_qU',
    quizQuestions: [
      {
        question: 'Dây thần kinh nào chạy trong rãnh xoắn ở mặt sau thân xương cánh tay?',
        options: ['Dây thần kinh giữa', 'Dây thần kinh quay', 'Dây thần kinh trụ', 'Dây thần kinh cơ bì'],
        correctIndex: 1,
        explanation: 'Dây thần kinh quay chạy trong rãnh thần kinh quay (rãnh xoắn) cùng động mạch cánh tay sâu.'
      }
    ],
    curationStatus: 'da_kiem_duyet',
    reviewedBy: 'BS. CKII Ngoại Chấn Thương',
    referenceSources: 'TA2, Giải Phẫu Người - ĐH Y Dược TP.HCM',
    updatedAt: new Date().toISOString()
  },
  {
    partId: 'left_ventricle',
    nameVi: 'Tâm thất trái',
    nameLatin: 'Ventriculus sinister cordis',
    nameEn: 'Left ventricle of heart',
    aliasesVi: ['tâm thất trái', 'thất trái', 'buồng tim trái'],
    system: 'cardiovascular',
    region: 'thorax',
    description: 'Buồng tim cơ dày nhất, có nhiệm vụ bơm máu giàu oxy vào động mạch chủ để nuôi toàn bộ cơ thể.',
    relations: {
      muscles: 'Thành cơ tim dày 8-12 mm, gấp 3 lần tâm thất phải, có cơ nhú trước và sau.',
      bones: 'Nằm sau xương ức và các sụn sườn 3-5 bên trái.',
      nerves: 'Chi phối bởi đám rối tim tự chủ (thần kinh lang thang đối giao cảm và chuỗi hạch giao cảm cổ-ngực).',
      vessels: 'Được cấp máu chủ yếu bởi động mạch vành trái (nhánh gian thất trước LAD và nhánh mũ LCx).'
    },
    clinical: 'Tắc động mạch gian thất trước (LAD) dẫn đến nhồi máu cơ tim thành trước mỏm thất trái, gây suy bơm cấp.',
    lessonSlug: '/he-tuan-hoan/tam-that-trai',
    lessonTitle: 'Sinh lý học Tim: Chu kỳ co bóp tâm thất trái',
    youtubeId: 'qMPXyvFxO28',
    quizQuestions: [
      {
        question: 'Tại sao thành cơ của tâm thất trái dày gấp khoảng 3 lần tâm thất phải?',
        options: [
          'Vì thể tích máu chứa trong thất trái nhiều gấp 3 lần',
          'Vì thất trái phải thắng áp lực ngoại vi cao của vòng đại tuần hoàn (80-120 mmHg)',
          'Vì thất trái chứa máu nghèo oxy có độ nhớt cao hơn',
          'Vì thất trái không có van đóng mở'
        ],
        correctIndex: 1,
        explanation: 'Thất trái phải co bóp tạo áp lực tống máu vào vòng đại tuần hoàn có sức cản lớn (120 mmHg), trong khi thất phải chỉ bơm vào tiểu tuần hoàn phổi (25 mmHg).'
      }
    ],
    curationStatus: 'da_kiem_duyet',
    reviewedBy: 'TS.BS. Tim mạch can thiệp',
    referenceSources: 'Guyton and Hall Textbook of Medical Physiology, TA2',
    updatedAt: new Date().toISOString()
  },
  {
    partId: 'biceps_brachii',
    nameVi: 'Cơ nhị đầu cánh tay',
    nameLatin: 'Musculus biceps brachii',
    nameEn: 'Biceps brachii muscle',
    aliasesVi: ['cơ nhị đầu', 'biceps', 'chuột tay'],
    system: 'muscular',
    region: 'upper_limb',
    description: 'Cơ hai đầu nằm ở vùng cánh tay trước, có tác dụng gập cẳng tay và ngửa bàn tay mạnh nhất khi khuỷu gập 90°.',
    relations: {
      muscles: 'Nằm nông hơn cơ cánh tay và cơ quạ cánh tay; đối vận với cơ tam đầu cánh tay.',
      bones: 'Đầu dài bám củ trên ổ chảo xương vai; đầu ngắn bám mỏm quạ; gân chung bám vào lồi củ xương quay.',
      nerves: 'Chi phối vận động bởi dây thần kinh cơ bì (C5, C6).',
      vessels: 'Cấp máu bởi các nhánh cơ của động mạch cánh tay.'
    },
    clinical: 'Đứt gân đầu dài cơ nhị đầu tạo dấu hiệu "Popeye muscle" phồng lên ở cánh tay dưới.',
    lessonSlug: '/he-van-dong/co-nhi-dau',
    lessonTitle: 'Cơ sinh học: Cơ nhị đầu và cơ chế gập khuỷu',
    curationStatus: 'da_kiem_duyet',
    reviewedBy: 'ThS.BS. Y học thể thao',
    referenceSources: 'TA2, Kinesiology of the Musculoskeletal System',
    updatedAt: new Date().toISOString()
  },
  {
    partId: 'sciatic_nerve',
    nameVi: 'Dây thần kinh ngồi (Thần kinh tọa)',
    nameLatin: 'Nervus ischiadicus',
    nameEn: 'Sciatic nerve',
    aliasesVi: ['thần kinh tọa', 'dây thần kinh ngồi', 'sciatic nerve'],
    system: 'nervous',
    region: 'lower_limb',
    description: 'Dây thần kinh lớn nhất và dài nhất trong cơ thể người, xuất phát từ đám rối cùng (L4-S3) chạy xuống chi dưới.',
    relations: {
      muscles: 'Chui qua khuyết ngồi lớn ở bờ dưới cơ hình lê (piriformis), chạy dọc mặt sau đùi sâu hơn cơ gân đùi.',
      bones: 'Chạy sau xương ụ ngồi và thân xương đùi.',
      nerves: 'Tách thành hai nhánh tận: Thần kinh chày và Thần kinh mác chung ở hố khoeo.',
      vessels: 'Đi cùng động mạch thần kinh ngồi (nhánh của ĐM mông dưới).'
    },
    clinical: 'Hội chứng cơ hình lê chèn ép thần kinh tọa gây đau rát lan từ mông xuống mặt sau đùi và bàn chân.',
    curationStatus: 'cho_duyet',
    reviewedBy: 'BS. Chuyên khoa Thần kinh',
    referenceSources: 'TA2, Clinical Neuroanatomy',
    updatedAt: new Date().toISOString()
  }
];

let cachedStructures: AnatomyStructure[] | null = null;
let auditLogs: AuditLogEntry[] = [
  {
    id: 'log_seed_1',
    action: 'CREATE',
    partId: 'femur',
    partName: 'Xương đùi',
    author: 'Hệ thống Quản Trị Y Khoa',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    details: 'Khởi tạo chuẩn hóa thuật ngữ TA2, 4 liên quan và bài học liên kết.'
  },
  {
    id: 'log_seed_2',
    action: 'UPDATE',
    partId: 'left_ventricle',
    partName: 'Tâm thất trái',
    author: 'TS.BS. Tim Mạch',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    details: 'Bổ sung liên kết video YouTube 3D và câu hỏi Quiz thích ứng.'
  }
];

let versionSnapshots: VersionSnapshot[] = [
  {
    version: '1.0.0',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    author: 'Ban Thư Ký Y Học',
    description: 'Bản phát hành khởi đầu: 7 hệ giải phẫu Z-Anatomy cơ bản.',
    structuresCount: 2827,
    data: SEED_STRUCTURES.slice(0, 3)
  },
  {
    version: '1.1.0',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    author: 'Hội Đồng Thẩm Định',
    description: 'Bổ sung chuẩn hóa Việt - Anh - Latinh TA2 và 4 liên quan giải phẫu.',
    structuresCount: 2827,
    data: SEED_STRUCTURES.slice(0, 4)
  }
];

export function getAnatomyStructures(): AnatomyStructure[] {
  if (cachedStructures) return cachedStructures;

  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      cachedStructures = JSON.parse(content);
    } else {
      cachedStructures = [...SEED_STRUCTURES];
      persistStructures(cachedStructures);
    }
  } catch (err) {
    console.warn('[AnatomyAdminData] Falling back to seed structures:', err);
    cachedStructures = [...SEED_STRUCTURES];
  }

  // Populate dynamic anomaly warnings
  cachedStructures?.forEach(item => {
    item.warnings = detectAnomalies(item, cachedStructures || []);
  });

  return cachedStructures || [];
}

export function saveAnatomyStructure(item: AnatomyStructure, author = 'Quản trị viên'): { success: boolean; structure: AnatomyStructure } {
  const list = getAnatomyStructures();
  const existingIdx = list.findIndex(s => s.partId === item.partId);

  item.updatedAt = new Date().toISOString();
  item.warnings = detectAnomalies(item, list);

  if (existingIdx >= 0) {
    list[existingIdx] = { ...list[existingIdx], ...item };
    auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'UPDATE',
      partId: item.partId,
      partName: item.nameVi || item.partId,
      author,
      timestamp: item.updatedAt,
      details: `Cập nhật thông tin cấu trúc, trạng thái: ${item.curationStatus}.`
    });
  } else {
    list.unshift(item);
    auditLogs.unshift({
      id: `log_${Date.now()}`,
      action: 'CREATE',
      partId: item.partId,
      partName: item.nameVi || item.partId,
      author,
      timestamp: item.updatedAt,
      details: `Thêm cấu trúc giải phẫu mới vào atlas.`
    });
  }

  persistStructures(list);
  return { success: true, structure: item };
}

export function deleteAnatomyStructure(partId: string, author = 'Quản trị viên'): boolean {
  let list = getAnatomyStructures();
  const item = list.find(s => s.partId === partId);
  if (!item) return false;

  list = list.filter(s => s.partId !== partId);
  cachedStructures = list;

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'DELETE',
    partId,
    partName: item.nameVi || partId,
    author,
    timestamp: new Date().toISOString(),
    details: 'Xóa cấu trúc khỏi atlas.'
  });

  persistStructures(list);
  return true;
}

export function detectAnomalies(item: AnatomyStructure, allItems: AnatomyStructure[]): string[] {
  const warnings: string[] = [];

  // 1. Missing required fields
  if (!item.nameVi?.trim()) warnings.push('Thiếu tên tiếng Việt chính thức');
  if (!item.nameLatin?.trim()) warnings.push('Thiếu danh pháp Latinh quốc tế TA2');
  if (!item.nameEn?.trim()) warnings.push('Thiếu tên tiếng Anh');

  // 2. Duplicate checking
  const duplicates = allItems.filter(s => s.partId === item.partId);
  if (duplicates.length > 1) {
    warnings.push(`Trùng lặp mã cấu trúc (Part ID) với ${duplicates.length - 1} mục khác`);
  }

  // 3. Clinical relations completeness
  const rel = item.relations || {};
  if (!rel.nerves?.trim() || !rel.vessels?.trim()) {
    warnings.push('Chưa hoàn thiện 4 liên quan (thiếu chi phối thần kinh hoặc mạch máu)');
  }

  // 4. Learning links
  if (!item.lessonSlug && (!item.quizQuestions || item.quizQuestions.length === 0)) {
    warnings.push('Chưa gắn kết bài học hoặc câu hỏi trắc nghiệm');
  }

  // 5. Curation status warning
  if (item.curationStatus === 'cho_duyet') {
    warnings.push('Đang ở trạng thái Chờ duyệt chuyên môn');
  } else if (item.curationStatus === 'can_bo_sung') {
    warnings.push('Cần bổ sung thêm bằng chứng y khoa');
  }

  return warnings;
}

export function createSnapshot(version: string, description: string, author = 'Quản trị viên'): VersionSnapshot {
  const currentData = getAnatomyStructures();
  const snapshot: VersionSnapshot = {
    version,
    createdAt: new Date().toISOString(),
    author,
    description,
    structuresCount: currentData.length,
    data: JSON.parse(JSON.stringify(currentData))
  };

  versionSnapshots.unshift(snapshot);
  auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'CREATE',
    partId: 'VERSION_SNAPSHOT',
    partName: `Phiên bản ${version}`,
    author,
    timestamp: snapshot.createdAt,
    details: `Tạo snapshot phiên bản mới ${version}: ${description}`
  });

  return snapshot;
}

export function rollbackVersion(version: string, author = 'Quản trị viên'): boolean {
  const target = versionSnapshots.find(v => v.version === version);
  if (!target) return false;

  cachedStructures = JSON.parse(JSON.stringify(target.data));
  persistStructures(cachedStructures || []);

  auditLogs.unshift({
    id: `log_${Date.now()}`,
    action: 'ROLLBACK',
    partId: 'ROLLBACK',
    partName: `Phiên bản ${version}`,
    author,
    timestamp: new Date().toISOString(),
    details: `Đã khôi phục dữ liệu toàn bộ Atlas về phiên bản ${version}.`
  });

  return true;
}

export function getAuditLogs(): AuditLogEntry[] {
  return auditLogs;
}

export function getVersionList(): VersionSnapshot[] {
  return versionSnapshots;
}

function persistStructures(data: AnatomyStructure[]) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.warn('[AnatomyAdminData] Write failed, maintaining in memory:', err);
  }
}
