from django.urls import path

from apps.orders.views import AdminOrderDetailView, AdminOrderListView, AdminOrderStatusView

urlpatterns = [
    path("", AdminOrderListView.as_view(), name="admin-order-list"),
    path("<int:pk>/", AdminOrderDetailView.as_view(), name="admin-order-detail"),
    path("<int:pk>/status/", AdminOrderStatusView.as_view(), name="admin-order-status"),
]
