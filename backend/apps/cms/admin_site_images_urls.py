from django.urls import path

from apps.cms.views import AdminSiteImagesDetailView, AdminSiteImagesListView

urlpatterns = [
    path("", AdminSiteImagesListView.as_view(), name="admin-site-images-list"),
    path("<str:slug>/", AdminSiteImagesDetailView.as_view(), name="admin-site-images-detail"),
]
