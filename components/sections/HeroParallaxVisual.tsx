"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import { clsx } from "clsx";
import { LocalImage } from "@/components/ui/LocalImage";
import { images } from "@/lib/images";

export interface HeroParallaxVisualProps {
  /** Scroll progress from the parent hero section (`0` → `1`) */
  scrollYProgress: MotionValue<number>;
  className?: string;
}

/** Slow drift — far layer (background) */
const BG_Y: [string, string] = ["0%", "-15%"];
/** Fast lift — near layer (foreground), ~2.7× background travel */
const PAN_Y: [string, string] = ["0%", "-40%"];
const SCROLL_FADE: [number, number, number] = [1, 0.88, 0.4];
const SCROLL_FADE_RANGE: [number, number, number] = [0, 0.6, 1];

export function HeroParallaxVisual({
  scrollYProgress,
  className,
}: HeroParallaxVisualProps) {
  const bgY = useTransform(scrollYProgress, [0, 1], BG_Y);
  const panY = useTransform(scrollYProgress, [0, 1], PAN_Y);

  const ingredientsScrollOpacity = useTransform(
    scrollYProgress,
    SCROLL_FADE_RANGE,
    SCROLL_FADE,
  );
  const panScrollOpacity = useTransform(
    scrollYProgress,
    SCROLL_FADE_RANGE,
    SCROLL_FADE,
  );

  return (
    <div
      className={clsx(
        "relative flex h-[300px] w-full items-center justify-center overflow-visible sm:h-[420px] md:h-[520px] lg:h-[650px] xl:h-[780px]",
        className
      )}
    >
      {/* Background — slow upward parallax (far layer) */}
      <motion.div
        style={{ y: bgY, opacity: ingredientsScrollOpacity }}
        className="absolute inset-0 z-0 flex items-center justify-center will-change-transform"
        aria-hidden
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative h-full w-full origin-center scale-110 md:scale-100"
        >
          <LocalImage
            src={images.menu.ingredientsBg}
            alt=""
            fill
            priority
            className="object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 95vw, 780px"
          />
        </motion.div>
      </motion.div>

      {/* Foreground — fast upward parallax (near layer) */}
      <motion.div
        style={{ y: panY, opacity: panScrollOpacity }}
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center will-change-transform"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 16,
            mass: 0.85,
          }}
          className="relative aspect-square w-[72%] max-w-[220px] origin-center sm:w-[76%] sm:max-w-[320px] md:w-[85%] md:max-w-[420px] lg:max-w-[560px] xl:w-full xl:max-w-[700px]"
        >
          <LocalImage
            src={images.menu.pan}
            alt="Sizzling steak in a cast-iron pan"
            fill
            priority
            className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 76vw, 780px"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
