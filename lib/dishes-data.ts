export interface DishPairing {
  id: string;
  name: string;
  price: string;
  image: string;
}

export interface DishHotspot {
  id: string;
  top: string;
  left: string;
  name: string;
  description: string;
}

export interface TasteProfile {
  spiciness: number;
  sweetness: number;
  acidity: number;
  richness: number;
}

export interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  className: string;
  hoverX: number;
  hoverY: number;
}

export interface DishDetail {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: string;
  breadcrumb: string;
  description: string;
  longDescription: string;
  price: string;
  image: string;
  plateImage: string;
  anatomyImage: string;
  processImage: string;
  prepTime: string;
  calories: string;
  spicyLevel: string;
  allergens: string;
  vegan: string;
  tasteProfile: TasteProfile;
  hotspots: DishHotspot[];
  processSteps: ProcessStep[];
  galleryImages: GalleryImage[];
  floatingIngredients: { src: string; className: string }[];
  pairings: DishPairing[];
}
