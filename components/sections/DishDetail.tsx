"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  AlertTriangle,
  Clock,
  Leaf,
  Minus,
  Plus,
  Scale,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { LocalImage } from "@/components/ui/LocalImage";
import { useCartOptional } from "@/components/cart/CartProvider";
import type { DishDetail, DishHotspot, ProcessStep } from "@/lib/dishes-data";

interface DishDetailProps {
  dish: DishDetail;
}

/* ── Shared: quantity selector ─────────────────────────────────────── */

function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  compact = false,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  compact?: boolean;
}) {
  const btnSize = compact ? "h-8 w-8" : "h-10 w-10";
  return (
    <div
      className={`flex items-center rounded-full border border-gray-700 bg-[#111111] ${
        compact ? "px-1.5 py-0.5" : "px-2 py-1"
      }`}
    >
      <button
        type="button"
        aria-label="کاهش تعداد"
        onClick={onDecrease}
        className={`flex ${btnSize} items-center justify-center text-gray-400 transition hover:text-white`}
      >
        <Minus className={compact ? "h-3 w-3" : "h-4 w-4"} />
      </button>
      <span
        className={`min-w-[2rem] text-center font-semibold text-white ${
          compact ? "text-sm" : "text-lg"
        }`}
      >
        {quantity}
      </span>
      <button
        type="button"
        aria-label="افزایش تعداد"
        onClick={onIncrease}
        className={`flex ${btnSize} items-center justify-center text-gray-400 transition hover:text-white`}
      >
        <Plus className={compact ? "h-3 w-3" : "h-4 w-4"} />
      </button>
    </div>
  );
}

/* ── 0. Sticky Action Bar ──────────────────────────────────────────── */

