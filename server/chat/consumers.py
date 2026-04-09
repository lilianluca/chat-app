"""Chat consumers for handling WebSocket connections and messages."""

import json

from channels.generic.websocket import AsyncWebsocketConsumer


class ChatConsumer(AsyncWebsocketConsumer):
    """Consumer for handling WebSocket connections and messages in the chat application."""

    async def connect(self):
        """Handle a new WebSocket connection."""
        self.root_group_name = "chat_main_root"

        # Join the room group
        await self.channel_layer.group_add(self.root_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """Handle a WebSocket disconnection."""
        # Leave the room group
        await self.channel_layer.group_discard(self.root_group_name, self.channel_name)

    # Receive message from WebSocket
    async def receive(self, text_data):
        """Handle a message received from the WebSocket."""
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        # Send message to room group
        await self.channel_layer.group_send(
            self.root_group_name,
            {
                "type": "chat.message",
                "message": message,
            },
        )

    # Receive message from room group
    async def chat_message(self, event):
        """Handle a message received from the room group."""
        message = event["message"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
