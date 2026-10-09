import type { Metadata, Viewport } from 'next';
import { Be_Vietnam_Pro, Lora, Inter, Nunito } from 'next/font/google';
import './globals.css';
import PwaRegistrar from '../components/PwaRegistrar';
import OfflineManager from '../components/OfflineManager';
import FloatingAiButton from '../components/FloatingAiButton';

const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-be-vietnam-pro',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
  display: 'swap',
});

const lora = Lora({
  weight: ['400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-lora',
  fallback: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
  display: 'swap',
});

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-inter',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  display: 'swap',
});

const nunito = Nunito({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['vietnamese', 'latin'],
  variable: '--font-nunito',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://app-hoc-co-the.vercel.app'),
  title: 'Qbiz Books · Tủ Sách Y Khoa & Khám Phá Cơ Thể',
  description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình tương tác',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192.png?v=22', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=22', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico?v=22' },
    ],
    apple: [
      { url: '/apple-icon.png?v=22', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Qbiz Books',
  },
  openGraph: {
    title: 'Qbiz Books · Tủ Sách Y Khoa & Khám Phá Cơ Thể',
    description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình tương tác',
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Qbiz Books',
    images: [
      {
        url: '/spine_hero_clean.png',
        width: 1200,
        height: 630,
        alt: 'Qbiz Books - Tủ Sách Y Khoa & Khám Phá Cơ Thể',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Qbiz Books · Tủ Sách Y Khoa & Khám Phá Cơ Thể',
    description: 'Ứng dụng học hiểu kiến thức về cơ thể theo lộ trình tương tác',
    images: ['/spine_hero_clean.png'],
  },
};

export const viewport: Viewport = {
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
    <html lang="vi" suppressHydrationWarning className={`${beVietnamPro.variable} ${lora.variable} ${inter.variable} ${nunito.variable} ${beVietnamPro.className}`}>
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="theme-color" id="app-theme-color" content="#FFFFFF" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=22" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png?v=22" />
        <link rel="preconnect" href="https://evuhamqlzprrbuabxyyn.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://evuhamqlzprrbuabxyyn.supabase.co" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{document.addEventListener('touchstart',function(){},{passive:true});var t=localStorage.getItem('giao_dien');var isDark=t==='dark'||(!t&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);var p=localStorage.getItem('qbiz_theme_palette');if(!p){p='navy_luxury';}if(p==='navy_luxury'){document.documentElement.classList.add('theme-navy-luxury');document.documentElement.classList.remove('theme-minimal')}else if(p==='minimal'){document.documentElement.classList.add('theme-minimal');document.documentElement.classList.remove('theme-navy-luxury')}else{document.documentElement.classList.remove('theme-navy-luxury','theme-minimal')}var font=localStorage.getItem('qbiz_reader_font');document.documentElement.classList.remove('font-reader-sans','font-reader-serif','font-reader-rounded');if(font==='serif'){document.documentElement.classList.add('font-reader-serif')}else if(font==='rounded'){document.documentElement.classList.add('font-reader-rounded')}else{document.documentElement.classList.add('font-reader-sans')}var color=isDark?(p==='minimal'?'#0F172A':p==='indigo'?'#0C0817':'#061021'):(p==='navy_luxury'?'#F4F6FA':'#FFFFFF');if(isDark){document.documentElement.classList.add('dark')}else{document.documentElement.classList.remove('dark')}var m=document.getElementById('app-theme-color')||document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement('meta');m.id='app-theme-color';m.name='theme-color';document.head.appendChild(m)}m.setAttribute('content',color);m.removeAttribute('media');var all=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<all.length;i++){if(all[i]!==m){all[i].remove()}}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${beVietnamPro.className} bg-bg text-ink min-h-screen flex justify-center selection:bg-primary-soft selection:text-primary-dark`}>
        <PwaRegistrar />
        <OfflineManager />
        <div className="w-full max-w-[480px] md:max-w-[820px] lg:max-w-[820px] min-h-screen bg-bg relative flex flex-col mx-auto shadow-2xl transition-all">
          <FloatingAiButton />
          {children}
        </div>
      </body>
    </html>
  );
}
