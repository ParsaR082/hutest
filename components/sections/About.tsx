"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Leaf, Sparkles } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { LocalImage } from "@/components/ui/LocalImage";
import { formatToman } from "@/lib/format-price";
import { images } from "@/lib/images";
import { useSiteImages } from "@/lib/hooks/useSiteImages";

const SLIDE_VIEWPORT = { once: false, amount: 0.3 } as const;

const FEATURES = [
  "دود چوب سیب ۴۸ ساعته",
  "برش wagyu درجه A5",
  "تمام‌شده با زغال در میز",
  "لعاب ترافل سرآشپز",
] as const;

const FLAVOR_NODES = [
  {
    id: "spicy",
    icon: Flame,
    label: "تند",
    className: "left-[4%] top-[8%] sm:left-[8%] sm:top-[12%]",
    delay: 0.15,
  },
  {
    id: "aromatic",
    icon: Leaf,
    label: "معطر",
    className: "bottom-[12%] left-[2%] sm:bottom-[16%] sm:left-[6%]",
    delay: 0.3,
  },
  {
    id: "signature",
    icon: Sparkles,
    label: "Signature",
    className: "right-[4%] top-[10%] sm:right-[10%] sm:top-[14%]",
    delay: 0.45,
  },
] as const;

function FlavorNode({
  icon: Icon,
  label,
  className,
  delay,
}: {
  icon: typeof Flame;
  label: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={SLIDE_VIEWPORT}
      transition={{ type: "spring", stiffness: 420, damping: 18, delay }}
      className={`absolute z-20 ${className}`}
    >
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors duration-300 hover:border-[#F97316]">
        <Icon className="h-4 w-4 text-[#F97316]" strokeWidth={2} />
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
    </motion.div>
  );
}

/** Slide 4 — Signature dish content on dark background */
export function About() {
  const siteImages = useSiteImages();
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const dishSrc =
    siteImages.homepage_signature_dish ??
    (usePlaceholder ? images.signature.dishPlaceholder : images.signature.dish);

  return (
    <section
      id="signature-dish"
      aria-labelledby="signature-dish-heading"
      className="relative flex h-screen w-full shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden bg-[#1a1a1a]"
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-10">
        <div className="relative flex w-full flex-col items-center overflow-hidden lg:flex-row lg:gap-8">
          <div className="relative z-10 flex w-full flex-col justify-center lg:w-1/2">
            <p
              aria-hidden
              className="pointer-events-none absolute start-2 top-1/2 z-0 hidden -translate-y-1/2 select-none font-serif text-7xl font-bold uppercase tracking-[0.2em] text-transparent xl:start-6 xl:text-8xl lg:block"
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.08)",
                writingMode: "vertical-rl",
                transform: "translateY(-50%) rotate(180deg)",
              }}
            >
              SIGNATURE
            </p>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={SLIDE_VIEWPORT}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full lg:ps-16"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={SLIDE_VIEWPORT}
                transition={{ duration: 0.5, delay: 0.05 }}
                className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]"
              >
                شاهکار سرآشپز
              </motion.p>

              <motion.h2
                id="signature-dish-heading"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={SLIDE_VIEWPORT}
                transition={{ duration: 0.55, delay: 0.12 }}
                className="font-serif mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.75rem]"
              >
                توماهوک wagyu دودی
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={SLIDE_VIEWPORT}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base"
              >
                برشی باشکوه، دو روز در دود چوب سیب، سپس روی زغال زنده تا پوست
                مثل شیشه بترکد. در میز برش می‌خورد و با کره قارچ ترافل سیاه
                تمام می‌شود.
              </motion.p>

              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-x-6">
                {FEATURES.map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={SLIDE_VIEWPORT}
                    transition={{ delay: 0.25 + i * 0.08, duration: 0.45 }}
                    className="flex items-center gap-2.5"
                  >
                    <Check
                      className="h-4 w-4 shrink-0 text-[#F97316]"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm text-white/80">{feature}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={SLIDE_VIEWPORT}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6 flex flex-wrap items-center gap-4"
              >
                <p className="font-serif inline-block text-3xl font-bold text-[#F97316] sm:text-4xl">
                  {formatToman(6_400_000)}
                </p>
                <AnimatedButton href="/menu/main-dish" className="px-8 py-3.5">
                  سفارش امضایی
                </AnimatedButton>
              </motion.div>
            </motion.div>
          </div>

          <div className="relative order-first flex w-full items-center justify-center lg:order-none lg:w-1/2">
            <div
              aria-hidden
              className="absolute z-0 h-[280px] w-[280px] rounded-full bg-orange-brand/15 blur-[100px] md:h-[420px] md:w-[420px]"
            />

            <div className="relative z-10 mx-auto aspect-square w-full max-w-xs sm:max-w-sm lg:max-w-md">
              {FLAVOR_NODES.map((node) => (
                <FlavorNode key={node.id} {...node} />
              ))}

              <motion.div
                initial={{ opacity: 0, scale: 0.88, y: 40 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={SLIDE_VIEWPORT}
                transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="relative z-10 lg:-translate-x-8"
              >
                <motion.div
                  animate={{ y: [-12, 12, -12] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <LocalImage
                    src={dishSrc}
                    alt="توماهوک wagyu دودی — غذای امضای سرآشپز"
                    width={640}
                    height={640}
                    onError={() => setUsePlaceholder(true)}
                    className="h-auto w-full bg-transparent object-contain drop-shadow-[0_32px_56px_rgba(0,0,0,0.45)]"
                    sizes="(max-width: 1024px) 90vw, 640px"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
