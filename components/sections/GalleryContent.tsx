"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react";
import { LocalImage } from "@/components/ui/LocalImage";
import { assetSrc } from "@/lib/asset";
import type { GalleryCategory, GalleryItem } from "@/lib/api/types";

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  food: "غذا",
  interior: "فضای داخلی",
  exterior: "نمای بیرونی",
  atmosphere: "فضا و حس‌وحال",
  events: "رویدادها",
  team: "تیم ما",
  special_dishes: "بشقاب‌های ویژه",
  behind_the_scenes: "پشت صحنه",
};

const CATEGORY_ORDER: GalleryCategory[] = [
  "food",
  "special_dishes",
  "interior",
  "exterior",
  "atmosphere",
  "events",
  "team",
  "behind_the_scenes",
];

function GalleryImg({
  item,
  className,
  sizes,
  priority,
}: {
  item: GalleryItem;
  className?: string;
  sizes: string;
  priority?: boolean;
}) {
  return (
    <LocalImage
      src={item.image}
      alt={item.alt_text || item.title || "تصویر گالری Humazd"}
      fill
      priority={priority}
      sizes={sizes}
      className={className}
    />
  );
}

function GalleryHero() {
  const marqueeItems = Object.values(CATEGORY_LABELS);
  return (
    <section className="relative flex min-h-[46vh] flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] pt-28 pb-16 text-center sm:min-h-[52vh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_60%)]" />
      <p lang="en" className="font-script script-label-en relative z-10 text-2xl text-[#F97316] sm:text-3xl">
        Our Story in Frames
      </p>
      <h1 className="font-serif relative z-10 mt-3 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
        گالری
      </h1>
      <p className="relative z-10 mx-auto mt-5 max-w-lg px-4 text-sm leading-relaxed text-white/55 sm:text-base">
        لحظه‌هایی از آشپزخانه، سالن و مهمانان Humazd — هر تصویر بخشی از داستانی
        است که هر شب در این رستوران روایت می‌شود.
      </p>

      <div className="relative z-10 mt-10 w-full overflow-hidden border-y border-white/10 py-3">
        <div className="animate-marquee flex w-max gap-8 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.3em] text-white/25">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((label, i) => (
            <span key={i} className="flex items-center gap-8">
              {label}
              <span className="text-[#F97316]/40">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedStrip({ items, onOpen }: { items: GalleryItem[]; onOpen: (id: number) => void }) {
  const [emblaRef] = useEmblaCarousel({ align: "start", loop: items.length > 1, direction: "rtl" });

  if (items.length === 0) return null;

  return (
    <section className="border-b border-white/10 bg-[#0a0a0a] py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316]">Featured</p>
            <h2 className="font-serif mt-2 text-2xl font-bold text-white sm:text-3xl">برگزیده‌ها</h2>
          </div>
        </div>
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container">
            {items.map((item) => (
              <div key={item.id} className="embla__slide">
                <button
                  type="button"
                  onClick={() => onOpen(item.id)}
                  className="group relative block aspect-[16/10] w-full overflow-hidden rounded-2xl"
                >
                  <GalleryImg
                    item={item}
                    className="object-cover transition duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  {item.title && (
                    <span className="absolute inset-x-0 bottom-0 p-5 text-start">
                      <span className="font-serif block text-lg font-semibold text-white">
                        {item.title}
                      </span>
                      <span className="mt-1 block text-xs uppercase tracking-widest text-[#F97316]">
                        {CATEGORY_LABELS[item.category]}
                      </span>
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryFilter({
  active,
  counts,
  onChange,
}: {
  active: GalleryCategory | "all";
  counts: Record<string, number>;
  onChange: (c: GalleryCategory | "all") => void;
}) {
  const available = CATEGORY_ORDER.filter((c) => counts[c] > 0);

  return (
    <div className="sticky top-4 z-40 mx-auto mb-14 flex max-w-full justify-center px-4">
      <div className="hide-scrollbar flex max-w-full gap-2 overflow-x-auto rounded-full border border-white/10 bg-[#111111]/80 p-1.5 shadow-xl backdrop-blur-md">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
            active === "all" ? "text-white" : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {active === "all" && (
            <motion.span
              layoutId="galleryFilter"
              className="absolute inset-0 -z-10 rounded-full bg-[#F97316]"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
          )}
          همه
        </button>
        {available.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
              active === cat ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {active === cat && (
              <motion.span
                layoutId="galleryFilter"
                className="absolute inset-0 -z-10 rounded-full bg-[#F97316]"
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              />
            )}
            {CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>
    </div>
  );
}

function MasonryGrid({ items, onOpen }: { items: GalleryItem[]; onOpen: (id: number) => void }) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <Camera className="h-10 w-10 text-white/15" strokeWidth={1.25} />
        <p className="mt-5 text-sm text-white/40">
          تصویری در این دسته‌بندی هنوز ثبت نشده است.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
      {items.map((item, i) => (
        <motion.button
          key={item.id}
          type="button"
          onClick={() => onOpen(item.id)}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: (i % 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mb-4 block w-full overflow-hidden rounded-2xl break-inside-avoid"
        >
          <span className="relative block w-full" style={{ aspectRatio: i % 5 === 0 ? "3/4" : i % 3 === 0 ? "4/5" : "1/1" }}>
            <GalleryImg
              item={item}
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </span>
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="p-4 text-start">
              {item.title && (
                <p className="font-serif text-sm font-semibold text-white">{item.title}</p>
              )}
              <p className="mt-0.5 text-[0.65rem] uppercase tracking-widest text-[#F97316]">
                {CATEGORY_LABELS[item.category]}
              </p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function Lightbox({
  items,
  activeId,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  activeId: number | null;
  onClose: () => void;
  onNavigate: (id: number) => void;
}) {
  const index = items.findIndex((i) => i.id === activeId);
  const item = index >= 0 ? items[index] : null;

  const goNext = useCallback(() => {
    if (index < 0) return;
    onNavigate(items[(index + 1) % items.length].id);
  }, [index, items, onNavigate]);

  const goPrev = useCallback(() => {
    if (index < 0) return;
    onNavigate(items[(index - 1 + items.length) % items.length].id);
  }, [index, items, onNavigate]);

  useEffect(() => {
    if (!item) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [item, onClose, goNext, goPrev]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#F97316] hover:text-[#F97316]"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                aria-label="قبلی"
                className="absolute start-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#F97316] hover:text-[#F97316] sm:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                aria-label="بعدی"
                className="absolute end-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-[#F97316] hover:text-[#F97316] sm:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[88vh] w-full max-w-4xl flex-col items-center"
          >
            <div className="relative max-h-[74vh] w-full overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetSrc(item.image)}
                alt={item.alt_text || item.title || "تصویر گالری Humazd"}
                className="max-h-[74vh] w-full object-contain"
              />
            </div>
            {(item.title || item.description) && (
              <div className="mt-5 max-w-2xl text-center">
                {item.title && (
                  <p className="font-serif text-xl font-semibold text-white">{item.title}</p>
                )}
                {item.description && (
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{item.description}</p>
                )}
                <p className="mt-3 text-xs uppercase tracking-widest text-[#F97316]">
                  {CATEGORY_LABELS[item.category]}
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function GalleryContent({ items }: { items: GalleryItem[] }) {
  const [category, setCategory] = useState<GalleryCategory | "all">("all");
  const [activeId, setActiveId] = useState<number | null>(null);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const item of items) c[item.category] = (c[item.category] ?? 0) + 1;
    return c;
  }, [items]);

  const featured = useMemo(() => items.filter((i) => i.is_featured), [items]);
  const filtered = useMemo(
    () => (category === "all" ? items : items.filter((i) => i.category === category)),
    [items, category]
  );

  if (items.length === 0) {
    return (
      <main className="bg-[#0a0a0a]">
        <GalleryHero />
        <section className="flex flex-col items-center justify-center px-4 py-28 text-center">
          <Camera className="h-12 w-12 text-white/15" strokeWidth={1.25} />
          <h2 className="font-serif mt-6 text-2xl font-semibold text-white">
            گالری Humazd به‌زودی تکمیل می‌شود
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/45">
            تیم ما در حال آماده‌سازی مجموعه‌ای از بهترین لحظات رستوران است. به
            زودی اینجا را دوباره سر بزنید.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#0a0a0a]">
      <GalleryHero />
      <FeaturedStrip items={featured} onOpen={setActiveId} />

      <section className="px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <CategoryFilter active={category} counts={counts} onChange={setCategory} />
          <MasonryGrid items={filtered} onOpen={setActiveId} />
        </div>
      </section>

      <Lightbox items={filtered} activeId={activeId} onClose={() => setActiveId(null)} onNavigate={setActiveId} />
    </main>
  );
}
