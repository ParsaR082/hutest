from django.urls import path

from apps.cms.views import AdminSettingsView

urlpatterns = [
    path("", AdminSettingsView.as_view(), name="admin-settings"),
]
