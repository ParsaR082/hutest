from django.urls import path

from apps.menu.views import MenuDetailView, MenuFeaturedView, MenuListView

urlpatterns = [
    path("", MenuListView.as_view(), name="menu-list"),
    path("featured/", MenuFeaturedView.as_view(), name="menu-featured"),
    path("<slug:slug>/", MenuDetailView.as_view(), name="menu-detail"),
]
