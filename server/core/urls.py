"""URL configuration for the Django project."""

from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/users/", include("users.urls")),
    path("api/v1/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path(
        "api/v1/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"
    ),
]
