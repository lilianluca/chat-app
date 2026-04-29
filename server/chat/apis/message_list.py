"""API view to retrieve the message history for a specific conversation."""

from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework.pagination import CursorPagination
from rest_framework.permissions import IsAuthenticated

from chat.models import Conversation, Message
from chat.serializers import MessageSerializer


class MessagePagination(CursorPagination):
    """Custom pagination class for messages, using cursor-based pagination."""

    page_size = 20
    ordering = "-created_at"  # Newest messages first


class MessageListApiView(generics.ListAPIView):
    """API view to retrieve the message history for a specific conversation."""

    serializer_class = MessageSerializer
    permission_classes = (IsAuthenticated,)
    pagination_class = MessagePagination

    def get_queryset(self):
        """Get messages for the specified conversation, ensuring the user is a participant."""
        # Grab the conversation ID from the URL parameters
        conversation_id = self.kwargs.get("conversation_id")
        user = self.request.user

        # Ensure the user is actually a participant in this room
        # If the conversation doesn't exist, or they aren't in it, throw a 404.
        conversation = get_object_or_404(
            Conversation, id=conversation_id, participants__user=user
        )

        return Message.objects.filter(conversation=conversation).select_related(
            "sender"
        )
