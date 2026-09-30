export interface DigitalDishItem {
  id: string;
  enTitle: string;
  faTitle: string;
  enDesc: string;
  faDesc: string;
  price: string;
  image: string;
}

export interface DigitalDishCategory {
  id: string;
  enTitle: string;
  faTitle: string;
  subtitle?: string;
  subtitleFa?: string;
  badge?: string;
  badgeFa?: string;
  items: DigitalDishItem[];
}
