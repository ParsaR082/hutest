from django.urls import path

from apps.reservations.views import AdminTableListCreateView

urlpatterns = [
    path("", AdminTableListCreateView.as_view(), name="admin-table-list"),
]
