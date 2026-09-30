from django.urls import path

from apps.core.admin_media_views import MediaLibraryView, MediaUploadView

urlpatterns = [
    path("upload/", MediaUploadView.as_view(), name="admin-media-upload"),
    path("", MediaLibraryView.as_view(), name="admin-media-library"),
]
