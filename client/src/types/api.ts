import type { AxiosError } from 'axios';

/**
 * Represents the field-specific validation errors.
 * Example: { "password": ["This field is required."] }
 */
type ApiErrorDetails = Record<string, string[]>;

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
