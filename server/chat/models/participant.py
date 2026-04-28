from django.conf import settings
from django.db import models


class Participant(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="participations",
    )
    conversation = models.ForeignKey(
        "Conversation", on_delete=models.CASCADE, related_name="participants"
    )
    joined_at = models.DateTimeField(auto_now_add=True)
    # Whether the participant has muted the conversation
    is_muted = models.BooleanField(default=False)
    # Track unread messages
    last_read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # A user can only be a participant in a specific conversation once
        unique_together = ("user", "conversation")

    def __str__(self):
        return f"{self.user.email} in Conversation {self.conversation.name}"
