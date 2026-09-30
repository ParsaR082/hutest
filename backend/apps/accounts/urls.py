from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    LogoutView,
    RegisterView,
    RequestOTPView,
    VerifyOTPView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("token/", CustomTokenObtainPairView.as_view(), name="token-obtain"),
    path("token/refresh/", CustomTokenRefreshView.as_view(), name="token-refresh"),
    path("logout/", LogoutView.as_view(), name="auth-logout"),
    path("otp/request/", RequestOTPView.as_view(), name="otp-request"),
    path("otp/verify/", VerifyOTPView.as_view(), name="otp-verify"),
]
