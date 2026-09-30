from django.urls import path

from apps.cms.views import PublicSEOView

urlpatterns = [
    path("<str:page_key>/", PublicSEOView.as_view(), name="seo-public"),
]
