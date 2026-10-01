/**
 * Classroom, User Roles & 3D Sharing Data Store (LỆNH #08)
 * Role-Based Access: Student, Lecturer, Admin
 * Classrooms, Assignments, Quizzes, Submissions, 3D Deep Links & Progress Analytics.
 */

import fs from 'fs';
import path from 'path';

export type UserRole = 'student' | 'lecturer' | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  avatar: string;
  specialty?: string;
  joinedClasses: string[];
}

export interface QuizQuestionItem {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface AssignmentSubmission {
  studentId: string;
  studentName: string;
  submittedAt: string;
  score: number; // 0 - 100
  answers: number[];
  notes?: string;
  teacherFeedback?: string;
}

export interface Assignment {
  id: string;
  classId: string;
  className: string;
  title: string;
  description: string;
  targetPartId: string;
  targetPartNameVi: string;
  targetSystem: string;
  shareViewUrl: string;
  dueDate: string;
  createdAt: string;
  quizQuestions: QuizQuestionItem[];
  submissions: AssignmentSubmission[];
}

export interface ClassroomStudent {
  id: string;
  name: string;
  joinedAt: string;
  progressPercent: number;
  averageScore: number;
}

export interface Classroom {
  id: string;
  name: string;
  code: string; // Invite code, e.g. "GP-YK24"
  description: string;
  lecturerId: string;
  lecturerName: string;
  createdAt: string;
  students: ClassroomStudent[];
}

export interface Shared3DView {
  id: string;
  title: string;
  authorName: string;
  authorRole: string;
  createdAt: string;
  partId: string;
  partNameVi: string;
  system: string;
  urlHash: string;
  description?: string;
}

export interface ClassroomDatabase {
  users: UserAccount[];
  classrooms: Classroom[];
  assignments: Assignment[];
  sharedViews: Shared3DView[];
  activeUserId: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), 'public', 'data', 'classrooms_data.json');

// Grounded initial seed database
const SEED_USERS: UserAccount[] = [
  {
    id: 'usr_lecturer_1',
    name: 'BS.CKII Trần Hoàng',
    role: 'lecturer',
    email: 'tranhoang.md@med.edu.vn',
    phone: '0912345678',
    avatar: '👨‍⚕️',
    specialty: 'Bộ môn Giải phẫu & Ngoại chấn thương',
    joinedClasses: ['cls_gp_co_ban', 'cls_co_xuong_khop']
  },
  {
    id: 'usr_student_1',
    name: 'Nguyễn Văn An',
    role: 'student',
    email: 'vanan.yk24@student.med.vn',
    phone: '0987654321',
    avatar: '🧑‍🎓',
    specialty: 'Sinh viên Y Đa Khoa K24',
    joinedClasses: ['cls_gp_co_ban', 'cls_co_xuong_khop']
  },
  {
    id: 'usr_student_2',
    name: 'Lê Thị Mai',
    role: 'student',
    email: 'maile.yk24@student.med.vn',
    phone: '0977889900',
    avatar: '👩‍🎓',
    specialty: 'Sinh viên Y Đa Khoa K24',
    joinedClasses: ['cls_gp_co_ban']
  },
  {
    id: 'usr_admin',
    name: 'Quản trị viên Trung tâm',
    role: 'admin',
    email: 'admin.atlas@hoc-co-the.vn',
    phone: '0909999888',
    avatar: '🛡️',
    specialty: 'Ban Thẩm định & Quản trị Hệ thống',
    joinedClasses: ['cls_gp_co_ban', 'cls_co_xuong_khop']
  }
];

