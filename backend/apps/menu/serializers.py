from rest_framework import serializers

from apps.menu.models import DishGalleryImage, DishHotspot, DishProcessStep, MenuItem


def format_toman(amount: int) -> str:
    formatted = f"{amount:,}".replace(",", "٬")
    return f"{formatted} تومان"


class MenuItemListSerializer(serializers.ModelSerializer):
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = (
            "id",
            "slug",
            "name",
            "subtitle",
            "description",
            "price",
            "price_display",
            "image",
            "category",
            "is_best_seller",
            "is_featured",
        )

    def get_price_display(self, obj):
        return format_toman(obj.price)


class MenuItemAdminListSerializer(serializers.ModelSerializer):
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = (
            "id",
            "slug",
            "name",
            "subtitle",
            "description",
            "price",
            "price_display",
            "image",
            "category",
            "is_available",
            "is_best_seller",
            "is_featured",
            "sort_order",
        )

    def get_price_display(self, obj):
        return format_toman(obj.price)


class DishHotspotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishHotspot
        fields = ("id", "top", "left", "name", "description")


class DishProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishProcessStep
        fields = ("step", "title", "description")


class DishGalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DishGalleryImage
        fields = ("src", "alt", "css_class", "hover_x", "hover_y")


class MenuItemDetailSerializer(serializers.ModelSerializer):
    price_display = serializers.SerializerMethodField()
    taste_profile = serializers.SerializerMethodField()
    hotspots = DishHotspotSerializer(many=True, read_only=True)
    process_steps = DishProcessStepSerializer(many=True, read_only=True)
    gallery_images = DishGalleryImageSerializer(many=True, read_only=True)
    pairings = serializers.SerializerMethodField()
    breadcrumb = serializers.SerializerMethodField()

    class Meta:
        model = MenuItem
        fields = (
            "id",
            "slug",
            "name",
            "subtitle",
            "category",
            "breadcrumb",
            "description",
            "long_description",
            "price",
            "price_display",
            "image",
            "plate_image",
            "anatomy_image",
            "process_image",
            "prep_time",
            "calories",
            "spicy_level",
            "allergens",
            "vegan",
            "taste_profile",
            "hotspots",
            "process_steps",
            "gallery_images",
            "pairings",
            "is_best_seller",
        )

    def get_price_display(self, obj):
        return format_toman(obj.price)

    def get_taste_profile(self, obj):
        return {
            "spiciness": obj.taste_spiciness,
            "sweetness": obj.taste_sweetness,
            "acidity": obj.taste_acidity,
            "richness": obj.taste_richness,
        }

    def get_breadcrumb(self, obj):
        category_labels = {
            "starters": "پیش‌غذا",
            "mains": "غذای اصلی",
            "desserts": "دسر",
            "drinks": "نوشیدنی",
            "specials": "ویژه",
        }
        cat = category_labels.get(obj.category, obj.category)
        return f"منو / {cat} / {obj.name}"

    def get_pairings(self, obj):
        pairings = obj.pairings.filter(is_available=True)
        return [
            {
                "id": str(p.id),
                "name": p.name,
                "price": format_toman(p.price),
                "image": p.image,
            }
            for p in pairings
        ]


class MenuItemAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = "__all__"
