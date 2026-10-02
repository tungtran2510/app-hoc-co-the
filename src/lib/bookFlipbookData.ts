import { FlipbookPage } from '../components/FlipbookViewer';

export interface BookInfoInput {
  id?: string;
  title?: string;
  cover_url?: string | null;
  author?: string | null;
  description?: string | null;
}

/**
 * Sinh bộ trang sách thật 3D cho từng đầu sách / tài liệu y khoa
 * - Trang 1: Bìa sách thật mạ vàng hoàng gia (Front Cover)
 * - Các trang giữa: Nội dung chuyên môn y khoa sâu theo đúng chủ đề sách
 * - Trang cuối: Bìa sau sách thật (Back Cover) có tóm tắt, trích dẫn tác giả và mã vạch ISBN
 */
export function getBookFlipbookPages(book?: BookInfoInput | null): FlipbookPage[] {
  const title = (book?.title || '').toLowerCase();
  const id = book?.id || '';

  // 1. SÁCH 1: HIỂU ĐÚNG VỀ CỘT SỐNG
  if (id === 'book-1' || title.includes('hiểu đúng về cột sống')) {
    return [
      {
        id: 'hdcs-p1',
        pageNum: 1,
        title: 'Hiểu Đúng Về Cột Sống',
        imageUrl: book?.cover_url || '/documents/covers/cover_hieu_dung_ve_cot_song.png',
      },
      {
        id: 'hdcs-p2',
        pageNum: 2,
        title: 'Lời Tựa & Mục Lục Chuyên Đề',
        category: 'CỘT SỐNG & ĐĨA ĐỆM',
        badge: 'LỜI MỞ ĐẦU',
        content: {
          heading: 'Lời Mở Đầu Từ Tác Giả',
          subheading: 'Hành trình thấu hiểu và bảo tồn cột trụ cơ thể',
          paragraphs: [
            'Hơn 80% người trưởng thành sẽ trải qua ít nhất một đợt đau lưng hoặc đau cổ trong đời. Phần lớn chúng ta chỉ tìm kiếm giải pháp khi cơn đau đã làm gián đoạn công việc và sinh hoạt.',
            'Cuốn tài liệu này được biên soạn nhằm trang bị cho bạn kiến thức nền tảng đúng đắn về cơ chế sinh học, các giai đoạn thoái hóa và lộ trình tự phục hồi tự nhiên.',
          ],
          bullets: [
            'Chương 1: Giải phẫu chức năng 33 đốt sống & 23 đĩa đệm sinh học.',
            'Chương 2: Cơ chế thoát vị đĩa đệm và thoái hóa cột sống.',
            'Chương 3: Nhận diện 5 dấu hiệu chèn ép rễ thần kinh tủy sống.',
            'Chương 4: Lộ trình 3 giai đoạn tự phục hồi không phẫu thuật.',
          ],
          highlight: 'Hiểu đúng cơ chế là chìa khóa vàng giúp bạn tự tin chữa lành và không còn nỗi sợ hãi mơ hồ.',
        },
      },
      {
        id: 'hdcs-p3',
        pageNum: 3,
        title: 'Giải Phẫu Cột Trụ 33 Đốt Sống',
        category: 'GIẢI PHẪU ỨNG DỤNG',
        badge: 'CƠ SINH HỌC',
        content: {
          heading: 'Cột Trụ Trung Tâm Nâng Đỡ Thân Mình',
          subheading: '4 đường cong sinh lý giảm tải lực xóc gấp 10 lần',
          paragraphs: [
            'Cột sống không phải là một thanh thẳng đứng mà uốn lượn thành 4 đường cong sinh lý tự nhiên: Ưỡn cổ, gù ngực, ưỡn thắt lưng và gù cùng cụt.',
            'Khi các đường cong này bị mất đi do sai tư thế (gù lưng, thẳng đốt sống cổ), áp lực tải trọng đè lên các đĩa đệm tăng vọt gấp 3 đến 5 lần bình thường.',
          ],
          bullets: [
            'Đoạn Cổ (C1 - C7): Linh hoạt nhất, chịu trọng tải hộp sọ 5 - 6kg.',
            'Đoạn Ngực (T1 - T12): Vững chắc nhất, liên kết khung sườn bảo vệ tim phổi.',
            'Đoạn Thắt Lưng (L1 - L5): To dày nhất, gánh toàn bộ trọng lượng nửa trên thân mình.',
            'Xương Cùng & Cụt: Điểm tựa kết nối với khung chậu.',
          ],
          highlight: 'Bảo tồn đường cong sinh lý là nguyên tắc sống còn để ngăn ngừa thoát vị đĩa đệm.',
          diagramType: 'spine_overview',
        },
      },
      {
        id: 'hdcs-p4',
        pageNum: 4,
        title: 'Bí Mật Cấu Trúc Đĩa Đệm',
        category: 'CƠ CHẾ ĐĨA ĐỆM',
        badge: 'GIẢM CHẤN SINH HỌC',
        content: {
          heading: '23 Chiếc Giảm Xóc Thủy Lực Tự Nhiên',
          subheading: 'Bao xơ vòng ngoài & Nhân nhầy ngậm nước bên trong',
          paragraphs: [
            'Đĩa đệm cấu tạo gồm 2 phần chính: Nhân nhầy (Nucleus Pulposus) chứa 80% là nước và các chuỗi Proteoglycan; Bao xơ (Annulus Fibrosus) gồm các sợi collagen đan chéo đồng tâm.',
            'Đĩa đệm không có mạch máu nuôi trực tiếp ở người trưởng thành. Nó được nuôi dưỡng hoàn toàn nhờ cơ chế thẩm thấu dịch khớp khi cơ thể vận động nén - nhả nhịp nhàng.',
          ],
          bullets: [
            'Ban ngày khi đứng và ngồi: Nước bị ép nhẹ ra ngoài đĩa đệm.',
            'Ban đêm khi nằm ngửa nghỉ ngơi: Đĩa đệm hút nước và dưỡng chất trở lại.',
            'Bất động quá lâu làm đĩa đệm đói dinh dưỡng và xơ hóa nhanh chóng.',
          ],
          highlight: 'Vận động nhẹ nhàng thường xuyên chính là cách tốt nhất để tưới dưỡng chất cho đĩa đệm.',
          diagramType: 'disc_anatomy',
        },
      },
      {
        id: 'hdcs-p5',
        pageNum: 5,
        title: '4 Giai Đoạn Thoát Vị Đĩa Đệm',
        category: 'TIẾN TRIỂN BỆNH LÝ',
        badge: 'CẢNH BÁO LÂM SÀNG',
        content: {
          heading: 'Diễn Tiến Từ Phình Lồi Đến Thoát Vị Rách Bao Xơ',
          subheading: 'Hiểu rõ giai đoạn giúp chọn giải pháp can thiệp đúng thời điểm',
          paragraphs: [
            'Thoát vị đĩa đệm không xảy ra sau một đêm, mà là kết quả của quá trình thoái hóa vi chấn thương tích tụ kéo dài qua nhiều tháng năm.',
            'Ở giai đoạn sớm, nhân nhầy chỉ phình nhẹ và bao xơ còn nguyên. Đến giai đoạn muộn, bao xơ rách toang khiến nhân nhầy thoát ra chèn ép trực tiếp rễ thần kinh.',
          ],
          bullets: [
            'Giai đoạn 1: Phình lồi đĩa đệm (Đau mỏi nhẹ khi ngồi lâu).',
            'Giai đoạn 2: Lồi đĩa đệm rõ rệt (Bao xơ yếu dần, đau lan nhẹ).',
            'Giai đoạn 3: Thoát vị thực thụ (Rách bao xơ, nhân nhầy chèn rễ thần kinh gây tê buốt chân/tay).',
            'Giai đoạn 4: Mảnh rời đĩa đệm (Nguy cơ hội chứng chùm đuôi ngựa).',
          ],
          highlight: '90% các ca thoát vị giai đoạn 1, 2 và 3 có thể hồi phục bảo tồn thành công nếu can thiệp đúng hướng.',
          diagramType: 'herniation',
        },
      },
      {
        id: 'hdcs-p6',
        pageNum: 6,
        title: 'Hệ Thống Dây Chằng & Cơ Bảo Vệ',
        category: 'HỆ THỐNG GIỮ TRỤC',
        badge: 'DÂY CHẰNG CỘT SỐNG',
        content: {
          heading: 'Bộ Giáp Cố Định Vững Chắc Cột Sống',
          subheading: 'Dây chằng dọc trước, dọc sau và dây chằng vàng',
          paragraphs: [
            'Dây chằng dọc trước cực kỳ to khỏe ngăn chặn cột sống ngửa quá mức. Ngược lại, dây chằng dọc sau mỏng hơn và hẹp lại ở vùng thắt lưng L4-L5-S1, tạo ra điểm yếu tự nhiên khiến đĩa đệm dễ lồi ra sau bên.',
            'Dây chằng vàng chứa nhiều sợi đàn hồi giúp nâng đỡ tư thế đứng thẳng và bảo vệ màng cứng tủy sống.',
          ],
          bullets: [
            'Dây chằng dọc trước: Rộng và dày, chịu lực kéo căng lớn.',
            'Dây chằng dọc sau: Điểm yếu sau bên là nơi 95% ca thoát vị xuất hiện.',
            'Dây chằng liên gai & trên gai: Giữ vững các mỏm gai sau.',
            'Cơ đa đầu & cơ dựng sống: Động cơ giữ trục ổn định từng phân đoạn.',
          ],
          highlight: 'Cơ bắp khỏe mạnh sẽ gánh bớt 40% áp lực thay cho đĩa đệm và dây chằng.',
          diagramType: 'ligaments',
        },
      },
      {
        id: 'hdcs-p7',
        pageNum: 7,
        title: 'Nguyên Tắc Tự Phục Hồi Bền Vững',
        category: 'PHƯƠNG PHÁP PHỤC HỒI',
        badge: 'HƯỚNG DẪN THỰC HÀNH',
        content: {
          heading: 'Kiềng 3 Chân Chăm Sóc Cột Sống',
          subheading: 'Giải Áp Cơ Học · Tái Tạo Dinh Dưỡng · Vận Động Đúng',
          paragraphs: [
            'Để cột sống tự chữa lành, bạn cần tạo điều kiện thuận lợi nhất cho quá trình sửa chữa tế bào diễn ra mỗi ngày.',
            'Sự kết hợp đồng bộ giữa việc giảm tải áp lực đĩa đệm, cung cấp đủ dưỡng chất kháng viêm và duy trì thói quen công thái học là giải pháp triệt để nhất.',
          ],
          bullets: [
            '1. Giải áp cơ học: Bài tập kéo giãn nhẹ nhàng 15 phút mỗi ngày.',
            '2. Cung cấp nước & collagen: Uống đủ 2-2.5 lít nước, bổ sung vi khoáng.',
            '3. Kiểm soát tư thế: Không cúi gập lưng nâng vật nặng, ngồi có tựa thắt lưng.',
            '4. Giấc ngủ phục hồi: Chọn đệm có độ cứng vừa phải nâng đỡ cột sống.',
          ],
          highlight: 'Cơ thể có khả năng tự chữa lành kỳ diệu khi bạn ngừng các tác nhân gây tổn thương hàng ngày.',
          diagramType: 'ergonomics',
        },
      },
      {
        id: 'hdcs-p8',
        pageNum: 8,
        title: 'Thông Điệp Xuất Bản & Bìa Sau',
        imageUrl: '/documents/covers/back_cover_hieu_dung_ve_cot_song.png',
      },
    ];
  }

  // 2. SÁCH 2: TỰ CHỮA LÀNH LƯNG & CỔ
  if (id === 'book-2' || title.includes('tự chữa lành lưng & cổ') || title.includes('tự chữa lành lưng')) {
    return [
      {
        id: 'tcl-p1',
        pageNum: 1,
        title: 'Tự Chữa Lành Lưng & Cổ',
        imageUrl: book?.cover_url || '/documents/covers/cover_tu_chua_lanh_lung_co.png',
      },
      {
        id: 'tcl-p2',
        pageNum: 2,
        title: 'Lời Mở Đầu & Triết Lý Thực Hành',
        category: 'SINH CƠ HỌC & TRỊ LIỆU',
        badge: 'LỜI MỞ ĐẦU',
        content: {
          heading: '15 Phút Mỗi Ngày Bảo Vệ Cột Sống',
          subheading: 'Khôi phục đường cong sinh lý và giải phóng chèn ép',
          paragraphs: [
            'Cột sống không đòi hỏi những bài tập phức tạp hay dụng cụ đắt tiền. Điều nó cần là sự kiên trì đúng cách mỗi ngày.',
            'Cuốn sách này là hướng dẫn thực hành từng bước giúp bạn tự giải nén các khoang đĩa đệm, cân bằng lại các nhóm cơ co rút và đưa cột sống về trạng thái thư giãn tự nhiên.',
          ],
          bullets: [
            'Phần 1: Nhận diện điểm đau và cơ chế co cứng bảo vệ.',
            'Phần 2: Chuỗi 5 bài tập giải nén cột sống thắt lưng.',
            'Phần 3: Bài tập phục hồi đường cong cổ và thả lỏng vai gáy.',
            'Phần 4: Lịch biểu thực hành 15 phút buổi sáng và buổi tối.',
          ],
          highlight: 'Kiên trì 15 phút mỗi ngày hiệu quả hơn nhiều so với việc cố gắng tập nặng 1 lần mỗi tuần.',
        },
      },
      {
        id: 'tcl-p3',
        pageNum: 3,
        title: 'Bài Tập 1: Tư Thế Con Mèo - Con Bò',
        category: 'THỰC HÀNH CỘT SỐNG',
        badge: 'LINH HOẠT TỪNG ĐỐT',
        content: {
          heading: 'Bôi Trơn Toàn Bộ Trục Cột Sống',
          subheading: 'Cat-Cow Pose: Tăng cường tuần hoàn dịch khớp',
          paragraphs: [
            'Tư thế Cat-Cow là bài tập nền tảng kinh điển giúp các đốt sống chuyển động nhịp nhàng theo chu kỳ uốn cong và duỗi giãn.',
            'Hơi thở đồng bộ nhịp nhàng giúp kích thích cơ hoành và làm dịu hệ thần kinh giao cảm, giải phóng các co thắt cơ sâu dọc cột sống.',
          ],
          bullets: [
            'Chuẩn bị: Quỳ 4 điểm trên thảm, tay vuông góc vai, gối vuông góc hông.',
            'Hít vào: Võng lưng nhẹ nhàng, ngẩng mặt lên trần, mở rộng lồng ngực.',
            'Thở ra: Cuộn tròn lưng lên trên, cúi đầu nhìn về rốn, siết nhẹ cơ bụng.',
            'Thực hiện: Lặp lại chậm rãi 10 - 12 nhịp thở sâu.',
          ],
          highlight: 'Lưu ý: Không võng lưng quá sâu nếu bạn đang trong đợt đau cấp tính vùng thắt lưng.',
          diagramType: 'spine_overview',
        },
      },
      {
        id: 'tcl-p4',
        pageNum: 4,
        title: 'Bài Tập 2: Cầu Thắt Lưng (Bridging)',
        category: 'KÍCH HOẠT CƠ LÕI',
        badge: 'BẢO VỆ ĐĨA ĐỆM L4-L5',
        content: {
          heading: 'Củng Cố Cơ Mông & Ổn Định Khung Chậu',
          subheading: 'Giảm tải cho vùng thắt lưng khi đứng và đi lại',
          paragraphs: [
            'Hội chứng "mông mất trí nhớ" (Gluteal Amnesia) do ngồi nhiều khiến cơ thắt lưng phải gánh toàn bộ tải trọng thay thế, dẫn đến quá tải đĩa đệm L4-L5 và L5-S1.',
            'Bài tập Bridging giúp đánh thức cơ mông lớn và nhóm cơ dựng sống, tái lập sự ổn định cho vùng chuyển tiếp thắt lưng - cùng cụt.',
          ],
          bullets: [
            'Chuẩn bị: Nằm ngửa, hai gối co 90 độ, bàn chân đặt vững trên thảm rộng bằng vai.',
            'Thực hiện: Ấn gót chân xuống sàn, nâng hông lên cho đến khi đầu gối, hông và vai tạo thành đường thẳng.',
            'Giữ lại: Giữ nguyên vị trí trong 3 - 5 giây ở đỉnh, siết chặt cơ mông.',
            'Hạ xuống: Hạ lưng từ từ từng đốt sống chạm sàn. Lặp lại 10 lần.',
          ],
          highlight: 'Không đẩy hông quá cao làm cong gập thắt lưng. Lực nâng xuất phát hoàn toàn từ cơ mông.',
          diagramType: 'lumbar',
        },
      },
      {
        id: 'tcl-p5',
        pageNum: 5,
        title: 'Bài Tập 3: Thu Cằm Kéo Giãn Cổ (Chin Tuck)',
        category: 'GIẢI MỎI VAI GÁY',
        badge: 'CHỐNG CỔ RÙA',
        content: {
          heading: 'Khôi Phục Trục Thẳng Cột Sống Cổ',
          subheading: 'Giải phóng chèn ép rễ thần kinh C5-C6-C7',
          paragraphs: [
            'Khi đầu nhô ra trước 5cm, trọng lượng đầu đè lên đốt sống cổ tăng từ 5kg lên đến gần 20kg, bóp nghẹt các đĩa đệm cổ.',
            'Bài tập Chin Tuck (thu cằm tạo 2 cằm) giúp kích hoạt nhóm cơ gập cổ sâu (Deep Neck Flexors) và kéo giãn cơ dưới chẩm đang bị co rút.',
          ],
          bullets: [
            'Tư thế: Ngồi thẳng lưng trên ghế, mắt nhìn thẳng về phía trước.',
            'Thực hiện: Đặt 2 ngón tay lên cằm, nhẹ nhàng đẩy cằm trượt thẳng ra sau.',
            'Cảm nhận: Cảm nhận sự căng giãn dễ chịu ở phía sau gáy và đỉnh đầu.',
            'Thời lượng: Giữ 5 giây, thả lỏng, lặp lại 10 lần. Thực hiện 3 lần/ngày.',
          ],
          highlight: 'Không cúi gập đầu xuống ngực. Động tác là trượt đầu thẳng ra sau như chiếc ngăn kéo.',
          diagramType: 'cervical',
        },
      },
      {
        id: 'tcl-p6',
        pageNum: 6,
        title: 'Bài Tập 4: Em Bé Thư Giãn (Child Pose)',
        category: 'GIẢI NÉN TỰ NHIÊN',
        badge: 'THẢ LỎNG TOÀN DIỆN',
        content: {
          heading: 'Mở Rộng Khoang Đốt Sống & Giải Tỏa Áp Lực',
          subheading: 'Tư thế thư giãn sâu cuối buổi tập',
          paragraphs: [
            'Tư thế đứa trẻ (Balasana) nhẹ nhàng kéo dài toàn bộ mặt sau cơ thể, mở rộng các lỗ liên hợp đốt sống để rễ thần kinh được thở.',
            'Đây là tư thế nghỉ ngơi tuyệt vời giúp hạ huyết áp, làm chậm nhịp tim và đưa cơ thể vào trạng thái tự phục hồi tế bào.',
          ],
          bullets: [
            'Quỳ gối trên thảm, hai ngón chân cái chạm nhau, mở rộng hai đầu gối.',
            'Hạ mông ngồi về phía gót chân, vươn dài hai tay về phía trước thảm.',
            'Hạ trán chạm thảm, thả lỏng hoàn toàn bờ vai, cổ và cột sống thắt lưng.',
            'Hít thở sâu bằng bụng trong 1 đến 2 phút.',
          ],
          highlight: 'Thực hiện tư thế này trước khi đi ngủ giúp cột sống được giải nén sẵn sàng cho giấc ngủ đêm.',
          diagramType: 'thoracic',
        },
      },
      {
        id: 'tcl-p7',
        pageNum: 7,
        title: 'Lịch Trình 15 Phút Hàng Ngày',
        category: 'LỘ TRÌNH THỰC HÀNH',
        badge: 'KỶ LUẬT TỰ THÂN',
        content: {
          heading: 'Xây Dựng Thói Quen Chăm Sóc Suốt Đời',
          subheading: 'Buổi sáng đánh thức · Buổi tối phục hồi',
          paragraphs: [
            'Chỉ cần dành ra 7 phút buổi sáng để khởi động tuần hoàn dịch khớp và 8 phút buổi tối để giải tỏa áp lực đè nén suốt cả ngày.',
            'Sự nhất quán quan trọng hơn cường độ. Hãy biến 15 phút này thành khoảng thời gian kết nối yêu thương với cơ thể bạn.',
          ],
          bullets: [
            'Sáng: 3 phút Cat-Cow + 2 phút Chin Tuck + 2 phút đi bộ giãn cơ.',
            'Tối: 3 phút Bridging + 3 phút Child Pose + 2 phút xoa bóp ấm vùng thắt lưng.',
            'Uống ngay 1 cốc nước ấm 300ml sau khi thức dậy để cấp ẩm cho đĩa đệm.',
          ],
          highlight: 'Sau 21 ngày thực hành đều đặn, bạn sẽ cảm nhận sự thay đổi kỳ diệu ở vùng lưng và cổ.',
          diagramType: 'ergonomics',
        },
      },
      {
        id: 'tcl-p8',
        pageNum: 8,
        title: 'Bìa Sau & Cam Kết Đồng Hành',
        imageUrl: '/documents/covers/back_cover_tu_chua_lanh_lung_co.png',
      },
    ];
  }

  // 3. SÁCH 3: LẮNG NGHE CƠ THỂ ĐỂ TỰ CHỮA LÀNH
  if (id === 'rec-book-1' || title.includes('lắng nghe cơ thể')) {
    return [
      {
        id: 'lnct-p1',
        pageNum: 1,
        title: 'Lắng Nghe Cơ Thể Để Tự Chữa Lành',
        imageUrl: book?.cover_url || '/documents/covers/cover_lang_nghe_co_the.png',
      },
      {
        id: 'lnct-p2',
        pageNum: 2,
        title: 'Lời Tựa: Ngôn Ngữ Của Cơ Thể',
        category: 'TÀI LIỆU Y KHOA NỀN TẢNG',
        badge: 'LỜI MỞ ĐẦU',
        content: {
          heading: 'Cơn Đau Là Tiếng Kêu Cứu Của Tế Bào',
          subheading: 'Học cách thấu hiểu trước khi quá muộn',
          paragraphs: [
            'Cơ thể con người là một cỗ máy sinh học tinh vi bậc nhất vũ trụ. Khi có bất kỳ bộ phận nào bị quá tải hay tổn thương, nó sẽ lập tức phát đi các tín hiệu cảnh báo.',
            'Sai lầm lớn nhất của chúng ta là thường uống thuốc giảm đau để bịt miệng các tín hiệu ấy thay vì tìm hiểu gốc rễ nguyên nhân.',
          ],
          bullets: [
            'Phân biệt đau cơ căng mỏi và đau chèn ép thần kinh.',
            'Bản đồ các vùng đau quy chiếu từ cột sống ra tứ chi.',
            'Nhịp sinh học và khung giờ vàng phục hồi của từng cơ quan.',
            'Mối liên hệ mật thiết giữa stress cảm xúc và co cứng cơ.',
          ],
          highlight: 'Đừng coi cơn đau là kẻ thù. Hãy xem nó là người bạn chân thành nhắc nhở bạn cần thay đổi.',
        },
      },
      {
        id: 'lnct-p3',
        pageNum: 3,
        title: 'Bảng Tra Cứu Rễ Thần Kinh Cột Sống',
        imageUrl: '/documents/bang_tra_cuu_re_than_kinh_cot_song.png',
      },
      {
        id: 'lnct-p4',
        pageNum: 4,
        title: 'Phân Biệt Các Loại Cơn Đau',
        category: 'CHẨN ĐOÁN CƠ NĂNG',
        badge: 'NHẬN DIỆN SỚM',
        content: {
          heading: 'Giải Mã Tính Chất Cơn Đau Vận Động',
          subheading: 'Đau Cơ · Đau Khớp · Đau Thần Kinh',
          paragraphs: [
            'Đau cơ: Cảm giác mỏi, ê ẩm, nặng nề, đau tăng khi ấn vào bắp thịt và thuyên giảm khi chườm ấm hoặc xoa bóp nhẹ nhàng.',
            'Đau khớp: Đau sâu bên trong ổ khớp, kèm tiếng lục cục lạo xạo khi cử động, cứng khớp buổi sáng dưới 30 phút.',
            'Đau thần kinh: Đau buốt như điện giật, tê bì râm ran như kiến bò, bỏng rát, lan dọc theo đường đi của dây thần kinh (từ mông xuống bắp chân hoặc từ cổ lan xuống ngón tay).',
          ],
          bullets: [
            'Đau thần kinh tọa: Chèn ép rễ L4, L5, S1 gây yếu ngón chân cái hoặc gót chân.',
            'Đau thần kinh cánh tay: Chèn ép rễ C5, C6, C7 gây tê bì ngón cái, ngón trỏ hoặc ngón út.',
          ],
          highlight: 'Nếu xuất hiện cảm giác tê bì mất cảm giác hoặc yếu cơ, bạn cần thăm khám chuyên sâu ngay.',
          diagramType: 'lumbar',
        },
      },
      {
        id: 'lnct-p5',
        pageNum: 5,
        title: 'Giấc Ngủ & Tái Tạo Tế Bào',
        category: 'PHỤC HỒI NỀN TẢNG',
        badge: 'NHỊP SINH HỌC',
        content: {
          heading: 'Khung Giờ Vàng Phục Hồi Xương Khớp',
          subheading: 'Từ 23h đến 3h sáng: Đĩa đệm ngậm nước và mô sụn sửa chữa',
          paragraphs: [
            'Trong lúc ngủ sâu, hormone tăng trưởng GH (Growth Hormone) được tiết ra ở mức đỉnh, thúc đẩy quá trình tổng hợp collagen và tái tạo mô liên kết.',
            'Tư thế ngủ chuẩn đóng vai trò quyết định giúp cột sống hoàn toàn thả lỏng và không phải chịu bất kỳ lực xoắn vặn nào suốt đêm.',
          ],
          bullets: [
            'Nằm ngửa: Kê một chiếc gối mỏng dưới khoeo chân để giữ thắt lưng áp sát đệm.',
            'Nằm nghiêng: Kẹp một chiếc gối ôm giữa hai đầu gối để giữ khung chậu cân bằng.',
            'Tuyệt đối tránh nằm sấp vì sẽ ép cột sống cổ xoay vặn 90 độ suốt nhiều giờ.',
          ],
          highlight: 'Chất lượng giấc ngủ quyết định đến 60% tốc độ phục hồi của hệ cơ xương khớp.',
          diagramType: 'ergonomics',
        },
      },
      {
        id: 'lnct-p6',
        pageNum: 6,
        title: 'Tâm Thức & Căng Thẳng Cơ Bắp',
        category: 'Y HỌC THÂN TÂM',
        badge: 'GIẢI TỎA STRESS',
        content: {
          heading: 'Mối Liên Hệ Thân - Tâm Trong Cơn Đau',
          subheading: 'Căng thẳng kích hoạt co thắt cơ vùng cổ vai và thắt lưng',
          paragraphs: [
            'Khi não bộ gặp căng thẳng (stress), hormone Cortisol và Adrenaline tăng vọt làm mạch máu co lại, giảm tưới máu nuôi cơ bắp và khiến các sợi cơ thắt nút (Trigger Points).',
            'Nhiều bệnh nhân đau vai gáy mạn tính thực chất bắt nguồn từ áp lực công việc và cảm xúc dồn nén lâu ngày.',
          ],
          bullets: [
            'Thực hành thở bụng 4-7-8 giúp kích hoạt dây thần kinh phế vị làm dịu cơ thể.',
            'Dành 10 phút tĩnh tâm hoặc thiền định buông thư trước khi đi ngủ.',
            'Ngắt kết nối màn hình điện thoại ít nhất 45 phút trước giờ ngủ.',
          ],
          highlight: 'Một tâm trí an yên là nền tảng vững chắc nhất cho một cơ thể khỏe mạnh không đau đớn.',
          diagramType: 'cervical',
        },
      },
      {
        id: 'lnct-p7',
        pageNum: 7,
        title: 'Thông Điệp Tác Giả & Bìa Sau',
        imageUrl: '/documents/covers/back_cover_lang_nghe_co_the.png',
      },
    ];
  }

  // 4. SÁCH 4: GIẢI MÃ CỘT SỐNG & VẬN ĐỘNG ĐÚNG
  if (id === 'rec-book-2' || title.includes('giải mã cột sống')) {
    return [
      {
        id: 'gmcs-p1',
        pageNum: 1,
        title: 'Giải Mã Cột Sống & Vận Động Đúng',
        imageUrl: book?.cover_url || '/documents/covers/cover_giai_ma_cot_song.png',
      },
      {
        id: 'gmcs-p2',
        pageNum: 2,
        title: 'Lời Tựa: Động Học Cơ Thể Người',
        category: 'CÔNG THÁI HỌC ỨNG DỤNG',
        badge: 'LỜI MỞ ĐẦU',
        content: {
          heading: 'Vận Động Đúng Là Liều Thuốc Tự Nhiên Quý Giá',
          subheading: 'Hiểu nguyên lý đòn bẩy cơ sinh học trong sinh hoạt thường nhật',
          paragraphs: [
            'Cơ thể con người được thiết kế để di chuyển và vận động liên tục, không phải để ngồi gập người trước màn hình máy tính 8 đến 10 tiếng mỗi ngày.',
            'Cuốn sách này giúp bạn nhìn nhận lại từng hành động nhỏ nhất: cách nhấc một đồ vật từ sàn, cách ngồi làm việc, cách lái xe hay thậm chí là cách bước đi sao cho cột sống luôn được bảo vệ tối đa.',
          ],
          bullets: [
            'Chương 1: Biểu đồ áp lực đĩa đệm theo các tư thế cơ học.',
            'Chương 2: Thiết lập không gian làm việc chuẩn công thái học.',
            'Chương 3: Quy tắc đòn bẩy khi nâng nhấc vật nặng an toàn.',
            'Chương 4: Kỹ thuật kích hoạt khối cơ lõi (Core Bracing).',
          ],
          highlight: 'Vận động sai là tích tụ độc tố cơ học. Vận động đúng là tạo ra dưỡng chất tái tạo khớp.',
        },
      },
      {
        id: 'gmcs-p3',
        pageNum: 3,
        title: 'Biểu Đồ Áp Lực Đĩa Đệm L4-L5',
        category: 'CƠ SINH HỌC TẢI TRỌNG',
        badge: 'SỐ LIỆU Y KHOA',
        content: {
          heading: 'Tải Trọng Lên Đĩa Đệm Qua Từng Tư Thế',
          subheading: 'Nghiên cứu kinh điển của Giáo sư Alf Nachemson',
          paragraphs: [
            'Nếu coi tải trọng lên đĩa đệm ở tư thế đứng thẳng là 100% (khoảng 100kg lực ở người 70kg), thì các tư thế khác sẽ thay đổi áp lực này một cách đáng kinh ngạc:',
            'Nằm ngửa thư giãn: 25% (25kg - thời điểm đĩa đệm được nghỉ ngơi phục hồi tối đa).',
          ],
          bullets: [
            'Đứng thẳng: 100% tải trọng cơ bản.',
            'Đứng cúi người về trước: Tăng lên 150%.',
            'Ngồi thẳng lưng có tựa: 140%.',
            'Ngồi gù lưng thả lỏng: Tăng vọt lên 185% - 200%.',
            'Ngồi gù lưng nhấc vật nặng: Áp lực lên tới 275% (gần 300kg đè lên 1 đĩa đệm nhỏ!).',
          ],
          highlight: 'Ngồi gù lưng lâu nguy hiểm cho đĩa đệm gấp đôi so với đứng thẳng làm việc.',
          diagramType: 'lumbar',
        },
      },
      {
        id: 'gmcs-p4',
        pageNum: 4,
        title: 'Công Thái Học Bàn Làm Việc',
        category: 'CÔNG THÁI HỌC VĂN PHÒNG',
        badge: 'BẢO VỆ CỘT SỐNG',
        content: {
          heading: 'Quy Tắc 90 - 90 - 90 Khi Ngồi Làm Việc',
          subheading: 'Loại bỏ hoàn toàn tư thế gù lưng và rụt cổ',
          paragraphs: [
            'Khung bàn ghế không phù hợp là nguyên nhân số 1 gây thoái hóa cột sống sớm ở giới văn phòng. Chỉ cần điều chỉnh vài chi tiết nhỏ sẽ tạo nên sự khác biệt khổng lồ.',
            'Màn hình máy tính ngang tầm mắt giúp giữ đốt sống cổ ở vị trí trung tính, giải phóng hoàn toàn gánh nặng cho khối cơ vai gáy.',
          ],
          bullets: [
            'Góc 1: Khớp khuỷu tay gập 90 độ đặt thoải mái trên mặt bàn hoặc tay vịn ghế.',
            'Góc 2: Khớp háng gập 90 độ, thắt lưng áp sát vào đệm đỡ lưng sinh lý.',
            'Góc 3: Khớp gối gập 90 độ, toàn bộ lòng bàn chân đặt phẳng vững chãi trên sàn.',
            'Mép trên màn hình: Ngang đúng tầm mắt nhìn thẳng, cách mắt 50 - 60cm.',
          ],
          highlight: 'Quy tắc 30 phút: Cứ sau 30 phút ngồi làm việc, hãy đứng dậy vươn vai 30 giây.',
          diagramType: 'ergonomics',
        },
      },
      {
        id: 'gmcs-p5',
        pageNum: 5,
        title: 'Quy Tắc Nâng Vật Nặng Chuẩn Y Khoa',
        category: 'KỸ THUẬT AN TOÀN',
        badge: 'PHÒNG TRÁNH THOÁT VỊ',
        content: {
          heading: 'Sử Dụng Sức Mạnh Cơ Chân & Khớp Háng',
          subheading: 'Không bao giờ cúi gập lưng để nhấc vật từ dưới sàn',
          paragraphs: [
            'Khi bạn cúi gập lưng để nhấc một vật nặng 10kg, theo nguyên lý đòn bẩy, áp lực dồn lên đĩa đệm L5-S1 có thể lên tới hơn 150kg, dễ dàng làm rách bao xơ đang thoái hóa.',
            'Nguyên tắc vàng là luôn giữ cột sống thẳng, hạ thấp trọng tâm bằng cách chùng gối và dùng sức mạnh của cơ đùi và cơ mông để nâng vật lên.',
          ],
          bullets: [
            'Bước 1: Đứng sát vào vật thể, hai chân mở rộng bằng vai tạo chân đế vững chắc.',
            'Bước 2: Siết nhẹ cơ bụng, ngồi xổm xuống bằng cách gập khớp háng và gối.',
            'Bước 3: Ôm chặt vật sát vào ngực hoặc bụng trước khi đứng lên.',
            'Bước 4: Dùng lực đạp gót chân nâng người thẳng lên, giữ lưng thẳng suốt quá trình.',
          ],
          highlight: 'Ôm vật càng sát người thì cánh tay đòn càng ngắn, lực đè lên đĩa đệm càng nhỏ.',
          diagramType: 'spine_overview',
        },
      },
      {
        id: 'gmcs-p6',
        pageNum: 6,
        title: 'Kích Hoạt Khối Cơ Lõi (Core Bracing)',
        category: 'ỔN ĐỊNH CỘT SỐNG',
        badge: 'CƠ LÕI VỮNG CHẮC',
        content: {
          heading: 'Chiếc Thắt Lưng Bảo Hiểm Tự Nhiên Của Cơ Thể',
          subheading: 'Cơ ngang bụng (Transverse Abdominis) và cơ đa đầu',
          paragraphs: [
            'Nhiều người lầm tưởng tập cơ bụng 6 múi là bảo vệ được lưng. Thực chất, nhóm cơ bảo vệ cột sống hiệu quả nhất là cơ ngang bụng nằm sâu bên trong như một chiếc nẹp corset tự nhiên.',
            'Khi cơ ngang bụng siết chặt, áp lực trong ổ bụng (IAP) tăng lên giúp chia sẻ bớt 30-40% tải trọng nén đè lên các đốt sống thắt lưng.',
          ],
          bullets: [
            'Kỹ thuật Bracing: Gồng cứng bụng như chuẩn bị đón một cú đấm nhẹ vào bụng.',
            'Không nín thở: Giữ vững cơ bụng trong khi vẫn duy trì nhịp hít thở đều.',
            'Ứng dụng: Gồng nhẹ cơ bụng khi nâng vác, cúi người hoặc bước lên cầu thang.',
          ],
          highlight: 'Cơ lõi khỏe giúp bạn tự tin vận động mạnh mà không lo chấn thương cột sống.',
          diagramType: 'lumbar',
        },
      },
      {
        id: 'gmcs-p7',
        pageNum: 7,
        title: 'Thông Điệp Tác Giả & Bìa Sau',
        imageUrl: '/documents/covers/back_cover_giai_ma_cot_song.png',
      },
    ];
  }

  // 5. SÁCH 5: DINH DƯỠNG KHÁNG VIÊM & TÁI TẠO KHỚP
  if (id === 'rec-book-3' || title.includes('dinh dưỡng kháng viêm') || title.includes('tái tạo khớp')) {
    return [
      {
        id: 'ddkv-p1',
        pageNum: 1,
        title: 'Dinh Dưỡng Kháng Viêm & Tái Tạo Khớp',
        imageUrl: book?.cover_url || '/documents/covers/cover_dinh_duong_khang_viem.png',
      },
      {
        id: 'ddkv-p2',
        pageNum: 2,
        title: 'Lời Tựa: Dinh Dưỡng Tế Bào Sụn Khớp',
        category: 'DINH DƯỠNG TRỊ LIỆU',
        badge: 'LỜI MỞ ĐẦU',
        content: {
          heading: 'Chữa Lành Từ Bên Trong Từng Tế Bào',
          subheading: 'Thức ăn có thể là liều thuốc kháng viêm mạnh mẽ nhất',
          paragraphs: [
            'Các cơn đau khớp dai dẳng thường đi kèm với phản ứng viêm mạn tính mức độ thấp (Low-grade chronic inflammation) âm thầm phá hủy tế bào sụn và làm khô dịch khớp.',
            'Bằng việc loại bỏ các thực phẩm gây viêm và tăng cường các dưỡng chất tái tạo đặc hiệu, bạn hoàn toàn có thể giúp cơ thể dập tắt ngọn lửa viêm và tái thiết lập cấu trúc khớp khỏe mạnh.',
          ],
          bullets: [
            'Chương 1: Cơ chế gây viêm của đường tinh luyện và dầu mỡ chuyển hóa.',
            'Chương 2: Bộ ba vàng kháng viêm tự nhiên: Curcumin, Omega-3 & Gừng.',
            'Chương 3: Nguyên liệu tái tạo sụn: Collagen Type II, Glucosamine & Vitamin C.',
            'Chương 4: Chiến lược bù nước thông minh cho đĩa đệm ngậm nước.',
          ],
          highlight: 'Hãy để thức ăn là thuốc và thuốc là thức ăn của bạn — Hippocrates.',
        },
      },
      {
        id: 'ddkv-p3',
        pageNum: 3,
        title: 'Nhóm Thực Phẩm Thổi Bùng Ngọn Lửa Viêm',
        category: 'CẢNH BÁO DINH DƯỠNG',
        badge: 'CẦN CẮT GIẢM',
        content: {
          heading: 'Thực Phẩm Kích Hoạt Cytokine Gây Đau Khớp',
          subheading: 'Hạn chế tối đa để ngắt cơn đau mạn tính',
          paragraphs: [
            'Khi tiêu thụ quá nhiều đường và tinh bột tinh chế, nồng độ Insulin và đường huyết tăng vọt, kích thích giải phóng các phân tử gây viêm như IL-6 và TNF-alpha.',
            'Các chất béo chuyển hóa (Trans fat) và dầu thực vật giàu Omega-6 qua chiên rán nhiệt độ cao làm mất cân bằng màng tế bào, khiến bao khớp luôn trong tình trạng sưng nề.',
          ],
          bullets: [
            'Đường tinh luyện, nước ngọt có ga, bánh kẹo ngọt công nghiệp.',
            'Thực phẩm chiên rán ngập dầu nhiều lần, mỡ động vật công nghiệp.',
            'Đồ ăn đóng hộp chứa nhiều chất bảo quản nhân tạo và phụ gia hóa học.',
            'Rượu bia và thuốc lá: Làm co thắt vi mạch máu nuôi dưỡng đĩa đệm.',
          ],
          highlight: 'Chỉ cần cắt giảm 80% đường ngọt trong 2 tuần, bạn sẽ thấy các khớp nhẹ nhõm rõ rệt.',
          diagramType: 'disc_anatomy',
        },
      },
      {
        id: 'ddkv-p4',
        pageNum: 4,
        title: 'Bộ Ba Vàng Kháng Viêm Tự Nhiên',
        category: 'DƯỢC THỰC LIỆU',
        badge: 'KHÁNG VIÊM SINH HỌC',
        content: {
          heading: 'Sức Mạnh Từ Tự Nhiên Không Gây Tác Dụng Phụ',
          subheading: 'Curcumin (Nghệ) · Acid béo Omega-3 · Gingerol (Gừng)',
          paragraphs: [
            'Curcumin từ củ nghệ vàng có hoạt tính ức chế enzym gây viêm COX-2 tương đương một số thuốc kháng viêm nhưng hoàn toàn êm dịu cho niêm mạc dạ dày.',
            'Omega-3 (EPA và DHA) từ cá béo biển sâu giúp thay thế các acid béo gây viêm trên màng tế bào, làm giảm độ cứng khớp buổi sáng và tăng sản xuất dịch bôi trơn.',
          ],
          bullets: [
            'Curcumin: Dùng kèm một chút hạt tiêu đen (Piperine) giúp tăng hấp thu lên 2000%.',
            'Omega-3: Tối thiểu 1000 - 2000mg EPA+DHA mỗi ngày từ cá hồi, cá thu, hạt chia.',
            'Trà gừng ấm: Uống buổi sáng giúp lưu thông khí huyết và làm ấm các khớp xương.',
          ],
          highlight: 'Kết hợp nghệ và tiêu đen trong bữa ăn hàng ngày là bài thuốc kháng viêm tự nhiên tuyệt hảo.',
          diagramType: 'spine_overview',
        },
      },
      {
        id: 'ddkv-p5',
        pageNum: 5,
        title: 'Nguyên Liệu Tái Tạo Sụn Khớp & Đĩa Đệm',
        category: 'TÁI TẠO TẾ BÀO',
        badge: 'DINH DƯỠNG CHUYÊN SÂU',
        content: {
          heading: 'Cung Cấp Gạch Vữa Xây Dựng Khung Xương Khớp',
          subheading: 'Collagen Type II không biến tính, Chondroitin & Khoáng chất',
          paragraphs: [
            'Sụn khớp cấu tạo chủ yếu từ Collagen Type II và mạng lưới Proteoglycan ngậm nước. Để tổng hợp các thành phần này, cơ thể cần đầy đủ các acid amin chuyên biệt và các cofactor vi lượng.',
            'Vitamin C là yếu tố bắt buộc để gắn kết các sợi collagen, trong khi Kẽm và Magie tham gia vào hơn 300 phản ứng enzym tái tạo xương.',
          ],
          bullets: [
            'Nước hầm xương chậm: Cung cấp gelatin, collagen và các acid amin glycine, proline dồi dào.',
            'Rau xanh đậm màu (cải xoăn, bông cải xanh): Cung cấp Vitamin K, Canxi và Canxi hữu cơ.',
            'Trái cây giàu Vitamin C (ổi, cam, kiwi, dâu tây): Kích hoạt tổng hợp sợi sụn mới.',
            'Bổ sung Glucosamine Sulfate & Chondroitin giúp duy trì độ đàn hồi màng hoạt dịch.',
          ],
          highlight: 'Cung cấp đủ dinh dưỡng giúp sụn khớp có khả năng tự sửa chữa và làm chậm quá trình thoái hóa.',
          diagramType: 'ergonomics',
        },
      },
      {
        id: 'ddkv-p6',
        pageNum: 6,
        title: 'Nước Uống & Đĩa Đệm Cột Sống',
        category: 'CẤP ẨM SINH HỌC',
        badge: 'CẤP NƯỚC ĐÚNG CÁCH',
        content: {
          heading: 'Đĩa Đệm Cần Nước Để Không Bị Xẹp Lún',
          subheading: 'Uống từng ngụm nhỏ rải đều suốt ngày',
          paragraphs: [
            'Nhân nhầy đĩa đệm chứa đến 80% là nước. Khi cơ thể thiếu nước, đĩa đệm sẽ là cơ quan đầu tiên bị mất nước, trở nên khô giòn và dễ rách nứt khi chịu tải trọng.',
            'Uống ực một hơi 500ml sẽ khiến thận đào thải nhanh ra ngoài. Cách uống đúng là từng ngụm nhỏ 50-100ml để nước có thời gian thẩm thấu vào tế bào.',
          ],
          bullets: [
            'Định mức: 0.04 lít nước cho mỗi kg cân nặng (người 60kg cần khoảng 2.4 lít nước/ngày).',
            'Cốc nước đầu ngày: 300ml nước ấm ngay khi vừa rời giường.',
            'Bổ sung một nhúm nhỏ muối khoáng hồng Himalaya để cân bằng điện giải thẩm thấu.',
          ],
          highlight: 'Một đĩa đệm no nước sẽ hoạt động như chiếc đệm hơi êm ái bảo vệ từng bước đi của bạn.',
          diagramType: 'disc_anatomy',
        },
      },
      {
        id: 'ddkv-p7',
        pageNum: 7,
        title: 'Thông Điệp Tác Giả & Bìa Sau',
        imageUrl: '/documents/covers/back_cover_dinh_duong_khang_viem.png',
      },
    ];
  }

  // 6. SÁCH 6: CẨM NANG BẢO VỆ ĐỐT SỐNG CỔ
  if (id === 'rec-book-4' || title.includes('đốt sống cổ') || title.includes('cổ vai gáy')) {
    return [
      {
        id: 'cndsc-p1',
        pageNum: 1,
        title: 'Cẩm Nang Bảo Vệ Đốt Sống Cổ',
        imageUrl: book?.cover_url || '/documents/covers/cover_cam_nang_dot_song_co.png',
      },
      {
        id: 'cndsc-p2',
        pageNum: 2,
        title: 'Lời Tựa: Cột Sống Cổ & Nguồn Máu Nuôi Não',
        category: 'CỘT SỐNG CỔ & VAI GÁY',
        badge: 'LỜI MỞ ĐẦU',
        content: {
          heading: 'Bảo Vệ Đốt Sống Cổ Là Bảo Vệ Bộ Não',
          subheading: 'Hệ lụy khôn lường từ thoái hóa đốt sống cổ sớm',
          paragraphs: [
            '7 đốt sống cổ C1 đến C7 có nhiệm vụ nâng đỡ đầu và bảo vệ tủy sống cổ cùng hai động mạch đốt sống chui qua các lỗ mỏm ngang để bơm máu trực tiếp lên não bộ.',
            'Thoát vị đĩa đệm và gai xương cột sống cổ không chỉ gây đau mỏi vai gáy thông thường mà còn gây thiểu năng tuần hoàn não, chóng mặt, đau nửa đầu và mất ngủ kinh niên.',
          ],
          bullets: [
            'Chương 1: Cấu trúc cặp đốt đặc biệt C1 Atlas & C2 Axis.',
            'Chương 2: Hội chứng cổ rùa (Text Neck Syndrome) thời đại số.',
            'Chương 3: Giải mã đau đầu vận mạch do chèn ép rễ thần kinh chẩm.',
            'Chương 4: Kỹ thuật chọn gối ngủ bảo vệ đường cong sinh lý cổ.',
          ],
          highlight: 'Giải phóng áp lực đốt sống cổ giúp phục hồi dòng máu tươi giàu oxy lên nuôi dưỡng tế bào não.',
        },
      },
      {
        id: 'cndsc-p3',
        pageNum: 3,
        title: 'Giải Phẫu Đốt Sống Cổ & Động Mạch',
        category: 'GIẢI PHẪU CHUYÊN BIỆT',
        badge: 'MẠCH MÁU & THẦN KINH',
        content: {
          heading: 'Đoạn Cổ C1-C7: Linh Hoạt Nhất Nhưng Dễ Tổn Thương Nhất',
          subheading: 'Khớp đội - trục cho phép xoay đầu 180 độ',
          paragraphs: [
            'Đốt C1 (Atlas) nâng đỡ hộp sọ khớp với lồi cầu chẩm. Đốt C2 (Axis) có mỏm răng nhô lên làm trục xoay.',
            'Động mạch đốt sống chui qua lỗ mỏm ngang từ C6 lên C1 trước khi hợp nhất thành động mạch thân nền nuôi tiểu não và thân não. Khi đốt sống cổ bị thoái hóa hoặc trượt, lưu lượng máu nuôi não có thể giảm đến 40%.',
          ],
          bullets: [
            'Đốt C7 có gai sau dài nhất, sờ thấy rõ nhất sau gáy (đốt sống lồi).',
            'Đĩa đệm C5-C6 và C6-C7 là hai vị trí thoát vị phổ biến nhất ở vùng cổ.',
            'Chèn ép rễ C6 gây tê ngón tay cái; chèn ép rễ C7 gây tê ngón trỏ và ngón giữa.',
          ],
          highlight: 'Các triệu chứng chóng mặt, hoa mắt khi quay đầu thường liên quan mật thiết đến hẹp lỗ mỏm ngang cổ.',
          diagramType: 'cervical',
        },
      },
      {
        id: 'cndsc-p4',
        pageNum: 4,
        title: 'Hội Chứng Cổ Rùa (Text Neck)',
        category: 'BỆNH LÝ THỜI ĐẠI SỐ',
        badge: 'NGUY HIỂM KHI DÙNG ĐIỆN THOẠI',
        content: {
          heading: 'Gánh Nặng 27kg Khi Cúi Nhìn Smartphone',
          subheading: 'Góc nghiêng đầu làm gia tăng tải trọng theo cấp số nhân',
          paragraphs: [
            'Ở tư thế thẳng đầu tự nhiên (0 độ), cột sống cổ chỉ phải chịu 4.5 đến 5.5kg.',
            'Khi cúi đầu 15 độ, áp lực tăng lên 12kg. Cúi 30 độ áp lực là 18kg. Và khi cúi 60 độ để lướt điện thoại, áp lực đè lên đốt sống cổ lên đến 27kg — tương đương việc cõng một đứa trẻ 8 tuổi trên cổ!',
          ],
          bullets: [
            'Lâu ngày làm thẳng hoặc đảo ngược đường cong ưỡn sinh lý của cổ.',
            'Cơ thang và cơ nâng vai bị căng kéo quá tải dẫn đến xơ cứng, co rút cục bộ.',
            'Gây lắng đọng canxi tạo thành bướu gù mỡ sau gáy (Dowager Hump).',
          ],
          highlight: 'Hãy nâng điện thoại lên ngang tầm mắt thay vì cúi gục đầu xuống nhìn màn hình.',
          diagramType: 'cervical',
        },
      },
      {
        id: 'cndsc-p5',
        pageNum: 5,
        title: 'Cách Chọn Gối Ngủ Chuẩn Y Khoa',
        category: 'CHĂM SÓC BAN ĐÊM',
        badge: 'GỐI NGỦ CÔNG THÁI HỌC',
        content: {
          heading: 'Chiếc Gối Quyết Định Sức Khỏe Cổ Suốt 8 Tiếng',
          subheading: 'Không quá cao, không quá thấp, nâng đỡ trọn vẹn hõm gáy',
          paragraphs: [
            'Một chiếc gối quá cao sẽ ép gập cổ về trước suốt đêm, biến giấc ngủ thành cơn ác mộng chèn ép đĩa đệm. Chiếc gối quá xẹp khiến đầu ngửa ra sau làm hẹp lỗ liên hợp đốt sống cổ.',
            'Gối chuẩn cần có phần nâng đỡ hõm gáy cao khoảng 8 - 10cm và phần đỡ hộp sọ thấp hơn (khoảng 6 - 7cm) để giữ cổ ở trạng thái trung tính.',
          ],
          bullets: [
            'Chất liệu cao su non (Memory Foam) đàn hồi chậm là lựa chọn tối ưu.',
            'Khi nằm nghiêng: Chiều cao gối phải bằng đúng khoảng cách từ chân cổ đến mỏm vai.',
            'Không kê gối dưới bả vai, chỉ kê từ chân cổ lên đến hết đỉnh đầu.',
          ],
          highlight: 'Nếu thức dậy bị đau cứng cổ vai gáy, điều đầu tiên bạn cần thay thế chính là chiếc gối nằm.',
          diagramType: 'ergonomics',
        },
      },
      {
        id: 'cndsc-p6',
        pageNum: 6,
        title: '3 Bài Tập Thả Lỏng Vai Gáy Tại Chỗ',
        category: 'THỰC HÀNH CÔNG SỞ',
        badge: 'DÀNH CHO NGƯỜI BẬN RỘN',
        content: {
          heading: 'Giải Tỏa Co Cứng Ngay Trên Ghế Làm Việc',
          subheading: 'Chỉ 3 phút thực hiện vào giữa giờ làm việc',
          paragraphs: [
            'Khi cơ bắp vùng cổ bắt đầu phát tín hiệu mỏi, hãy dành ra 3 phút thực hiện chuỗi bài tập kéo giãn để tái lập tuần hoàn máu trước khi cơn đau chuyển thành co thắt mạn tính.',
          ],
          bullets: [
            '1. Kéo giãn cơ thang bên: Ngồi thẳng, tay phải vòng qua đỉnh đầu kéo nhẹ đầu nghiêng về bên phải, giữ 15 giây rồi đổi bên.',
            '2. Xoay vai mở ngực: Đặt các ngón tay lên đầu vai, xoay vòng tròn lớn từ trước ra sau 10 lần để thả lỏng khớp bả vai.',
            '3. Thu cằm Chin Tuck: 10 lần thu cằm ra sau giúp giải nén rễ thần kinh cổ.',
          ],
          highlight: 'Động tác kéo giãn phải êm dịu, không giật mạnh hoặc xoay bẻ cổ đột ngột gây tổn thương bao khớp.',
          diagramType: 'cervical',
        },
      },
      {
        id: 'cndsc-p7',
        pageNum: 7,
        title: 'Thông Điệp Tác Giả & Bìa Sau',
        imageUrl: '/documents/covers/back_cover_cam_nang_dot_song_co.png',
      },
    ];
  }

  // 7. ATLAS GIẢI PHẪU Y KHOA NỀN TẢNG (DEFAULT FALLBACK / ATLAS TOÀN DIỆN)
  return [
    {
      id: 'atlas-p1',
      pageNum: 1,
      title: 'Atlas Giải Phẫu Cột Sống & Đĩa Đệm 3D',
      imageUrl: '/documents/covers/cover_atlas_y_khoa_toan_dien.png',
    },
    {
      id: 'atlas-p2',
      pageNum: 2,
      title: 'Tổng Quan 33-34 Đốt Sống & 4 Đường Cong',
      category: 'PHÂN ĐOẠN CỘT SỐNG',
      badge: 'ĐOẠN CONG SINH LÝ',
      content: {
        heading: '1. Cột trụ chịu lực trung tâm cơ thể',
        subheading: '4 đường cong hấp thụ lực xóc gấp 10 lần cột thẳng',
        paragraphs: [
          'Cột sống người trưởng thành dài trung bình 70-75cm ở nam và 60-65cm ở nữ, gồm 5 phân đoạn giải phẫu liên hoàn.',
          '4 đường cong sinh lý xen kẽ: Cong ưỡn cổ (Lordosis), Gù ngực (Kyphosis), Ưỡn thắt lưng (Lordosis) và Gù cùng cụt.',
        ],
        bullets: [
          'Đoạn Cổ (C1 - C7): Linh hoạt nhất, điều khiển cử động đầu xoay 180°.',
          'Đoạn Ngực (T1 - T12): Gắn với 12 đôi xương sườn, bảo vệ tim phổi.',
          'Đoạn Thắt Lưng (L1 - L5): To dày nhất, chịu tải trọng chính của thân mình.',
          'Xương Cùng (S1 - S5 dính liền) & Xương Cụt (3 - 5 đốt).',
        ],
        highlight: 'Sự phối hợp giữa các đốt sống và đĩa đệm tạo nên độ bền và tính dẻo dai tuyệt vời cho con người.',
        diagramType: 'spine_overview',
      },
    },
    {
      id: 'atlas-p3',
      pageNum: 3,
      title: 'Đoạn Cổ (C1 - C7) & Khớp Đội - Trục',
      category: 'GIẢI PHẪU ĐOẠN CỔ',
      badge: 'VẬN ĐỘNG LINH HOẠT',
      content: {
        heading: '2. Cột sống cổ & Cặp đốt đặc biệt C1-C2',
        subheading: 'Đốt Đội (Atlas) nâng đỡ hộp sọ - Đốt Trục (Axis) làm trục xoay',
        paragraphs: [
          'Đốt đội C1 không có thân đốt sống mà gồm cung trước và cung sau với hai khối bên nâng đỡ lồi cầu xương chẩm.',
          'Đốt trục C2 có mỏm răng (Dens) nhô lên khớp với hố răng của C1, được cố định bởi dây chằng ngang cực kỳ vững chắc.',
        ],
        bullets: [
          'Động mạch đốt sống chui qua các lỗ mỏm ngang từ C6 lên C1 để cấp máu cho não bộ.',
          'Gai đốt sống cổ (C2 - C6) thường chẻ đôi, riêng C7 có gai sau dài nhất (đốt sống lồi dễ sờ thấy sau gáy).',
        ],
        highlight: 'Cảnh báo: Thoát vị đĩa đệm cổ thường gây đau lan ra vai, tê ngón tay và chóng mặt do chèn ép động mạch.',
        diagramType: 'cervical',
      },
    },
    {
      id: 'atlas-p4',
      pageNum: 4,
      title: 'Đoạn Ngực (T1 - T12) & Lồng Ngực',
      category: 'GIẢI PHẪU ĐOẠN NGỰC',
      badge: 'BẢO VỆ TẠNG NỘI',
      content: {
        heading: '3. Cột sống ngực & Khớp sườn - đốt',
        subheading: 'Khung vững chắc bảo vệ tim, phổi và trung thất',
        paragraphs: [
          '12 đốt sống ngực có hố sườn trên thân đốt và mỏm ngang để khớp với chỏm và củ xương sườn.',
          'Mỏm gai các đốt ngực dài, nhọn và chúc xuôi xuống dưới như ngói lợp, hạn chế động tác ngửa nhưng bảo vệ tủy sống tối đa.',
        ],
        bullets: [
          'Biên độ vận động gập duỗi hẹp nhất so với các đoạn khác do ràng buộc của lồng ngực.',
          'Cung cấp điểm bám cho các cơ liên sườn và cơ hô hấp chính.',
        ],
        highlight: 'Ít bị thoát vị đĩa đệm nhất nhưng dễ gặp tình trạng gù lưng do sai tư thế ngồi làm việc văn phòng.',
        diagramType: 'thoracic',
      },
    },
    {
      id: 'atlas-p5',
      pageNum: 5,
      title: 'Đoạn Thắt Lưng (L1 - L5) - Trục Chịu Tải',
      category: 'GIẢI PHẪU THẮT LƯNG',
      badge: 'VÙNG NGUY CƠ CAO',
      content: {
        heading: '4. Thắt lưng: Trung tâm tải trọng cơ thể',
        subheading: 'Đốt sống to dày hình quả thận, lỗ tủy sống hình tam giác',
        paragraphs: [
          'Thân đốt sống thắt lưng có kích thước lớn nhất để gánh chịu toàn bộ trọng lượng phần trên cơ thể.',
          'Đoạn L4-L5 và L5-S1 là hai vị trí chịu áp lực cơ học cao nhất và là nơi xảy ra hơn 90% các ca thoát vị đĩa đệm.',
        ],
        bullets: [
          'Mỏm gai hình chữ nhật, nằm ngang, cho phép chọc dò tủy sống an toàn qua khoang L3-L4 hoặc L4-L5.',
          'Mỏm khớp định hướng đứng dọc, thuận lợi cho gập - duỗi nhưng hạn chế xoay.',
        ],
        highlight: 'Áp lực lên đĩa đệm L4-L5 khi ngồi gù lưng gấp 2.5 lần so với tư thế nằm ngửa thư giãn.',
        diagramType: 'lumbar',
      },
    },
    {
      id: 'atlas-p6',
      pageNum: 6,
      title: 'Xương Cùng & Khớp Cùng Chậu (SI Joint)',
      category: 'GIẢI PHẪU VÙNG CHẬU',
      badge: 'LIÊN KẾT CHI DƯỚI',
      content: {
        heading: '5. Xương cùng & Khớp cùng chậu (SI Joint)',
        subheading: 'Khối 5 đốt hợp nhất truyền lực xuống hai chi dưới',
        paragraphs: [
          'Xương cùng có hình tam giác úp ngược, khớp với hai xương cánh chậu qua khớp cùng chậu được gia cố bởi các dây chằng cực kỳ vững chắc.',
          'Viêm hoặc sai lệch khớp cùng chậu thường bị chẩn đoán nhầm với thoát vị đĩa đệm thắt lưng do cùng gây đau vùng mông và đùi.',
        ],
        bullets: [
          'Lỗ cùng trước và sau cho các nhánh thần kinh cùng đi qua tạo nên đám rối thần kinh cùng.',
          'Gai chậu sau trên (PSIS) tương ứng với hai hõm Venus ở đáy thắt lưng.',
        ],
        highlight: 'Khớp cùng chậu có biên độ vận động vi mô (2-4mm) nhưng đóng vai trò then chốt khi đi đứng và chạy nhảy.',
        diagramType: 'sacrum',
      },
    },
    {
      id: 'atlas-p7',
      pageNum: 7,
      title: 'Cơ Chế Thoát Vị & Chèn Ép Tủy',
      category: 'BỆNH HỌC LÂM SÀNG',
      badge: 'CẢNH BÁO NGUY HIỂM',
      content: {
        heading: '6. Thoát vị đĩa đệm & Hẹp ống sống',
        subheading: 'Từ rách bao xơ đến chèn ép rễ thần kinh và tủy sống',
        paragraphs: [
          'Thoát vị thể sau bên chèn ép rễ thần kinh đi ra qua lỗ ghép, gây đau tê dọc theo đường đi của dây thần kinh hông to (thần kinh tọa).',
          'Thoát vị thể trung tâm có thể chèn ép trực tiếp chùm đuôi ngựa hoặc tủy sống, gây hội chứng chùm đuôi ngựa khẩn cấp.',
        ],
        bullets: [
          'Dấu hiệu cảnh báo đỏ: Rối loạn tiểu tiện, tê vùng đáy chậu (yên ngựa), yếu liệt bàn chân.',
          'Đa số các ca thoát vị có thể tự co nhỏ hoặc tiêu biến một phần sau 6-12 tháng nhờ đại thực bào.',
        ],
        highlight: 'Khi có dấu hiệu teo cơ hoặc mất cảm giác tiến triển, cần chụp MRI và can thiệp kịp thời.',
        diagramType: 'herniation',
      },
    },
    {
      id: 'atlas-p8',
      pageNum: 8,
      title: 'Bìa Sau & Bản Quyền Xuất Bản',
      imageUrl: '/documents/covers/back_cover_atlas_y_khoa_toan_dien.png',
    },
  ];
}
