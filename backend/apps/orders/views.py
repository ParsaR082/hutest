from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.cms.models import SiteSettings
from apps.core.permissions import IsStaffRole
from apps.core.responses import APIResponse
from apps.menu.models import MenuItem
from apps.orders.gateways import GatewayError, get_gateway
from apps.orders.models import Cart, CartItem, Order, OrderStatusHistory, Payment
from apps.orders.serializers import (
    CartItemSerializer,
    CartSerializer,
    OrderDetailSerializer,
    OrderListSerializer,
    OrderStatusUpdateSerializer,
)
from apps.orders.services import generate_order_number

MAX_CART_ITEM_QUANTITY = 50


def get_or_create_cart(request):
    if request.user.is_authenticated:
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart
    session_key = request.session.session_key
    if not session_key:
        request.session.create()
        session_key = request.session.session_key
    cart, _ = Cart.objects.get_or_create(session_key=session_key)
    return cart


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart = get_or_create_cart(request)
        return APIResponse.success(CartSerializer(cart).data)


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = get_or_create_cart(request)
        menu_item_id = request.data.get("menu_item_id")
        try:
            quantity = int(request.data.get("quantity", 1))
        except (TypeError, ValueError):
            return APIResponse.error("INVALID_QUANTITY", "تعداد نامعتبر است.", status=400)
        if not 1 <= quantity <= MAX_CART_ITEM_QUANTITY:
            return APIResponse.error(
                "INVALID_QUANTITY", f"تعداد باید بین ۱ تا {MAX_CART_ITEM_QUANTITY} باشد.", status=400
            )
        notes = request.data.get("notes", "")

        menu_item = MenuItem.objects.get(pk=menu_item_id, is_available=True)
        item, created = CartItem.objects.get_or_create(
            cart=cart,
            menu_item=menu_item,
            defaults={"quantity": quantity, "notes": notes},
        )
        if not created:
            item.quantity = min(item.quantity + quantity, MAX_CART_ITEM_QUANTITY)
            item.save()

        return APIResponse.success(CartSerializer(cart).data, status=201)

    def patch(self, request, item_id):
        cart = get_or_create_cart(request)
        item = CartItem.objects.get(pk=item_id, cart=cart)
        quantity = request.data.get("quantity")
        if quantity is not None:
            try:
                quantity = int(quantity)
            except (TypeError, ValueError):
                return APIResponse.error("INVALID_QUANTITY", "تعداد نامعتبر است.", status=400)
            if not 1 <= quantity <= MAX_CART_ITEM_QUANTITY:
                return APIResponse.error(
                    "INVALID_QUANTITY", f"تعداد باید بین ۱ تا {MAX_CART_ITEM_QUANTITY} باشد.", status=400
                )
            item.quantity = quantity
            item.save()
        return APIResponse.success(CartSerializer(cart).data)

    def delete(self, request, item_id):
        cart = get_or_create_cart(request)
        CartItem.objects.filter(pk=item_id, cart=cart).delete()
        return APIResponse.success(CartSerializer(cart).data)


class OrderCheckoutView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_scope = "order_checkout"

    def post(self, request):
        cart = get_or_create_cart(request)
        items = cart.items.select_related("menu_item")
        if not items.exists():
            return APIResponse.error("EMPTY_CART", "Cart is empty.", status=400)

        subtotal = sum(i.menu_item.price * i.quantity for i in items)
        payment_method = request.data.get("payment_method", Payment.Method.ONLINE)
        if payment_method not in Payment.Method.values:
            return APIResponse.error("INVALID_PAYMENT_METHOD", "Invalid payment method.", status=400)

        order_type = request.data.get("order_type", Order.OrderType.DINE_IN)
        if order_type not in Order.OrderType.values:
            return APIResponse.error("INVALID_ORDER_TYPE", "Invalid order type.", status=400)

        delivery_fields = {
            "delivery_recipient_name": "",
            "delivery_phone": "",
            "delivery_address": "",
            "delivery_address_details": "",
            "delivery_notes": "",
        }
        delivery_fee = 0

        if order_type == Order.OrderType.DELIVERY:
            recipient_name = str(request.data.get("recipient_name", "")).strip()
            phone = str(request.data.get("phone", "")).strip()
            address = str(request.data.get("address", "")).strip()
            address_details = str(request.data.get("address_details", "")).strip()
            delivery_notes = str(request.data.get("delivery_notes", "")).strip()

            if not recipient_name or not phone or not address:
                return APIResponse.error(
                    "MISSING_DELIVERY_INFO",
                    "برای سفارش ارسالی، نام گیرنده، شماره تماس و آدرس کامل الزامی است.",
                    status=400,
                )

            delivery_fields = {
                "delivery_recipient_name": recipient_name,
                "delivery_phone": phone,
                "delivery_address": address,
                "delivery_address_details": address_details,
                "delivery_notes": delivery_notes,
            }

            settings_obj = SiteSettings.objects.first()
            if settings_obj:
                free_threshold = settings_obj.free_delivery_threshold
                if free_threshold and subtotal >= free_threshold:
                    delivery_fee = 0
                else:
                    delivery_fee = settings_obj.delivery_fee

        total = subtotal + delivery_fee

        order = Order.objects.create(
            order_number=generate_order_number(),
            user=request.user,
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            order_type=order_type,
            notes=request.data.get("notes", ""),
            estimated_minutes=25,
            **delivery_fields,
        )

        for item in items:
            order.items.create(
                menu_item=item.menu_item,
                name=item.menu_item.name,
                unit_price=item.menu_item.price,
                quantity=item.quantity,
                notes=item.notes,
            )

        Payment.objects.create(order=order, amount=total, method=payment_method)
        OrderStatusHistory.objects.create(order=order, status=Order.Status.PENDING)
        items.delete()

        return APIResponse.success(OrderDetailSerializer(order).data, status=201)


class PaymentInitiateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        order = Order.objects.select_related("payment").get(pk=pk, user=request.user)
        try:
            payment = order.payment
        except Payment.DoesNotExist:
            return APIResponse.error("NO_PAYMENT", "This order has no payment record.", status=400)

        if payment.status == Payment.Status.COMPLETED:
            return APIResponse.error("ALREADY_PAID", "This order is already paid.", status=400)
        if payment.method == Payment.Method.CASH:
            return APIResponse.error("CASH_PAYMENT", "This order is set to pay by cash on arrival.", status=400)

        try:
            result = get_gateway().initiate(payment)
        except GatewayError as exc:
            return APIResponse.error("GATEWAY_UNAVAILABLE", str(exc), status=503)

        return APIResponse.success(result)


class PaymentVerifyView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        authority = request.data.get("authority", "")
        payment = Payment.objects.select_related("order").filter(gateway_ref=authority).first()
        if not payment:
            return APIResponse.error("PAYMENT_NOT_FOUND", "Payment not found.", status=404)

        if payment.status == Payment.Status.COMPLETED:
            return APIResponse.success(OrderDetailSerializer(payment.order).data)

        ok = get_gateway().verify(payment, request.data)
        if not ok:
            payment.status = Payment.Status.FAILED
            payment.save(update_fields=["status"])
            return APIResponse.error("PAYMENT_FAILED", "پرداخت ناموفق بود.", status=400)

        payment.status = Payment.Status.COMPLETED
        payment.transaction_id = authority
        payment.paid_at = timezone.now()
        payment.save(update_fields=["status", "transaction_id", "paid_at"])

        order = payment.order
        order.status = Order.Status.CONFIRMED
        order.confirmed_at = timezone.now()
        order.save(update_fields=["status", "confirmed_at"])
        OrderStatusHistory.objects.create(order=order, status=Order.Status.CONFIRMED, note="Payment confirmed.")

        return APIResponse.success(OrderDetailSerializer(order).data)


class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Order.objects.filter(user=request.user).prefetch_related("items")
        status_filter = request.query_params.get("status")
        if status_filter == "active":
            qs = qs.filter(
                status__in=[
                    Order.Status.PENDING,
                    Order.Status.CONFIRMED,
                    Order.Status.PREPARING,
                    Order.Status.READY,
                    Order.Status.OUT_FOR_DELIVERY,
                ]
            )
        elif status_filter == "completed":
            qs = qs.filter(status=Order.Status.DELIVERED)
        return APIResponse.success(OrderListSerializer(qs, many=True).data)


class OrderActiveView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        order = (
            Order.objects.filter(
                user=request.user,
                status__in=[
                    Order.Status.PENDING,
                    Order.Status.CONFIRMED,
                    Order.Status.PREPARING,
                    Order.Status.READY,
                    Order.Status.OUT_FOR_DELIVERY,
                ],
            )
            .prefetch_related("items")
            .first()
        )
        if not order:
            return APIResponse.success(None)
        return APIResponse.success(OrderDetailSerializer(order).data)


class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = Order.objects.prefetch_related("items").get(pk=pk, user=request.user)
        return APIResponse.success(OrderDetailSerializer(order).data)


class OrderReorderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        order = Order.objects.prefetch_related("items").get(pk=pk, user=request.user)
        cart, _ = Cart.objects.get_or_create(user=request.user)
        for item in order.items.all():
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                menu_item=item.menu_item,
                defaults={"quantity": item.quantity, "notes": item.notes},
            )
            if not created:
                cart_item.quantity += item.quantity
                cart_item.save()
        return APIResponse.success(CartSerializer(cart).data, status=201)


class AdminOrderListView(APIView):
    permission_classes = [IsStaffRole]

    def get(self, request):
        qs = Order.objects.prefetch_related("items").order_by("-placed_at")
        status = request.query_params.get("status")
        if status:
            qs = qs.filter(status=status)
        return APIResponse.success(OrderListSerializer(qs[:100], many=True).data)


class AdminOrderDetailView(APIView):
    permission_classes = [IsStaffRole]

    def get(self, request, pk):
        order = Order.objects.prefetch_related("items", "status_history").get(pk=pk)
        return APIResponse.success(OrderDetailSerializer(order).data)


class AdminOrderStatusView(APIView):
    permission_classes = [IsStaffRole]

    def patch(self, request, pk):
        order = Order.objects.get(pk=pk)
        serializer = OrderStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data["status"]
        order.status = new_status
        if new_status == Order.Status.CONFIRMED:
            order.confirmed_at = timezone.now()
        elif new_status == Order.Status.PREPARING:
            order.prepared_at = timezone.now()
        elif new_status == Order.Status.DELIVERED:
            order.delivered_at = timezone.now()
        if "estimated_minutes" in serializer.validated_data:
            order.estimated_minutes = serializer.validated_data["estimated_minutes"]
        order.save()

        OrderStatusHistory.objects.create(
            order=order,
            status=new_status,
            note=serializer.validated_data.get("note", ""),
            changed_by=request.user,
        )

        return APIResponse.success(OrderDetailSerializer(order).data)
