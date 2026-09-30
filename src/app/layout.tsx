import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import PwaRegistrar from '../components/PwaRegistrar';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Học Cơ Thể - Hiểu Về Cơ Thể',
  description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Học Cơ Thể',
  },
};

export const viewport: Viewport = {
  themeColor: '#0E6B5A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <body className="bg-bg text-ink min-h-screen flex justify-center selection:bg-primary-soft selection:text-primary-dark">
        <PwaRegistrar />
        <div className="w-full max-w-[480px] min-h-screen bg-bg relative flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
