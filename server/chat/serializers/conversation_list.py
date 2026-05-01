from rest_framework import serializers

from chat.models import Conversation

from .display_info import DisplayInfoSerializer
from .message import MessageSerializer


class ConversationListSerializer(serializers.ModelSerializer):
    """Serializer for listing conversations."""

    display_info = serializers.SerializerMethodField()
    latest_message = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = (
            "id",
            "is_group",
            "display_info",
            "latest_message",
            "unread_count",
            "updated_at",
        )

    def get_display_info(self, obj):
        """Determine the display info for the conversation."""
        request = self.context.get("request")
        raw_data = {
            "name": "Empty Chat",
            "short_name": "EC",
            "status_emoji": "",
            "avatar": None,
        }

        # If it's a group with a name, return it
        if obj.is_group:
            raw_data = {
                "name": obj.name or "Unnamed Group",
                "short_name": obj.name[:2].upper() if obj.name else "UG",
                "status_emoji": "",
                "avatar": None,  # TODO: We can add group avatars later!
            }
        elif request and request.user.is_authenticated:
            # For direct messages, find the other participant
            other_participants = obj.participants.exclude(user=request.user)
            if other_participants.exists():
                other_user = other_participants.first().user

                avatar_url = None
                if getattr(other_user, "avatar", None):
                    avatar_url = request.build_absolute_uri(other_user.avatar.url)

                short_name = (
                    f"{other_user.first_name[0]}{other_user.last_name[0]}".upper()
                    if other_user.first_name and other_user.last_name
                    else "DM"
                )
                status_emoji = other_user.status_emoji

                raw_data = {
                    "name": f"{other_user.first_name} {other_user.last_name}".strip(),
                    "short_name": short_name,
                    "status_emoji": status_emoji,
                    "avatar": avatar_url,
                }

        return DisplayInfoSerializer(raw_data).data

    def get_latest_message(self, obj):
        """Get the latest message for the conversation."""
        latest = obj.messages.first()
        if latest:
            return MessageSerializer(latest).data
        return None

    def get_unread_count(self, obj):
        """Calculate the number of unread messages for the current user."""
        # TODO: Placeholder for now, we will add the logic to compare `last_read_at` later!
        return 1
