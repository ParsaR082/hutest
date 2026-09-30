from rest_framework.permissions import AllowAny
from rest_framework.views import APIView

from apps.core.responses import APIResponse


class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return APIResponse.success({"status": "ok", "service": "humazd-api"})
