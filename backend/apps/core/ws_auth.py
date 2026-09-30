"""Minimal JWT auth for Django Channels websocket connections.

SimpleJWT ships an AuthMiddlewareStack-compatible helper for cookie/session
auth, but this project authenticates over a bearer token the frontend holds
in memory, not a session cookie -- so the token is passed as a `token` query
parameter on the websocket URL instead, and validated here the same way DRF's
JWTAuthentication would validate an Authorization header.
"""

from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


@database_sync_to_async
def _get_user_from_token(raw_token: str):
    from django.contrib.auth import get_user_model

    try:
        validated = AccessToken(raw_token)
        user_id = validated["user_id"]
    except (InvalidToken, TokenError, KeyError):
        return AnonymousUser()

    User = get_user_model()
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode("utf-8")
        token = parse_qs(query_string).get("token", [None])[0]
        scope["user"] = await _get_user_from_token(token) if token else AnonymousUser()
        return await super().__call__(scope, receive, send)
