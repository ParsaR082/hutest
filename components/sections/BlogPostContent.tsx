"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { LocalImage } from "@/components/ui/LocalImage";
import type { BlogPostDetail } from "@/lib/api/types";

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

export function BlogPostContent({ post }: { post: BlogPostDetail }) {
  return (
    <main className="bg-[#0a0a0a]">
      <section className="relative flex min-h-[52vh] flex-col items-center justify-end overflow-hidden pt-28 pb-14 text-center sm:min-h-[58vh]">
        {post.cover_image && (
          <LocalImage
            src={post.cover_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-[#0a0a0a]/30" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 mx-auto max-w-3xl px-4"
        >
          <Link
            href="/blog"
            className="text-xs font-semibold uppercase tracking-[0.3em] text-[#F97316] hover:underline"
          >
            وبلاگ Humazd
          </Link>
          <h1 className="font-serif mt-4 text-3xl font-bold leading-tight text-white sm:text-5xl">
            {post.title}
          </h1>
          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-white/55">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(post.published_at)}</span>
            {post.author_name && (
              <>
                <span aria-hidden>·</span>
                <span>{post.author_name}</span>
              </>
            )}
          </div>
        </motion.div>
      </section>

      <section className="bg-cream px-4 py-16 sm:px-6 lg:px-10">
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="prose-humazd mx-auto max-w-[42rem]"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mx-auto mt-16 max-w-[42rem] border-t border-neutral-200 pt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-widest text-orange-brand transition hover:gap-2"
          >
            ← بازگشت به وبلاگ
          </Link>
        </div>
      </section>
    </main>
  );
}
