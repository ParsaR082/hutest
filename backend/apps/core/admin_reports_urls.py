from django.urls import path

from apps.core.admin_reports_views import AdminReportsSummaryView

urlpatterns = [
    path("summary/", AdminReportsSummaryView.as_view(), name="admin-reports-summary"),
]
