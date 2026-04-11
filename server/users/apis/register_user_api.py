"""API endpoint for user registration."""

from rest_framework import serializers, status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response

from users.services import create_user


class InputSerializer(serializers.Serializer):
    """Serializer for user registration input."""

    email = serializers.EmailField()
    password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField()

    def validate_password(self, value):
        """Validate that the password meets complexity requirements."""
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one digit."
            )
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one letter."
            )
        if not any(char in "!@#$%^&*,.?/" for char in value):
            raise serializers.ValidationError(
                "Password must contain at least one special character."
            )
        return value

    def validate(self, data):
        """Validate that password and confirm_password match."""
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError(
                {"confirm_password": "Password and confirm password do not match."}
            )
        return data


@api_view(["POST"])
def register_user(request: Request) -> Response:
    """Register a new user."""
    input_serializer = InputSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    create_user(
        email=input_serializer.validated_data["email"],
        password=input_serializer.validated_data["password"],
    )
    return Response(status=status.HTTP_201_CREATED)
