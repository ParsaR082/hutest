from rest_framework import serializers

from apps.cms.models import (
    BlogPost,
    ContactSubmission,
    NewsletterSubscriber,
    OpeningHour,
    SEOSetting,
    SiteImageSlot,
    SiteSettings,
    Testimonial,
)


class SiteImageSlotSerializer(serializers.ModelSerializer):
    media_id = serializers.IntegerField(source="media.id", read_only=True, default=None)
    url = serializers.SerializerMethodField()

    class Meta:
        model = SiteImageSlot
        fields = ("slug", "group", "label", "media_id", "url", "updated_at")

    def get_url(self, obj):
        return obj.media.file.url if obj.media else None


class BlogPostListSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = ("id", "slug", "title", "excerpt", "cover_image", "author_name", "published_at")


class BlogPostDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = (
            "id",
            "slug",
            "title",
            "excerpt",
            "content",
            "cover_image",
            "author_name",
            "published_at",
        )


class BlogPostAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = (
            "id",
            "slug",
            "title",
            "excerpt",
            "content",
            "cover_image",
            "author_name",
            "is_published",
            "published_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class SEOSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SEOSetting
        fields = (
            "page_key",
            "seo_title",
            "meta_description",
            "canonical_url",
            "og_title",
            "og_description",
            "og_image",
            "twitter_image",
            "robots_index",
            "robots_follow",
            "structured_data",
            "updated_at",
        )
        read_only_fields = ("page_key", "updated_at")


class OpeningHourSerializer(serializers.ModelSerializer):
    time = serializers.SerializerMethodField()

    class Meta:
        model = OpeningHour
        fields = ("days", "time")

    def get_time(self, obj):
        return f"{obj.open_time.strftime('%H:%M')} – {obj.close_time.strftime('%H:%M')}"


class PublicSettingsSerializer(serializers.ModelSerializer):
    contact_info = serializers.SerializerMethodField()
    opening_hours = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = (
            "restaurant_name",
            "logo_url",
            "contact_info",
            "opening_hours",
            "social_instagram",
            "social_twitter",
            "social_facebook",
            "social_youtube",
            "delivery_fee",
            "free_delivery_threshold",
        )

    def get_contact_info(self, obj):
        return {
            "phone": obj.phone,
            "email": obj.email,
            "address": obj.address,
            "coordinates": {"lat": obj.lat, "lng": obj.lng},
        }

    def get_opening_hours(self, obj):
        hours = OpeningHour.objects.all()
        return OpeningHourSerializer(hours, many=True).data


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = ("id", "name", "role", "content", "avatar", "rating")


class ContactSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactSubmission
        fields = ("id", "name", "email", "phone", "subject", "message", "created_at")
        read_only_fields = ("id", "created_at")


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ("email",)
