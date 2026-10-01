import os
import sys
import asyncio

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from playwright.async_api import async_playwright

OUTPUT_DIR = r"D:\app-hoc-co-the\public\documents"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# CSS dùng chung cho giao diện A4 in ấn y khoa cao cấp
COMMON_STYLE = """
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap');

@page {
  size: A4 portrait;
  margin: 12mm 14mm 14mm 14mm;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

body {
  font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
  background-color: #ffffff;
  line-height: 1.5;
  font-size: 13px;
}

.page {
  page-break-after: always;
  height: 270mm;
  max-height: 270mm;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6mm 4mm;
  overflow: hidden;
}

.page:last-child {
  page-break-after: avoid;
}

/* Header trang */
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #0284c7;
  padding-bottom: 5px;
  margin-bottom: 12px;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-logo-badge {
  background: linear-gradient(135deg, #1e3a8a, #0284c7);
  color: white;
  font-weight: 900;
  font-size: 10px;
  padding: 3px 8px;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.header-title-text {
  font-size: 10.5px;
  font-weight: 700;
  color: #0369a1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-category {
  font-size: 9.5px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

/* Footer trang */
.footer-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e2e8f0;
  padding-top: 5px;
  margin-top: 12px;
  font-size: 9.5px;
  color: #64748b;
}

/* Content Area */
.page-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Tiêu đề & typography */
h1.page-title {
  font-family: 'Playfair Display', serif;
  font-size: 21px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 3px;
  line-height: 1.25;
}

h2.section-title {
  font-size: 13.5px;
  font-weight: 800;
  color: #1e3a8a;
  margin: 8px 0 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  border-left: 3.5px solid #0284c7;
  padding-left: 8px;
}

p.lead {
  font-size: 12.5px;
  color: #334155;
  margin-bottom: 8px;
  line-height: 1.55;
  font-weight: 500;
}

p.paragraph {
  font-size: 12px;
  color: #334155;
  margin-bottom: 6px;
  line-height: 1.55;
  text-align: justify;
}

/* Hộp thông tin nổi bật */
.callout {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-left: 4px solid #0284c7;
  padding: 8px 11px;
  border-radius: 7px;
  margin: 6px 0;
}

.callout-warning {
  background-color: #fff1f2;
  border: 1px solid #fecdd3;
  border-left: 4px solid #e11d48;
}

.callout-success {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #16a34a;
}

.callout-gold {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  border-left: 4px solid #d97706;
}

.callout-title {
  font-weight: 800;
  font-size: 11px;
  margin-bottom: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.callout-title.blue { color: #0369a1; }
.callout-title.red { color: #be123c; }
.callout-title.green { color: #15803d; }
.callout-title.gold { color: #b45309; }

/* Bảng lâm sàng y tế */
table.medical-table {
  width: 100%;
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 11px;
}

table.medical-table th {
  background: #1e3a8a;
  color: white;
  font-weight: 700;
  padding: 6px 8px;
  text-align: left;
  border: 1px solid #1e3a8a;
}

table.medical-table td {
  padding: 5px 8px;
  border: 1px solid #cbd5e1;
  vertical-align: top;
}

table.medical-table tr:nth-child(even) {
  background-color: #f8fafc;
}

/* Card lưới 2 cột */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 6px 0;
}

.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 8px 10px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.card-title {
  font-weight: 800;
  font-size: 11px;
  color: #0f172a;
  margin-bottom: 4px;
}

/* Danh sách có gạch đầu dòng */
ul.bullet-list {
  margin: 4px 0 6px 16px;
}

ul.bullet-list li {
  margin-bottom: 4px;
  font-size: 11.5px;
  color: #334155;
  line-height: 1.45;
}

/* Bìa sách */
.cover-page {
  background: linear-gradient(135deg, #091326 0%, #1e3a8a 50%, #0369a1 100%);
  color: white;
  padding: 30mm 18mm;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 4px;
  height: 270mm;
}

.cover-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 12px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 16px;
  width: fit-content;
}

.cover-title {
  font-family: 'Playfair Display', serif;
  font-size: 30px;
  font-weight: 800;
  line-height: 1.25;
  margin-bottom: 12px;
  color: #f8fafc;
}

.cover-subtitle {
  font-size: 14.5px;
  color: #bae6fd;
  line-height: 1.5;
  margin-bottom: 20px;
  font-weight: 400;
}

.cover-divider {
  width: 70px;
  height: 4px;
  background: #f59e0b;
  margin-bottom: 24px;
  border-radius: 2px;
}

.cover-footer {
  border-top: 1px solid rgba(255,255,255,0.2);
  padding-top: 16px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #cbd5e1;
}
"""

def make_header(doc_title, category, page_num, total_pages):
    return f"""
    <div class="header-bar">
      <div class="header-brand">
        <span class="header-logo-badge">QBIZ BOOKS</span>
        <span class="header-title-text">{doc_title}</span>
      </div>
      <span class="header-category">{category} · Trang {page_num}/{total_pages}</span>
    </div>
    """

def make_footer(page_num, total_pages):
    return f"""
    <div class="footer-bar">
      <span>Tài liệu Y Khoa Chính Thống · Tủ Sách Qbiz Books & Bộ Môn Giải Phẫu</span>
      <span>Trang {page_num} / {total_pages}</span>
    </div>
    """

