from django.http import Http404
from django.utils import timezone
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.cms.models import (
    BlogPost,
    ContactSubmission,
    NewsletterSubscriber,
    SEOSetting,
    SiteImageSlot,
    SiteSettings,
    Testimonial,
)
from apps.cms.serializers import (
    BlogPostAdminSerializer,
    BlogPostDetailSerializer,
    BlogPostListSerializer,
    ContactSubmissionSerializer,
    NewsletterSubscribeSerializer,
    PublicSettingsSerializer,
    SEOSettingSerializer,
    SiteImageSlotSerializer,
    TestimonialSerializer,
)
from apps.core.models import Media
from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse


def _ensure_site_image_slots():
    existing = set(SiteImageSlot.objects.values_list("slug", flat=True))
    missing = [
        SiteImageSlot(slug=slug, group=group, label=label)
        for slug, group, label in SiteImageSlot.SLUG_REGISTRY
        if slug not in existing
    ]
    if missing:
        SiteImageSlot.objects.bulk_create(missing)


class PublicSiteImagesView(APIView):
    """Returns {slug: url} for every slot that has media assigned. Slots
    with no media are simply omitted, so the frontend's existing static
    fallback applies automatically."""

    permission_classes = [AllowAny]

    def get(self, request):
        qs = SiteImageSlot.objects.exclude(media__isnull=True).select_related("media")
        return APIResponse.success({slot.slug: slot.media.file.url for slot in qs})


class AdminSiteImagesListView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        _ensure_site_image_slots()
        qs = SiteImageSlot.objects.select_related("media").all()
        return APIResponse.success(SiteImageSlotSerializer(qs, many=True).data)


class AdminSiteImagesDetailView(APIView):
    permission_classes = [IsManagerRole]

    def patch(self, request, slug):
        if slug not in dict((s, g) for s, g, _ in SiteImageSlot.SLUG_REGISTRY):
            raise Http404
        _ensure_site_image_slots()
        slot = SiteImageSlot.objects.get(slug=slug)
        media_id = request.data.get("media_id")
        if media_id is None:
            slot.media = None
        else:
            try:
                slot.media = Media.objects.get(pk=media_id)
            except Media.DoesNotExist:
                return APIResponse.error("NOT_FOUND", "تصویر یافت نشد.", status=404)
        slot.save(update_fields=["media", "updated_at"])
        return APIResponse.success(SiteImageSlotSerializer(slot).data)


class PublicSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            return APIResponse.success({})
        return APIResponse.success(PublicSettingsSerializer(settings_obj).data)


class TestimonialListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = Testimonial.objects.filter(is_active=True)
        return APIResponse.success(TestimonialSerializer(qs, many=True).data)


class ContactSubmissionView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return APIResponse.success({"submitted": True}, status=201)


class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = NewsletterSubscribeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        NewsletterSubscriber.objects.get_or_create(email=email)
        return APIResponse.success({"subscribed": True}, status=201)


class AdminTestimonialListView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        return APIResponse.success(TestimonialSerializer(Testimonial.objects.all(), many=True).data)

    def post(self, request):
        serializer = TestimonialSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return APIResponse.success(serializer.data, status=201)


class AdminContactListView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        qs = ContactSubmission.objects.all()[:100]
        return APIResponse.success(ContactSubmissionSerializer(qs, many=True).data)


class AdminSettingsView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        settings_obj = SiteSettings.objects.first()
        if not settings_obj:
            return APIResponse.success({})
        return APIResponse.success(PublicSettingsSerializer(settings_obj).data)

    def patch(self, request):
        settings_obj, _ = SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                "phone": "+982100000000",
                "email": "hello@humazd.com",
                "address": "تهران",
            },
        )
        for field in [
            "restaurant_name",
            "logo_url",
            "phone",
            "email",
            "address",
            "lat",
            "lng",
            "social_instagram",
            "social_twitter",
            "social_facebook",
            "social_youtube",
            "delivery_fee",
            "free_delivery_threshold",
        ]:
            if field in request.data:
                setattr(settings_obj, field, request.data[field])
        settings_obj.save()
        return APIResponse.success(PublicSettingsSerializer(settings_obj).data)


class PublicSEOView(APIView):
    """SEO metadata for one page, consumed server-side by Next.js `generateMetadata`."""

    permission_classes = [AllowAny]

    def get(self, request, page_key):
        try:
            obj = SEOSetting.objects.get(page_key=page_key)
        except SEOSetting.DoesNotExist:
            return APIResponse.success({})
        return APIResponse.success(SEOSettingSerializer(obj).data)


class AdminSEOListView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        existing = {s.page_key: s for s in SEOSetting.objects.all()}
        for key, _ in SEOSetting.Page.choices:
            if key not in existing:
                existing[key] = SEOSetting.objects.create(page_key=key)
        qs = SEOSetting.objects.all()
        return APIResponse.success(SEOSettingSerializer(qs, many=True).data)


class AdminSEODetailView(APIView):
    permission_classes = [IsManagerRole]

    def get_object(self, page_key):
        obj, _ = SEOSetting.objects.get_or_create(page_key=page_key)
        return obj

    def get(self, request, page_key):
        if page_key not in SEOSetting.Page.values:
            raise Http404
        return APIResponse.success(SEOSettingSerializer(self.get_object(page_key)).data)

    def patch(self, request, page_key):
        if page_key not in SEOSetting.Page.values:
            raise Http404
        obj = self.get_object(page_key)
        serializer = SEOSettingSerializer(obj, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return APIResponse.success(serializer.data)


class PublicBlogListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        qs = BlogPost.objects.filter(is_published=True)
        return APIResponse.success(BlogPostListSerializer(qs, many=True).data)


class PublicBlogDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, slug):
        try:
            post = BlogPost.objects.get(slug=slug, is_published=True)
        except BlogPost.DoesNotExist:
            raise Http404
        return APIResponse.success(BlogPostDetailSerializer(post).data)


class AdminBlogListCreateView(ListCreateAPIView):
    permission_classes = [IsManagerRole]
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostAdminSerializer

    def list(self, request, *args, **kwargs):
        return APIResponse.success(self.get_serializer(self.get_queryset(), many=True).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if serializer.validated_data.get("is_published") and not serializer.validated_data.get("published_at"):
            serializer.save(published_at=timezone.now())
        else:
            serializer.save()
        return APIResponse.success(serializer.data, status=201)


class AdminBlogDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsManagerRole]
    queryset = BlogPost.objects.all()
    serializer_class = BlogPostAdminSerializer

    def retrieve(self, request, *args, **kwargs):
        return APIResponse.success(self.get_serializer(self.get_object()).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        extra = {}
        if serializer.validated_data.get("is_published") and not instance.published_at:
            extra["published_at"] = timezone.now()
        self.perform_update(serializer)
        if extra:
            BlogPost.objects.filter(pk=instance.pk).update(**extra)
            instance.refresh_from_db()
            return APIResponse.success(self.get_serializer(instance).data)
        return APIResponse.success(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return APIResponse.success({"deleted": True})
