"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { clsx } from "clsx";
import { HeroParallaxVisual } from "@/components/sections/HeroParallaxVisual";

export interface ParallaxHeroProps {
  className?: string;
}

export function ParallaxHero({ className }: ParallaxHeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0]);

  return (
    <section
      ref={heroRef}
      className={clsx("relative h-[180vh] bg-[#111111]", className)}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto flex w-full max-w-[88rem] flex-col items-center gap-6 px-4 pt-24 sm:gap-8 sm:px-6 sm:pt-28 xl:flex-row xl:items-center xl:justify-center xl:gap-8 xl:px-8 xl:pt-0">
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="z-20 max-w-md shrink-0 xl:max-w-lg"
          >
            <p lang="en" className="font-script script-label-en text-2xl text-[#F97316] sm:text-3xl">
              Our Menu
            </p>
            <h1 className="font-serif mt-2 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              <span className="block">بشقاب‌های</span>
              <span lang="en" className="font-script heading-accent-en font-normal text-[#F97316]">
                Plates
              </span>
            </h1>
            <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/60 sm:text-base">
              برای کشف میز سرآشپز ما اسکرول کنید — بشقاب‌هایی که با نمک و
              آرد پاشیده به هم متصل شده‌اند، با دقتی آرام چیده شده‌اند.
            </p>
          </motion.div>

          <div className="relative z-10 w-full max-w-[720px] shrink-0 overflow-visible xl:max-w-[780px] xl:-ms-14">
            <HeroParallaxVisual scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
