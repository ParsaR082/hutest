from django.urls import path

from apps.cms.views import AdminTestimonialListView

urlpatterns = [
    path("", AdminTestimonialListView.as_view(), name="admin-testimonials"),
]
