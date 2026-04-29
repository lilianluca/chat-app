from django.conf import settings
from django.db import models


class Message(models.Model):
    conversation = models.ForeignKey(
        "Conversation", on_delete=models.CASCADE, related_name="messages"
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="messages_sent",
    )
    text = models.TextField()
    # We index created_at for efficient retrieval of recent messages in a conversation
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]  # Default to newest first

    def __str__(self):
        return f"Msg {self.id} by {self.sender.email}"
