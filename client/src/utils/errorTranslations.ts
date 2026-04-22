type TranslationMatrix = {
  general: Record<string, string>;
  [fieldName: string]: Record<string, string>;
};

export const ErrorTranslations: TranslationMatrix = {
  general: {},
  email: {
    unique: 'This email is already registered. Try logging in!',
  },
  password: {
    password_too_common: 'This password is too common. Please choose a stronger one.',
    password_entirely_numeric: 'This password is entirely numeric. Please choose a stronger one.',
  },
  confirmPassword: {},
};
