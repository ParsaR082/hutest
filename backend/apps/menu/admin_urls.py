from django.urls import path

from apps.menu.admin_views import AdminMenuDetailView, AdminMenuListCreateView

urlpatterns = [
    path("", AdminMenuListCreateView.as_view(), name="admin-menu-list"),
    path("<int:pk>/", AdminMenuDetailView.as_view(), name="admin-menu-detail"),
]
