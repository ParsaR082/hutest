from django.urls import path

from apps.accounts.admin_views import StaffListCreateView

urlpatterns = [
    path("", StaffListCreateView.as_view(), name="admin-staff"),
]
