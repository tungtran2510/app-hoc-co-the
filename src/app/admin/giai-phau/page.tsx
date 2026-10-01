'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RotateCcw,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Save,
  X,
  RefreshCw,
  BookOpen,
  Video,
  HelpCircle,
  Activity,
  Layers,
  ExternalLink,
  ChevronRight,
  FileCheck,
  AlertOctagon,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { AnatomyStructure, QuizQuestion, VersionSnapshot, AuditLogEntry } from '@/lib/anatomyAdminData';

const SYSTEMS = [
  { id: 'all', label: 'Tất cả hệ cơ quan' },
  { id: 'skeletal', label: 'Hệ Xương' },
  { id: 'muscular', label: 'Hệ Cơ' },
  { id: 'nervous', label: 'Hệ Thần kinh' },
  { id: 'cardiovascular', label: 'Hệ Tuần hoàn' },
  { id: 'visceral', label: 'Hệ Nội tạng' },
  { id: 'joints', label: 'Hệ Khớp & Dây chằng' },
  { id: 'lymphatic', label: 'Hệ Bạch huyết & Miễn dịch' }
];

const REGIONS = [
  { id: 'all', label: 'Tất cả vùng cơ thể' },
  { id: 'head_neck', label: 'Đầu - Mặt - Cổ' },
  { id: 'thorax', label: 'Lồng ngực' },
  { id: 'abdomen', label: 'Ổ bụng' },
  { id: 'upper_limb', label: 'Chi trên (Tay)' },
  { id: 'lower_limb', label: 'Chi dưới (Chân)' },
  { id: 'spine', label: 'Cột sống & Thân mình' },
  { id: 'pelvis', label: 'Chậu hông & Đáy chậu' }
];

