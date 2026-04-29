"""Serializers for the Message model."""

from rest_framework import serializers

from chat.models import Message
from chat.serializers import SimpleUserSerializer


class MessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""

    sender = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = ("id", "conversation", "sender", "text", "created_at")
        read_only_fields = ("id", "conversation", "sender", "created_at")
