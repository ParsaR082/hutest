from django.conf import settings
from django.db import models


class LoyaltyTransaction(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="loyalty_transactions",
    )
    points = models.IntegerField()
    reason = models.CharField(max_length=200)
    order = models.ForeignKey(
        "orders.Order",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
