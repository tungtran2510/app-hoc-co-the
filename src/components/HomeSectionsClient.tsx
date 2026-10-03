'use client';

import React, { useState, useEffect } from 'react';
import { Edit2, EyeOff } from 'lucide-react';
import { Topic, AuthorProfile, RecommendedBook, AuthorBook } from '../lib/types';
import { checkIsAdminClient } from '../lib/adminAuth';
import { saveSettingsApi } from '../lib/apiAdmin';
import { normalizeAuthorProfile, normalizeHomeSectionsOrder } from '../lib/data';
import TopicListClient from './TopicListClient';
import AuthorIntroSection, {
  AuthorProfileSection,
  AuthorBooksSection,
  AuthorPhilosophySection,
  AuthorContactSection,
} from './AuthorIntroSection';
import RecommendedBooksSection from './RecommendedBooksSection';
import FlatMinimalistBooksSection from './FlatMinimalistBooksSection';
import ReorderHomeSectionsModal from './admin/ReorderHomeSectionsModal';
import EditAuthorModal from './admin/EditAuthorModal';
import EditAppModal from './admin/EditAppModal';
import EditSingleAuthorBookModal from './admin/EditSingleAuthorBookModal';
import BookDetailModal from './BookDetailModal';
import WelcomeModal from './WelcomeModal';
import HomeContinueSection from './HomeContinueSection';
import SectionOrderControls from './admin/SectionOrderControls';

interface HomeSectionsClientProps {
  initialSectionsOrder?: string[] | null;
  initialHiddenSections?: string[] | null;
  topicsWithCounts: {
    topic: Topic;
    pageCount: number;
  }[];
  topicsTitle?: string | null;
  authorProfile?: AuthorProfile | null;
  recommendedBooksTitle?: string | null;
  recommendedBooksSubtitle?: string | null;
  recommendedBooks?: RecommendedBook[];
  initialBooksLayout?: 'grid' | 'lookbook' | null;
  appName?: string | null;
  appSubtitle?: string | null;
  brandTagline?: string | null;
  logoUrl?: string | null;
  hotline?: string | null;
  zaloUrl?: string | null;
  welcomeTitle?: string | null;
  welcomeMessage?: string | null;
  welcomeVideoUrl?: string | null;
}

