from datetime import timedelta

from django.db.models import Count, Sum
from django.utils import timezone
from rest_framework.views import APIView

from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse
from apps.menu.serializers import format_toman
from apps.orders.models import Order
from apps.reservations.models import Reservation


class AdminReportsSummaryView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        days = min(int(request.query_params.get("days", 30)), 90)
        start = timezone.now().date() - timedelta(days=days - 1)

        orders_qs = Order.objects.filter(placed_at__date__gte=start)
        delivered = orders_qs.filter(status=Order.Status.DELIVERED)

        total_revenue = delivered.aggregate(total=Sum("total"))["total"] or 0
        total_orders = orders_qs.count()
        total_reservations = Reservation.objects.filter(date__gte=start).count()

        orders_by_status = list(
            orders_qs.values("status")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        daily_revenue = []
        for i in range(days):
            day = start + timedelta(days=i)
            day_total = (
                Order.objects.filter(
                    placed_at__date=day,
                    status=Order.Status.DELIVERED,
                ).aggregate(s=Sum("total"))["s"]
                or 0
            )
            daily_revenue.append({"date": day.isoformat(), "revenue": day_total})

        reservations_by_status = list(
            Reservation.objects.filter(date__gte=start)
            .values("status")
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        return APIResponse.success(
            {
                "period_days": days,
                "total_revenue": total_revenue,
                "total_revenue_display": format_toman(total_revenue),
                "total_orders": total_orders,
                "total_reservations": total_reservations,
                "orders_by_status": orders_by_status,
                "reservations_by_status": reservations_by_status,
                "daily_revenue": daily_revenue,
            }
        )
