"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { DigitalDishCategory } from "@/types/digitalMenu";

interface CategoryNavProps {
  categories: DigitalDishCategory[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
  const [activeId, setActiveId] = useState(categories[0]?.id ?? "");

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(id);
        },
        { rootMargin: "-28% 0px -62% 0px", threshold: 0 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-[#d4af37]/15 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="relative mx-auto max-w-6xl px-4">
        <Link
          href="/"
          className="absolute top-1/2 left-2 z-50 flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-[#d4af37]/30 bg-black/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#d4af37] backdrop-blur-md transition-all hover:bg-[#d4af37]/20 sm:left-4"
          aria-label="بازگشت به سایت اصلی هومزد"
        >
          <ArrowLeft size={13} />
          <span className="hidden sm:inline">Humazd.ir</span>
        </Link>
        <div className="dm-scrollbar-hide flex justify-center overflow-x-auto py-3 px-2">
          <div className="flex gap-1 sm:gap-2">
            {categories.map((category) => {
              const isActive = activeId === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => scrollToSection(category.id)}
                  className={`flex-shrink-0 border-b-2 px-3 py-1.5 transition-colors duration-300 ${
                    isActive
                      ? "border-[#d4af37] text-[#d4af37]"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className="block whitespace-nowrap text-[9px] font-bold uppercase tracking-[0.18em] sm:text-[10px]">
                    {category.enTitle}
                  </span>
                  <span
                    className="dm-font-persian mt-0.5 block text-[8px] font-bold normal-case tracking-normal opacity-75"
                    dir="rtl"
                  >
                    {category.faTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
