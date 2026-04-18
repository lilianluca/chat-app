"""API endpoint for updating the current user's profile."""

import emoji
from djangorestframework_camel_case.parser import CamelCaseMultiPartParser
from rest_framework import serializers
from rest_framework.decorators import api_view, parser_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from users.services import update_user


class InputSerializer(serializers.Serializer):
    """Serializer for updating current user info."""

    first_name = serializers.CharField(max_length=50, required=False)
    last_name = serializers.CharField(max_length=50, required=False)
    avatar = serializers.ImageField(required=False)
    bio = serializers.CharField(required=False)
    status_emoji = serializers.CharField(max_length=14, required=False)

    def validate_status_emoji(self, value):
        """Validate that the status_emoji field contains at most one emoji character."""
        # If the value is empty or None, we can skip the emoji validation
        if not value:
            return value

        # Remove all emoji characters from the string and check if anything is left
        plain_text = emoji.replace_emoji(value, replace="").strip()
        if plain_text:
            raise serializers.ValidationError("status_emoji_must_be_an_emoji_character")

        # Check if there is more than one emoji character in the string
        if emoji.emoji_count(value) > 1:
            raise serializers.ValidationError(["only_one_emoji_allowed"])

        return value


class OutputSerializer(serializers.Serializer):
    """Serializer for the output of the update_current_user endpoint."""

    id = serializers.IntegerField()
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    avatar = serializers.ImageField()
    bio = serializers.CharField()
    status_emoji = serializers.CharField()


@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
@parser_classes([CamelCaseMultiPartParser])
def update_current_user(request: Request) -> Response:
    """Update the profile of the currently authenticated user."""
    input_serializer = InputSerializer(data=request.data)
    input_serializer.is_valid(raise_exception=True)

    updated_user = update_user(
        user_id=request.user.id, **input_serializer.validated_data
    )

    output_serializer = OutputSerializer(updated_user, context={"request": request})
    return Response(output_serializer.data)
