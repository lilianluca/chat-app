from core.exceptions import ApplicationError


class UserAlreadyExists(ApplicationError):
    """Exception raised when trying to create a user that already exists."""

    default_code = "USER_ALREADY_EXISTS"
    default_message = "A user with this email already exists."
    default_status_code = 409
