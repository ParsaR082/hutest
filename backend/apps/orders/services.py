from django.db.models import Max

from apps.orders.models import Order


def generate_order_number() -> str:
    last = Order.objects.aggregate(max_num=Max("id"))["max_num"] or 0
    return f"ORD-{last + 1:04d}"
