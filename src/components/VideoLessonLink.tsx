import Link from 'next/link';
import { ArrowRight, Youtube } from 'lucide-react';

export default function VideoLessonLink({ href, title, thumbnailUrl }: { href: string; title: string; thumbnailUrl?: string | null }) {
  return (
    <Link href={href} className="flex min-w-0 items-center gap-2.5 rounded-[11px] border border-red-200/80 bg-white px-2.5 py-2 text-slate-800 transition-colors hover:border-red-300 hover:bg-red-50/50 dark:border-red-300/15 dark:bg-white/[.035] dark:text-slate-100 dark:hover:bg-red-950/20">
      <span className="relative flex h-9 w-[58px] shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#FF0000] text-white shadow-sm">{thumbnailUrl && <img src={thumbnailUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}<span className="relative flex h-5 w-7 items-center justify-center rounded-[5px] bg-[#FF0000] text-white shadow-sm"><Youtube size={16} fill="white" stroke="#FF0000" /></span></span>
      <span className="min-w-0 flex-1"><span className="block text-[8px] font-black uppercase tracking-[.08em] text-red-600 dark:text-red-300">Xem video bài học</span><span className="block line-clamp-2 text-[10.5px] font-extrabold leading-snug">{title}</span></span>
      <ArrowRight size={15} className="shrink-0 text-red-600 dark:text-red-300" />
    </Link>
  );
}
