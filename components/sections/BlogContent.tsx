"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, PenSquare } from "lucide-react";
import { LocalImage } from "@/components/ui/LocalImage";
import type { BlogPostList } from "@/lib/api/types";

function formatDate(iso: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(
      new Date(iso)
    );
  } catch {
    return "";
  }
}

function BlogHero() {
  return (
    <section className="relative flex min-h-[42vh] flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] pt-28 pb-16 text-center sm:min-h-[48vh]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.1),transparent_60%)]" />
      <p lang="en" className="font-script script-label-en relative z-10 text-2xl text-[#F97316] sm:text-3xl">
        Notes from the Kitchen
      </p>
      <h1 className="font-serif relative z-10 mt-3 text-5xl font-bold text-white sm:text-6xl lg:text-7xl">
        وبلاگ
      </h1>
      <p className="relative z-10 mx-auto mt-5 max-w-lg px-4 text-sm leading-relaxed text-white/55 sm:text-base">
        یادداشت‌های سرآشپز، پشت صحنه آشپزخانه و داستان‌هایی درباره مواد اولیه
        و فصل‌های Humazd.
      </p>
    </section>
  );
}

function PostCard({ post, i }: { post: BlogPostList; i: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: (i % 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-brand/20 hover:shadow-lg"
    >
      <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-neutral-50">
        {post.cover_image ? (
          <LocalImage
            src={post.cover_image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-300">
            <PenSquare className="h-8 w-8" strokeWidth={1.25} />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Calendar className="h-3.5 w-3.5" />
          <span>{formatDate(post.published_at)}</span>
          {post.author_name && (
            <>
              <span aria-hidden>·</span>
              <span>{post.author_name}</span>
            </>
          )}
        </div>
        <Link href={`/blog/${post.slug}`}>
          <h2 className="font-serif mt-3 text-xl font-bold leading-snug text-charcoal transition group-hover:text-orange-brand">
            {post.title}
          </h2>
        </Link>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-500">
          {post.excerpt}
        </p>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-5 inline-flex w-fit items-center gap-1 text-xs font-semibold uppercase tracking-widest text-orange-brand transition hover:gap-2"
        >
          ادامه مطلب ←
        </Link>
      </div>
    </motion.article>
  );
}

export function BlogContent({ posts }: { posts: BlogPostList[] }) {
  return (
    <main className="bg-[#0a0a0a]">
      <BlogHero />
      <section className="bg-cream px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <PenSquare className="h-10 w-10 text-neutral-300" strokeWidth={1.25} />
              <h2 className="font-serif mt-5 text-2xl font-semibold text-charcoal">
                اولین یادداشت به‌زودی منتشر می‌شود
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-neutral-500">
                تیم Humazd در حال نوشتن اولین داستان‌های آشپزخانه است. کمی
                بعد دوباره سر بزنید.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} i={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
