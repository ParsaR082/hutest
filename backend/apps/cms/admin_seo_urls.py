from django.urls import path

from apps.cms.views import AdminSEODetailView, AdminSEOListView

urlpatterns = [
    path("", AdminSEOListView.as_view(), name="admin-seo-list"),
    path("<str:page_key>/", AdminSEODetailView.as_view(), name="admin-seo-detail"),
]
