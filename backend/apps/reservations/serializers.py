from rest_framework import serializers

from apps.reservations.models import Reservation, Table


class ReservationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ("guest_name", "guest_phone", "guest_email", "date", "time", "party_size", "special_requests")


class ReservationSerializer(serializers.ModelSerializer):
    table_label = serializers.CharField(source="table.label", read_only=True, default=None)
    status_label = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Reservation
        fields = (
            "id",
            "reservation_code",
            "guest_name",
            "guest_phone",
            "guest_email",
            "date",
            "time",
            "party_size",
            "special_requests",
            "status",
            "status_label",
            "table_id",
            "table_label",
            "created_at",
        )


class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = "__all__"
