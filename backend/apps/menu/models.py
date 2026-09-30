from django.db import models

from apps.core.models import TimeStampedModel


class MenuItem(TimeStampedModel):
    class Category(models.TextChoices):
        STARTERS = "starters", "Starters"
        MAINS = "mains", "Mains"
        DESSERTS = "desserts", "Desserts"
        DRINKS = "drinks", "Drinks"
        SPECIALS = "specials", "Specials"

    slug = models.SlugField(unique=True, max_length=200)
    name = models.CharField(max_length=200)
    name_en = models.CharField(max_length=200, blank=True)
    subtitle = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    long_description = models.TextField(blank=True)
    category = models.CharField(max_length=20, choices=Category.choices)
    price = models.PositiveIntegerField()

    image = models.CharField(max_length=500)
    plate_image = models.CharField(max_length=500, blank=True)
    anatomy_image = models.CharField(max_length=500, blank=True)
    process_image = models.CharField(max_length=500, blank=True)

    prep_time = models.CharField(max_length=50, blank=True)
    calories = models.CharField(max_length=50, blank=True)
    spicy_level = models.CharField(max_length=50, blank=True)
    allergens = models.CharField(max_length=200, blank=True)
    vegan = models.CharField(max_length=100, blank=True)

    taste_spiciness = models.PositiveSmallIntegerField(default=0)
    taste_sweetness = models.PositiveSmallIntegerField(default=0)
    taste_acidity = models.PositiveSmallIntegerField(default=0)
    taste_richness = models.PositiveSmallIntegerField(default=0)

    is_available = models.BooleanField(default=True)
    is_best_seller = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    sort_order = models.PositiveIntegerField(default=0)

    meta_title = models.CharField(max_length=200, blank=True)
    meta_description = models.TextField(blank=True)

    pairings = models.ManyToManyField(
        "self",
        through="DishPairing",
        symmetrical=False,
        related_name="paired_by",
    )

    class Meta:
        ordering = ["sort_order", "name"]
        indexes = [
            models.Index(fields=["category", "is_available"]),
            models.Index(fields=["slug"]),
        ]

    def __str__(self):
        return self.name


class DishHotspot(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="hotspots")
    top = models.CharField(max_length=10)
    left = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    description = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]


class DishProcessStep(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="process_steps")
    step = models.CharField(max_length=10)
    title = models.CharField(max_length=200)
    description = models.TextField()
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]


class DishGalleryImage(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="gallery_images")
    src = models.CharField(max_length=500)
    alt = models.CharField(max_length=200)
    css_class = models.CharField(max_length=100, blank=True)
    hover_x = models.IntegerField(default=0)
    hover_y = models.IntegerField(default=0)
    sort_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["sort_order"]


class DishPairing(models.Model):
    main_dish = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="pairing_links")
    paired_dish = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="paired_dish_links")

    class Meta:
        unique_together = [("main_dish", "paired_dish")]
