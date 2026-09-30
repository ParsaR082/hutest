import { images } from "@/lib/images";
import { formatToman } from "@/lib/format-price";

export const navLinks = [
  { href: "/", label: "خانه" },
  { href: "/menu", label: "منو" },
  { href: "/digital-menu", label: "منوی دیجیتال" },
  { href: "/about", label: "درباره ما" },
  { href: "/gallery", label: "گالری" },
  { href: "/#reservations", label: "رزرو", action: "openBooking" as const },
  { href: "/blog", label: "وبلاگ" },
  { href: "/contact", label: "تماس" },
];

export const heroFeatures = [
  { label: "مواد اولیه تازه", icon: "leaf" as const },
  { label: "سرآشپزهای حرفه‌ای", icon: "chef" as const },
  { label: "فضای دلنشین", icon: "star" as const },
];

export const aboutFeatures = [
  { title: "مواد اولیه تازه", description: "تأمین روزانه از منابع محلی", icon: "leaf" as const },
  { title: "سرآشپزهای ماهر", description: "تیم برنده جوایز", icon: "chef" as const },
  { title: "سرویس سریع و صمیمی", description: "مهمان‌نوازی گرم", icon: "service" as const },
  { title: "مشتریان راضی", description: "بیش از ۲٬۵۰۰ نظر", icon: "happy" as const },
];

export interface Dish {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  bestSeller?: boolean;
}

export const popularDishes: Dish[] = [
  {
    id: "1",
    name: "پاستای آلفردو خامه‌ای",
    description: "سس خامه‌ای پارمزان با فتوچینی تازه",
    price: formatToman(900_000),
    image: images.dishes.alfredo,
    bestSeller: true,
  },
  {
    id: "2",
    name: "استیک مرغ کبابی",
    description: "مرغ مزه‌دار با سبزیجات فصلی",
    price: formatToman(1_200_000),
    image: images.dishes.chicken,
  },
  {
    id: "3",
    name: "پیتزای مارگاریتا",
    description: "خمیر پخت‌شده در تنور با موتزارلای بوفالو",
    price: formatToman(800_000),
    image: images.dishes.pizza,
  },
  {
    id: "4",
    name: "کیک لاوا شکلاتی",
    description: "مرکز گداخته گرم با ژلاتوی وانیلی",
    price: formatToman(600_000),
    image: images.dishes.cake,
  },
  {
    id: "5",
    name: "ریزوتوی دریایی",
    description: "برنج arborio با میگو و زعفران",
    price: formatToman(1_100_000),
    image: images.dishes.risotto,
  },
];

export const footerQuickLinks = [
  { label: "خانه", href: "/" },
  { label: "درباره ما", href: "/about" },
  { label: "منو", href: "/menu" },
  { label: "گالری", href: "/gallery" },
  { label: "وبلاگ", href: "/blog" },
  { label: "رزرو", href: "/#reservations", action: "openBooking" as const },
  { label: "تماس", href: "/contact" },
];

export const openingHours = [{ days: "هر روز", time: "۰۹:۰۰ – ۰۰:۰۰" }];

export const RESTAURANT_MAP_URL = atob("aHR0cHM6Ly9tYXBzLmFwcC5nb28uZ2wvWHdlZFJpUlZ5RGtkbWdyNzk=");

export const contactInfo = {
  phone: "۳۳۲۲۷۶۴۱ / ۳۳۲۲۷۶۴۰",
  email: "Humazdrestaurant@gmail.com",
  address: "ارومیه، خیابان امام رضا ۱",
  coordinates: {
    // Kept for backwards compatibility with settings consumers; map links use the exact restaurant pin above.
    lat: 37.5527,
    lng: 45.0761,
  },
};

export function getMapEmbedUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT_MAP_URL)}&hl=fa&z=16&output=embed`;
}

export function getMapDirectionsUrl(lat: number, lng: number) {
  return RESTAURANT_MAP_URL;
}
