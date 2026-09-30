"use client";

import { type RefObject } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { menuZigZagItems } from "@/lib/menu-data";

interface MenuZigZagProps {
  menuPlateSlotRef: RefObject<HTMLDivElement | null>;
}

const decorations = [
  { type: "emoji", content: "🍅", top: "8%", left: "6%", size: "text-2xl", delay: "0s" },
  { type: "emoji", content: "🌿", top: "22%", right: "8%", size: "text-3xl", delay: "-2s" },
  { type: "dust", top: "38%", left: "18%", delay: "-1s" },
  { type: "emoji", content: "🧂", top: "52%", right: "14%", size: "text-xl", delay: "-3s" },
  { type: "emoji", content: "🍅", top: "68%", left: "10%", size: "text-xl", delay: "-4s" },
  { type: "dust", top: "78%", right: "22%", delay: "-2.5s" },
  { type: "icon", top: "30%", left: "42%", delay: "-1.5s" },
  { type: "emoji", content: "🌿", top: "88%", right: "6%", size: "text-2xl", delay: "-0.5s" },
];

export function MenuZigZag({ menuPlateSlotRef }: MenuZigZagProps) {
  return (
    <section
      id="menu"
      className="relative overflow-hidden bg-[#1a1a1a] pb-[52px] sm:pb-[68px] md:pb-[88px]"
    >
      {decorations.map((d, i) => {
        if (d.type === "dust") {
          return (
            <span
              key={i}
              className="animate-float pointer-events-none absolute h-16 w-16 rounded-full bg-white/[0.04] blur-xl"
              style={{
                top: d.top,
                left: d.left,
                right: d.right,
                animationDelay: d.delay,
              }}
            />
          );
        }
        if (d.type === "icon") {
          return (
            <Leaf
              key={i}
              className="animate-float-slow pointer-events-none absolute text-orange-brand/20"
              style={{
                top: d.top,
                left: d.left,
                animationDelay: d.delay,
              }}
              size={32}
            />
          );
        }
        return (
          <span
            key={i}
            className={`animate-float pointer-events-none absolute opacity-30 ${d.size}`}
            style={{
              top: d.top,
              left: d.left,
              right: d.right,
              animationDelay: d.delay,
            }}
          >
            {d.content}
          </span>
        );
      })}

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-10 lg:pt-24">
        <header className="mb-14 text-center md:mb-20">
          <p lang="en" className="font-script script-label-en text-2xl text-orange-brand sm:text-3xl">
            Our Menu
          </p>
          <h2 className="font-serif mt-1 text-3xl font-bold text-cream sm:text-4xl">
            بشقاب‌های امضا
          </h2>
        </header>

        <div className="flex flex-col gap-20 md:gap-28 lg:gap-36">
          {menuZigZagItems.map((item, index) => {
            const isFirst = index === 0;
            const imageRight = index % 2 === 0;

            return (
              <article
                key={item.id}
                className={`grid items-center gap-10 md:grid-cols-2 md:gap-14 lg:gap-20 ${
                  imageRight ? "" : "md:[&>*:first-child]:order-2"
                }`}
              >
                <div className="max-w-md md:max-w-lg">
                  <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-orange-brand/80">
                    {item.subtitle}
                  </p>
                  <h3 lang="en" className="font-script text-4xl leading-tight text-cream sm:text-5xl lg:text-6xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 text-sm font-light leading-relaxed text-gray-400 sm:text-base">
                    {item.description}
                  </p>
                  <p className="mt-6 font-serif text-2xl font-semibold text-orange-brand">
                    {item.price}
                  </p>
                </div>

                <div className="relative mx-auto w-full max-w-md md:max-w-none">
                  {isFirst ? (
                    <div
                      ref={menuPlateSlotRef}
                      className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px]"
                      aria-label={`${item.title} plate`}
                    />
                  ) : (
                    <div className="relative mx-auto aspect-square w-full max-w-[380px] sm:max-w-[440px] lg:max-w-[480px]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                        sizes="(max-width: 768px) 90vw, 480px"
                      />
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
