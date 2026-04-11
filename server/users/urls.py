"""URL configuration for the users app."""

from django.urls import path

from users.apis import register_user

urlpatterns = [
    path("register/", register_user, name="register_user"),
]
