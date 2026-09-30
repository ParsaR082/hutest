import { images } from "@/lib/images";
import { formatToman } from "@/lib/format-price";

export interface MenuZigZagItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  price: string;
}

export const menuZigZagItems: MenuZigZagItem[] = [
  {
    id: "main-dish",
    title: "Main Dish",
    subtitle: "امضای سرآشپز",
    description:
      "دنده کوتاه braised آهسته روی پورée سیب‌زمینی دودی، با jus پیاز کاراملی و میکرو سبزی. بشقابی برای اشتراک‌گذاری.",
    image: images.menu.mainDish,
    price: formatToman(1_900_000),
  },
  {
    id: "side-dish",
    title: "Side Dish",
    subtitle: "انتخاب فصلی",
    description:
      "هویج heirloom کبابی با پنیر بز whipped، خرد پسته و drizzle عسل گل پرتقال.",
    image: images.menu.sideDish,
    price: formatToman(800_000),
  },
  {
    id: "dessert",
    title: "Sweet Finish",
    subtitle: "کانتر شیرینی",
    description:
      "فوندان شکلات تیره با مرکز گداخته، ژلاتوی وانیل و تکه‌های کارامل نمکی.",
    image: images.menu.dessert,
    price: formatToman(700_000),
  },
];

/** Top-down plate for hero drop + scroll-linked transition */
export const HERO_PLATE_IMAGE = images.menu.plate;
