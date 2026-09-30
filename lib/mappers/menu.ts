import type { DishDetail } from "@/lib/dishes-data";
import type {
  MenuCategory,
  TimelineMenuItem,
} from "@/lib/menu-timeline-data";
import type { MenuItemDetail, MenuItemList } from "@/lib/api/types";

const CATEGORY_LABELS: Record<string, string> = {
  starters: "پیش‌غذا",
  mains: "غذای اصلی",
  desserts: "دسر",
  drinks: "نوشیدنی",
  specials: "ویژه",
};

export function mapApiToTimelineItem(item: MenuItemList): TimelineMenuItem {
  return {
    id: String(item.id),
    slug: item.slug,
    name: item.name,
    subtitle: item.subtitle,
    description: item.description,
    price: item.price_display,
    image: item.image,
    category: item.category as MenuCategory,
  };
}

export function mapApiToPopularDish(item: MenuItemList) {
  return {
    id: String(item.id),
    name: item.name,
    description: item.description,
    price: item.price_display,
    image: item.image,
    bestSeller: item.is_best_seller,
    slug: item.slug,
  };
}

export function mapApiDetailToDishDetail(api: MenuItemDetail): DishDetail {
  return {
    id: String(api.id),
    slug: api.slug,
    name: api.name,
    subtitle: api.subtitle,
    category: CATEGORY_LABELS[api.category] ?? api.category,
    breadcrumb: api.breadcrumb,
    description: api.description,
    longDescription: api.long_description || api.description,
    price: api.price_display,
    image: api.image,
    plateImage: api.plate_image || api.image,
    anatomyImage: api.anatomy_image || api.image,
    processImage: api.process_image || api.image,
    prepTime: api.prep_time || "—",
    calories: api.calories || "—",
    spicyLevel: api.spicy_level || "—",
    allergens: api.allergens || "—",
    vegan: api.vegan || "—",
    tasteProfile: api.taste_profile,
    hotspots: api.hotspots.map((h) => ({
      id: String(h.id),
      top: h.top,
      left: h.left,
      name: h.name,
      description: h.description,
    })),
    processSteps: api.process_steps,
    galleryImages: api.gallery_images.map((g) => ({
      src: g.src,
      alt: g.alt,
      className: g.css_class,
      hoverX: g.hover_x,
      hoverY: g.hover_y,
    })),
    floatingIngredients: [],
    pairings: api.pairings,
  };
}