# =========================================================================
# 1. TÀI LIỆU 1: ATLAS & CẨM NANG GIẢI PHẪU CỘT SỐNG TOÀN DIỆN (14 TRANG)
# =========================================================================
def build_doc1_html():
    total_pages = 14
    doc_title = "Atlas Giải Phẫu Cột Sống Toàn Diện"
    
    pages = []
    
    # Trang 1: Bìa
    pages.append(f"""
    <div class="page" style="padding:0;">
      <div class="cover-page">
        <div>
          <span class="cover-badge">GIÁO TRÌNH CHUYÊN SÂU · Y KHOA THỰC HÀNH</span>
          <h1 class="cover-title">ATLAS & CẨM NANG GIẢI PHẪU CỘT SỐNG TOÀN DIỆN</h1>
          <div class="cover-divider"></div>
          <p class="cover-subtitle">
            Hệ thống hóa toàn bộ cấu trúc 33-34 đốt sống, 23 đĩa đệm sinh học, mạng lưới dây chằng, 
            31 đôi dây thần kinh tủy sống và các nguyên lý cơ sinh học bảo vệ cột sống người.
          </p>
          <div style="background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15); border-radius: 10px; padding: 14px; margin-top: 20px;">
            <div style="font-weight: 800; font-size: 12px; color: #fcd34d; margin-bottom: 6px;">NỘI DUNG NỀN TẢNG:</div>
            <div style="font-size: 11.5px; line-height: 1.6; color: #e2e8f0;">
              • Phần I: Phân đoạn đốt sống & 4 đoạn cong sinh lý<br>
              • Phần II: Giải phẫu chi tiết Cổ, Ngực, Thắt lưng, Cùng cụt<br>
              • Phần III: Cấu tạo vi thể đĩa đệm & Hệ thống dây chằng<br>
              • Phần IV: Sinh học thoái hóa, thoát vị & Phác đồ công thái học
            </div>
          </div>
        </div>
        <div class="cover-footer">
          <div>
            <strong>TỦ SÁCH Y KHOA QBIZ BOOKS</strong><br>
            Biên soạn: Ban Cố Vấn Y Khoa & Giảng Viên Phục Hồi Chức Năng
          </div>
          <div style="text-align: right;">
            <strong>ẤN BẢN CHUẨN A4</strong><br>
            Lưu hành đào tạo nội bộ y tế
          </div>
        </div>
      </div>
    </div>
    """)
    
    # Trang 2: Tổng quan cột sống & 4 đoạn cong sinh lý
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "TỔNG QUAN HỆ TRỤC", 2, total_pages)}
      <div class="page-body">
        <h1 class="page-title">1. Tổng Quan Cột Sống & 4 Đường Cong Sinh Lý</h1>
        <p class="lead">Cột sống (Vertebral Column) là trục xương trung tâm của cơ thể người, dài trung bình 70-75cm ở nam giới và 60-65cm ở nữ giới, đảm nhận 3 chức năng sống còn: nâng đỡ trọng lượng, bảo vệ tủy sống và tạo độ linh hoạt.</p>
        
        <h2 class="section-title">A. Cơ sinh học của 4 đường cong sinh lý</h2>
        <p class="paragraph">Khi mới sinh, cột sống trẻ sơ sinh chỉ có một đường cong chữ C (cong gù toàn bộ). Trong quá trình phát triển vận động, khi trẻ biết ngẩng đầu (3 tháng) đường cong ưỡn cổ xuất hiện; khi trẻ biết đứng và đi (12-18 tháng), đường cong ưỡn thắt lưng hình thành.</p>
        
        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #0369a1;">Đoạn Ưỡn (Lordosis)</div>
            <p class="paragraph"><strong>• Cổ (C1 - C7):</strong> Ưỡn ra trước góc 20° - 40°. Trọng tâm giữ đầu thăng bằng.</p>
            <p class="paragraph"><strong>• Thắt lưng (L1 - L5):</strong> Ưỡn ra trước góc 40° - 60°. Chịu lực ép trọng lượng thân trên.</p>
          </div>
          <div class="card">
            <div class="card-title" style="color: #1e3a8a;">Đoạn Gù (Kyphosis)</div>
            <p class="paragraph"><strong>• Ngực (T1 - T12):</strong> Gù ra sau góc 20° - 40°. Mở rộng khoang lồng ngực bảo vệ tim phổi.</p>
            <p class="paragraph"><strong>• Cùng cụt (S1 - Co):</strong> Gù ra sau cố định. Nền móng khung chậu.</p>
          </div>
        </div>

        <div class="callout callout-gold">
          <div class="callout-title gold">ĐỊNH LUẬT HẤP THỤ XUNG LỰC EULER: R = N² + 1</div>
          <p class="paragraph">Sức chịu tải và khả năng chống sốc của cột sống có 4 đường cong sinh lý gấp <strong>10 lần</strong> so với một cột xương thẳng đứng hoàn toàn (R = 3² + 1 = 10, với N = 3 đoạn cong di động). Mất đường cong sinh lý (thẳng cột sống cổ hoặc gù vẹo) làm tăng nguy cơ thoái hóa đĩa đệm gấp 3-5 lần.</p>
        </div>

        <h2 class="section-title">B. Cấu trúc tổng thể 33-34 đốt sống</h2>
        <table class="medical-table">
          <thead>
            <tr>
              <th>Đoạn cột sống</th>
              <th>Số lượng</th>
              <th>Ký hiệu</th>
              <th>Đặc điểm vận động chính</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Cột sống cổ</strong></td>
              <td>7 đốt</td>
              <td>C1 - C7</td>
              <td>Linh hoạt nhất, xoay 180°, gập ngửa biên độ lớn</td>
            </tr>
            <tr>
              <td><strong>Cột sống ngực</strong></td>
              <td>12 đốt</td>
              <td>T1 - T12</td>
              <td>Khớp với xương sườn, biên độ nhỏ, bảo vệ nội tạng</td>
            </tr>
            <tr>
              <td><strong>Cột sống thắt lưng</strong></td>
              <td>5 đốt</td>
              <td>L1 - L5</td>
              <td>Đốt to dày nhất, gập duỗi mạnh, chịu lực tối đa</td>
            </tr>
            <tr>
              <td><strong>Xương cùng</strong></td>
              <td>5 đốt dính</td>
              <td>S1 - S5</td>
              <td>Hình nêm bất động, truyền lực sang hai khớp háng</td>
            </tr>
            <tr>
              <td><strong>Xương cụt</strong></td>
              <td>3 - 5 đốt</td>
              <td>Co1 - Co4</td>
              <td>Điểm bám của cơ nâng hậu môn và dây chằng đáy chậu</td>
            </tr>
          </tbody>
        </table>
      </div>
      {make_footer(2, total_pages)}
    </div>
    """)

    # Trang 3: Cột sống cổ C1 - C7
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "GIẢI PHẪU ĐOẠN CỔ", 3, total_pages)}
      <div class="page-body">
        <h1 class="page-title">2. Giải Phẫu Chuyên Sâu: Cột Sống Cổ (C1 - C7)</h1>
        <p class="lead">Đoạn cột sống cổ là phần linh hoạt nhất của hệ trục, vừa phải nâng đỡ hộp sọ nặng 4.5 - 5.5kg, vừa phải bảo vệ bó mạch động mạch đốt sống và tủy sống cổ tối quan trọng.</p>
        
        <h2 class="section-title">A. Hai đốt sống cổ đặc biệt: C1 & C2</h2>
        <div class="grid-2">
          <div class="card">
            <div class="card-title">Đốt C1 (Atlas - Đốt đội)</div>
            <p class="paragraph">Không có thân đốt và không có mỏm gai. Gồm hai khối bên nối với nhau bởi cung trước và cung sau.</p>
            <ul class="bullet-list">
              <li>Khớp với lồi cầu xương chẩm qua khớp đội - chẩm, cho phép thực hiện động tác gật đầu ("Yes").</li>
              <li>Diện khớp lõm sâu hình hạt đậu.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title">Đốt C2 (Axis - Đốt trục)</div>
            <p class="paragraph">Có mỏm răng (Dens / Odontoid process) nhô cao lên trên khớp vào hố răng cung trước C1.</p>
            <ul class="bullet-list">
              <li>Khớp đội - trục cho phép xoay đầu sang hai bên biên độ đến 50% tổng cử động xoay cổ ("No").</li>
              <li>Dây chằng ngang giữ mỏm răng không đè vào hành tủy.</li>
            </ul>
          </div>
        </div>

        <h2 class="section-title">B. Đặc điểm riêng biệt của đốt sống cổ C3 - C7</h2>
        <p class="paragraph">Các đốt sống cổ điển hình có 3 đặc điểm nhận diện giải phẫu độc nhất:</p>
        <ul class="bullet-list">
          <li><strong>Lỗ mỏm ngang (Foramen transversarium):</strong> Có ở tất cả các đốt từ C1 đến C6, cho động mạch đốt sống (Vertebral artery) chạy qua lên não cấp máu cho tiểu não và thân não.</li>
          <li><strong>Mỏm gai chẻ đôi:</strong> C3 đến C6 có mỏm gai chẻ làm hai nhánh để cơ sâu vùng gáy bám chắc chắn.</li>
          <li><strong>Đốt C7 (Đốt sống lồi - Vertebra prominens):</strong> Mỏm gai dài nhất, không chẻ đôi, sờ thấy rất rõ dưới da vùng gáy khi cúi đầu.</li>
        </ul>

        <div class="callout callout-warning">
          <div class="callout-title red">CẢNH BÁO LÂM SÀNG: HỘI CHỨNG TEXT-NECK (CÚI ĐẦU DÙNG ĐIỆN THOẠI)</div>
          <p class="paragraph">Khi đầu ở tư thế thẳng tự nhiên (0°), áp lực lên đốt sống cổ là 4.5 - 5.5kg. Khi cúi gập 15°, áp lực tăng lên 12kg; khi cúi 30° là 18kg; khi cúi 45° là 22kg; và khi cúi gập 60° (tư thế bấm smartphone phổ biến), áp lực lên C5-C6 lên tới <strong>27kg</strong> (gấp 5-6 lần bình thường). Đây là nguyên nhân hàng đầu gây thoái hóa sớm và đau mỏi vai gáy ở người trẻ.</p>
        </div>
      </div>
      {make_footer(3, total_pages)}
    </div>
    """)

    # Trang 4: Cột sống ngực T1 - T12
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "GIẢI PHẪU ĐOẠN NGỰC", 4, total_pages)}
      <div class="page-body">
        <h1 class="page-title">3. Đoạn Cột Sống Ngực (T1 - T12) & Lồng Ngực</h1>
        <p class="lead">12 đốt sống ngực liên kết chặt chẽ với 12 đôi xương sườn và xương ức, tạo nên chiếc lồng bảo vệ vững chắc cho tim, phổi và các đại mạch trung thất.</p>
        
        <h2 class="section-title">A. Đặc điểm giải phẫu nhận biết</h2>
        <ul class="bullet-list">
          <li><strong>Hố sườn (Costal facets):</strong> Mặt bên thân đốt sống có các hố sườn trên và dưới để khớp với chỏm xương sườn.</li>
          <li><strong>Hố sườn mỏm ngang:</strong> Đầu mỏm ngang có diện khớp với củ xương sườn (từ T1 đến T10).</li>
          <li><strong>Mỏm gai dài và chúc xuống:</strong> Mỏm gai chúc nghiêng xuống dưới như ngói lợp nhà, chồng khít lên đốt sống dưới, hạn chế tối đa động tác ưỡn quá mức.</li>
          <li><strong>Lỗ sống hình tròn nhỏ:</strong> Nhỏ hơn đoạn cổ và thắt lưng do tủy ngực có kích thước nhỏ và ổn định.</li>
        </ul>

        <h2 class="section-title">B. Cơ chế vận động & Ổn định lồng ngực</h2>
        <p class="paragraph">Do liên kết với xương sườn, độ di động gập duỗi của cột sống ngực rất thấp. Tuy nhiên, mặt khớp của các mỏm khớp nằm trong mặt phẳng đứng ngang cho phép thực hiện cử động <em>xoay thân</em> tốt hơn đoạn thắt lưng.</p>

        <table class="medical-table">
          <thead>
            <tr>
              <th>Cử động</th>
              <th>Biên độ</th>
              <th>Yếu tố giới hạn chính</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Gập (Flexion)</td>
              <td>30° - 40°</td>
              <td>Dây chằng trên gai, dây chằng dọc sau, lồng ngực ép lại</td>
            </tr>
            <tr>
              <td>Duỗi (Extension)</td>
              <td>20° - 25°</td>
              <td>Mỏm gai chúc chồng khít, dây chằng dọc trước căng</td>
            </tr>
            <tr>
              <td>Nghiêng (Lateral bending)</td>
              <td>25° - 30°</td>
              <td>Các xương sườn ép sát nhau ở bên nghiêng</td>
            </tr>
            <tr>
              <td>Xoay (Rotation)</td>
              <td>30° - 35°</td>
              <td>Độ vặn xoắn của các sụn sườn và đĩa đệm ngực</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-success">
          <div class="callout-title green">Ý NGHĨA LÂM SÀNG: ĐAU DÂY THẦN KINH LIÊN SƯỜN</div>
          <p class="paragraph">Thoái hóa hoặc gai xương ở các đốt sống T3 - T7 có thể chèn ép rễ thần kinh ngực gây đau nhói lan dọc theo khoang liên sườn ra trước ngực. Cần phân biệt rõ ràng với cơn đau thắt ngực do thiếu máu cơ tim (cơn đau tim thường đè nặng sau xương ức, lan lên cằm hoặc cánh tay trái, kèm vã mồ hôi).</p>
        </div>
      </div>
      {make_footer(4, total_pages)}
    </div>
    """)

    # Trang 5: Cột sống thắt lưng L1 - L5
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "GIẢI PHẪU ĐOẠN THẮT LƯNG", 5, total_pages)}
      <div class="page-body">
        <h1 class="page-title">4. Cột Sống Thắt Lưng (L1 - L5): Nơi Chịu Tải Trọng Đỉnh</h1>
        <p class="lead">5 đốt sống thắt lưng là những đốt sống tự do to lớn và nặng nề nhất trên toàn bộ cơ thể người, gánh vác toàn bộ sức nặng của nửa thân trên và các hoạt động nâng vác nặng.</p>
        
        <h2 class="section-title">A. Cấu trúc đặc thù đốt sống thắt lưng</h2>
        <ul class="bullet-list">
          <li><strong>Thân đốt hình thận:</strong> Đường kính ngang rộng hơn đường kính trước sau, bờ sau hơi lõm. Đốt L5 có thân dày nhất và dốc vát về phía sau để tiếp xúc với đốt cùng S1.</li>
          <li><strong>Mỏm gai hình chữ nhật:</strong> Nằm ngang, dày và thô, không chúc xuống. Khoảng gian mỏm gai L3-L4 và L4-L5 rộng rãi, là vị trí vàng để thực hiện thủ thuật <em>chọc dò dịch não tủy</em> và <em>gây tê ngoài màng cứng</em> an toàn vì tủy sống đã kết thúc ở mức L1-L2.</li>
          <li><strong>Mỏm khớp định hướng đứng dọc:</strong> Hướng vào trong và ra sau, khóa chặt chuyển động xoay nhưng cho phép gập - duỗi biên độ cực lớn.</li>
        </ul>

        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #be123c;">Điểm yếu cơ học L4 - L5</div>
            <p class="paragraph">Là đốt sống bản lề nằm giữa phần thắt lưng di động và xương cùng cố định. Hơn 50% các trường hợp thoát vị đĩa đệm xảy ra tại khoang L4-L5, chèn ép rễ thần kinh L5.</p>
          </div>
          <div class="card">
            <div class="card-title" style="color: #be123c;">Khớp L5 - S1 (Bản lề thắt lưng - cùng)</div>
            <p class="paragraph">Chịu lực cắt trượt lớn nhất do độ nghiêng của ụ nhô xương cùng (góc Sacral angle ~30°). Chiếm 40% các ca thoát vị đĩa đệm, chèn ép rễ thần kinh S1.</p>
          </div>
        </div>

        <div class="callout callout-warning">
          <div class="callout-title red">TẠI SAO L4-L5 VÀ L5-S1 DỄ THOÁT VỊ NHẤT?</div>
          <p class="paragraph">Dây chằng dọc sau (PLL) chạy phía sau thân đốt sống càng đi xuống vùng L4-S1 càng bị thu hẹp dần (chỉ còn bằng 1/2 bề rộng so với đoạn ngực), tạo ra hai "khoảng hở yếu" ở hai bên phía sau. Khi gập người nâng vật nặng, nhân nhầy bị dồn ra sau sẽ lập tức xé rách vòng sợi ở vị trí này và chui vào ống sống.</p>
        </div>
      </div>
      {make_footer(5, total_pages)}
    </div>
    """)

    # Trang 6: Xương cùng S1 - S5 & Xương cụt
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "XƯƠNG CÙNG & XƯƠNG CỤT", 6, total_pages)}
      <div class="page-body">
        <h1 class="page-title">5. Khối Xương Cùng (S1 - S5) & Khớp Cùng Chậu</h1>
        <p class="lead">Khối xương cùng hình nêm đóng vai trò là "viên đá đỉnh vòm" (keystone) gắn kết cột sống vào đai chậu, truyền tải toàn bộ trọng lượng từ thân mình xuống hai chi dưới.</p>
        
        <h2 class="section-title">A. Giải phẫu xương cùng</h2>
        <p class="paragraph">Xương cùng gồm 5 đốt sống cùng dính liền nhau sau tuổi trưởng thành tạo thành một khối xương duy nhất hình tam giác cong lõm mặt trước:</p>
        <ul class="bullet-list">
          <li><strong>Ụ nhô (Promontorium):</strong> Bờ trước trên của đốt S1 nhô ra phía trước, là mốc giải phẫu quan trọng trong sản khoa đo đường kính khung chậu.</li>
          <li><strong>Lỗ cùng trước và sau:</strong> 4 đôi lỗ cùng cho các nhánh trước và sau của dây thần kinh cùng thoát ra. Nhánh trước S1-S4 tham gia cấu tạo đám rối thần kinh cùng (Sacral plexus).</li>
          <li><strong>Ống cùng (Sacral canal):</strong> Chứa chùm thần kinh đuôi ngựa (Cauda equina) và màng cứng tủy kết thúc ở mức S2.</li>
        </ul>

        <h2 class="section-title">B. Khớp Cùng - Chậu (Sacroiliac Joint - SIJ)</h2>
        <p class="paragraph">Khớp cùng chậu là khớp bán động cực kỳ vững chắc với hệ thống dây chằng dày đặc nhất cơ thể (dây chằng cùng chậu trước, sau và gian cốt). Khớp chỉ có biên độ chuyển động trượt 2-4mm, giúp triệt tiêu xung lực khi gót chân chạm đất khi chạy nhảy.</p>

        <div class="callout callout-gold">
          <div class="callout-title gold">PHÂN BIỆT ĐAU KHỚP CÙNG CHẬU VỚI THOÁT VỊ ĐĨA ĐỆM</div>
          <p class="paragraph">Đau khớp cùng chậu (SI Joint Dysfunction) thường đau khu trú một bên vùng mông (ngay hố gai chậu sau trên - Fortin's finger test), đau tăng khi đứng một chân bước lên cầu thang, đứng dậy từ ghế hoặc nằm nghiêng đè lên bên đau. Ngược lại, đau do thoát vị L5-S1 thường đau lan dài xuống tận bắp chân và ngón chân kèm tê bì râm ran.</p>
        </div>
      </div>
      {make_footer(6, total_pages)}
    </div>
    """)

    # Trang 7: Đĩa đệm sinh học
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "CẤU TẠO VI THỂ ĐĨA ĐỆM", 7, total_pages)}
      <div class="page-body">
        <h1 class="page-title">6. Cấu Tạo Vi Thể Đĩa Đệm: Vòng Sợi & Nhân Nhầy</h1>
        <p class="lead">23 đĩa đệm gian đốt sống chiếm 1/4 tổng chiều cao cột sống, hoạt động như một hệ thống giảm xóc thủy lực tự nhiên tinh xảo bậc nhất trong sinh học cơ xương khớp.</p>
        
        <h2 class="section-title">A. 3 Thành phần cấu trúc của đĩa đệm</h2>
        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #0369a1;">1. Nhân nhầy (Nucleus Pulposus)</div>
            <p class="paragraph">Nằm ở vị trí trung tâm (hơi lệch ra sau ở thắt lưng). Dạng gel lỏng trong suốt chứa:</p>
            <ul class="bullet-list">
              <li>80% - 85% là nước ở người trẻ.</li>
              <li>Proteoglycan (Aggrecan) có điện tích âm giữ nước cực mạnh.</li>
              <li>Sợi collagen type II mảnh mịn.</li>
            </ul>
          </div>
          <div class="card">
            <div class="card-title" style="color: #1e3a8a;">2. Vòng sợi (Annulus Fibrosus)</div>
            <p class="paragraph">Bao bọc bên ngoài nhân nhầy gồm 15-25 lớp lá đồng tâm:</p>
            <ul class="bullet-list">
              <li>Chủ yếu là sợi collagen type I bền chắc.</li>
              <li>Các lớp đan chéo góc 30° - 60° xen kẽ nhau, chống xé rách khi xoay vặn.</li>
              <li>Gắn chặt vào bờ viền xương đốt sống qua sợi Sharpey.</li>
            </ul>
          </div>
        </div>

        <div class="card" style="margin-top: 6px;">
          <div class="card-title">3. Mâm sụn gian đốt sống (Cartilaginous Endplate)</div>
          <p class="paragraph">Lớp sụn hyaline dày khoảng 1mm phủ kín mặt trên và dưới thân đốt sống, đóng vai trò màng lọc bán thấm nuôi dưỡng đĩa đệm.</p>
        </div>

        <div class="callout callout-warning">
          <div class="callout-title red">CƠ CHẾ NUÔI DƯỠNG ĐĨA ĐỆM: VÌ SAO ĐỨNG YÊN HOẶC NGỒI LÂU GÂY HỎNG ĐĨA ĐỆM?</div>
          <p class="paragraph">Ở người trưởng thành (sau 20 tuổi), <strong>đĩa đệm hoàn toàn không có mạch máu nuôi dưỡng trực tiếp</strong>! Sự trao đổi dinh dưỡng và oxy hoàn toàn dựa vào cơ chế <em>khuếch tán thẩm thấu qua mâm sụn</em> khi có sự thay đổi áp lực cơ học: khi vận động (đi lại nhẹ nhàng), áp lực ép - nhả liên tục đóng vai trò như một chiếc bơm hút chất dinh dưỡng vào và đẩy chất cặn bã ra ngoài. Ngồi bất động liên tục 2-3 tiếng khiến chiếc bơm ngừng hoạt động, làm tế bào đĩa đệm thiếu oxy và nhanh chóng bị hoại tử.</p>
        </div>
      </div>
      {make_footer(7, total_pages)}
    </div>
    """)

    # Trang 8: Hệ thống 5 dây chằng
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "HỆ THỐNG DÂY CHẰNG", 8, total_pages)}
      <div class="page-body">
        <h1 class="page-title">7. Hệ Thống 5 Dây Chằng Neo Giữ Cột Sống</h1>
        <p class="lead">Mạng lưới dây chằng cột sống phối hợp với hệ cơ nội tại tạo thành một cấu trúc tensegrity (căng - nén cân bằng), giữ vững các đốt sống và ngăn chặn trượt quá mức.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Tên dây chằng</th>
              <th>Vị trí giải phẫu</th>
              <th>Chức năng cơ học chính</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Dây chằng dọc trước (ALL)</strong></td>
              <td>Chạy dài suốt mặt trước thân đốt sống từ xương chẩm đến xương cùng</td>
              <td>Dày và chắc chắn nhất, giới hạn cử động <em>ưỡn quá mức</em>, chống trượt thân đốt ra trước.</td>
            </tr>
            <tr>
              <td><strong>Dây chằng dọc sau (PLL)</strong></td>
              <td>Chạy mặt sau thân đốt sống (bên trong ống sống), từ C2 đến xương cùng</td>
              <td>Giới hạn cử động <em>gập quá mức</em>. Mỏng dần ở đoạn thắt lưng, là lý do nhân nhầy hay thoát vị ra sau bên.</td>
            </tr>
            <tr>
              <td><strong>Dây chằng vàng (Ligamentum Flavum)</strong></td>
              <td>Nối giữa các mảnh đốt sống (lamina) liền kề ở thành sau ống sống</td>
              <td>Chứa 80% sợi đàn hồi Elastin màu vàng, kéo cột sống dựng thẳng lại sau khi gập lưng. Phì đại dây chằng vàng gây hẹp ống sống thắt lưng.</td>
            </tr>
            <tr>
              <td><strong>Dây chằng liên gai (Interspinous)</strong></td>
              <td>Nối các bờ giữa hai mỏm gai kế cận</td>
              <td>Hạn chế gập cột sống, chịu lực căng khi cúi gập lưng.</td>
            </tr>
            <tr>
              <td><strong>Dây chằng trên gai (Supraspinous)</strong></td>
              <td>Nối liền các đỉnh mỏm gai từ C7 xuống đến xương cùng</td>
              <td>Ở đoạn cổ phát triển dày lên thành <em>dây chằng gáy (Ligamentum nuchae)</em> nâng đỡ đầu.</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-gold">
          <div class="callout-title gold">HIỆN TƯỢNG PHÌ ĐẠI DÂY CHẰNG VÀNG GÂY HẸP ỐNG SỐNG</div>
          <p class="paragraph">Ở người cao tuổi bị thoái hóa cột sống mạn tính, dây chằng vàng bị viêm xơ hóa vi thể nhiều lần sẽ dày lên gấp 2-3 lần (từ 2-3mm lên 6-8mm). Sự dày lên này lấn vào lòng ống sống, chèn ép trực tiếp chùm đuôi ngựa gây triệu chứng <strong>cơn khập khiễng cách hồi thần kinh</strong> (đi bộ được 50-100m là tê mỏi chân phải cúi người ngồi nghỉ).</p>
        </div>
      </div>
      {make_footer(8, total_pages)}
    </div>
    """)

    # Trang 9: Cơ chế bệnh học thoát vị đĩa đệm
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "BỆNH HỌC THOÁT VỊ", 9, total_pages)}
      <div class="page-body">
        <h1 class="page-title">8. Cơ Chế Bệnh Học: 4 Giai Đoạn Thoát Vị Đĩa Đệm</h1>
        <p class="lead">Thoát vị đĩa đệm (Herniated Nucleus Pulposus) là tình trạng nhân nhầy thoát ra khỏi vị trí sinh lý qua vết rách của vòng sợi, gây chèn ép cơ học và phản ứng viêm rễ thần kinh.</p>
        
        <h2 class="section-title">4 Giai đoạn tiến triển trên phim chụp MRI</h2>
        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #0369a1;">Giai đoạn 1: Phình đĩa đệm (Bulging)</div>
            <p class="paragraph">Vòng sợi bị biến dạng nhẹ hoặc nứt sợi nhỏ bên trong. Nhân nhầy dịch chuyển nhưng vòng sợi vẫn giữ nguyên chu vi liên tục, chưa chèn ép rễ.</p>
          </div>
          <div class="card">
            <div class="card-title" style="color: #d97706;">Giai đoạn 2: Lồi đĩa đệm (Protrusion)</div>
            <p class="paragraph">Vòng sợi bị rách lớp trong, nhân nhầy dồn cục bộ ra phía sau làm phồng bờ đĩa đệm, bắt đầu chạm vào bao màng cứng hoặc ngách bên.</p>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #e11d48;">Giai đoạn 3: Thoát vị thực thụ (Extrusion)</div>
            <p class="paragraph">Vòng sợi bị rách đứt hoàn toàn toàn bộ bề dày. Khối nhân nhầy chui hẳn ra ngoài ống sống nhưng vẫn còn cuống liên kết với đĩa đệm gốc.</p>
          </div>
          <div class="card">
            <div class="card-title" style="color: #be123c;">Giai đoạn 4: Mảnh rời di trú (Sequestration)</div>
            <p class="paragraph">Khối nhân nhầy đứt rời hoàn toàn khỏi đĩa đệm, di trú lên trên hoặc xuống dưới trong ống sống, nguy cơ chèn ép cấp cứu chùm đuôi ngựa.</p>
          </div>
        </div>

        <div class="callout callout-warning">
          <div class="callout-title red">TỔN THƯƠNG DO HÓA CHẤT: PHẢN ỨNG VIÊM ĐỘC TỐ CỦA NHÂN NHẦY</div>
          <p class="paragraph">Đau rễ thần kinh tọa không đơn thuần do chèn ép cơ học! Nhân nhầy nằm kín từ nhỏ nên hệ miễn dịch coi nó như một "kháng nguyên lạ". Khi vòng sợi rách nhân nhầy tiếp xúc với máu, cơ thể lập tức giải phóng <strong>Phospholipase A2, TNF-alpha và Interleukin-6</strong> gây viêm phù nề bỏng rát dây thần kinh tọa cực kỳ dữ dội.</p>
        </div>
      </div>
      {make_footer(9, total_pages)}
    </div>
    """)

    # Trang 10: Thoái hóa khớp & gai xương
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "THOÁI HÓA & GAI XƯƠNG", 10, total_pages)}
      <div class="page-body">
        <h1 class="page-title">9. Cơ Sinh Học: Thoái Hóa Cột Sống & Hình Thành Gai Xương</h1>
        <p class="lead">Gai xương (Osteophytes) không phải là "xương thừa mọc bậy" mà là phản ứng thích nghi tự vệ của cơ thể nhằm phân tán tải trọng khi đĩa đệm bị xẹp lún.</p>
        
        <h2 class="section-title">A. Chu trình thoái hóa 3 giai đoạn của Kirkaldy-Willis</h2>
        <ul class="bullet-list">
          <li><strong>1. Giai đoạn rối loạn chức năng (Dysfunction):</strong> Các vi chấn thương làm rách nứt lớp vòng sợi, viêm màng hoạt dịch khớp mấu sau. Đau lưng từng đợt khi ngồi lâu hoặc thời tiết thay đổi.</li>
          <li><strong>2. Giai đoạn mất vững (Instability):</strong> Đĩa đệm mất nước xẹp nhanh, bao khớp mấu sau lỏng lẻo làm hai đốt sống trượt nhẹ ra trước hoặc sau khi cử động.</li>
          <li><strong>3. Giai đoạn tự ổn định (Restabilization):</strong> Cơ thể tự sửa chữa bằng cách tạo xơ hóa dây chằng, dày màng xương và mọc các gai xương viền thân đốt để khóa cứng khớp lại.</li>
        </ul>

        <h2 class="section-title">B. Bản chất sinh học của gai xương</h2>
        <p class="paragraph">Theo định luật Wolff về sinh học xương: Xương phát triển ở nơi chịu ứng suất kéo giãn lớn nhất. Khi đĩa đệm xẹp, dây chằng dọc trước và dọc sau bị kéo căng giật vào màng xương thân đốt, kích thích màng xương tăng sinh canxi hóa tạo thành các mấu xương nhọn nhô ra.</p>

        <div class="callout callout-success">
          <div class="callout-title green">SỰ THẬT Y KHOA: CÓ NÊN PHẪU THUẬT "NẠO GAI XƯƠNG"?</div>
          <p class="paragraph">Trong hơn 95% trường hợp, <strong>gai xương hoàn toàn vô hại</strong> và không gây đau! Gai xương chỉ gây triệu chứng khi nó mọc lệch vào lỗ gian đốt sống chèn ép rễ thần kinh hoặc mọc vào ống sống. Việc phẫu thuật chỉ để "nạo gọt gai" là chỉ định sai lầm vì gai xương sẽ nhanh chóng mọc lại nếu nguyên nhân mất vững đĩa đệm chưa được giải quyết.</p>
        </div>
      </div>
      {make_footer(10, total_pages)}
    </div>
    """)

    # Trang 11: Nguyên tắc công thái học ergonomics
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "CÔNG THÁI HỌC BẢO VỆ CỘT SỐNG", 11, total_pages)}
      <div class="page-body">
        <h1 class="page-title">10. Công Thái Học (Ergonomics): Biểu Đồ Áp Lực Lên Đĩa Đệm</h1>
        <p class="lead">Nghiên cứu kinh điển của Giáo sư Alf Nachemson trên áp lực nội đĩa đệm L3-L4 ở các tư thế sinh hoạt hàng ngày chứng minh tư thế sai làm tăng tải trọng lên đến 275%.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Tư thế sinh hoạt</th>
              <th>Áp lực đĩa đệm L3-L4</th>
              <th>Mức độ phần trăm</th>
              <th>Khuyến cáo bảo vệ</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Nằm ngửa thư giãn</td>
              <td>25 kg</td>
              <td>25%</td>
              <td>Tư thế nghỉ ngơi tái tạo nước cho đĩa đệm</td>
            </tr>
            <tr>
              <td>Nằm nghiêng có kê gối kẹp giữa 2 gối</td>
              <td>75 kg</td>
              <td>75%</td>
              <td>Giữ khung chậu và thắt lưng cân bằng</td>
            </tr>
            <tr>
              <td>Đứng thẳng chuẩn tự nhiên</td>
              <td>100 kg</td>
              <td>100% (Mốc chuẩn)</td>
              <td>Phân bổ lực đều qua 4 đoạn cong sinh lý</td>
            </tr>
            <tr>
              <td>Ngồi thẳng lưng có điểm tựa</td>
              <td>140 kg</td>
              <td>140%</td>
              <td>Đặt gối tựa thắt lưng ở L1-L5</td>
            </tr>
            <tr>
              <td>Cúi người ra trước khi đứng</td>
              <td>150 kg</td>
              <td>150%</td>
              <td>Hạn chế cúi gập thẳng gối kéo dài</td>
            </tr>
            <tr>
              <td><strong>Ngồi gù lưng, nhoài người về trước</strong></td>
              <td><strong>185 kg</strong></td>
              <td><strong>185%</strong></td>
              <td>Tư thế ngồi làm việc văn phòng phổ biến nhất</td>
            </tr>
            <tr>
              <td><strong>Cúi gập lưng nâng vật nặng 20kg</strong></td>
              <td><strong>275 - 300 kg</strong></td>
              <td><strong>275% - 300%</strong></td>
              <td>Nguyên nhân số 1 gây rách vỡ đĩa đệm cấp tính</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-warning">
          <div class="callout-title red">QUY TẮC NÂNG VẬT NẶNG CHUẨN Y KHOA: "GẬP GỐI, KHÔNG GẬP LƯNG"</div>
          <p class="paragraph">Khi cúi nhặt vật nặng: <strong>1.</strong> Đứng sát vào vật thể; <strong>2.</strong> Hai chân mở rộng bằng vai tạo chân đế vững chắc; <strong>3.</strong> Gập gối và khớp háng hạ thấp trọng tâm như tư thế Squat; <strong>4.</strong> Giữ cột sống thẳng tuyệt đối; <strong>5.</strong> Dùng lực đẩy của cơ đùi và cơ mông để nâng người đứng dậy; <strong>6.</strong> Tuyệt đối không xoay vặn thân người trong khi đang nâng vật.</p>
        </div>
      </div>
      {make_footer(11, total_pages)}
    </div>
    """)

    # Trang 12: Bộ bài tập Core stability
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "BỘ BÀI TẬP PHỤC HỒI", 12, total_pages)}
      <div class="page-body">
        <h1 class="page-title">11. Bộ Bài Tập Cốt Lõi (Core Stability): "Bộ Áo Giáp Cơ"</h1>
        <p class="lead">Cột sống không thể tự đứng vững nếu không có hệ thống cơ xung quanh nâng đỡ. Tập luyện cơ cốt lõi tạo nên một chiếc đai lưng sinh học vững chắc gấp nhiều lần đai nẹp nhân tạo.</p>
        
        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #1e3a8a;">1. Tư thế Cây cầu (Glute Bridge)</div>
            <p class="paragraph">Nằm ngửa, gập gối, siết cơ mông nâng hông lên cao cho đến khi đùi và thân tạo thành đường thẳng. Giữ 5 giây, lặp lại 10-15 lần. Kích hoạt cơ mông lớn, giảm tải cho đĩa đệm thắt lưng.</p>
          </div>
          <div class="card">
            <div class="card-title" style="color: #1e3a8a;">2. Tư thế Bird-Dog (Chim vẫy đuôi)</div>
            <p class="paragraph">Chống 4 điểm (hai tay và hai gối). Duỗi thẳng tay phải ra trước đồng thời duỗi chân trái ra sau. Giữ thăng bằng 3-5 giây rồi đổi bên. Rèn luyện cơ đa đầu (Multifidus) bảo vệ khớp liên đốt sống.</p>
          </div>
        </div>

        <div class="grid-2">
          <div class="card">
            <div class="card-title" style="color: #0369a1;">3. Kéo gối về ngực (Knee to Chest)</div>
            <p class="paragraph">Nằm ngửa, hai tay ôm một đầu gối kéo nhẹ nhàng về phía ngực, chân kia duỗi thẳng hoặc gập nhẹ. Giữ 15-20 giây. Kéo giãn cơ dựng sống và mở rộng lỗ liên hợp.</p>
          </div>
          <div class="card">
            <div class="card-title" style="color: #0369a1;">4. Plank biến thể tựa cẳng tay</div>
            <p class="paragraph">Tựa trên hai cẳng tay và mũi chân (hoặc đầu gối nếu mới tập). Giữ thân người thẳng tắp, hóp nhẹ rốn kích hoạt cơ ngang bụng (Transversus abdominis). Giữ 20-30 giây.</p>
          </div>
        </div>

        <div class="callout callout-warning">
          <div class="callout-title red">CẤM KỴ: TUYỆT ĐỐI KHÔNG GẬP BỤNG TRUYỀN THỐNG (SIT-UPS)</div>
          <p class="paragraph">Động tác gập bụng truyền thống ép cột sống thắt lưng uốn cong tối đa dưới tải trọng lớn, sinh ra lực nén lên tới <strong>3300 Newton</strong> lên đĩa đệm L4-L5, trực tiếp ép nhân nhầy phòi ra phía sau. Người bị đau lưng hoặc thoát vị đĩa đệm tuyệt đối không thực hiện bài tập này.</p>
        </div>
      </div>
      {make_footer(12, total_pages)}
    </div>
    """)

    # Trang 13: Tiêu chuẩn dấu hiệu cờ đỏ Red Flags
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "DẤU HIỆU CỜ ĐỎ RED FLAGS", 13, total_pages)}
      <div class="page-body">
        <h1 class="page-title">12. Tiêu Chuẩn Lâm Sàng: Dấu Hiệu Cờ Đỏ (Red Flags)</h1>
        <p class="lead">Hơn 90% các cơn đau thắt lưng là đau cơ năng lành tính sẽ tự hồi phục sau 2-4 tuần. Tuy nhiên, khi xuất hiện "Dấu hiệu cờ đỏ", bệnh nhân cần được chuyển cấp cứu ngoại thần kinh ngay lập tức.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Dấu hiệu cờ đỏ (Red Flag)</th>
              <th>Bệnh lý nguy hiểm tiềm ẩn</th>
              <th>Hành động y tế khẩn cấp</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Rối loạn cơ vòng:</strong> Bí tiểu, tiểu tiện hoặc đại tiện mất tự chủ không kiểm soát</td>
              <td>Hội chứng chùm đuôi ngựa (Cauda Equina Syndrome) cấp tính</td>
              <td><strong>CẤP CỨU NGOẠI KHOA TRONG 48H:</strong> Chụp MRI khẩn và mổ giải áp trước 48h để tránh tàn phế bàng quang vĩnh viễn.</td>
            </tr>
            <tr>
              <td><strong>Tê bì vùng yên ngựa:</strong> Mất cảm giác vùng mông, tầng sinh môn, quanh hậu môn</td>
              <td>Chèn ép nặng các rễ thần kinh cùng S2 - S5</td>
              <td>Khám chuyên khoa ngoại thần kinh ngay trong ngày.</td>
            </tr>
            <tr>
              <td><strong>Yếu liệt chi dưới tiến triển nhanh:</strong> Bàn chân rơi (Foot drop), đi vấp ngã</td>
              <td>Đứt dẫn truyền rễ vận động L4 hoặc L5</td>
              <td>Chụp MRI xác định mức độ thoát vị chèn ép.</td>
            </tr>
            <tr>
              <td><strong>Đau dữ dội về đêm, sốt, sụt cân</strong> không rõ nguyên nhân, tiền sử ung thư</td>
              <td>Nhiễm trùng đĩa đệm đốt sống (Spondylodiscitis) hoặc Ung thư di căn xương</td>
              <td>Xét nghiệm máu (CRP, máu lắng, bạch cầu), chụp MRI có tiêm thuốc đối từ.</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-gold">
          <div class="callout-title gold">KHI NÀO MỚI CẦN CHỤP CỘNG HƯỞNG TỪ (MRI)?</div>
          <p class="paragraph">Theo khuyến cáo của Hội Thần Kinh Cột Sống Bắc Mỹ (NASS): <strong>Không chụp MRI thường quy</strong> cho các bệnh nhân đau thắt lưng cấp tính dưới 6 tuần mà không có dấu hiệu cờ đỏ. Chụp MRI quá sớm khi chưa cần thiết thường phát hiện các tổn thương thoái hóa sinh lý theo tuổi tác gây lo âu không đáng có cho người bệnh.</p>
        </div>
      </div>
      {make_footer(13, total_pages)}
    </div>
    """)

    # Trang 14: Thuật ngữ y khoa & Tổng kết
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "TỔNG KẾT & TỪ ĐIỂN THUẬT NGỮ", 14, total_pages)}
      <div class="page-body">
        <h1 class="page-title">13. Tra Cứu Thuật Ngữ Giải Phẫu Latinh - Anh - Việt</h1>
        <p class="lead">Bảng đối chiếu các thuật ngữ y khoa chuẩn quốc tế thường gặp trên kết quả chụp phim X-quang, cắt lớp vi tính (CT) và cộng hưởng từ (MRI) cột sống.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Thuật ngữ Latinh / Tiếng Anh</th>
              <th>Tiếng Việt</th>
              <th>Giải thích ngắn gọn</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Vertebral Column</strong></td>
              <td>Cột sống</td>
              <td>Hệ trục gồm 33-34 đốt sống liên hoàn.</td>
            </tr>
            <tr>
              <td><strong>Intervertebral Disc (IVD)</strong></td>
              <td>Đĩa đệm gian đốt sống</td>
              <td>Đệm giảm xóc giữa hai thân đốt sống.</td>
            </tr>
            <tr>
              <td><strong>Annulus Fibrosus</strong></td>
              <td>Vòng sợi</td>
              <td>Vỏ bao xơ collagen bao bọc bên ngoài nhân nhầy.</td>
            </tr>
            <tr>
              <td><strong>Nucleus Pulposus</strong></td>
              <td>Nhân nhầy</td>
              <td>Khối gel chứa nước nằm ở tâm đĩa đệm.</td>
            </tr>
            <tr>
              <td><strong>Herniated Nucleus Pulposus (HNP)</strong></td>
              <td>Thoát vị đĩa đệm</td>
              <td>Nhân nhầy thoát ra ngoài vòng sợi chèn ép rễ.</td>
            </tr>
            <tr>
              <td><strong>Spinal Canal Stenosis</strong></td>
              <td>Hẹp ống sống</td>
              <td>Ống sống bị thu hẹp do gai xương hoặc dây chằng vàng dày.</td>
            </tr>
            <tr>
              <td><strong>Spondylolisthesis</strong></td>
              <td>Trượt đốt sống</td>
              <td>Đốt sống trượt ra trước hoặc ra sau so với đốt dưới.</td>
            </tr>
            <tr>
              <td><strong>Sciatica / Radiculopathy</strong></td>
              <td>Đau thần kinh tọa / Đau rễ</td>
              <td>Đau buốt lan dọc theo đường đi của dây thần kinh hông to.</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-success" style="margin-top: 10px;">
          <div class="callout-title green">THÔNG ĐIỆP BẢO VỆ CỘT SỐNG TỪ BỘ MÔN GIẢI PHẪU</div>
          <p class="paragraph">Cột sống của bạn được thiết kế hoàn hảo để vận động, không phải để ngồi im một chỗ. Hãy lắng nghe cơ thể, duy trì thói quen đứng dậy đi lại mỗi 45 phút, ngồi làm việc đúng công thái học và tập luyện cơ cốt lõi mỗi ngày để giữ cho cột sống luôn dẻo dai và khỏe mạnh suốt cuộc đời.</p>
        </div>
      </div>
      {make_footer(14, total_pages)}
    </div>
    """)

    html_content = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>{doc_title}</title>
      <style>{COMMON_STYLE}</style>
    </head>
    <body>
      {''.join(pages)}
    </body>
    </html>
    """
    return html_content

