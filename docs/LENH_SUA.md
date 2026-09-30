# LENH_SUA – Mẫu lệnh sửa lỗi nhanh (dùng lại nhiều lần)

Dùng khi một lệnh đã làm nhưng còn lỗi. Chủ dự án chỉ cần điền phần [ ] rồi dán cho Antigravity.

```
Đọc docs/00_LUAT.md. Đây là lệnh SỬA LỖI, không phải lệnh mới.

Lỗi cần sửa:
1. [Màn nào] – [Bấm gì] – [Thấy gì] – [Mong muốn thấy gì]
2. ...

Quy tắc:
- Chỉ sửa đúng các lỗi trên. Không đổi giao diện, không thêm chức năng, không refactor.
- Tìm nguyên nhân trước, sửa đúng chỗ, tối đa 3 lần thử mỗi lỗi.
- Sửa xong: npm run build, tự kiểm lại đúng các bước ở trên, commit "SUA: <mô tả ngắn>", deploy.

Báo cáo ngắn: lỗi nào đã sửa, nguyên nhân 1 câu, lỗi nào chưa sửa được và vì sao.
```

Mẹo viết lỗi cho nhanh: chụp màn hình gửi kèm; mỗi lỗi 1 dòng; ghi rõ điện thoại (iPhone/Android) nếu lỗi chỉ xảy ra trên 1 loại máy.
