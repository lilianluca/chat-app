import { type UseFormSetError, type FieldValues, type Path } from 'react-hook-form';
import { extractApiError } from './extractApiError';
import { ErrorTranslations } from './errorTranslations';

export const handleFormErrors = <T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fallbackField: 'root' | Path<T> = 'root',
) => {
  const apiError = extractApiError(error);

  // Handle Global Errors
  if (apiError.code !== 'validation_error') {
    // Look up the translation using the code, fallback to the backend message
    const localizedMessage = ErrorTranslations[apiError.code] || apiError.message;

    setError(fallbackField as Path<T>, {
      type: 'server',
      message: localizedMessage,
    });
    return;
  }

  // Handle Field-Specific Validation Errors
  if (apiError.details) {
    Object.entries(apiError.details).forEach(([field, messages]) => {
      // Map over the array of messages and translate each one!
      const localizedMessages = messages.map((msgCode) => {
        return ErrorTranslations[msgCode] || msgCode; // Fallback to raw string if no translation
      });

      setError(field as Path<T>, {
        type: 'server',
        message: localizedMessages[0],
      });
    });
  }
};
