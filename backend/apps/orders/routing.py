from django.urls import re_path

from apps.orders.consumers import AdminEventConsumer, KitchenConsumer, OrderStatusConsumer

websocket_urlpatterns = [
    re_path(r"ws/orders/(?P<order_id>\d+)/$", OrderStatusConsumer.as_asgi()),
    re_path(r"ws/admin/events/$", AdminEventConsumer.as_asgi()),
    re_path(r"ws/kitchen/$", KitchenConsumer.as_asgi()),
]
