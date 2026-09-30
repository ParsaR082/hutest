from rest_framework import serializers

from apps.notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "body", "notification_type", "is_read", "link", "created_at")
