"""
Pluggable SMS delivery, same pattern as Django's EMAIL_BACKEND.

Default is the console backend (logs the code instead of sending a real
SMS) so OTP login works end-to-end in any environment without a paid SMS
provider account. Switch to a real backend by setting SMS_BACKEND and the
provider's API key once a provider (Kavenegar, Ghasedak, etc.) is chosen.
"""

import json
import logging
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings

logger = logging.getLogger("humazd.sms")


class SMSDeliveryError(Exception):
    """Raised when an SMS provider fails to accept/send a message."""


class BaseSMSBackend:
    def send(self, phone: str, message: str) -> None:
        raise NotImplementedError


class ConsoleSMSBackend(BaseSMSBackend):
    """Logs the message instead of sending it. Safe default for every environment
    until a real SMS provider is configured."""

    def send(self, phone: str, message: str) -> None:
        logger.info("SMS to %s: %s", phone, message)
        print(f"[SMS to {phone}] {message}")  # noqa: T201 -- intentional dev-visible output


class KavenegarSMSBackend(BaseSMSBackend):
    """Sends SMS via the Kavenegar REST API (https://kavenegar.com).

    Requires KAVENEGAR_API_KEY (and optionally KAVENEGAR_SENDER, a verified
    sender line) to be set server-side via environment variables -- never
    exposed to the frontend/API responses."""

    API_URL = "https://api.kavenegar.com/v1/{api_key}/sms/send.json"
    TIMEOUT_SECONDS = 10

    def send(self, phone: str, message: str) -> None:
        api_key = getattr(settings, "KAVENEGAR_API_KEY", "")
        if not api_key:
            raise SMSDeliveryError(
                "KAVENEGAR_API_KEY is not configured. Set it in the server "
                "environment before using SMS_BACKEND=kavenegar."
            )

        sender = getattr(settings, "KAVENEGAR_SENDER", "")
        params = {"receptor": phone, "message": message}
        if sender:
            params["sender"] = sender

        url = self.API_URL.format(api_key=api_key)
        data = urllib.parse.urlencode(params).encode("utf-8")

        try:
            request = urllib.request.Request(url, data=data, method="POST")
            with urllib.request.urlopen(request, timeout=self.TIMEOUT_SECONDS) as response:
                body = json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            # Kavenegar returns its actual error message in the response body
            # even on non-2xx statuses (e.g. 402 no credit, 412 unverified
            # sender) -- read it instead of discarding it.
            try:
                error_body = json.loads(exc.read().decode("utf-8"))
                message_text = error_body.get("return", {}).get("message", str(exc))
            except (json.JSONDecodeError, AttributeError):
                message_text = str(exc)
            logger.error("Kavenegar SMS rejected for %s: HTTP %s - %s", phone, exc.code, message_text)
            raise SMSDeliveryError(f"SMS provider rejected the message: {message_text}") from exc
        except urllib.error.URLError as exc:
            logger.error("Kavenegar SMS request failed for %s: %s", phone, exc)
            raise SMSDeliveryError("Failed to reach the SMS provider.") from exc
        except json.JSONDecodeError as exc:
            logger.error("Kavenegar SMS returned an unparseable response for %s", phone)
            raise SMSDeliveryError("Invalid response from the SMS provider.") from exc

        status = body.get("return", {}).get("status")
        if status != 200:
            message_text = body.get("return", {}).get("message", "unknown error")
            logger.error("Kavenegar SMS rejected for %s: %s (%s)", phone, message_text, status)
            raise SMSDeliveryError(f"SMS provider rejected the message: {message_text}")


def get_sms_backend() -> BaseSMSBackend:
    backend = getattr(settings, "SMS_BACKEND", "console")
    if backend == "kavenegar":
        return KavenegarSMSBackend()
    return ConsoleSMSBackend()


def send_otp_sms(phone: str, code: str) -> None:
    get_sms_backend().send(phone, f"کد ورود شما به Humazd: {code}")
