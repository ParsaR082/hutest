from django.urls import path

from apps.cms.views import PublicSiteImagesView

urlpatterns = [
    path("", PublicSiteImagesView.as_view(), name="site-images-public"),
]