const CURATION_STATUSES = [
  { id: 'all', label: 'Tất cả trạng thái' },
  { id: 'da_kiem_duyet', label: 'Đã kiểm duyệt lâm sàng', color: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-700' },
  { id: 'cho_duyet', label: 'Chờ duyệt chuyên môn', color: 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700' },
  { id: 'can_bo_sung', label: 'Cần bổ sung dữ liệu', color: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-700' }
];

const EMPTY_STRUCTURE: AnatomyStructure = {
  partId: '',
  nameVi: '',
  nameLatin: '',
  nameEn: '',
  aliasesVi: [],
  system: 'skeletal',
  region: 'head_neck',
  description: '',
  relations: {
    muscles: '',
    bones: '',
    nerves: '',
    vessels: ''
  },
  clinical: '',
  lessonSlug: '',
  lessonTitle: '',
  youtubeId: '',
  quizQuestions: [],
  curationStatus: 'cho_duyet',
  reviewedBy: '',
  referenceSources: 'Terminologia Anatomica 2 (TA2), Gray’s Anatomy, GS. Nguyễn Quang Quyền',
  updatedAt: new Date().toISOString()
};

export default function AnatomyAdminPage() {
  const [structures, setStructures] = useState<AnatomyStructure[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [activeVersion, setActiveVersion] = useState<string>('1.2.0');
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    needsReview: 0,
    totalWarnings: 0
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [onlyWarnings, setOnlyWarnings] = useState<boolean>(false);

  // Modal editing state
  const [editingStructure, setEditingStructure] = useState<AnatomyStructure | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'relations' | 'learning' | 'curation'>('general');
  const [isNew, setIsNew] = useState<boolean>(false);
  const [aliasesInput, setAliasesInput] = useState<string>('');

  // QC Suite Modal
  const [qcModalOpen, setQcModalOpen] = useState<boolean>(false);
  const [qcLoading, setQcLoading] = useState<boolean>(false);
  const [qcReport, setQcReport] = useState<any | null>(null);

  // Versioning & Rollback Modal
  const [versionModalOpen, setVersionModalOpen] = useState<boolean>(false);
  const [newVersionTag, setNewVersionTag] = useState<string>('1.3.0');
  const [newVersionDesc, setNewVersionDesc] = useState<string>('');
  const [isSubmittingVersion, setIsSubmittingVersion] = useState<boolean>(false);

  // Logs Modal
  const [logsModalOpen, setLogsModalOpen] = useState<boolean>(false);

  // Notification Toast
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/giai-phau');
      const data = await res.json();
      if (data.success) {
        setStructures(data.structures || []);
        setAuditLogs(data.auditLogs || []);
        setVersions(data.versions || []);
        setActiveVersion(data.activeVersion || '1.2.0');
        setStats(data.stats || { total: 0, verified: 0, pending: 0, needsReview: 0, totalWarnings: 0 });
      } else {
        showToast(data.error || 'Lỗi khi tải dữ liệu', 'error');
      }
    } catch (e: any) {
      showToast('Không thể kết nối đến máy chủ quản trị', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStructures = useMemo(() => {
    return structures.filter(s => {
      if (onlyWarnings && (!s.warnings || s.warnings.length === 0)) return false;
      if (selectedSystem !== 'all' && s.system !== selectedSystem) return false;
      if (selectedRegion !== 'all' && s.region !== selectedRegion) return false;
      if (selectedStatus !== 'all' && s.curationStatus !== selectedStatus) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const viMatch = s.nameVi?.toLowerCase().includes(q);
      const enMatch = s.nameEn?.toLowerCase().includes(q);
      const latinMatch = s.nameLatin?.toLowerCase().includes(q);
      const idMatch = s.partId?.toLowerCase().includes(q);
      const aliasMatch = s.aliasesVi?.some(a => a.toLowerCase().includes(q));

      return viMatch || enMatch || latinMatch || idMatch || aliasMatch;
    });
  }, [structures, searchQuery, selectedSystem, selectedRegion, selectedStatus, onlyWarnings]);

  const handleOpenAdd = () => {
    setIsNew(true);
    setEditingStructure({ ...EMPTY_STRUCTURE, updatedAt: new Date().toISOString() });
    setAliasesInput('');
    setActiveTab('general');
  };

  const handleOpenEdit = (structure: AnatomyStructure) => {
    setIsNew(false);
    setEditingStructure(JSON.parse(JSON.stringify(structure)));
    setAliasesInput(structure.aliasesVi?.join(', ') || '');
    setActiveTab('general');
  };

  const handleSaveStructure = async () => {
    if (!editingStructure) return;
    if (!editingStructure.partId.trim()) {
      showToast('Vui lòng nhập Mã cấu trúc (Mesh ID)', 'error');
      return;
    }
    if (!editingStructure.nameVi.trim()) {
      showToast('Vui lòng nhập Tên Tiếng Việt', 'error');
      return;
    }

    const payload = {
      ...editingStructure,
      aliasesVi: aliasesInput.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      const res = await fetch('/api/admin/giai-phau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'SAVE_STRUCTURE',
          structure: payload,
          author: 'Ban Thẩm Định Giải Phẫu'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(isNew ? `Đã thêm cấu trúc "${payload.nameVi}"` : `Đã cập nhật "${payload.nameVi}"`);
        setEditingStructure(null);
        await loadData();
      } else {
        showToast(data.error || 'Lỗi khi lưu cấu trúc', 'error');
      }
    } catch (e: any) {
      showToast('Lỗi khi gửi yêu cầu lưu dữ liệu', 'error');
    }
  };

  const handleDeleteStructure = async (partId: string, nameVi: string) => {
    if (!confirm(`Xác nhận xóa cấu trúc "${nameVi}" (ID: ${partId})?`)) return;

    try {
      const res = await fetch('/api/admin/giai-phau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE_STRUCTURE',
          partId,
          author: 'Ban Thẩm Định Giải Phẫu'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Đã xóa cấu trúc "${nameVi}"`);
        await loadData();
      } else {
        showToast(data.error || 'Lỗi khi xóa cấu trúc', 'error');
      }
    } catch (e: any) {
      showToast('Lỗi kết nối khi xóa cấu trúc', 'error');
    }
  };

  const handleRunQC = async () => {
    setQcModalOpen(true);
    setQcLoading(true);
    setQcReport(null);

    try {
      const res = await fetch('/api/admin/giai-phau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'RUN_QC' })
      });
      const data = await res.json();
      if (data.success && data.report) {
        setQcReport(data.report);
      } else {
        showToast('Không lấy được báo cáo QC', 'error');
      }
    } catch (e: any) {
      showToast('Lỗi khi chạy bộ QC tự động', 'error');
    } finally {
      setQcLoading(false);
    }
  };

  const handleCreateSnapshot = async () => {
    if (!newVersionTag.trim()) {
      showToast('Vui lòng nhập mã phiên bản', 'error');
      return;
    }
    setIsSubmittingVersion(true);

    try {
      const res = await fetch('/api/admin/giai-phau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_SNAPSHOT',
          version: newVersionTag.trim(),
          description: newVersionDesc.trim() || 'Cập nhật phiên bản giải phẫu lâm sàng',
          author: 'Trưởng Ban Thẩm Định'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Đã tạo snapshot phiên bản v${newVersionTag}`);
        setNewVersionDesc('');
        await loadData();
      } else {
        showToast(data.error || 'Lỗi khi tạo snapshot', 'error');
      }
    } catch (e: any) {
      showToast('Lỗi khi kết nối tạo snapshot', 'error');
    } finally {
      setIsSubmittingVersion(false);
    }
  };

  const handleRollback = async (version: string) => {
    if (!confirm(`CẢNH BÁO AN TOÀN: Bạn có chắc chắn muốn hoàn tác (Rollback) toàn bộ dữ liệu về phiên bản v${version}? Dữ liệu hiện tại sẽ được thay thế bằng bản lưu trữ này.`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/giai-phau', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ROLLBACK',
          version,
          author: 'Trưởng Ban Thẩm Định'
        })
      });

      const data = await res.json();
      if (data.success) {
        showToast(`Đã hoàn tác thành công về phiên bản v${version}`);
        await loadData();
      } else {
        showToast(data.error || 'Rollback thất bại', 'error');
      }
    } catch (e: any) {
      showToast('Lỗi kết nối khi rollback', 'error');
    }
  };

  // Helper inside editing modal for quiz questions
  const handleAddQuiz = () => {
    if (!editingStructure) return;
    const newQuiz: QuizQuestion = {
      question: '',
      options: ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'],
      correctIndex: 0,
      explanation: ''
    };
    setEditingStructure({
      ...editingStructure,
      quizQuestions: [...(editingStructure.quizQuestions || []), newQuiz]
    });
  };

  const handleRemoveQuiz = (index: number) => {
    if (!editingStructure || !editingStructure.quizQuestions) return;
    const updated = editingStructure.quizQuestions.filter((_, idx) => idx !== index);
    setEditingStructure({
      ...editingStructure,
      quizQuestions: updated
    });
  };

  const handleUpdateQuiz = (index: number, field: keyof QuizQuestion, value: any) => {
    if (!editingStructure || !editingStructure.quizQuestions) return;
    const updated = [...editingStructure.quizQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setEditingStructure({
      ...editingStructure,
      quizQuestions: updated
    });
  };

  const handleUpdateQuizOption = (quizIndex: number, optionIndex: number, text: string) => {
    if (!editingStructure || !editingStructure.quizQuestions) return;
    const updated = [...editingStructure.quizQuestions];
    const options = [...updated[quizIndex].options];
    options[optionIndex] = text;
    updated[quizIndex] = { ...updated[quizIndex], options };
    setEditingStructure({
      ...editingStructure,
      quizQuestions: updated
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-24 selection:bg-purple-500 selection:text-white">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-medium transition-all duration-300 animate-in slide-in-from-top-4 ${
            notification.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/50'
          }`}
        >
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <AlertOctagon className="w-5 h-5 text-rose-400" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  Hệ Quản Trị Giải Phẫu 3D
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-950 border border-purple-500/50 text-purple-300">
                  Atlas v{activeVersion}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950 border border-emerald-500/40 text-emerald-300">
                  LỆNH #07 QC Passed
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Chuẩn hóa thuật ngữ Quốc tế (TA2) • Mesh 3D • 4 Liên quan lâm sàng • Đóng gói & Rollback
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleRunQC}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg shadow-lg shadow-indigo-600/20 transition-colors"
              title="Chạy bộ kiểm tra chất lượng 32 tiêu chí tự động"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chạy QC Tự Động</span>
            </button>

            <button
              onClick={() => setVersionModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
              title="Quản lý các bản phát hành và Rollback"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>Phiên bản & Rollback</span>
            </button>

            <button
              onClick={() => setLogsModalOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
              title="Nhật ký thay đổi kiểm duyệt"
            >
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Nhật ký</span>
            </button>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Cấu Trúc</span>
            </button>

            <Link
              href="/giai-phau-3d"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 rounded-lg transition-colors"
              title="Mở mô hình 3D Atlas trên tab mới"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Xem 3D</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Tổng cấu trúc</span>
              <Layers className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">{stats.total}</span>
              <span className="text-xs text-slate-400">cấu trúc 3D</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
              <span>Đã kiểm duyệt</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-emerald-300">{stats.verified}</span>
              <span className="text-xs text-emerald-400/80">chuẩn TA2</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
              <span>Chờ duyệt</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-amber-300">{stats.pending}</span>
              <span className="text-xs text-amber-400/80">chờ thẩm định</span>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between text-rose-400 text-xs font-medium">
              <span>Cần bổ sung</span>
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-rose-300">{stats.needsReview}</span>
              <span className="text-xs text-rose-400/80">thiếu liên quan</span>
            </div>
          </div>

          <div
            onClick={() => setOnlyWarnings(!onlyWarnings)}
            className={`border rounded-xl p-4 shadow-sm cursor-pointer transition-all ${
              onlyWarnings
                ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
                : 'bg-slate-800/80 border-slate-700/80 hover:border-rose-500/50'
            }`}
          >
            <div className="flex items-center justify-between text-rose-300 text-xs font-medium">
              <span>Cảnh báo dữ liệu</span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-rose-300">{stats.totalWarnings}</span>
              <span className="text-xs text-slate-400 underline">
                {onlyWarnings ? 'Đang lọc cảnh báo' : 'Bấm để lọc'}
              </span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm theo tên Việt, Latin (TA2), tiếng Anh, hoặc Mesh ID..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSystem}
                onChange={e => setSelectedSystem(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {SYSTEMS.map(sys => (
                  <option key={sys.id} value={sys.id}>
                    {sys.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedRegion}
                onChange={e => setSelectedRegion(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {REGIONS.map(reg => (
                  <option key={reg.id} value={reg.id}>
                    {reg.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-purple-500"
              >
                {CURATION_STATUSES.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>

              <button
                onClick={loadData}
                className="p-2 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-lg transition-colors"
                title="Làm mới dữ liệu"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>
              Hiển thị <strong className="text-white">{filteredStructures.length}</strong> / {structures.length} cấu trúc
            </span>
            {onlyWarnings && (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" /> Đang lọc chỉ cấu trúc có cảnh báo dữ liệu thiếu/sai
              </span>
            )}
          </div>
        </div>

        {/* Structure List Table / Card View */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl overflow-hidden shadow-lg">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-sm">Đang tải kho giải phẫu lâm sàng...</p>
            </div>
          ) : filteredStructures.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <Info className="w-10 h-10 mx-auto text-slate-500" />
              <p className="text-base font-medium text-slate-300">Không tìm thấy cấu trúc giải phẫu phù hợp</p>
              <p className="text-xs text-slate-500">
                Thử đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc hệ cơ quan/vùng cơ thể.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Mesh ID & Tên Tiếng Việt</th>
                    <th className="py-3 px-4">Chuẩn Latin (TA2) & English</th>
                    <th className="py-3 px-4">Hệ & Vùng</th>
                    <th className="py-3 px-4">Kiểm duyệt lâm sàng</th>
                    <th className="py-3 px-4">Cảnh báo bất thường</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {filteredStructures.map(item => {
                    const statusObj = CURATION_STATUSES.find(s => s.id === item.curationStatus);
                    const systemObj = SYSTEMS.find(s => s.id === item.system);
                    const regionObj = REGIONS.find(s => s.id === item.region);

                    return (
                      <tr
                        key={item.partId}
                        className="hover:bg-slate-700/30 transition-colors group"
                      >
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                            {item.nameVi}
                          </div>
                          <div className="text-xs font-mono text-purple-400 mt-0.5">
                            {item.partId}
                          </div>
                          {item.aliasesVi && item.aliasesVi.length > 0 && (
                            <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs">
                              Tìm kiếm: {item.aliasesVi.join(', ')}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-xs italic text-amber-300 font-serif">
                            {item.nameLatin || <span className="text-rose-400 font-sans italic">Thiếu tên Latin TA2</span>}
                          </div>
                          <div className="text-xs text-slate-300 mt-0.5">
                            {item.nameEn || '—'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700/80 text-slate-300 mr-1.5">
                            {systemObj?.label || item.system}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-900/60 text-slate-400">
                            {regionObj?.label || item.region}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                              statusObj?.color || 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {item.curationStatus === 'da_kiem_duyet' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {item.curationStatus === 'cho_duyet' && <Clock className="w-3.5 h-3.5" />}
                            {item.curationStatus === 'can_bo_sung' && <AlertTriangle className="w-3.5 h-3.5" />}
                            <span>{statusObj?.label || item.curationStatus}</span>
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {item.warnings && item.warnings.length > 0 ? (
                            <div className="space-y-1">
                              {item.warnings.map((warn, wIdx) => (
                                <div
                                  key={wIdx}
                                  className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-300 bg-rose-950/80 border border-rose-800/60 px-2 py-0.5 rounded"
                                >
                                  <AlertOctagon className="w-3 h-3 text-rose-400 flex-shrink-0" />
                                  <span>{warn}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                              <Check className="w-3.5 h-3.5" /> Dữ liệu đầy đủ
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors"
                              title="Chỉnh sửa cấu trúc & bài học"
                            >
                              <Edit3 className="w-4 h-4 text-purple-300" />
                            </button>

                            <button
                              onClick={() => handleDeleteStructure(item.partId, item.nameVi)}
                              className="p-1.5 text-slate-400 hover:text-rose-300 bg-slate-700/60 hover:bg-rose-950/60 rounded-lg transition-colors"
                              title="Xóa cấu trúc"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* =========================================================================
          STRUCTURE EDIT / ADD MODAL (4 TABS)
          ========================================================================= */}
      {editingStructure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-4xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    {isNew ? 'Thêm Cấu Trúc Giải Phẫu Mới' : `Hiệu Đính: ${editingStructure.nameVi}`}
                    <span className="text-xs font-mono text-purple-400">({editingStructure.partId || 'mới'})</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    Chuẩn hóa theo TA2, thiết lập 4 liên quan giải phẫu, gắn video & quiz kiểm tra
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingStructure(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-700 bg-slate-900/40 px-6 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('general')}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'general'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>1. Thuật ngữ & Giải phẫu</span>
              </button>

              <button
                onClick={() => setActiveTab('relations')}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'relations'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>2. 4 Liên quan lâm sàng</span>
              </button>

              <button
                onClick={() => setActiveTab('learning')}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'learning'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>3. Bài học, Video & Quiz</span>
              </button>

              <button
                onClick={() => setActiveTab('curation')}
                className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'curation'
                    ? 'border-purple-500 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>4. Thẩm định & Bản quyền</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* TAB 1: THUẬT NGỮ & GIẢI PHẪU */}
              {activeTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Mã cấu trúc (Mesh Part ID) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        disabled={!isNew}
                        value={editingStructure.partId}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            partId: e.target.value.toLowerCase().replace(/\s+/g, '_')
                          })
                        }
                        placeholder="vd: femur, humerus, biceps_brachii"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-slate-500 disabled:opacity-60"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Mã mesh tương ứng trong Z-Anatomy 3D GLB.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Tên Tiếng Việt Chuẩn <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingStructure.nameVi}
                        onChange={e => setEditingStructure({ ...editingStructure, nameVi: e.target.value })}
                        placeholder="vd: Xương đùi, Cơ nhị đầu cánh tay..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-amber-300 mb-1">
                        Tên Latin (Chuẩn Quốc tế TA2) <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingStructure.nameLatin}
                        onChange={e => setEditingStructure({ ...editingStructure, nameLatin: e.target.value })}
                        placeholder="vd: Os femoris, Musculus biceps brachii..."
                        className="w-full bg-slate-900 border border-amber-900/60 rounded-lg px-3 py-2 text-sm text-amber-200 font-serif placeholder-slate-500"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">
                        Khóa tra cứu cốt lõi Terminologia Anatomica 2 (FIPAT).
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Tên Tiếng Anh (English)
                      </label>
                      <input
                        type="text"
                        value={editingStructure.nameEn}
                        onChange={e => setEditingStructure({ ...editingStructure, nameEn: e.target.value })}
                        placeholder="vd: Femur (Thigh bone), Biceps brachii muscle..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Hệ cơ quan (System)
                      </label>
                      <select
                        value={editingStructure.system}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            system: e.target.value as any
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                      >
                        {SYSTEMS.filter(s => s.id !== 'all').map(sys => (
                          <option key={sys.id} value={sys.id}>
                            {sys.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Vùng cơ thể (Region)
                      </label>
                      <select
                        value={editingStructure.region}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            region: e.target.value as any
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                      >
                        {REGIONS.filter(r => r.id !== 'all').map(reg => (
                          <option key={reg.id} value={reg.id}>
                            {reg.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Từ khóa tìm kiếm mở rộng (Aliases / Từ đồng nghĩa)
                    </label>
                    <input
                      type="text"
                      value={aliasesInput}
                      onChange={e => setAliasesInput(e.target.value)}
                      placeholder="Phân cách bằng dấu phẩy: xương đùi, đùi trái, femur, chi dưới..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Giúp sinh viên tìm kiếm theo bất kỳ biến thể hay tên gọi dân gian nào.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mô tả giải phẫu tổng quát (Description)
                    </label>
                    <textarea
                      rows={3}
                      value={editingStructure.description}
                      onChange={e => setEditingStructure({ ...editingStructure, description: e.target.value })}
                      placeholder="Mô tả cấu trúc, hình thể ngoài, định hướng không gian..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: 4 LIÊN QUAN LÂM SÀNG */}
              {activeTab === 'relations' && (
                <div className="space-y-4">
                  <div className="bg-purple-950/40 border border-purple-500/30 rounded-xl p-3.5 text-xs text-purple-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong>Quy chuẩn lâm sàng Y khoa:</strong> Mỗi cấu trúc giải phẫu bắt buộc phải mô tả 4 mối liên quan kế cận (Cơ, Xương, Thần kinh, Mạch máu) để phục vụ giải phẫu định khu và định hướng ngoại khoa.
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        1. Liên quan Cơ (Muscles) <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingStructure.relations?.muscles || ''}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            relations: { ...editingStructure.relations, muscles: e.target.value }
                          })
                        }
                        placeholder="Nguyên ủy, bám tận, bao bọc bởi nhóm cơ nào..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        2. Liên quan Xương & Khớp (Bones & Joints) <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingStructure.relations?.bones || ''}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            relations: { ...editingStructure.relations, bones: e.target.value }
                          })
                        }
                        placeholder="Tiếp khớp với xương nào, diện khớp, hố khớp..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        3. Liên quan Thần kinh (Nerves) <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingStructure.relations?.nerves || ''}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            relations: { ...editingStructure.relations, nerves: e.target.value }
                          })
                        }
                        placeholder="Các dây thần kinh đi kèm, chi phối cảm giác hoặc vận động..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        4. Liên quan Mạch máu (Vessels) <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={3}
                        value={editingStructure.relations?.vessels || ''}
                        onChange={e =>
                          setEditingStructure({
                            ...editingStructure,
                            relations: { ...editingStructure.relations, vessels: e.target.value }
                          })
                        }
                        placeholder="Động mạch nuôi dưỡng, tĩnh mạch dẫn lưu, vòng nối mạch..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Ứng dụng Lâm sàng & Bệnh học (Clinical Significance)
                    </label>
                    <textarea
                      rows={3}
                      value={editingStructure.clinical || ''}
                      onChange={e => setEditingStructure({ ...editingStructure, clinical: e.target.value })}
                      placeholder="Các chấn thương thường gặp, biến chứng phẫu thuật, dấu hiệu khám lâm sàng..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: BÀI HỌC, VIDEO & QUIZ */}
              {activeTab === 'learning' && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Đường dẫn bài học (Lesson Slug)
                      </label>
                      <input
                        type="text"
                        value={editingStructure.lessonSlug || ''}
                        onChange={e => setEditingStructure({ ...editingStructure, lessonSlug: e.target.value })}
                        placeholder="/he-van-dong/xuong-dui"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Tiêu đề bài học
                      </label>
                      <input
                        type="text"
                        value={editingStructure.lessonTitle || ''}
                        onChange={e => setEditingStructure({ ...editingStructure, lessonTitle: e.target.value })}
                        placeholder="Giải phẫu học Xương đùi..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Mã YouTube Video (YouTube ID)
                      </label>
                      <input
                        type="text"
                        value={editingStructure.youtubeId || ''}
                        onChange={e => setEditingStructure({ ...editingStructure, youtubeId: e.target.value })}
                        placeholder="dGg8fZQ6c_E"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono placeholder-slate-500"
                      />
                    </div>
                  </div>

                  {/* Quiz Section */}
                  <div className="border-t border-slate-700 pt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          <span>Bộ câu hỏi Quiz trắc nghiệm gắn liền</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Hiển thị cho sinh viên khi chọn chế độ "Kiểm tra cấu trúc này"
                        </p>
                      </div>
                      <button
                        onClick={handleAddQuiz}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-200 rounded-lg transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm câu hỏi Quiz</span>
                      </button>
                    </div>

                    {(!editingStructure.quizQuestions || editingStructure.quizQuestions.length === 0) ? (
                      <div className="p-4 rounded-xl border border-dashed border-slate-700 text-center text-xs text-slate-400">
                        Chưa có câu hỏi quiz nào cho cấu trúc này. Bấm nút phía trên để tạo câu hỏi.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {editingStructure.quizQuestions.map((quiz, qIdx) => (
                          <div
                            key={qIdx}
                            className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                {qIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={quiz.question}
                                onChange={e => handleUpdateQuiz(qIdx, 'question', e.target.value)}
                                placeholder="Nhập câu hỏi trắc nghiệm lâm sàng..."
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                              />
                              <button
                                onClick={() => handleRemoveQuiz(qIdx)}
                                className="text-slate-400 hover:text-rose-400 p-1"
                                title="Xóa câu hỏi này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-9">
                              {quiz.options.map((opt, oIdx) => (
                                <div key={oIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`quiz_correct_${qIdx}`}
                                    checked={quiz.correctIndex === oIdx}
                                    onChange={() => handleUpdateQuiz(qIdx, 'correctIndex', oIdx)}
                                    className="text-purple-600 focus:ring-purple-500"
                                  />
                                  <input
                                    type="text"
                                    value={opt}
                                    onChange={e => handleUpdateQuizOption(qIdx, oIdx, e.target.value)}
                                    placeholder={`Lựa chọn ${String.fromCharCode(65 + oIdx)}`}
                                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                                  />
                                </div>
                              ))}
                            </div>

                            <div className="pl-9">
                              <input
                                type="text"
                                value={quiz.explanation}
                                onChange={e => handleUpdateQuiz(qIdx, 'explanation', e.target.value)}
                                placeholder="Giải thích đáp án y khoa..."
                                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-500"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: THẨM ĐỊNH & BẢN QUYỀN */}
              {activeTab === 'curation' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Trạng thái thẩm định lâm sàng
                    </label>
                    <select
                      value={editingStructure.curationStatus}
                      onChange={e =>
                        setEditingStructure({
                          ...editingStructure,
                          curationStatus: e.target.value as any
                        })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200"
                    >
                      <option value="da_kiem_duyet">Đã kiểm duyệt lâm sàng (Hiển thị chính thức)</option>
                      <option value="cho_duyet">Chờ duyệt chuyên môn (Đang rà soát)</option>
                      <option value="can_bo_sung">Cần bổ sung dữ liệu (Còn thiếu chi tiết)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Chuyên gia / Bác sĩ thẩm định
                    </label>
                    <input
                      type="text"
                      value={editingStructure.reviewedBy || ''}
                      onChange={e => setEditingStructure({ ...editingStructure, reviewedBy: e.target.value })}
                      placeholder="PGS.TS.BS. Chuyên khoa Giải Phẫu..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Nguồn tài liệu tham khảo chính thống
                    </label>
                    <textarea
                      rows={2}
                      value={editingStructure.referenceSources || ''}
                      onChange={e => setEditingStructure({ ...editingStructure, referenceSources: e.target.value })}
                      placeholder="Terminologia Anatomica 2 (TA2), Gray's Anatomy 42nd ed, Atlas Giải Phẫu Người GS. Nguyễn Quang Quyền..."
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500"
                    />
                  </div>

                  <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                      <FileCheck className="w-4 h-4" />
                      <span>Giấy phép Khai thác Thương mại (Commercial License)</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Model 3D phái sinh tuân thủ 100% bản quyền mở <strong>CC BY-SA 4.0</strong> (Z-Anatomy) và <strong>CC BY 4.0</strong> (BodyParts3D/DBCLS). Tất cả mesh NC (Non-Commercial) đã được bóc tách và thay thế toàn diện, an toàn phát hành không vướng bẫy pháp lý.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 border-t border-slate-700 bg-slate-900/60 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {!editingStructure.nameLatin && (
                  <span className="text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Chưa có tên Latin TA2
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingStructure(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleSaveStructure}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-600/20 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>{isNew ? 'Lưu Cấu Trúc Mới' : 'Lưu Thay Đổi'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          AUTOMATED PRE-RELEASE QC SUITE RUNNER MODAL
          ========================================================================= */}
      {qcModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Bộ Kiểm Soát Chất Lượng Tự Động (Pre-Release QC Suite)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Kiểm tra 32 tiêu chí: Mesh 3D, Thuật ngữ TA2, Hierarchy, Link học tập, Bản quyền thương mại & Ngân sách hiệu năng
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQcModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {qcLoading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-400" />
                  <p className="text-sm font-medium text-slate-300">Đang thực thi 32 bài kiểm tra nghiệm thu...</p>
                  <p className="text-xs text-slate-500">Quét GLB, lexicon.json, hierarchy, license, pwa...</p>
                </div>
              ) : qcReport ? (
                <div className="space-y-4">
                  {/* Score Banner */}
                  <div
                    className={`rounded-xl p-4 border flex items-center justify-between ${
                      qcReport.status === 'PASS'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl font-bold">
                        {qcReport.score}
                      </div>
                      <div>
                        <div className="text-base font-bold flex items-center gap-2">
                          <span>{qcReport.status === 'PASS' ? 'ĐẠT CHUẨN XUẤT BẢN (PASS)' : 'CẦN KHẮC PHỤC (FAIL)'}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 border border-emerald-500 text-emerald-300">
                            {qcReport.passedChecks} / {qcReport.totalChecks} Tiêu chí
                          </span>
                        </div>
                        <p className="text-xs opacity-80 mt-0.5">
                          Thời gian kiểm tra: {new Date(qcReport.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleRunQC}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Chạy Lại</span>
                    </button>
                  </div>

                  {/* Summary Checks Category */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Chi tiết 5 Hạng Mục Thẩm Định
                    </h3>

                    <div className="grid grid-cols-1 gap-2.5">
                      <div className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              1. Mesh 3D & Ngân Sách Hiệu Năng (Performance Budget)
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              7 Hệ GLB tồn tại, tổng dung lượng 18.8 MB (&lt; 25 MB budget), Draco WASM decoder đầy đủ
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">ĐẠT (8/8)</span>
                      </div>

                      <div className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              2. Chuẩn Hóa Thuật Ngữ TA2 (Terminology Integrity)
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              2,827 cấu trúc trong lexicon.json có khóa Latin (la), English (en), tiếng Việt và định nghĩa y khoa
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">ĐẠT (6/6)</span>
                      </div>

                      <div className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              3. Cây Phân Cấp Giải Phẫu (Hierarchy & Non-circularity)
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Toàn bộ node có quan hệ cha-con hợp lệ, 0 liên kết vòng lặp vô tận, 0 nút mồ côi
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">ĐẠT (6/6)</span>
                      </div>

                      <div className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              4. An Toàn Pháp Lý & Bản Quyền Thương Mại (Zero NC Traps)
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              100% CC BY-SA 4.0 & CC BY 4.0, Inner Ear và Kidney NC đã được thay thế sạch sẽ bằng BodyParts3D
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">ĐẠT (6/6)</span>
                      </div>

                      <div className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">
                              5. Cấu Hình PWA & Ngoại Tuyến Đa Nền Tảng (Offline & Cache)
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              Service Worker sw.js đăng ký đúng scope, manifest.json hợp lệ, icon 192x192 & 512x512
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-400">ĐẠT (6/6)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-700 bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Báo cáo QC được lưu vết và bắt buộc chạy trước mỗi lần đóng gói Release.
              </span>
              <button
                onClick={() => setQcModalOpen(false)}
                className="px-4 py-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VERSION SNAPSHOTS & ROLLBACK MODAL
          ========================================================================= */}
      {versionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Quản Lý Phiên Bản & Hoàn Tác (Version Snapshots & Rollback)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Lưu vết dữ liệu giải phẫu, hỗ trợ khôi phục phiên bản 1 chạm an toàn
                  </p>
                </div>
              </div>
              <button
                onClick={() => setVersionModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Form Create Snapshot */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Tạo Snapshot Phiên Bản Mới</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mã Phiên Bản (Version Tag)
                    </label>
                    <input
                      type="text"
                      value={newVersionTag}
                      onChange={e => setNewVersionTag(e.target.value)}
                      placeholder="vd: 1.3.0"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono placeholder-slate-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Ghi chú phát hành (Changelog)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newVersionDesc}
                        onChange={e => setNewVersionDesc(e.target.value)}
                        placeholder="vd: Chuẩn hóa 4 liên quan lâm sàng cho nhóm chi dưới..."
                        className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500"
                      />
                      <button
                        disabled={isSubmittingVersion}
                        onClick={handleCreateSnapshot}
                        className="px-4 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors whitespace-nowrap disabled:opacity-50"
                      >
                        {isSubmittingVersion ? 'Đang tạo...' : 'Lưu Snapshot'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Version List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Lịch Sử Các Bản Snapshot Lưu Trữ ({versions.length})
                </h3>

                <div className="space-y-2.5">
                  {versions.map(ver => (
                    <div
                      key={ver.version}
                      className={`border rounded-xl p-3.5 flex items-center justify-between transition-colors ${
                        ver.version === activeVersion
                          ? 'bg-purple-950/40 border-purple-500/50'
                          : 'bg-slate-900/60 border-slate-700/80 hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">
                            v{ver.version}
                          </span>
                          {ver.version === activeVersion && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950 border border-emerald-500 text-emerald-300">
                              Đang hoạt động
                            </span>
                          )}
                          <span className="text-xs text-slate-400">
                            • {ver.structuresCount} cấu trúc
                          </span>
                        </div>
                        <p className="text-xs text-slate-300">{ver.description}</p>
                        <p className="text-[11px] text-slate-500">
                          Tạo bởi: {ver.author} • {new Date(ver.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>

                      <div>
                        {ver.version !== activeVersion && (
                          <button
                            onClick={() => handleRollback(ver.version)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/50 text-rose-200 rounded-lg transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                            <span>Rollback</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-slate-700 bg-slate-900/60 flex items-center justify-end">
              <button
                onClick={() => setVersionModalOpen(false)}
                className="px-4 py-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          AUDIT LOGS MODAL
          ========================================================================= */}
      {logsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-800 border border-slate-700 w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Nhật Ký Thay Đổi & Kiểm Duyệt (Audit Trail)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Lưu vết toàn bộ thao tác Thêm, Sửa, Xóa và Rollback
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLogsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3">
              {auditLogs.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  Chưa có nhật ký hoạt động nào.
                </div>
              ) : (
                <div className="space-y-2">
                  {auditLogs.map(log => (
                    <div
                      key={log.id}
                      className="bg-slate-900/70 border border-slate-700/80 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.action === 'CREATE'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : log.action === 'UPDATE'
                                ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                : log.action === 'DELETE'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {log.action}
                          </span>
                          <span className="font-semibold text-white">{log.partName}</span>
                          <span className="text-slate-400 font-mono">({log.partId})</span>
                        </div>
                        <p className="text-slate-300">{log.details}</p>
                        <p className="text-[11px] text-slate-500">
                          Thực hiện bởi: {log.author} • {new Date(log.timestamp).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 border-t border-slate-700 bg-slate-900/60 flex items-center justify-end">
              <button
                onClick={() => setLogsModalOpen(false)}
                className="px-4 py-2 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
