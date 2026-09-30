"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  Building2,
  ChefHat,
  Leaf,
  PartyPopper,
  ShieldCheck,
  Star,
  Truck,
  UtensilsCrossed,
  Wine,
} from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { LocalImage } from "@/components/ui/LocalImage";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
import { images } from "@/lib/images";
import { useSiteImages } from "@/lib/hooks/useSiteImages";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const STATS = [
  { value: "150+", label: "مهمان روزانه" },
  { value: "82+", label: "دستور ویژه" },
  { value: "35+", label: "جایزه کسب‌شده" },
  { value: "10+", label: "سال تجربه" },
] as const;

const TESTIMONIALS_BASE = [
  {
    quote:
      "شبی فراموش‌نشدنی — هر دور غذا مثل نامه‌ای عاشقانه به مواد فصلی بود.",
    name: "سارا میچل",
    role: "منتقد غذا",
    fallback: images.about.avatar1,
    slug: "about_avatar_1",
  },
  {
    quote:
      "فضا سینمایی است، سرویس بی‌نقص و طعم‌ها واقعاً از دل برمی‌آیند.",
    name: "جیمز چن",
    role: "مهمان دائمی",
    fallback: images.about.avatar2,
    slug: "about_avatar_2",
  },
  {
    quote:
      "سالگرد ازدواجمان را اینجا جشن گرفتیم و از هر انتظاری فراتر رفت. جادویی بود.",
    name: "النا رودریگز",
    role: "میزبان مراسم",
    fallback: images.about.avatar3,
    slug: "about_avatar_3",
  },
] as const;

const STRENGTHS_BASE = [
  { title: "غذای بهداشتی", icon: ShieldCheck, fallback: images.about.strengthHygienic, slug: "about_strength_hygienic" },
  { title: "فضای تازه", icon: Leaf, fallback: images.about.strengthFresh, slug: "about_strength_fresh" },
  { title: "سرآشپزهای ماهر", icon: ChefHat, fallback: images.about.strengthChefs, slug: "about_strength_chefs" },
  { title: "مراسم و مهمانی", icon: PartyPopper, fallback: images.about.strengthEvents, slug: "about_strength_events" },
] as const;

const PREFOOTER_BASE = [
  { fallback: images.about.prefooter1, slug: "about_prefooter_1" },
  { fallback: images.about.prefooter2, slug: "about_prefooter_2" },
  { fallback: images.about.prefooter3, slug: "about_prefooter_3" },
  { fallback: images.about.prefooter4, slug: "about_prefooter_4" },
] as const;

