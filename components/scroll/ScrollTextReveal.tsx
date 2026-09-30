"use client";

import { useRef, useMemo, type ElementType } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
  type UseScrollOptions,
} from "framer-motion";
import { clsx } from "clsx";

const DEFAULT_OFFSET: NonNullable<UseScrollOptions["offset"]> = [
  "start 80%",
  "start 20%",
];

const DEFAULT_DIM_OPACITY = 0.15;
const DEFAULT_LIT_OPACITY = 1;

export interface ScrollTextRevealProps {
  /** Full text content — split into words for sequential scroll reveal */
  text: string;
  /** Wrapper element classes (layout, typography, color) */
  className?: string;
  /** Optional per-word classes */
  wordClassName?: string;
  /** Scroll range mapped to the full reveal sequence */
  offset?: UseScrollOptions["offset"];
  /** Semantic wrapper tag */
  as?: ElementType;
  /** Opacity before a word is revealed */
  dimOpacity?: number;
  /** Opacity once a word is fully revealed */
  litOpacity?: number;
}

interface RevealWordProps {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  dimOpacity: number;
  litOpacity: number;
  className?: string;
}

function RevealWord({
  word,
  index,
  total,
  scrollYProgress,
  dimOpacity,
  litOpacity,
  className,
}: RevealWordProps) {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(
    scrollYProgress,
    [0, start, end, 1],
    [dimOpacity, dimOpacity, litOpacity, litOpacity]
  );

  return (
    <motion.span
      style={{ opacity }}
      className={clsx("inline-block will-change-[opacity]", className)}
    >
      {word}
      {index < total - 1 ? "\u00A0" : null}
    </motion.span>
  );
}

export function ScrollTextReveal({
  text,
  className,
  wordClassName,
  offset = DEFAULT_OFFSET,
  as: Component = "p",
  dimOpacity = DEFAULT_DIM_OPACITY,
  litOpacity = DEFAULT_LIT_OPACITY,
}: ScrollTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset,
  });

  const words = useMemo(
    () => text.trim().split(/\s+/).filter(Boolean),
    [text]
  );

  if (words.length === 0) return null;

  return (
    <Component ref={containerRef} className={className}>
      {words.map((word, index) => (
        <RevealWord
          key={`${word}-${index}`}
          word={word}
          index={index}
          total={words.length}
          scrollYProgress={scrollYProgress}
          dimOpacity={dimOpacity}
          litOpacity={litOpacity}
          className={wordClassName}
        />
      ))}
    </Component>
  );
}
