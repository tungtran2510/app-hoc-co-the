import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Lora } from 'next/font/google';
import './globals.css';
import PwaRegistrar from '../components/PwaRegistrar';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Qbiz Books · Tủ Sách Y Khoa & Khám Phá Cơ Thể',
  description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình tương tác',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Qbiz Books',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0C0817' },
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
    <html lang="vi" className={`${beVietnamPro.variable} ${lora.variable} ${beVietnamPro.className}`}>
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('giao_dien');var isDark=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var color=isDark?'#0C0817':'#FFFFFF';if(isDark){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}var metas=document.querySelectorAll('meta[name="theme-color"]');if(metas.length>0){metas.forEach(function(m){m.setAttribute('content',color);m.removeAttribute('media');});}else{var n=document.createElement('meta');n.name='theme-color';n.content=color;document.head.appendChild(n);}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${beVietnamPro.className} bg-bg text-ink min-h-screen flex justify-center selection:bg-primary-soft selection:text-primary-dark`}>
        <PwaRegistrar />
        <div className="w-full max-w-[480px] md:max-w-[820px] lg:max-w-[820px] min-h-screen bg-bg relative flex flex-col mx-auto shadow-2xl transition-all">
          {children}
        </div>
      </body>
    </html>
  );
}