function SectionReveal({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.18 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StarRating() {
  return (
    <div className="flex gap-1" aria-label="۵ ستاره از ۵">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-4 w-4 fill-[#F97316] text-[#F97316]"
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

type OpeningHourEntry = { days: string; time: string };

function ExquisiteRestaurantSection({ hours, plateImage }: { hours: OpeningHourEntry[]; plateImage: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const leftCloudX = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "-100%"]);
  const rightCloudX = useTransform(scrollYProgress, [0.1, 0.6], ["0%", "100%"]);
  const cloudOpacity = useTransform(scrollYProgress, [0.4, 0.6], [1, 0]);

  const leftFeatures = [
    { icon: Truck, label: "ارسال به سراسر ارومیه", desc: "آماده‌سازی و ارسال از رستوران تا ۱۵ دقیقه" },
    {
      icon: UtensilsCrossed,
      label: "غذای لوکس",
      desc: "منوی degustation و هم‌نوایی شراب",
    },
  ] as const;

  const rightFeatures = [
    { icon: Wine, label: "پذیرایی فضای باز", desc: "مراسم باغ و پشت‌بام" },
    { icon: Building2, label: "سالن مهمانی", desc: "تا ۱۲۰ مهمان نشسته" },
  ] as const;

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] w-full bg-[#0a0a0a]"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden border-t border-white/10 px-4 sm:px-6 lg:px-10">
        {/* Content layer — plate + features */}
        <div className="relative z-10 mx-auto w-full max-w-7xl">
          <div className="mb-10 text-center sm:mb-16">
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              رستوران باشکوه در شهر
            </h2>
          </div>

          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
            <div className="flex flex-col gap-12 lg:items-start">
              {leftFeatures.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex max-w-xs items-start gap-4 text-start"
                >
                  <Icon
                    className="mt-1 h-5 w-5 shrink-0 text-[#F97316]"
                    strokeWidth={1.75}
                  />
                  <div>
                    <p className="font-serif text-lg font-semibold text-white">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 mx-auto h-64 w-64 sm:h-80 sm:w-80 lg:h-[28rem] lg:w-[28rem]">
              <LocalImage
                src={plateImage}
                alt="بشقاب از بالا"
                fill
                className="object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.65)]"
                sizes="(max-width: 768px) 80vw, 448px"
              />
            </div>

            <div className="flex flex-col gap-12 lg:items-end">
              {rightFeatures.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex max-w-xs items-start gap-4 text-end"
                >
                  <Icon
                    className="mt-1 h-5 w-5 shrink-0 text-[#F97316]"
                    strokeWidth={1.75}
                  />
                  <div>
                    <p className="font-serif text-lg font-semibold text-white">
                      {label}
                    </p>
                    <p className="mt-1 text-sm text-white/55">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cloud curtain — delayed reveal on scroll progress */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-50 overflow-hidden"
        >
          <motion.div
            style={{ x: leftCloudX, opacity: cloudOpacity }}
            className="absolute left-0 top-0 h-full w-1/2 will-change-transform"
          >
            <div className="relative h-full w-full">
              <LocalImage
                src={images.about.cloudLeft}
                alt=""
                fill
                className="object-cover object-right"
                sizes="50vw"
              />
            </div>
          </motion.div>
          <motion.div
            style={{ x: rightCloudX, opacity: cloudOpacity }}
            className="absolute right-0 top-0 h-full w-1/2 will-change-transform"
          >
            <div className="relative h-full w-full">
              <LocalImage
                src={images.about.cloudRight}
                alt=""
                fill
                className="object-cover object-left"
                sizes="50vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function AboutContent({ hours }: { hours: OpeningHourEntry[] }) {
  const siteImages = useSiteImages();
  const heroImage = siteImages.about_hero ?? images.about.hero;
  const interiorImage = siteImages.about_interior ?? images.about.interior;
  const chefImage = siteImages.about_chef ?? images.about.chef;
  const partyImage = siteImages.about_party ?? images.about.party;
  const plateImage = siteImages.about_plate ?? images.about.plate;
  const testimonials = TESTIMONIALS_BASE.map((t) => ({ ...t, avatar: siteImages[t.slug] ?? t.fallback }));
  const strengths = STRENGTHS_BASE.map((s) => ({ ...s, image: siteImages[s.slug] ?? s.fallback }));
  const prefooter = PREFOOTER_BASE.map((p) => siteImages[p.slug] ?? p.fallback);

  return (
    <main className="bg-[#0a0a0a] text-white/75">
      {/* ── 1. Hero ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[58vh] items-center justify-center overflow-hidden pt-24 sm:min-h-[65vh] sm:pt-28">
        <LocalImage
          src={heroImage}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/78" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-4 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#F97316]">
            به Humazd خوش آمدید
          </p>
          <h1 className="font-serif mt-4 text-6xl font-bold text-white sm:text-7xl lg:text-8xl">
            درباره ما
          </h1>
        </motion.div>
      </section>

      {/* ── 2. Intro & grid ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="relative z-10 mx-auto max-w-7xl">
          <SectionReveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm leading-relaxed text-white/65 sm:text-base">
              به Humazd خوش آمدید — جایی که هنر آشپزی با مهمان‌نوازی گرم
              پیوند می‌خورد. بیش از یک دهه است که تجربه‌های غذایی
              فراموش‌نشدنی با مواد فصلی و تکنیک‌های اصیل خلق می‌کنیم.
            </p>
          </SectionReveal>

          <div className="relative mt-16 grid grid-cols-1 items-stretch gap-10 lg:grid-cols-3 lg:gap-8">
            <SectionReveal className="relative flex flex-col justify-center lg:pe-4">
              <p className="text-sm leading-relaxed text-white/60">
                هر بشقاب داستانی دارد — از کشاورز، آتش و دستانی که عمیقاً
                به آنچه سرو می‌کنند اهمیت می‌دهند.
              </p>
              <div className="relative mt-8 h-14 w-44">
                <LocalImage
                  src={images.about.signature}
                  alt="امضای سرآشپز"
                  fill
                  className="object-contain object-start"
                  sizes="176px"
                />
              </div>
            </SectionReveal>

            <SectionReveal className="relative min-h-[440px] overflow-hidden lg:min-h-[560px]">
              <LocalImage
                src={interiorImage}
                alt="فضای داخلی رستوران"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </SectionReveal>

            <SectionReveal className="relative">
              <div className="relative border border-[#F97316]/80 bg-[#0a0a0a] p-8 sm:p-10">
                <h3 className="font-serif text-xl font-semibold text-white">
                  ساعات کاری
                </h3>
                <div className="mt-6 space-y-6">
                  {hours.map((entry, i) => (
                    <div
                      key={entry.days}
                      className={i > 0 ? "border-t border-white/10 pt-6" : undefined}
                    >
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
                        {entry.days}
                      </p>
                      <p className="mt-2 text-sm text-white/70">{entry.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </div>

          <div className="mt-20 flex flex-wrap justify-between gap-10 border-t border-white/10 pt-16 md:flex-nowrap">
            {STATS.map((stat) => (
              <SectionReveal key={stat.label} className="min-w-[120px] flex-1 text-center">
                <p className="font-serif text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
                  {stat.value}
                </p>
                <p className="mt-3 text-[0.65rem] font-semibold uppercase tracking-widest text-[#F97316]">
                  {stat.label}
                </p>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Award Winning Chef ───────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#0a0a0a] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionReveal className="relative aspect-[4/5] min-h-[420px] overflow-hidden sm:aspect-[5/6] lg:min-h-[640px]">
            <LocalImage
              src={chefImage}
              alt="سرآشپز برنده جایزه"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </SectionReveal>

          <SectionReveal className="text-center lg:px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
              با سرآشپز آشنا شوید
            </p>
            <h2 className="font-serif mt-4 text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
              سرآشپز برنده جایزه
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              با دقت آموزش‌دیده در سطح میشلن و احترام یک کشاورز به محصول،
              سرآشپز Marco Antonio مواد ساده را به ترکیب‌هایی تبدیل می‌کند
              که مدت‌ها پس از آخرین لقمه در ذهن می‌مانند.
            </p>
            <div className="relative mx-auto mt-8 h-14 w-44">
              <LocalImage
                src={images.about.signature}
                alt="امضای سرآشپز"
                fill
                className="object-contain"
                sizes="176px"
              />
            </div>
            <div className="mt-10 flex justify-center">
              <AnimatedButton href="/menu">مشاهده منو</AnimatedButton>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ── 4. Dinner Event or Party? ─────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionReveal className="text-center lg:pe-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
              پذیرایی خصوصی
            </p>
            <h2 className="font-serif mt-4 text-4xl font-bold text-white sm:text-5xl">
              مراسم شام یا مهمانی؟
            </h2>
            <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
              از سالگردهای صمیمی تا جشن‌های بزرگ، تیم ما منوهای اختصاصی،
              چیدمان‌های شیک و سرویس بی‌نقص را آماده می‌کند — تا هر لحظه
              را با کسانی که دوستشان دارید بسازید.
            </p>
            <div className="mt-10 flex justify-center">
              <AnimatedButton href="/#reservations">
                رزرو مراسم
              </AnimatedButton>
            </div>
          </SectionReveal>

          <SectionReveal className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6]">
            <LocalImage
              src={partyImage}
              alt="مهمان در حال لذت بردن از شام"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </SectionReveal>
        </div>
      </section>

      {/* ── 5. Exquisite Restaurant + cloud reveal ────────────────── */}
      <ExquisiteRestaurantSection hours={hours} plateImage={plateImage} />

      {/* ── 6. Testimonials ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 bg-[#0a0a0a] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="relative z-10 mx-auto max-w-7xl">
          <SectionReveal className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
              نظرات مهمانان
            </p>
            <h2 className="font-serif mt-4 text-3xl font-bold text-white sm:text-4xl">
              مردم چه می‌گویند
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <SectionReveal
                key={item.name}
                className="flex flex-col border border-white/10 bg-[#161616] p-8"
              >
                <StarRating />
                <p className="mt-5 flex-1 text-sm leading-relaxed text-white/65">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#F97316]/30">
                    <LocalImage
                      src={item.avatar}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-white/45">{item.role}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Our Strength ───────────────────────────────────────── */}
      <section className="border-t border-white/10 bg-[#111111] px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <SectionReveal className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
              چرا ما را انتخاب کنید
            </p>
            <h2 className="font-serif mt-4 text-3xl font-bold text-white sm:text-4xl">
              نقاط قوت ما
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {strengths.map(({ title, icon: Icon, image }) => (
              <SectionReveal
                key={title}
                className="group relative aspect-[2/5] overflow-hidden sm:aspect-[3/7]"
              >
                <LocalImage
                  src={image}
                  alt={title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2 p-4 sm:p-5">
                  <Icon
                    className="h-5 w-5 shrink-0 text-[#F97316]"
                    strokeWidth={1.75}
                  />
                  <p className="font-serif text-sm font-semibold leading-tight text-white sm:text-base">
                    {title}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Pre-footer gallery + newsletter ──────────────────────── */}
      <section className="relative border-t border-white/10 bg-[#0a0a0a] pb-28 pt-4 sm:pb-32">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {prefooter.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] sm:aspect-[5/4]">
              <LocalImage
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-4">
          <SectionReveal className="pointer-events-auto w-full max-w-xl border border-dashed border-[#F97316] bg-[#0a0a0a] px-6 py-10 text-center sm:px-10 sm:py-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#F97316]">
              در ارتباط بمانید
            </p>
            <h2 className="font-serif mt-3 text-2xl font-bold text-white sm:text-3xl">
              اخبار و پیشنهادها
            </h2>
            <p className="mt-3 text-sm text-white/55">
              منوهای فصلی، رویدادهای اختصاصی و دعوت‌نامه میز سرآشپز —
              مستقیم در ایمیل شما.
            </p>
            <NewsletterForm />
          </SectionReveal>
        </div>
      </section>
    </main>
  );
}
