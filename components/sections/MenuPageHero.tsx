"use client";

import { type RefObject } from "react";
import { Leaf, Star } from "lucide-react";

const floatingItems = [
  { icon: Leaf, top: "10%", left: "6%", delay: "0s", size: 26 },
  { icon: Star, top: "28%", left: "80%", delay: "-2s", size: 18 },
  { icon: Leaf, top: "55%", left: "12%", delay: "-3s", size: 22 },
];

interface MenuPageHeroProps {
  plateSlotRef: RefObject<HTMLDivElement | null>;
}

export function MenuPageHero({ plateSlotRef }: MenuPageHeroProps) {
  return (
    <section className="relative min-h-[85vh] bg-charcoal lg:min-h-screen">
      {floatingItems.map((item, i) => (
        <span
          key={i}
          className="animate-float pointer-events-none absolute text-orange-brand/35"
          style={{
            top: item.top,
            left: item.left,
            animationDelay: item.delay,
          }}
        >
          <item.icon size={item.size} strokeWidth={1.5} />
        </span>
      ))}

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-4 pt-28 pb-20 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:pt-32 lg:pb-28">
        <div className="max-w-xl">
          <p lang="en" className="font-script script-label-en text-2xl text-orange-brand sm:text-3xl">
            Our Menu
          </p>
          <h1 className="font-serif mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            <span lang="en" className="block">Signature</span>
            <span lang="en" className="font-script heading-accent-en font-normal text-orange-brand">
              Plates
            </span>
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            برای کشف انتخاب‌های سرآشپز اسکرول کنید. بشقاب قهرمان از بالا
            می‌آید و روی غذای اصلی امضای ما می‌نشیند.
          </p>
        </div>

        {/* Empty slot — scroll-linked plate animates here on load */}
        <div className="relative mx-auto w-full max-w-lg lg:max-w-none lg:justify-self-end">
          <div
            ref={plateSlotRef}
            className="relative mx-auto aspect-square w-full max-w-[420px] sm:max-w-[480px]"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
