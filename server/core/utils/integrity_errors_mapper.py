"""Utility to map database integrity errors to application-specific exceptions."""

from contextlib import contextmanager

from django.db import IntegrityError, transaction


@contextmanager
def map_integrity_errors(exception_mapping: dict):
    """Context manager to map database integrity errors to application-specific exceptions.

    Args:
        exception_mapping (dict): A mapping of database constraint names to application-specific exceptions.

    Usage:
        error_mapper = {
            "users_user_email_key": UserAlreadyExists,
        }
    """
    try:
        with transaction.atomic():
            yield
    except IntegrityError as e:
        original_exc = (
            e.__cause__
        )  # Get the original exception that caused the IntegrityError
        diag = getattr(
            original_exc, "diag", None
        )  # Get the diagnostic information from the original exception, if available

        if diag:
            # The constraint name is typically available in the diagnostic information for database errors. We can use this to determine which specific integrity constraint was violated.
            constraint_name = getattr(diag, "constraint_name", None)
            # If the constraint name is in our mapping, we can raise the corresponding application-specific exception.
            if constraint_name and constraint_name in exception_mapping:
                raise exception_mapping[constraint_name] from e

        # If we can't map the integrity error to a specific application exception, we can re-raise the original IntegrityError so that it can be handled by the default error handling mechanism.
        raise
