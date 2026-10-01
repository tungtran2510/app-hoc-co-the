'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Users,
  BookOpen,
  Share2,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Plus,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Eye,
  Layers,
  Shield,
  UserCheck,
  RefreshCw,
  FileText,
  ChevronRight,
  X,
  AlertCircle,
  Sparkles,
  Info
} from 'lucide-react';
import {
  UserAccount,
  Classroom,
  Assignment,
  Shared3DView,
  QuizQuestionItem,
  AssignmentSubmission
} from '@/lib/classroomData';

const COMMON_STRUCTURES = [
  { id: 'femur', nameVi: 'Xương đùi', system: 'skeletal' },
  { id: 'humerus', nameVi: 'Xương cánh tay', system: 'skeletal' },
  { id: 'biceps_brachii', nameVi: 'Cơ nhị đầu cánh tay', system: 'muscular' },
  { id: 'left_ventricle', nameVi: 'Tâm thất trái', system: 'cardiovascular' },
  { id: 'sciatic_nerve', nameVi: 'Thần kinh ngồi (tọa)', system: 'nervous' },
  { id: 'liver', nameVi: 'Gan & Đường mật', system: 'visceral' },
  { id: 'knee_joint', nameVi: 'Khớp gối & Dây chằng chéo', system: 'joints' }
];

