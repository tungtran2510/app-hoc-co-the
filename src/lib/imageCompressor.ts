/**
 * Nén ảnh trên trình duyệt bằng Canvas có sẵn, không dùng thư viện ngoài:
 * - Ảnh lớn: rộng tối đa 1600px, xuất WebP chất lượng ~0.8.
 *   Nếu kích thước vẫn > 300KB thì giảm chất lượng dần (tối thiểu 0.5).
 * - Ảnh nhỏ (thumbnail): rộng tối đa 400px, xuất WebP chất lượng ~0.8.
 */

export interface CompressedImages {
  mainBlob: Blob;
  thumbBlob: Blob;
  width: number;
  height: number;
}

export async function compressImageClient(file: File): Promise<CompressedImages> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc file ảnh.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Không thể tải dữ liệu ảnh.'));
      img.onload = async () => {
        try {
          const origWidth = img.naturalWidth || img.width;
          const origHeight = img.naturalHeight || img.height;

          // 1. Nén ảnh chính: max width 1600px
          const maxMainWidth = 1600;
          let mainWidth = origWidth;
          let mainHeight = origHeight;
          if (mainWidth > maxMainWidth) {
            mainHeight = Math.round((mainHeight * maxMainWidth) / mainWidth);
            mainWidth = maxMainWidth;
          }

          const canvasMain = document.createElement('canvas');
          canvasMain.width = mainWidth;
          canvasMain.height = mainHeight;
          const ctxMain = canvasMain.getContext('2d');
          if (!ctxMain) throw new Error('Không thể khởi tạo Canvas 2D.');
          ctxMain.drawImage(img, 0, 0, mainWidth, mainHeight);

          // Vòng lặp điều chỉnh chất lượng WebP từ 0.8 xuống tối thiểu 0.5 nếu > 300KB
          let quality = 0.8;
          let mainBlob = await canvasToBlob(canvasMain, 'image/webp', quality);
          while (mainBlob.size > 300 * 1024 && quality > 0.5) {
            quality -= 0.1;
            mainBlob = await canvasToBlob(canvasMain, 'image/webp', quality);
          }

          // 2. Tạo thumbnail: max width 400px
          const maxThumbWidth = 400;
          let thumbWidth = origWidth;
          let thumbHeight = origHeight;
          if (thumbWidth > maxThumbWidth) {
            thumbHeight = Math.round((thumbHeight * maxThumbWidth) / thumbWidth);
            thumbWidth = maxThumbWidth;
          }

          const canvasThumb = document.createElement('canvas');
          canvasThumb.width = thumbWidth;
          canvasThumb.height = thumbHeight;
          const ctxThumb = canvasThumb.getContext('2d');
          if (!ctxThumb) throw new Error('Không thể khởi tạo Canvas 2D cho thumbnail.');
          ctxThumb.drawImage(img, 0, 0, thumbWidth, thumbHeight);

          const thumbBlob = await canvasToBlob(canvasThumb, 'image/webp', 0.8);

          resolve({
            mainBlob,
            thumbBlob,
            width: mainWidth,
            height: mainHeight,
          });
        } catch (err) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Xuất blob từ canvas thất bại.'));
      },
      mimeType,
      quality
    );
  });
}
