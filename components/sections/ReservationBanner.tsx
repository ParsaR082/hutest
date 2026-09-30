import { LocalImage } from "@/components/ui/LocalImage";
import { BookTableButton } from "@/components/booking/BookTableButton";
import { Calendar } from "lucide-react";
import { images } from "@/lib/images";
import { fetchSiteImages } from "@/lib/api/site-images";

export async function ReservationBanner() {
  let backgroundImage: string = images.banners.reservation;
  try {
    const siteImages = await fetchSiteImages();
    backgroundImage = siteImages.reservation_banner_bg ?? backgroundImage;
  } catch {
    // use fallback
  }

  return (
    <section id="reservations" className="bg-cream px-4 py-12 sm:px-6 lg:px-10">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-charcoal">
        <LocalImage
          src={backgroundImage}
          alt=""
          fill
          className="object-cover opacity-30 blur-sm"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/95 to-charcoal/80" />

        <div className="relative z-10 flex flex-col items-start justify-between gap-8 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <div className="mb-3 flex items-center gap-2 text-orange-brand">
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">
                رزرو میز
              </span>
            </div>
            <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
              همین حالا میز خود را رزرو کنید!
            </h2>
            <p className="mt-3 text-sm text-white/60 sm:text-base">
              جای خود را برای یک تجربه غذایی فراموش‌نشدنی رزرو کنید. مشتاقانه
              منتظر پذیرایی از شما هستیم.
            </p>
          </div>
          <BookTableButton className="inline-flex shrink-0 items-center gap-2 rounded-full bg-orange-brand px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-brand/30 transition hover:bg-orange-600">
            <Calendar className="h-4 w-4" />
            رزرو میز
          </BookTableButton>
        </div>
      </div>
    </section>
  );
}
