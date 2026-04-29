"""Serializer for listing conversations in the conversation list view."""

from rest_framework import serializers

from chat.models import Conversation
from chat.serializers import MessageSerializer


class ConversationListSerializer(serializers.ModelSerializer):
    """Serializer for listing conversations."""

    display_name = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = (
            "id",
            "is_group",
            "display_name",
            "latest_message",
            "unread_count",
            "updated_at",
        )

    def get_display_name(self, obj):
        """Determine the display name for the conversation."""
        # If it's a group with a name, return it
        if obj.is_group and obj.name:
            return obj.name

        # Otherwise, figure out who the "other" person is
        request = self.context.get("request")
        if not request or not request.user.is_authenticated:
            return "Chat"

        # Find participants that are NOT the current user
        other_participants = obj.participants.exclude(user=request.user)

        if other_participants.exists():
            # For 1-on-1, just return the other person's name
            first_other = other_participants.first().user
            return f"{first_other.first_name} {first_other.last_name}"
        return "Empty Chat"

    def get_latest_message(self, obj):
        """Get the latest message for the conversation."""
        latest = obj.messages.first()
        if latest:
            return MessageSerializer(latest).data
        return None

    def get_unread_count(self, obj):
        """Calculate the number of unread messages for the current user."""
        # TODO: Placeholder for now, we will add the logic to compare `last_read_at` later!
        return 0
