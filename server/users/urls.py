"""URL configuration for the users app."""

from django.urls import path

from users import apis

urlpatterns = [
    path("register/", apis.register_user, name="register_user"),
    path("my-profile/", apis.my_profile, name="my_profile"),
]
