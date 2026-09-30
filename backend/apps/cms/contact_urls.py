from django.urls import path

from apps.cms.views import ContactSubmissionView

urlpatterns = [
    path("", ContactSubmissionView.as_view(), name="contact-submit"),
]