export default function HomeSectionsClient({
  initialSectionsOrder,
  initialHiddenSections,
  topicsWithCounts,
  topicsTitle,
  authorProfile: initialAuthorProfile,
  recommendedBooksTitle,
  recommendedBooksSubtitle,
  recommendedBooks = [],
  initialBooksLayout,
  appName: initialAppName,
  appSubtitle: initialAppSubtitle,
  brandTagline: initialBrandTagline,
  logoUrl: initialLogoUrl,
  hotline: initialHotline,
  zaloUrl: initialZaloUrl,
  welcomeTitle: initialWelcomeTitle,
  welcomeMessage: initialWelcomeMessage,
  welcomeVideoUrl: initialWelcomeVideoUrl,
}: HomeSectionsClientProps) {
  const [sectionsOrder, setSectionsOrder] = useState<string[]>(() =>
    normalizeHomeSectionsOrder(initialSectionsOrder)
  );

  const [hiddenSections, setHiddenSections] = useState<string[]>(() =>
    initialHiddenSections || []
  );

  const [authorProfile, setAuthorProfile] = useState<AuthorProfile>(() =>
    normalizeAuthorProfile(initialAuthorProfile)
  );

  const [appName, setAppName] = useState(initialAppName || 'Học Cơ Thể');
  const [appSubtitle, setAppSubtitle] = useState(initialAppSubtitle ?? '');
  const [brandTagline, setBrandTagline] = useState(
    initialBrandTagline !== undefined && initialBrandTagline !== null
      ? initialBrandTagline
      : 'EMPOWERING MEDICAL KNOWLEDGE'
  );
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogoUrl || null);
  const [hotline, setHotline] = useState(initialHotline || '');
  const [zaloUrl, setZaloUrl] = useState(initialZaloUrl || '');

  const [welcomeTitle, setWelcomeTitle] = useState(
    initialWelcomeTitle || 'Chào mừng bạn đến với Qbiz Books'
  );
  const [welcomeMessage, setWelcomeMessage] = useState(
    initialWelcomeMessage ||
      'Hi vọng nền tảng học hiểu cơ thể và chăm sóc sức khỏe chủ động này sẽ giúp bạn hiểu sâu hơn về cơ thể mình, nuôi dưỡng hệ cơ xương khớp và sống khỏe mỗi ngày.'
  );
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState(initialWelcomeVideoUrl || '');
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [showEditAppModal, setShowEditAppModal] = useState(false);
  const [authorModalTab, setAuthorModalTab] = useState<'author' | 'books' | 'contact' | 'extra'>('author');
  const [selectedAuthorBook, setSelectedAuthorBook] = useState<AuthorBook | null>(null);
  const [editingSingleAuthorBook, setEditingSingleAuthorBook] = useState<AuthorBook | null>(null);

  const handleSaveSingleAuthorBook = async (updatedBook: AuthorBook) => {
    const books = authorProfile.books || [];
    const nextBooks = books.map((b) => (b.id === updatedBook.id ? updatedBook : b));
    const nextProfile = { ...authorProfile, books: nextBooks };
    setAuthorProfile(nextProfile);
    if (isAdmin) {
      await saveSettingsApi({ author_profile: nextProfile });
    }
  };

  useEffect(() => {
    checkIsAdminClient().then(setIsAdmin);
    if (initialSectionsOrder) {
      setSectionsOrder(normalizeHomeSectionsOrder(initialSectionsOrder));
    }
    if (initialHiddenSections) {
      setHiddenSections(initialHiddenSections);
    }
  }, [initialSectionsOrder, initialHiddenSections]);

  useEffect(() => {
    if (initialAuthorProfile) {
      setAuthorProfile(normalizeAuthorProfile(initialAuthorProfile));
    }
  }, [initialAuthorProfile]);

  useEffect(() => {
    if (initialAppName) setAppName(initialAppName);
    if (initialAppSubtitle) setAppSubtitle(initialAppSubtitle);
    if (initialLogoUrl) setLogoUrl(initialLogoUrl);
    if (initialHotline) setHotline(initialHotline);
    if (initialZaloUrl) setZaloUrl(initialZaloUrl);
    if (initialWelcomeTitle) setWelcomeTitle(initialWelcomeTitle);
    if (initialWelcomeMessage) setWelcomeMessage(initialWelcomeMessage);
    if (initialWelcomeVideoUrl) setWelcomeVideoUrl(initialWelcomeVideoUrl);
  }, [initialAppName, initialAppSubtitle, initialLogoUrl, initialHotline, initialZaloUrl, initialWelcomeTitle, initialWelcomeMessage, initialWelcomeVideoUrl]);

  const openAuthorModal = (tab: 'author' | 'books' | 'contact' | 'extra') => {
    setAuthorModalTab(tab);
    setShowAuthorModal(true);
  };

  const handleToggleSectionVisibility = async (sectionKey: string) => {
    const isCurrentlyHidden = hiddenSections.includes(sectionKey);
    const nextHidden = isCurrentlyHidden
      ? hiddenSections.filter((key) => key !== sectionKey)
      : [...hiddenSections, sectionKey];

    setHiddenSections(nextHidden);

    const res = await saveSettingsApi({
      hidden_home_sections: nextHidden,
    });

    if (!res.success) {
      alert('Chưa thể cập nhật trạng thái hiển thị – vui lòng kiểm tra kết nối mạng.');
      setHiddenSections(hiddenSections);
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sectionsOrder.length) return;

    const nextOrder = [...sectionsOrder];
    const temp = nextOrder[index];
    nextOrder[index] = nextOrder[targetIndex];
    nextOrder[targetIndex] = temp;

    // Cập nhật giao diện ngay lập tức
    setSectionsOrder(nextOrder);

    // Lưu vào database ngầm
    const res = await saveSettingsApi({
      home_sections_order: nextOrder,
    });

    if (!res.success) {
      alert('Chưa thể lưu thứ tự khối – vui lòng kiểm tra kết nối mạng.');
      // Rollback
      setSectionsOrder(sectionsOrder);
    }
  };

  const handleModalSaved = (newOrder: string[], newHidden?: string[]) => {
    setSectionsOrder(newOrder);
    if (newHidden) {
      setHiddenSections(newHidden);
    }
  };

  // Di chuyển thứ tự sách của tác giả
  const handleMoveAuthorBook = async (index: number, direction: 'up' | 'down') => {
    const books = authorProfile.books || [];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= books.length) return;
    const nextBooks = [...books];
    const temp = nextBooks[index];
    nextBooks[index] = nextBooks[targetIndex];
    nextBooks[targetIndex] = temp;
    const nextProfile = { ...authorProfile, books: nextBooks };
    setAuthorProfile(nextProfile);
    if (isAdmin) {
      await saveSettingsApi({ author_profile: nextProfile });
    }
  };

  // Xóa sách của tác giả
  const handleDeleteAuthorBook = async (index: number) => {
    const books = authorProfile.books || [];
    if (!confirm('Bạn có chắc chắn muốn xóa cuốn sách này khỏi danh sách tác giả?')) return;
    const nextBooks = books.filter((_, i) => i !== index);
    const nextProfile = { ...authorProfile, books: nextBooks };
    setAuthorProfile(nextProfile);
    if (isAdmin) {
      await saveSettingsApi({ author_profile: nextProfile });
    }
  };

  return (
    <>
      {sectionsOrder.map((sectionKey, index) => {
        const isHidden = hiddenSections.includes(sectionKey);

        // Người xem thông thường (!isAdmin) không thấy các khối bị ẩn tạm
        if (!isAdmin && isHidden) {
          return null;
        }

        const hiddenBanner = isAdmin && isHidden ? (
          <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 rounded-[12px] bg-amber-500/15 border border-amber-500/35 text-amber-900 dark:text-amber-200 text-[12px] font-medium animate-in fade-in">
            <div className="flex items-center gap-1.5">
              <EyeOff size={13} className="text-amber-600 dark:text-amber-400 shrink-0" strokeWidth={2.5} />
              <span>Khối này đang <strong>ẨN TẠM</strong> (Chỉ Quản trị viên nhìn thấy)</span>
            </div>
            <button
              type="button"
              onClick={() => handleToggleSectionVisibility(sectionKey)}
              className="px-2 py-0.5 rounded-[6px] bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
            >
              Hiện lại
            </button>
          </div>
        ) : null;

        // KHỐI 1: THƯƠNG HIỆU (BRAND CARD)
        if (sectionKey === 'brand_card') {
          return (
            <section key="brand_card" className="flex flex-col gap-1.5 mt-0.5">
              {hiddenBanner}
              {isAdmin && (
                <SectionOrderControls
                  sectionTitle="THƯƠNG HIỆU & GIỚI THIỆU"
                  sectionIndex={index}
                  totalSections={sectionsOrder.length}
                  isHidden={isHidden}
                  onToggleVisibility={() => handleToggleSectionVisibility('brand_card')}
                  onMoveUp={() => handleMoveSection(index, 'up')}
                  onMoveDown={() => handleMoveSection(index, 'down')}
                  onOpenReorderModal={() => setShowReorderModal(true)}
                  onEdit={() => setShowEditAppModal(true)}
                  editLabel="Sửa thương hiệu"
                />
              )}

              {/* DÒNG BRAND CARD NỔI BẬT ("MEDICA LEARN" STYLE) - HIỆU ỨNG NHỊP THỞ SINH HỌC & NHỊP TIM MEDICA */}
              <div
                onClick={() => setShowWelcomeModal(true)}
                className={`w-full rounded-[14px] bg-white text-slate-900 border border-slate-200/80 shadow-xs animate-bio-breathing hover:shadow-lg hover:shadow-blue-950/10 hover:border-amber-400/80 dark:hover:border-amber-400/70 dark:hover:shadow-[0_10px_28px_rgba(245,158,11,0.15)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 dark:bg-gradient-to-br dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0B132B] dark:border-white/15 dark:text-white p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer group ${
                  isHidden ? 'opacity-80 ring-2 ring-dashed ring-amber-500/40' : ''
                }`}
                title="Bấm để xem lời ngỏ chào mừng & video giới thiệu"
              >
                {/* Logo app 3D bên trái */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[14px] overflow-hidden border border-amber-400/50 dark:border-amber-400/70 shadow-md shrink-0 bg-[#0C152B] p-0.5">
                  <img
                    src={logoUrl || '/app_logo.png'}
                    alt="Logo Qbiz Books"
                    className="w-full h-full object-cover rounded-[11px]"
                  />
                </div>

                {/* Khối chữ thương hiệu ở giữa */}
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[16px] sm:text-[17px] font-black tracking-tight text-slate-900 dark:text-white uppercase">
                      {appName ? appName.split(' ')[0] : 'QBIZ'}
                    </span>
                    <span className="text-[16px] sm:text-[17px] font-black tracking-tight text-amber-600 dark:text-amber-400 uppercase">
                      {appName && appName.includes(' ') ? appName.split(' ').slice(1).join(' ') : 'BOOKS'}
                    </span>
                    {isAdmin && <Edit2 size={12} className="text-slate-400 dark:text-slate-400 opacity-60" />}
                  </div>
                  {brandTagline && brandTagline.trim() ? (
                    <span className="text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 mt-0.5 truncate">
                      {brandTagline.trim()}
                    </span>
                  ) : null}
                  {appSubtitle && appSubtitle.trim() ? (
                    <span className="text-[10.5px] sm:text-[11px] text-slate-600 dark:text-slate-200 font-medium line-clamp-1">
                      {appSubtitle.trim()}
                    </span>
                  ) : null}
                </div>

                {/* Huy hiệu Vàng Kim bên phải - Icon quả tim đập nhịp y khoa */}
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-[15px] bg-gradient-to-br from-amber-50 via-slate-50 to-amber-100/60 border border-amber-300/80 dark:bg-slate-800 dark:border-amber-300/70 p-[2px] shadow-md shrink-0 flex items-center justify-center relative overflow-hidden">
                  <div className="flex flex-col items-center justify-center text-amber-600 dark:text-amber-300">
                    <svg className="w-5 h-5 text-amber-600 dark:text-amber-300 drop-shadow-xs dark:drop-shadow-[0_1px_3px_rgba(245,158,11,0.8)] animate-medica-heartbeat" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor" fillOpacity="0.25" />
                      <path d="M3.5 12h3l2-3 3 6 2-3h7" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    <span className="text-[7px] font-black tracking-widest text-amber-700 dark:text-amber-200 uppercase mt-0.5">MEDICA</span>
                  </div>
                </div>
              </div>
            </section>
          );
        }

        // KHỐI 2: CHUYÊN ĐỀ HỌC (TOPICS)
        if (sectionKey === 'topics') {
          return (
            <React.Fragment key="topics">
              {hiddenBanner}
              <TopicListClient
                initialTopics={topicsWithCounts}
                initialTopicsTitle={topicsTitle}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('topics')}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
              />
            </React.Fragment>
          );
        }

        // KHỐI 3: HOẠT ĐỘNG GẦN ĐÂY (RECENT ACTIVITY)
        if (sectionKey === 'recent_activity') {
          return (
            <section key="recent_activity" className="flex flex-col gap-1.5 mt-2">
              {hiddenBanner}
              {isAdmin && (
                <SectionOrderControls
                  sectionTitle="HOẠT ĐỘNG GẦN ĐÂY"
                  sectionIndex={index}
                  totalSections={sectionsOrder.length}
                  isHidden={isHidden}
                  onToggleVisibility={() => handleToggleSectionVisibility('recent_activity')}
                  onMoveUp={() => handleMoveSection(index, 'up')}
                  onMoveDown={() => handleMoveSection(index, 'down')}
                  onOpenReorderModal={() => setShowReorderModal(true)}
                />
              )}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 shrink-0">
                  <h3 className="text-[17.5px] sm:text-[18.5px] font-black text-ink tracking-tight whitespace-nowrap">
                    Hoạt động gần đây
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100/80 border border-amber-300/60 dark:text-[#F8DF7B] dark:bg-[#2E1B58] dark:border-0 px-2 py-0.5 rounded-full shrink-0">
                    Đang học dở
                  </span>
                </div>
              </div>
              <HomeContinueSection />
            </section>
          );
        }

        // KHỐI 4: HỒ SƠ TÁC GIẢ & LỜI TỰA (MASTER SINGLE CARD - GỘP 1 KHUNG DUY NHẤT)
        if (sectionKey === 'author_profile') {
          return (
            <React.Fragment key="author_profile">
              {hiddenBanner}
              <AuthorProfileSection
                profile={authorProfile}
                isAdmin={isAdmin}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('author_profile')}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
                onEdit={() => openAuthorModal('author')}
                onEditPhilosophy={() => openAuthorModal('extra')}
              />
            </React.Fragment>
          );
        }

        // KHỐI 5: SÁCH & TÁC PHẨM ĐÃ LÀM (AUTHOR BOOKS)
        if (sectionKey === 'author_books') {
          return (
            <React.Fragment key="author_books">
              {hiddenBanner}
              <AuthorBooksSection
                profile={authorProfile}
                isAdmin={isAdmin}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('author_books')}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
                onEdit={() => openAuthorModal('books')}
                onEditSingleBook={(b) => setEditingSingleAuthorBook(b)}
                onSelectBook={(b) => setSelectedAuthorBook(b)}
                onMoveBook={handleMoveAuthorBook}
                onDeleteBook={handleDeleteAuthorBook}
              />
            </React.Fragment>
          );
        }

        // KHỐI 6: TRIẾT LÝ & ĐỊNH HƯỚNG (AUTHOR PHILOSOPHY)
        // Đã được gộp trọn vẹn vào 1 khung duy nhất trong AuthorProfileSection (Mẫu 1)
        if (sectionKey === 'author_philosophy') {
          if (sectionsOrder.includes('author_profile')) {
            return null;
          }
          return (
            <React.Fragment key="author_philosophy">
              {hiddenBanner}
              <AuthorPhilosophySection
                profile={authorProfile}
                isAdmin={isAdmin}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('author_philosophy')}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
                onEdit={() => openAuthorModal('extra')}
              />
            </React.Fragment>
          );
        }

        // KHỐI 7: SÁCH NÊN ĐỌC (RECOMMENDED BOOKS)
        if (sectionKey === 'recommended_books') {
          return (
            <React.Fragment key="recommended_books">
              {hiddenBanner}
              <RecommendedBooksSection
                initialTitle={recommendedBooksTitle}
                initialSubtitle={recommendedBooksSubtitle}
                initialBooks={recommendedBooks}
                initialLayout={initialBooksLayout}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('recommended_books')}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
              />
            </React.Fragment>
          );
        }

        // KHỐI MỚI: TỦ SÁCH TỐI GIẢN (PHONG CÁCH PHẲNG NHƯ MẪU NGƯỜI DÙNG YÊU CẦU)
        if (sectionKey === 'flat_books') {
          return (
            <React.Fragment key="flat_books">
              {hiddenBanner}
              <FlatMinimalistBooksSection
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('flat_books')}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
              />
            </React.Fragment>
          );
        }

        // KHỐI 8: THÔNG TIN LIÊN HỆ & TƯ VẤN (AUTHOR CONTACT)
        if (sectionKey === 'author_contact') {
          return (
            <React.Fragment key="author_contact">
              {hiddenBanner}
              <AuthorContactSection
                profile={authorProfile}
                isAdmin={isAdmin}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('author_contact')}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
                onEdit={() => openAuthorModal('contact')}
              />
            </React.Fragment>
          );
        }

        // FALLBACK: AUTHOR KHỐI CHUNG NẾU LƯU DẠNG CŨ
        if (sectionKey === 'author') {
          return (
            <React.Fragment key="author">
              {hiddenBanner}
              <AuthorIntroSection
                initialProfile={authorProfile}
                sectionIndex={index}
                totalSections={sectionsOrder.length}
                isHidden={isHidden}
                onToggleVisibility={() => handleToggleSectionVisibility('author')}
                onMoveUp={() => handleMoveSection(index, 'up')}
                onMoveDown={() => handleMoveSection(index, 'down')}
                onOpenReorderModal={() => setShowReorderModal(true)}
              />
            </React.Fragment>
          );
        }

        return null;
      })}

      {/* Modal chi tiết sách của tác giả */}
      {selectedAuthorBook && (
        <BookDetailModal
          book={{
            ...selectedAuthorBook,
            author: authorProfile.name || 'Tác giả',
            type: 'author',
          }}
          isAdmin={isAdmin}
          onClose={() => setSelectedAuthorBook(null)}
          onEdit={() => {
            const b = selectedAuthorBook;
            setSelectedAuthorBook(null);
            setEditingSingleAuthorBook(b);
          }}
        />
      )}

      {/* Modal chỉnh sửa tác giả */}
      {showAuthorModal && (
        <EditAuthorModal
          isOpen={true}
          initialProfile={authorProfile}
          initialTab={authorModalTab}
          onClose={() => setShowAuthorModal(false)}
          onSaved={(newProfile) => {
            setAuthorProfile(newProfile);
          }}
        />
      )}

      {/* Modal chỉnh sửa ứng dụng & thương hiệu (Brand Card) */}
      {showEditAppModal && (
        <EditAppModal
          isOpen={true}
          initialName={appName}
          initialSubtitle={appSubtitle}
          initialBrandTagline={brandTagline}
          initialLogoUrl={logoUrl}
          initialHotline={hotline}
          initialZaloUrl={zaloUrl}
          onClose={() => setShowEditAppModal(false)}
          onSaved={(newName, newSubtitle, newLogo, newHotline, newZalo, newTagline) => {
            setAppName(newName);
            setAppSubtitle(newSubtitle);
            if (newTagline !== undefined) setBrandTagline(newTagline);
            setLogoUrl(newLogo);
            setHotline(newHotline);
            setZaloUrl(newZalo);
            setShowEditAppModal(false);
          }}
        />
      )}

      {/* Modal Sắp xếp thứ tự các khối */}
      <ReorderHomeSectionsModal
        isOpen={showReorderModal}
        currentOrder={sectionsOrder}
        currentHidden={hiddenSections}
        onClose={() => setShowReorderModal(false)}
        onSaved={handleModalSaved}
      />

      {/* Modal Lời ngỏ chào mừng khi nhấn vào Brand Card Qbiz Books */}
      <WelcomeModal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        appName={appName}
        appSubtitle={appSubtitle}
        logoUrl={logoUrl}
        hotline={hotline}
        zaloUrl={zaloUrl}
        initialWelcomeTitle={welcomeTitle}
        initialWelcomeMessage={welcomeMessage}
        initialWelcomeVideoUrl={welcomeVideoUrl}
        isAdmin={isAdmin}
        onSaved={(newTitle, newMessage, newVideo) => {
          setWelcomeTitle(newTitle);
          setWelcomeMessage(newMessage);
          setWelcomeVideoUrl(newVideo);
        }}
      />

      {/* Modal Chỉnh sửa ĐÚNG 1 CUỐN SÁCH của tác giả */}
      <EditSingleAuthorBookModal
        isOpen={Boolean(editingSingleAuthorBook)}
        book={editingSingleAuthorBook}
        onClose={() => setEditingSingleAuthorBook(null)}
        onSaved={handleSaveSingleAuthorBook}
      />
    </>
  );
}
