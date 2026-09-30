import { images } from "@/lib/images";
import { formatToman } from "@/lib/format-price";

export type DashboardTab =
  | "overview"
  | "active-orders"
  | "history"
  | "reservations";

export const ORDER_STATUS_STEPS_STANDARD = [
  "ثبت سفارش",
  "تأیید سفارش",
  "در حال آماده‌سازی",
  "آماده تحویل",
  "تحویل شد",
] as const;

export const ORDER_STATUS_STEPS_DELIVERY = [
  "ثبت سفارش",
  "تأیید سفارش",
  "در حال آماده‌سازی",
  "آماده تحویل",
  "در حال ارسال",
  "تحویل شد",
] as const;

export type OrderStatusStep =
  | (typeof ORDER_STATUS_STEPS_STANDARD)[number]
  | (typeof ORDER_STATUS_STEPS_DELIVERY)[number];

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  memberSince: string;
  tier: string;
}

export interface ActiveOrder {
  orderDbId: number;
  id: string;
  dishName: string;
  items: string[];
  statusIndex: number;
  orderType: string;
  estimatedMinutes: number;
  placedAt: string;
}

export interface Reservation {
  id: string;
  date: string;
  time: string;
  guests: number;
  tableLabel: string;
  status: "confirmed" | "pending";
  reservationId?: number;
}

export interface OrderHistoryItem {
  id: string;
  date: string;
  dishes: string;
  price: string;
  itemCount: number;
  orderId?: number;
}

export const MOCK_USER: MockUser = {
  id: "usr_001",
  name: "الکساندر چن",
  email: "alex.chen@humazd.com",
  avatar: images.about.avatar1,
  memberSince: "۱۴۰۳",
  tier: "عضو VIP",
};

export const MOCK_ACTIVE_ORDER: ActiveOrder = {
  orderDbId: 0,
  id: "ORD-7842",
  dishName: "دنده کوتاه ترافل",
  items: ["دنده کوتاه ترافل", "Barolo Reserve", "هویج رنگی محلی"],
  statusIndex: 2,
  orderType: "dine_in",
  estimatedMinutes: 18,
  placedAt: "امروز، ۶:۴۲ بعدازظهر",
};

export const MOCK_RESERVATION: Reservation = {
  id: "RES-3291",
  date: "جمعه، ۲۴ مرداد",
  time: "7:30 PM",
  guests: 2,
  tableLabel: "میز کنار پنجره ۴",
  status: "confirmed",
};

export const MOCK_ORDER_HISTORY: OrderHistoryItem[] = [
  {
    id: "ORD-7720",
    date: "۲۱ تیر ۱۴۰۵",
    dishes: "دنده کوتاه ترافل، هویج رنگی محلی",
    price: formatToman(2_700_000),
    itemCount: 2,
  },
  {
    id: "ORD-7698",
    date: "۱۴ تیر ۱۴۰۵",
    dishes: "ریزوتوی دریایی، فوندان شکلاتی، Prosecco",
    price: formatToman(2_350_000),
    itemCount: 3,
  },
  {
    id: "ORD-7611",
    date: "۷ تیر ۱۴۰۵",
    dishes: "هویج رنگی محلی، نان دست‌ساز، Sauvignon Blanc",
    price: formatToman(1_800_000),
    itemCount: 3,
  },
];

export const DASHBOARD_NAV = [
  { id: "overview" as const, label: "نمای کلی", shortLabel: "نمای", icon: "layout-dashboard" },
  { id: "active-orders" as const, label: "سفارش‌های فعال", shortLabel: "سفارش", icon: "chef-hat" },
  { id: "history" as const, label: "تاریخچه سفارش", shortLabel: "تاریخ", icon: "history" },
  { id: "reservations" as const, label: "رزرو میز", shortLabel: "رزرو", icon: "calendar" },
] as const;
