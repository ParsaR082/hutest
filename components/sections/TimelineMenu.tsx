"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { LocalImage } from "@/components/ui/LocalImage";
import { ScrollTextReveal } from "@/components/scroll/ScrollTextReveal";
import { addCartItem } from "@/lib/api/cart";
import { getAccessToken } from "@/lib/auth/storage";
import {
  MENU_FILTER_TABS,
  filterTimelineItems,
  type MenuFilterId,
  type TimelineMenuItem,
} from "@/lib/menu-timeline-data";

const POWDER_TRAILS = [
  {
    src: "/images/menu/trails/salt-trail-1.svg",
    className:
      "absolute top-[6%] left-[48%] w-44 rotate-[35deg] opacity-40 lg:w-56 lg:left-[50%]",
  },
  {
    src: "/images/menu/trails/salt-trail-2.svg",
    className:
      "absolute top-[22%] right-[18%] w-36 -rotate-[25deg] opacity-35 lg:w-48 lg:right-[22%]",
  },
  {
    src: "/images/menu/trails/salt-trail-3.svg",
    className:
      "absolute top-[38%] left-[42%] w-52 rotate-[18deg] opacity-30 lg:w-64 lg:left-[44%]",
  },
  {
    src: "/images/menu/trails/salt-trail-4.svg",
    className:
      "absolute top-[52%] left-[20%] w-40 -rotate-[40deg] opacity-35 lg:w-52 lg:left-[24%]",
  },
  {
    src: "/images/menu/trails/salt-trail-5.svg",
    className:
      "absolute top-[66%] right-[20%] w-48 rotate-[28deg] opacity-30 lg:w-60 lg:right-[24%]",
  },
  {
    src: "/images/menu/trails/salt-trail-6.svg",
    className:
      "absolute top-[80%] left-[46%] w-40 rotate-[12deg] opacity-25 lg:w-52 lg:left-[48%]",
  },
] as const;

function PowderTrailBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 hidden overflow-hidden md:block"
    >
      {POWDER_TRAILS.map((trail) => (
        <LocalImage
          key={trail.src}
          src={trail.src}
          alt=""
          width={400}
          height={400}
          className={`pointer-events-none select-none ${trail.className}`}
        />
      ))}
    </div>
  );
}

function RotatingPlate({
  image,
  alt,
  rotate,
}: {
  image: string;
  alt: string;
  rotate: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{ rotate }}
      className="relative h-52 w-52 sm:h-60 sm:w-60 lg:h-72 lg:w-72"
    >
      <LocalImage
        src={image}
        alt={alt}
        fill
        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
        sizes="(max-width: 768px) 60vw, 288px"
      />
    </motion.div>
  );
}

