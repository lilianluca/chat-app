from django.db import models


class Conversation(models.Model):
    name = models.CharField(max_length=255, blank=True)
    # Distinguish between DMs and group chats
    is_group = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Conversation: {self.name} (Group: {self.is_group})"
