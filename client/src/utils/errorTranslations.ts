export const ErrorTranslations: Record<string, string> = {
  // General Errors
  user_already_exists: 'A user with this email already exists.',
  authentication_failed: 'Authentication failed. Please check your credentials and try again.',
  // Field-Specific Validation Errors
  password_too_similar:
    'Your password is too similar to your personal information. Please choose a more unique password.',
  password_too_short: 'Your password is too short. It must be at least 8 characters long.',
  password_too_common: 'Your password is too common. Please choose a more secure password.',
  password_entirely_numeric:
    'Your password cannot be entirely numeric. Please include letters or symbols.',
  passwords_do_not_match: 'The passwords you entered do not match. Please try again.',
};
