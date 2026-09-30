"use client";

import {
  useLayoutEffect,
  useState,
  useCallback,
  type RefObject,
} from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { HERO_PLATE_IMAGE } from "@/lib/menu-data";

interface SlotMetrics {
  startX: number;
  startY: number;
  endX: number;
  endDocCenterY: number;
  startWidth: number;
  endWidth: number;
  scrollRange: number;
}

const LANDING_OFFSET = 80;
const FALLBACK_SIZE = 400;

interface ScrollLinkedPlateProps {
  heroSlotRef: RefObject<HTMLDivElement | null>;
  menuSlotRef: RefObject<HTMLDivElement | null>;
}

export function ScrollLinkedPlate({
  heroSlotRef,
  menuSlotRef,
}: ScrollLinkedPlateProps) {
  const [metrics, setMetrics] = useState<SlotMetrics | null>(null);

  const measure = useCallback(() => {
    const heroEl = heroSlotRef.current;
    if (!heroEl) return false;

    const hero = heroEl.getBoundingClientRect();
    if (hero.width < 10 || hero.height < 10) return false;

    const startX = hero.left + hero.width / 2;
    const startY = hero.top + hero.height / 2;
    const scrollY = window.scrollY;

    const menuEl = menuSlotRef.current;
    if (menuEl) {
      const menu = menuEl.getBoundingClientRect();
      const endX = menu.left + menu.width / 2;
      const endDocCenterY = menu.top + scrollY + menu.height / 2;
      const scrollRange = Math.max(300, endDocCenterY - startY - LANDING_OFFSET);

      setMetrics({
        startX,
        startY,
        endX,
        endDocCenterY,
        startWidth: hero.width,
        endWidth: menu.width > 10 ? menu.width : hero.width,
        scrollRange,
      });
    } else {
      /* Hero-only fallback until menu slot mounts */
      setMetrics({
        startX,
        startY,
        endX: startX,
        endDocCenterY: startY + 600,
        startWidth: hero.width,
        endWidth: hero.width,
        scrollRange: 600,
      });
    }

    return true;
  }, [heroSlotRef, menuSlotRef]);

  useLayoutEffect(() => {
    let cancelled = false;

    const run = () => {
      if (!cancelled) measure();
    };

    run();
    const raf = requestAnimationFrame(run);
    const t1 = window.setTimeout(run, 50);
    const t2 = window.setTimeout(run, 200);
    const t3 = window.setTimeout(run, 600);

    const ro = new ResizeObserver(run);
    const observeAll = () => {
      if (heroSlotRef.current) ro.observe(heroSlotRef.current);
      if (menuSlotRef.current) ro.observe(menuSlotRef.current);
    };
    observeAll();
    window.setTimeout(observeAll, 200);

    window.addEventListener("resize", run);
    window.addEventListener("load", run);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      ro.disconnect();
      window.removeEventListener("resize", run);
      window.removeEventListener("load", run);
    };
  }, [measure, heroSlotRef, menuSlotRef]);

  const { scrollY } = useScroll();

  if (!metrics) return null;

  return <PlateMotion metrics={metrics} scrollY={scrollY} onLayout={measure} />;
}

function PlateMotion({
  metrics,
  scrollY,
  onLayout,
}: {
  metrics: SlotMetrics;
  scrollY: MotionValue<number>;
  onLayout: () => void;
}) {
  const {
    startX,
    startY,
    endX,
    endDocCenterY,
    startWidth,
    endWidth,
    scrollRange,
  } = metrics;

  const plateSize = Math.max(startWidth, FALLBACK_SIZE);

  /**
   * Fine-tune landing:
   * - LANDING_OFFSET (top of file): higher = lands sooner
   * - rotate array [8, 2, 0]: hero tilt → flat on menu
   * - scale end value endWidth/startWidth: smaller = shrinks more on landing
   */
  const x = useTransform(scrollY, (sy) => {
    const t = Math.min(Math.max(sy / scrollRange, 0), 1);
    return startX + t * (endX - startX);
  });

  const y = useTransform(scrollY, (sy) => {
    if (sy <= scrollRange) return startY;
    return endDocCenterY - sy;
  });

  const scale = useTransform(
    scrollY,
    [0, scrollRange],
    [1, endWidth / startWidth],
    { clamp: true },
  );

  const rotate = useTransform(
    scrollY,
    [0, scrollRange * 0.45, scrollRange],
    [8, 2, 0],
    { clamp: true },
  );

  const smoothX = useSpring(x, { stiffness: 120, damping: 28, mass: 0.4 });
  const smoothY = useSpring(y, { stiffness: 120, damping: 28, mass: 0.4 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 24 });
  const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 22 });

  return (
    <motion.div
      className="pointer-events-none fixed z-[60]"
      style={{
        left: smoothX,
        top: smoothY,
        x: "-50%",
        y: "-50%",
        scale: smoothScale,
        rotate: smoothRotate,
      }}
      onAnimationComplete={onLayout}
    >
      {/* Intro: plate drops from above */}
      <motion.div
        initial={{ y: "-130vh", rotate: -14, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 52,
          damping: 15,
          mass: 1,
          delay: 0.15,
        }}
        className="relative"
        style={{ width: plateSize, height: plateSize }}
      >
        <Image
          src={HERO_PLATE_IMAGE}
          alt="Signature dish on ceramic plate"
          width={900}
          height={900}
          priority
          className="h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.55)]"
          onLoad={onLayout}
        />
      </motion.div>
    </motion.div>
  );
}
