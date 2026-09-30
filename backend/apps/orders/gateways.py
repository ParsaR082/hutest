"""
Pluggable payment gateway, same pattern as EMAIL_BACKEND / SMS_BACKEND.

Default is MockGateway (default/sandbox) which completes payments
immediately so checkout is fully testable end-to-end without a real PSP
account. Switch to a real Iranian gateway (ZarinPal, IDPay, etc. -- all of
which settle through Shaparak, the interbank card switch) by setting
PAYMENT_GATEWAY and the provider's merchant credentials once a provider is
chosen.
"""

from __future__ import annotations

import json
import urllib.error
import urllib.request
import uuid

from django.conf import settings


class GatewayError(Exception):
    pass


class BasePaymentGateway:
    def initiate(self, payment) -> dict:
        """Start a payment. Returns {"redirect_url": str, "authority": str}."""
        raise NotImplementedError

    def verify(self, payment, params: dict) -> bool:
        """Verify a callback and return True if payment succeeded."""
        raise NotImplementedError


class MockGateway(BasePaymentGateway):
    """Sandbox gateway: auto-succeeds so the full order->pay->confirm flow
    is genuinely testable without any third-party PSP account. This is the
    default gateway until real Shaparak-connected merchant credentials are
    configured."""

    def initiate(self, payment) -> dict:
        authority = f"MOCK-{uuid.uuid4().hex[:16].upper()}"
        payment.gateway_ref = authority
        payment.save(update_fields=["gateway_ref"])
        return {
            "redirect_url": f"/checkout/pay/mock/{authority}/",
            "authority": authority,
        }

    def verify(self, payment, params: dict) -> bool:
        return payment.gateway_ref == params.get("authority") and params.get("status") != "cancelled"


class ZarinPalGateway(BasePaymentGateway):
    """ZarinPal (https://zarinpal.com), a common Iranian PSP that settles
    through Shaparak, the interbank card switch. Requires ZARINPAL_MERCHANT_ID
    (and ZARINPAL_CALLBACK_URL) to be configured server-side before this
    gateway can be selected via PAYMENT_GATEWAY=zarinpal."""

    TIMEOUT_SECONDS = 15

    @property
    def _base_url(self) -> str:
        return "https://sandbox.zarinpal.com" if settings.ZARINPAL_SANDBOX else "https://api.zarinpal.com"

    @property
    def _startpay_base_url(self) -> str:
        return "https://sandbox.zarinpal.com" if settings.ZARINPAL_SANDBOX else "https://www.zarinpal.com"

    def _post_json(self, url: str, payload: dict) -> dict:
        data = json.dumps(payload).encode("utf-8")
        request = urllib.request.Request(
            url,
            data=data,
            method="POST",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=self.TIMEOUT_SECONDS) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.URLError as exc:
            raise GatewayError("Failed to reach the payment gateway.") from exc
        except json.JSONDecodeError as exc:
            raise GatewayError("Invalid response from the payment gateway.") from exc

    def initiate(self, payment) -> dict:
        if not settings.ZARINPAL_MERCHANT_ID:
            raise GatewayError(
                "ZarinPalGateway is not configured. Set ZARINPAL_MERCHANT_ID before "
                "using PAYMENT_GATEWAY=zarinpal."
            )
        if not settings.ZARINPAL_CALLBACK_URL:
            raise GatewayError(
                "ZarinPalGateway is not configured. Set ZARINPAL_CALLBACK_URL before "
                "using PAYMENT_GATEWAY=zarinpal."
            )

        body = self._post_json(
            f"{self._base_url}/pg/v4/payment/request.json",
            {
                "merchant_id": settings.ZARINPAL_MERCHANT_ID,
                # ZarinPal's v4 API expects the amount in Rial; amounts are stored in Toman.
                "amount": payment.amount * 10,
                "callback_url": settings.ZARINPAL_CALLBACK_URL,
                "description": f"سفارش #{payment.order_id} - رستوران هومزد",
            },
        )

        data = body.get("data") or {}
        if data.get("code") != 100 or not data.get("authority"):
            errors = body.get("errors") or data
            raise GatewayError(f"ZarinPal rejected the payment request: {errors}")

        authority = data["authority"]
        payment.gateway_ref = authority
        payment.save(update_fields=["gateway_ref"])
        return {
            "redirect_url": f"{self._startpay_base_url}/pg/StartPay/{authority}",
            "authority": authority,
        }

    def verify(self, payment, params: dict) -> bool:
        if params.get("status", params.get("Status", "")).upper() == "NOK":
            return False

        body = self._post_json(
            f"{self._base_url}/pg/v4/payment/verify.json",
            {
                "merchant_id": settings.ZARINPAL_MERCHANT_ID,
                "amount": payment.amount * 10,
                "authority": payment.gateway_ref,
            },
        )

        data = body.get("data") or {}
        # 100 = verified now, 101 = already verified earlier -- both are success.
        return data.get("code") in (100, 101)


def get_gateway() -> BasePaymentGateway:
    name = getattr(settings, "PAYMENT_GATEWAY", "mock")
    if name == "zarinpal":
        return ZarinPalGateway()
    return MockGateway()
