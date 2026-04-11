"""Custom user model."""

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from users.managers import CustomUserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model that uses email as the unique identifier for authentication."""

    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50, blank=True)
    last_name = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects: CustomUserManager = CustomUserManager()

    # Email is the unique identifier for authentication
    USERNAME_FIELD = "email"

    # No additional required fields besides email and password
    REQUIRED_FIELDS = []

    def __str__(self):
        """Return the email of the user as its string representation."""
        return self.email
