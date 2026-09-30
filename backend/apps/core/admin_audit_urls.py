from django.urls import path

from apps.core.admin_audit_views import AuditLogListView

urlpatterns = [
    path("", AuditLogListView.as_view(), name="admin-audit-logs"),
]
