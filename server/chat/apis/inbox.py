"""API view to list conversations for the authenticated user."""

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from chat.models import Conversation
from chat.serializers import ConversationListSerializer


class InboxApiView(generics.ListAPIView):
    """API view to list conversations for the authenticated user."""

    serializer_class = ConversationListSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        """Get conversations that the authenticated user is a participant of."""
        user = self.request.user
        return (
            Conversation.objects.filter(participants__user=user)
            .prefetch_related(
                "messages__sender",
                "participants__user",
            )
            .distinct()
        )
