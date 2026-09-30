from django.contrib import admin

from apps.menu.models import DishGalleryImage, DishHotspot, DishPairing, DishProcessStep, MenuItem


class DishHotspotInline(admin.TabularInline):
    model = DishHotspot
    extra = 0


class DishProcessStepInline(admin.TabularInline):
    model = DishProcessStep
    extra = 0


class DishGalleryImageInline(admin.TabularInline):
    model = DishGalleryImage
    extra = 0


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "category", "price", "is_available", "is_featured")
    list_filter = ("category", "is_available", "is_featured", "is_best_seller")
    search_fields = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    inlines = [DishHotspotInline, DishProcessStepInline, DishGalleryImageInline]