const SEED_CLASSROOMS: Classroom[] = [
  {
    id: 'cls_gp_co_ban',
    name: 'Giải Phẫu Đại Cương - Y Khoa K24',
    code: 'GP-YK24',
    description: 'Chương trình chuẩn hóa giải phẫu hệ vận động, tuần hoàn và thần kinh theo TA2 cho sinh viên năm 1-2.',
    lecturerId: 'usr_lecturer_1',
    lecturerName: 'BS.CKII Trần Hoàng',
    createdAt: '2026-09-25T08:00:00.000Z',
    students: [
      {
        id: 'usr_student_1',
        name: 'Nguyễn Văn An',
        joinedAt: '2026-09-25T09:00:00.000Z',
        progressPercent: 100,
        averageScore: 95
      },
      {
        id: 'usr_student_2',
        name: 'Lê Thị Mai',
        joinedAt: '2026-09-26T10:30:00.000Z',
        progressPercent: 50,
        averageScore: 80
      }
    ]
  },
  {
    id: 'cls_co_xuong_khop',
    name: 'Chuyên đề Cơ - Xương - Khớp Lâm Sàng',
    code: 'CXK-01',
    description: 'Khảo sát 4 liên quan giải phẫu lâm sàng và chấn thương chỉnh hình trên mô hình 3D tương tác.',
    lecturerId: 'usr_lecturer_1',
    lecturerName: 'BS.CKII Trần Hoàng',
    createdAt: '2026-09-28T14:00:00.000Z',
    students: [
      {
        id: 'usr_student_1',
        name: 'Nguyễn Văn An',
        joinedAt: '2026-09-28T15:00:00.000Z',
        progressPercent: 100,
        averageScore: 100
      }
    ]
  }
];

const SEED_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_femur_1',
    classId: 'cls_gp_co_ban',
    className: 'Giải Phẫu Đại Cương - Y Khoa K24',
    title: 'Khảo sát Xương đùi & Cơ sinh học Khớp háng',
    description: 'Xoay mô hình 3D, cô lập (Isolate) Xương đùi, kiểm tra góc nghiêng cổ - thân và vị trí dây thần kinh ngồi phía sau.',
    targetPartId: 'femur',
    targetPartNameVi: 'Xương đùi',
    targetSystem: 'skeletal',
    shareViewUrl: '/giai-phau-3d#sys=skeletal&sel=femur&iso=femur',
    dueDate: '2026-10-10T23:59:59.000Z',
    createdAt: '2026-09-27T08:00:00.000Z',
    quizQuestions: [
      {
        question: 'Góc nghiêng sinh lý giữa cổ và thân xương đùi ở người trưởng thành bình thường là bao nhiêu?',
        options: ['Khoảng 90° - 100°', 'Khoảng 125° - 130°', 'Khoảng 145° - 160°', 'Khoảng 170° - 180°'],
        correctIndex: 1,
        explanation: 'Góc cổ - thân xương đùi bình thường khoảng 125°-130°. Dưới 120° là coxa vara, trên 135° là coxa valga.'
      },
      {
        question: 'Dây thần kinh lớn nhất cơ thể chạy ngay phía sau xương đùi là gì?',
        options: ['Dây thần kinh đùi', 'Dây thần kinh bịt', 'Dây thần kinh ngồi (thần kinh tọa)', 'Dây thần kinh chày'],
        correctIndex: 2,
        explanation: 'Dây thần kinh ngồi (Sciatic nerve) là dây thần kinh lớn nhất cơ thể, chạy ở mặt sau khớp háng và đùi.'
      }
    ],
    submissions: [
      {
        studentId: 'usr_student_1',
        studentName: 'Nguyễn Văn An',
        submittedAt: '2026-09-29T10:15:00.000Z',
        score: 100,
        answers: [1, 2],
        notes: 'Đã hoàn thành khảo sát 3D và đối chiếu lồi cầu trong - lồi cầu ngoài.',
        teacherFeedback: 'Rất tốt! Cần chú ý thêm vùng mấu chuyển lớn nơi bám cơ mông nhỡ.'
      },
      {
        studentId: 'usr_student_2',
        studentName: 'Lê Thị Mai',
        submittedAt: '2026-09-30T16:20:00.000Z',
        score: 50,
        answers: [1, 0],
        notes: 'Em đã nộp bài, câu 2 em chọn nhầm thần kinh đùi.',
        teacherFeedback: 'Thần kinh đùi chạy phía trước; thần kinh ngồi mới chạy phía sau. Hãy xem lại góc nhìn 3D hệ thần kinh nhé.'
      }
    ]
  },
  {
    id: 'asg_heart_1',
    classId: 'cls_gp_co_ban',
    className: 'Giải Phẫu Đại Cương - Y Khoa K24',
    title: 'Giải phẫu buồng tim: Tâm thất trái & Động mạch chủ',
    description: 'Khảo sát cấu trúc thành cơ dày của tâm thất trái và đối chiếu nhánh động mạch vành nuôi tim trên mô hình 3D.',
    targetPartId: 'left_ventricle',
    targetPartNameVi: 'Tâm thất trái',
    targetSystem: 'cardiovascular',
    shareViewUrl: '/giai-phau-3d#sys=cardiovascular&sel=left_ventricle&iso=left_ventricle',
    dueDate: '2026-10-15T23:59:59.000Z',
    createdAt: '2026-09-29T09:00:00.000Z',
    quizQuestions: [
      {
        question: 'Tại sao thành cơ của tâm thất trái lại dày gấp 3 lần tâm thất phải?',
        options: [
          'Vì tâm thất trái phải bơm máu thắng sức cản tuần hoàn hệ thống toàn thân',
          'Vì tâm thất trái chứa máu nghèo oxy',
          'Vì áp lực động mạch phổi cao hơn động mạch chủ',
          'Do van hai lá dày hơn van ba lá'
        ],
        correctIndex: 0,
        explanation: 'Tâm thất trái bơm máu vào động mạch chủ với áp lực tâm thu ~120 mmHg để đi nuôi toàn cơ thể, nên thành cơ phát triển dày hơn.'
      }
    ],
    submissions: [
      {
        studentId: 'usr_student_1',
        studentName: 'Nguyễn Văn An',
        submittedAt: '2026-09-30T09:00:00.000Z',
        score: 100,
        answers: [0],
        notes: 'Đã quan sát rõ cột cơ và thừng gân van hai lá trên mô hình 3D.',
        teacherFeedback: 'Chính xác! Nắm rất vững sinh lý tuần hoàn.'
      }
    ]
  }
];

