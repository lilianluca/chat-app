"""URL configuration for the chat app."""

from django.urls import path

from chat import apis

urlpatterns = [
    path("inbox/", apis.InboxApiView.as_view(), name="inbox"),
    path(
        "conversations/",
        apis.ConversationCreateApiView.as_view(),
        name="conversation-create",
    ),
    path(
        "conversations/<int:conversation_id>/messages/",
        apis.MessageListApiView.as_view(),
        name="message-list",
    ),
]
