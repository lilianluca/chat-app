"""API view to obtain JWT token pair and set them in cookies."""

from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView


class CookieTokenObtainPairView(TokenObtainPairView):
    """View to obtain JWT token pair and set them in cookies."""

    def post(self, request, *args, **kwargs):
        """Handle POST request to obtain token pair and set them in cookies."""
        # Call the original post method to get the token pair
        response = super().post(request, *args, **kwargs)

        # If the token pair was successfully obtained, set them in cookies
        if response.status_code == 200:
            access_token = response.data.get("access")
            refresh_token = response.data.get("refresh")

            # Set the HTTP-Only cookies
            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=not settings.DEBUG,  # True in prod (HTTPS), False in dev (HTTP)
                samesite="Lax",  # Protects against CSRF
            )
            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,  # True in prod (HTTPS), False in dev (HTTP)
                samesite="Lax",  # Protects against CSRF
            )
            # Remove tokens from the JSON body so they can't be stolen via XSS
            del response.data["access"]
            del response.data["refresh"]
            response.data["message"] = "Login successful"

        return response
