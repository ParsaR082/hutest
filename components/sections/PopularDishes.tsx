"use client";

import { useCallback, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import { LocalImage } from "@/components/ui/LocalImage";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useCartOptional } from "@/components/cart/CartProvider";
import { getAccessToken } from "@/lib/auth/storage";

const SLIDE_VIEWPORT = { once: false, amount: 0.3 } as const;

export type PopularDishItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: string;
  image: string;
  bestSeller?: boolean;
};

export function PopularDishes({ dishes }: { dishes: PopularDishItem[] }) {
  const cart = useCartOptional();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleQuickAdd = useCallback(
    async (dish: PopularDishItem, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!getAccessToken()) {
        window.location.href = `/auth?next=/menu/${dish.slug}`;
        return;
      }
      if (!cart) return;
      setAddingId(dish.id);
      try {
        await cart.addToCart(Number(dish.id), 1);
      } finally {
        setAddingId(null);
      }
    },
    [cart]
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: dishes.length > 1,
    slidesToScroll: 1,
    direction: "rtl",
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (dishes.length === 0) {
    return null;
  }

  return (
    <section
      id="popular-dishes"
      className="relative flex h-screen w-full shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden bg-cream"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center"
        >
          <p
            lang="en"
            className="font-script script-label-en text-2xl text-orange-brand sm:text-3xl"
          >
            Our Menu
          </p>
          <h2 className="font-serif mt-1 text-3xl font-bold text-charcoal sm:text-4xl">
            غذاهای محبوب
          </h2>
          <Link
            href="/menu"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-orange-brand transition hover:gap-2"
          >
            مشاهده منوی کامل ←
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={SLIDE_VIEWPORT}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <button
            type="button"
            onClick={scrollPrev}
            aria-label="غذاهای قبلی"
            className="absolute -start-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-charcoal shadow-md transition hover:border-orange-brand hover:text-orange-brand sm:flex lg:-start-5"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="غذاهای بعدی"
            className="absolute -end-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white text-charcoal shadow-md transition hover:border-orange-brand hover:text-orange-brand sm:flex lg:-end-5"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="embla overflow-hidden px-1" ref={emblaRef}>
            <div className="embla__container">
              {dishes.map((dish, i) => (
                <div key={dish.id} className="embla__slide">
                  <motion.article
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={SLIDE_VIEWPORT}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-brand/20 hover:shadow-lg"
                  >
                    <Link href={`/menu/${dish.slug}`} className="relative aspect-square overflow-hidden bg-neutral-50">
                      <LocalImage
                        src={dish.image}
                        alt={dish.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, 25vw"
                      />
                      {dish.bestSeller && (
                        <span className="absolute start-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-orange-brand shadow-sm backdrop-blur-sm">
                          پرفروش
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-lg font-bold leading-snug text-charcoal">
                        {dish.name}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-500">
                        {dish.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-neutral-100 pt-4">
                        <p className="text-lg font-bold text-orange-brand">
                          {dish.price}
                        </p>
                        <button
                          type="button"
                          aria-label={`افزودن ${dish.name} به سبد`}
                          disabled={addingId === dish.id}
                          onClick={(e) => void handleQuickAdd(dish, e)}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-brand text-white transition hover:scale-105 hover:bg-orange-600 disabled:opacity-60"
                        >
                          <Plus className="h-5 w-5" strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3 sm:hidden">
            <button
              type="button"
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-200 bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
