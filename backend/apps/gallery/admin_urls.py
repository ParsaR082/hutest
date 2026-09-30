from django.urls import path

from apps.gallery.views import AdminGalleryDetailView, AdminGalleryListCreateView

urlpatterns = [
    path("", AdminGalleryListCreateView.as_view(), name="admin-gallery-list"),
    path("<int:pk>/", AdminGalleryDetailView.as_view(), name="admin-gallery-detail"),
]
