from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.core.permissions import IsManagerRole
from apps.core.responses import APIResponse
from apps.reservations.models import Reservation, Table
from apps.reservations.serializers import ReservationCreateSerializer, ReservationSerializer, TableSerializer
from apps.reservations.services import generate_reservation_code


class ReservationCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ReservationCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        reservation = serializer.save(
            reservation_code=generate_reservation_code(),
            user=request.user if request.user.is_authenticated else None,
            status=Reservation.Status.PENDING,
        )
        return APIResponse.success(ReservationSerializer(reservation).data, status=201)


class ReservationAvailabilityView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        date = request.query_params.get("date")
        party_size = int(request.query_params.get("party_size", 2))
        tables = Table.objects.filter(is_active=True, capacity__gte=party_size)
        booked_table_ids = Reservation.objects.filter(
            date=date,
            status__in=[Reservation.Status.PENDING, Reservation.Status.CONFIRMED, Reservation.Status.SEATED],
        ).values_list("table_id", flat=True)
        available = tables.exclude(id__in=booked_table_ids)
        return APIResponse.success(
            {
                "available": available.exists(),
                "tables_count": available.count(),
            }
        )


class UserReservationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Reservation.objects.filter(user=request.user).select_related("table")
        return APIResponse.success(ReservationSerializer(qs, many=True).data)


class UserUpcomingReservationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        today = timezone.now().date()
        reservation = (
            Reservation.objects.filter(user=request.user, date__gte=today)
            .exclude(status=Reservation.Status.CANCELLED)
            .select_related("table")
            .order_by("date", "time")
            .first()
        )
        if not reservation:
            return APIResponse.success(None)
        return APIResponse.success(ReservationSerializer(reservation).data)


class UserReservationDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        reservation = Reservation.objects.get(pk=pk, user=request.user)
        if reservation.status != Reservation.Status.PENDING:
            return APIResponse.error("INVALID_STATUS", "Only pending reservations can be modified.", status=400)
        serializer = ReservationCreateSerializer(reservation, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return APIResponse.success(ReservationSerializer(reservation).data)

    def delete(self, request, pk):
        reservation = Reservation.objects.get(pk=pk, user=request.user)
        reservation.status = Reservation.Status.CANCELLED
        reservation.cancelled_at = timezone.now()
        reservation.save()
        return APIResponse.success({"cancelled": True})


class AdminReservationListView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        qs = Reservation.objects.select_related("table").order_by("-date", "-time")
        return APIResponse.success(ReservationSerializer(qs, many=True).data)


class AdminReservationDetailView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request, pk):
        reservation = Reservation.objects.select_related("table").get(pk=pk)
        return APIResponse.success(ReservationSerializer(reservation).data)

    def patch(self, request, pk):
        reservation = Reservation.objects.get(pk=pk)
        status = request.data.get("status")
        table_id = request.data.get("table_id")
        if status:
            reservation.status = status
            if status == Reservation.Status.CONFIRMED:
                reservation.confirmed_at = timezone.now()
        if table_id:
            reservation.table_id = table_id
        reservation.save()
        return APIResponse.success(ReservationSerializer(reservation).data)


class AdminTableListCreateView(APIView):
    permission_classes = [IsManagerRole]

    def get(self, request):
        return APIResponse.success(TableSerializer(Table.objects.all(), many=True).data)

    def post(self, request):
        serializer = TableSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return APIResponse.success(serializer.data, status=201)
