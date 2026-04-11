class ApplicationError(Exception):
    """Base class for application-specific exceptions."""

    # Default attributes for all application errors
    default_code = "error"
    default_message = "An error occurred."
    default_status_code = 400

    def __init__(
        self,
        code: str | None = None,
        message: str | None = None,
        status_code: int | None = None,
    ):
        """Initialize the application error with an optional code and message."""
        self.message = message if message is not None else self.default_message
        self.code = code if code is not None else self.default_code
        self.status_code = (
            status_code if status_code is not None else self.default_status_code
        )

        super().__init__(self.message)
