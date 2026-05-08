from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSearchSerializer(serializers.ModelSerializer):
    """Lightweight serializer for searching users."""

    class Meta:
        model = User
        fields = ["id", "email", "first_name", "last_name", "avatar", "status_emoji"]
