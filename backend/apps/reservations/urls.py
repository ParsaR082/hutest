from django.urls import path

from apps.reservations.views import (
    ReservationAvailabilityView,
    ReservationCreateView,
    UserReservationDetailView,
    UserReservationListView,
    UserUpcomingReservationView,
)

urlpatterns = [
    path("", ReservationCreateView.as_view(), name="reservation-create"),
    path("list/", UserReservationListView.as_view(), name="reservation-list"),
    path("upcoming/", UserUpcomingReservationView.as_view(), name="reservation-upcoming"),
    path("availability/", ReservationAvailabilityView.as_view(), name="reservation-availability"),
    path("<int:pk>/", UserReservationDetailView.as_view(), name="reservation-detail"),
]
