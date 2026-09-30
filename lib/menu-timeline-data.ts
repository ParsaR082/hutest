export type MenuCategory = "starters" | "mains" | "desserts";

export type MenuFilterId = "all" | MenuCategory;

export interface TimelineMenuItem {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  category: MenuCategory;
}

export const MENU_FILTER_TABS: { id: MenuFilterId; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "starters", label: "پیش‌غذا" },
  { id: "mains", label: "غذای اصلی" },
  { id: "desserts", label: "دسر" },
];

export function filterTimelineItems(
  items: TimelineMenuItem[],
  category: MenuFilterId
): TimelineMenuItem[] {
  if (category === "all") return items;
  return items.filter((item) => item.category === category);
}
