from decouple import config

from .base import *  # noqa: F403

DEBUG = False

# Until a domain + TLS certificate are in place, the app is served over
# plain HTTP via the server IP. Flip SECURE_SSL_REDIRECT/HSTS on (and set
# these secure) once SSL is terminated in front of Django.
SECURE_SSL_REDIRECT = config("SECURE_SSL_REDIRECT", default=True, cast=bool)
SESSION_COOKIE_SECURE = config("SESSION_COOKIE_SECURE", default=True, cast=bool)
CSRF_COOKIE_SECURE = config("CSRF_COOKIE_SECURE", default=True, cast=bool)
SECURE_HSTS_SECONDS = config("SECURE_HSTS_SECONDS", default=31536000, cast=int)

# nginx forwards the original client scheme via X-Forwarded-Proto -- trust it
# so Django (behind plain-HTTP nginx/CDN proxying) correctly detects HTTPS
# requests for secure cookies, CSRF checks, and SECURE_SSL_REDIRECT.
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
