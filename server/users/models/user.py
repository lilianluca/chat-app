from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from users.managers import CustomUserManager


def get_user_directory_path(instance, filename):
    """Generate file path for user avatar uploads."""
    return f"avatars/user_{instance.id}/{filename}"


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    avatar = models.ImageField(upload_to=get_user_directory_path, blank=True)
    bio = models.TextField(blank=True)
    status_emoji = models.CharField(max_length=14, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    # Email is the unique identifier for authentication
    USERNAME_FIELD = "email"

    # No additional required fields besides email and password
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return self.email
