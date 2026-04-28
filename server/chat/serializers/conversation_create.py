"""Serializer for creating a conversation."""

from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.exceptions import ErrorDetail

from chat.models import Conversation

User = get_user_model()


class ConversationCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating a conversation."""

    participant_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=True,
    )

    class Meta:
        model = Conversation
        fields = (
            "id",
            "is_group",
            "name",
            "participant_ids",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        """Validate the input data for creating a conversation."""
        is_group = attrs.get("is_group", False)
        name = attrs.get("name", "").strip()
        participant_ids = attrs.get("participant_ids", [])

        if not is_group and name:
            raise serializers.ValidationError(
                {
                    "name": [
                        ErrorDetail(
                            "Direct messages cannot have a name.",
                            code="invalid_dm_name",
                        )
                    ]
                }
            )

        unique_participant_ids = set(participant_ids)

        # Ensure users exist for the provided participant IDs
        users_to_add = list(User.objects.filter(id__in=participant_ids))
        if len(users_to_add) != len(unique_participant_ids):
            raise serializers.ValidationError(
                {
                    "participant_ids": [
                        ErrorDetail(
                            "No valid participants found with the provided IDs.",
                            code="invalid_participants",
                        )
                    ]
                }
            )

        # Enforce DM rules
        if not is_group and len(participant_ids) != 1:
            raise serializers.ValidationError(
                {
                    "participant_ids": [
                        ErrorDetail(
                            "Direct messages must have exactly one participant (the other user).",
                            code="invalid_dm_participants",
                        )
                    ]
                }
            )

        # Attach the resolved users to attrs so we don't have to query again in create()
        attrs["users_to_add"] = users_to_add
        return attrs
