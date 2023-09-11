import { AVAILABLE_LANGUAGES } from '@ga/shared/constants/language';

export const isLanguageAvailable = (language: string): boolean =>
  AVAILABLE_LANGUAGES.some(
    (availableLanguage) => availableLanguage.id === language
  );
