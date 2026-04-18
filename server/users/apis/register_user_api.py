"""API endpoint for user registration."""

from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers, status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response

from users.models import User
from users.services import create_user


class InputSerializer(serializers.Serializer):
    """Serializer for user registration input."""

    email = serializers.EmailField()
    password = serializers.CharField()
    confirm_password = serializers.CharField()
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)

    def validate(self, attrs):
        """Run all object-level validation, including password checks."""
        errors = {}

        # Check if passwords match
        if attrs.get("password") != attrs.get("confirm_password"):
            errors["confirm_password"] = ["passwords_do_not_match"]

        # Check Django password validators
        if attrs.get("password"):
            # Create an in-memory, unsaved User object just for the validator
            dummy_user = User(
                email=attrs.get("email", ""),
                first_name=attrs.get("first_name", ""),
                last_name=attrs.get("last_name", ""),
            )

            try:
                # Pass the dummy_user so the SimilarityValidator can do its job
                password_validation.validate_password(
                    password=attrs.get("password"), user=dummy_user
                )
            except DjangoValidationError as e:
                # Extract the codes and attach them to the password field
                errors["password"] = [error.code for error in e.error_list]

        # If we caught ANY errors from the steps above, raise them all at once
        if errors:
            raise serializers.ValidationError(errors)

        return attrs


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def register_user(request: Request) -> Response:
    """Register a new user."""
    input_serializer = InputSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)
    create_user(
        email=input_serializer.validated_data["email"],
        password=input_serializer.validated_data["password"],
        first_name=input_serializer.validated_data["first_name"],
        last_name=input_serializer.validated_data["last_name"],
    )
    return Response(status=status.HTTP_201_CREATED)
