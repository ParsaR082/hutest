"use client";

import { PLATE_CLASSES_LG } from "@/lib/digitalMenuConstants";
import type { DigitalDishItem } from "@/types/digitalMenu";

const parsePrice = (priceRaw: string | number): number => {
  if (typeof priceRaw === "number") return priceRaw;
  if (!priceRaw) return 0;

  const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  let englishStr = String(priceRaw);
  for (let i = 0; i < 10; i++) {
    englishStr = englishStr.replace(persianNumbers[i], i.toString());
  }

  const numericStr = englishStr.replace(/[^0-9]/g, "");
  return parseInt(numericStr, 10) || 0;
};

const formatPrice = (price: string | number): string => {
  return parsePrice(price).toLocaleString("en-US");
};

interface DishModalProps {
  dish: DigitalDishItem | null;
  onClose: () => void;
}

export default function DishModal({ dish, onClose }: DishModalProps) {
  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-modal-title"
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col items-center overflow-y-auto rounded-sm border border-[#d4af37]/25 bg-[#0a0a0a]/80 p-6 shadow-[0_0_80px_rgba(212,175,55,0.1)] sm:p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-[#0a0a0a]/50 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#d4af37]/40 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#d4af37]/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.image}
          alt={dish.enTitle || dish.faTitle}
          className={`${PLATE_CLASSES_LG} mb-6`}
        />

        <h2
          id="dish-modal-title"
          className="text-xl font-bold tracking-wide text-[#d4af37] sm:text-2xl"
        >
          {dish.enTitle}
        </h2>
        <h2
          className="dm-font-persian mt-1 mb-5 text-lg font-bold text-white"
          dir="rtl"
        >
          {dish.faTitle}
        </h2>

        <div className="mb-6 flex w-full gap-4 border-y border-[#d4af37]/15 py-4">
          <p className="w-1/2 text-xs leading-relaxed text-zinc-400 font-light">
            {dish.enDesc}
          </p>
          <p
            className="dm-font-persian w-1/2 text-right text-xs leading-relaxed text-zinc-400 font-light"
            dir="rtl"
          >
            {dish.faDesc}
          </p>
        </div>

        <p className="mb-6 flex items-baseline gap-2 text-2xl font-bold tracking-[0.1em] text-[#d4af37] tabular-nums lining-nums">
          {formatPrice(dish.price)}
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60 font-bold">
            Toman
          </span>
        </p>

        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto border border-[#d4af37]/60 px-10 py-2.5 text-xs font-bold uppercase tracking-[0.3em] text-[#d4af37] transition-colors hover:border-[#d4af37] hover:bg-[#d4af37]/10"
        >
          Close
        </button>
      </div>
    </div>
  );
}
