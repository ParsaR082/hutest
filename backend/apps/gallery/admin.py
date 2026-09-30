from django.contrib import admin

from apps.gallery.models import GalleryItem


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "is_visible", "is_featured", "sort_order")
    list_filter = ("category", "is_visible", "is_featured")
