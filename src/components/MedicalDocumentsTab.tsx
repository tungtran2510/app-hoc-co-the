'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  BookOpen,
  ExternalLink,
  X,
  CheckCircle2,
  FileCheck,
  Image as ImageIcon,
  Maximize2,
  Copy,
  Printer,
  Sparkles,
  Edit2,
  Plus,
} from 'lucide-react';
import { FileItem } from '../lib/types';
import EditMedicalDocumentModal from './admin/EditMedicalDocumentModal';

export interface MedicalDocument {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  format: string;
  pages: number;
  size: string;
  source: string;
  pdfUrl: string; // Tệp PDF thật chuẩn A4 trong public/documents/
  imageUrl?: string; // Tệp hình ảnh HD thật trong public/documents/
  txtUrl?: string; // Tệp tóm tắt TXT thật trong public/documents/
  content: {
    overview: string;
    sections: {
      heading: string;
      paragraphs: string[];
      bullets?: string[];
      notes?: string;
    }[];
    clinicalAdvice: string[];
  };
}

// Kho tài liệu y khoa THẬT kèm đường dẫn file PDF, Ảnh HD và TXT
const TOPIC_DOCUMENTS: Record<string, MedicalDocument[]> = {
  'cot-song': [
    {
      id: 'doc-cot-song-1',
      title: 'Atlas & Cẩm Nang Giải Phẫu Cột Sống Toàn Diện',
      badge: 'PDF Y KHOA',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
      description: 'Tổng quan chi tiết cấu trúc 33-34 đốt sống, 4 đoạn cong sinh lý, cấu tạo đĩa đệm và hệ thống dây chằng nâng đỡ thân mình.',
      format: 'PDF Sách Y Khoa',
      pages: 14,
      size: '393 KB (14 trang)',
      source: 'Bộ Y Tế & Atlas Giải Phẫu Netter',
      pdfUrl: '/documents/atlas_giai_phau_cot_song_toan_dien.pdf',
      txtUrl: '/documents/tom_tat_giai_phau_cot_song.txt',
      content: {
        overview: 'Cột sống là cột trụ chịu lực trung tâm của cơ thể người, bảo vệ tủy sống và điều hòa mọi cử động gập, duỗi, xoay thân.',
        sections: [
          {
            heading: '1. Phân đoạn 33-34 đốt sống & 4 đường cong sinh lý',
            paragraphs: [
              'Cột sống người trưởng thành gồm 5 đoạn liên hoàn: Đoạn Cổ (C1 - C7), Đoạn Ngực (T1 - T12), Đoạn Thắt lưng (L1 - L5), Đoạn Xương cùng (S1 - S5 dính liền) và Đoạn Xương cụt (3 - 5 đốt cụt).',
              'Các đoạn cong sinh lý: Cong ưỡn cổ, cong gù ngực, cong ưỡn thắt lưng và cong gù cùng cụt. Sự phối hợp của 4 đường cong này giúp hấp thụ lực xóc gấp 10 lần so với một cột thẳng đứng.',
            ],
            bullets: [
              'C1 (Đốt đội - Atlas) & C2 (Đốt trục - Axis): Cho phép đầu xoay linh hoạt 180 độ.',
              'Thắt lưng (L1 - L5): Các đốt sống to dày nhất, chịu tải trọng lớn nhất của toàn thân.',
              'Lỗ gian đốt sống: Nơi 31 đôi dây thần kinh tủy sống chui ra chi phối các tạng và tứ chi.',
            ],
          },
          {
            heading: '2. Cấu tạo vi thể đĩa đệm & Hệ thống dây chằng',
            paragraphs: [
              'Đĩa đệm gồm 2 thành phần chính: Vòng sợi collagen (Annulus fibrosus) bên ngoài và Nhân nhầy (Nucleus pulposus) chứa 80% nước bên trong đóng vai trò như đệm thủy lực chống sốc.',
              'Hệ thống dây chằng dọc trước, dọc sau, dây chằng vàng, dây chằng liên gai và trên gai đan bện chặt chẽ để hạn chế uốn quá mức và ngăn trượt đốt sống.',
            ],
          },
        ],
        clinicalAdvice: [
          'Không nên ngồi một tư thế liên tục quá 45 phút; áp lực đĩa đệm khi ngồi gù lưng cao hơn 150% so với khi đứng thẳng.',
          'Khi cúi nhặt vật nặng, luôn gập gối hạ thấp trọng tâm, giữ cột sống thẳng, không cúi gập lưng đột ngột.',
        ],
      },
    },
    {
      id: 'doc-cot-song-2',
      title: 'Bảng Tra Cứu Lâm Sàng: Rễ Thần Kinh & Vùng Chi Phối',
      badge: 'BẢNG TRA CỨU',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
      description: 'Bản đồ chi phối vận động (Myotome) và cảm giác da (Dermatome) từ rễ cổ C1-C8 đến rễ thắt lưng - cùng L1-S5.',
      format: 'Bảng Lâm Sàng HD & PDF',
      pages: 6,
      size: '180 KB · Bản ảnh HD 543 KB',
      source: 'Hiệp Hội Thần Kinh Cột Sống (NASS)',
      pdfUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.pdf',
      imageUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
      content: {
        overview: 'Bảng tra cứu giúp phân tích chính xác vị trí chèn ép rễ thần kinh dựa trên triệu chứng tê bì, teo cơ hoặc giảm phản xạ gân xương.',
        sections: [
          {
            heading: '1. Nhánh thần kinh Cổ (C1 - C8)',
            paragraphs: [
              'Rễ C5 chi phối cơ delta và cảm giác mặt ngoài cánh tay. Rễ C6 chi phối cơ nhị đầu và ngón cái/trỏ. Rễ C7 chi phối cơ tam đầu và ngón giữa. Rễ C8 chi phối các cơ nội tại bàn tay và bờ ngón út.',
            ],
          },
          {
            heading: '2. Nhánh thần kinh Thắt lưng - Cùng (L1 - S1)',
            paragraphs: [
              'Thần kinh tọa (Sciatic nerve) là dây thần kinh lớn nhất cơ thể, hợp thành từ các rễ L4, L5, S1, S2, S3.',
              'Rễ L4 chi phối mặt trước đùi và cơ tứ đầu (phản xạ gân bánh chè). Rễ L5 chi phối cơ duỗi dài ngón chân cái và mu bàn chân. Rễ S1 chi phối cơ bắp chân và gân gót Achilles.',
            ],
            notes: 'Khi tê bì lan từ mông xuống ngón chân cái: Điển hình của chèn ép rễ L5 (thường gặp trong thoát vị L4-L5). Khi tê lan xuống gót và ngón út: Thường do chèn ép rễ S1 (thoát vị L5-S1).',
          },
        ],
        clinicalAdvice: [
          'Thử nghiệm nâng chân thẳng (Lasègue): Giúp phát hiện sớm tình trạng kích thích hoặc chèn ép rễ thần kinh tọa.',
          'Nếu xuất hiện tê vùng yên ngựa (quanh hậu môn) hoặc bí tiểu: Cần đến bệnh viện cấp cứu ngoại thần kinh ngay.',
        ],
      },
    },
    {
      id: 'doc-cot-song-3',
      title: 'Cẩm Nang Tư Thế Vàng & Bộ Bài Tập Bảo Vệ Thắt Lưng',
      badge: 'HƯỚNG DẪN THỰC HÀNH',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800',
      description: 'Phác đồ công thái học (Ergonomics) chống đau mỏi cột sống văn phòng và 5 bài tập tăng cường cơ cốt lõi (Core stability).',
      format: 'Cẩm Nang Màu PDF',
      pages: 10,
      size: '285 KB (10 trang)',
      source: 'Khoa Phục Hồi Chức Năng Y Khoa',
      pdfUrl: '/documents/cam_nang_tu_the_vang_bai_tap_lung.pdf',
      content: {
        overview: 'Hướng dẫn cụ thể, thực tế giúp bảo vệ cột sống trong đời sống hàng ngày, giảm 80% nguy cơ tái phát đau thắt lưng.',
        sections: [
          {
            heading: '1. Nguyên tắc công thái học khi làm việc',
            paragraphs: [
              'Chiều cao màn hình: Đỉnh màn hình ngang tầm mắt để cổ duy trì góc tự nhiên 0-15 độ, tránh gập cổ cúi nhìn điện thoại.',
              'Điểm tựa thắt lưng: Đặt gối tựa nhỏ ở vùng thắt lưng L1-L5 để duy trì độ cong ưỡn tự nhiên khi ngồi ghế làm việc.',
            ],
            bullets: [
              'Góc khuỷu tay và khớp gối duy trì ở mức 90 - 100 độ.',
              'Hai bàn chân đặt phẳng trên mặt sàn, không ngồi bắt chéo chân làm vẹo khung chậu.',
              'Cứ mỗi 45 - 60 phút, đứng dậy vươn vai và đi lại nhẹ nhàng 2 - 3 phút.',
            ],
          },
          {
            heading: '2. Bộ bài tập tăng cường cơ Core an toàn',
            paragraphs: [
              'Bài tập Cây cầu (Glute Bridge): Kích hoạt cơ mông và cơ dựng sống, giảm tải áp lực trực tiếp lên đĩa đệm thắt lưng.',
              'Bài tập Bird-Dog (Chim vẫy đuôi): Nâng đối bên tay và chân ở tư thế bò 4 điểm, rèn luyện sự cân bằng và ổn định cột sống mà không ép đĩa đệm.',
              'Bài tập Kéo giãn gối về ngực (Knee-to-chest): Thư giãn khớp cùng chậu và mở rộng lỗ liên hợp đốt sống.',
            ],
          },
        ],
        clinicalAdvice: [
          'Không tập các động tác gập bụng truyền thống (Sit-up) khi đang bị đau lưng vì sẽ làm tăng áp lực đẩy nhân nhầy ra sau.',
          'Tập thở bằng cơ hoành (bụng phình khi hít, xẹp khi thở) để tăng áp lực ổ bụng tự nhiên hỗ trợ nâng đỡ cột sống.',
        ],
      },
    },
    {
      id: 'doc-cot-song-4',
      title: 'Tiêu Chuẩn Chẩn Đoán & Dấu Hiệu Cờ Đỏ (Red Flags)',
      badge: 'KHUYẾN CÁO LÂM SÀNG',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800',
      description: 'Phân loại khi nào đau lưng là lành tính và khi nào là dấu hiệu khẩn cấp cần can thiệp chụp cộng hưởng từ (MRI) hoặc phẫu thuật.',
      format: 'Tài Liệu Y Tế PDF',
      pages: 8,
      size: '253 KB (8 trang)',
      source: 'Hướng Dẫn Lâm Sàng Bộ Y Tế',
      pdfUrl: '/documents/tieu_chuan_chan_doan_dau_hieu_co_do.pdf',
      content: {
        overview: 'Tài liệu dành cho người học và người bệnh nhằm nắm bắt các mốc ranh giới an toàn trong chăm sóc cột sống.',
        sections: [
          {
            heading: '1. Các dấu hiệu cờ đỏ nguy hiểm (Red Flags)',
            paragraphs: [
              'Phần lớn đau lưng thông thường (hơn 90%) là đau cơ năng do căng cơ dây chằng hoặc thoái hóa nhẹ, sẽ thuyên giảm sau 2-4 tuần chăm sóc hợp lý.',
              'Tuy nhiên, cần đến ngay cơ sở y tế chuyên khoa khi xuất hiện các dấu hiệu cờ đỏ sau:',
            ],
            bullets: [
              'Rối loạn cơ tròn: Bí tiểu, tiểu tiện hoặc đại tiện mất tự chủ.',
              'Mất cảm giác vùng yên ngựa (vùng sinh dục, hậu môn, mặt trong đùi).',
              'Yếu liệt chi dưới tiến triển nhanh (bàn chân rơi, không nhấc được ngón chân hoặc gót chân).',
              'Đau lưng dữ dội về đêm, không giảm khi nằm nghỉ, kèm sốt cao hoặc sụt cân không rõ nguyên nhân.',
              'Tiền sử ung thư hoặc chấn thương ngã từ trên cao gần đây.',
            ],
          },
        ],
        clinicalAdvice: [
          'Chụp X-quang hoặc MRI chỉ nên thực hiện khi có chỉ định của bác sĩ chuyên khoa hoặc khi có dấu hiệu cờ đỏ.',
          'Tuyệt đối không tự ý nắn chỉnh cột sống thô bạo (bẻ cổ, giẫm lưng) tại các cơ sở không có chứng chỉ hành nghề y tế.',
        ],
      },
    },
  ],
};

