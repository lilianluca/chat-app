"""API view to refresh JWT access token using refresh token from cookies."""

from django.conf import settings
from rest_framework_simplejwt.views import TokenRefreshView


class CookieTokenRefreshApiView(TokenRefreshView):
    """View to refresh JWT access token using refresh token from cookies."""

    def post(self, request, *args, **kwargs):
        """Handle POST request to refresh access token using refresh token from cookies."""
        # Simple JWT's refresh view expects the refresh token in the request body.
        # We need to manually inject it from the cookies before calling super()
        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            request.data["refresh"] = refresh_token

        # Call the original post method to get the new access token
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            access_token = response.data.get("access")

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
            )

            # If your settings rotate refresh tokens, update that cookie too
            if "refresh" in response.data:
                response.set_cookie(
                    key="refresh_token",
                    value=response.data.get("refresh"),
                    httponly=True,
                    secure=not settings.DEBUG,
                    samesite="Lax",
                )
                del response.data["refresh"]

            del response.data["access"]
            response.data["message"] = "Refresh successful"

        return response
