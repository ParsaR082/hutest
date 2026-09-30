from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework.views import APIView

from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse
from apps.orders.models import Order
from apps.reservations.models import Reservation

User = get_user_model()


class AdminDashboardStatsView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        today = timezone.now().date()
        yesterday = today - timedelta(days=1)

        orders_today = Order.objects.filter(placed_at__date=today)
        orders_yesterday = Order.objects.filter(placed_at__date=yesterday)

        revenue_today = orders_today.filter(status=Order.Status.DELIVERED).aggregate(
            total=Sum("total")
        )["total"] or 0
        revenue_yesterday = orders_yesterday.filter(status=Order.Status.DELIVERED).aggregate(
            total=Sum("total")
        )["total"] or 0

        def pct_change(current, previous):
            if previous == 0:
                return 100 if current > 0 else 0
            return round(((current - previous) / previous) * 100, 1)

        return APIResponse.success(
            {
                "revenue_today": revenue_today,
                "revenue_change_pct": pct_change(revenue_today, revenue_yesterday),
                "orders_today": orders_today.count(),
                "orders_change_pct": pct_change(orders_today.count(), orders_yesterday.count()),
                "reservations_today": Reservation.objects.filter(date=today).count(),
                "new_customers_today": User.objects.filter(
                    role=User.Role.CUSTOMER, date_joined__date=today
                ).count(),
                "pending_orders": Order.objects.filter(status=Order.Status.PENDING).count(),
                "avg_order_value": orders_today.aggregate(avg=Sum("total"))["avg"] or 0,
            }
        )


class AdminDashboardChartsView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        days = int(request.query_params.get("days", 7))
        start = timezone.now().date() - timedelta(days=days - 1)
        revenue_data = []
        for i in range(days):
            day = start + timedelta(days=i)
            total = (
                Order.objects.filter(placed_at__date=day, status=Order.Status.DELIVERED).aggregate(
                    s=Sum("total")
                )["s"]
                or 0
            )
            revenue_data.append({"date": day.isoformat(), "revenue": total})

        popular = (
            Order.objects.filter(placed_at__date__gte=start)
            .values("items__name")
            .annotate(count=Count("items"))
            .order_by("-count")[:10]
        )

        return APIResponse.success(
            {
                "revenue": revenue_data,
                "popular_dishes": list(popular),
            }
        )