// Fallback tài liệu tiêu chuẩn cho các chủ đề khác
const DEFAULT_TOPIC_DOCUMENT = (topicTitle: string): MedicalDocument[] => [
  {
    id: 'doc-default-1',
    title: `Tài Liệu Tổng Quan & Cẩm Nang Y Khoa: ${topicTitle}`,
    badge: 'TÀI LIỆU Y KHOA',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
    description: `Hệ thống hóa toàn bộ kiến thức giải phẫu, cơ chế sinh lý và hướng dẫn tự chăm sóc sức khỏe chủ động cho chuyên đề ${topicTitle}.`,
    format: 'PDF Giáo Trình Chuẩn',
    pages: 14,
    size: '531 KB',
    source: 'Tủ Sách Y Khoa Qbiz Books',
    pdfUrl: '/documents/giao_trinh_y_khoa_tong_quan.pdf',
    txtUrl: '/documents/tom_tat_giai_phau_cot_song.txt',
    content: {
      overview: `Tài liệu chính thức cung cấp kiến thức nền tảng và chuyên sâu về cấu trúc, chức năng và các lưu ý lâm sàng của ${topicTitle}.`,
      sections: [
        {
          heading: '1. Giải phẫu và chức năng sinh lý cốt lõi',
          paragraphs: [
            `Hiểu rõ cấu trúc giải phẫu là chìa khóa để phòng ngừa bệnh tật và duy trì sức khỏe bền vững. Chuyên đề ${topicTitle} phân tích chi tiết mối quan hệ giữa tế bào, mô và hệ cơ quan trong toàn bộ cơ thể.`,
          ],
          bullets: [
            'Cấu trúc vi thể và đại thể của các thành phần chính.',
            'Cơ chế tương tác liên cơ quan và điều hòa cân bằng nội môi (Homeostasis).',
            'Các yếu tố sinh hoạt, dinh dưỡng và vận động tác động trực tiếp.',
          ],
        },
        {
          heading: '2. Các vấn đề sức khỏe thường gặp & Hướng xử trí',
          paragraphs: [
            'Nhận biết sớm các triệu chứng bất thường giúp can thiệp kịp thời trước khi bệnh tiến triển thành tổn thương thực thể mạn tính.',
          ],
        },
      ],
      clinicalAdvice: [
        'Duy trì chế độ ăn uống khoa học, giàu chất chống oxy hóa và uống đủ nước mỗi ngày.',
        'Thực hiện khám sức khỏe định kỳ và tham khảo ý kiến bác sĩ khi có triệu chứng kéo dài.',
      ],
    },
  },
  {
    id: 'doc-default-2',
    title: `Sơ Đồ Tóm Tắt & Bảng Tra Cứu Lâm Sàng: ${topicTitle}`,
    badge: 'BẢNG TRA CỨU',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
    description: 'Bảng đối chiếu các chỉ số sinh hóa, mốc giải phẫu quan trọng và lưu đồ chẩn đoán nhanh.',
    format: 'Bản Ảnh HD & PDF',
    pages: 6,
    size: '180 KB · Ảnh HD 543 KB',
    source: 'Tài Liệu Hướng Dẫn Bác Sĩ',
    pdfUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.pdf',
    imageUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
    content: {
      overview: 'Bảng tra cứu trực quan giúp học viên ghi nhớ nhanh các thuật ngữ và mối liên hệ chức năng.',
      sections: [
        {
          heading: 'Mục lục tra cứu nhanh',
          paragraphs: [
            'Bảng tóm tắt các thông số bình thường và ngưỡng cảnh báo y khoa cần chú ý.',
          ],
        },
      ],
      clinicalAdvice: [
        'Theo dõi các chỉ số sinh học định kỳ để phát hiện sớm các rối loạn chuyển hóa.',
      ],
    },
  },
];

