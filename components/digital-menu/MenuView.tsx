"use client";

import { useEffect, useState } from "react";
import CategoryNav from "@/components/digital-menu/CategoryNav";
import DishCard from "@/components/digital-menu/DishCard";
import DishModal from "@/components/digital-menu/DishModal";
import MarbleBackground from "@/components/digital-menu/MarbleBackground";
import SideDecorations from "@/components/digital-menu/SideDecorations";
import { digitalMenuCategories as fallbackCategories } from "@/lib/digitalMenuData";
import { fetchMenuItems } from "@/lib/api/menu";
import type { MenuItemList } from "@/lib/api/types";
import type { DigitalDishCategory, DigitalDishItem } from "@/types/digitalMenu";

export default function MenuView() {
  const [categories, setCategories] = useState<DigitalDishCategory[]>(fallbackCategories);
  const [selectedDish, setSelectedDish] = useState<DigitalDishItem | null>(null);

  useEffect(() => {
    let active = true;
    fetchMenuItems()
      .then((items) => {
        if (!active || items.length === 0) return;
        const grouped: Record<string, DigitalDishCategory> = {};
        for (const item of items) {
          const dish: DigitalDishItem = {
            id: String(item.id),
            enTitle: item.name,
            faTitle: item.name,
            enDesc: item.description,
            faDesc: item.description,
            price: item.price_display,
            image: item.image,
          };
          if (!grouped[item.category]) {
            grouped[item.category] = {
              id: item.category,
              enTitle: item.category,
              faTitle: item.category,
              items: [],
            };
          }
          grouped[item.category].items.push(dish);
        }
        setCategories(Object.values(grouped));
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  return (
    <MarbleBackground className="text-zinc-200">
      <SideDecorations />
      <CategoryNav categories={digitalMenuCategories} />

      <div className="relative mx-auto min-h-screen max-w-6xl px-4 py-12">
        <header className="mb-14 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.5em] text-[#d4af37]/80">
            humazd
          </p>
        </header>

        <main className="flex flex-col">
          {digitalMenuCategories.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="scroll-mt-20"
            >
              <header className="mb-4 flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold uppercase tracking-widest text-white sm:text-5xl">
                  {category.enTitle}
                </h2>
                {category.subtitle && (
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.35em] text-zinc-500">
                    {category.subtitle}
                  </p>
                )}
                {category.badge && (
                  <p className="mt-3 border-b border-[#d4af37]/40 pb-0.5 text-[8px] font-bold uppercase tracking-[0.25em] text-[#d4af37]">
                    {category.badge}
                  </p>
                )}
              </header>

              <div className="flex flex-col items-center">
                {category.items.map((item) => (
                  <DishCard
                    key={item.id}
                    item={item}
                    onSelect={setSelectedDish}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>

        <footer className="pointer-events-none mt-16 pb-12 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.4em] text-white/10">
            humazd
          </p>
        </footer>
      </div>

      {selectedDish && (
        <DishModal dish={selectedDish} onClose={() => setSelectedDish(null)} />
      )}
    </MarbleBackground>
  );
}
