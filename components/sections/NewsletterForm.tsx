"use client";

import { useState, type FormEvent } from "react";
import { subscribeNewsletter } from "@/lib/api/forms";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "عضویت انجام نشد.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <p className="mt-8 text-sm font-medium text-[#F97316]">
        با موفقیت عضو خبرنامه شدید!
      </p>
    );
  }

  return (
    <form className="mx-auto mt-8 max-w-sm space-y-4" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="آدرس ایمیل شما"
        className="w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-sm text-white placeholder:text-white/35 outline-none transition focus:border-[#F97316]"
      />
      {error && (
        <p className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#F97316] px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-orange-600 disabled:opacity-60"
      >
        {loading ? "در حال ثبت..." : "عضویت"}
      </button>
    </form>
  );
}
