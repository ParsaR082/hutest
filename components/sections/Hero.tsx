"use client";

import { BookTableButton } from "@/components/booking/BookTableButton";
import { Header } from "@/components/layout/Header";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  ChefHat,
  Heart,
  Leaf,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { heroFeatures } from "@/lib/data";
import { images } from "@/lib/images";
import { useSiteImages } from "@/lib/hooks/useSiteImages";

const SLIDE_VIEWPORT = { once: false, amount: 0.3 } as const;

const floatingItems = [
  { icon: Leaf, top: "18%", left: "6%", delay: 0.1, size: 28 },
  { icon: Star, top: "28%", left: "82%", delay: 0.2, size: 20 },
  { icon: Leaf, top: "62%", left: "10%", delay: 0.3, size: 24 },
  { icon: Star, top: "72%", left: "88%", delay: 0.4, size: 18 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function Hero() {
  const siteImages = useSiteImages();
  const heroBackground = siteImages.homepage_hero ?? images.hero.background;

  return (
    <section
      id="home"
      className="relative flex h-screen w-full shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      <Header />
      <div
        aria-hidden
        className="absolute inset-0 z-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${heroBackground}")` }}
      />

      <div className="absolute inset-0 z-[1] bg-[#0a0a0a]/35" aria-hidden />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-r from-[#0a0a0a]/75 via-[#0a0a0a]/45 to-[#0a0a0a]/20"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-[1] bg-gradient-to-t from-[#0a0a0a]/65 via-transparent to-[#0a0a0a]/25"
        aria-hidden
      />

      {floatingItems.map((item, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ delay: item.delay, duration: 0.5, type: "spring" }}
          className="animate-float pointer-events-none absolute z-10 text-orange-brand/35"
          style={{ top: item.top, left: item.left }}
        >
          <item.icon size={item.size} strokeWidth={1.5} />
        </motion.span>
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl items-center px-4 pt-20 sm:px-6 lg:px-10">
        <div className="w-full max-w-2xl">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={SLIDE_VIEWPORT}
            variants={fadeUp}
            className="mb-4 flex w-full justify-start"
          >
            <span
              lang="en"
              dir="ltr"
              className="font-script inline-flex shrink-0 flex-nowrap items-center gap-2 text-2xl leading-none text-orange-brand sm:text-3xl"
            >
              <span className="whitespace-nowrap">Good Food, Good Mood</span>
              <Heart className="h-5 w-5 shrink-0 fill-orange-brand text-orange-brand" />
            </span>
          </motion.p>

          <motion.h1
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={SLIDE_VIEWPORT}
            variants={fadeUp}
            className="font-serif flex w-full flex-col text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-[3.5rem] xl:text-6xl"
          >
            <span className="block w-full text-start">
              غذای{" "}
              <span className="[font-feature-settings:'kash'_1]">خوشـــــــــــــــــــمزه</span>
            </span>
            <span
              dir="ltr"
              className="mt-2 flex w-full items-center justify-start gap-2 ps-2 sm:mt-3 sm:ps-3"
            >
              <span
                lang="en"
                className="font-script text-3xl font-normal leading-none text-orange-brand sm:text-3xl"
              >
                Made with Love
              </span>
              <Heart className="h-5 w-5 shrink-0 fill-orange-brand text-orange-brand" />
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={SLIDE_VIEWPORT}
            variants={fadeUp}
            className="mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base"
          >
            در هر لقمه، ترکیبی از طعم، کیفیت و شادی را تجربه کنید. با عشق توسط
            سرآشپزهای حرفه‌ای ما و با تازه‌ترین مواد فصلی تهیه شده است.
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={SLIDE_VIEWPORT}
            variants={fadeUp}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-orange-brand px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-brand/35 transition hover:bg-orange-600"
            >
              <UtensilsCrossed className="h-4 w-4" />
              مشاهده منو
            </Link>
            <BookTableButton className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15">
              <Calendar className="h-4 w-4" />
              رزرو میز
            </BookTableButton>
          </motion.div>

          <motion.ul
            initial="hidden"
            whileInView="visible"
            viewport={SLIDE_VIEWPORT}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.35 } },
            }}
            className="mt-10 flex flex-wrap gap-x-6 gap-y-3"
          >
            {heroFeatures.map((f) => (
              <motion.li
                key={f.label}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
                }}
                className="flex items-center gap-2 text-xs font-medium text-white/80 sm:text-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-orange-brand backdrop-blur-sm">
                  {f.icon === "leaf" && <Leaf className="h-4 w-4" />}
                  {f.icon === "chef" && <ChefHat className="h-4 w-4" />}
                  {f.icon === "star" && <Star className="h-4 w-4" />}
                </span>
                {f.label}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="absolute end-6 top-24 hidden lg:block xl:end-12 xl:top-28"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{
                opacity: [1, 0.35, 1],
                scale: [1, 1.07, 1],
                boxShadow: [
                  "0 0 0 0 rgba(249,115,22,0.75), 0 0 28px rgba(249,115,22,0.45)",
                  "0 0 0 16px rgba(249,115,22,0), 0 0 8px rgba(249,115,22,0.1)",
                  "0 0 0 0 rgba(249,115,22,0.75), 0 0 28px rgba(249,115,22,0.45)",
                ],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-full"
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full border-2 border-orange-brand"
                animate={{ scale: [1, 1.22, 1], opacity: [0.85, 0, 0.85] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <Link
                href="/menu"
                aria-label="مشاهده منوی ما"
                className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border-2 border-dashed border-orange-brand bg-black/55 px-4 text-center backdrop-blur-md transition-transform hover:scale-105 xl:h-40 xl:w-40"
              >
                <UtensilsCrossed className="mb-2 h-8 w-8 text-orange-brand" />
                <span className="font-serif text-sm font-bold leading-snug text-white xl:text-[0.95rem]">
                  مشاهده
                  <br />
                  منوی ما
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
