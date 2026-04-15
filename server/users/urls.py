"""URL configuration for the users app."""

from django.urls import path

from users import apis

urlpatterns = [
    path("", apis.register_user, name="register_user"),
    path("me/", apis.get_current_user_info, name="my_profile"),
]
