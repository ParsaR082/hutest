from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel


class Table(models.Model):
    label = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField()
    zone = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.label


class Reservation(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        CONFIRMED = "confirmed", "Confirmed"
        SEATED = "seated", "Seated"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"
        NO_SHOW = "no_show", "No Show"

    reservation_code = models.CharField(max_length=20, unique=True)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="reservations",
    )
    guest_name = models.CharField(max_length=200)
    guest_phone = models.CharField(max_length=20)
    guest_email = models.EmailField(blank=True)
    date = models.DateField()
    time = models.TimeField()
    party_size = models.PositiveIntegerField()
    special_requests = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    table = models.ForeignKey(Table, null=True, blank=True, on_delete=models.SET_NULL, related_name="reservations")
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancel_reason = models.TextField(blank=True)

    class Meta:
        ordering = ["date", "time"]
        indexes = [
            models.Index(fields=["date", "status"]),
            models.Index(fields=["guest_phone"]),
        ]

    def __str__(self):
        return self.reservation_code
