"""URL configuration for the auth app, defining endpoints related to user authentication and logout."""

from django.urls import path

from auth import apis

urlpatterns = [
    path(
        "token/",
        apis.CookieTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "token/refresh/",
        apis.CookieTokenRefreshView.as_view(),
        name="token_refresh",
    ),
    path("logout/", apis.CookieLogoutView.as_view(), name="logout"),
]
