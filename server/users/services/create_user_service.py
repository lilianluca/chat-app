"""Service for creating a new user."""

from core.utils import map_integrity_errors
from users.exceptions import UserAlreadyExists
from users.models import User

error_mapper = {
    "users_user_email_key": UserAlreadyExists,
}


def create_user(*, email: str, password: str) -> User:
    """Create a new user with the given email and password."""
    with map_integrity_errors(error_mapper):
        return User.objects.create_user(email=email, password=password)
