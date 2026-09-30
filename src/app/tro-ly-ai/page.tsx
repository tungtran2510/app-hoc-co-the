'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Send,
  RotateCcw,
  BookOpen,
  ChevronRight,
  Loader2,
  Bot,
  User,
  HelpCircle,
  CheckCircle2,
  Sliders,
} from 'lucide-react';
import BottomNav from '../../components/BottomNav';
import { checkAdminStatus } from '../../lib/adminAuth';
import { AiTrainingConfig } from '../../lib/types';
import EditAiTrainingModal from '../../components/admin/EditAiTrainingModal';

interface SuggestedPage {
  title: string;
  topic_title: string;
  topic_slug: string;
  page_slug: string;
  reason?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  suggested_pages?: SuggestedPage[];
  follow_up_questions?: string[];
  timestamp: number;
}

const QUICK_PROMPTS = [
  'Thoát vị đĩa đệm có tập xà đơn được không?',
  'Đau thắt lưng lan xuống chân thì nên học bài nào?',
  'Bài tập giảm đau mỏi cổ vai gáy cho dân văn phòng?',
  'Bị thoái hóa khớp gối có nên đi bộ không?',
  'Chế độ dinh dưỡng phục hồi sụn khớp và đĩa đệm?',
  'Tư thế ngủ đúng giúp bảo vệ cột sống?',
];

// Hàm format text markdown đơn giản (bold, bullet)
function renderFormattedText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Xử lý gạch đầu dòng
    const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('• ');
    const cleanLine = isBullet ? line.trim().replace(/^[-•]\s*/, '') : line;

    // Xử lý **in đậm**
    const parts = cleanLine.split(/(\*\*.*?\*\*)/g);
    const renderedParts = parts.map((part, pIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={pIdx} className="font-extrabold text-ink">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (isBullet) {
      return (
        <li key={idx} className="ml-4 list-disc text-ink/90 leading-relaxed my-0.5">
          {renderedParts}
        </li>
      );
    }

    if (!line.trim()) {
      return <div key={idx} className="h-2" />;
    }

    return (
      <p key={idx} className="text-ink/90 leading-relaxed my-1">
        {renderedParts}
      </p>
    );
  });
}