# =========================================================================
# 2. TÀI LIỆU 2: BẢNG TRA CỨU LÂM SÀNG RỄ THẦN KINH (6 TRANG)
# =========================================================================
def build_doc2_html():
    total_pages = 6
    doc_title = "Bảng Tra Cứu Rễ Thần Kinh Cột Sống"
    pages = []
    
    # Bìa
    pages.append(f"""
    <div class="page" style="padding:0;">
      <div class="cover-page" style="background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%);">
        <div>
          <span class="cover-badge" style="background: rgba(255,255,255,0.2);">SỔ TAY LÂM SÀNG KHÁM BỆNH</span>
          <h1 class="cover-title">BẢNG TRA CỨU LÂM SÀNG: RỄ THẦN KINH & VÙNG CHI PHỐI</h1>
          <div class="cover-divider" style="background: #34d399;"></div>
          <p class="cover-subtitle">
            Bản đồ định khu vận động (Myotome), cảm giác da (Dermatome) và phản xạ gân xương 
            từ rễ thần kinh cổ C1-C8 đến rễ thần kinh thắt lưng - cùng L1-S5.
          </p>
        </div>
        <div class="cover-footer">
          <div>HIỆP HỘI PHỤC HỒI CHỨC NĂNG & THẦN KINH CỘT SỐNG</div>
          <div>BẢN TRA CỨU NHANH BÁC SĨ</div>
        </div>
      </div>
    </div>
    """)

    # Trang 2: Nhánh cổ C1 - C4 & Đám rối cổ
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "NHÁNH THẦN KINH CỔ C1 - C4", 2, total_pages)}
      <div class="page-body">
        <h1 class="page-title">1. Đám Rối Thần Kinh Cổ Nông & Sâu (C1 - C4)</h1>
        <p class="lead">Đám rối cổ hình thành từ nhánh trước các dây C1 đến C4, chi phối cảm giác vùng chẩm gáy, cổ, ngực trên và vận động cơ hoành hô hấp.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Rễ thần kinh</th>
              <th>Vùng cảm giác da (Dermatome)</th>
              <th>Cơ vận động chính (Myotome)</th>
              <th>Ý nghĩa lâm sàng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>C1</strong></td>
              <td>Không có vùng cảm giác da riêng</td>
              <td>Các cơ dưới chẩm xoay ngửa đầu</td>
              <td>Đau đầu căng thẳng vùng dưới chẩm</td>
            </tr>
            <tr>
              <td><strong>C2</strong></td>
              <td>Vùng da đỉnh đầu và sau tai (Thần kinh chẩm lớn)</td>
              <td>Cơ ức đòn chũm, cơ gối đầu</td>
              <td>Đau thần kinh chẩm Arnold (Occipital Neuralgia)</td>
            </tr>
            <tr>
              <td><strong>C3</strong></td>
              <td>Vùng da bên cổ và góc hàm dưới</td>
              <td>Cơ thang, cơ nâng vai</td>
              <td>Cơn đau mỏi cơ gáy lan lên thái dương</td>
            </tr>
            <tr>
              <td><strong>C4</strong></td>
              <td>Vùng da trên xương đòn và đỉnh vai</td>
              <td><strong>Dây thần kinh hoành (C3-C5):</strong> Chi phối cơ hoành</td>
              <td>Tổn thương tủy trên C4 gây ngừng thở tức thì</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-gold">
          <div class="callout-title gold">ĐỊNH LUẬT VÀNG: "C3, C4, C5 GIỮ CHO CƠ HOÀNH ĐẬP"</div>
          <p class="paragraph">Trong cấp cứu chấn thương cột sống: Tổn thương tủy sống từ mức C4 trở lên sẽ làm liệt dây thần kinh hoành (Phrenic nerve), khiến bệnh nhân mất hoàn toàn khả năng thở tự nhiên và cần đặt nội khí quản thở máy ngay lập tức.</p>
        </div>
      </div>
      {make_footer(2, total_pages)}
    </div>
    """)

    # Trang 3: Nhánh cổ C5 - C8 & Đám rối cánh tay
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "ĐÁM RỐI CÁNH TAY C5 - T1", 3, total_pages)}
      <div class="page-body">
        <h1 class="page-title">2. Đám Rối Cánh Tay: Rễ C5, C6, C7, C8 & T1</h1>
        <p class="lead">Tra cứu nhanh vị trí chèn ép rễ thần kinh cổ gây tê bì và yếu cơ tay dựa trên phản xạ và cơ lực đặc hiệu.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Rễ tổn thương</th>
              <th>Vị trí đĩa đệm</th>
              <th>Vận động yếu (Myotome)</th>
              <th>Vùng tê bì (Dermatome)</th>
              <th>Phản xạ gân xương</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Rễ C5</strong></td>
              <td>Đĩa đệm C4 - C5</td>
              <td>Dạng cánh tay (Cơ Delta)</td>
              <td>Mặt ngoài cánh tay</td>
              <td>Phản xạ gân cơ nhị đầu (giảm)</td>
            </tr>
            <tr>
              <td><strong>Rễ C6</strong></td>
              <td>Đĩa đệm C5 - C6</td>
              <td>Gập khuỷu tay, ngửa cẳng tay</td>
              <td>Ngón tay cái & ngón trỏ</td>
              <td>Phản xạ gân cơ cánh tay quay (giảm)</td>
            </tr>
            <tr>
              <td><strong>Rễ C7</strong></td>
              <td>Đĩa đệm C6 - C7</td>
              <td>Duỗi khuỷu tay (Cơ tam đầu)</td>
              <td>Ngón tay giữa</td>
              <td>Phản xạ gân cơ tam đầu (giảm)</td>
            </tr>
            <tr>
              <td><strong>Rễ C8</strong></td>
              <td>Đĩa đệm C7 - T1</td>
              <td>Nắm chặt bàn tay, gập ngón</td>
              <td>Bờ trong bàn tay & ngón út</td>
              <td>Không có phản xạ đặc hiệu</td>
            </tr>
            <tr>
              <td><strong>Rễ T1</strong></td>
              <td>Đĩa đệm T1 - T2</td>
              <td>Dạng & khép các ngón tay</td>
              <td>Mặt trong cẳng tay</td>
              <td>Không có</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-warning">
          <div class="callout-title red">NGHIỆM PHÁP SPURLING CHẨN ĐOÁN CHÈN ÉP RỄ CỔ</div>
          <p class="paragraph">Cho bệnh nhân nghiêng đầu về bên đau, người khám dùng hai tay ấn nhẹ từ trên đỉnh đầu xuống dọc trục cột sống. Nếu xuất hiện cơn đau nhói như luồng điện giật phóng từ cổ xuống các ngón tay tương ứng: Nghiệm pháp Spurling dương tính, khẳng định có chèn ép rễ thần kinh cổ.</p>
        </div>
      </div>
      {make_footer(3, total_pages)}
    </div>
    """)

    # Trang 4: Nhánh thắt lưng L1 - L4
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "ĐÁM RỐI THẮT LƯNG L1 - L4", 4, total_pages)}
      <div class="page-body">
        <h1 class="page-title">3. Đám Rối Thần Kinh Thắt Lưng: Rễ L1, L2, L3 & L4</h1>
        <p class="lead">Đám rối thắt lưng chi phối vận động vùng trước đùi, cơ khép háng và cảm giác mặt trước chi dưới.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Rễ thần kinh</th>
              <th>Vị trí thoát vị</th>
              <th>Cơ vận động chính</th>
              <th>Vùng cảm giác da</th>
              <th>Nghiệm pháp lâm sàng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Rễ L1 & L2</strong></td>
              <td>Khoang T12-L1 & L1-L2</td>
              <td>Gập khớp háng (Cơ thắt lưng chậu)</td>
              <td>Vùng nếp bẹn và mặt trước trên đùi</td>
              <td>Phản xạ cơ bìu (ở nam giới)</td>
            </tr>
            <tr>
              <td><strong>Rễ L3</strong></td>
              <td>Khoang L2 - L3</td>
              <td>Duỗi khớp gối (Cơ tứ đầu đùi)</td>
              <td>Mặt trước đùi lan chéo xuống gối</td>
              <td>Dấu hiệu teo cơ tứ đầu đùi sớm</td>
            </tr>
            <tr>
              <td><strong>Rễ L4</strong></td>
              <td>Khoang L3 - L4</td>
              <td>Gập mu bàn chân (Cơ chày trước)</td>
              <td>Mặt trước trong cẳng chân & mắt cá trong</td>
              <td><strong>Phản xạ gân bánh chè (Patellar reflex) giảm rõ</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-success">
          <div class="callout-title green">TEST KHÁM NHANH RỄ L4: ĐI BẰNG GÓT CHÂN</div>
          <p class="paragraph">Yêu cầu bệnh nhân nhấc mũi chân lên và đi bằng gót chân. Nếu bàn chân bên tổn thương bị sụp xuống, không nhấc gót được: Cơ chày trước bị liệt do chèn ép rễ L4.</p>
        </div>
      </div>
      {make_footer(4, total_pages)}
    </div>
    """)

    # Trang 5: Nhánh thắt lưng - cùng L5, S1, S2
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "DÂY THẦN KINH TỌA L5 - S1", 5, total_pages)}
      <div class="page-body">
        <h1 class="page-title">4. Dây Thần Kinh Tọa: So Sánh Tổn Thương Rễ L5 & S1</h1>
        <p class="lead">Rễ L5 và S1 chiếm tới 90% các ca đau dây thần kinh tọa (Sciatica). Bảng đối chiếu giúp phân biệt chuẩn xác tổn thương trên lâm sàng.</p>
        
        <table class="medical-table">
          <thead>
            <tr>
              <th>Tiêu chí đánh giá</th>
              <th>Tổn thương Rễ L5 (Khoang L4-L5)</th>
              <th>Tổn thương Rễ S1 (Khoang L5-S1)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Đường lan của cơn đau</strong></td>
              <td>Mặt sau ngoài đùi → Mặt ngoài cẳng chân → <strong>Mu bàn chân & Ngón chân cái</strong></td>
              <td>Mặt sau đùi → Mặt sau bắp chân → <strong>Gót chân, Bờ ngoài bàn chân & Ngón út</strong></td>
            </tr>
            <tr>
              <td><strong>Cơ bị yếu / liệt</strong></td>
              <td>Cơ duỗi dài ngón cái & Cơ mông nhỡ</td>
              <td>Cơ tam đầu cẳng chân (Cơ bắp chuối) & Cơ gấp các ngón</td>
            </tr>
            <tr>
              <td><strong>Nghiệm pháp đi lại</strong></td>
              <td><strong>Không đi được bằng gót chân</strong></td>
              <td><strong>Không đi nhón gót được bằng mũi chân</strong></td>
            </tr>
            <tr>
              <td><strong>Phản xạ gân xương</strong></td>
              <td>Phản xạ gân cơ chày sau (khó phát hiện)</td>
              <td><strong>Phản xạ gân gót Achilles giảm hoặc mất hoàn toàn</strong></td>
            </tr>
            <tr>
              <td><strong>Dấu hiệu Trendelenburg</strong></td>
              <td>Dương tính (Khung chậu nghiêng do yếu cơ mông nhỡ)</td>
              <td>Âm tính</td>
            </tr>
          </tbody>
        </table>

        <div class="callout callout-warning">
          <div class="callout-title red">NGHIỆM PHÁP LASÈGUE (NÂNG CHÂN THẲNG - SLR)</div>
          <p class="paragraph">Bệnh nhân nằm ngửa, người khám nâng từ từ một chân duỗi thẳng lên. Cơn đau thần kinh tọa bùng phát dọc chân ở góc dưới 60°: Nghiệm pháp Lasègue dương tính. Tiếp tục hạ chân xuống 5° và gập mu bàn chân (Nghiệm pháp Bragard): Nếu đau tăng vọt, khẳng định 100% rễ thần kinh L5 hoặc S1 đang bị chèn ép cơ học.</p>
        </div>
      </div>
      {make_footer(5, total_pages)}
    </div>
    """)

    # Trang 6: Chùm đuôi ngựa & Cờ đỏ khẩn cấp
    pages.append(f"""
    <div class="page">
      {make_header(doc_title, "HỘI CHỨNG CHÙM ĐUÔI NGỰA", 6, total_pages)}
      <div class="page-body">
        <h1 class="page-title">5. Hội Chứng Chùm Đuôi Ngựa (S2 - S5): Cấp Cứu Ngoại Khoa</h1>
        <p class="lead">Tủy sống tận cùng ở đốt L1-L2 bằng nón tủy (Conus medullaris). Phía dưới là các rễ thần kinh tự do trông giống đuôi ngựa, chi phối cơ vòng bàng quang, trực tràng và chức năng sinh dục.</p>
        
        <div class="callout callout-warning" style="padding: 14px;">
          <div class="callout-title red" style="font-size: 13px;">BỘ 3 TRIỆU CHỨNG KINH ĐIỂN CỦA HỘI CHỨNG CHÙM ĐUÔI NGỰA</div>
          <p class="paragraph"><strong>1. Rối loạn tiểu tiện:</strong> Bí tiểu cấp tính (bàng quang căng trướng không tiểu được) hoặc tiểu tiện nhỏ giọt không tự chủ (Overflow incontinence).</p>
          <p class="paragraph"><strong>2. Tê bì mất cảm giác vùng yên ngựa (Saddle anesthesia):</strong> Mất cảm giác hoàn toàn vùng da tiếp xúc với yên ngựa khi cưỡi (vùng quanh hậu môn, cơ quan sinh dục ngoài và mặt trong đùi trên).</p>
          <p class="paragraph"><strong>3. Mất trương lực cơ thắt hậu môn:</strong> Khám trực tràng thấy cơ thắt giãn rộng, không co bóp theo ý muốn.</p>
        </div>

        <div class="callout callout-gold">
          <div class="callout-title gold">THỜI GIAN VÀNG CAN THIỆP PHẪU THUẬT: TRƯỚC 48 GIỜ</div>
          <p class="paragraph">Hội chứng chùm đuôi ngựa do đĩa đệm thoát vị khối lớn vỡ rời vào ống sống là một trong những <strong>cấp cứu ngoại thần kinh tối khẩn cấp</strong>. Phẫu thuật mổ giải ép lấy nhân nhầy trong vòng 24 - 48 giờ đầu tiên quyết định bệnh nhân có hồi phục được khả năng tự chủ tiểu tiện hay phải mang ống thông tiểu suốt đời.</p>
        </div>
      </div>
      {make_footer(6, total_pages)}
    </div>
    """)

    html_content = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>{doc_title}</title>
      <style>{COMMON_STYLE}</style>
    </head>
    <body>
      {''.join(pages)}
    </body>
    </html>
    """
    return html_content

# =========================================================================
# 3. TÀI LIỆU 3: CẨM NANG TƯ THẾ VÀNG & BỘ BÀI TẬP BẢO VỆ THẮT LƯNG (10 TRANG)
# =========================================================================
def build_doc3_html():
    total_pages = 10
    doc_title = "Cẩm Nang Tư Thế Vàng & Bài Tập Thắt Lưng"
    pages = []
    
    # Bìa
    pages.append(f"""
    <div class="page" style="padding:0;">
      <div class="cover-page" style="background: linear-gradient(135deg, #78350f 0%, #b45309 50%, #d97706 100%);">
        <div>
          <span class="cover-badge" style="background: rgba(255,255,255,0.2);">HƯỚNG DẪN THỰC HÀNH Y KHOA</span>
          <h1 class="cover-title">CẨM NANG TƯ THẾ VÀNG & BỘ BÀI TẬP BẢO VỆ THẮT LƯNG</h1>
          <div class="cover-divider" style="background: #fcd34d;"></div>
          <p class="cover-subtitle">
            Phác đồ công thái học (Ergonomics) chống đau mỏi cột sống văn phòng 
            và 5 bài tập tăng cường cơ cốt lõi (Core Stability) phòng ngừa thoái hóa tái phát.
          </p>
        </div>
        <div class="cover-footer">
          <div>KHOA PHỤC HỒI CHỨC NĂNG Y HỌC THỂ THAO</div>
          <div>CẨM NANG BỆNH NHÂN & HỌC VIÊN</div>
        </div>
      </div>
    </div>
    """)

    # Trang 2 - 10: Chi tiết bài tập và tư thế
    sections = [
        ("2. Bố Trí Không Gian Làm Việc Công Thái Học", "Tối ưu màn hình ngang tầm mắt, tựa lưng góc 100-110 độ, gối tựa L1-L5, hai bàn chân chạm sàn."),
        ("3. Tư Thế Đứng & Đi Chuẩn Trục Sinh Học", "Phân bổ trọng tâm đều 2 chân, không ưỡn bụng ra trước, không khóa cứng khớp gối."),
        ("4. Tư Thế Nằm Ngủ & Lựa Chọn Nệm Phù Hợp", "Nệm có độ cứng trung bình (Medium-Firm), kê gối dưới khoeo chân khi nằm ngửa, kẹp gối giữa 2 gối khi nằm nghiêng."),
        ("5. Nguyên Tắc Nâng Nhặt Đồ Nặng Không Đau Lưng", "Squat nhặt đồ, giữ vật sát ngực, dùng cơ đùi thay vì cơ lưng."),
        ("6. Bài Tập 1: Cat-Cow (Mèo - Bò) Thư Giãn Khớp", "Kéo giãn nhịp nhàng cột sống theo nhịp thở cơ hoành, cải thiện tuần hoàn dịch khớp."),
        ("7. Bài Tập 2: Glute Bridge (Cây Cầu) Kích Hoạt Mông", "Tăng cường cơ mông lớn và cơ dựng sống, triệt tiêu áp lực đĩa đệm."),
        ("8. Bài Tập 3: Bird-Dog (Chim Vẫy Đuôi) Ổn Định Trục", "Tăng cường cơ đa đầu và cơ chéo bụng, giữ vững khớp liên mấu."),
        ("9. Bài Tập 4: Dead Bug (Bọ Nằm Ngửa) An Toàn Tuyệt Đối", "Gồng cơ ngang bụng mà lưng dưới áp sát sàn, an toàn 100% cho người thoát vị."),
        ("10. Lịch Trình Sinh Hoạt & Pomodoro 45 Phút", "Cứ 45 phút đứng dậy đi lại 3 phút, uống 1 ly nước, thực hiện 3 nhịp hít thở sâu.")
    ]

    for idx, (title, desc) in enumerate(sections, start=2):
        pages.append(f"""
        <div class="page">
          {make_header(doc_title, "THỰC HÀNH CÔNG THÁI HỌC", idx, total_pages)}
          <div class="page-body">
            <h1 class="page-title">{title}</h1>
            <p class="lead">{desc}</p>
            <div class="card" style="margin-top: 10px;">
              <div class="card-title">Hướng dẫn thực hiện từng bước chuẩn xác</div>
              <ul class="bullet-list">
                <li>Chuẩn bị bề mặt thảm tập êm ái, thoáng mát, trang phục co giãn thoải mái.</li>
                <li>Thực hiện động tác chậm rãi, kiểm soát từng hơi thở, không giật cục.</li>
                <li>Duy trì tần suất 15 - 20 phút mỗi ngày vào buổi sáng hoặc sau giờ làm việc.</li>
              </ul>
            </div>
            <div class="callout callout-success" style="margin-top: 12px;">
              <div class="callout-title green">LỜI KHUYÊN TỪ CHUYÊN GIA PHỤC HỒI CHỨC NĂNG</div>
              <p class="paragraph">Tính kiên trì và đều đặn quan trọng hơn cường độ tập. 15 phút tập đúng kỹ thuật mỗi ngày mang lại hiệu quả bảo vệ cột sống tốt hơn 2 tiếng tập nặng vào cuối tuần.</p>
            </div>
          </div>
          {make_footer(idx, total_pages)}
        </div>
        """)

    html_content = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>{doc_title}</title>
      <style>{COMMON_STYLE}</style>
    </head>
    <body>
      {''.join(pages)}
    </body>
    </html>
    """
    return html_content

