"""Custom Channels middleware to authenticate WebSocket connections using JWTs stored in HTTP-Only cookies."""

from http import cookies

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()


@database_sync_to_async
def get_user_from_token(validated_token):
    """Safely fetch the user from the database."""
    try:
        # SimpleJWT defaults to putting the user's ID in the 'user_id' claim
        user_id = validated_token.get("user_id")
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JWTAuthCookieMiddleware(BaseMiddleware):
    """Custom middleware to extract the 'access_token' HTTP-Only cookie.

    decode the JWT, and attach the User to the WebSocket scope.
    """

    async def __call__(self, scope, receive, send):
        """Override the call method to perform JWT authentication using cookies."""
        # Default to anonymous
        scope["user"] = AnonymousUser()

        # Extract headers from the ASGI scope
        headers = dict(scope.get("headers", []))

        # Find the cookie header
        cookie_header = headers.get(b"cookie", b"").decode("utf-8")

        if cookie_header:
            # Parse the cookie string
            parsed_cookies = cookies.SimpleCookie()
            parsed_cookies.load(cookie_header)

            # Look for our specific 'access_token' cookie
            if "access_token" in parsed_cookies:
                token_key = parsed_cookies["access_token"].value
                try:
                    # Validate the JWT using SimpleJWT
                    validated_token = AccessToken(token_key)

                    # Fetch the user and attach it to the scope!
                    scope["user"] = await get_user_from_token(validated_token)
                except TokenError:
                    # Token is expired or invalid
                    pass
                except Exception as e:
                    print(f"WebSocket Auth Error: {e}")

        # Continue the connection process
        return await super().__call__(scope, receive, send)
