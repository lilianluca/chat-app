import type { AxiosError } from 'axios';

type FieldError = {
  message: string;
  code: string;
};

/**
 * Represents the field-specific validation errors.
 * Example: { "password": [{"message": "This field is required.", "code": "unique"}] }
 */
type ApiErrorDetails = Record<string, FieldError[]>;

/**
 * The inner body of the error response.
 */
export interface ApiErrorBody {
  code: string;
  message: string;
  details?: ApiErrorDetails; // Optional because not all errors are validation errors
}

/**
 * The top-level error response from the backend.
 */
export interface ApiErrorResponse {
  error: ApiErrorBody;
}

/**
 * Represents an API error, extending the AxiosError with a typed response.
 */
export type ApiError = AxiosError<ApiErrorResponse>;

/**
 * Represents a cursor paginated response.
 * `next` and `previous` are URLs to the next/previous page, or null when unavailable.
 */
export interface PaginatedResponse<T> {
  next: string | null;
  previous: string | null;
  results: T[];
}