export default function ClassroomHubPage() {
  const [activeUser, setActiveUser] = useState<UserAccount | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [sharedViews, setSharedViews] = useState<Shared3DView[]>([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalAssignments: 0,
    totalSubmissions: 0
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'classes' | 'assignments' | 'progress' | 'shared_views'>('classes');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Modals
  const [createClassModalOpen, setCreateClassModalOpen] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassDesc, setNewClassDesc] = useState<string>('');

  const [joinModalOpen, setJoinModalOpen] = useState<boolean>(false);
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');

  const [createAssignmentModalOpen, setCreateAssignmentModalOpen] = useState<boolean>(false);
  const [asgClassId, setAsgClassId] = useState<string>('');
  const [asgTitle, setAsgTitle] = useState<string>('');
  const [asgDesc, setAsgDesc] = useState<string>('');
  const [asgPartId, setAsgPartId] = useState<string>('femur');
  const [asgQuizList, setAsgQuizList] = useState<QuizQuestionItem[]>([
    {
      question: 'Góc nghiêng sinh lý giữa cổ và thân xương đùi ở người lớn là bao nhiêu?',
      options: ['90° - 100°', '125° - 130°', '145° - 160°', '170° - 180°'],
      correctIndex: 1,
      explanation: 'Góc cổ - thân xương đùi bình thường khoảng 125°-130°.'
    }
  ]);

  // Quiz Modal for Student
  const [activeAssignmentForQuiz, setActiveAssignmentForQuiz] = useState<Assignment | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [studentNotes, setStudentNotes] = useState<string>('');
  const [quizResult, setQuizResult] = useState<{ score: number; total: number } | null>(null);

  // Review & Feedback Modal for Teacher
  const [activeSubmissionForReview, setActiveSubmissionForReview] = useState<{
    assignment: Assignment;
    submission: AssignmentSubmission;
  } | null>(null);
  const [teacherFeedbackInput, setTeacherFeedbackInput] = useState<string>('');

  // Share View Modal
  const [createShareModalOpen, setCreateShareModalOpen] = useState<boolean>(false);
  const [shareTitle, setShareTitle] = useState<string>('');
  const [sharePartId, setSharePartId] = useState<string>('femur');
  const [shareDesc, setShareDesc] = useState<string>('');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    showToast(`Đã sao chép ${label}!`);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const loadData = async (userId?: string) => {
    setLoading(true);
    try {
      const url = userId ? `/api/classroom?userId=${userId}` : '/api/classroom';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setActiveUser(data.activeUser);
        setUsers(data.users || []);
        setClassrooms(data.classrooms || []);
        setAssignments(data.assignments || []);
        setSharedViews(data.sharedViews || []);
        setStats(data.stats || { totalClasses: 0, totalStudents: 0, totalAssignments: 0, totalSubmissions: 0 });
      }
    } catch (e) {
      showToast('Lỗi khi tải dữ liệu lớp học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSwitchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'SWITCH_USER', userId })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã chuyển sang tài khoản: ${data.user.name}`);
        await loadData(userId);
      }
    } catch (e) {
      showToast('Lỗi khi đổi người dùng');
    }
  };

  const handleCreateClass = async () => {
    if (!newClassName.trim()) {
      showToast('Vui lòng nhập tên lớp học');
      return;
    }
    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_CLASS',
          name: newClassName.trim(),
          description: newClassDesc.trim(),
          lecturerId: activeUser?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã tạo lớp "${data.classroom.name}" thành công!`);
        setCreateClassModalOpen(false);
        setNewClassName('');
        setNewClassDesc('');
        await loadData();
      } else {
        showToast(data.error || 'Lỗi khi tạo lớp');
      }
    } catch (e) {
      showToast('Lỗi khi gửi yêu cầu');
    }
  };

  const handleJoinClass = async () => {
    if (!joinCodeInput.trim()) {
      showToast('Vui lòng nhập mã lớp học');
      return;
    }
    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'JOIN_CLASS',
          code: joinCodeInput.trim(),
          studentId: activeUser?.id
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã tham gia lớp "${data.classroom.name}"!`);
        setJoinModalOpen(false);
        setJoinCodeInput('');
        await loadData();
      } else {
        showToast(data.error || 'Mã lớp không hợp lệ');
      }
    } catch (e) {
      showToast('Lỗi khi tham gia lớp');
    }
  };

  const handleCreateAssignment = async () => {
    if (!asgTitle.trim() || !asgClassId) {
      showToast('Vui lòng chọn lớp và nhập tiêu đề bài tập');
      return;
    }
    const partObj = COMMON_STRUCTURES.find(p => p.id === asgPartId) || COMMON_STRUCTURES[0];

    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_ASSIGNMENT',
          classId: asgClassId,
          title: asgTitle.trim(),
          description: asgDesc.trim(),
          targetPartId: partObj.id,
          targetPartNameVi: partObj.nameVi,
          targetSystem: partObj.system,
          shareViewUrl: `/giai-phau-3d#sys=${partObj.system}&sel=${partObj.id}&iso=${partObj.id}`,
          dueDate: new Date(Date.now() + 7 * 86400000).toISOString(),
          quizQuestions: asgQuizList
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã giao bài tập "${data.assignment.title}" cho lớp!`);
        setCreateAssignmentModalOpen(false);
        setAsgTitle('');
        setAsgDesc('');
        await loadData();
      } else {
        showToast(data.error || 'Lỗi khi giao bài tập');
      }
    } catch (e) {
      showToast('Lỗi kết nối khi giao bài');
    }
  };

  const handleSubmitQuiz = async () => {
    if (!activeAssignmentForQuiz || !activeUser) return;

    const answersArray = activeAssignmentForQuiz.quizQuestions.map((_, idx) =>
      typeof quizAnswers[idx] === 'number' ? quizAnswers[idx] : -1
    );

    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SUBMIT_ASSIGNMENT',
          assignmentId: activeAssignmentForQuiz.id,
          studentId: activeUser.id,
          studentName: activeUser.name,
          answers: answersArray,
          notes: studentNotes
        })
      });
      const data = await res.json();
      if (data.success) {
        setQuizResult({ score: data.score, total: data.totalQuestions });
        showToast(`Nộp bài thành công! Đạt ${data.score}/100 điểm`);
        await loadData();
      } else {
        showToast(data.error || 'Lỗi khi nộp bài');
      }
    } catch (e) {
      showToast('Lỗi kết nối khi nộp bài');
    }
  };

  const handleGradeSubmission = async () => {
    if (!activeSubmissionForReview) return;
    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'GRADE_SUBMISSION',
          assignmentId: activeSubmissionForReview.assignment.id,
          studentId: activeSubmissionForReview.submission.studentId,
          teacherFeedback: teacherFeedbackInput
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast('Đã gửi phản hồi nhận xét cho học viên');
        setActiveSubmissionForReview(null);
        await loadData();
      }
    } catch (e) {
      showToast('Lỗi khi lưu nhận xét');
    }
  };

  const handleCreateShareView = async () => {
    if (!shareTitle.trim()) {
      showToast('Vui lòng nhập tên góc nhìn 3D');
      return;
    }
    const partObj = COMMON_STRUCTURES.find(p => p.id === sharePartId) || COMMON_STRUCTURES[0];

    try {
      const res = await fetch('/api/classroom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_SHARED_VIEW',
          title: shareTitle.trim(),
          authorName: activeUser?.name || 'Giảng viên',
          authorRole: activeUser?.role === 'lecturer' ? 'Giảng viên' : 'Sinh viên',
          partId: partObj.id,
          partNameVi: partObj.nameVi,
          system: partObj.system,
          urlHash: `#sys=${partObj.system}&sel=${partObj.id}&iso=${partObj.id}`,
          description: shareDesc.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Đã chia sẻ góc nhìn 3D "${data.sharedView.title}"`);
        setCreateShareModalOpen(false);
        setShareTitle('');
        setShareDesc('');
        await loadData();
      }
    } catch (e) {
      showToast('Lỗi khi chia sẻ góc nhìn 3D');
    }
  };

  const isTeacherOrAdmin = activeUser?.role === 'lecturer' || activeUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 selection:bg-purple-500 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-xl bg-purple-950/90 text-purple-200 border border-purple-500/50 shadow-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-4">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white">
                  Lớp Học & Chia Sẻ Giải Phẫu 3D
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-950 border border-purple-500/50 text-purple-300">
                  LỆNH #08
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Phân quyền Người học – Giảng viên • Giao bài & Quiz 3D • Chia sẻ góc nhìn trực tiếp
              </p>
            </div>
          </div>

          {/* User Profile & Role Switcher */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Active User Card with Switcher */}
            <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl">
              <span className="text-xl">{activeUser?.avatar || '👤'}</span>
              <div className="text-left">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{activeUser?.name || 'Đang tải...'}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      activeUser?.role === 'lecturer'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : activeUser?.role === 'admin'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {activeUser?.role === 'lecturer'
                      ? 'Giảng viên'
                      : activeUser?.role === 'admin'
                      ? 'Quản trị'
                      : 'Sinh viên'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">{activeUser?.specialty}</div>
              </div>
            </div>

            {/* Quick Fast Role Switcher */}
            <select
              value={activeUser?.id || ''}
              onChange={e => handleSwitchUser(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-purple-300 font-medium focus:outline-none focus:ring-1 focus:ring-purple-500"
              title="Chuyển đổi vai trò người học / giảng viên"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>
                  {u.avatar} {u.name} ({u.role === 'lecturer' ? 'Giảng viên' : u.role === 'admin' ? 'Admin' : 'Sinh viên'})
                </option>
              ))}
            </select>

            {/* Action buttons based on Role */}
            {isTeacherOrAdmin ? (
              <>
                <button
                  onClick={() => setCreateClassModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo Lớp</span>
                </button>
                <button
                  onClick={() => {
                    if (classrooms.length > 0) setAsgClassId(classrooms[0].id);
                    setCreateAssignmentModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Giao Bài 3D</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setJoinModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Nhập Mã Lớp</span>
              </button>
            )}

            <Link
              href="/giai-phau-3d"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
              <span>3D Atlas</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>{isTeacherOrAdmin ? 'Lớp Đang Giảng Dạy' : 'Lớp Đã Tham Gia'}</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{classrooms.length}</span>
              <span className="text-xs text-slate-400">lớp học</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
              <span>{isTeacherOrAdmin ? 'Tổng Số Học Viên' : 'Tiến Độ Học Tập'}</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-300">
                {isTeacherOrAdmin ? stats.totalStudents : '100%'}
              </span>
              <span className="text-xs text-emerald-400/80">
                {isTeacherOrAdmin ? 'thành viên' : 'hoàn thành'}
              </span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
              <span>Nhiệm Vụ & Bài Tập 3D</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-300">{assignments.length}</span>
              <span className="text-xs text-amber-400/80">bài tập</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-indigo-400 text-xs font-medium">
              <span>Góc Nhìn 3D Chia Sẻ</span>
              <Share2 className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-indigo-300">{sharedViews.length}</span>
              <span className="text-xs text-indigo-400/80">góc nhìn lưu</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('classes')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'classes'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Danh Sách Lớp Học ({classrooms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'assignments'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>2. Bài Tập & Quiz 3D ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'progress'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. Theo Dõi Tiến Độ Học Viên</span>
          </button>

          <button
            onClick={() => setActiveTab('shared_views')}
            className={`py-2.5 px-4 text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'shared_views'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>4. Thư Viện Góc Nhìn 3D ({sharedViews.length})</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: DANH SÁCH LỚP HỌC
            ========================================================================= */}
        {activeTab === 'classes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Không Gian Lớp Học Của Bạn</span>
                <span className="text-xs font-normal text-slate-400">
                  ({isTeacherOrAdmin ? 'Bạn có quyền quản lý và giao bài' : 'Bạn là thành viên học tập'})
                </span>
              </h2>

              {!isTeacherOrAdmin && (
                <button
                  onClick={() => setJoinModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tham Gia Lớp Bằng Mã Mời</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classrooms.map(cls => (
                <div
                  key={cls.id}
                  className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4 hover:border-purple-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white">{cls.name}</h3>
                      <p className="text-xs text-purple-400 mt-0.5">
                        Giảng viên phụ trách: <strong>{cls.lecturerName}</strong>
                      </p>
                    </div>

                    {/* Invite Code Badge with 1-click Copy */}
                    <button
                      onClick={() => copyToClipboard(cls.code, 'mã lớp')}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold hover:bg-purple-950 transition-colors"
                      title="Bấm để sao chép mã mời tham gia lớp"
                    >
                      <span>{cls.code}</span>
                      {copiedCode === cls.code ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-400" />
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">{cls.description}</p>

                  {/* Student list preview */}
                  <div className="border-t border-slate-700/80 pt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>Danh sách học viên ({cls.students.length})</span>
                      </span>
                      <span>Tiến độ trung bình: <strong>75%</strong></span>
                    </div>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {cls.students.map(st => (
                        <div
                          key={st.id}
                          className="bg-slate-900/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-xs"
                        >
                          <span className="text-slate-200 font-medium">{st.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-emerald-400 font-semibold">
                              Điểm: {st.averageScore}/100
                            </span>
                            <span className="text-[10px] bg-purple-950/80 text-purple-300 px-1.5 py-0.2 rounded border border-purple-800">
                              {st.progressPercent}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-slate-500 text-[11px]">
                      Khởi tạo: {new Date(cls.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <button
                      onClick={() => setActiveTab('assignments')}
                      className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold"
                    >
                      <span>Xem các bài tập lớp này</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: NHIỆM VỤ & BÀI TẬP 3D (ASSIGNMENTS)
            ========================================================================= */}
        {activeTab === 'assignments' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Bài Tập & Nhiệm Vụ Khảo Sát Mô Hình 3D</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-950 border border-amber-600/50 text-amber-300">
                    {assignments.length} nhiệm vụ
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Chạm mở trực tiếp góc nhìn 3D mục tiêu, làm bài quiz lâm sàng và nhận điểm tức thì
                </p>
              </div>

              {isTeacherOrAdmin && (
                <button
                  onClick={() => {
                    if (classrooms.length > 0) setAsgClassId(classrooms[0].id);
                    setCreateAssignmentModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tạo Bài Tập Mới</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {assignments.map(asg => {
                const userSubmission = asg.submissions.find(s => s.studentId === activeUser?.id);
                const hasSubmitted = !!userSubmission;

                return (
                  <div
                    key={asg.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-5 shadow-lg space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-950 border border-purple-800 text-purple-300">
                            {asg.className}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Hạn nộp: {new Date(asg.dueDate).toLocaleDateString('vi-VN')}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-1.5">{asg.title}</h3>
                        <p className="text-xs text-slate-300 mt-1">{asg.description}</p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        {hasSubmitted ? (
                          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl px-3 py-1.5 text-right">
                            <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5 justify-end">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                              <span>Đã nộp bài</span>
                            </div>
                            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                              Điểm: {userSubmission.score}/100
                            </div>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950 border border-amber-600/60 text-amber-300">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            <span>Chưa nộp bài</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Linked 3D Structure & Direct Jump Button */}
                    <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                          3D
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">
                            Cấu trúc giải phẫu mục tiêu: <strong>{asg.targetPartNameVi}</strong> ({asg.targetPartId})
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Hệ cơ quan: {asg.targetSystem} • Bộ câu hỏi: {asg.quizQuestions.length} câu trắc nghiệm
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Direct 3D Deep Link button */}
                        <Link
                          href={asg.shareViewUrl}
                          target="_blank"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-200 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Mở Góc Nhìn 3D Trực Tiếp</span>
                        </Link>

                        {/* Take Quiz Button */}
                        <button
                          onClick={() => {
                            setActiveAssignmentForQuiz(asg);
                            setQuizAnswers({});
                            setStudentNotes(userSubmission?.notes || '');
                            setQuizResult(null);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md transition-colors"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{hasSubmitted ? 'Xem lại bài đã làm' : 'Làm Bài & Quiz'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Feedback if any */}
                    {userSubmission?.teacherFeedback && (
                      <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3 text-xs text-purple-200 space-y-1">
                        <div className="font-semibold text-purple-300 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Lời dặn dò & Nhận xét của Giảng viên:</span>
                        </div>
                        <p className="pl-5 italic">{userSubmission.teacherFeedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: THEO DÕI TIẾN ĐỘ & BẢNG ĐIỂM
            ========================================================================= */}
        {activeTab === 'progress' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Theo Dõi Tiến Độ & Bảng Điểm Từng Học Viên</span>
                </h2>
                <p className="text-xs text-slate-400">
                  {isTeacherOrAdmin
                    ? 'Giảng viên theo dõi tỷ lệ hoàn thành, điểm quiz và nhận xét bài nộp'
                    : 'Bảng tổng kết điểm và các nhận xét từ giảng viên'}
                </p>
              </div>
            </div>

            {/* Teacher View: Student Progress Table */}
            {isTeacherOrAdmin ? (
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                        <th className="py-3 px-4">Học viên</th>
                        <th className="py-3 px-4">Lớp tham gia</th>
                        <th className="py-3 px-4">Tiến độ bài tập</th>
                        <th className="py-3 px-4">Điểm trung bình</th>
                        <th className="py-3 px-4">Bài nộp gần nhất</th>
                        <th className="py-3 px-4 text-right">Nhận xét</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {classrooms.flatMap(cls =>
                        cls.students.map(st => {
                          const studentSubmissions = assignments
                            .map(a => ({
                              assignment: a,
                              sub: a.submissions.find(s => s.studentId === st.id)
                            }))
                            .filter(item => !!item.sub);

                          const latest = studentSubmissions[0];

                          return (
                            <tr key={`${cls.id}_${st.id}`} className="hover:bg-slate-700/30 transition-colors">
                              <td className="py-3.5 px-4">
                                <div className="font-semibold text-white">{st.name}</div>
                                <div className="text-[11px] text-slate-400 font-mono">ID: {st.id}</div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-950 border border-purple-800 text-purple-300">
                                  {cls.code}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-slate-700 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-emerald-500 h-2 rounded-full"
                                      style={{ width: `${st.progressPercent}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-bold text-white">{st.progressPercent}%</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="text-xs font-bold text-emerald-400">
                                  {st.averageScore} / 100
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-xs">
                                {latest ? (
                                  <div>
                                    <div className="font-medium text-slate-200">{latest.assignment.title}</div>
                                    <div className="text-[11px] text-slate-400">
                                      Điểm: <strong className="text-emerald-300">{latest.sub?.score}đ</strong>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-500">Chưa nộp bài nào</span>
                                )}
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                {latest && latest.sub ? (
                                  <button
                                    onClick={() => {
                                      setActiveSubmissionForReview({
                                        assignment: latest.assignment,
                                        submission: latest.sub!
                                      });
                                      setTeacherFeedbackInput(latest.sub?.teacherFeedback || '');
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 rounded-lg transition-colors"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Gửi Nhận Xét</span>
                                  </button>
                                ) : (
                                  <span className="text-slate-500 text-xs">—</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Student View */
              <div className="space-y-3">
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Kết quả học tập cá nhân</h3>
                    <p className="text-xs text-slate-400">
                      Tổng hợp toàn bộ điểm số các bài khảo sát 3D và quiz giải phẫu đã nộp
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">95 / 100</div>
                    <div className="text-xs text-slate-400">Điểm trung bình</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {assignments.map(a => {
                    const sub = a.submissions.find(s => s.studentId === activeUser?.id);
                    return (
                      <div
                        key={a.id}
                        className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="text-xs font-semibold text-purple-300">{a.className}</div>
                          <div className="text-sm font-bold text-white mt-0.5">{a.title}</div>
                          {sub?.teacherFeedback && (
                            <div className="text-xs text-slate-300 mt-1 italic pl-3 border-l-2 border-purple-500">
                              Thầy cô nhận xét: "{sub.teacherFeedback}"
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          {sub ? (
                            <div className="text-right">
                              <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950 border border-emerald-500 text-emerald-300">
                                {sub.score} / 100 điểm
                              </span>
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(sub.submittedAt).toLocaleDateString('vi-VN')}
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-amber-400 font-medium">Chưa hoàn thành</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: THƯ VIỆN GÓC NHÌN 3D ĐÃ CHIA SẺ
            ========================================================================= */}
        {activeTab === 'shared_views' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Thư Viện Góc Nhìn 3D Đã Chia Sẻ (Shared 3D Views)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Các góc nhìn, mặt cắt và trạng thái cô lập (Isolate) được lưu lại và chia sẻ liên kết trực tiếp
                </p>
              </div>

              <button
                onClick={() => setCreateShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Chia Sẻ Góc Nhìn Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sharedViews.map(view => {
                const fullShareUrl = `/giai-phau-3d${view.urlHash}`;

                return (
                  <div
                    key={view.id}
                    className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg space-y-3 hover:border-indigo-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                          {view.partNameVi} ({view.partId})
                        </span>
                        <h3 className="text-sm font-bold text-white mt-1">{view.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Chia sẻ bởi: <strong>{view.authorName}</strong> ({view.authorRole})
                        </p>
                      </div>

                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <Share2 className="w-4 h-4" />
                      </div>
                    </div>

                    {view.description && (
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-700/60">
                        {view.description}
                      </p>
                    )}

                    <div className="border-t border-slate-700/80 pt-3 flex items-center justify-between text-xs">
                      <button
                        onClick={() => copyToClipboard(`${window.location.origin}${fullShareUrl}`, 'link chia sẻ 3D')}
                        className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép Link</span>
                      </button>

                      <Link
                        href={fullShareUrl}
                        target="_blank"
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Mở Góc Nhìn 3D</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL 1: TẠO LỚP HỌC MỚI
          ========================================================================= */}
      {createClassModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span>Tạo Không Gian Lớp Học Mới</span>
              </h3>
              <button onClick={() => setCreateClassModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tên Lớp Học <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  placeholder="vd: Giải Phẫu Thần Kinh - YK2024..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mô Tả & Mục Tiêu Học Tập</label>
                <textarea
                  rows={3}
                  value={newClassDesc}
                  onChange={e => setNewClassDesc(e.target.value)}
                  placeholder="Mô tả nội dung học tập, tài liệu tham khảo theo chuẩn TA2..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              <div className="text-xs text-purple-300 bg-purple-950/40 p-3 rounded-lg border border-purple-800/40">
                Hệ thống sẽ tự động tạo một Mã Mời (Invite Code) duy nhất để sinh viên nhập và tham gia lớp học ngay tức thì.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCreateClassModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateClass}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md"
              >
                Tạo Lớp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: THAM GIA LỚP BẰNG MÃ
          ========================================================================= */}
      {joinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                <span>Tham Gia Lớp Học Bằng Mã</span>
              </h3>
              <button onClick={() => setJoinModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nhập Mã Lớp Học (Invite Code)
                </label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="vd: GP-YK24 hoặc CXK-01"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base text-center font-mono font-bold text-purple-300 tracking-wider placeholder-slate-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Mã này được giảng viên hoặc ban cán sự lớp cung cấp.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setJoinModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleJoinClass}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md"
              >
                Tham Gia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: GIAO BÀI TẬP & QUIZ 3D MỚI
          ========================================================================= */}
      {createAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-400" />
                <span>Giao Bài Tập & Khảo Sát 3D Mới</span>
              </h3>
              <button onClick={() => setCreateAssignmentModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Chọn Lớp Học</label>
                <select
                  value={asgClassId}
                  onChange={e => setAsgClassId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                >
                  {classrooms.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tiêu Đề Bài Tập <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={asgTitle}
                  onChange={e => setAsgTitle(e.target.value)}
                  placeholder="vd: Khảo sát đối chiếu Xương đùi & Khớp háng..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Cấu Trúc 3D Mục Tiêu Cần Khảo Sát
                </label>
                <select
                  value={asgPartId}
                  onChange={e => setAsgPartId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                >
                  {COMMON_STRUCTURES.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.nameVi} ({st.id}) - Hệ: {st.system}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Yêu Cầu & Hướng Dẫn Lâm Sàng</label>
                <textarea
                  rows={2}
                  value={asgDesc}
                  onChange={e => setAsgDesc(e.target.value)}
                  placeholder="Yêu cầu học viên xoay mô hình, cô lập cấu trúc và kiểm tra 4 liên quan..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>

              {/* Quiz list builder preview */}
              <div className="border-t border-slate-700 pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4" />
                    <span>Bộ Câu Hỏi Quiz Đính Kèm ({asgQuizList.length})</span>
                  </label>
                </div>

                {asgQuizList.map((q, idx) => (
                  <div key={idx} className="bg-slate-900/60 p-3 rounded-lg border border-slate-700/60 text-xs space-y-1">
                    <div className="font-semibold text-white">Câu {idx + 1}: {q.question}</div>
                    <div className="text-slate-400 pl-3">Đáp án đúng: {q.options[q.correctIndex]}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-700 bg-slate-900/60 flex items-center justify-end gap-2">
              <button
                onClick={() => setCreateAssignmentModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAssignment}
                className="px-5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md"
              >
                Giao Bài Cho Lớp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: LÀM BÀI TẬP & QUIZ TƯƠNG TÁC (STUDENT)
          ========================================================================= */}
      {activeAssignmentForQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
              <div>
                <h3 className="text-base font-bold text-white">{activeAssignmentForQuiz.title}</h3>
                <p className="text-xs text-slate-400">{activeAssignmentForQuiz.className}</p>
              </div>
              <button onClick={() => setActiveAssignmentForQuiz(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Target 3D Button */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">
                    Cấu trúc cần khảo sát: {activeAssignmentForQuiz.targetPartNameVi}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Mở mô hình 3D để đối chiếu giải phẫu trước khi trả lời quiz
                  </div>
                </div>

                <Link
                  href={activeAssignmentForQuiz.shareViewUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Mở 3D Khảo Sát</span>
                </Link>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                  Câu hỏi kiểm tra lâm sàng
                </h4>

                {activeAssignmentForQuiz.quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-4 space-y-2.5">
                    <div className="text-sm font-semibold text-white">
                      Câu {qIdx + 1}: {q.question}
                    </div>

                    <div className="space-y-2 pl-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-2.5 p-2 rounded-lg text-xs cursor-pointer border transition-colors ${
                            quizAnswers[qIdx] === optIdx
                              ? 'bg-purple-950/80 border-purple-500 text-purple-200'
                              : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz_q_${qIdx}`}
                            checked={quizAnswers[qIdx] === optIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                            className="text-purple-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>

                    {quizResult && (
                      <div className="mt-2 text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                        <strong>Giải thích:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Student Survey Notes */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Ghi chú khảo sát thực tế trên mô hình 3D
                </label>
                <textarea
                  rows={2}
                  value={studentNotes}
                  onChange={e => setStudentNotes(e.target.value)}
                  placeholder="Ghi nhận các liên quan mạch máu, thần kinh hoặc thắc mắc gửi thầy cô..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-500"
                />
              </div>

              {/* Score display if graded */}
              {quizResult && (
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500 text-center">
                  <div className="text-lg font-bold text-emerald-300">
                    Kết Quả: {quizResult.score} / 100 Điểm
                  </div>
                  <p className="text-xs text-emerald-400/80 mt-0.5">
                    Bài làm của bạn đã được ghi nhận vào hệ thống học tập của lớp.
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-700 bg-slate-900/60 flex items-center justify-between">
              <button
                onClick={() => setActiveAssignmentForQuiz(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 rounded-lg"
              >
                Đóng
              </button>

              <button
                onClick={handleSubmitQuiz}
                className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md"
              >
                Nộp Bài Trực Tuyến
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 5: GIẢNG VIÊN CHẤM BÀI & GỬI PHẢN HỒI
          ========================================================================= */}
      {activeSubmissionForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-400" />
                <span>Nhận Xét Bài Nộp Học Viên</span>
              </h3>
              <button onClick={() => setActiveSubmissionForReview(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900/70 p-3 rounded-xl border border-slate-700 text-xs space-y-1">
                <div>Học viên: <strong>{activeSubmissionForReview.submission.studentName}</strong></div>
                <div>Bài tập: <strong>{activeSubmissionForReview.assignment.title}</strong></div>
                <div>Điểm số: <strong className="text-emerald-400">{activeSubmissionForReview.submission.score}/100</strong></div>
                {activeSubmissionForReview.submission.notes && (
                  <div className="text-slate-300 italic pt-1">
                    Ghi chú của học viên: "{activeSubmissionForReview.submission.notes}"
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nhận Xét & Lời Dặn Dò Lâm Sàng
                </label>
                <textarea
                  rows={4}
                  value={teacherFeedbackInput}
                  onChange={e => setTeacherFeedbackInput(e.target.value)}
                  placeholder="Ghi nhận xét, chỉnh sửa kiến thức chưa chuẩn hoặc khen ngợi học viên..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveSubmissionForReview(null)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleGradeSubmission}
                className="px-5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg shadow-md"
              >
                Lưu Nhận Xét
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 6: TẠO GÓC NHÌN 3D CHIA SẺ MỚI
          ========================================================================= */}
      {createShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-indigo-400" />
                <span>Chia Sẻ Góc Nhìn 3D Mới</span>
              </h3>
              <button onClick={() => setCreateShareModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tiêu Đề Góc Nhìn 3D <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={shareTitle}
                  onChange={e => setShareTitle(e.target.value)}
                  placeholder="vd: Khảo sát lồi cầu trong xương đùi..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cấu Trúc Trọng Tâm</label>
                <select
                  value={sharePartId}
                  onChange={e => setSharePartId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                >
                  {COMMON_STRUCTURES.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.nameVi} ({st.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Mô Tả Góc Nhìn & Ghi Chú</label>
                <textarea
                  rows={2}
                  value={shareDesc}
                  onChange={e => setShareDesc(e.target.value)}
                  placeholder="Chỉ rõ điểm cần lưu ý khi sinh viên mở góc nhìn này..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCreateShareModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateShareView}
                className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-md"
              >
                Lưu & Chia Sẻ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
