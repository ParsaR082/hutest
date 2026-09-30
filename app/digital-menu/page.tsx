import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarbleBackground from "@/components/digital-menu/MarbleBackground";
import SideDecorations from "@/components/digital-menu/SideDecorations";

export default function DigitalMenuWelcomePage() {
  return (
    <MarbleBackground className="flex min-h-screen flex-col items-center justify-center">
      <SideDecorations />

      <Link
        href="/"
        className="fixed top-6 left-4 z-50 flex items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-black/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#d4af37] backdrop-blur-md transition-all hover:bg-[#d4af37]/20 sm:top-8 sm:left-8"
        aria-label="بازگشت به سایت اصلی هومزد"
      >
        <ArrowLeft size={13} />
        <span>Humazd.ir</span>
      </Link>

      <div className="relative z-10 mx-auto max-w-6xl px-4 text-center">
        <div className="mb-4 h-px w-24 bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent" />

        <h1 className="dm-font-serif dm-animate-fade-up text-5xl font-bold uppercase tracking-[0.2em] text-white sm:text-7xl">
          Humazd
        </h1>
        <h1 className="dm-font-serif dm-animate-fade-up mb-2 text-5xl font-thin uppercase tracking-[0.2em] text-[#d4af37] sm:text-5xl">
          هومـــــــــــــزد
        </h1>

        <p
          className="dm-font-persian dm-animate-fade-up mb-1 text-sm tracking-[0.2em] text-zinc-400"
          dir="rtl"
        >
          رستوران لوکس
        </p>
        <p className="dm-animate-fade-up mb-14 text-[10px] font-light uppercase tracking-[0.45em] text-zinc-500">
          Luxury Restaurant
        </p>

        <Link
          href="/digital-menu/menu"
          className="dm-animate-fade-up-delay group inline-block border border-[#d4af37]/50 bg-[#0a0a0a]/60 px-12 py-4 text-[10px] font-medium uppercase tracking-[0.35em] text-[#d4af37] backdrop-blur-sm transition-all duration-500 hover:border-[#d4af37] hover:bg-[#d4af37]/10 hover:text-white"
        >
          <span>View Menu</span>
          <span
            className="dm-font-persian mt-1.5 block text-[9px] font-normal normal-case tracking-normal text-zinc-400 group-hover:text-zinc-300"
            dir="rtl"
          >
            مشاهده منو
          </span>
        </Link>

        <div className="dm-animate-fade-up-delay mt-24 h-px w-32 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
      </div>
    </MarbleBackground>
  );
}