function MenuItem({
  item,
  index,
}: {
  item: TimelineMenuItem;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const plateRight = index % 2 === 0;
  const dishHref = `/menu/${item.slug}`;
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [addError, setAddError] = useState(false);

  const handleAddToOrder = async () => {
    const token = getAccessToken();
    if (!token) {
      window.location.href = `/auth?next=${encodeURIComponent(dishHref)}`;
      return;
    }
    const menuItemId = Number(item.id);
    if (!Number.isInteger(menuItemId)) return;
    setAdding(true);
    setAddError(false);
    try {
      await addCartItem(token, { menu_item_id: menuItemId, quantity: 1 });
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch {
      setAddError(true);
      window.setTimeout(() => setAddError(false), 2500);
    } finally {
      setAdding(false);
    }
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rotateRaw = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const rotate = useSpring(rotateRaw, {
    stiffness: 80,
    damping: 22,
    mass: 0.6,
  });

  const textAlign = plateRight
    ? "md:order-1 md:pe-8 md:text-start lg:pe-16"
    : "md:order-2 md:ps-8 md:text-end lg:ps-16";

  return (
    <article
      ref={ref}
      className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16"
    >
      <Link
        href={dishHref}
        className="relative z-10 flex justify-center transition-opacity hover:opacity-90 md:hidden"
        aria-label={`مشاهده ${item.name}`}
      >
        <RotatingPlate image={item.image} alt={item.name} rotate={rotate} />
      </Link>

      <div
        className={`relative z-10 max-w-md max-md:order-2 max-md:text-center ${textAlign}`}
      >
        <ScrollTextReveal
          text={item.subtitle}
          as="p"
          className="mb-1 text-xs font-medium uppercase tracking-[0.2em] text-[#F97316]/80"
        />
        <ScrollTextReveal
          text={item.name}
          as="h3"
          className="font-script text-4xl leading-tight text-[#FFFDF7] sm:text-5xl lg:text-[3.25rem]"
        />
        <ScrollTextReveal
          text={item.description}
          as="p"
          className="mt-3 text-sm font-light leading-relaxed text-gray-400 sm:text-base"
        />
        <ScrollTextReveal
          text={item.price}
          as="p"
          className="mt-5 font-serif text-2xl font-semibold text-[#F97316]"
        />

        <div className="mt-8 max-md:flex max-md:justify-center">
          <AnimatedButton
            type="button"
            onClick={() => void handleAddToOrder()}
            className="inline-flex w-full max-w-sm px-10 py-4 text-xs sm:text-sm md:w-auto"
          >
            {adding ? "در حال افزودن..." : added ? "به سفارش اضافه شد" : "افزودن به سفارش"}
          </AnimatedButton>
          {addError && <p className="mt-2 text-xs text-red-400">افزودن به سفارش انجام نشد. دوباره تلاش کنید.</p>}
        </div>
      </div>

      <div
        className={`relative z-10 hidden md:flex ${
          plateRight
            ? "md:order-2 md:justify-start"
            : "md:order-1 md:justify-end"
        }`}
      >
        <Link
          href={dishHref}
          className={`transition-transform hover:scale-[1.02] ${
            plateRight
              ? "translate-x-[25%] lg:translate-x-[35%]"
              : "-translate-x-[25%] lg:-translate-x-[35%]"
          }`}
          aria-label={`مشاهده ${item.name}`}
        >
          <RotatingPlate image={item.image} alt={item.name} rotate={rotate} />
        </Link>
      </div>
    </article>
  );
}

function MagneticFilter({
  active,
  onChange,
}: {
  active: MenuFilterId;
  onChange: (id: MenuFilterId) => void;
}) {
  return (
    <div className="sticky top-8 z-50 mx-auto mb-16 flex max-w-fit justify-center">
      <div className="hide-scrollbar flex gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#111111]/70 p-1.5 shadow-xl backdrop-blur-md">
        {MENU_FILTER_TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`relative rounded-full px-5 py-3 text-sm font-medium transition-colors sm:py-2.5 ${
                isActive ? "text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="timelineMenuFilter"
                  className="absolute inset-0 -z-10 rounded-full bg-[#F97316]"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function TimelineMenu({ items }: { items: TimelineMenuItem[] }) {
  const [activeFilter, setActiveFilter] = useState<MenuFilterId>("all");

  const filteredItems = useMemo(
    () => filterTimelineItems(items, activeFilter),
    [items, activeFilter]
  );

  return (
    <section className="relative bg-[#111111] px-4 pb-24 pt-8 sm:px-6 lg:px-10 lg:pb-32">
      <PowderTrailBackground />

      {/* Central timeline connector */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 z-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[#F97316]/40 to-transparent md:block"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-8 text-center md:mb-12">
            <p lang="en" className="font-script script-label-en text-2xl text-[#F97316] sm:text-3xl">
              The Timeline
            </p>
          <h2 className="font-serif mt-1 text-3xl font-bold text-white sm:text-4xl">
            غذاهای ما
          </h2>
        </header>

        <MagneticFilter active={activeFilter} onChange={setActiveFilter} />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-20 md:gap-32 lg:gap-40"
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.07,
                  ease: [0.22, 1, 0.36, 1] as const,
                }}
              >
                <MenuItem item={item} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <p className="py-16 text-center text-gray-500">
            هنوز غذایی در این دسته‌بندی نیست.
          </p>
        )}
      </div>
    </section>
  );
}