const SEED_SHARED_VIEWS: Shared3DView[] = [
  {
    id: 'view_femur_neck',
    title: 'Góc nhìn cổ xương đùi & Khớp háng (125°)',
    authorName: 'BS.CKII Trần Hoàng',
    authorRole: 'Giảng viên',
    createdAt: '2026-09-28T10:00:00.000Z',
    partId: 'femur',
    partNameVi: 'Xương đùi',
    system: 'skeletal',
    urlHash: '#sys=skeletal&cam=0.18,0.92,1.85,0,0.85,0&sel=femur&iso=femur',
    description: 'Góc nghiêng trực diện để đo góc cổ - thân xương đùi phục vụ chẩn đoán thoái hóa khớp háng.'
  },
  {
    id: 'view_biceps_cubital',
    title: 'Cơ nhị đầu cánh tay & Hố khuỷu',
    authorName: 'BS.CKII Trần Hoàng',
    authorRole: 'Giảng viên',
    createdAt: '2026-09-29T14:30:00.000Z',
    partId: 'biceps_brachii',
    partNameVi: 'Cơ nhị đầu cánh tay',
    system: 'muscular',
    urlHash: '#sys=muscular&sel=biceps_brachii&iso=biceps_brachii',
    description: 'Quan sát gân cơ nhị đầu bám tận củ quay và trẽ cân nhị đầu che phủ động mạch cánh tay.'
  }
];

