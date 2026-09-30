from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from apps.core.responses import APIResponse
from apps.notifications.models import Notification
from apps.notifications.serializers import NotificationSerializer


class NotificationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = Notification.objects.filter(user=request.user)[:50]
        return APIResponse.success(NotificationSerializer(qs, many=True).data)


class NotificationReadView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        notification = Notification.objects.get(pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return APIResponse.success({"read": True})
