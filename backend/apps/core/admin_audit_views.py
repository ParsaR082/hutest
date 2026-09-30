from rest_framework.views import APIView

from apps.core.audit import AuditLog
from apps.core.permissions import IsAdminRole
from apps.core.responses import APIResponse


class AuditLogListView(APIView):
    permission_classes = [IsAdminRole]

    def get(self, request):
        logs = AuditLog.objects.select_related("actor")[:100]
        data = [
            {
                "id": log.id,
                "action": log.action,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "actor": log.actor.email if log.actor else None,
                "created_at": log.created_at.isoformat(),
            }
            for log in logs
        ]
        return APIResponse.success(data)
