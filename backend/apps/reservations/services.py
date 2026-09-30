from django.db.models import Max

from apps.reservations.models import Reservation


def generate_reservation_code() -> str:
    last = Reservation.objects.aggregate(max_num=Max("id"))["max_num"] or 0
    return f"RES-{last + 1:04d}"