function loadDatabase(): ClassroomDatabase {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const raw = fs.readFileSync(DATA_FILE_PATH, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed.classrooms && parsed.users) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('[classroomData] Error loading from file, falling back to seeds:', e);
  }

  // Create initial persistent file
  const db: ClassroomDatabase = {
    users: SEED_USERS,
    classrooms: SEED_CLASSROOMS,
    assignments: SEED_ASSIGNMENTS,
    sharedViews: SEED_SHARED_VIEWS,
    activeUserId: 'usr_student_1'
  };
  saveDatabase(db);
  return db;
}

function saveDatabase(db: ClassroomDatabase) {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('[classroomData] Error saving database file:', e);
  }
}

// =========================================================================
// PUBLIC API METHODS
// =========================================================================

export function getClassroomDB(): ClassroomDatabase {
  return loadDatabase();
}

export function setActiveUser(userId: string): UserAccount {
  const db = loadDatabase();
  const found = db.users.find(u => u.id === userId);
  if (!found) {
    throw new Error(`User not found: ${userId}`);
  }
  db.activeUserId = userId;
  saveDatabase(db);
  return found;
}

export function getActiveUser(): UserAccount {
  const db = loadDatabase();
  const user = db.users.find(u => u.id === db.activeUserId);
  return user || db.users[0];
}

export function createClassroom(name: string, description: string, lecturerId: string): Classroom {
  const db = loadDatabase();
  const lecturer = db.users.find(u => u.id === lecturerId) || db.users[0];

  // Generate unique code, e.g. "GP-842"
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  const codePrefix = name.split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'LH';
  const code = `${codePrefix}-${randomSuffix}`;

  const newClass: Classroom = {
    id: `cls_${Date.now()}`,
    name: name.trim(),
    code,
    description: description.trim(),
    lecturerId: lecturer.id,
    lecturerName: lecturer.name,
    createdAt: new Date().toISOString(),
    students: []
  };

  db.classrooms.unshift(newClass);
  // Add class to lecturer
  if (!lecturer.joinedClasses.includes(newClass.id)) {
    lecturer.joinedClasses.push(newClass.id);
  }

  saveDatabase(db);
  return newClass;
}

export function joinClassroomByCode(code: string, studentId: string): Classroom {
  const db = loadDatabase();
  const normalizedCode = code.trim().toUpperCase();
  const targetClass = db.classrooms.find(c => c.code.toUpperCase() === normalizedCode);
  if (!targetClass) {
    throw new Error(`Không tìm thấy lớp học với mã: "${code}"`);
  }

  const student = db.users.find(u => u.id === studentId);
  if (!student) {
    throw new Error('Không tìm thấy thông tin học viên');
  }

  // Check if already joined
  const alreadyIn = targetClass.students.some(s => s.id === studentId);
  if (!alreadyIn) {
    targetClass.students.push({
      id: student.id,
      name: student.name,
      joinedAt: new Date().toISOString(),
      progressPercent: 0,
      averageScore: 0
    });
  }

  if (!student.joinedClasses.includes(targetClass.id)) {
    student.joinedClasses.push(targetClass.id);
  }

  saveDatabase(db);
  return targetClass;
}

