from rest_framework import serializers

from apps.menu.serializers import format_toman
from apps.orders.models import Cart, CartItem, Order, OrderItem, OrderStatusHistory, Payment


class CartItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source="menu_item.name", read_only=True)
    menu_item_slug = serializers.CharField(source="menu_item.slug", read_only=True)
    unit_price = serializers.IntegerField(source="menu_item.price", read_only=True)
    price_display = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ("id", "menu_item", "menu_item_name", "menu_item_slug", "quantity", "notes", "unit_price", "price_display")

    def get_price_display(self, obj):
        return format_toman(obj.menu_item.price * obj.quantity)


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.SerializerMethodField()
    total_display = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ("id", "items", "total", "total_display")

    def get_total(self, obj):
        return sum(item.menu_item.price * item.quantity for item in obj.items.select_related("menu_item"))

    def get_total_display(self, obj):
        return format_toman(self.get_total(obj))


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ("id", "name", "unit_price", "quantity", "notes")


class OrderListSerializer(serializers.ModelSerializer):
    total_display = serializers.SerializerMethodField()
    status_label = serializers.CharField(source="get_status_display", read_only=True)
    order_type_label = serializers.CharField(source="get_order_type_display", read_only=True)
    item_count = serializers.SerializerMethodField()
    customer_name = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "status",
            "status_label",
            "order_type",
            "order_type_label",
            "total",
            "total_display",
            "placed_at",
            "item_count",
            "customer_name",
            "customer_phone",
        )

    def get_total_display(self, obj):
        return format_toman(obj.total)

    def get_item_count(self, obj):
        return sum(item.quantity for item in obj.items.all())

    def get_customer_name(self, obj):
        if obj.delivery_recipient_name:
            return obj.delivery_recipient_name
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username
        return obj.guest_name or "—"

    def get_customer_phone(self, obj):
        return obj.delivery_phone or (obj.user.phone if obj.user else "") or obj.guest_phone or ""


class PaymentSerializer(serializers.ModelSerializer):
    status_label = serializers.CharField(source="get_status_display", read_only=True)
    method_label = serializers.CharField(source="get_method_display", read_only=True)

    class Meta:
        model = Payment
        fields = ("id", "amount", "method", "method_label", "status", "status_label", "gateway_ref", "paid_at")


class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_display = serializers.SerializerMethodField()
    subtotal_display = serializers.SerializerMethodField()
    delivery_fee_display = serializers.SerializerMethodField()
    discount_display = serializers.SerializerMethodField()
    status_label = serializers.CharField(source="get_status_display", read_only=True)
    status_index = serializers.SerializerMethodField()
    payment = serializers.SerializerMethodField()
    order_type_label = serializers.CharField(source="get_order_type_display", read_only=True)
    customer = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            "id",
            "order_number",
            "status",
            "status_label",
            "status_index",
            "customer",
            "order_type",
            "order_type_label",
            "subtotal",
            "subtotal_display",
            "delivery_fee",
            "delivery_fee_display",
            "discount",
            "discount_display",
            "tax",
            "total",
            "total_display",
            "estimated_minutes",
            "notes",
            "placed_at",
            "items",
            "payment",
            "delivery_recipient_name",
            "delivery_phone",
            "delivery_address",
            "delivery_address_details",
            "delivery_notes",
        )

    def get_total_display(self, obj):
        return format_toman(obj.total)

    def get_subtotal_display(self, obj):
        return format_toman(obj.subtotal)

    def get_delivery_fee_display(self, obj):
        return format_toman(obj.delivery_fee)

    def get_discount_display(self, obj):
        return format_toman(obj.discount)

    def get_customer(self, obj):
        if obj.user:
            return {
                "id": obj.user.id,
                "name": f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username,
                "email": obj.user.email,
                "phone": obj.user.phone,
            }
        return {
            "id": None,
            "name": obj.guest_name or obj.delivery_recipient_name or "مهمان",
            "email": obj.guest_email,
            "phone": obj.guest_phone or obj.delivery_phone,
        }

    def get_payment(self, obj):
        payment = getattr(obj, "payment", None)
        return PaymentSerializer(payment).data if payment else None

    def get_status_index(self, obj):
        if obj.status in (Order.Status.CANCELLED, Order.Status.REFUNDED):
            return -1
        if obj.order_type == Order.OrderType.DELIVERY:
            steps = [
                Order.Status.PENDING,
                Order.Status.CONFIRMED,
                Order.Status.PREPARING,
                Order.Status.READY,
                Order.Status.OUT_FOR_DELIVERY,
                Order.Status.DELIVERED,
            ]
        else:
            steps = [
                Order.Status.PENDING,
                Order.Status.CONFIRMED,
                Order.Status.PREPARING,
                Order.Status.READY,
                Order.Status.DELIVERED,
            ]
        try:
            return steps.index(obj.status)
        except ValueError:
            return 0


class OrderStatusUpdateSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=Order.Status.choices)
    note = serializers.CharField(required=False, allow_blank=True)
    estimated_minutes = serializers.IntegerField(required=False, min_value=1)
