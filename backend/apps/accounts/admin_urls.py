from django.urls import path

from apps.accounts.admin_views import CustomerDetailView, CustomerListView, CustomerTierUpdateView, StaffListCreateView

urlpatterns = [
    path("", CustomerListView.as_view(), name="admin-customers"),
    path("<int:pk>/", CustomerDetailView.as_view(), name="admin-customer-detail"),
    path("<int:pk>/tier/", CustomerTierUpdateView.as_view(), name="admin-customer-tier"),
]
