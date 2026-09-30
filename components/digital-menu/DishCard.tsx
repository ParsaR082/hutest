"use client";

import { DISH_IMAGE_URL, PLATE_CLASSES } from "@/lib/digitalMenuConstants";
import type { DigitalDishItem } from "@/types/digitalMenu";

interface DishCardProps {
  item: DigitalDishItem;
  onSelect: (item: DigitalDishItem) => void;
}

export default function DishCard({ item, onSelect }: DishCardProps) {
  return (
    <div className="my-16 flex w-full max-w-4xl flex-row items-center justify-center gap-2 sm:gap-6">
      {/* Left wing */}
      <div className="flex flex-1 flex-col items-end justify-center gap-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-[#d4af37] sm:text-[11px]">
          Premium
        </span>
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#d4af37]/60 sm:w-32" />
      </div>

      {/* Center plate + nameplate */}
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="relative shrink-0 cursor-pointer pb-8 transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={DISH_IMAGE_URL}
          alt={item.enTitle}
          className={PLATE_CLASSES}
        />

        <div className="absolute -bottom-6 left-1/2 z-20 flex min-w-[220px] -translate-x-1/2 flex-col items-center border border-[#d4af37]/50 bg-[#0a0a0a] px-6 py-2 shadow-2xl">
          <h3 className="dm-font-serif text-sm font-medium tracking-wide text-[#d4af37] sm:text-base">
            {item.enTitle}
          </h3>
          <div className="my-1 h-px w-1/2 bg-[#d4af37]/30" />
          <h3
            className="dm-font-persian text-xs font-bold text-white sm:text-sm"
            dir="rtl"
          >
            {item.faTitle}
          </h3>
        </div>
      </button>

      {/* Right wing */}
      <div className="flex flex-1 flex-col items-start justify-center gap-2">
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d4af37]/60 sm:w-32" />
        <span className="dm-font-serif text-xs tracking-widest text-[#d4af37] sm:text-sm">
          {item.price}
        </span>
      </div>
    </div>
  );
}
