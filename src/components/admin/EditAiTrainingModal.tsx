'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  FileText,
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Loader2,
  CheckCircle2,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AiTrainingConfig, AiKnowledgeDoc, AiFaqItem } from '../../lib/types';
import { saveSettingsApi } from '../../lib/apiAdmin';
import { normalizeAiTraining } from '../../lib/data';

interface EditAiTrainingModalProps {
  isOpen: boolean;
  initialConfig?: AiTrainingConfig | null;
  onClose: () => void;
  onSaved: (newConfig: AiTrainingConfig) => void;
}

export default function EditAiTrainingModal({
  isOpen,
  initialConfig,
  onClose,
  onSaved,
}: EditAiTrainingModalProps) {
  const [activeTab, setActiveTab] = useState<'documents' | 'guidelines' | 'faqs'>('documents');
  const [guidelines, setGuidelines] = useState('');
  const [documents, setDocuments] = useState<AiKnowledgeDoc[]>([]);
  const [faqs, setFaqs] = useState<AiFaqItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const normalized = normalizeAiTraining(initialConfig);
      setGuidelines(normalized.guidelines || '');
      setDocuments(normalized.documents ? normalized.documents.map((d) => ({ ...d })) : []);
      setFaqs(normalized.faqs ? normalized.faqs.map((f) => ({ ...f })) : []);
      setErrorMsg('');
      setSuccessMsg('');
      if (normalized.documents && normalized.documents.length > 0) {
        setExpandedDocId(normalized.documents[0].id);
      } else {
        // Tải đầy đủ tài liệu phục vụ quản trị Admin theo yêu cầu
        fetch('/api/ai/training?full=1')
          .then((res) => res.json())
          .then((data) => {
            if (data.success && Array.isArray(data.ai_training?.documents)) {
              setDocuments(data.ai_training.documents);
              if (data.ai_training.documents.length > 0) {
                setExpandedDocId(data.ai_training.documents[0].id);
              }
            }
          })
          .catch(() => {});
      }
    }
  }, [isOpen, initialConfig]);

  if (!isOpen) return null;

  // Thêm tài liệu mới
  const handleAddDocument = () => {
    const newDocId = `doc-${Date.now()}`;
    const newDoc: AiKnowledgeDoc = {
      id: newDocId,
      title: `Tài liệu / Cẩm nang #${documents.length + 1}`,
      content: '',
      updated_at: new Date().toISOString(),
    };
    setDocuments((prev) => [newDoc, ...prev]);
    setExpandedDocId(newDocId);
  };

  const handleUpdateDoc = (id: string, patch: Partial<AiKnowledgeDoc>) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch, updated_at: new Date().toISOString() } : d))
    );
  };

  const handleDeleteDoc = (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa tài liệu này khỏi kho huấn luyện của AI?')) return;
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Thêm FAQ mới
  const handleAddFaq = () => {
    const newFaq: AiFaqItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleUpdateFaq = (id: string, patch: Partial<AiFaqItem>) => {
    setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  // Lưu cài đặt
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg('');
      setSuccessMsg('');

      const cleanDocs: AiKnowledgeDoc[] = documents
        .filter((d) => d.title.trim() || d.content.trim())
        .map((d) => ({
          id: d.id || `doc-${Date.now()}`,
          title: d.title.trim() || 'Tài liệu không tên',
          content: d.content.trim(),
          updated_at: new Date().toISOString(),
        }));

      const cleanFaqs: AiFaqItem[] = faqs
        .filter((f) => f.question.trim() || f.answer.trim())
        .map((f) => ({
          id: f.id || `faq-${Date.now()}`,
          question: f.question.trim(),
          answer: f.answer.trim(),
        }));

      const payload: AiTrainingConfig = {
        guidelines: guidelines.trim(),
        documents: cleanDocs,
        faqs: cleanFaqs,
      };

      const res = await saveSettingsApi({
        ai_training: payload,
      });

      if (res.success) {
        setSuccessMsg('Đã lưu kho tri thức & Huấn luyện AI thành công!');
        onSaved(payload);
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setErrorMsg(res.error || 'Chưa lưu được – vui lòng thử lại.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi mạng khi lưu cấu hình AI.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-[680px] max-h-[92vh] bg-white rounded-t-[28px] sm:rounded-[28px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-200">
        {/* Nút kéo trên mobile */}
        <div className="w-12 h-1.5 bg-line-strong rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header Modal */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line bg-surface">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[12px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-[17px] font-extrabold text-ink leading-tight">
                Cài Đặt & Huấn Luyện Trợ Lý AI
              </h3>
              <p className="text-[12px] text-muted">
                Nạp sách, tài liệu & định hình phong cách trả lời cho AI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Thanh chuyển Tab */}
        <div className="flex items-center border-b border-line bg-surface px-4 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'documents'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <BookOpen size={15} />
            <span>Nạp tài liệu & Sách ({documents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guidelines'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <Sliders size={15} />
            <span>Lời dặn & Nguyên tắc</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-1.5 py-3 px-3.5 border-b-2 text-[13px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'faqs'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <HelpCircle size={15} />
            <span>Hỏi – Đáp chuẩn ({faqs.length})</span>
          </button>
        </div>

        {/* Body form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-3 rounded-[12px] bg-red-50 border border-red-200 text-red-700 text-[13px] font-semibold">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-[12px] bg-emerald-50 border border-emerald-200 text-emerald-700 text-[13px] font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* TAB 1: TÀI LIỆU & SÁCH CHUYÊN SÂU */}
          {activeTab === 'documents' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="text-[14.5px] font-extrabold text-ink">
                    Kho tài liệu & Sách chuyên sâu ({documents.length})
                  </h4>
                  <p className="text-[12px] text-muted">
                    Dán nội dung sách, bài viết nghiên cứu của bạn vào đây. AI sẽ dùng nguồn này để giải đáp.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddDocument}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-primary text-white text-[12px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Thêm tài liệu</span>
                </button>
              </div>

              {documents.length === 0 ? (
                <div className="p-8 rounded-[18px] border-2 border-dashed border-line text-center flex flex-col items-center justify-center gap-2">
                  <FileText size={32} className="text-muted/60" />
                  <p className="text-[13px] text-muted">
                    Chưa có tài liệu nào được nạp.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddDocument}
                    className="text-[13px] font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    + Nhấn vào đây để thêm tài liệu đầu tiên
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {documents.map((doc, idx) => {
                    const isExpanded = expandedDocId === doc.id;
                    const wordCount = doc.content.trim() ? doc.content.trim().split(/\s+/).length : 0;

                    return (
                      <div
                        key={doc.id || idx}
                        className="rounded-[18px] bg-white border border-line shadow-xs overflow-hidden"
                      >
                        {/* Thanh tiêu đề tài liệu */}
                        <div
                          onClick={() => setExpandedDocId(isExpanded ? null : doc.id)}
                          className="flex items-center justify-between p-3.5 px-4 bg-surface hover:bg-surface-2 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-full bg-primary-soft text-primary text-[11px] font-extrabold flex items-center justify-center shrink-0">
                              #{idx + 1}
                            </span>
                            <span className="text-[14px] font-bold text-ink truncate">
                              {doc.title || 'Tài liệu chưa đặt tên'}
                            </span>
                            <span className="text-[11px] text-muted font-medium shrink-0">
                              ({wordCount} từ)
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteDoc(doc.id);
                              }}
                              className="w-7 h-7 rounded-[8px] hover:bg-red-50 text-muted hover:text-red-600 flex items-center justify-center cursor-pointer"
                              title="Xóa tài liệu này"
                            >
                              <Trash2 size={14} />
                            </button>
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </div>

                        {/* Nội dung chi tiết tài liệu khi mở rộng */}
                        {isExpanded && (
                          <div className="p-4 border-t border-line flex flex-col gap-3">
                            <div>
                              <label className="block text-[12px] font-bold text-ink mb-1">
                                Tên tài liệu / Tên sách / Chương
                              </label>
                              <input
                                type="text"
                                value={doc.title}
                                onChange={(e) => handleUpdateDoc(doc.id, { title: e.target.value })}
                                placeholder="Ví dụ: Sách Hiểu Đúng Về Cột Sống - Chương 3: Đĩa đệm"
                                className="w-full h-9 px-3 rounded-[10px] bg-surface border border-line text-[13.5px] font-bold text-ink focus:border-primary focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <div className="flex items-center justify-between mb-1">
                                <label className="text-[12px] font-bold text-ink">
                                  Nội dung tài liệu (Dán hàng nghìn từ tùy thích)
                                </label>
                                <span className="text-[11px] text-muted font-medium">
                                  {doc.content.length} ký tự
                                </span>
                              </div>
                              <textarea
                                value={doc.content}
                                onChange={(e) =>
                                  handleUpdateDoc(doc.id, { content: e.target.value })
                                }
                                rows={8}
                                placeholder="Dán toàn bộ nội dung chương sách, tài liệu nghiên cứu, ghi chú kiến thức sức khỏe độc quyền của bạn vào đây..."
                                className="w-full p-3 rounded-[12px] bg-surface border border-line text-[13px] text-ink focus:border-primary focus:outline-hidden leading-relaxed font-normal"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LỜI DẶN & NGUYÊN TẮC TÁC GIẢ */}
          {activeTab === 'guidelines' && (
            <div className="flex flex-col gap-3">
              <div>
                <h4 className="text-[14.5px] font-extrabold text-ink">
                  Lời dặn & Nguyên tắc huấn luyện AI
                </h4>
                <p className="text-[12px] text-muted">
                  Định hướng cách AI giao tiếp, những điều bắt buộc phải nói hoặc tuyệt đối cấm kỵ.
                </p>
              </div>

              <textarea
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                rows={10}
                placeholder={`1. Luôn trả lời ngắn gọn (1-2 câu), đi thẳng vào kết luận theo phương pháp sinh cơ học của tác giả.
2. Tuyệt đối không khuyên uống thuốc bừa bãi hoặc gây hoang mang lo sợ.
3. Luôn nhấn mạnh việc thấu hiểu cơ thể, điều chỉnh tư thế và tự phục hồi tự nhiên.
4. Điều hướng người học mở các bài học liên quan trong hệ thống để xem chi tiết.`}
                className="w-full p-3.5 rounded-[14px] bg-surface border border-line text-[13.5px] text-ink focus:border-primary focus:outline-hidden leading-relaxed"
              />
            </div>
          )}

          {/* TAB 3: HỎI - ĐÁP CHUẨN (FAQS) */}
          {activeTab === 'faqs' && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <h4 className="text-[14.5px] font-extrabold text-ink">
                    Cặp câu hỏi & Trả lời chuẩn ({faqs.length})
                  </h4>
                  <p className="text-[12px] text-muted">
                    Khi người học hỏi câu tương tự, AI sẽ ưu tiên phát ngôn chính xác theo câu trả lời mẫu của bạn.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="flex items-center gap-1.5 h-8 px-3 rounded-[10px] bg-primary text-white text-[12px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-2xs shrink-0"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Thêm câu hỏi</span>
                </button>
              </div>

              {faqs.length === 0 ? (
                <div className="p-8 rounded-[18px] border-2 border-dashed border-line text-center flex flex-col items-center justify-center gap-2">
                  <HelpCircle size={32} className="text-muted/60" />
                  <p className="text-[13px] text-muted">
                    Chưa có cặp câu hỏi mẫu nào.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddFaq}
                    className="text-[13px] font-extrabold text-primary hover:underline cursor-pointer"
                  >
                    + Thêm câu hỏi mẫu
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {faqs.map((faq, fIdx) => (
                    <div
                      key={faq.id || fIdx}
                      className="p-3.5 rounded-[16px] bg-white border border-line shadow-xs flex flex-col gap-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-extrabold text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                          Câu hỏi #{fIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(faq.id)}
                          className="w-6 h-6 rounded-[6px] hover:bg-red-50 text-muted hover:text-red-600 flex items-center justify-center cursor-pointer"
                          title="Xóa câu hỏi này"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-ink mb-1">
                          Câu hỏi của người học
                        </label>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => handleUpdateFaq(faq.id, { question: e.target.value })}
                          placeholder="Ví dụ: Thoát vị đĩa đệm có tập xà đơn được không?"
                          className="w-full h-8 px-3 rounded-[8px] bg-surface border border-line text-[13px] font-bold text-ink focus:border-primary focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-bold text-ink mb-1">
                          Câu trả lời chuẩn của tác giả
                        </label>
                        <textarea
                          value={faq.answer}
                          onChange={(e) => handleUpdateFaq(faq.id, { answer: e.target.value })}
                          rows={2}
                          placeholder="Nhập câu trả lời ngắn gọn, chuẩn mực của bạn..."
                          className="w-full p-2.5 rounded-[8px] bg-surface border border-line text-[12.5px] text-ink focus:border-primary focus:outline-hidden leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Footer Modal */}
        <div className="flex items-center justify-between p-4 px-5 border-t border-line bg-surface">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-10 px-4 rounded-[12px] bg-surface-2 text-ink text-[13.5px] font-bold hover:bg-surface-3 transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 h-10 px-5 rounded-[12px] bg-primary text-white text-[13.5px] font-extrabold hover:bg-primary-hover transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Đang lưu & Huấn luyện...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Lưu & Huấn luyện AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