export function createAssignment(params: {
  classId: string;
  title: string;
  description: string;
  targetPartId: string;
  targetPartNameVi: string;
  targetSystem: string;
  shareViewUrl?: string;
  dueDate: string;
  quizQuestions: QuizQuestionItem[];
}): Assignment {
  const db = loadDatabase();
  const targetClass = db.classrooms.find(c => c.id === params.classId);
  if (!targetClass) {
    throw new Error('Lớp học không tồn tại');
  }

  const newAssignment: Assignment = {
    id: `asg_${Date.now()}`,
    classId: params.classId,
    className: targetClass.name,
    title: params.title.trim(),
    description: params.description.trim(),
    targetPartId: params.targetPartId,
    targetPartNameVi: params.targetPartNameVi,
    targetSystem: params.targetSystem || 'skeletal',
    shareViewUrl: params.shareViewUrl || `/giai-phau-3d#sys=${params.targetSystem}&sel=${params.targetPartId}&iso=${params.targetPartId}`,
    dueDate: params.dueDate || new Date(Date.now() + 7 * 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    quizQuestions: params.quizQuestions || [],
    submissions: []
  };

  db.assignments.unshift(newAssignment);
  saveDatabase(db);
  return newAssignment;
}

export function submitAssignment(params: {
  assignmentId: string;
  studentId: string;
  studentName: string;
  answers: number[];
  notes?: string;
}): { score: number; totalQuestions: number; submission: AssignmentSubmission } {
  const db = loadDatabase();
  const assignment = db.assignments.find(a => a.id === params.assignmentId);
  if (!assignment) {
    throw new Error('Bài tập không tồn tại');
  }

  // Calculate score
  const total = assignment.quizQuestions.length;
  let correctCount = 0;
  assignment.quizQuestions.forEach((q, idx) => {
    if (params.answers[idx] === q.correctIndex) {
      correctCount++;
    }
  });

  const score = total > 0 ? Math.round((correctCount / total) * 100) : 100;

  const existingSubIdx = assignment.submissions.findIndex(s => s.studentId === params.studentId);
  const subData: AssignmentSubmission = {
    studentId: params.studentId,
    studentName: params.studentName,
    submittedAt: new Date().toISOString(),
    score,
    answers: params.answers,
    notes: params.notes || '',
    teacherFeedback: ''
  };

  if (existingSubIdx >= 0) {
    assignment.submissions[existingSubIdx] = subData;
  } else {
    assignment.submissions.push(subData);
  }

  // Update student stats in class
  const targetClass = db.classrooms.find(c => c.id === assignment.classId);
  if (targetClass) {
    const studentInClass = targetClass.students.find(s => s.id === params.studentId);
    if (studentInClass) {
      const classAssignments = db.assignments.filter(a => a.classId === assignment.classId);
      const studentSubmissions = classAssignments
        .map(a => a.submissions.find(s => s.studentId === params.studentId))
        .filter(Boolean);

      studentInClass.progressPercent = Math.round((studentSubmissions.length / classAssignments.length) * 100);
      const sumScores = studentSubmissions.reduce((acc: number, curr: any) => acc + (curr?.score || 0), 0);
      studentInClass.averageScore = studentSubmissions.length > 0 ? Math.round(sumScores / studentSubmissions.length) : 0;
    }
  }

  saveDatabase(db);
  return { score, totalQuestions: total, submission: subData };
}

export function gradeSubmission(params: {
  assignmentId: string;
  studentId: string;
  teacherFeedback: string;
  adjustedScore?: number;
}): AssignmentSubmission {
  const db = loadDatabase();
  const assignment = db.assignments.find(a => a.id === params.assignmentId);
  if (!assignment) {
    throw new Error('Bài tập không tồn tại');
  }

  const sub = assignment.submissions.find(s => s.studentId === params.studentId);
  if (!sub) {
    throw new Error('Học viên chưa nộp bài này');
  }

  sub.teacherFeedback = params.teacherFeedback;
  if (typeof params.adjustedScore === 'number') {
    sub.score = params.adjustedScore;
  }

  saveDatabase(db);
  return sub;
}

export function createShared3DView(params: {
  title: string;
  authorName: string;
  authorRole: string;
  partId: string;
  partNameVi: string;
  system: string;
  urlHash: string;
  description?: string;
}): Shared3DView {
  const db = loadDatabase();
  const newView: Shared3DView = {
    id: `view_${Date.now()}`,
    title: params.title.trim() || `Góc nhìn: ${params.partNameVi}`,
    authorName: params.authorName || 'Bác sĩ / Giảng viên',
    authorRole: params.authorRole || 'Giảng viên',
    createdAt: new Date().toISOString(),
    partId: params.partId,
    partNameVi: params.partNameVi,
    system: params.system,
    urlHash: params.urlHash,
    description: params.description || ''
  };

  db.sharedViews.unshift(newView);
  saveDatabase(db);
  return newView;
}
