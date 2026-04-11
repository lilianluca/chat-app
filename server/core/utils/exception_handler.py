"""Custom exception handler for the API."""

from rest_framework.response import Response
from rest_framework.views import exception_handler

from core.exceptions import ApplicationError


def custom_exception_handler(exc, context):
    """Custom exception handler that returns a consistent error response format."""
    # Call REST framework's default exception handler first to get the standard error response.
    response = exception_handler(exc, context)

    if response is None and isinstance(exc, ApplicationError):
        response = Response(
            data={"error": {"code": exc.code, "message": exc.message, "details": None}},
            status=exc.status_code,
        )
        return response

    # If an exception is handled by the default handler, we can customize the response data.
    if response is not None:
        # Customize the response data to include a consistent error format.
        custom_data = {
            "error": {
                "code": getattr(exc, "default_code", "error"),
                "message": "An error occurred.",
                "details": None,
            }
        }

        # If the response data is a dictionary, we can include it in the details.
        if isinstance(response.data, dict):
            # If the default handler included a "detail" key, we can use that as the error message.
            if "detail" in response.data:
                custom_data["error"]["message"] = response.data["detail"]
            else:
                # If there are field-specific errors, we can include those in the details.
                custom_data["error"]["message"] = "Validation error."
                custom_data["error"]["code"] = "VALIDATION_ERROR"
                custom_data["error"]["details"] = response.data

        # If the response data is a list (e.g., for non-field errors), we can include that in the details as well.
        elif isinstance(response.data, list):
            custom_data["error"]["message"] = str(response.data[0])
            custom_data["error"]["details"] = {"non_field_errors": response.data}

        # Replace the original response data with our custom error format.
        response.data = custom_data

    return response
