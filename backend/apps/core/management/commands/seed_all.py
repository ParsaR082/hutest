from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils.text import slugify

from apps.cms.models import OpeningHour, SiteSettings, Testimonial
from apps.menu.models import DishHotspot, DishProcessStep, MenuItem
from apps.reservations.models import Table

User = get_user_model()

MENU_SEED = [
    {
        "slug": "main-dish",
        "name": "دنده کوتاه ترافل",
        "subtitle": "امضای سرآشپز",
        "category": "mains",
        "description": "دنده کوتاه پخته آهسته روی پوره سیب‌زمینی دودی.",
        "long_description": "چهل‌وهشت ساعت پخت ملایم، بافتی نرم و ابریشمی ایجاد می‌کند.",
        "price": 1_900_000,
        "image": "/images/menu/main-dish.png",
        "prep_time": "۴۵ دقیقه",
        "calories": "۶۸۰",
        "is_featured": True,
        "is_best_seller": True,
        "taste_spiciness": 10,
        "taste_sweetness": 30,
        "taste_acidity": 25,
        "taste_richness": 95,
    },
    {
        "slug": "side-dish",
        "name": "هویج رنگی محلی",
        "subtitle": "انتخاب فصلی",
        "category": "starters",
        "description": "هویج heirloom کبابی، پنیر بز whipped، خرد پسته.",
        "price": 800_000,
        "image": "/images/menu/side-dish.png",
        "is_featured": True,
    },
    {
        "slug": "sweet-finish",
        "name": "فوندان شکلاتی",
        "subtitle": "کانتر شیرینی",
        "category": "desserts",
        "description": "فوندان شکلات تیره، مرکز گداخته، ژلاتوی وانیل.",
        "price": 700_000,
        "image": "/images/menu/dessert.png",
        "is_featured": True,
    },
    {
        "slug": "seafood-risotto",
        "name": "ریزوتوی دریایی",
        "subtitle": "ویژه روز",
        "category": "mains",
        "description": "برنج arborio با زعفران، میگو و رازیانه.",
        "price": 1_100_000,
        "image": "/images/menu/risotto.png",
        "is_featured": True,
    },
    {
        "slug": "burrata-tomato",
        "name": "بوراتا و گوجه heirloom",
        "subtitle": "پیش‌غذا",
        "category": "starters",
        "description": "بوراتا خامه‌ای، روغن ریحان، بالزامیک.",
        "price": 900_000,
        "image": "/images/menu/side-dish.png",
    },
    {
        "slug": "creme-brulee",
        "name": "کرم brûlée وانیلی",
        "subtitle": "پایان کلاسیک",
        "category": "desserts",
        "description": "کرم وانیل با پوسته کارامل شکننده.",
        "price": 600_000,
        "image": "/images/menu/cake.svg",
    },
    {
        "slug": "seared-scallops",
        "name": "اسکالوپ تابه‌ای",
        "subtitle": "از خط سرو",
        "category": "starters",
        "description": "اسکالوپ روز، پورée گل‌کلم، beurre blanc.",
        "price": 1_300_000,
        "image": "/images/menu/seared-scallops.svg",
    },
]

TABLES_SEED = [
    ("میز ۱ — سالن اصلی", 2, "Main"),
    ("میز ۲ — سالن اصلی", 4, "Main"),
    ("میز ۳ — سالن اصلی", 4, "Main"),
    ("میز ۴ — کنار پنجره", 2, "Main"),
    ("میز ۵ — کنار پنجره", 4, "Main"),
    ("میز VIP ۱", 4, "VIP"),
    ("میز VIP ۲", 6, "VIP"),
    ("میز تراس ۱", 4, "Terrace"),
    ("میز تراس ۲", 6, "Terrace"),
]


class Command(BaseCommand):
    help = "Seed database with initial Humazd data"

    def handle(self, *args, **options):
        self.stdout.write("Seeding site settings...")
        SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                "restaurant_name": "Humazd",
                "logo_url": "/images/brand/logo.png",
                "phone": "+1 (234) 567-890",
                "email": "hello@humazd.com",
                "address": "خیابان فلور ۱۲۳، شهر غذا، FC 10001",
                "lat": 35.7219,
                "lng": 51.3347,
            },
        )

        OpeningHour.objects.all().delete()
        OpeningHour.objects.create(days="دوشنبه – جمعه", open_time="11:00", close_time="22:00", sort_order=1)
        OpeningHour.objects.create(days="شنبه – یکشنبه", open_time="10:00", close_time="23:00", sort_order=2)

        self.stdout.write("Seeding menu items...")
        for i, item in enumerate(MENU_SEED):
            MenuItem.objects.update_or_create(
                slug=item["slug"],
                defaults={**item, "sort_order": i},
            )

        if MenuItem.objects.filter(slug="main-dish").exists():
            main = MenuItem.objects.get(slug="main-dish")
            DishHotspot.objects.get_or_create(
                menu_item=main,
                name="لایه چربی",
                defaults={"top": "35%", "left": "40%", "description": "لایه چربی مرغوب و نرم.", "sort_order": 1},
            )
            DishProcessStep.objects.get_or_create(
                menu_item=main,
                step="01",
                defaults={"title": "پخت آهسته", "description": "۴۸ ساعت پخت کنترل‌شده.", "sort_order": 1},
            )

        self.stdout.write("Seeding tables...")
        for label, capacity, zone in TABLES_SEED:
            Table.objects.get_or_create(label=label, defaults={"capacity": capacity, "zone": zone})

        Testimonial.objects.get_or_create(
            name="سارا احمدی",
            defaults={
                "role": "مهمان VIP",
                "content": "بهترین تجربه آشپزی که در تهران داشتم.",
                "rating": 5,
                "sort_order": 1,
            },
        )

        if not User.objects.filter(email="admin@humazd.com").exists():
            User.objects.create_superuser(
                username="admin",
                email="admin@humazd.com",
                password="Admin123!@#",
                first_name="Admin",
                last_name="Humazd",
                role=User.Role.SUPER_ADMIN,
            )
            self.stdout.write(self.style.SUCCESS("Superuser: admin@humazd.com / Admin123!@#"))

        if not User.objects.filter(email="alex.chen@humazd.com").exists():
            User.objects.create_user(
                username="alexchen",
                email="alex.chen@humazd.com",
                password="Demo123!@#",
                first_name="الکساندر",
                last_name="چن",
                role=User.Role.CUSTOMER,
                tier=User.Tier.VIP,
            )
            self.stdout.write(self.style.SUCCESS("Demo customer: alex.chen@humazd.com / Demo123!@#"))

        self.stdout.write(self.style.SUCCESS("Seed completed successfully."))
