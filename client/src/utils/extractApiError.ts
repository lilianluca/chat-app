import { type ApiErrorBody, type ApiErrorResponse } from '@/types';
import { isAxiosError } from 'axios';

/**
 * Safely extracts the normalized Django error payload from any thrown error.
 */
export function extractApiError(error: unknown): ApiErrorBody {
  // If it's a nicely formatted Django Axios error
  if (isAxiosError<ApiErrorResponse>(error) && error.response?.data?.error) {
    return error.response.data.error;
  }

  // Fallback for network timeouts, CORS issues, or unexpected crashes
  return {
    code: 'network_error',
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    details: undefined,
  };
}
