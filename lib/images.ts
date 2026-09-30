/**
 * All site images are loaded from /public/images/
 * Drop your files into the matching folders — paths below are fixed.
 *
 * Folder layout:
 *   public/images/hero/       → homepage hero
 *   public/images/menu/       → menu page + scroll plate
 *   public/images/dishes/     → popular dishes carousel
 *   public/images/about/      → about page
 *   public/images/about/decor/ → floating PNG ornaments (transparent)
 *   public/images/banners/    → reservation banner background
 */

const PLACEHOLDER_WIDE = "/images/about/placeholder-wide.svg";
const PLACEHOLDER_AVATAR = "/images/about/placeholder-avatar.svg";

export const images = {
  hero: {
    background: "/images/hero/background.jpg",
  },
  signature: {
    /** Transparent PNG — drop your cutout at public/images/signature-dish.png */
    dish: "/images/signature-dish.png",
    /** SVG placeholder until signature-dish.png is added */
    dishPlaceholder: "/images/signature-dish.svg",
  },
  menu: {
    ingredientsBg: "/images/menu/ingredients-bg.png",
    pan: "/images/menu/pan.png",
    plate: "/images/menu/plate.png",
    mainDish: "/images/menu/main-dish.png",
    sideDish: "/images/menu/side-dish.png",
    dessert: "/images/menu/dessert.png",
    trails: {
      salt1: "/images/menu/trails/salt-trail-1.svg",
      salt2: "/images/menu/trails/salt-trail-2.svg",
      salt3: "/images/menu/trails/salt-trail-3.svg",
      salt4: "/images/menu/trails/salt-trail-4.svg",
      salt5: "/images/menu/trails/salt-trail-5.svg",
      salt6: "/images/menu/trails/salt-trail-6.svg",
    },
  },
  dishes: {
    alfredo: "/images/dishes/alfredo.png",
    chicken: "/images/dishes/chicken.png",
    pizza: "/images/dishes/pizza.png",
    cake: "/images/dishes/cake.png",
    risotto: "/images/dishes/risotto.png",
  },
  about: {
    /** Locally hosted placeholders — previously loaded from images.pexels.com,
     * an external CDN unreachable/unreliable for a meaningful share of real
     * users, which made the About page slow or fail to fully load. */
    hero: PLACEHOLDER_WIDE,
    interior: PLACEHOLDER_WIDE,
    chef: PLACEHOLDER_WIDE,
    party: PLACEHOLDER_WIDE,
    plate: PLACEHOLDER_WIDE,
    signature: "/images/about/signature.svg",
    cloudLeft: "/images/about/cloud-left.png",
    cloudRight: "/images/about/cloud-right.png",
    /** public/images/about/decor/ — transparent PNG ornaments */
    decor: {
      chili: "/images/about/decor/chili.png",
      napkin: "/images/about/decor/napkin.png",
      saladBowl: "/images/about/decor/salad-bowl.png",
      lime: "/images/about/decor/lime.png",
      basil: "/images/about/decor/basil.png",
      forkKnife: "/images/about/decor/fork-knife.png",
    },
    strengthHygienic: PLACEHOLDER_WIDE,
    strengthFresh: PLACEHOLDER_WIDE,
    strengthChefs: PLACEHOLDER_WIDE,
    strengthEvents: PLACEHOLDER_WIDE,
    avatar1: PLACEHOLDER_AVATAR,
    avatar2: PLACEHOLDER_AVATAR,
    avatar3: PLACEHOLDER_AVATAR,
    prefooter1: PLACEHOLDER_WIDE,
    prefooter2: PLACEHOLDER_WIDE,
    prefooter3: PLACEHOLDER_WIDE,
    prefooter4: PLACEHOLDER_WIDE,
  },
  banners: {
    reservation: "/images/banners/reservation.svg",
  },
  booking: {
    table: PLACEHOLDER_WIDE,
  },
} as const;
