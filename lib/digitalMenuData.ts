import type { DigitalDishCategory } from "@/types/digitalMenu";

export const digitalMenuCategories: DigitalDishCategory[] = [
  {
    id: "appetizers",
    enTitle: "Appetizers",
    faTitle: "پیش غذاها",
    subtitle: "Start Your Journey",
    subtitleFa: "شروعی لذیذ",
    items: [
      {
        id: "a1",
        enTitle: "Truffle Burrata",
        faTitle: "بوراتا قارچ ترuffle",
        enDesc:
          "Creamy burrata, black truffle shavings, heirloom tomatoes, aged balsamic, micro basil",
        faDesc:
          "بوراتای خامه‌ای، ترuffle سیاه، گوجه ارگانیک، بالزامیک کهنه، ریحان میکرو",
        price: "۳۸۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1608894584379-c5322b1c7c4a?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "a2",
        enTitle: "Seared Scallops",
        faTitle: "اسکالوپ تابه‌ای",
        enDesc:
          "Pan-seared scallops, cauliflower purée, crispy pancetta, lemon beurre blanc",
        faDesc:
          "اسکالوپ تابه‌ای، پورée گل‌کلم، پانچتا ترد، سس کره لیمو",
        price: "۴۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1559847844-d72438926559?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "a3",
        enTitle: "Duck Liver Parfait",
        faTitle: "پâté جگر اردک",
        enDesc:
          "Silky duck liver mousse, fig compote, toasted brioche, fleur de sel",
        faDesc: "موس جگر اردک، کمپوت انجیر، نان بrioche تست شده، نمک دریایی",
        price: "۳۲۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "a4",
        enTitle: "Tuna Tartare",
        faTitle: "تارتار تن",
        enDesc: "Sushi-grade tuna, avocado, sesame, yuzu, crispy wonton chips",
        faDesc: "تن درجه سوشی، آووکادو، کنجد، yuzu، چیپس wonton ترد",
        price: "۴۲۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?q=80&w=500&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "main-courses",
    enTitle: "Main Courses",
    faTitle: "غذاهای اصلی",
    subtitle: "Chef's Signature Selection",
    subtitleFa: "انتخاب امضای سرآشپز",
    items: [
      {
        id: "m1",
        enTitle: "Wagyu Ribeye",
        faTitle: "ریبای وagyu",
        enDesc:
          "A5 wagyu ribeye, roasted bone marrow, truffle pomme purée, red wine jus",
        faDesc:
          "ریبای وagyu درجه A5، مغز استخوان کبابی، پورée سیب‌زمینی trufle، سس شراب قرمز",
        price: "۱,۸۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "m2",
        enTitle: "Pan-Roasted Sea Bass",
        faTitle: "ماهی seabass",
        enDesc:
          "Crispy skin sea bass, saffron risotto, fennel salad, citrus beurre blanc",
        faDesc:
          "seabass با پوست ترد، ریزotto زعفران، سالاد رازیانه، سس کره مرکبات",
        price: "۶۸۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "m3",
        enTitle: "Lamb Rack",
        faTitle: "رack بره",
        enDesc:
          "Herb-crusted lamb rack, ratatouille, rosemary jus, mint gremolata",
        faDesc:
          "rack بره با پوشش herb، ratatouille، سس رزmary، gremolata نعنا",
        price: "۹۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1529692236671-f1f8cf9683ba?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "m4",
        enTitle: "Duck Confit",
        faTitle: "کonfit اردک",
        enDesc:
          "Slow-cooked duck leg, cherry gastrique, potato gratin, haricots verts",
        faDesc:
          "ران اردک پخته آهسته، gastrique گیلاس، گرatin سیب‌زمینی، لوبیا سبز",
        price: "۷۲۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1432139540174-001f1eb6c8e3?q=80&w=500&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "salads",
    enTitle: "Salads",
    faTitle: "سالادها",
    subtitle: "All Healthy & Fresh",
    subtitleFa: "همه سالم و تازه",
    badge: "Extras Available",
    badgeFa: "افزودنی موجود است",
    items: [
      {
        id: "s1",
        enTitle: "Avocado Salad",
        faTitle: "سالاد آووکادو",
        enDesc:
          "Avocado, Mediterranean greens, Cherry tomato, pomegranate, dried tomato, mozzarella balls, Olive with lemon sauce",
        faDesc:
          "آووکادو، سبزیجات مدیترانه‌ای، گوجه گیلاسی، انار، گوجه خشک، توپک‌های موزارلا، زیتون با سس لیمو",
        price: "۳۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "s2",
        enTitle: "Salmon Salad",
        faTitle: "سالاد سالمون",
        enDesc:
          "Orange Salmon Fish, Mediterranean greens, Cherry tomato, Beetroot, Caper flower",
        faDesc:
          "ماهی سالمون، سبزیجات مدیترانه‌ای، گوجه گیلاسی، چغندر، گل کیپر",
        price: "۴۲۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "s3",
        enTitle: "Greek Salad",
        faTitle: "سالاد یونانی",
        enDesc:
          "Tomato, Cucumber, Sliced red onion, green pepper, Olive, Cheese, Lemon sauce",
        faDesc: "گوجه، خیار، پیاز قرمز، فلفل سبز، زیتون، پنیر، سس لیمو",
        price: "۲۸۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "s4",
        enTitle: "Barbara Beef Salad",
        faTitle: "سالاد بیف باربارا",
        enDesc:
          "Grilled beef with barbera sauce, Mediterranean greens, Tomato, Cucumber, Black olive, Sweet Corn, Red kidney beans",
        faDesc:
          "بیف گریل شده با سس باربارا، سبزیجات، گوجه، خیار، زیتون سیاه، ذرت، لوبیا قرمز",
        price: "۴۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1529312266912-b33cfce2eefd?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "s5",
        enTitle: "Pomegranate Arugula",
        faTitle: "سالاد انار و آروگولا",
        enDesc:
          "Arugula, Orange, Walnut, Pomegranate, Tomato, Beetroot with Parmesan leaf",
        faDesc: "آروگولا، پرتقال، گردو، انار، گوجه، چغندر با ورقه‌های پارمسان",
        price: "۲۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?q=80&w=500&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "drinks",
    enTitle: "Drinks",
    faTitle: "نوشیدنی‌ها",
    subtitle: "Curated Beverages",
    subtitleFa: "نوشیدنی‌های منتخب",
    items: [
      {
        id: "d1",
        enTitle: "Signature Old Fashioned",
        faTitle: "اولد فشن امضا",
        enDesc:
          "Small batch bourbon, demerara, aromatic bitters, orange peel, smoked cherry",
        faDesc:
          "بورbon دست‌ساز، demerara، بیتters معطر، پوست پرتقال، گیلاس دودی",
        price: "۲۸۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "d2",
        enTitle: "Espresso Martini",
        faTitle: "اسپرسو مارتینی",
        enDesc:
          "Double espresso, premium vodka, coffee liqueur, vanilla, three coffee beans",
        faDesc: "اسپرسو دوبل، ودka ممتاز، liqueur قهوه، وانیل، سه دانه قهوه",
        price: "۲۲۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1514362545857-3bc16549fdb5?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "d3",
        enTitle: "Persian Saffron Tea",
        faTitle: "چای زعفران ایرانی",
        enDesc:
          "Premium saffron threads, cardamom, rose water, rock candy, dried lime",
        faDesc: "رشته‌های زعفران ممتاز، هل، گلاب، نبات، لیمو خشک",
        price: "۹۵,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "d4",
        enTitle: "Fresh Pressed Juice",
        faTitle: "آبمیوه تازه",
        enDesc:
          "Seasonal fruits, cold-pressed, no added sugar, served over crystal ice",
        faDesc:
          "میوه‌های فصلی، cold-pressed، بدون قند افزوده، روی یخ کristal",
        price: "۱۵۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?q=80&w=500&auto=format&fit=crop",
      },
    ],
  },
  {
    id: "desserts",
    enTitle: "Desserts",
    faTitle: "دسرها",
    subtitle: "Sweet Endings",
    subtitleFa: "پایانی شیرین",
    items: [
      {
        id: "de1",
        enTitle: "Dark Chocolate Soufflé",
        faTitle: "سوفlé شکلات تلخ",
        enDesc:
          "Valrhona dark chocolate, vanilla crème anglaise, gold leaf, raspberry coulis",
        faDesc:
          "شکلات تلخ Valrhona، crème anglaise وانیل، ورق طلا، coulis تمشک",
        price: "۲۹۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "de2",
        enTitle: "Crème Brûlée",
        faTitle: "کرم brûlée",
        enDesc:
          "Madagascar vanilla bean, caramelized sugar crust, seasonal berries",
        faDesc: "وانیل Madagascar، پوسته کارamelized، توت‌های فصلی",
        price: "۲۴۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "de3",
        enTitle: "Saffron Panna Cotta",
        faTitle: "پanna cotta زعفران",
        enDesc:
          "Persian saffron infused cream, pistachio crumble, rose petal, honey drizzle",
        faDesc: "خامه زعفران ایرانی، crumble پسته، گلبرگ رز، عسل",
        price: "۲۱۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop",
      },
      {
        id: "de4",
        enTitle: "Tiramisu",
        faTitle: "تیرامیسو",
        enDesc:
          "Espresso-soaked ladyfingers, mascarpone mousse, cocoa dust, amaretto",
        faDesc:
          "لیدیfingers آغشته به اسپرسو، موس mascarpone، پودر کاکائو، amaretto",
        price: "۲۶۰,۰۰۰",
        image:
          "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=500&auto=format&fit=crop",
      },
    ],
  },
];
