"""API view to create a new conversation."""

from django.contrib.auth import get_user_model
from django.db.models import Count
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from chat.models import Conversation, Participant
from chat.serializers import ConversationCreateSerializer

User = get_user_model()


class ConversationCreateApiView(generics.CreateAPIView):
    """API view to create a new conversation."""

    serializer_class = ConversationCreateSerializer
    permission_classes = (IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        """Validate input, delegate to the right workflow, return a response."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        conversation, created = self._find_or_create(serializer.validated_data)

        response_serializer = self.get_serializer(conversation)
        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(response_serializer.data, status=status_code)

    def _find_or_create(self, validated_data):
        """Return (conversation, created). Dispatch to DM or group workflow."""
        is_group = validated_data.get("is_group", False)
        users_to_add = validated_data.get("users_to_add", [])

        if is_group:
            return self._create_group(validated_data, users_to_add), True

        return self._find_or_create_dm(users_to_add[0])

    def _find_or_create_dm(self, other_user):
        """Return (conversation, created) for a direct message."""
        current_user = self.request.user

        existing = (
            Conversation.objects.annotate(num_participants=Count("participants"))
            .filter(
                is_group=False,
                num_participants=2,
                participants__user=current_user,
            )
            .filter(participants__user=other_user)
            .first()
        )

        if existing:
            return existing, False  # ← 200 OK — already exists

        conversation = Conversation.objects.create(is_group=False)
        Participant.objects.create(user=current_user, conversation=conversation)
        Participant.objects.create(user=other_user, conversation=conversation)
        return conversation, True  # ← 201 Created

    def _create_group(self, validated_data, users_to_add):
        """Always create a new group conversation."""
        current_user = self.request.user
        name = validated_data.get("name", "").strip()

        conversation = Conversation.objects.create(is_group=True, name=name)
        Participant.objects.create(user=current_user, conversation=conversation)

        Participant.objects.bulk_create(
            [
                Participant(user=u, conversation=conversation)
                for u in users_to_add
                if u != current_user
            ]
        )

        return conversation
