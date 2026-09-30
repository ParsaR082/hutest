"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Check, Clock, Phone, User, X } from "lucide-react";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { LocalImage } from "@/components/ui/LocalImage";
import { images } from "@/lib/images";
import { useSiteImages } from "@/lib/hooks/useSiteImages";

const PARTY_SIZES = ["1", "2", "3", "4", "5+"] as const;

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const siteImages = useSiteImages();
  const bookingVisual = siteImages.booking_visual ?? images.booking.table;
  const [partySize, setPartySize] = useState("2");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      const t = window.setTimeout(() => setSuccess(false), 300);
      return () => window.clearTimeout(t);
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { createReservation } = await import("@/lib/api/forms");
      await createReservation({
        guest_name: guestName,
        guest_phone: guestPhone,
        date,
        time,
        party_size: partySize === "5+" ? 5 : parseInt(partySize, 10),
        special_requests: specialRequests,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "رزرو انجام نشد. دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-black/40 p-4 py-6 backdrop-blur-md sm:py-10"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <div className="flex min-h-full items-center justify-center">
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="relative flex w-full max-w-5xl flex-col rounded-2xl bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] md:max-h-[min(720px,90vh)] md:flex-row md:items-stretch"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="بستن پنجره رزرو"
              onClick={handleClose}
              className="absolute end-4 top-4 z-50 cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:text-[#F97316]"
            >
              <X className="h-5 w-5" strokeWidth={1.75} />
            </button>

            {/* Left — visual */}
            <div className="relative hidden overflow-hidden rounded-e-2xl md:block md:w-[40%]">
              <LocalImage
                src={bookingVisual}
                alt="چیدمان شیک میز رستوران"
                fill
                className="rounded-e-2xl object-cover"
                sizes="40vw"
              />
              <div className="absolute bottom-0 h-1/2 w-full bg-gradient-to-t from-black/80 to-transparent" />
              <p className="font-serif absolute inset-x-8 bottom-8 text-2xl leading-snug text-white">
                لحظه‌ای از کمال آشپزی را رزرو کنید.
              </p>
            </div>

            {/* Right — form */}
            <div className="flex min-h-0 w-full flex-col overflow-y-auto p-8 pt-14 md:w-[60%] md:p-12 md:pt-14">
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col items-center py-8 text-center"
                  >
                    <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F97316]/10">
                      <span className="absolute inset-0 animate-ping rounded-full bg-[#F97316]/20" />
                      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316] text-white shadow-lg shadow-orange-500/30">
                        <Check className="h-7 w-7" strokeWidth={2.5} />
                      </span>
                    </div>
                    <h3 className="font-serif text-3xl font-bold text-gray-900">
                      درخواست رزرو شما ثبت شد
                    </h3>
                    <p className="mt-3 max-w-sm text-gray-500">
                      رزرو شما پس از بررسی و تأیید رستوران قطعی خواهد شد. وضعیت
                      درخواست را می‌توانید در پنل کاربری خود مشاهده کنید.
                    </p>
                    <button
                      type="button"
                      onClick={handleClose}
                      className="mt-8 text-sm font-medium uppercase tracking-widest text-gray-500 transition hover:text-[#F97316]"
                    >
                      بستن
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#F97316]">
                      رزرو
                    </p>
                    <h2
                      id="booking-modal-title"
                      className="font-serif mb-8 mt-2 text-3xl leading-tight text-gray-900 sm:text-4xl"
                    >
                      میز خود را رزرو کنید
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-8">
                      {/* Party size */}
                      <div>
                        <p className="mb-3 text-sm font-medium text-gray-900">
                          تعداد مهمان
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {PARTY_SIZES.map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setPartySize(size)}
                              className={`rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                                partySize === size
                                  ? "border border-transparent bg-[#F97316] text-white"
                                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date & time */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-gray-900">
                            تاریخ
                          </span>
                          <div className="relative">
                            <Calendar className="pointer-events-none absolute start-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F97316]" />
                            <input
                              type="date"
                              required
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              className="w-full border-b border-gray-300 bg-transparent py-3 ps-7 outline-none transition-colors focus:border-[#F97316]"
                            />
                          </div>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-gray-900">
                            ساعت
                          </span>
                          <div className="relative">
                            <Clock className="pointer-events-none absolute start-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F97316]" />
                            <input
                              type="time"
                              required
                              value={time}
                              onChange={(e) => setTime(e.target.value)}
                              className="w-full border-b border-gray-300 bg-transparent py-3 ps-7 outline-none transition-colors focus:border-[#F97316]"
                            />
                          </div>
                        </label>
                      </div>

                      {/* Contact */}
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-gray-900">
                            نام کامل
                          </span>
                          <div className="relative">
                            <User className="pointer-events-none absolute start-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F97316]" />
                            <input
                              type="text"
                              required
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="علی رضایی"
                              className="w-full border-b border-gray-300 bg-transparent py-3 ps-7 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-[#F97316]"
                            />
                          </div>
                        </label>
                        <label className="block">
                          <span className="mb-2 block text-sm font-medium text-gray-900">
                            شماره تلفن
                          </span>
                          <div className="relative">
                            <Phone className="pointer-events-none absolute start-0 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F97316]" />
                            <input
                              type="tel"
                              required
                              value={guestPhone}
                              onChange={(e) => setGuestPhone(e.target.value)}
                              placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                              className="w-full border-b border-gray-300 bg-transparent py-3 ps-7 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-[#F97316]"
                            />
                          </div>
                        </label>
                      </div>

                      {/* Special requests */}
                      <label className="block">
                        <span className="mb-2 block text-sm font-medium text-gray-900">
                          درخواست‌های ویژه
                        </span>
                        <textarea
                          rows={2}
                          value={specialRequests}
                          onChange={(e) => setSpecialRequests(e.target.value)}
                          placeholder="آلرژی، جشن، ترجیحات نشستن..."
                          className="w-full resize-none border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-[#F97316]"
                        />
                      </label>

                      {error && (
                        <p className="text-sm text-red-500" role="alert">
                          {error}
                        </p>
                      )}

                      <AnimatedButton type="submit" className="mt-8 w-full py-4">
                        {loading ? "در حال ثبت..." : "تأیید رزرو"}
                      </AnimatedButton>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
