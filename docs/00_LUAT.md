# 00_LUAT – Luật bắt buộc cho mọi AI làm dự án này

Đọc file này TRƯỚC mọi lệnh. Luật ở đây thắng mọi suy đoán của bạn.

## 1. Phạm vi
- Chỉ làm đúng việc trong file LENH_xx đang giao. Không làm trước việc của lệnh sau.
- Không tự thêm chức năng, màn hình, thư viện, trang cấu hình… ngoài spec.
- Không đổi cấu trúc 3 tầng: **Chủ đề → Trang nội dung → Khối**. Cấm tạo Course / Series / Lesson / Module / Unit.
- Không làm: quiz, câu hỏi, điểm số, khoá bài, đăng nhập người xem, AI, thông báo, thống kê (trừ khi lệnh yêu cầu).
- Gặp chỗ spec không nói: chọn cách ĐƠN GIẢN NHẤT, ghi vào báo cáo mục "Giả định". Không dừng lại hỏi vì chuyện nhỏ.
- Chỉ dừng lại hỏi khi: thiếu thông tin bắt buộc (tài khoản, khoá, link repo) hoặc phải làm việc không đảo ngược được.

## 2. Ngôn ngữ
- 100% chữ hiển thị cho người dùng là **tiếng Việt có dấu**. Không để sót chữ tiếng Anh trên giao diện (kể cả "Loading", "Back", "Next", "Search", "Error").
- Tên biến, tên file, code: tiếng Anh không dấu là được.
- `<html lang="vi">`.

## 3. Công nghệ (đã chốt, không bàn lại)
- Next.js (App Router, bản ổn định mới nhất) + TypeScript + Tailwind CSS.
- Font: Be Vietnam Pro qua `next/font/google`, subset `vietnamese` + `latin`.
- Icon: `lucide-react`.
- Dữ liệu: Supabase (từ Lệnh 02). Lệnh 01 dùng dữ liệu mẫu local.
- Deploy: GitHub → Vercel.
- Thư viện được phép cài: CHỈ những thư viện trên + thư viện mà lệnh ghi rõ. Muốn cài thêm: ghi lý do trong báo cáo, không tự cài.

## 4. Tiết kiệm token – làm việc gọn
- Chỉ đọc các file mà lệnh liệt kê. Không quét toàn bộ repo khi không cần.
- Không in lại nguyên file dài vào khung chat. Không giải thích lan man.
- Không refactor phần không liên quan. Không đổi tên file đang chạy tốt.
- Lỗi build: đọc đúng dòng lỗi, sửa đúng chỗ, tối đa 3 lần thử cho cùng một lỗi. Quá 3 lần: dừng, báo cáo lỗi nguyên văn.
- Component nhỏ, mỗi file một việc. Không viết một file 1.000 dòng.

## 5. Chất lượng giao diện (người già phải dùng được)
- Chữ nội dung tối thiểu 19px. Chữ phụ tối thiểu 14px. Tiêu đề trang 28–30px.
- Vùng bấm tối thiểu 48×48px. Nút chính cao 60–64px.
- Tương phản chữ đạt tối thiểu 4.5:1.
- Mỗi màn một nút chính. Không tab. Không menu nhiều tầng.
- Trạng thái (đang xem / đã xem) ghi bằng chữ, không chỉ bằng màu.
- Nút chỉ có icon phải có `aria-label` tiếng Việt.
- Mobile-first: thiết kế cho màn 360–430px. Trên máy tính: nội dung ở giữa, rộng tối đa 480px.

## 6. Bảo mật (V1 làm tối thiểu, không làm hơn)
- V1 KHÔNG làm phân quyền phức tạp. Chỉ 1 mật khẩu Admin (từ Lệnh 04), đặt trong biến môi trường, kiểm ở phía server.
- Không đưa khoá bí mật (service key) vào code phía trình duyệt. Không commit file `.env`.

## 7. Git
- Mỗi lệnh xong: 1 commit, message dạng `LENH_01: <mô tả ngắn tiếng Việt>`.
- Không force push.

## 8. Báo cáo khi xong lệnh – ĐÚNG 6 mục, ngắn
```
1. Đã làm: …
2. File thay đổi: …
3. Tiêu chí PASS: [x] … / [ ] … (đánh dấu từng tiêu chí trong lệnh)
4. Giả định đã tự quyết: …
5. Lỗi / việc còn lại: …
6. Anh cần làm: … (ví dụ: bấm Import trên Vercel) + URL để kiểm tra
```
Không được ghi "đã xong" cho tiêu chí chưa tự kiểm. Chưa kiểm được thì ghi "CHƯA KIỂM CHỨNG".