export default function AiAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [trainingConfig, setTrainingConfig] = useState<AiTrainingConfig | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchTrainingConfig = () => {
    fetch('/api/ai/training')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.ai_training) {
          setTrainingConfig(data.ai_training);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    checkAdminStatus().then(({ isAdmin: adminOk }) => {
      setIsAdmin(adminOk);
      if (adminOk) {
        fetchTrainingConfig();
      }
    });
  }, []);

  // Load lịch sử chat từ localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai_assistant_chat_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Tự động cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const saveMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    try {
      localStorage.setItem('ai_assistant_chat_v1', JSON.stringify(newMessages));
    } catch {
      // ignore
    }
  };

  const handleClearChat = () => {
    if (messages.length === 0) return;
    if (confirm('Bạn có muốn làm mới cuộc trò chuyện với Trợ lý AI?')) {
      saveMessages([]);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMsg];
    saveMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = updatedMessages.slice(-6).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          history: historyPayload,
        }),
      });

      if (!res.ok) {
        throw new Error('Lỗi máy chủ khi phản hồi');
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: data.answer || 'Xin lỗi bạn, mình chưa thể xử lý câu trả lời lúc này.',
        suggested_pages: data.suggested_pages || [],
        follow_up_questions: data.follow_up_questions || [],
        timestamp: Date.now(),
      };

      saveMessages([...updatedMessages, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        text: 'Xin lỗi bạn, kết nối tới Trợ lý AI bị gián đoạn một chút. Bạn vui lòng thử lại hoặc bấm vào các chủ đề bài học ngoài trang chủ nhé!',
        timestamp: Date.now(),
      };
      saveMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface pb-36">
      {/* 1. THANH TIÊU ĐỀ TRÊN CÙNG (STICKY) */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-line shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center text-ink hover:bg-surface-3 transition-colors cursor-pointer"
            aria-label="Về trang chủ"
          >
            <ArrowLeft size={18} />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 border border-primary/20">
              <Sparkles size={18} className="animate-pulse" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-[16px] font-extrabold text-ink leading-tight flex items-center gap-1.5">
                <span>Trợ lý AI Cơ Thể</span>
              </h1>
              <span className="text-[11.5px] text-muted font-medium">
                Tư vấn chuẩn y khoa & Tìm bài học
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowTrainingModal(true)}
              className="flex items-center gap-1.5 h-8 px-2.5 sm:px-3 rounded-[10px] bg-primary-soft hover:bg-primary/20 text-primary border border-primary/25 text-[12px] font-extrabold transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Cài đặt & Huấn luyện tri thức AI"
            >
              <Sliders size={13} strokeWidth={2.5} />
              <span>Cài đặt AI</span>
              {(trainingConfig?.documents?.length || 0) > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-primary text-white text-[10px] font-bold">
                  {trainingConfig?.documents?.length}
                </span>
              )}
            </button>
          )}

          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearChat}
              className="flex items-center gap-1 h-8 px-2.5 rounded-[10px] bg-surface-2 hover:bg-surface-3 text-muted hover:text-ink text-[12px] font-bold transition-colors cursor-pointer"
              title="Làm mới cuộc trò chuyện"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">Làm mới</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. KHUNG NỘI DUNG TIN NHẮN */}
      <main className="flex-1 flex flex-col px-4 py-4 max-w-[640px] w-full mx-auto gap-4">
        {/* BANNER QUẢN TRỊ VIÊN: HUẤN LUYỆN KIẾN THỨC AI */}
        {isAdmin && (
          <div className="p-3.5 sm:p-4 rounded-[20px] bg-emerald-50/90 border border-emerald-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-[13.5px] font-extrabold text-emerald-950 flex items-center gap-1.5">
                  <span>Trang quản trị: Huấn luyện tri thức AI</span>
                  <span className="px-1.5 py-0.2 rounded text-[9.5px] font-black uppercase bg-emerald-600 text-white">
                    Admin
                  </span>
                </div>
                <p className="text-[12px] text-emerald-800 leading-snug mt-0.5">
                  Nạp tài liệu, sách, phác đồ điều trị và bộ câu hỏi mẫu. AI sẽ học sâu và trả lời siêu ngắn gọn đúng theo tài liệu của bạn.
                </p>
                {trainingConfig?.documents && trainingConfig.documents.length > 0 && (
                  <div className="flex items-center gap-2 mt-1.5 text-[11px] text-emerald-700 font-bold">
                    <span>📚 Đã nạp: {trainingConfig.documents.length} tài liệu/sách</span>
                    <span>•</span>
                    <span>💬 {trainingConfig.faqs?.length || 0} câu hỏi - đáp</span>
                  </div>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTrainingModal(true)}
              className="self-end sm:self-center shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-[12px] bg-emerald-700 hover:bg-emerald-800 text-white text-[12.5px] font-bold shadow-xs cursor-pointer transition-all active:scale-98"
            >
              <Sliders size={14} />
              <span>Nạp tài liệu & Cài đặt</span>
            </button>
          </div>
        )}
        {/* MÀN HÌNH CHÀO MỪNG NẾU CHƯA CÓ TIN NHẮN */}
        {messages.length === 0 ? (
          <div className="flex flex-col gap-5 pt-3 animate-in fade-in duration-300">
            {/* Thẻ giới thiệu Trợ lý */}
            <div className="p-5 rounded-[24px] bg-white border border-line shadow-xs flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[16px] bg-primary-soft text-primary flex items-center justify-center shrink-0">
                  <Bot size={28} />
                </div>
                <div>
                  <h2 className="text-[17px] font-extrabold text-ink leading-snug">
                    Xin chào! Bạn cần tìm hiểu gì hôm nay?
                  </h2>
                  <p className="text-[12.5px] text-muted">
                    Trợ lý AI luôn sẵn sàng đồng hành cùng bạn 24/7
                  </p>
                </div>
              </div>

              <p className="text-[14px] text-ink/85 leading-relaxed pt-1 border-t border-line/60">
                Hãy hỏi mình về bất kỳ triệu chứng nào (đau lưng, mỏi cổ, tê chân tay...), kỹ thuật vận động an toàn hoặc bài học bạn muốn tìm kiếm trong ứng dụng nhé!
              </p>
            </div>

            {/* Gợi ý câu hỏi nhanh */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[12px] font-extrabold uppercase tracking-wider text-muted px-1 flex items-center gap-1.5">
                <HelpCircle size={14} className="text-primary" />
                <span>Câu hỏi thường gặp (Chạm để hỏi ngay)</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(prompt)}
                    className="text-left p-3.5 rounded-[16px] bg-white hover:bg-primary-soft/40 border border-line hover:border-primary/40 text-[13.5px] font-bold text-ink leading-snug transition-all cursor-pointer shadow-2xs group flex items-center justify-between gap-2"
                  >
                    <span>{prompt}</span>
                    <ChevronRight size={15} className="text-muted group-hover:text-primary shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* DANH SÁCH TIN NHẮN ĐÃ TRAO ĐỔI */
          <div className="flex flex-col gap-4">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col gap-2 ${
                    isUser ? 'items-end' : 'items-start'
                  } animate-in fade-in duration-200`}
                >
                  {/* Bong bóng tin nhắn */}
                  <div
                    className={`max-w-[88%] sm:max-w-[82%] p-4 rounded-[22px] text-[14.5px] leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-primary text-white rounded-br-[4px] font-medium'
                        : 'bg-white border border-line text-ink rounded-tl-[4px]'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <div>{renderFormattedText(msg.text)}</div>
                    )}
                  </div>

                  {/* THẺ BÀI HỌC GỢI Ý ĐI KÈM CỦA AI */}
                  {!isUser && msg.suggested_pages && msg.suggested_pages.length > 0 && (
                    <div className="w-full max-w-[92%] flex flex-col gap-2 mt-1">
                      <span className="text-[12px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1.5 px-1">
                        <BookOpen size={14} />
                        <span>Bài học đề xuất dành cho bạn:</span>
                      </span>

                      <div className="flex flex-col gap-2">
                        {msg.suggested_pages.map((sp, sIdx) => {
                          const cleanPageSlug = sp.page_slug
                            .replace(new RegExp(`^${sp.topic_slug}/`), '')
                            .replace(/^\//, '');
                          const lessonUrl = `/${sp.topic_slug}/${cleanPageSlug}`;

                          return (
                            <Link
                              key={sIdx}
                              href={lessonUrl}
                              className="p-3.5 rounded-[18px] bg-white hover:bg-primary-soft/30 border border-primary/25 hover:border-primary shadow-xs transition-all flex flex-col gap-1.5 group cursor-pointer"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="px-2 py-0.5 rounded-[6px] bg-primary-soft text-primary text-[11px] font-extrabold">
                                  {sp.topic_title}
                                </span>

                                <span className="text-[12px] font-extrabold text-primary flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                                  <span>Vào học ngay</span>
                                  <span>→</span>
                                </span>
                              </div>

                              <h4 className="text-[15px] font-extrabold text-ink leading-snug group-hover:text-primary transition-colors">
                                {sp.title}
                              </h4>

                              {sp.reason && (
                                <p className="text-[12.5px] text-muted leading-relaxed">
                                  {sp.reason}
                                </p>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* CÂU HỎI GỢI Ý TIẾP THEO (FOLLOW UP) */}
                  {!isUser && msg.follow_up_questions && msg.follow_up_questions.length > 0 && (
                    <div className="w-full max-w-[92%] flex flex-col gap-1.5 mt-1">
                      <span className="text-[11.5px] font-bold text-muted px-1">
                        Gợi ý hỏi tiếp:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.follow_up_questions.map((fq, fIdx) => (
                          <button
                            key={fIdx}
                            type="button"
                            onClick={() => handleSendMessage(fq)}
                            className="px-3 py-1.5 rounded-full bg-white hover:bg-primary-soft border border-line hover:border-primary/40 text-[12px] font-bold text-ink hover:text-primary text-left transition-colors cursor-pointer shadow-2xs"
                          >
                            💬 {fq}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* TRẠNG THÁI ĐANG TRẢ LỜI */}
            {isLoading && (
              <div className="flex items-start gap-2.5 max-w-[85%] animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0 border border-primary/20">
                  <Bot size={18} />
                </div>
                <div className="p-3.5 px-4 rounded-[20px] rounded-tl-[4px] bg-white border border-line shadow-xs flex items-center gap-2 text-muted text-[13.5px]">
                  <Loader2 size={16} className="animate-spin text-primary" />
                  <span>Trợ lý AI đang tra cứu và tổng hợp bài học...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* 3. THANH NHẬP CÂU HỎI Ở ĐÁY MÀN HÌNH (CỐ ĐỊNH TRÊN BOTTOM NAV) */}
      <div className="fixed bottom-[80px] left-0 right-0 z-20 flex justify-center bg-white/95 backdrop-blur-md border-t border-line px-4 py-2.5">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[640px] flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi triệu chứng, bài tập hoặc tìm bài học..."
              disabled={isLoading}
              className="w-full h-12 pl-4 pr-10 rounded-[18px] bg-surface border border-line text-[14.5px] text-ink placeholder:text-muted focus:border-primary focus:bg-white focus:outline-hidden transition-all shadow-inner-xs"
            />
            {input && (
              <button
                type="button"
                onClick={() => setInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-[13px] font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="w-12 h-12 rounded-[18px] bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs shrink-0 cursor-pointer"
            aria-label="Gửi câu hỏi"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>

      {/* 4. THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
      <BottomNav />

      {/* 5. MODAL HUẤN LUYỆN KIẾN THỨC CHO AI (DÀNH CHO ADMIN) */}
      {isAdmin && (
        <EditAiTrainingModal
          isOpen={showTrainingModal}
          initialConfig={trainingConfig}
          onClose={() => setShowTrainingModal(false)}
          onSaved={(newConfig) => {
            setTrainingConfig(newConfig);
            const sysMsg: ChatMessage = {
              id: `sys-${Date.now()}`,
              role: 'assistant',
              text: '✨ **Đã cập nhật kho tri thức huấn luyện AI thành công!** Mình đã ghi nhớ toàn bộ tài liệu và nguyên tắc mới bạn vừa nạp. Hãy thử đặt câu hỏi liên quan để kiểm tra câu trả lời nhé!',
              timestamp: Date.now(),
            };
            saveMessages([...messages, sysMsg]);
          }}
        />
      )}
    </div>
  );
}