function StickyActionBar({
  dish,
  quantity,
  onDecrease,
  onIncrease,
  onAddToCart,
  isAdding,
  scrollYProgress,
}: {
  dish: DishDetail;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onAddToCart: () => void;
  isAdding: boolean;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const y = useTransform(scrollYProgress, [0.55, 0.85], ["100%", "0%"]);

  return (
    <motion.div
      style={{ y }}
      className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-800 bg-[#0a0a0a]/90 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-10">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-gray-800">
            <LocalImage
              src={dish.image}
              alt={dish.name}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-serif text-sm font-semibold text-white sm:text-base">
              {dish.name}
            </p>
            <p className="font-serif text-lg font-bold text-[#F97316] sm:hidden">
              {dish.price}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          <p className="hidden font-serif text-2xl font-bold text-[#F97316] sm:block">
            {dish.price}
          </p>
          <QuantitySelector
            quantity={quantity}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
            compact
          />
          <AnimatedButton
            className="px-5 py-2.5 text-[0.6rem] sm:px-8 sm:text-xs"
            onClick={onAddToCart}
            disabled={isAdding}
          >
            {isAdding ? "..." : "افزودن به سفارش"}
          </AnimatedButton>
        </div>
      </div>
    </motion.div>
  );
}

/* ── 1. Hero ───────────────────────────────────────────────────────── */

function HeroSection({
  dish,
  quantity,
  onDecrease,
  onIncrease,
  onAddToCart,
  isAdding,
  heroRef,
}: {
  dish: DishDetail;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
  onAddToCart: () => void;
  isAdding: boolean;
  heroRef: React.RefObject<HTMLElement | null>;
}) {
  return (
    <section
      ref={heroRef}
      className="relative overflow-x-hidden px-4 pb-20 pt-28 sm:px-6 lg:px-10 lg:pb-28 lg:pt-32"
    >
      <div className="mx-auto grid min-h-[85vh] max-w-7xl grid-cols-1 items-center gap-12 lg:min-h-[90vh] lg:grid-cols-2 lg:gap-8">
        <div className="relative z-10 max-lg:order-2">
          <nav
            aria-label="مسیر صفحه"
            className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-gray-500 sm:text-xs"
          >
            {dish.breadcrumb}
          </nav>

          <p className="mt-4 text-sm font-medium uppercase tracking-[0.22em] text-[#F97316]">
            {dish.subtitle}
          </p>

          <h1 className="font-serif mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            {dish.name}
          </h1>

          <p className="mt-6 max-w-lg text-base font-light leading-relaxed text-gray-400 sm:text-lg">
            {dish.longDescription}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-5 sm:gap-8">
            <p className="font-serif text-4xl font-bold text-[#F97316] sm:text-5xl">
              {dish.price}
            </p>
            <QuantitySelector
              quantity={quantity}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
            />
            <AnimatedButton
              className="px-10 py-4 text-xs sm:text-sm"
              onClick={onAddToCart}
              disabled={isAdding}
            >
              {isAdding ? "در حال افزودن..." : "افزودن به سفارش"}
            </AnimatedButton>
          </div>
        </div>

        <div className="relative max-lg:order-1 lg:min-h-[70vh]">
          <div className="relative mx-auto flex h-[320px] w-full items-center justify-center sm:h-[400px] lg:absolute lg:inset-0 lg:h-full lg:justify-end">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
              className="relative h-[280px] w-[280px] sm:h-[360px] sm:w-[360px] lg:h-[min(52vw,560px)] lg:w-[min(52vw,560px)] lg:-translate-x-1/4"
            >
              <LocalImage
                src={dish.plateImage}
                alt={dish.name}
                fill
                priority
                className="object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.6)]"
                sizes="(max-width: 768px) 80vw, 560px"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 2. Flavor Anatomy (Hotspots) ──────────────────────────────────── */

function HotspotNode({
  hotspot,
  isActive,
  onEnter,
  onLeave,
}: {
  hotspot: DishHotspot;
  isActive: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="absolute z-20"
      style={{ top: hotspot.top, left: hotspot.left }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <button
        type="button"
        aria-label={`کاوش ${hotspot.name}`}
        className="relative flex h-5 w-5 items-center justify-center"
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F97316] opacity-60" />
        <span className="relative inline-flex h-3 w-3 rounded-full bg-[#F97316] ring-2 ring-white ring-offset-2 ring-offset-transparent" />
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute left-1/2 top-6 z-30 w-56 -translate-x-1/2 rounded-lg border border-gray-800 bg-[#111] p-4 shadow-xl sm:w-64"
          >
            <p className="font-serif text-sm font-semibold text-white">
              {hotspot.name}
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-400">
              {hotspot.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FlavorAnatomySection({ dish }: { dish: DishDetail }) {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  return (
    <section className="relative">
      <div className="relative h-[60vh] overflow-hidden md:h-[80vh]">
        <LocalImage
          src={dish.anatomyImage}
          alt={`آناتومی ${dish.name}`}
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]/40" />

        <div className="absolute inset-0">
          {dish.hotspots.map((hotspot) => (
            <HotspotNode
              key={hotspot.id}
              hotspot={hotspot}
              isActive={activeHotspot === hotspot.id}
              onEnter={() => setActiveHotspot(hotspot.id)}
              onLeave={() => setActiveHotspot(null)}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-4 z-10 sm:bottom-12 sm:left-6 lg:left-10">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
            آناتومی طعم
          </p>
          <h2 className="font-serif mt-2 text-2xl font-bold text-white sm:text-3xl">
            هر لایه را کشف کنید
          </h2>
          <p className="mt-2 max-w-xs text-sm text-gray-400">
            روی نقاط درخشان بایستید تا مواد اولیه‌ای که این غذا را می‌سازند
            ببینید.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ── 3. Taste Profile ───────────────────────────────────────────────── */

function TasteBar({
  label,
  value,
  delay,
}: {
  label: string;
  value: number;
  delay: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest text-gray-500">
          {label}
        </span>
        <span className="text-xs font-medium text-gray-400">{value}%</span>
      </div>
      <div className="h-1 overflow-hidden rounded-full bg-gray-800">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-[#F97316]"
        />
      </div>
    </div>
  );
}

function TasteProfileSection({ dish }: { dish: DishDetail }) {
  const specCards = [
    { icon: Clock, label: "زمان آماده‌سازی", value: dish.prepTime },
    { icon: Scale, label: "کالری", value: dish.calories },
    { icon: AlertTriangle, label: "آلرژن‌ها", value: dish.allergens },
    { icon: Leaf, label: "وگان", value: dish.vegan },
  ] as const;

  const bars = [
    { label: "تندی", value: dish.tasteProfile.spiciness },
    { label: "شیرینی", value: dish.tasteProfile.sweetness },
    { label: "اسیدیته", value: dish.tasteProfile.acidity },
    { label: "غنای طعم", value: dish.tasteProfile.richness },
  ];

  return (
    <section className="border-t border-gray-800 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-center text-3xl font-bold text-white sm:text-4xl">
          پروفایل طعم
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col justify-center gap-6">
            {bars.map((bar, i) => (
              <TasteBar
                key={bar.label}
                label={bar.label}
                value={bar.value}
                delay={i * 0.12}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {specCards.map(({ icon: Icon, label, value }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex flex-col gap-3 rounded-xl border border-gray-800 bg-[#111] p-5 sm:p-6"
              >
                <Icon className="h-5 w-5 text-[#F97316]" strokeWidth={1.75} />
                <p className="text-[0.65rem] uppercase tracking-widest text-gray-500">
                  {label}
                </p>
                <p className="text-sm font-medium text-white">{value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 4. Culinary Process ───────────────────────────────────────────── */

function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="relative border-s border-gray-800 ps-8 sm:ps-10">
      {steps.map((step, i) => (
        <motion.div
          key={step.step}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.15, duration: 0.6 }}
          className={`relative ${i < steps.length - 1 ? "pb-12" : ""}`}
        >
          <span className="absolute -start-[2.35rem] top-1 flex h-3 w-3 items-center justify-center sm:-start-[2.6rem]">
            <span className="absolute h-3 w-3 animate-pulse rounded-full bg-[#F97316]/40" />
            <span className="relative h-2 w-2 rounded-full bg-[#F97316] shadow-[0_0_12px_rgba(249,115,22,0.8)]" />
          </span>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#F97316]">
            {step.step}
          </p>
          <h3 className="font-serif mt-2 text-xl font-semibold text-white sm:text-2xl">
            {step.title}
          </h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-gray-400">
            {step.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function CulinaryProcessSection({ dish }: { dish: DishDetail }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  return (
    <section
      ref={sectionRef}
      className="border-t border-gray-800 px-4 py-20 sm:px-6 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative h-[420px] overflow-hidden rounded-2xl sm:h-[520px] lg:h-[640px]">
          <motion.div style={{ scale }} className="relative h-full w-full">
            <LocalImage
              src={dish.processImage}
              alt="آشپز در حال آماده‌سازی غذا"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>
          <div className="absolute inset-0 bg-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#F97316]">
            پشت خط سرو
          </p>
          <h2 className="font-serif mt-3 text-3xl font-bold text-white sm:text-4xl">
            هنر آماده‌سازی
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-400">
            هر بشقاب رقصی از آتش، صبر و دقت است — از تأمین مواد تا لمس نهایی
            در میز شما.
          </p>
          <div className="mt-10">
            <ProcessTimeline steps={dish.processSteps} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── 5. Scatter Gallery ─────────────────────────────────────────────── */

function ScatterGallerySection({ dish }: { dish: DishDetail }) {
  const [hovered, setHovered] = useState(false);

  return (
    <section className="border-t border-gray-800 px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-center text-3xl font-bold text-white sm:text-4xl">
          نگاهی نزدیک‌تر
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-sm text-gray-500">
          برای کشف داستان بصری {dish.name} هاور کنید
        </p>

        <div
          className="relative mx-auto mt-14 h-[420px] max-w-3xl sm:h-[500px]"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {dish.galleryImages.map((img, i) => (
            <motion.div
              key={img.src + i}
              animate={{
                x: hovered ? img.hoverX : 0,
                y: hovered ? img.hoverY : 0,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className={`absolute aspect-[4/5] w-48 overflow-hidden rounded-lg border border-gray-700 shadow-2xl sm:w-64 ${img.className}`}
            >
              <LocalImage
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="256px"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── 6. Perfect Pairing ─────────────────────────────────────────────── */

function PerfectPairingSection({ dish }: { dish: DishDetail }) {
  return (
    <section className="border-t border-gray-800 px-4 py-20 pb-32 sm:px-6 lg:px-10 lg:py-28 lg:pb-36">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-serif text-2xl font-bold text-white sm:text-3xl">
          به‌خوبی با این‌ها جفت می‌شود…
        </h2>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:gap-6">
          {dish.pairings.map((pair) => (
            <div
              key={pair.id}
              className="group relative aspect-[3/4] flex-1 overflow-hidden rounded-xl"
            >
              <LocalImage
                src={pair.image}
                alt={pair.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
                <div>
                  <p className="font-serif text-lg font-semibold text-white">
                    {pair.name}
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#F97316]">
                    {pair.price}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={`افزودن ${pair.name}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F97316] text-[#F97316] transition hover:bg-[#F97316] hover:text-white"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/menu"
            className="text-sm font-medium uppercase tracking-widest text-gray-500 transition hover:text-[#F97316]"
          >
            ← بازگشت به منو
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Main export ─────────────────────────────────────────────────────── */

export function DishDetail({ dish }: DishDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const cart = useCartOptional();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => q + 1);

  const handleAddToCart = async () => {
    if (!cart) return;
    setIsAdding(true);
    try {
      await cart.addToCart(Number(dish.id), quantity);
      setQuantity(1);
    } catch {
      /* auth redirect or error */
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white/85">
      <StickyActionBar
        dish={dish}
        quantity={quantity}
        onDecrease={dec}
        onIncrease={inc}
        onAddToCart={() => void handleAddToCart()}
        isAdding={isAdding}
        scrollYProgress={scrollYProgress}
      />

      <HeroSection
        dish={dish}
        quantity={quantity}
        onDecrease={dec}
        onIncrease={inc}
        onAddToCart={() => void handleAddToCart()}
        isAdding={isAdding}
        heroRef={heroRef}
      />

      <FlavorAnatomySection dish={dish} />
      <TasteProfileSection dish={dish} />
      <CulinaryProcessSection dish={dish} />
      <ScatterGallerySection dish={dish} />
      <PerfectPairingSection dish={dish} />
    </div>
  );
}
