"""API endpoint to handle user logout by clearing JWT tokens from cookies."""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken


class CookieLogoutView(APIView):
    """API endpoint to handle user logout by clearing JWT tokens from cookies."""

    def post(self, request):
        """Handle POST request to log out the user by clearing JWT tokens from cookies."""
        # Create a successful response object
        response = Response(
            {"message": "Successfully logged out."}, status=status.HTTP_200_OK
        )

        # Tell the browser to delete the cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")

        # Blacklist the refresh token if it exists to prevent reuse
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception:
            # If the token is already invalid or blacklisted, we don't care.
            # We still want the user to be successfully logged out on the frontend.
            pass

        return response
