from django.urls import path

from apps.cms.views import NewsletterSubscribeView

urlpatterns = [
    path("subscribe/", NewsletterSubscribeView.as_view(), name="newsletter-subscribe"),
]
