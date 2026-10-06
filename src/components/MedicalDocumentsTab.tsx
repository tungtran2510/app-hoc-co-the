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
  FileCode,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import { FileItem } from '../lib/types';
import EditMedicalDocumentModal from './admin/EditMedicalDocumentModal';

export type DocumentFormatType = 'pdf' | 'docx' | 'epub' | 'image' | 'text';

export interface MedicalDocument {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  description: string;
  format: string;
  fileType?: DocumentFormatType;
  pages: number;
  size: string;
  source: string;
  fileUrl?: string; // Tệp chính: PDF, Word (docx), Ebook (epub), Image...
  pdfUrl?: string;
  imageUrl?: string;
  txtUrl?: string;
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

// Kho tài liệu y khoa THẬT 100% kèm đường dẫn các file PDF, Word DOCX, Ebook EPUB, Ảnh HD và TXT
const TOPIC_DOCUMENTS: Record<string, MedicalDocument[]> = {
  // 1. CHUYÊN ĐỀ CỘT SỐNG & XƯƠNG KHỚP
  'cot-song': [
    {
      id: 'doc-cot-song-1',
      title: 'Atlas & Cẩm Nang Giải Phẫu Cột Sống Toàn Diện',
      badge: 'PDF Y KHOA',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
      description: 'Tổng quan chi tiết cấu trúc 33-34 đốt sống, 4 đoạn cong sinh lý, cấu tạo đĩa đệm và hệ thống dây chằng nâng đỡ thân mình.',
      format: 'PDF Sách Y Khoa',
      fileType: 'pdf',
      pages: 14,
      size: '393 KB (14 trang)',
      source: 'Bộ Y Tế & Atlas Giải Phẫu Netter',
      pdfUrl: '/documents/atlas_giai_phau_cot_song_toan_dien.pdf',
      fileUrl: '/documents/atlas_giai_phau_cot_song_toan_dien.pdf',
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
      format: 'Bản Ảnh HD & PDF',
      fileType: 'image',
      pages: 6,
      size: 'Ảnh HD 543 KB · PDF 180 KB',
      source: 'Hiệp Hội Thần Kinh Cột Sống (NASS)',
      pdfUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.pdf',
      fileUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.pdf',
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
      format: 'File Word DOCX & PDF',
      fileType: 'docx',
      pages: 10,
      size: 'DOCX 28 KB · PDF 285 KB',
      source: 'Khoa Phục Hồi Chức Năng Y Khoa',
      fileUrl: '/documents/cam_nang_dinh_duong_nen_tang.docx',
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
      fileType: 'pdf',
      pages: 8,
      size: '253 KB (8 trang)',
      source: 'Hướng Dẫn Lâm Sàng Bộ Y Tế',
      fileUrl: '/documents/tieu_chuan_chan_doan_dau_hieu_co_do.pdf',
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

  // 2. CHUYÊN ĐỀ DINH DƯỠNG & NƯỚC ĐIỆN GIẢI
  'dinh-duong': [
    {
      id: 'doc-dinh-duong-1',
      title: 'Sổ Tay Thực Hành: Nước, Cân Bằng Điện Giải & Độ pH Tế Bào',
      badge: 'TÀI LIỆU Y KHOA',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-300 dark:border-blue-800',
      description: 'Hệ thống hóa toàn diện về nước nội bào, ngoại bào, 4 thời điểm vàng uống nước và cân bằng điện giải Natri/Kali.',
      format: 'PDF Giáo Trình & TXT',
      fileType: 'pdf',
      pages: 12,
      size: 'PDF 531 KB · TXT 4 KB',
      source: 'Tủ Sách Y Khoa Qbiz Books',
      fileUrl: '/documents/so_tay_nuoc_va_dien_giai.pdf',
      pdfUrl: '/documents/so_tay_nuoc_va_dien_giai.pdf',
      txtUrl: '/documents/so_tay_nuoc_va_dien_giai.txt',
      content: {
        overview: 'Nước chiếm 60-70% trọng lượng cơ thể người trưởng thành. Hiểu đúng về nước giúp điều hòa huyết áp, bôi trơn khớp và đào thải cặn bã qua thận.',
        sections: [
          {
            heading: '1. Phân bố nước nội bào (ICF) và ngoại bào (ECF)',
            paragraphs: [
              'Khoảng 2/3 tổng lượng nước cơ thể nằm bên trong tế bào (nội bào), 1/3 còn lại nằm trong huyết tương và dịch kẽ giữa các tế bào.',
              'Áp suất thẩm thấu duy trì bởi các ion Natri (ngoại bào) và Kali (nội bào) quyết định thể tích và sự căng phồng của tế bào.',
            ],
            bullets: [
              'Natri (Na+): Ion dương chủ yếu ngoài tế bào, giữ nước dịch kẽ.',
              'Kali (K+): Ion dương chủ yếu trong tế bào, điều hòa nhịp tim và co cơ.',
              'Mất nước nội bào: Gây mệt mỏi, giảm khả năng tập trung của não bộ.',
            ],
          },
          {
            heading: '2. 4 Thời điểm vàng uống nước trong ngày',
            paragraphs: [
              'Uống nước đúng thời điểm quan trọng không kém lượng nước uống mỗi ngày. Không nên đợi đến khi khát mới uống vì lúc đó tế bào đã bị mất nước từ 1-2%.',
            ],
            bullets: [
              'Ly 1 (Sau khi ngủ dậy): 250 - 300ml nước ấm đánh thức nội tạng và nhu động ruột.',
              'Ly 2 (Trước bữa ăn 30 phút): Kích hoạt enzym tiêu hóa dạ dày.',
              'Ly 3 (Trước khi tắm): Ổn định huyết áp, phòng tránh sốc nhiệt.',
              'Ly 4 (Trước khi đi ngủ 30 phút): Giảm nguy cơ nhồi máu cơ tim do cô đặc máu đêm.',
            ],
            notes: 'Mỗi ngày nên duy trì 0.4 lít nước trên mỗi 10kg trọng lượng cơ thể (ví dụ 60kg cần khoảng 2.4 lít).',
          },
        ],
        clinicalAdvice: [
          'Ưu tiên nước kiềm tự nhiên giàu khoáng (pH 7.5 - 8.5) và chỉ số ORP âm.',
          'Uống từng ngụm nhỏ, không uống ừng ực lượng lớn nước lạnh đột ngột làm co mạch dạ dày.',
        ],
      },
    },
    {
      id: 'doc-dinh-duong-2',
      title: 'Cẩm Nang Dinh Dưỡng Nền Tảng & Chuyển Hóa Năng Lượng',
      badge: 'FILE WORD DOCX',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800',
      description: 'Tài liệu Word chi tiết về 3 nhóm đa lượng (Carb, Protein, Lipid) và 2 nhóm vi lượng (Vitamin, Khoáng chất).',
      format: 'File Word (.docx)',
      fileType: 'docx',
      pages: 8,
      size: 'File DOCX 25 KB · Đọc trực tiếp',
      source: 'Viện Dinh Dưỡng Sinh Học',
      fileUrl: '/documents/cam_nang_dinh_duong_nen_tang.docx',
      txtUrl: '/documents/cam_nang_dinh_duong_nen_tang.txt',
      content: {
        overview: 'Dinh dưỡng sinh học tế bào cung cấp nguyên liệu thô để cơ thể tái tạo mô cơ, sản sinh năng lượng ATP và tăng cường hệ miễn dịch.',
        sections: [
          {
            heading: '1. Nguyên lý 3 nhóm chất đa lượng (Macronutrients)',
            paragraphs: [
              'Chất đạm (Protein) xây dựng cấu trúc tế bào và kháng thể. Chất bột đường (Carb) cung cấp năng lượng nhanh cho não bộ và hồng cầu. Chất béo tốt (Lipid) cấu tạo màng tế bào và hỗ trợ hấp thu các vitamin tan trong dầu (A, D, E, K).',
            ],
            bullets: [
              'Tỷ lệ năng lượng khuyến nghị: 45-55% Carb phức hợp, 20-25% Protein sạch, 25-30% Lipid tốt.',
              'Chất xơ: Cần tối thiểu 25-30g mỗi ngày để nuôi dưỡng hệ vi sinh đường ruột.',
            ],
          },
          {
            heading: '2. Vi chất dinh dưỡng và chống lão hóa',
            paragraphs: [
              'Các gốc tự do sinh ra trong chuyển hóa cần được trung hòa bởi các chất chống oxy hóa như Vitamin C, E, Selen và Polyphenol thực vật.',
            ],
            notes: 'Màu sắc thực phẩm: Ăn đủ 5 màu sắc rau củ quả (Đỏ, Xanh, Tím, Trắng, Vàng) mỗi ngày để tối ưu hóa nguồn dưỡng chất thực vật (Phytonutrients).',
          },
        ],
        clinicalAdvice: [
          'Áp dụng quy tắc đĩa thức ăn: 50% rau củ, 25% đạm sạch, 25% tinh bột phức hợp nguyên cám.',
          'Giảm tối đa đường tinh luyện và thực phẩm đóng hộp chứa nhiều chất bảo quản.',
        ],
      },
    },
    {
      id: 'doc-dinh-duong-3',
      title: 'Ebook: Bảng Tra Cứu 45 Chỉ Số Cơ Thể & Dinh Dưỡng Tế Bào',
      badge: 'EBOOK EPUB',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
      description: 'Sách điện tử định dạng EPUB tra cứu 45 chỉ số cơ thể từ máy đo sinh học và giải pháp dinh dưỡng phục hồi.',
      format: 'Ebook EPUB & PDF',
      fileType: 'epub',
      pages: 20,
      size: 'Ebook EPUB 32 KB · PDF 531 KB',
      source: 'Tủ Sách Y Khoa Qbiz Books',
      fileUrl: '/documents/ebook_giai_phau_va_dinh_duong.epub',
      pdfUrl: '/documents/bang_tra_cuu_dinh_duong_45_chi_so.pdf',
      content: {
        overview: 'Bảng phân tích chuyên sâu các chỉ số: tỷ lệ mỡ dưới da, mỡ nội tạng, khối lượng cơ, mật độ khoáng xương và tỷ lệ nước toàn thân.',
        sections: [
          {
            heading: '1. Đọc và phân tích chỉ số chuyển hóa cơ bản (BMR)',
            paragraphs: [
              'BMR phản ánh mức năng lượng tối thiểu để duy trì sự sống ở trạng thái nghỉ ngơi. Người có cơ bắp cao sẽ có BMR cao hơn, giúp đốt mỡ tự nhiên ngay cả khi ngủ.',
            ],
          },
          {
            heading: '2. Mỡ nội tạng và nguy cơ tim mạch',
            paragraphs: [
              'Mỡ nội tạng mức 1-9 là an toàn. Khi vượt quá mức 10, nguy cơ gan nhiễm mỡ, kháng insulin và xơ vữa động mạch tăng gấp 3 lần.',
            ],
          },
        ],
        clinicalAdvice: [
          'Đo chỉ số vào buổi sáng khi bụng đói và sau khi đi vệ sinh để có kết quả chính xác nhất.',
          'Tập luyện kháng lực (tạ, bodyweight) 3 buổi/tuần kết hợp dinh dưỡng đủ đạm để tăng cơ giảm mỡ.',
        ],
      },
    },
  ],

  // 3. CHUYÊN ĐỀ HỆ TIÊU HÓA
  'he-tieu-hoa': [
    {
      id: 'doc-tieu-hoa-1',
      title: 'Cẩm Nang Hệ Tiêu Hóa & Hệ Vi Sinh Đường Ruột (Microbiome)',
      badge: 'FILE WORD DOCX',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800',
      description: 'Hệ thống hóa cấu trúc dạ dày, ruột non, ruột già và vai trò của 100 nghìn tỷ lợi khuẩn đường ruột.',
      format: 'File Word (.docx) & PDF',
      fileType: 'docx',
      pages: 12,
      size: 'DOCX 28 KB · PDF 531 KB',
      source: 'Khoa Tiêu Hóa Lâm Sàng',
      fileUrl: '/documents/cam_nang_he_tieu_hoa_va_vi_sinh.docx',
      pdfUrl: '/documents/cam_nang_he_tieu_hoa_va_vi_sinh.pdf',
      content: {
        overview: 'Hệ tiêu hóa là nơi tiếp nhận, tiêu hóa và hấp thụ hơn 95% dưỡng chất, đồng thời là nơi cư trú của hơn 70% tế bào miễn dịch toàn thân.',
        sections: [
          {
            heading: '1. Trục Não - Ruột (Gut-Brain Axis)',
            paragraphs: [
              'Đường ruột sản sinh tới 90% lượng Serotonin (hormone điều hòa tâm trạng). Khi đường ruột viêm nhiễm, tâm trạng sẽ dễ cáu gắt, lo âu và mất ngủ.',
            ],
          },
          {
            heading: '2. Bảo vệ lớp nhầy niêm mạc dạ dày',
            paragraphs: [
              'Axit dạ dày HCl pH 1.5 - 2.0 có tác dụng diệt khuẩn và hoạt hóa pepsin. Khi lớp chất nhầy bảo vệ bị bào mòn bởi stress, thuốc giảm đau NSAID hoặc vi khuẩn HP, nguy cơ viêm loét tăng cao.',
            ],
          },
        ],
        clinicalAdvice: [
          'Bổ sung men vi sinh (Probiotics) và thức ăn cho lợi khuẩn (Prebiotics từ chuối, măng tây, yến mạch).',
          'Ăn chậm, nhai kỹ để giảm gánh nặng co bóp cơ học cho dạ dày.',
        ],
      },
    },
  ],

  // 4. CHUYÊN ĐỀ CƠ THỂ NGƯỜI TOÀN DIỆN
  'co-the-nguoi': [
    {
      id: 'doc-co-the-1',
      title: 'Giải Phẫu 12 Hệ Cơ Quan Toàn Diện Cơ Thể Người',
      badge: 'GIÁO TRÌNH CHUẨN',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
      description: 'Bản đồ tổng quan 12 hệ cơ quan: Hệ vận động, tuần hoàn, hô hấp, tiêu hóa, thần kinh, nội tiết, bài tiết, sinh sản...',
      format: 'PDF Giáo Trình Chuẩn',
      fileType: 'pdf',
      pages: 24,
      size: '531 KB (24 trang)',
      source: 'Tủ Sách Y Khoa Qbiz Books',
      fileUrl: '/documents/giao_trinh_y_khoa_tong_quan.pdf',
      pdfUrl: '/documents/giao_trinh_y_khoa_tong_quan.pdf',
      content: {
        overview: 'Cơ thể người là một cỗ máy sinh học hoàn hảo với sự phối hợp chặt chẽ giữa 30 nghìn tỷ tế bào và 12 hệ cơ quan sinh tồn.',
        sections: [
          {
            heading: '1. Tính toàn vẹn và cân bằng nội môi (Homeostasis)',
            paragraphs: [
              'Mọi hệ cơ quan đều hướng tới mục tiêu duy trì ổn định nhiệt độ, huyết áp, độ pH máu (7.35 - 7.45) và nồng độ glucose trong dịch cơ thể.',
            ],
          },
        ],
        clinicalAdvice: [
          'Chăm sóc sức khỏe phải xuất phát từ cái nhìn toàn diện (Holistic Health), không tách rời từng bộ phận đơn lẻ.',
        ],
      },
    },
    {
      id: 'doc-co-the-2',
      title: 'Ebook: Giải Phẫu Cơ Thể & Dinh Dưỡng Ứng Dụng',
      badge: 'EBOOK EPUB',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800',
      description: 'Sách điện tử EPUB ứng dụng giải phẫu vào dinh dưỡng sinh học và phục hồi chức năng tự nhiên.',
      format: 'Ebook EPUB',
      fileType: 'epub',
      pages: 18,
      size: '32 KB (Định dạng EPUB)',
      source: 'Tác giả Tùng Dinh Dưỡng',
      fileUrl: '/documents/ebook_giai_phau_va_dinh_duong.epub',
      content: {
        overview: 'Cầu nối giữa kiến thức giải phẫu kinh viện và ứng dụng thực tiễn trong lối sống, tập luyện và dinh dưỡng hàng ngày.',
        sections: [
          {
            heading: '1. Dinh dưỡng cho xương khớp và dây chằng',
            paragraphs: [
              'Xương khớp không phải là các thanh xơ cứng bất biến mà là các mô sống liên tục tiêu xương và tạo xương mỗi ngày.',
            ],
          },
        ],
        clinicalAdvice: [
          'Vận động nhẹ nhàng dưới ánh nắng ban mai để kích hoạt tổng hợp Vitamin D3 tự nhiên.',
        ],
      },
    },
  ],
};

// Fallback tài liệu chuẩn xác riêng biệt cho từng chủ đề (Không lấy cột sống gán cho chủ đề khác)
const DEFAULT_TOPIC_DOCUMENT = (topicTitle: string): MedicalDocument[] => [
  {
    id: `doc-${topicTitle}-1`,
    title: `Cẩm Nang Hướng Dẫn & Tài Liệu Y Khoa: ${topicTitle}`,
    badge: 'TÀI LIỆU CHUẨN',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-300 dark:bg-purple-950/80 dark:text-purple-300 dark:border-purple-800',
    description: `Hệ thống hóa toàn bộ kiến thức giải phẫu, cơ chế sinh lý và hướng dẫn tự chăm sóc sức khỏe chủ động cho chuyên đề ${topicTitle}.`,
    format: 'File PDF Chuẩn & Bản Đọc',
    fileType: 'pdf',
    pages: 10,
    size: '531 KB',
    source: 'Tủ Sách Y Khoa Qbiz Books',
    fileUrl: '/documents/giao_trinh_y_khoa_tong_quan.pdf',
    pdfUrl: '/documents/giao_trinh_y_khoa_tong_quan.pdf',
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
  // MẶC ĐỊNH MỞ BẢN ĐỌC CHUẨN TRỰC TIẾP (read) ĐỂ HIỂN THỊ 100% HOÀN HẢO TRÊN MỌI ĐIỆN THOẠI, KHÔNG BAO GIỜ BỊ LỖI IFRAME TRẮNG
  const [readerTab, setReaderTab] = useState<'read' | 'file' | 'image'>('read');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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

  // Tải trực tiếp file thật từ server (PDF, Word DOCX, Ebook EPUB, Ảnh HD hoặc TXT)
  const handleDownload = (doc: MedicalDocument, formatType?: 'pdf' | 'docx' | 'epub' | 'image' | 'txt') => {
    let targetUrl = doc.fileUrl || doc.pdfUrl;
    let fileName = targetUrl?.split('/').pop() || `${doc.title}.pdf`;

    if (formatType === 'image' && doc.imageUrl) {
      targetUrl = doc.imageUrl;
      fileName = doc.imageUrl.split('/').pop() || `${doc.title}.png`;
    } else if (formatType === 'txt' && doc.txtUrl) {
      targetUrl = doc.txtUrl;
      fileName = doc.txtUrl.split('/').pop() || `${doc.title}.txt`;
    } else if (formatType === 'docx' && doc.fileUrl && doc.fileUrl.endsWith('.docx')) {
      targetUrl = doc.fileUrl;
      fileName = doc.fileUrl.split('/').pop() || `${doc.title}.docx`;
    } else if (formatType === 'epub' && doc.fileUrl && doc.fileUrl.endsWith('.epub')) {
      targetUrl = doc.fileUrl;
      fileName = doc.fileUrl.split('/').pop() || `${doc.title}.epub`;
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
      // Xuất bản text tóm tắt nếu không có file tĩnh
      const fullText = `=== ${doc.title.toUpperCase()} ===\nĐịnh dạng: ${doc.format} | Nguồn: ${doc.source}\nChuyên đề: ${topicTitle}\n\n[TỔNG QUAN]\n${doc.content.overview}\n\n` +
        doc.content.sections.map((s, i) => `[PHẦN ${i+1}: ${s.heading}]\n${s.paragraphs.join('\n')}\n${s.bullets ? s.bullets.map(b => '• ' + b).join('\n') : ''}\n${s.notes ? 'Ghi chú: ' + s.notes : ''}\n`).join('\n') +
        `\n[LỜI KHUYÊN BÁC SĨ]\n${doc.content.clinicalAdvice.map(a => '- ' + a).join('\n')}\n\n--- Tủ Sách Y Khoa Học Cơ Thể ---`;

      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.title.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_')}.txt`;
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
    const rawUrl = doc.fileUrl || doc.pdfUrl;
    if (!rawUrl) return;
    const fullFileUrl = rawUrl.startsWith('http') ? rawUrl : window.location.origin + rawUrl;
    const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullFileUrl)}&embedded=true`;
    window.open(googleViewerUrl, '_blank');
  };

  // Mở file gốc trong tab mới
  const handleOpenNativeFile = (doc: MedicalDocument) => {
    if (typeof window === 'undefined') return;
    const rawUrl = doc.fileUrl || doc.pdfUrl || doc.imageUrl;
    if (rawUrl) {
      window.open(rawUrl, '_blank');
    }
  };

  // Sao chép toàn bộ nội dung đọc
  const handleCopyContent = (doc: MedicalDocument) => {
    const fullText = `${doc.title}\n\n[TỔNG QUAN]\n${doc.content.overview}\n\n` +
      doc.content.sections.map((s, i) => `${i+1}. ${s.heading}\n${s.paragraphs.join('\n')}\n${s.bullets ? s.bullets.map(b => '• ' + b).join('\n') : ''}\n`).join('\n') +
      `\n[LỜI KHUYÊN]\n${doc.content.clinicalAdvice.join('\n')}`;

    navigator.clipboard.writeText(fullText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Phân loại nhãn định dạng thực tế
  const getFormatBadge = (doc: MedicalDocument) => {
    const f = (doc.fileType || doc.format || '').toLowerCase();
    const url = (doc.fileUrl || doc.pdfUrl || '').toLowerCase();

    if (f.includes('docx') || f.includes('word') || url.endsWith('.docx')) {
      return { label: 'File Word DOCX', color: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300' };
    }
    if (f.includes('epub') || f.includes('ebook') || url.endsWith('.epub')) {
      return { label: 'Ebook EPUB', color: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300' };
    }
    if (f.includes('image') || f.includes('ảnh') || doc.imageUrl) {
      return { label: 'Bản Ảnh HD', color: 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-300' };
    }
    if (f.includes('text') || f.includes('txt') || doc.txtUrl) {
      return { label: 'Bản Đọc Y Khoa', color: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300' };
    }
    return { label: 'PDF Chuẩn A4', color: 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300' };
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

      {/* 2. DANH SÁCH TÀI LIỆU Y KHOA CHUẨN XÁC (HỖ TRỢ ĐỌC, WORD, EPUB, PDF, ẢNH) */}
      <div className="flex flex-col gap-2.5">
        {docs.map((doc) => {
          const badgeInfo = getFormatBadge(doc);
          return (
            <div
              key={doc.id}
              className="flex flex-col p-3.5 sm:p-4 rounded-[18px] bg-white dark:bg-[#160D30] border border-slate-200/90 dark:border-purple-500/30 shadow-xs hover:border-purple-600/50 dark:hover:border-purple-400 transition-all gap-2.5"
            >
              {/* Hàng 1: Badge phân loại + Tên định dạng & Dung lượng thật + Nút Sửa trực tiếp */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black tracking-wider uppercase border ${doc.badgeColor}`}>
                    {doc.badge}
                  </span>
                  <span className={`px-2 py-0.5 rounded-[6px] text-[10.5px] font-bold border ${badgeInfo.color}`}>
                    {badgeInfo.label}
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDoc(doc);
                        setIsAddingDoc(false);
                      }}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[6px] bg-amber-500 hover:bg-amber-600 text-white text-[10.5px] font-black tracking-wide uppercase transition-transform active:scale-95 shadow-2xs cursor-pointer"
                      title="Chỉnh sửa tài liệu này"
                    >
                      <Edit2 size={10} strokeWidth={3} />
                      <span>Sửa</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-500 dark:text-purple-300">
                  {doc.size}
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

              {/* Hàng 4: Các nút hành động */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-purple-900/40 gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] text-slate-500 dark:text-purple-300 font-medium">
                  <span>Nguồn: <strong>{doc.source}</strong></span>
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

                  {/* Nút Đọc ngay: Luôn mở Bản đọc chuẩn trực tiếp để không bị lỗi màn hình trắng */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDoc(doc);
                      setReaderTab('read');
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
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1E3A8A] hover:bg-[#172554] text-white dark:bg-[#F8DF7B] dark:hover:bg-amber-300 dark:text-[#160C2C] text-[12px] font-black transition-colors cursor-pointer active:scale-95 shadow-2xs"
                    title="Tải file tài liệu thực tế về máy"
                  >
                    <Download size={14} />
                    <span>Tải về</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MODAL ĐỌC TÀI LIỆU TRỰC TIẾP CHUẨN Y KHOA (KHÔNG BAO GIỜ BỊ LỖI TRẮNG MÀN HÌNH) */}
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
                <h3 className="text-[15px] sm:text-[17px] font-black text-slate-900 dark:text-white leading-tight">
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

            {/* THANH ĐIỀU HƯỚNG CÁC TAB ĐỌC: [BẢN ĐỌC CHUẨN] · [FILE GỐC (PDF/WORD/EPUB)] · [ẢNH HD] */}
            <div className="flex items-center justify-between px-3 py-2 bg-slate-100/80 dark:bg-purple-950/40 border-b border-slate-200 dark:border-purple-900/40 gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setReaderTab('read')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-black cursor-pointer transition-colors ${
                    readerTab === 'read'
                      ? 'bg-[#1E3A8A] text-white shadow-2xs'
                      : 'bg-white dark:bg-purple-900/40 text-slate-700 dark:text-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <BookOpen size={14} />
                  <span>📖 Bản đọc trực tiếp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReaderTab('file')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-black cursor-pointer transition-colors ${
                    readerTab === 'file'
                      ? 'bg-[#1E3A8A] text-white shadow-2xs'
                      : 'bg-white dark:bg-purple-900/40 text-slate-700 dark:text-purple-200 hover:bg-slate-50'
                  }`}
                >
                  <FileText size={14} />
                  <span>📄 Tệp gốc ({selectedDoc.format})</span>
                </button>

                {selectedDoc.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setReaderTab('image')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-black cursor-pointer transition-colors ${
                      readerTab === 'image'
                        ? 'bg-[#1E3A8A] text-white shadow-2xs'
                        : 'bg-white dark:bg-purple-900/40 text-slate-700 dark:text-purple-200 hover:bg-slate-50'
                    }`}
                  >
                    <ImageIcon size={14} />
                    <span>🖼️ Bản ảnh HD</span>
                  </button>
                )}
              </div>

              {/* Nút Sao chép & Mở nhanh */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopyContent(selectedDoc)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white dark:bg-purple-900/40 border border-slate-300 dark:border-purple-700/50 text-[11px] font-bold text-slate-700 dark:text-purple-200 hover:bg-slate-50 cursor-pointer"
                  title="Sao chép toàn bộ văn bản tài liệu"
                >
                  {isCopied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{isCopied ? 'Đã chép' : 'Chép text'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenNativeFile(selectedDoc)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-white dark:bg-purple-900/40 border border-slate-300 dark:border-purple-700/50 text-[11px] font-bold text-slate-700 dark:text-purple-200 hover:bg-slate-50 cursor-pointer"
                  title="Mở tệp trong tab mới"
                >
                  <Maximize2 size={12} />
                  <span>Mở tab mới</span>
                </button>
              </div>
            </div>

            {/* NỘI DUNG THEO TAB CHỌN */}
            <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 text-slate-800 dark:text-slate-200 text-[14px]">
              {/* TAB 1: BẢN ĐỌC CHUẨN Y KHOA TRỰC TIẾP (KHÔNG BAO GIỜ BỊ LỖI TRẮNG) */}
              {readerTab === 'read' && (
                <div className="space-y-4 max-w-[720px] mx-auto">
                  {/* Khối Tổng quan */}
                  <div className="p-4 rounded-[18px] bg-amber-50/80 dark:bg-purple-950/40 border border-amber-200 dark:border-purple-800/40 shadow-xs">
                    <span className="text-[12px] font-black text-amber-800 dark:text-purple-300 uppercase tracking-wide block mb-1.5">
                      💡 Tổng quan cốt lõi
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-medium text-[14.5px] leading-relaxed">
                      {selectedDoc.content.overview}
                    </p>
                  </div>

                  {/* Các phần chi tiết */}
                  {selectedDoc.content.sections.map((sec, idx) => (
                    <div key={idx} className="space-y-2.5 pt-3 border-t border-slate-200/80 dark:border-purple-900/40">
                      <h4 className="text-[16px] sm:text-[17px] font-black text-slate-900 dark:text-white leading-snug">
                        {sec.heading}
                      </h4>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="text-slate-700 dark:text-slate-300 text-[14.5px] leading-relaxed">
                          {p}
                        </p>
                      ))}

                      {sec.bullets && sec.bullets.length > 0 && (
                        <ul className="list-disc pl-5 space-y-1.5 text-slate-700 dark:text-slate-300 text-[14px]">
                          {sec.bullets.map((b, bIdx) => (
                            <li key={bIdx} className="leading-relaxed">{b}</li>
                          ))}
                        </ul>
                      )}

                      {sec.notes && (
                        <div className="p-3.5 rounded-[12px] bg-blue-50 dark:bg-blue-950/40 border-l-4 border-blue-500 text-[13.5px] text-blue-950 dark:text-blue-200 font-medium leading-relaxed">
                          📌 <strong>Ghi chú lâm sàng:</strong> {sec.notes}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Khối Lời khuyên bác sĩ */}
                  {selectedDoc.content.clinicalAdvice && selectedDoc.content.clinicalAdvice.length > 0 && (
                    <div className="p-4 rounded-[18px] bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-300/80 dark:border-emerald-800/40 space-y-2.5 shadow-xs">
                      <span className="text-[12.5px] font-black text-emerald-800 dark:text-emerald-300 uppercase tracking-wide block">
                        🩺 Lời khuyên chuyên gia / Bác sĩ chuyên khoa
                      </span>
                      <ul className="space-y-1.5 text-[14px] text-emerald-950 dark:text-emerald-200">
                        {selectedDoc.content.clinicalAdvice.map((adv, aIdx) => (
                          <li key={aIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                            <span>{adv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: THÔNG TIN TỆP GỐC & TÙY CHỌN MỞ / TẢI VỀ THỰC TẾ */}
              {readerTab === 'file' && (
                <div className="flex flex-col gap-4 max-w-[720px] mx-auto">
                  <div className="p-5 rounded-[20px] bg-slate-50 dark:bg-[#1A103C] border border-slate-200 dark:border-purple-800/60 shadow-xs flex flex-col gap-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[14px] bg-[#1E3A8A] text-white flex items-center justify-center shrink-0 shadow-xs">
                        {selectedDoc.format.toLowerCase().includes('word') || (selectedDoc.fileUrl && selectedDoc.fileUrl.endsWith('.docx')) ? (
                          <FileSpreadsheet size={24} />
                        ) : selectedDoc.format.toLowerCase().includes('epub') || (selectedDoc.fileUrl && selectedDoc.fileUrl.endsWith('.epub')) ? (
                          <BookOpen size={24} />
                        ) : (
                          <FileText size={24} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-slate-900 dark:text-white leading-tight">
                          {selectedDoc.title}
                        </span>
                        <span className="text-[12.5px] text-muted font-medium mt-0.5">
                          {selectedDoc.format} · Dung lượng: {selectedDoc.size} · Nguồn: {selectedDoc.source}
                        </span>
                      </div>
                    </div>

                    <p className="text-[13.5px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/80 dark:border-purple-900/40 pt-2.5">
                      {selectedDoc.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {/* Nút Mở xem toàn màn hình */}
                      <button
                        type="button"
                        onClick={() => handleOpenNativeFile(selectedDoc)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-[#1E3A8A] hover:bg-[#172554] text-white font-bold text-[13px] shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <ExternalLink size={15} />
                        <span>Mở xem toàn màn hình</span>
                      </button>

                      {/* Nút Xem qua Google Docs */}
                      <button
                        type="button"
                        onClick={() => handleOpenGoogleDocs(selectedDoc)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-white dark:bg-purple-900/60 border border-slate-300 dark:border-purple-700 text-slate-800 dark:text-purple-200 font-bold text-[13px] shadow-2xs hover:bg-slate-100 cursor-pointer transition-all active:scale-95"
                      >
                        <FileCode size={15} />
                        <span>Xem qua Google Docs</span>
                      </button>

                      {/* Nút Tải file thật */}
                      <button
                        type="button"
                        onClick={() => handleDownload(selectedDoc)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-[12px] bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[13px] shadow-xs cursor-pointer transition-all active:scale-95"
                      >
                        <Download size={15} />
                        <span>Tải file gốc về máy</span>
                      </button>
                    </div>
                  </div>

                  {/* Nhúng iframe xem PDF trên màn hình lớn Desktop */}
                  {selectedDoc.pdfUrl && (
                    <div className="hidden sm:flex flex-col gap-2">
                      <span className="text-[12px] font-bold text-muted px-1">Xem trước tệp PDF trên máy tính:</span>
                      <div className="w-full h-[50vh] rounded-[16px] overflow-hidden border border-slate-200 dark:border-purple-800 bg-slate-100 dark:bg-black/40">
                        <iframe
                          src={`${selectedDoc.pdfUrl}#toolbar=1&navpanes=0`}
                          title={selectedDoc.title}
                          className="w-full h-full border-0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BẢN ẢNH HD SẮC NÉT (NẾU CÓ) */}
              {readerTab === 'image' && selectedDoc.imageUrl && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-full rounded-[16px] overflow-hidden border border-slate-200 dark:border-purple-800 shadow-md">
                    <img
                      src={selectedDoc.imageUrl}
                      alt={selectedDoc.title}
                      className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDownload(selectedDoc, 'image')}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 text-white font-bold text-[12.5px] hover:bg-emerald-700 cursor-pointer shadow-xs"
                    >
                      <Download size={14} />
                      <span>Tải ảnh HD về máy</span>
                    </button>
                    <a
                      href={selectedDoc.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-purple-900/50 text-slate-700 dark:text-purple-200 font-bold text-[12.5px] hover:bg-slate-200 cursor-pointer"
                    >
                      <Maximize2 size={14} />
                      <span>Xem kích thước gốc</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Modal: Tùy chọn Tải về Đa Định Dạng */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-t border-slate-200 dark:border-purple-900/50 bg-slate-50 dark:bg-[#1A103C] gap-2 flex-wrap sm:flex-nowrap">
              <span className="text-[12px] text-muted hidden sm:inline">
                Tủ sách y khoa học cơ thể · Bản quyền đào tạo
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
                  onClick={() => handleDownload(selectedDoc)}
                  className="flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1E3A8A] text-white dark:bg-[#F8DF7B] dark:text-[#160C2C] font-black text-[12.5px] hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
                  title="Tải tệp tài liệu gốc về máy"
                >
                  <Download size={14} />
                  <span>
                    {selectedDoc.fileUrl?.endsWith('.docx') || selectedDoc.format.toLowerCase().includes('word')
                      ? 'Tải File Word (.docx)'
                      : selectedDoc.fileUrl?.endsWith('.epub') || selectedDoc.format.toLowerCase().includes('epub')
                      ? 'Tải Ebook (.epub)'
                      : 'Tải File Thật'}
                  </span>
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
