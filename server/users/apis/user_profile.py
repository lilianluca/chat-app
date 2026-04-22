"""API endpoint for retrieving the profile of the currently authenticated user."""

import emoji
from django.contrib.auth import get_user_model
from rest_framework import generics, serializers
from rest_framework.permissions import IsAuthenticated

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for reading and updating the current user's profile information."""

    avatar = serializers.ImageField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "bio",
            "status_emoji",
            "joined_at",
            "updated_at",
        )
        read_only_fields = ("id", "email", "joined_at", "updated_at")

    def validate_status_emoji(self, value):
        """Validate that the status_emoji field contains at most one emoji character."""
        # If the value is empty or None, we can skip the emoji validation
        if not value:
            return value

        # Remove all emoji characters from the string and check if anything is left
        plain_text = emoji.replace_emoji(value, replace="").strip()
        if plain_text:
            raise serializers.ValidationError(
                detail="The status_emoji field must contain only emoji characters.",
                code="status_emoji_must_be_an_emoji_character",
            )

        # Check if there is more than one emoji character in the string
        if emoji.emoji_count(value) > 1:
            raise serializers.ValidationError(
                detail="You can only use one emoji character for your status.",
                code="only_one_emoji_allowed",
            )

        return value


class UserProfileApiView(generics.RetrieveUpdateAPIView):
    """API view for retrieving and updating the current user's profile information."""

    serializer_class = UserProfileSerializer
    permission_classes = (IsAuthenticated,)

    def get_object(self):
        """Return the current authenticated user."""
        return self.request.user