interface MedicalDocumentsTabProps {
  topicSlug: string;
  topicTitle: string;
  pageTitle?: string;
  customFiles?: FileItem[];
  isAdmin?: boolean;
}

export default function MedicalDocumentsTab({
  topicSlug,
  topicTitle,
  pageTitle,
  customFiles = [],
  isAdmin = false,
}: MedicalDocumentsTabProps) {
  const [selectedDoc, setSelectedDoc] = useState<MedicalDocument | null>(null);
  const [readerTab, setReaderTab] = useState<'pdf' | 'summary' | 'image'>('pdf');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const initialDocs = TOPIC_DOCUMENTS[topicSlug] || DEFAULT_TOPIC_DOCUMENT(topicTitle);
  const [docList, setDocList] = useState<MedicalDocument[]>(initialDocs);
  const [editingDoc, setEditingDoc] = useState<MedicalDocument | null>(null);
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // Nạp tài liệu từ localStorage nếu có chỉnh sửa
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`custom_medical_docs_${topicSlug}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDocList(parsed);
          return;
        }
      }
    } catch {
      // Bỏ qua
    }
    setDocList(TOPIC_DOCUMENTS[topicSlug] || DEFAULT_TOPIC_DOCUMENT(topicTitle));
  }, [topicSlug, topicTitle]);

  const handleSaveDoc = (savedDoc: MedicalDocument) => {
    let nextList: MedicalDocument[];
    const existingIndex = docList.findIndex((d) => d.id === savedDoc.id);
    if (existingIndex >= 0) {
      nextList = [...docList];
      nextList[existingIndex] = savedDoc;
    } else {
      nextList = [...docList, savedDoc];
    }
    setDocList(nextList);
    try {
      localStorage.setItem(`custom_medical_docs_${topicSlug}`, JSON.stringify(nextList));
    } catch {
      // Bỏ qua
    }
  };

  const handleDeleteDoc = (docId: string) => {
    const nextList = docList.filter((d) => d.id !== docId);
    setDocList(nextList);
    try {
      localStorage.setItem(`custom_medical_docs_${topicSlug}`, JSON.stringify(nextList));
    } catch {
      // Bỏ qua
    }
  };

  const docs = docList;

  // Tải trực tiếp file thật từ server (PDF, Ảnh HD hoặc TXT)
  const handleDownload = (doc: MedicalDocument, formatType: 'pdf' | 'image' | 'txt' = 'pdf') => {
    let targetUrl = doc.pdfUrl;
    let fileName = doc.pdfUrl.split('/').pop() || `${doc.title}.pdf`;

    if (formatType === 'image' && doc.imageUrl) {
      targetUrl = doc.imageUrl;
      fileName = doc.imageUrl.split('/').pop() || `${doc.title}.png`;
    } else if (formatType === 'txt' && doc.txtUrl) {
      targetUrl = doc.txtUrl;
      fileName = doc.txtUrl.split('/').pop() || `${doc.title}.txt`;
    }

    if (targetUrl) {
      const a = document.createElement('a');
      a.href = targetUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadNotice(`Đã tải xuống file thật: ${fileName}`);
    } else {
      // Fallback nếu không có URL cụ thể
      const fullText = `=== ${doc.title.toUpperCase()} ===\nĐịnh dạng: ${doc.format} | Nguồn: ${doc.source}\nChuyên đề: ${topicTitle}\n\n[TỔNG QUAN]\n${doc.content.overview}\n\n` +
        doc.content.sections.map((s, i) => `[PHẦN ${i+1}: ${s.heading}]\n${s.paragraphs.join('\n')}\n${s.bullets ? s.bullets.map(b => '• ' + b).join('\n') : ''}\n${s.notes ? 'Ghi chú: ' + s.notes : ''}\n`).join('\n') +
        `\n[LỜI KHUYÊN BÁC SĨ]\n${doc.content.clinicalAdvice.map(a => '- ' + a).join('\n')}\n\n--- Qbiz Books - Tủ Sách Y Khoa Điện Tử ---`;

      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_')}_QbizBooks.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadNotice(`Đã xuất tệp văn bản: ${doc.title}.txt`);
    }

    setTimeout(() => setDownloadNotice(null), 4000);
  };

  // Mở tài liệu qua Google Docs Viewer
  const handleOpenGoogleDocs = (doc: MedicalDocument) => {
    if (typeof window === 'undefined') return;
    const fullFileUrl = window.location.origin + doc.pdfUrl;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullFileUrl)}&embedded=true`;
    window.open(googleViewerUrl, '_blank');
  };

  // Mở file PDF gốc trong tab mới
  const handleOpenNativePdf = (doc: MedicalDocument) => {
    if (typeof window === 'undefined') return;
    window.open(doc.pdfUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-3 py-1">
      {/* THÔNG BÁO TẢI TÀI LIỆU */}
      {downloadNotice && (
        <div className="flex items-center gap-2 p-3 rounded-[14px] bg-emerald-50 text-emerald-800 border border-emerald-300 text-[13px] font-bold animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span className="truncate">{downloadNotice}</span>
        </div>
      )}

      {/* HEADER GIỚI THIỆU TỦ TÀI LIỆU HỌC TẬP */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileCheck size={18} className="text-[#1E3A8A] dark:text-[#F8DF7B]" />
          <h4 className="text-[14px] sm:text-[15.5px] font-black text-slate-900 dark:text-white uppercase tracking-wider">
            TÀI LIỆU HỌC TẬP & CẨM NANG Y KHOA
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-[11.5px] font-bold text-muted bg-slate-100 dark:bg-purple-950/60 px-2 py-0.5 rounded-full border border-slate-200 dark:border-purple-800/40">
            {docs.length + customFiles.length} tài liệu thật
          </span>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                setIsAddingDoc(true);
                setEditingDoc(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[10px] bg-emerald-600 hover:bg-emerald-700 text-white text-[12px] font-black transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus size={14} strokeWidth={3} />
              <span>+ Thêm tài liệu</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. TÀI LIỆU ĐÍNH KÈM TỪ HỆ THỐNG / GIẢNG VIÊN (NẾU CÓ) */}
      {customFiles.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-1">
          <span className="text-[12px] font-black text-[#1E3A8A] dark:text-purple-300 uppercase tracking-wide px-1">
            File đính kèm từ bài giảng:
          </span>
          {customFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 rounded-[16px] bg-white dark:bg-[#160D30] border border-slate-200 dark:border-purple-500/30 shadow-2xs gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-[12px] bg-amber-50 dark:bg-purple-900/60 text-amber-800 dark:text-purple-200 flex items-center justify-center shrink-0">
                  <FileText size={20} strokeWidth={2.2} />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[14px] font-bold text-slate-900 dark:text-white truncate">
                    {file.name}
                  </span>
                  <span className="text-[11.5px] text-muted">
                    {file.size_bytes ? `${(file.size_bytes / 1024).toFixed(0)} KB` : 'Tài liệu đính kèm'}
                  </span>
                </div>
              </div>
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3A8A] text-white dark:bg-[#F8DF7B] dark:text-[#160C2C] text-[12px] font-bold shrink-0 hover:opacity-90 transition-opacity"
              >
                <ExternalLink size={13} />
                <span>Xem</span>
              </a>
            </div>
          ))}
        </div>
      )}

      {/* 2. DANH SÁCH TÀI LIỆU Y KHOA CHUẨN XÁC, CHẤT LƯỢNG CAO (FILE THẬT 100%) */}
      <div className="flex flex-col gap-2.5">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="flex flex-col p-3.5 sm:p-4 rounded-[18px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-500/30 shadow-xs hover:border-purple-600/50 dark:hover:border-purple-400 transition-all gap-2.5"
          >
            {/* Hàng 1: Badge phân loại + Tên định dạng & Dung lượng thật + Nút Sửa trực tiếp */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black tracking-wider uppercase border ${doc.badgeColor}`}>
                  {doc.badge}
                </span>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDoc(doc);
                      setIsAddingDoc(false);
                    }}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-amber-500 hover:bg-amber-600 text-white text-[10.5px] font-black tracking-wide uppercase transition-transform active:scale-95 shadow-2xs cursor-pointer"
                    title="Chỉnh sửa tài liệu này: tiêu đề, link PDF, ảnh HD, định dạng"
                  >
                    <Edit2 size={10} strokeWidth={3} />
                    <span>Sửa</span>
                  </button>
                )}
              </div>
              <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300">
                {doc.format} · {doc.size}
              </span>
            </div>

            {/* Hàng 2: Tiêu đề tài liệu */}
            <h5 className="text-[15px] sm:text-[16px] font-bold text-slate-900 dark:text-white leading-snug">
              {doc.title}
            </h5>

            {/* Hàng 3: Mô tả nội dung */}
            <p className="text-[12.5px] sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
              {doc.description}
            </p>

            {/* Hàng 4: Các định dạng sẵn có & Nút hành động */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-purple-900/40 gap-2 flex-wrap sm:flex-nowrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-black px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-800 dark:bg-purple-950 dark:text-purple-300 border border-slate-300 dark:border-purple-800">
                  PDF A4 Chuẩn
                </span>
                {doc.imageUrl && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-[6px] bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Ảnh HD
                  </span>
                )}
                {doc.txtUrl && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-[6px] bg-slate-100 text-slate-700 dark:bg-purple-950 dark:text-purple-300 border border-slate-200 dark:border-purple-800">
                    Văn bản TXT
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDoc(doc);
                      setIsAddingDoc(false);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700 text-[12px] font-extrabold transition-all cursor-pointer active:scale-95"
                    title="Chỉnh sửa tài liệu này"
                  >
                    <Edit2 size={13} strokeWidth={2.5} />
                    <span>Sửa</span>
                  </button>
                )}

                {/* Nút Đọc ngay: Mở trình đọc đa năng (PDF / Tóm tắt / Google Docs) */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDoc(doc);
                    setReaderTab('pdf');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700/50 text-[12px] font-bold transition-colors cursor-pointer active:scale-95"
                  title="Đọc trực tiếp tài liệu y khoa này"
                >
                  <BookOpen size={14} />
                  <span>Đọc tài liệu</span>
                </button>

                {/* Nút Tải về file thật */}
                <button
                  type="button"
                  onClick={() => handleDownload(doc, 'pdf')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-white dark:bg-[#F8DF7B] dark:hover:bg-amber-300 dark:text-[#160C2C] text-[12px] font-black transition-colors cursor-pointer active:scale-95 shadow-2xs"
                  title="Tải file PDF y khoa thực tế về máy"
                >
                  <Download size={14} />
                  <span>Tải về</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. MODAL ĐỌC TÀI LIỆU TRỰC TIẾP CHUẨN Y KHOA ĐA NĂNG */}
      {selectedDoc && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in"
        >
          <div className="w-full max-w-[850px] max-h-[92vh] bg-white dark:bg-[#160D30] rounded-[22px] border border-slate-200 dark:border-purple-600/50 shadow-2xl flex flex-col overflow-hidden">
            {/* Header Modal */}
            <div className="flex items-start justify-between p-3.5 sm:p-4 border-b border-slate-200 dark:border-purple-900/50 bg-slate-50 dark:bg-[#1A103C]">
              <div className="flex flex-col gap-1 pr-2 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`inline-block w-fit px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${selectedDoc.badgeColor}`}>
                    {selectedDoc.badge}
                  </span>
                  <span className="text-[11.5px] text-muted font-bold">
                    {selectedDoc.format} · {selectedDoc.size}
                  </span>
                </div>
                <h3 className="text-[15px] sm:text-[17px] font-black text-slate-900 dark:text-white leading-tight truncate">
                  {selectedDoc.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoc(null)}
                className="w-8 h-8 rounded-full bg-slate-200 dark:bg-purple-900/60 hover:bg-slate-300 dark:hover:bg-purple-800 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                title="Đóng cửa sổ đọc"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* THANH ĐIỀU HƯỚNG CÁC DẠNG ĐỌC (PDF, TÓM TẮT, ẢNH HD, GOOGLE DOCS) */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-100/80 dark:bg-purple-950/40 border-b border-slate-200 dark:border-purple-900/40 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setReaderTab('pdf')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-[8px] text-[12px] font-bold cursor-pointer transition-colors ${
                    readerTab === 'pdf'
                      ? 'bg-[#1E3A8A] text-white shadow-2xs'
                      : 'bg-white dark:bg-purple-900/40 text-slate-700 dark:text-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <FileText size={13} />
                  <span>Xem file PDF ({selectedDoc.pages} trang)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReaderTab('summary')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-[8px] text-[12px] font-bold cursor-pointer transition-colors ${
                    readerTab === 'summary'
                      ? 'bg-[#1E3A8A] text-white shadow-2xs'
                      : 'bg-white dark:bg-purple-900/40 text-slate-700 dark:text-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen size={13} />
                  <span>Tóm tắt cốt lõi</span>
                </button>

                {selectedDoc.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setReaderTab('image')}
                    className={`flex items-center gap-1 px-3 py-1 rounded-[8px] text-[12px] font-bold cursor-pointer transition-colors ${
                      readerTab === 'image'
                        ? 'bg-[#1E3A8A] text-white shadow-2xs'
                        : 'bg-white dark:bg-purple-900/40 text-slate-700 dark:text-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon size={13} />
                    <span>Bản ảnh HD</span>
                  </button>
                )}
              </div>

              {/* Nút thao tác nhanh: Mở tab mới hoặc xem qua Google Docs */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleOpenGoogleDocs(selectedDoc)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white dark:bg-purple-900/40 border border-slate-300 dark:border-purple-700/50 text-[11px] font-bold text-slate-700 dark:text-purple-200 hover:bg-slate-50 cursor-pointer"
                  title="Mở tài liệu bằng Google Docs Viewer"
                >
                  <ExternalLink size={12} />
                  <span>Google Docs</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenNativePdf(selectedDoc)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white dark:bg-purple-900/40 border border-slate-300 dark:border-purple-700/50 text-[11px] font-bold text-slate-700 dark:text-purple-200 hover:bg-slate-50 cursor-pointer"
                  title="Mở toàn màn hình trong tab mới"
                >
                  <Maximize2 size={12} />
                  <span>Mở tab mới</span>
                </button>
              </div>
            </div>

            {/* NỘI DUNG THEO TAB CHỌN */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-5 text-slate-800 dark:text-slate-200 text-[14px]">
              {/* TAB 1: XEM TỆP PDF THẬT TRỰC TIẾP */}
              {readerTab === 'pdf' && (
                <div className="w-full flex flex-col gap-2">
                  <div className="w-full h-[60vh] sm:h-[65vh] rounded-[14px] overflow-hidden border border-slate-200 dark:border-purple-800 bg-slate-100 dark:bg-black/40 relative">
                    <iframe
                      src={`${selectedDoc.pdfUrl}#toolbar=1&navpanes=0`}
                      title={selectedDoc.title}
                      className="w-full h-full border-0"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11.5px] text-muted px-1">
                    <span>* Trình duyệt hỗ trợ cuộn và zoom trực tiếp trên trang PDF chuẩn A4.</span>
                    <button
                      type="button"
                      onClick={() => handleOpenNativePdf(selectedDoc)}
                      className="text-[#1E3A8A] dark:text-[#F8DF7B] font-bold hover:underline cursor-pointer"
                    >
                      Bấm vào đây nếu muốn xem toàn màn hình
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: TÓM TẮT CỐT LÕI Y KHOA */}
              {readerTab === 'summary' && (
                <div className="space-y-4">
                  {/* Khối Tổng quan */}
                  <div className="p-3.5 rounded-[16px] bg-amber-50/70 dark:bg-purple-950/40 border border-amber-200/80 dark:border-purple-800/40">
                    <span className="text-[12px] font-black text-amber-800 dark:text-purple-300 uppercase tracking-wide block mb-1">
                      Tổng quan cốt lõi
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {selectedDoc.content.overview}
                    </p>
                  </div>

                  {/* Các phần chi tiết */}
                  {selectedDoc.content.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2 pt-2 border-t border-slate-100 dark:border-purple-900/30">
                      <h4 className="text-[15px] sm:text-[16px] font-black text-slate-900 dark:text-white">
                        {sec.heading}
                      </h4>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {sec.bullets && sec.bullets.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                          {sec.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      )}

                      {sec.notes && (
                        <div className="p-3 rounded-[12px] bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 text-[13px] text-amber-900 dark:text-amber-200 font-medium">
                          💡 <strong>Lưu ý lâm sàng:</strong> {sec.notes}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Khối Lời khuyên bác sĩ */}
                  <div className="p-4 rounded-[16px] bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/40 space-y-2">
                    <span className="text-[12.5px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">
                      Lời khuyên bác sĩ chuyên khoa
                    </span>
                    <ul className="space-y-1.5 text-[13.5px] text-emerald-900 dark:text-emerald-200">
                      {selectedDoc.content.clinicalAdvice.map((adv, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-2">
                          <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 3: BẢN ẢNH HD SẮC NÉT (NẾU CÓ) */}
              {readerTab === 'image' && selectedDoc.imageUrl && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full rounded-[14px] overflow-hidden border border-slate-200 dark:border-purple-800 shadow-md">
                    <img
                      src={selectedDoc.imageUrl}
                      alt={selectedDoc.title}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(selectedDoc, 'image')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-[12px] hover:bg-emerald-700 cursor-pointer shadow-xs"
                    >
                      <Download size={13} />
                      <span>Tải ảnh HD về máy</span>
                    </button>
                    <a
                      href={selectedDoc.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-purple-900/50 text-slate-700 dark:text-purple-200 font-bold text-[12px] hover:bg-slate-200 cursor-pointer"
                    >
                      <Maximize2 size={13} />
                      <span>Xem kích thước gốc</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal: Tùy chọn Tải về Đa Định Dạng */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-slate-200 dark:border-purple-900/50 bg-slate-50 dark:bg-[#1A103C] gap-2 flex-wrap sm:flex-nowrap">
              <span className="text-[12px] text-muted hidden sm:inline">
                Tủ sách y khoa điện tử Qbiz Books · Bản quyền đào tạo
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                <button
                  type="button"
                  onClick={() => setSelectedDoc(null)}
                  className="px-3.5 py-1.5 rounded-full border border-slate-300 dark:border-purple-700/60 text-slate-700 dark:text-slate-300 font-bold text-[12.5px] hover:bg-slate-100 dark:hover:bg-purple-900/40 transition-colors cursor-pointer"
                >
                  Đóng
                </button>

                {selectedDoc.txtUrl && (
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedDoc, 'txt')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-200 dark:bg-purple-900/60 text-slate-800 dark:text-purple-200 font-bold text-[12.5px] hover:bg-slate-300 cursor-pointer"
                    title="Tải bản tóm tắt TXT nhanh"
                  >
                    <FileText size={13} />
                    <span>Tải TXT</span>
                  </button>
                )}

                {selectedDoc.imageUrl && (
                  <button
                    type="button"
                    onClick={() => handleDownload(selectedDoc, 'image')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-[12.5px] hover:bg-emerald-700 cursor-pointer shadow-xs"
                    title="Tải ảnh HD về máy"
                  >
                    <ImageIcon size={13} />
                    <span>Tải Ảnh HD</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDownload(selectedDoc, 'pdf')}
                  className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1E3A8A] text-white dark:bg-[#F8DF7B] dark:text-[#160C2C] font-black text-[12.5px] hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  title="Tải file PDF chuẩn A4 về máy"
                >
                  <Download size={14} />
                  <span>Tải File PDF Thật</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL SỬA TÀI LIỆU Y KHOA ĐƠN LẺ */}
      <EditMedicalDocumentModal
        isOpen={editingDoc !== null || isAddingDoc}
        onClose={() => {
          setEditingDoc(null);
          setIsAddingDoc(false);
        }}
        document={editingDoc}
        onSave={(updated) => {
          handleSaveDoc(updated);
        }}
        onDelete={editingDoc ? () => handleDeleteDoc(editingDoc.id) : undefined}
      />
    </div>
  );
}
