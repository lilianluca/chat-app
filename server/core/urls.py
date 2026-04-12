"""URL configuration for the Django project."""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/auth/", include("auth.urls")),
    path("api/v1/users/", include("users.urls")),
]