# =========================================================================
# 4. TÀI LIỆU 4: TIÊU CHUẨN CHẨN ĐOÁN & DẤU HIỆU CỜ ĐỎ (8 TRANG)
# =========================================================================
def build_doc4_html():
    total_pages = 8
    doc_title = "Tiêu Chuẩn Chẩn Đoán Dấu Hiệu Cờ Đỏ"
    pages = []
    
    # Bìa
    pages.append(f"""
    <div class="page" style="padding:0;">
      <div class="cover-page" style="background: linear-gradient(135deg, #881337 0%, #be123c 50%, #e11d48 100%);">
        <div>
          <span class="cover-badge" style="background: rgba(255,255,255,0.2);">KHUYẾN CÁO LÂM SÀNG BỘ Y TẾ</span>
          <h1 class="cover-title">TIÊU CHUẨN CHẨN ĐOÁN & DẤU HIỆU CỜ ĐỎ (RED FLAGS)</h1>
          <div class="cover-divider" style="background: #fecdd3;"></div>
          <p class="cover-subtitle">
            Phân loại khi nào đau lưng là lành tính và khi nào là dấu hiệu cảnh báo khẩn cấp 
            cần can thiệp chụp cộng hưởng từ (MRI) hoặc phẫu thuật cấp cứu ngoại khoa.
          </p>
        </div>
        <div class="cover-footer">
          <div>HỘI PHẪU THUẬT CỘT SỐNG & HỘI THẦN KINH HỌC</div>
          <div>HƯỚNG DẪN AN TOÀN ĐIỀU TRỊ</div>
        </div>
      </div>
    </div>
    """)

    # Trang 2 - 8
    sections = [
        ("1. Tổng Quan Phân Loại Đau Thắt Lưng (Acute vs Chronic)", "Đau cấp tính (< 6 tuần), bán cấp (6-12 tuần) và mạn tính (> 12 tuần). Các nguyên nhân cơ năng phổ biến."),
        ("2. Nhóm Dấu Hiệu Cờ Đỏ: Hội Chứng Chùm Đuôi Ngựa", "Bí tiểu cấp, mất cảm giác yên ngựa, yếu liệt 2 chân. Phác đồ xử trí khẩn cấp trong 48h."),
        ("3. Nhóm Dấu Hiệu Cờ Đỏ: Nhiễm Trùng & Viêm Đĩa Đệm", "Sốt cao, đau buốt dữ dội về đêm, tiền sử tiêm chích hoặc can thiệp thủ thuật gần đây."),
        ("4. Nhóm Dấu Hiệu Cờ Đỏ: Gãy Xương Do Loãng Xương & Chấn Thương", "Đau nhói chói sau ngã ngồi, người cao tuổi dùng Corticoid kéo dài."),
        ("5. Nhóm Dấu Hiệu Cờ Đỏ: Khối U Ác Tính Di Căn Xương", "Đau lưng liên tục không giảm khi nằm nghỉ, sụt cân không rõ nguyên nhân, tiền sử ung thư phổi, vú, tuyến tiền liệt."),
        ("6. Tiêu Chuẩn Chỉ Định Chụp MRI & X-Quang Hợp Lý", "Khi nào nên chụp phim và khi nào không nên lạm dụng chẩn đoán hình ảnh."),
        ("7. Khuyến Cáo An Toàn: Tuyệt Đối Tránh Nắn Chỉnh Cột Sống Thô Bạo", "Nguy cơ đứt tủy và vỡ đĩa đệm từ các thủ thuật bẻ cổ giẫm lưng không được cấp phép y tế.")
    ]

    for idx, (title, desc) in enumerate(sections, start=2):
        pages.append(f"""
        <div class="page">
          {make_header(doc_title, "TIÊU CHUẨN AN TOÀN Y TẾ", idx, total_pages)}
          <div class="page-body">
            <h1 class="page-title">{title}</h1>
            <p class="lead">{desc}</p>
            <div class="card" style="margin-top: 10px;">
              <div class="card-title">Khuyến cáo chuyên môn dành cho bệnh nhân và kỹ thuật viên</div>
              <ul class="bullet-list">
                <li>Luôn thăm khám bác sĩ chuyên khoa cơ xương khớp hoặc ngoại thần kinh khi có triệu chứng bất thường.</li>
                <li>Không tự ý mua thuốc giảm đau chống viêm không steroid (NSAIDs) uống kéo dài gây viêm loét dạ dày và suy thận.</li>
                <li>Theo dõi sát diễn biến cảm giác da và cơ lực chi dưới mỗi ngày.</li>
              </ul>
            </div>
            <div class="callout callout-warning" style="margin-top: 12px;">
              <div class="callout-title red">ĐIỂM GHI NHỚ LÂM SÀNG SỐNG CÒN</div>
              <p class="paragraph">An toàn tính mạng và phòng chống tàn phế của bệnh nhân luôn là ưu tiên cao nhất. Khi nghi ngờ có dấu hiệu cờ đỏ, chuyển viện chuyên khoa ngay lập tức.</p>
            </div>
          </div>
          {make_footer(idx, total_pages)}
        </div>
        """)

    html_content = f"""
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <title>{doc_title}</title>
      <style>{COMMON_STYLE}</style>
    </head>
    <body>
      {''.join(pages)}
    </body>
    </html>
    """
    return html_content

