import re

from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from apps.accounts.models import OTPCode, User
from apps.accounts.serializers import RegisterSerializer, UserProfileSerializer
from apps.core.responses import APIResponse
from apps.core.sms import SMSDeliveryError, send_otp_sms


def normalize_phone(raw: str) -> str:
    digits = re.sub(r"\D", "", raw or "")
    if digits.startswith("98"):
        digits = "0" + digits[2:]
    if digits.startswith("9") and len(digits) == 10:
        digits = "0" + digits
    return digits


class RequestOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "otp_request"

    def post(self, request):
        phone = normalize_phone(request.data.get("phone", ""))
        if not re.fullmatch(r"09\d{9}", phone):
            return APIResponse.error("INVALID_PHONE", "شماره موبایل معتبر نیست.", status=400)

        recent = (
            OTPCode.objects.filter(phone=phone)
            .order_by("-created_at")
            .first()
        )
        if recent and (timezone.now() - recent.created_at).total_seconds() < OTPCode.RESEND_COOLDOWN_SECONDS:
            wait = OTPCode.RESEND_COOLDOWN_SECONDS - int((timezone.now() - recent.created_at).total_seconds())
            return APIResponse.error(
                "COOLDOWN", f"لطفاً {wait} ثانیه دیگر دوباره تلاش کنید.", status=429
            )

        otp = OTPCode.generate(phone)
        try:
            send_otp_sms(phone, otp.code)
        except SMSDeliveryError:
            otp.delete()
            return APIResponse.error("SMS_FAILED", "ارسال پیامک ناموفق بود. لطفاً دوباره تلاش کنید.", status=502)
        payload = {"phone": phone, "expires_in": OTPCode.OTP_TTL_SECONDS}
        if getattr(settings, "DEBUG", False) and getattr(settings, "SMS_BACKEND", "console") == "console":
            payload["debug_code"] = otp.code
        return APIResponse.success(payload)


class VerifyOTPView(APIView):
    permission_classes = [AllowAny]
    throttle_scope = "otp_verify"

    def post(self, request):
        phone = normalize_phone(request.data.get("phone", ""))
        code = str(request.data.get("code", "")).strip()

        otp = (
            OTPCode.objects.filter(phone=phone, is_used=False)
            .order_by("-created_at")
            .first()
        )
        if not otp:
            return APIResponse.error("NO_ACTIVE_CODE", "کد فعالی برای این شماره یافت نشد.", status=400)
        if otp.is_expired:
            return APIResponse.error("EXPIRED", "کد منقضی شده است. دوباره درخواست دهید.", status=400)
        if otp.attempts >= OTPCode.MAX_ATTEMPTS:
            return APIResponse.error("TOO_MANY_ATTEMPTS", "تعداد تلاش‌های مجاز به پایان رسید.", status=429)

        otp.attempts += 1
        otp.save(update_fields=["attempts"])

        if otp.code != code:
            return APIResponse.error("INVALID_CODE", "کد وارد شده صحیح نیست.", status=400)

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        user, created = User.objects.get_or_create(
            phone=phone,
            defaults={"username": phone, "role": User.Role.CUSTOMER},
        )
        if not user.phone_verified:
            user.phone_verified = timezone.now()
            user.save(update_fields=["phone_verified"])

        refresh = RefreshToken.for_user(user)
        return APIResponse.success(
            {
                "user": UserProfileSerializer(user).data,
                "tokens": {"access": str(refresh.access_token), "refresh": str(refresh)},
                "created": created,
            }
        )


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return APIResponse.success(
            {
                "user": UserProfileSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception:
                pass
        return APIResponse.success({"message": "Logged out successfully."})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return APIResponse.success(UserProfileSerializer(request.user).data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return APIResponse.success(serializer.data)


class CustomTokenObtainPairView(TokenObtainPairView):
    throttle_scope = "token_login"

    def post(self, request, *args, **kwargs):
        from django.contrib.auth import get_user_model

        User = get_user_model()
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            identifier = request.data.get("username") or request.data.get("email")
            user = User.objects.filter(username=identifier).first()
            if user is None:
                user = User.objects.filter(email=identifier).first()
            payload = {"tokens": response.data}
            if user:
                payload["user"] = UserProfileSerializer(user).data
            return APIResponse.success(payload)
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            return APIResponse.success({"tokens": response.data})
        return response
