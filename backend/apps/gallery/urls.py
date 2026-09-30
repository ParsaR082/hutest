from django.urls import path

from apps.gallery.views import PublicGalleryListView

urlpatterns = [
    path("", PublicGalleryListView.as_view(), name="gallery-public"),
]
