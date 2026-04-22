"""URL configuration for the authentication app, defining endpoints related to user authentication and logout."""

from django.urls import path

from authentication import apis

urlpatterns = [
    path(
        "token/",
        apis.CookieTokenObtainPairApiView.as_view(),
        name="token_obtain_pair",
    ),
    path(
        "token/refresh/",
        apis.CookieTokenRefreshApiView.as_view(),
        name="token_refresh",
    ),
    path("logout/", apis.CookieLogoutApiView.as_view(), name="logout"),
]
