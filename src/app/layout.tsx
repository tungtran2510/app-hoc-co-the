import type { Metadata } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sống Khỏe Mỗi Ngày - Hiểu Về Cơ Thể',
  description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="bg-bg text-ink min-h-screen flex justify-center selection:bg-primary-soft selection:text-primary-dark">
        <div className="w-full max-w-[480px] min-h-screen bg-bg relative flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
