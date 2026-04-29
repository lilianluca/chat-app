"""Chat consumers for handling WebSocket connections and messages."""

import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model

from chat.models import Conversation, Message, Participant

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    """Handles WebSocket connections for a chat conversation."""

    async def connect(self):
        """Fires when a React client attempts to open a WebSocket connection."""
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"
        self.user = self.scope["user"]

        # Check authentication
        if not self.user.is_authenticated:
            await self.close()
            return

        # Check if the user is a participant in the conversation
        is_participant = await self.check_participant(self.user, self.conversation_id)
        if not is_participant:
            await self.close()
            return

        # Join the Channel Group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)

        # Accept the connection
        await self.accept()

    async def disconnect(self, close_code):
        """Fires when the user leaves the page or loses connection."""
        # Leave the Channel Group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """Fires when React sends a JSON payload through the WebSocket."""
        text_data_json = json.loads(text_data)
        message_text = text_data_json["text"]

        # Save the message to the database
        new_message = await self.save_message(
            self.user, self.conversation_id, message_text
        )

        # Broadcast the message to everyone in the room!
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",  # This calls the method below
                "message": {
                    "id": new_message.id,
                    "text": new_message.text,
                    "created_at": new_message.created_at.isoformat(),
                    "sender": {
                        "id": self.user.id,
                        "first_name": self.user.first_name,
                        "last_name": self.user.last_name,
                        # Add avatar URL here if needed
                    },
                },
            },
        )

    async def chat_message(self, event):
        """Fires when a broadcast is received from the channel layer. Sends data down to React."""
        message = event["message"]

        # Send JSON down the WebSocket to the React frontend
        await self.send(text_data=json.dumps({"message": message}))

    @database_sync_to_async
    def check_participant(self, user, conversation_id):
        """Check if the user is a participant in the conversation."""
        return Participant.objects.filter(
            user=user, conversation_id=conversation_id
        ).exists()

    @database_sync_to_async
    def save_message(self, user, conversation_id, text):
        """Save the message to the database."""
        conversation = Conversation.objects.get(id=conversation_id)
        return Message.objects.create(sender=user, conversation=conversation, text=text)
