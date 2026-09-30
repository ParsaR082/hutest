from django.db import models


class SiteImageSlot(models.Model):
    """A named, admin-assignable image location on the public website.

    These are the site sections that used to be hardcoded static/placeholder
    images in the Next.js frontend (about page, homepage hero, booking
    modal, reservation banner) with no backend model at all. `SLUG_REGISTRY`
    is the single source of truth for which slots exist -- the frontend
    falls back to its existing static asset whenever a slot has no `media`
    assigned yet, so nothing regresses before an admin fills it in.
    """

    class Group(models.TextChoices):
        HOMEPAGE = "homepage", "صفحه اصلی"
        ABOUT = "about", "درباره ما"
        BOOKING = "booking", "رزرو میز"
        GLOBAL = "global", "عمومی"

    SLUG_REGISTRY = [
        ("homepage_hero", Group.HOMEPAGE, "تصویر اصلی صفحه اصلی (هیرو)"),
        ("homepage_about_teaser", Group.HOMEPAGE, "تصویر بخش درباره ما در صفحه اصلی"),
        ("homepage_signature_dish", Group.HOMEPAGE, "تصویر غذای امضا در صفحه اصلی"),
        ("about_hero", Group.ABOUT, "تصویر هیرو صفحه درباره ما"),
        ("about_interior", Group.ABOUT, "تصویر فضای داخلی رستوران"),
        ("about_chef", Group.ABOUT, "تصویر سرآشپز"),
        ("about_party", Group.ABOUT, "تصویر مراسم و رویداد"),
        ("about_plate", Group.ABOUT, "تصویر بشقاب از بالا"),
        ("about_strength_hygienic", Group.ABOUT, "ویژگی‌ها: تصویر بهداشت"),
        ("about_strength_fresh", Group.ABOUT, "ویژگی‌ها: تصویر مواد تازه"),
        ("about_strength_chefs", Group.ABOUT, "ویژگی‌ها: تصویر سرآشپزهای حرفه‌ای"),
        ("about_strength_events", Group.ABOUT, "ویژگی‌ها: تصویر برگزاری مراسم"),
        ("about_prefooter_1", Group.ABOUT, "گالری پایانی: تصویر ۱"),
        ("about_prefooter_2", Group.ABOUT, "گالری پایانی: تصویر ۲"),
        ("about_prefooter_3", Group.ABOUT, "گالری پایانی: تصویر ۳"),
        ("about_prefooter_4", Group.ABOUT, "گالری پایانی: تصویر ۴"),
        ("about_avatar_1", Group.ABOUT, "آواتار نظر مشتری ۱"),
        ("about_avatar_2", Group.ABOUT, "آواتار نظر مشتری ۲"),
        ("about_avatar_3", Group.ABOUT, "آواتار نظر مشتری ۳"),
        ("booking_visual", Group.BOOKING, "تصویر پنل رزرو میز"),
        ("reservation_banner_bg", Group.GLOBAL, "تصویر پس‌زمینه بنر رزرو میز"),
    ]

    slug = models.CharField(max_length=50, unique=True, choices=[(s, s) for s, _, _ in SLUG_REGISTRY])
    group = models.CharField(max_length=20, choices=Group.choices)
    label = models.CharField(max_length=200)
    media = models.ForeignKey("core.Media", on_delete=models.SET_NULL, null=True, blank=True, related_name="site_slots")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["group", "slug"]

    def __str__(self):
        return self.label


class SiteSettings(models.Model):
    restaurant_name = models.CharField(max_length=100, default="Humazd")
    logo_url = models.CharField(max_length=500, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField()
    lat = models.FloatField(default=35.7219)
    lng = models.FloatField(default=51.3347)
    social_instagram = models.URLField(blank=True)
    social_twitter = models.URLField(blank=True)
    social_facebook = models.URLField(blank=True)
    social_youtube = models.URLField(blank=True)
    delivery_fee = models.PositiveIntegerField(default=150000, help_text="Flat delivery fee in Toman")
    free_delivery_threshold = models.PositiveIntegerField(
        default=0, help_text="Order subtotal (Toman) at or above which delivery is free. 0 disables free delivery."
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Site settings"

    def __str__(self):
        return self.restaurant_name


class SEOSetting(models.Model):
    class Page(models.TextChoices):
        HOME = "home", "Homepage"
        MENU = "menu", "Menu"
        ABOUT = "about", "About"
        CONTACT = "contact", "Contact"
        GALLERY = "gallery", "Gallery"
        BLOG = "blog", "Blog"

    page_key = models.CharField(max_length=20, choices=Page.choices, unique=True)
    seo_title = models.CharField(max_length=200, blank=True)
    meta_description = models.CharField(max_length=300, blank=True)
    canonical_url = models.URLField(max_length=500, blank=True)
    og_title = models.CharField(max_length=200, blank=True)
    og_description = models.CharField(max_length=300, blank=True)
    og_image = models.CharField(max_length=500, blank=True)
    twitter_image = models.CharField(max_length=500, blank=True)
    robots_index = models.BooleanField(default=True)
    robots_follow = models.BooleanField(default=True)
    structured_data = models.TextField(blank=True, help_text="Raw JSON-LD, optional")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["page_key"]

    def __str__(self):
        return self.get_page_key_display()


class OpeningHour(models.Model):
    days = models.CharField(max_length=100)
    open_time = models.TimeField()
    close_time = models.TimeField()
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return self.days


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True)
    content = models.TextField()
    avatar = models.CharField(max_length=500, blank=True)
    rating = models.PositiveSmallIntegerField(default=5)
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    slug = models.SlugField(unique=True, allow_unicode=True)
    title = models.CharField(max_length=200)
    excerpt = models.TextField(blank=True)
    content = models.TextField()
    cover_image = models.CharField(max_length=500, blank=True)
    author_name = models.CharField(max_length=100, blank=True)
    is_published = models.BooleanField(default=False)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-published_at", "-created_at"]

    def __str__(self):
        return self.title


class ContactSubmission(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    replied_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]


class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
