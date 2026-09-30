from django.urls import path

from apps.reservations.views import AdminReservationDetailView, AdminReservationListView

urlpatterns = [
    path("", AdminReservationListView.as_view(), name="admin-reservation-list"),
    path("<int:pk>/", AdminReservationDetailView.as_view(), name="admin-reservation-detail"),
]
