"""Service function to update a user's profile information."""

from django.db import transaction
from django.shortcuts import get_object_or_404

from users.models import User


@transaction.atomic
def update_user(*, user_id: int, **kwargs) -> User:
    """Update the specified fields of a user."""
    user = get_object_or_404(User.objects.select_for_update(), id=user_id)
    for field, value in kwargs.items():
        setattr(user, field, value)
    user.full_clean()
    user.save()
    return user
