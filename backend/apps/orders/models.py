from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Order(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "ثبت سفارش"
        CONFIRMED = "confirmed", "تأیید شده"
        PREPARING = "preparing", "در آشپزخانه"
        READY = "ready", "آماده"
        OUT_FOR_DELIVERY = "out_for_delivery", "در مسیر"
        DELIVERED = "delivered", "تحویل شد"
        CANCELLED = "cancelled", "لغو شده"
        REFUNDED = "refunded", "بازپرداخت"

    class OrderType(models.TextChoices):
        DINE_IN = "dine_in", "Dine In"
        TAKEAWAY = "takeaway", "Takeaway"
        DELIVERY = "delivery", "Delivery"

    order_number = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="orders",
    )
    guest_name = models.CharField(max_length=200, blank=True)
    guest_phone = models.CharField(max_length=20, blank=True)
    guest_email = models.EmailField(blank=True)

    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    order_type = models.CharField(max_length=20, choices=OrderType.choices, default=OrderType.DINE_IN)
    subtotal = models.PositiveIntegerField(default=0)
    delivery_fee = models.PositiveIntegerField(default=0)
    discount = models.PositiveIntegerField(default=0)
    tax = models.PositiveIntegerField(default=0)
    total = models.PositiveIntegerField(default=0)
    estimated_minutes = models.PositiveIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    internal_notes = models.TextField(blank=True)

    # Delivery snapshot -- captured at order creation time, independent of the
    # customer's current profile so historical orders remain accurate.
    delivery_recipient_name = models.CharField(max_length=200, blank=True)
    delivery_phone = models.CharField(max_length=20, blank=True)
    delivery_address = models.TextField(blank=True)
    delivery_address_details = models.CharField(max_length=300, blank=True)
    delivery_notes = models.TextField(blank=True)

    table = models.ForeignKey(
        "reservations.Table",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    reservation = models.ForeignKey(
        "reservations.Reservation",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="orders",
    )

    placed_at = models.DateTimeField(auto_now_add=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    prepared_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True)

    class Meta:
        ordering = ["-placed_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["status", "placed_at"]),
            models.Index(fields=["order_number"]),
        ]

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey(
        "menu.MenuItem", null=True, blank=True, on_delete=models.SET_NULL
    )
    name = models.CharField(max_length=200)
    unit_price = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)

    class Meta:
        indexes = [models.Index(fields=["order"])]


class OrderStatusHistory(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="status_history")
    status = models.CharField(max_length=20, choices=Order.Status.choices)
    note = models.TextField(blank=True)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]


class Cart(TimeStampedModel):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="cart",
    )
    session_key = models.CharField(max_length=40, null=True, blank=True, unique=True)


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    menu_item = models.ForeignKey("menu.MenuItem", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)

    class Meta:
        unique_together = [("cart", "menu_item")]


class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        COMPLETED = "completed", "Completed"
        FAILED = "failed", "Failed"
        REFUNDED = "refunded", "Refunded"

    class Method(models.TextChoices):
        CASH = "cash", "Cash"
        CARD = "card", "Card"
        ONLINE = "online", "Online"
        WALLET = "wallet", "Wallet"

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    amount = models.PositiveIntegerField()
    method = models.CharField(max_length=20, choices=Method.choices, default=Method.CASH)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    transaction_id = models.CharField(max_length=100, blank=True)
    gateway_ref = models.CharField(max_length=100, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
