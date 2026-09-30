from django.urls import path

from apps.orders.views import (
    CartItemView,
    CartView,
    OrderActiveView,
    OrderCheckoutView,
    OrderDetailView,
    OrderListView,
    OrderReorderView,
    PaymentInitiateView,
    PaymentVerifyView,
)

urlpatterns = [
    path("", OrderListView.as_view(), name="order-list"),
    path("checkout/", OrderCheckoutView.as_view(), name="order-checkout"),
    path("active/", OrderActiveView.as_view(), name="order-active"),
    path("pay/verify/", PaymentVerifyView.as_view(), name="order-pay-verify"),
    path("<int:pk>/reorder/", OrderReorderView.as_view(), name="order-reorder"),
    path("<int:pk>/pay/", PaymentInitiateView.as_view(), name="order-pay-initiate"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
]

cart_urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("items/", CartItemView.as_view(), name="cart-items"),
    path("items/<int:item_id>/", CartItemView.as_view(), name="cart-item-detail"),
]
