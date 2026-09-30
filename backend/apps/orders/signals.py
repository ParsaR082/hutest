from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from apps.notifications.models import Notification
from apps.orders.models import Order
from apps.orders.serializers import OrderDetailSerializer


def _broadcast(group: str, event_type: str, data: dict) -> None:
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return
    async_to_sync(channel_layer.group_send)(group, {"type": event_type, "data": data})


@receiver(pre_save, sender=Order)
def cache_previous_order_status(sender, instance, **kwargs):
    if instance.pk:
        try:
            instance._previous_status = Order.objects.get(pk=instance.pk).status
        except Order.DoesNotExist:
            instance._previous_status = None
    else:
        instance._previous_status = None


@receiver(post_save, sender=Order)
def broadcast_order_status(sender, instance, created, **kwargs):
    data = OrderDetailSerializer(instance).data
    _broadcast(f"order_{instance.id}", "order_status_update", data)
    _broadcast("kitchen_board", "kitchen_update", data)

    admin_event = "order_created" if created else "order_updated"
    _broadcast("admin_events", "admin_event", {"event": admin_event, "order": data})

    status_changed = created or getattr(instance, "_previous_status", None) != instance.status
    if instance.user_id and status_changed:
        title = "سفارش ثبت شد" if created else "به‌روزرسانی سفارش"
        Notification.objects.create(
            user_id=instance.user_id,
            title=title,
            body=f"سفارش {instance.order_number}: {instance.get_status_display()}",
            notification_type="order_status",
            link="/dashboard",
        )
