"""URL configuration for the users app."""

from django.urls import path

from users import apis

urlpatterns = [
    path("", apis.UserRegistrationApiView.as_view(), name="register_user"),
    path("me/", apis.UserProfileApiView.as_view(), name="my_profile"),
]
