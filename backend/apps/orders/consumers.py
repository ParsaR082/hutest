from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

STAFF_ROLES = {"staff", "manager", "admin", "super_admin"}


def _is_staff(user) -> bool:
    return bool(user and user.is_authenticated and getattr(user, "role", None) in STAFF_ROLES)


class OrderStatusConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        self.order_id = self.scope["url_route"]["kwargs"]["order_id"]
        user = self.scope.get("user")

        if not user or not user.is_authenticated:
            await self.close(code=4001)
            return

        owns_order = await self._user_owns_order(user, self.order_id)
        if not owns_order and not _is_staff(user):
            await self.close(code=4003)
            return

        self.group_name = f"order_{self.order_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    @database_sync_to_async
    def _user_owns_order(self, user, order_id) -> bool:
        from apps.orders.models import Order

        return Order.objects.filter(pk=order_id, user=user).exists()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def order_status_update(self, event):
        await self.send_json(event["data"])


class AdminEventConsumer(AsyncJsonWebsocketConsumer):
    group_name = "admin_events"

    async def connect(self):
        if not _is_staff(self.scope.get("user")):
            await self.close(code=4003)
            return
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def admin_event(self, event):
        await self.send_json(event["data"])


class KitchenConsumer(AsyncJsonWebsocketConsumer):
    group_name = "kitchen_board"

    async def connect(self):
        if not _is_staff(self.scope.get("user")):
            await self.close(code=4003)
            return
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def kitchen_update(self, event):
        await self.send_json(event["data"])