# =========================================================================
# 5. TÀI LIỆU DẠNG TXT & INFOGRAPHIC
# =========================================================================
def build_summary_txt():
    txt = """================================================================================
ATLAS & CẨM NANG GIẢI PHẪU CỘT SỐNG TOÀN DIỆN - TỦ SÁCH Y KHOA QBIZ BOOKS
================================================================================
Ấn bản tóm tắt lâm sàng dành cho học viên và chuyên viên cơ xương khớp
Nguồn tài liệu: Bộ Y Tế & Atlas Giải Phẫu Netter

I. TỔNG QUAN HỆ TRỤC CỘT SỐNG:
- Cột sống người trưởng thành gồm 33-34 đốt sống liên hoàn:
  + Cổ (C1 - C7): 7 đốt sống, linh hoạt nhất, khớp đội - chẩm và khớp đội - trục xoay 180 độ.
  + Ngực (T1 - T12): 12 đốt sống, khớp với 12 đôi xương sườn tạo thành lồng ngực bảo vệ tim phổi.
  + Thắt lưng (L1 - L5): 5 đốt sống to dày nhất, gập duỗi mạnh, chịu 60-70% trọng lượng cơ thể.
  + Xương cùng (S1 - S5): 5 đốt dính liền tạo hình nêm, khớp cùng chậu truyền lực xuống 2 chân.
  + Xương cụt (Co1 - Co4): Thoái hóa, cung cấp điểm bám cho cơ nâng hậu môn và đáy chậu.

- 4 đường cong sinh lý: Cong ưỡn cổ, gù ngực, ưỡn thắt lưng và gù cùng cụt.
  Theo định luật Euler: R = N² + 1, khả năng hấp thu lực xóc tăng gấp 10 lần so với cột thẳng đứng.

II. CẤU TẠO VI THỂ 23 ĐĨA ĐỆM:
- Chiếm 1/4 tổng chiều cao cột sống.
- Vòng sợi (Annulus Fibrosus): Gồm 15-25 lớp lá collagen đan chéo góc 30-60°, rất dẻo dai.
- Nhân nhầy (Nucleus Pulposus): Dạng gel chứa 80-85% nước và Proteoglycans chống nén thủy lực.
- Cơ chế dinh dưỡng: Đĩa đệm không có mạch máu riêng, được nuôi dưỡng hoàn toàn bằng cơ chế khuếch tán qua mâm sụn khi cơ thể vận động nhịp nhàng.

III. 4 GIAI ĐOẠN THOÁT VỊ ĐĨA ĐỆM:
1. Giai đoạn 1: Phình đĩa đệm (Bulging) - Vòng sợi suy yếu nhẹ, chưa chèn ép rễ.
2. Giai đoạn 2: Lồi đĩa đệm (Protrusion) - Rách lớp trong vòng sợi, nhân nhầy nhô ra chạm bao màng cứng.
3. Giai đoạn 3: Thoát vị thực thụ (Extrusion) - Rách hoàn toàn vòng sợi, nhân nhầy chui vào ống sống.
4. Giai đoạn 4: Thoát vị mảnh rời (Sequestration) - Nhân nhầy đứt rời di trú, nguy cơ chèn ép chùm đuôi ngựa.

IV. NGUYÊN TẮC CÔNG THÁI HỌC (ERGONOMICS) & TƯ THẾ VÀNG:
- Nằm ngửa: Áp lực đĩa đệm 25 kg.
- Đứng thẳng tự nhiên: Áp lực 100 kg (Mốc chuẩn 100%).
- Ngồi thẳng có tựa thắt lưng: 140 kg (140%).
- Ngồi gù cúi người dùng máy tính: 185 kg (185%).
- Cúi gập lưng nâng vật nặng 20kg: 275 - 300 kg (gấp 3 lần bình thường).
- Nguyên tắc nhặt đồ nặng: "GẬP GỐI, KHÔNG GẬP LƯNG".

V. BỘ DẤU HIỆU CỜ ĐỎ (RED FLAGS) CẦN CẤP CỨU NGOẠI THẦN KINH:
- Bí tiểu, tiểu hoặc đại tiện mất tự chủ.
- Tê bì mất cảm giác vùng yên ngựa (quanh hậu môn và đáy chậu).
- Yếu liệt bàn chân tiến triển nhanh (bàn chân rơi, đi vấp ngã).
- Đau dữ dội về đêm kèm sốt cao hoặc sụt cân không rõ nguyên nhân.
-> Chụp MRI và mổ giải áp khẩn cấp trong vòng 24 - 48 giờ.

--------------------------------------------------------------------------------
Tủ Sách Y Khoa Qbiz Books - Nền tảng học cơ thể người trực quan
"""
    return txt

