from django.urls import include, path

urlpatterns = [
    path("dashboard/", include("apps.core.admin_dashboard_urls")),
    path("reports/", include("apps.core.admin_reports_urls")),
    path("menu/", include("apps.menu.admin_urls")),
    path("orders/", include("apps.orders.admin_urls")),
    path("reservations/", include("apps.reservations.admin_urls")),
    path("tables/", include("apps.reservations.table_admin_urls")),
    path("customers/", include("apps.accounts.admin_urls")),
    path("staff/", include("apps.accounts.staff_admin_urls")),
    path("testimonials/", include("apps.cms.admin_testimonial_urls")),
    path("contacts/", include("apps.cms.admin_contact_urls")),
    path("settings/", include("apps.cms.admin_settings_urls")),
    path("seo/", include("apps.cms.admin_seo_urls")),
    path("site-images/", include("apps.cms.admin_site_images_urls")),
    path("gallery/", include("apps.gallery.admin_urls")),
    path("blog/", include("apps.cms.admin_blog_urls")),
    path("audit-logs/", include("apps.core.admin_audit_urls")),
    path("media/", include("apps.core.admin_media_urls")),
]
