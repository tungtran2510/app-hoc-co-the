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
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0C0817' },
    { media: '(prefers-color-scheme: light)', color: '#F5F6FA' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={beVietnamPro.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('giao_dien');if(t==='dark'){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}}catch(e){}`,
          }}
        />
      </head>
      <body className="bg-bg text-ink min-h-screen flex justify-center selection:bg-primary-soft selection:text-primary-dark">
        <PwaRegistrar />
        <div className="w-full max-w-[480px] min-h-screen bg-bg relative flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
