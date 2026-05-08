"""ASGI configuration for the chat application."""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter, URLRouter  # noqa: E402

import chat.routing  # noqa: E402
from chat.middlewares import JWTAuthCookieMiddleware  # noqa: E402

application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,  # Handle traditional HTTP requests
        "websocket": JWTAuthCookieMiddleware(
            URLRouter(chat.routing.websocket_urlpatterns)
        ),  # Handle WebSocket connections with authentication
    }
)
