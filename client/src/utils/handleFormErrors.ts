import { type UseFormSetError, type FieldValues, type Path } from 'react-hook-form';
import { extractApiError } from './extractApiError';
import { ErrorTranslations } from './errorTranslations';

export const handleFormErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fallbackField: 'root' | Path<T> = 'root',
) => {
  const apiError = extractApiError(error);

  // Handle Global Errors (e.g., 401 Unauthorized, 500 Server Error)
  if (apiError.code !== 'validation_error') {
    // Look up in the 'general' bucket, fallback to the backend message
    const localizedMessage = ErrorTranslations.general[apiError.code] || apiError.message;

    setError(fallbackField as Path<T>, {
      type: 'server',
      message: localizedMessage,
    });
    return;
  }

  // Handle Field-Specific Validation Errors
  if (apiError.details) {
    Object.entries(apiError.details).forEach(([field, fieldErrors]) => {
      // Safely grab the first error object in the array
      const firstError = fieldErrors[0];

      if (firstError) {
        // The 3-Step Matrix Lookup
        const localizedMessage =
          ErrorTranslations[field]?.[firstError.code] || // 1. Field-specific (email.unique)
          ErrorTranslations.general[firstError.code] || // 2. Generic fallback (general.unique)
          firstError.message; // 3. Backend fallback string

        setError(field as Path<T>, {
          type: 'server',
          message: localizedMessage,
        });
      }
    });
  }
};
