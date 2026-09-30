from django.urls import include, path

urlpatterns = [
    path("health/", include("apps.core.urls")),
    path("auth/", include("apps.accounts.urls")),
    path("users/", include("apps.accounts.user_urls")),
    path("menu/", include("apps.menu.urls")),
    path("settings/", include("apps.cms.urls")),
    path("seo/", include("apps.cms.seo_urls")),
    path("site-images/", include("apps.cms.site_images_urls")),
    path("gallery/", include("apps.gallery.urls")),
    path("blog/", include("apps.cms.blog_urls")),
    path("testimonials/", include("apps.cms.testimonial_urls")),
    path("contact/", include("apps.cms.contact_urls")),
    path("newsletter/", include("apps.cms.newsletter_urls")),
    path("reservations/", include("apps.reservations.urls")),
    path("cart/", include("apps.orders.cart_urls")),
    path("orders/", include("apps.orders.urls")),
    path("notifications/", include("apps.notifications.urls")),
    path("admin/", include("apps.core.admin_urls")),
]
