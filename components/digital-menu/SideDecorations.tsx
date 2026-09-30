const SPARKS = [
  { top: "8%", side: "left" as const, offset: "6%", delay: "0s", size: "sm" as const },
  { top: "15%", side: "left" as const, offset: "12%", delay: "1.2s", size: "md" as const },
  { top: "22%", side: "left" as const, offset: "4%", delay: "2.4s", size: "sm" as const },
  { top: "35%", side: "left" as const, offset: "9%", delay: "0.8s", size: "lg" as const },
  { top: "48%", side: "left" as const, offset: "5%", delay: "3.1s", size: "sm" as const },
  { top: "58%", side: "left" as const, offset: "11%", delay: "1.7s", size: "md" as const },
  { top: "68%", side: "left" as const, offset: "3%", delay: "2.9s", size: "sm" as const },
  { top: "78%", side: "left" as const, offset: "8%", delay: "0.4s", size: "md" as const },
  { top: "88%", side: "left" as const, offset: "13%", delay: "2.1s", size: "sm" as const },
  { top: "18%", side: "left" as const, offset: "15%", delay: "3.6s", size: "lg" as const },
  { top: "12%", side: "right" as const, offset: "7%", delay: "1.5s", size: "md" as const },
  { top: "28%", side: "right" as const, offset: "4%", delay: "0.6s", size: "sm" as const },
  { top: "42%", side: "right" as const, offset: "10%", delay: "2.7s", size: "lg" as const },
  { top: "55%", side: "right" as const, offset: "6%", delay: "1.1s", size: "sm" as const },
  { top: "65%", side: "right" as const, offset: "12%", delay: "3.4s", size: "md" as const },
  { top: "75%", side: "right" as const, offset: "5%", delay: "0.9s", size: "sm" as const },
  { top: "85%", side: "right" as const, offset: "9%", delay: "2.3s", size: "md" as const },
  { top: "32%", side: "right" as const, offset: "3%", delay: "1.9s", size: "sm" as const },
  { top: "92%", side: "right" as const, offset: "14%", delay: "0.2s", size: "sm" as const },
];

const sizeMap = {
  sm: "h-1 w-1 shadow-[0_0_8px_#eab308]",
  md: "h-1.5 w-1.5 shadow-[0_0_10px_#eab308]",
  lg: "h-2 w-2 shadow-[0_0_14px_#d4af37]",
};

export default function SideDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[1]" aria-hidden="true">
      <div className="absolute inset-y-0 left-3 border-l border-[#d4af37]/15 sm:left-6" />
      <div className="absolute inset-y-0 right-3 border-r border-[#d4af37]/15 sm:right-6" />

      <p className="dm-font-serif absolute left-2 top-1/2 origin-center -translate-y-1/2 -rotate-90 text-6xl font-thin uppercase tracking-[0.6em] text-white/5 sm:left-4 sm:text-7xl">
        HUMAZD
      </p>
      <p className="dm-font-serif absolute right-2 top-1/2 origin-center -translate-y-1/2 rotate-90 text-6xl font-thin uppercase tracking-[0.6em] text-white/5 sm:right-4 sm:text-7xl">
        HUMAZD
      </p>

      {SPARKS.map((spark, i) => (
        <span
          key={i}
          className={`dm-spark-particle absolute rounded-full bg-yellow-500 opacity-70 ${sizeMap[spark.size]}`}
          style={{
            top: spark.top,
            left: spark.side === "left" ? spark.offset : undefined,
            right: spark.side === "right" ? spark.offset : undefined,
            animationDelay: spark.delay,
          }}
        />
      ))}
    </div>
  );
}
