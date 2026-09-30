from django.urls import path

from apps.cms.views import AdminContactListView

urlpatterns = [
    path("", AdminContactListView.as_view(), name="admin-contacts"),
]
