from django.urls import path

from apps.cms.views import TestimonialListView

urlpatterns = [
    path("", TestimonialListView.as_view(), name="testimonial-list"),
]
