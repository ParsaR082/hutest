"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { Clock, FileText, MapPin } from "lucide-react";
import { LocalImage } from "@/components/ui/LocalImage";
import { images } from "@/lib/images";

const OUTLINE_PHRASE = "داستان خوشمزه ما";

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const INFO_ITEMS = [
  {
    icon: MapPin,
    title: "آدرس ما",
    subtitle: "خیابان گورمه ۱۲۴، منطقه مرکزی",
  },
  {
    icon: Clock,
    title: "ساعات کاری",
    subtitle: "شنبه – جمعه · 11:00 AM – 10:00 PM",
  },
  {
    icon: FileText,
    title: "رزرو",
    subtitle: "+1 (555) 482-0194",
  },
] as const;

function OutlineTypography({ y }: { y: MotionValue<string> }) {
  return (
    <motion.div
      style={{ y }}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 select-none overflow-hidden"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <p
          key={index}
          className="font-serif text-[clamp(2.75rem,7vw,5.5rem)] font-bold leading-[0.92] text-transparent [-webkit-text-stroke:1px_#E5E7EB]"
        >
          {OUTLINE_PHRASE}
        </p>
      ))}
    </motion.div>
  );
}

export function AboutUs() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const outlineY = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="overflow-hidden bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* Section 1 — asymmetric content */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — typographic illusion */}
          <div className="relative min-h-[420px] py-6 sm:min-h-[460px]">
            <OutlineTypography y={outlineY} />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.35 }}
              className="relative z-10"
            >
              <motion.p
                variants={fadeUp}
                className="text-sm font-medium uppercase tracking-[0.22em] text-orange-500"
              >
                کشف کنید
              </motion.p>

              <motion.h2
                variants={fadeUp}
                className="font-serif mt-3 max-w-lg text-4xl font-bold leading-[1.05] text-gray-900 sm:text-5xl lg:text-[3.25rem]"
              >
                {OUTLINE_PHRASE}
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-md text-base leading-relaxed text-gray-600 sm:text-lg"
              >
                متولد از عشق به آشپزی صادقانه و مهمان‌نوازی گرم، آشپزخانه ما
                محصولات فصلی، طعم‌های آتش‌زده و هنر آرام چیدن میز را جشن
                می‌گیرد — جایی که هر بازدید مثل بازگشت به خانه است.
              </motion.p>

              <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href="/about"
                  className="group inline-block border-b border-gray-900 pb-1 text-sm font-medium tracking-wide text-gray-900 transition-colors duration-300 hover:border-orange-500 hover:text-orange-500 sm:text-base"
                >
                  بیشتر درباره ما بدانید
                </Link>
                <Link
                  href="/#reservations"
                  className="group inline-block border-b border-gray-300 pb-1 text-sm font-medium tracking-wide text-gray-500 transition-colors duration-300 hover:border-orange-500 hover:text-orange-500 sm:text-base"
                >
                  میز خود را رزرو کنید
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Right — cinematic image reveal */}
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl sm:aspect-[5/6] lg:aspect-[4/5]">
              <motion.div
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full"
              >
                <LocalImage
                  src={images.about.interior}
                  alt="فضای داخلی رستوران با نور گرم"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Section 2 — info bar */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="mt-16 border-y border-gray-200 sm:mt-20 lg:mt-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-gray-200">
            {INFO_ITEMS.map(({ icon: Icon, title, subtitle }) => (
              <div
                key={title}
                className="flex flex-col items-start gap-3 px-0 py-8 sm:px-6 md:py-10 lg:px-10"
              >
                <Icon
                  className="h-5 w-5 text-orange-500"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <div>
                  <h3 className="font-serif text-lg font-semibold text-gray-900 sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600 sm:text-base">
                    {subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
