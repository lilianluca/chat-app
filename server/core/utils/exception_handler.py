"""Custom exception handler for the API."""

from rest_framework.exceptions import ErrorDetail
from rest_framework.response import Response
from rest_framework.views import exception_handler

from core.exceptions import ApplicationError


def _format_error_details(data):
    """Recursively traverse the error data and unpack DRF's ErrorDetail objects into standard dictionaries containing both the message and the code."""
    if isinstance(data, dict):
        return {key: _format_error_details(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [_format_error_details(item) for item in data]
    elif isinstance(data, ErrorDetail):
        return {"message": str(data), "code": data.code}
    else:
        return str(data)


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
        custom_data = {
            "error": {
                # Fallback code
                "code": getattr(exc, "default_code", "error"),
                "message": "An error occurred.",
                "details": None,
            }
        }

        # If the response data is a dictionary, we can include it in the details.
        if isinstance(response.data, dict):
            # Non-validation errors (e.g., 401 Unauthorized, 403 Forbidden) usually just have a 'detail' key
            if "detail" in response.data:
                error_detail = response.data["detail"]
                custom_data["error"]["message"] = str(error_detail)

                # Extract the code directly if it's an ErrorDetail
                if isinstance(error_detail, ErrorDetail):
                    custom_data["error"]["code"] = error_detail.code
            else:
                # Field-specific validation errors (e.g., 400 Bad Request)
                custom_data["error"]["message"] = "Validation error."
                custom_data["error"]["code"] = "validation_error"

                # Pass the raw data through our recursive formatter!
                custom_data["error"]["details"] = _format_error_details(response.data)

        # If the response data is a list (e.g., for some edge-case non-field errors)
        elif isinstance(response.data, list):
            custom_data["error"]["message"] = str(response.data[0])
            custom_data["error"]["details"] = {
                "non_field_errors": _format_error_details(response.data)
            }

        # Replace the original response data with our custom error format.
        response.data = custom_data

    return response
