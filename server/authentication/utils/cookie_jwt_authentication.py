"""Custom JWT authentication class that checks for tokens in cookies."""

from rest_framework_simplejwt.authentication import JWTAuthentication


class CookieJWTAuthentication(JWTAuthentication):
    """Custom JWT authentication that looks for tokens in cookies."""

    def authenticate(self, request):
        """Authenticate the request by checking for JWT tokens in cookies."""
        # Try to get the token from the cookie first
        raw_token = request.COOKIES.get("access_token")

        # Fallback to the default header behavior (useful for Postman testing)
        if raw_token is None:
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)

        if raw_token is None:
            return None

        # Validate the token using Simple JWT's built-in methods
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
