from django.urls import path

from apps.cms.views import AdminBlogDetailView, AdminBlogListCreateView

urlpatterns = [
    path("", AdminBlogListCreateView.as_view(), name="admin-blog-list"),
    path("<int:pk>/", AdminBlogDetailView.as_view(), name="admin-blog-detail"),
]