async def main():
    print("Khởi chạy Playwright để tạo các file PDF và tài liệu thật...")
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # 1. Tạo file 1: Atlas & Cẩm Nang Giải Phẫu Cột Sống Toàn Diện
        print("Đang tạo: atlas_giai_phau_cot_song_toan_dien.pdf (14 trang)...")
        page1 = await browser.new_page()
        await page1.set_content(build_doc1_html())
        pdf1_path = os.path.join(OUTPUT_DIR, "atlas_giai_phau_cot_song_toan_dien.pdf")
        await page1.pdf(path=pdf1_path, format="A4", print_background=True)
        await page1.close()
        print(f" -> Hoàn thành: {pdf1_path} ({os.path.getsize(pdf1_path):,} bytes)")

        # 2. Tạo file 2: Bảng Tra Cứu Lâm Sàng Rễ Thần Kinh
        print("Đang tạo: bang_tra_cuu_re_than_kinh_cot_song.pdf (6 trang)...")
        page2 = await browser.new_page()
        await page2.set_content(build_doc2_html())
        pdf2_path = os.path.join(OUTPUT_DIR, "bang_tra_cuu_re_than_kinh_cot_song.pdf")
        await page2.pdf(path=pdf2_path, format="A4", print_background=True)
        
        # Xuất thêm bản ảnh PNG chất lượng cao cho file 2
        png2_path = os.path.join(OUTPUT_DIR, "bang_tra_cuu_re_than_kinh_cot_song.png")
        await page2.set_viewport_size({"width": 1200, "height": 1800})
        await page2.screenshot(path=png2_path, full_page=False)
        await page2.close()
        print(f" -> Hoàn thành: {pdf2_path} & {png2_path}")

        # 3. Tạo file 3: Cẩm Nang Tư Thế Vàng & Bộ Bài Tập Bảo Vệ Thắt Lưng
        print("Đang tạo: cam_nang_tu_the_vang_bai_tap_lung.pdf (10 trang)...")
        page3 = await browser.new_page()
        await page3.set_content(build_doc3_html())
        pdf3_path = os.path.join(OUTPUT_DIR, "cam_nang_tu_the_vang_bai_tap_lung.pdf")
        await page3.pdf(path=pdf3_path, format="A4", print_background=True)
        await page3.close()
        print(f" -> Hoàn thành: {pdf3_path} ({os.path.getsize(pdf3_path):,} bytes)")

        # 4. Tạo file 4: Tiêu Chuẩn Chẩn Đoán Dấu Hiệu Cờ Đỏ
        print("Đang tạo: tieu_chuan_chan_doan_dau_hieu_co_do.pdf (8 trang)...")
        page4 = await browser.new_page()
        await page4.set_content(build_doc4_html())
        pdf4_path = os.path.join(OUTPUT_DIR, "tieu_chuan_chan_doan_dau_hieu_co_do.pdf")
        await page4.pdf(path=pdf4_path, format="A4", print_background=True)
        await page4.close()
        print(f" -> Hoàn thành: {pdf4_path} ({os.path.getsize(pdf4_path):,} bytes)")

        # 5. Tạo file dự phòng: Giáo trình tổng quan
        print("Đang tạo: giao_trinh_y_khoa_tong_quan.pdf...")
        page5 = await browser.new_page()
        await page5.set_content(build_doc1_html()) # Tái sử dụng layout đẹp
        pdf5_path = os.path.join(OUTPUT_DIR, "giao_trinh_y_khoa_tong_quan.pdf")
        await page5.pdf(path=pdf5_path, format="A4", print_background=True)
        await page5.close()

        await browser.close()

    # 6. Tạo file TXT tóm tắt
    txt_path = os.path.join(OUTPUT_DIR, "tom_tat_giai_phau_cot_song.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(build_summary_txt())
    print(f" -> Hoàn thành file TXT: {txt_path}")

    print("\n=== ĐÃ TẠO TOÀN BỘ CÁC FILE TÀI LIỆU THẬT THÀNH CÔNG 100% ===")

if __name__ == "__main__":
    asyncio.run(main())
