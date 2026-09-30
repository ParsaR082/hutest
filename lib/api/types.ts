export type MenuItemList = {
  id: number;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  price_display: string;
  image: string;
  category: string;
  is_best_seller: boolean;
  is_featured: boolean;
};

export type TasteProfile = {
  spiciness: number;
  sweetness: number;
  acidity: number;
  richness: number;
};

export type MenuItemDetail = MenuItemList & {
  long_description: string;
  breadcrumb: string;
  plate_image: string;
  anatomy_image: string;
  process_image: string;
  prep_time: string;
  calories: string;
  spicy_level: string;
  allergens: string;
  vegan: string;
  taste_profile: TasteProfile;
  hotspots: { id: number; top: string; left: string; name: string; description: string }[];
  process_steps: { step: string; title: string; description: string }[];
  gallery_images: { src: string; alt: string; css_class: string; hover_x: number; hover_y: number }[];
  pairings: { id: string; name: string; price: string; image: string }[];
};

export type UserProfile = {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  tier: string;
  tier_label: string;
  member_since: string;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type PublicSettings = {
  restaurant_name: string;
  logo_url?: string;
  contact_info: {
    phone: string;
    email: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  opening_hours: { days: string; time: string }[];
  social_instagram?: string;
  social_twitter?: string;
  social_facebook?: string;
  social_youtube?: string;
  delivery_fee?: number;
  free_delivery_threshold?: number;
};

export type SEOPageKey = "home" | "menu" | "about" | "contact" | "gallery" | "blog";

export type SEOSetting = {
  page_key: SEOPageKey;
  seo_title: string;
  meta_description: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_image: string;
  robots_index: boolean;
  robots_follow: boolean;
  structured_data: string;
  updated_at: string;
};

export type GalleryCategory =
  | "food"
  | "interior"
  | "exterior"
  | "atmosphere"
  | "events"
  | "team"
  | "special_dishes"
  | "behind_the_scenes";

export type GalleryItem = {
  id: number;
  image: string;
  title: string;
  description: string;
  category: GalleryCategory;
  alt_text: string;
  is_featured: boolean;
};

export type GalleryItemAdmin = GalleryItem & {
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
};

export type BlogPostList = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  author_name: string;
  published_at: string | null;
};

export type BlogPostDetail = BlogPostList & {
  content: string;
};

export type BlogPostAdmin = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentInfo = {
  id: number;
  amount: number;
  method: "cash" | "card" | "online" | "wallet";
  method_label: string;
  status: "pending" | "completed" | "failed" | "refunded";
  status_label: string;
  gateway_ref: string;
  paid_at: string | null;
};

export type OrderCustomer = {
  id: number | null;
  name: string;
  email: string;
  phone: string | null;
};

export type OrderDetail = {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  status_index: number;
  order_type: "dine_in" | "takeaway" | "delivery";
  order_type_label: string;
  customer: OrderCustomer;
  subtotal: number;
  subtotal_display: string;
  delivery_fee: number;
  delivery_fee_display: string;
  discount: number;
  discount_display: string;
  total: number;
  total_display: string;
  estimated_minutes: number | null;
  items: { id: number; name: string; unit_price: number; quantity: number }[];
  placed_at: string;
  payment: PaymentInfo | null;
  delivery_recipient_name: string;
  delivery_phone: string;
  delivery_address: string;
  delivery_address_details: string;
  delivery_notes: string;
};

export type Reservation = {
  id: number;
  reservation_code: string;
  guest_name: string;
  guest_phone: string;
  date: string;
  time: string;
  party_size: number;
  special_requests?: string;
  status: string;
  status_label: string;
  table_id: number | null;
  table_label: string | null;
};
