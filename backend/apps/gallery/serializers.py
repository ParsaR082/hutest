from rest_framework import serializers

from apps.gallery.models import GalleryItem


class GalleryItemPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = (
            "id",
            "image",
            "title",
            "description",
            "category",
            "alt_text",
            "is_featured",
        )


class GalleryItemAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalleryItem
        fields = (
            "id",
            "image",
            "title",
            "description",
            "category",
            "alt_text",
            "sort_order",
            "is_visible",
            "is_featured",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")
