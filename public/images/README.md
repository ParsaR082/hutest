# Site Images

Place your image files in these folders. Filenames must match exactly.

## `hero/`
| File | Used for |
|------|----------|
| `dish.png` | Homepage hero — main food image |

## `menu/`
| File | Used for |
|------|----------|
| `ingredients-bg.png` | Menu parallax hero — scattered ingredients ring (transparent PNG) |
| `pan.png` | Menu parallax hero — centered pan with steak (transparent PNG) |
| `plate.png` | Legacy single-plate asset |
| `main-dish.png` | Menu zig-zag row 2+ reference / fallback |
| `side-dish.png` | Side dish row |
| `dessert.png` | Dessert row |

## `menu/trails/` (desktop only — powder connector)
| File | Used for |
|------|----------|
| `salt-trail-1.png` | Organic salt/flour dust between dishes |
| `salt-trail-2.png` | … |
| `salt-trail-3.png` | … |
| `salt-trail-4.png` | … |
| `salt-trail-5.png` | … |
| `salt-trail-6.png` | … |

Adjust positions in `app/menu/page.tsx` → `POWDER_TRAILS` array.

## `dishes/`
| File | Used for |
|------|----------|
| `alfredo.png` | Popular dishes carousel |
| `chicken.png` | Popular dishes carousel |
| `pizza.png` | Popular dishes carousel |
| `cake.png` | Popular dishes carousel |
| `risotto.png` | Popular dishes carousel |

## `about/` (About page — `/about`)
| File | Used for |
|------|----------|
| `signature.png` | Chef signature in intro & chef sections |
| `cloud-left.png` | Cloud curtain — left (transparent PNG) |
| `cloud-right.png` | Cloud curtain — right (transparent PNG) |

### `about/decor/` (floating ornaments — transparent PNG)
| File | Used for |
|------|----------|
| `chili.png` | Intro grid — left edge |
| `napkin.png` | Hours box — top-right overlap |
| `salad-bowl.png` | Dinner event section — bottom-left |
| `lime.png` | Exquisite restaurant section — bottom-right |
| `basil.png` | Testimonials — left edge |
| `fork-knife.png` | Testimonials — right edge |

Main photos use Unsplash preview URLs in `lib/images.ts` until you add local files.

## `banners/`
| File | Used for |
|------|----------|
| `reservation.png` | Reservation banner background |

---

Supported formats: `.png`, `.jpg`, `.jpeg`, `.webp`  
If you use JPG instead of PNG, update paths in `lib/images.ts`.

## After replacing an image file

1. Bump `NEXT_PUBLIC_ASSET_VERSION` in `.env.local` (e.g. `2` → `3`)
2. Restart dev server: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R`
