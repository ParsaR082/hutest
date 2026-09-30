from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns = [
    # Note: "admin/" is the Next.js admin panel's route space, so Django's
    # built-in admin site lives at "django-admin/" to avoid colliding with it
    # when both are proxied behind the same nginx host.
    path("django-admin/", admin.site.urls),
    path("api/v1/", include("config.api_urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
]
