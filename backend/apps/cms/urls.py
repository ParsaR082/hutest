from django.urls import path

from apps.cms.views import PublicSettingsView

urlpatterns = [
    path("public/", PublicSettingsView.as_view(), name="settings-public"),
]
