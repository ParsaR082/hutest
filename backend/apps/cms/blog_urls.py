from django.urls import path

from apps.cms.views import PublicBlogDetailView, PublicBlogListView

urlpatterns = [
    path("", PublicBlogListView.as_view(), name="blog-public-list"),
    path("<str:slug>/", PublicBlogDetailView.as_view(), name="blog-public-detail"),
]
