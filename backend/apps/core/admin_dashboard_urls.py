from django.urls import path

from apps.core.admin_dashboard_views import AdminDashboardChartsView, AdminDashboardStatsView

urlpatterns = [
    path("stats/", AdminDashboardStatsView.as_view(), name="admin-dashboard-stats"),
    path("charts/", AdminDashboardChartsView.as_view(), name="admin-dashboard-charts"),
]
