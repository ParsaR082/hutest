"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LocalImage } from "@/components/ui/LocalImage";
import {
  ArrowRight,
  ChefHat,
  Clock,
  Leaf,
  Smile,
  Users,
} from "lucide-react";
import { aboutFeatures } from "@/lib/data";
import { images } from "@/lib/images";
import { useSiteImages } from "@/lib/hooks/useSiteImages";

const SLIDE_VIEWPORT = { once: false, amount: 0.3 } as const;

const iconMap = {
  leaf: Leaf,
  chef: ChefHat,
  service: Clock,
  happy: Smile,
};

/** Slide 2 — About content on white background */
export function SignatureDish() {
  const siteImages = useSiteImages();
  const interiorImage = siteImages.homepage_about_teaser ?? images.about.interior;

  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex h-screen w-full shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden bg-white"
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, x: -32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4"
        >
          <p
            lang="en"
            className="font-script script-label-en text-2xl text-orange-brand sm:text-3xl"
          >
            About Us
          </p>
          <h2
            id="about-heading"
            className="font-serif mt-2 flex w-full flex-col items-end text-3xl font-bold leading-tight text-charcoal sm:text-4xl"
          >
            <span className="block w-full text-start">ما ســـــــــــــــرو می‌کنیم</span>
            <span
              lang="en"
              dir="ltr"
              className="font-script mt-0.5 text-[0.92em] font-normal leading-none text-orange-brand sm:mt-1 sm:text-[0.95em]"
            >
              Happiness
            </span>
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-neutral-600 sm:text-base">
            در Humazd باور داریم غذا خوردن فراتر از یک وعده است — لحظه‌ای از
            شادی است که با عزیزانتان به اشتراک می‌گذارید. تیم پرشور ما هر
            بشقاب را با مواد تازه و محلی و دستورهای اصیل چند نسله می‌سازد.
          </p>
          <p lang="en" className="font-script mt-6 text-xl text-neutral-500">
            — Chef Marco Antonio
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-orange-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            بیشتر بدانید
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ duration: 0.7, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:col-span-4"
        >
          <div className="relative aspect-[4/5] max-h-[52vh] overflow-hidden rounded-2xl shadow-xl">
            <LocalImage
              src={interiorImage}
              alt="فضای داخلی رستوران Humazd"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 33vw"
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={SLIDE_VIEWPORT}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="absolute -bottom-4 start-4 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg sm:start-6"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-brand/10 text-orange-brand">
              <ChefHat className="h-5 w-5" />
            </span>
            <div>
              <p className="font-serif text-lg font-bold text-charcoal">10+</p>
              <p className="text-xs text-neutral-500">سال تجربه</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl bg-cream/80 p-6 shadow-lg lg:col-span-4 lg:p-8"
        >
          <div className="mb-6 flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-brand" />
            <h3 className="font-serif text-lg font-bold text-charcoal">
              چرا ما را انتخاب کنید
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {aboutFeatures.map((f, i) => {
              const Icon = iconMap[f.icon];
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={SLIDE_VIEWPORT}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.45 }}
                  className="rounded-xl border border-neutral-100 bg-white p-4 transition hover:shadow-md"
                >
                  <Icon className="mb-2 h-6 w-6 text-orange-brand" />
                  <p className="text-sm font-semibold text-charcoal">{f.title}</p>
                  <p className="mt-1 text-xs text-neutral-500">{f.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
