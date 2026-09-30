from django.db import models


class GalleryItem(models.Model):
    class Category(models.TextChoices):
        FOOD = "food", "Food"
        INTERIOR = "interior", "Interior"
        EXTERIOR = "exterior", "Exterior"
        ATMOSPHERE = "atmosphere", "Atmosphere"
        EVENTS = "events", "Events"
        TEAM = "team", "Team"
        SPECIAL_DISHES = "special_dishes", "Special Dishes"
        BEHIND_THE_SCENES = "behind_the_scenes", "Behind the Scenes"

    image = models.CharField(max_length=500)
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=30, choices=Category.choices, default=Category.FOOD)
    alt_text = models.CharField(max_length=250, blank=True)
    sort_order = models.PositiveIntegerField(default=0)
    is_visible = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["sort_order", "-created_at"]

    def __str__(self):
        return self.title or f"Gallery item #{self.pk}"
